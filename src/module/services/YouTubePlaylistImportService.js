import { YoutubePlaylistItem } from '../models/YoutubePlaylistItem';
import Logger from '../helper/Utils';


//private consts & funcs
const playerId = 'bellows-playlist-player';
let player;

function createPlayer(playlistId) {
	if (player != null) {
		throw 'Player already exists';
	}
	$('body').append(`<div style="display: hidden;"><div id="${playerId}"></div></div>`);
	
	player = new YT.Player(playerId, {
		width: '480px',
		height: '270px',
		playerVars: {
			listType:'playlist',
			list: playlistId
		}
	});
}

function cleanupPlayer() {
	//Always clean up all traces of the player
	if (player != null) {
		player.destroy();
		player = null;
	}
	
	$(`#${playerId}`).parent().remove();
}

export class YouTubePlaylistImportService {
	
	extractPlaylistKey(playlistString) {
		//YouTube url (any string with a list querystring var)
		//No reliable regex lookbehind for all browsers yet, so we'll just get the first capture group instead
		const urlRegEx = /list\=([a-zA-Z0-9_-]+)/
		//Plain playlist key
		const keyRegEx = /^[a-zA-Z0-9_-]+$/
		
		if (!playlistString || playlistString.length === 0) {
			return;
		}
		
		var matches = urlRegEx.exec(playlistString);
		if (matches) {
			return matches[1];
		} else {
			return playlistString.match(keyRegEx)[0];
		}
	}
	
	async getPlaylistInfo(playlistKey) {
		return new Promise((resolve, reject) => {
			
			if (playlistKey == null) {
				reject('Empty playlist key');
				return;
			}
			
			/*
			*This is not too elegant as the YouTubeApi/YouTubePlayer classes are quite tightly coupled with playing sounds for Foundry, which we're not interested in doing.
			*We can get around this somewhat by creating our own YT.Player and ignoring the YouTubePlayer class altogether
			*Will probably need refactoring later.
			*/
			let api = getApi('youtube');
			if (!api || !api.isReady()) {
				//this should never really happen. The API is created during Foundry init.
				Logger.LogError("Unable to extract playlist info - API not ready");
				reject('API not ready');
				return;
			}	
			
			try {
				createPlayer(playlistKey);
			} 
			catch (ex) {
				reject(ex);
				return;
			}
			
			player.addEventListener('onReady', async (e) => {
				let player = e.target;
				try {
					var videos = await this.scrapeVideoNames(player);
					resolve(videos);
				}
				catch (ex) {
					Logger.LogError("Error scraping youtube iframe: " + ex);
					reject(ex);
				}
				finally {
					cleanupPlayer();
					return;
				}
			});
			
			player.addEventListener('onError', e => {
				Logger.LogError("YT Player errored with code: " + e.data);
				reject("YT player error: " + e.data);
				cleanupPlayer();
				return;
			});
		});
	}
	
	async createFoundryVTTPlaylist(playlistName, trackList, volume) {
		return new Promise(async (resolve, reject) => {
			if (!playlistName || Object.prototype.toString.call(playlistName) !== "[object String]") {
				reject("Enter playlist name");
			}
			
			try {
				let playlist = await Playlist.create({
					"name": playlistName,
					"shuffle": false
				});
				
				let realVolume = AudioHelper.inputToVolume(volume);
				let playlistSounds = [];
				//videos: Arr of {id, title}
				for (let i=0; i < trackList.length; i++) {
					playlistSounds.push({
						name: trackList[i].title,
						lvolume: volume,
						volume: realVolume,
						path: 'invalid.mp3',
						repeat: false,
						flags: {
							bIsStreamed: true,
							streamingApi: 'youtube',
							streamingId: trackList[i].id
						}
					});
				}
				
				await playlist.createEmbeddedDocuments("PlaylistSound", playlistSounds);
				resolve();
			} catch (ex) {
				reject(ex);
			}
		});
	}

	async scrapeVideoNames(player) {
		return new Promise(async (resolve, reject) => {
			
			if (!player.getPlaylist()) {
				reject('Invalid Playlist');
				return;
			}
			
			let scrapedTracks = [];
			
			for (let f = 0; f < 3; f++) {
				try {
					await this.getTrack(player, 0);
					break;
				} catch(ex) {
					Logger.LogDebug(`getNextTrack timed out, retrying...`);
					if (f == 2) {
						reject(ex);
						return;
					}
				}
			}
			
			for (let i=0; i < player.getPlaylist().length; i++) {
				
				await this.getTrack(player, i);
				
				let data = player.getVideoData();
				scrapedTracks.push({
					id: data.video_id,
					title: data.title
				});
			}
			
			resolve(scrapedTracks);
		});
	}
	
	async getTrack(player, idx) {
		let playNextVideo = new Promise((resolve) => {
			player.addEventListener('onStateChange', e => {
				if (e.data == -1) {
					e.target.removeEventListener('onStateChange');
					resolve(e.data);
				}
			});
			player.playVideoAt(idx);
		});
		
		let timeout = new Promise((resolve, reject) => {
			let id = setTimeout(() => {
				clearTimeout(id);
				reject('timed out');
			}, 1000);
		});
		
		return Promise.race([
			playNextVideo,
			timeout
		]);
	}
}
