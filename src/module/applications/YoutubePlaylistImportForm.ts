import { YoutubePlaylistItem } from "../../types/YoutubePlaylistItem.js";
import { Logger } from "../../utils.js";
import { YouTubePlaylistImportService } from "../services/YouTubePlaylistImportService.js";

export class YoutubePlaylistImportForm extends FormApplication<any, any, any> {

  private _working: boolean;
  private _playlistItems: YoutubePlaylistItem[];
  private _youtubePlaylistImportService: YouTubePlaylistImportService;

  constructor(object, options) {
    options.height = "auto";
    super(object, options);
    this._working = false;
    this._playlistItems = [];
    this._youtubePlaylistImportService = new YouTubePlaylistImportService();
  }
  
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      title: game.i18n.localize("bellows.import-yt-playlist-nav-text"),
      template: "/modules/bellows/templates/apps/import-youtube-playlist.html"
    } as FormApplication.Options);
  }
  
  activateListeners(html) {
    super.activateListeners(html);
    
    html.find("button[id='bellows-yt-import-btn-import']").on("click", (e) => this._onImport.call(this, e));
    html.find
  }
  
  getData() {
    return {
      working: this._working,
      playlistItems: this._playlistItems
    };
  }

  private async importPlaylist(playlistStr) {
    let key = this._youtubePlaylistImportService.extractPlaylistKey(playlistStr);
    
    if (!key) {
      ui.notifications?.error(game.i18n.localize("bellows.import-yt-playlist-msg-invalid-key"));
      return;
    }

    try {
      this._playlistItems = await this._youtubePlaylistImportService.getPlaylistInfo(key);
    } catch(ex) {
      if (ex == "Invalid Playlist") {
        ui.notifications?.error(game.i18n.format("bellows.import-yt-playlist-msg-key-not-found", {playlistKey: key}));
      } else {
        ui.notifications?.error(game.i18n.localize("bellows.import-yt-playlist-msg-error"));
        Logger.Log(ex);
      }
    }
  }

  async _onImport(e) {
    if (this._working) {
      ui.notifications?.error(game.i18n.localize("bellows.import-yt-playlist-msg-already-working"));
      return;
    }

    this._working = true;
    this._playlistItems = [];

    const button = $(e.currentTarget);
    const playlistUri = button.siblings("input[id='bellows-yt-import-url-text").val();
    
    await this.rerender();
    
    await this.importPlaylist(playlistUri);
    this._working = false;
    
    await this.rerender();
  }
  
  private async rerender() {
    await this._render(false);
    this.setPosition();
  }
  
  async _updateObject(_e, formData) {
    try {
      await this._youtubePlaylistImportService.createFoundryVTTPlaylist(formData.playlistname, this._playlistItems, formData.playlistvolume);
      ui.notifications?.info(game.i18n.format("bellows.import-yt-playlist-msg-imported", {playlistName: formData.playlistname}));
    } catch (ex) {
      Logger.Log(ex);
      ui.notifications?.error(game.i18n.localize("bellows.import-yt-playlist-msg-error"));
    }
  }
}
