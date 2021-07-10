import { PlayerState } from "../../../types/streaming/youtube";
import { YoutubePlaylistItem } from "../../models/YoutubePlaylistItem";
import Logger from "../../helper/Utils";
import { YoutubeIframeApi } from "../../api/YoutubeIframeApi";
import { StreamType } from "../../../types/streaming/streamType";

export class YouTubePlaylistImportService {

	private _player: YT.Player | undefined;

	extractPlaylistKey(playlistString) {
		//YouTube url (any string with a list querystring var)
		//No reliable regex lookbehind for all browsers yet, so we'll just get the first capture group instead
		const urlRegEx = /list=([a-zA-Z0-9_-]+)/
		//Plain playlist key
		const keyRegEx = /^[a-zA-Z0-9_-]+$/

		if (!playlistString || playlistString.length === 0) {
			return;
		}

		const matches = urlRegEx.exec(playlistString);
		if (matches) {
			return matches[1];
		} else {
			return playlistString.match(keyRegEx)[0];
		}
	}

	async getPlaylistInfo(playlistKey): Promise<YoutubePlaylistItem[]> {

		if (!playlistKey) {
			throw new Error("Empty playlist key");
		}

		const api = YoutubeIframeApi.getInstance();

		this._player = await api.createPlaylistPlayer(-1, playlistKey);

		try {
			return await this.scrapeVideoNames();
		} finally {
			api.destroyPlayer(-1, playlistKey);
			this._player = undefined;
		}
	}

	async createFoundryVTTPlaylist(playlistName, trackList, volume): Promise<void> {
		if (!playlistName || Object.prototype.toString.call(playlistName) !== "[object String]") {
			throw new Error("Enter playlist name");
		}

		const playlist = await Playlist.create({
			"name": playlistName,
			"shuffle": false
		});

		const realVolume = AudioHelper.inputToVolume(volume);
		const playlistSounds: Record<string, unknown>[] = [];
		//videos: Arr of {id, title}
		for (let i = 0; i < trackList.length; i++) {
			playlistSounds.push({
				name: trackList[i].title,
				lvolume: volume,
				volume: realVolume,
				path: "streamed.mp3",
				repeat: false,
				flags: {
					bIsStreamed: true,
					streamingApi: StreamType.youtube,
					streamingId: trackList[i].id
				}
			});
		}

		await playlist?.createEmbeddedEntity("PlaylistSound", playlistSounds);
	}

	async scrapeVideoNames(): Promise<YoutubePlaylistItem[]> {
		if (!this._player?.getPlaylist()) {
			throw new Error("Invalid Playlist");
		}

		const scrapedTracks: YoutubePlaylistItem[] = [];

		for (let f = 0; f < 3; f++) {
			try {
				await this.getTrack(0);
				break;
			} catch (ex) {
				if (f == 2) {
					throw ex;
				}
				Logger.LogDebug(`getNextTrack timed out, retrying...`);
			}
		}

		for (let i = 0; i < this._player.getPlaylist().length; i++) {

			await this.getTrack(i);

			//@ts-ignore -- getvideodata missing in yt types
			const data = this._player.getVideoData();
			scrapedTracks.push({
				id: data.video_id,
				title: data.title
			});
		}

		return scrapedTracks;
	}

	async getTrack(idx) {
		const playVideo = new Promise((resolve) => {

			this._player?.addEventListener<YT.OnStateChangeEvent>("onStateChange", e => {
				if (e.data as unknown as PlayerState == PlayerState.UNSTARTED) {
					//@ts-ignore -- missing from yt types
					e.target.removeEventListener("onStateChange");
					resolve(e.data);
				}
			});

			this._player?.playVideoAt(idx);
		});

		const timeout = new Promise((_resolve, reject) => {
			const id = setTimeout(() => {
				clearTimeout(id);
				reject("timed out");
			}, 1000);
		});

		return Promise.race([
			playVideo,
			timeout
		]);
	}
}
