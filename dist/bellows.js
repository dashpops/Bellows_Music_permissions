/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/module/api/YoutubeIframeApi.ts":
/*!********************************************!*\
  !*** ./src/module/api/YoutubeIframeApi.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "YoutubeIframeApi": () => (/* binding */ YoutubeIframeApi)
/* harmony export */ });
/* harmony import */ var _helper_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helper/Utils */ "./src/module/helper/Utils.ts");

class YoutubeIframeApi {
    constructor() {
        this.playersMap = new Map();
    }
    static async initializeApi() {
        if (YoutubeIframeApi.instance) {
            throw new Error("Cannot initialize YoutubeIframeApi more than once!");
        }
        return new Promise((resolve) => {
            var _a;
            window.onYouTubeIframeAPIReady = function () {
                YoutubeIframeApi.instance = new YoutubeIframeApi();
                _helper_Utils__WEBPACK_IMPORTED_MODULE_0__.Logger.LogDebug("YoutubeIframeApi successfully initialized");
                resolve();
            };
            if (!$("#yt-api-script").length) {
                const tag = document.createElement("script");
                tag.id = "yt-api-script";
                tag.src = "https://www.youtube.com/iframe_api";
                tag.type = "text/javascript";
                const firstScriptTag = document.getElementsByTagName("script")[0];
                (_a = firstScriptTag.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(tag, firstScriptTag);
                _helper_Utils__WEBPACK_IMPORTED_MODULE_0__.Logger.LogDebug("Downloading YoutubeIframeApi...");
            }
        });
    }
    static getInstance() {
        if (!YoutubeIframeApi.instance) {
            throw new Error("Tried to get YoutubeIframeApi before initialization!");
        }
        return this.instance;
    }
    getPlayer(containerId, videoId) {
        const playerId = this.getIdString(containerId, videoId);
        return this.playersMap.get(playerId);
    }
    async createPlayer(containerId, videoId) {
        const playerId = this.getIdString(containerId, videoId);
        if (this.playersMap.has(playerId)) {
            throw new Error("Player already exists for this audio container!");
        }
        return new Promise((resolve, reject) => {
            const onPlayerError = function (event) {
                let errorMessage;
                switch (event.data) {
                    case YT.PlayerError.InvalidParam:
                        errorMessage = "Invalid videoId value.";
                        break;
                    case YT.PlayerError.Html5Error:
                        errorMessage = "The requested content cannot be played in an HTML5 player or another error related to the HTML5 player has occurred.";
                        break;
                    case YT.PlayerError.VideoNotFound:
                        errorMessage = "Video not found; It may have been deleted or marked as private.";
                        break;
                    case YT.PlayerError.EmbeddingNotAllowed:
                    case YT.PlayerError.EmbeddingNotAllowed2:
                        errorMessage = "Embedding is not supported for this video.";
                        break;
                    default:
                        errorMessage = "Unspecified Error";
                }
                reject(errorMessage);
            };
            const onPlayerReadyCallback = function () {
                this.playersMap.set(playerId, player);
                //This class only handles initial errors before onReady. Container's responsibility to deal with these after.
                player.removeEventListener("onError", onPlayerError);
                resolve(player);
            };
            $("body").append(`<div class="yt-player" id="${playerId}"></div>`);
            const player = new YT.Player(playerId, {
                height: "270px",
                width: "480px",
                videoId: videoId,
                events: {
                    "onReady": onPlayerReadyCallback,
                    "onError": onPlayerError
                }
            });
        });
    }
    async destroyPlayer(containerId, videoId) {
        const playerId = this.getIdString(containerId, videoId);
        const player = this.playersMap.get(playerId);
        if (!player) {
            throw new Error("Player does not exist!");
        }
        if (player.getPlayerState() === YT.PlayerState.PLAYING) {
            player.stopVideo();
        }
        this.playersMap.delete(playerId);
        player.destroy();
        $(`div#${playerId}`).remove();
    }
    getIdString(containerId, videoId) {
        return `bellows-yt-iframe-${containerId}-${videoId}`;
    }
}


/***/ }),

/***/ "./src/module/applications/YoutubePlaylistImportForm.ts":
/*!**************************************************************!*\
  !*** ./src/module/applications/YoutubePlaylistImportForm.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "YoutubePlaylistImportForm": () => (/* binding */ YoutubePlaylistImportForm)
/* harmony export */ });
/* harmony import */ var _helper_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helper/Utils */ "./src/module/helper/Utils.ts");
/* harmony import */ var _services_YouTubePlaylistImportService__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/YouTubePlaylistImportService */ "./src/module/services/YouTubePlaylistImportService.js");


class YoutubePlaylistImportForm extends FormApplication {
    constructor(object, options) {
        options.height = "auto";
        super(object, options);
        this._working = false;
        this._playlistItems = [];
        this._youtubePlaylistImportService = new _services_YouTubePlaylistImportService__WEBPACK_IMPORTED_MODULE_1__.YouTubePlaylistImportService();
    }
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            title: game.i18n.localize("bellows.import-yt-playlist-nav-text"),
            template: "/modules/bellows/templates/apps/import-youtube-playlist.html"
        });
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.find("button[id='bellows-yt-import-btn-import']").on("click", (e) => this._onImport.call(this, e));
        html.find;
    }
    getData() {
        return {
            working: this._working,
            playlistItems: this._playlistItems
        };
    }
    async importPlaylist(playlistStr) {
        var _a, _b, _c;
        const key = this._youtubePlaylistImportService.extractPlaylistKey(playlistStr);
        if (!key) {
            (_a = ui.notifications) === null || _a === void 0 ? void 0 : _a.error(game.i18n.localize("bellows.import-yt-playlist-msg-invalid-key"));
            return;
        }
        try {
            this._playlistItems = await this._youtubePlaylistImportService.getPlaylistInfo(key);
        }
        catch (ex) {
            if (ex == "Invalid Playlist") {
                (_b = ui.notifications) === null || _b === void 0 ? void 0 : _b.error(game.i18n.format("bellows.import-yt-playlist-msg-key-not-found", { playlistKey: key }));
            }
            else {
                (_c = ui.notifications) === null || _c === void 0 ? void 0 : _c.error(game.i18n.localize("bellows.import-yt-playlist-msg-error"));
                _helper_Utils__WEBPACK_IMPORTED_MODULE_0__.Logger.LogError(ex);
            }
        }
    }
    async _onImport(e) {
        var _a;
        if (this._working) {
            (_a = ui.notifications) === null || _a === void 0 ? void 0 : _a.error(game.i18n.localize("bellows.import-yt-playlist-msg-already-working"));
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
    async rerender() {
        await this._render(false);
        this.setPosition();
    }
    async _updateObject(_e, formData) {
        var _a, _b;
        try {
            await this._youtubePlaylistImportService.createFoundryVTTPlaylist(formData.playlistname, this._playlistItems, formData.playlistvolume);
            (_a = ui.notifications) === null || _a === void 0 ? void 0 : _a.info(game.i18n.format("bellows.import-yt-playlist-msg-imported", { playlistName: formData.playlistname }));
        }
        catch (ex) {
            _helper_Utils__WEBPACK_IMPORTED_MODULE_0__.Logger.LogError(ex);
            (_b = ui.notifications) === null || _b === void 0 ? void 0 : _b.error(game.i18n.localize("bellows.import-yt-playlist-msg-error"));
        }
    }
}


/***/ }),

/***/ "./src/module/features/YoutubeFeature.ts":
/*!***********************************************!*\
  !*** ./src/module/features/YoutubeFeature.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "YoutubeApiFeature": () => (/* binding */ YoutubeApiFeature)
/* harmony export */ });
/* harmony import */ var _helper_Utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../helper/Utils */ "./src/module/helper/Utils.ts");
/* harmony import */ var _api_YoutubeIframeApi__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../api/YoutubeIframeApi */ "./src/module/api/YoutubeIframeApi.ts");
/* harmony import */ var _applications_YoutubePlaylistImportForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../applications/YoutubePlaylistImportForm */ "./src/module/applications/YoutubePlaylistImportForm.ts");



class YoutubeApiFeature {
    static hooks() {
        Hooks.once("init", async () => {
            _helper_Utils__WEBPACK_IMPORTED_MODULE_0__.Logger.LogDebug("Initializing YoutubeApi Feature");
            await _api_YoutubeIframeApi__WEBPACK_IMPORTED_MODULE_1__.YoutubeIframeApi.initializeApi();
        });
        Hooks.on("renderPlaylistDirectory", (html) => {
            var _a;
            if (!((_a = game.user) === null || _a === void 0 ? void 0 : _a.isGM)) {
                return;
            }
            const importButton = $(`
                <button class="import-yt-playlist">
                    <i class="fab fa-youtube"></i> ${game.i18n.localize('bellows.import-yt-playlist-nav-text')}
                </button>`);
            html.find(".directory-footer").append(importButton);
            importButton.on("click", () => {
                new _applications_YoutubePlaylistImportForm__WEBPACK_IMPORTED_MODULE_2__.YoutubePlaylistImportForm({}, {}).render(true);
            });
        });
    }
}


/***/ }),

/***/ "./src/module/helper/Patch.ts":
/*!************************************!*\
  !*** ./src/module/helper/Patch.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BellowsPatch": () => (/* binding */ BellowsPatch)
/* harmony export */ });
/* harmony import */ var _patches_AmbientSoundPatch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../patches/AmbientSoundPatch */ "./src/module/patches/AmbientSoundPatch.ts");
/* harmony import */ var _patches_PlaylistSoundPatch__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../patches/PlaylistSoundPatch */ "./src/module/patches/PlaylistSoundPatch.ts");


class BellowsPatch {
    static patchFunctions() {
        _patches_PlaylistSoundPatch__WEBPACK_IMPORTED_MODULE_1__.PlaylistSoundPatch.patch();
        _patches_AmbientSoundPatch__WEBPACK_IMPORTED_MODULE_0__.AmbientSoundPatch.patch();
    }
}


/***/ }),

/***/ "./src/module/helper/Settings.ts":
/*!***************************************!*\
  !*** ./src/module/helper/Settings.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BellowsSettings": () => (/* binding */ BellowsSettings)
/* harmony export */ });
class BellowsSettings {
    static registerSettings() {
        game.settings.register("bellows", "enableLegacyYoutubeImport", {
            name: game.i18n.localize("Bellows.Settings.LegacyImport.Name"),
            hint: game.i18n.localize("Bellows.Settings.LegacyImport.Hint"),
            scope: "world",
            type: Boolean,
            default: false
        });
    }
}


/***/ }),

/***/ "./src/module/helper/TemplatePreloader.ts":
/*!************************************************!*\
  !*** ./src/module/helper/TemplatePreloader.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TemplatePreloader": () => (/* binding */ TemplatePreloader)
/* harmony export */ });
class TemplatePreloader {
    /**
     * Preload a set of templates to compile and cache them for fast access during rendering
     */
    static async preloadHandlebarsTemplates() {
        const templatePaths = [];
        return loadTemplates(templatePaths);
    }
}


/***/ }),

/***/ "./src/module/helper/Utils.ts":
/*!************************************!*\
  !*** ./src/module/helper/Utils.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Logger": () => (/* binding */ Logger)
/* harmony export */ });
const Logger = {
    Log: new function (...args) {
        console.log("Bellows | ", ...args);
    },
    LogDebug: new function (...args) {
        console.debug("Bellows DBG | ", ...args);
    },
    LogError: new function (...args) {
        console.error("Bellows ERR | ", ...args);
    }
};


/***/ }),

/***/ "./src/module/models/YoutubePlaylistItem.ts":
/*!**************************************************!*\
  !*** ./src/module/models/YoutubePlaylistItem.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/module/patches/AmbientSoundPatch.ts":
/*!*************************************************!*\
  !*** ./src/module/patches/AmbientSoundPatch.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "AmbientSoundPatch": () => (/* binding */ AmbientSoundPatch)
/* harmony export */ });
class AmbientSoundPatch {
    static patch() {
        const originalFunction = AmbientSound.prototype._createSound;
        AmbientSound.prototype._createSound = function () {
            alert("Monkey patched AmbientSound!");
            return originalFunction.apply(this);
        };
    }
}


/***/ }),

/***/ "./src/module/patches/PlaylistSoundPatch.ts":
/*!**************************************************!*\
  !*** ./src/module/patches/PlaylistSoundPatch.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "PlaylistSoundPatch": () => (/* binding */ PlaylistSoundPatch)
/* harmony export */ });
class PlaylistSoundPatch {
    static patch() {
        const originalFunction = PlaylistSound.prototype._createSound;
        PlaylistSound.prototype._createSound = function () {
            alert("Monkey patched PlaylistSound!");
            return originalFunction.apply(this);
        };
    }
}


/***/ }),

/***/ "./src/module/services/YouTubePlaylistImportService.js":
/*!*************************************************************!*\
  !*** ./src/module/services/YouTubePlaylistImportService.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "YouTubePlaylistImportService": () => (/* binding */ YouTubePlaylistImportService)
/* harmony export */ });
/* harmony import */ var _models_YoutubePlaylistItem__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/YoutubePlaylistItem */ "./src/module/models/YoutubePlaylistItem.ts");
/* harmony import */ var _helper_Utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../helper/Utils */ "./src/module/helper/Utils.ts");




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

class YouTubePlaylistImportService {
	
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
				_helper_Utils__WEBPACK_IMPORTED_MODULE_1__.Logger.LogError("Unable to extract playlist info - API not ready");
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
					_helper_Utils__WEBPACK_IMPORTED_MODULE_1__.Logger.LogError("Error scraping youtube iframe: " + ex);
					reject(ex);
				}
				finally {
					cleanupPlayer();
					return;
				}
			});
			
			player.addEventListener('onError', e => {
				_helper_Utils__WEBPACK_IMPORTED_MODULE_1__.Logger.LogError("YT Player errored with code: " + e.data);
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
					_helper_Utils__WEBPACK_IMPORTED_MODULE_1__.Logger.LogDebug(`getNextTrack timed out, retrying...`);
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


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!************************!*\
  !*** ./src/bellows.ts ***!
  \************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _module_features_YoutubeFeature__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./module/features/YoutubeFeature */ "./src/module/features/YoutubeFeature.ts");
/* harmony import */ var _module_helper_TemplatePreloader__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./module/helper/TemplatePreloader */ "./src/module/helper/TemplatePreloader.ts");
/* harmony import */ var _module_helper_Settings__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./module/helper/Settings */ "./src/module/helper/Settings.ts");
/* harmony import */ var _module_helper_Patch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./module/helper/Patch */ "./src/module/helper/Patch.ts");
/* harmony import */ var _module_helper_Utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./module/helper/Utils */ "./src/module/helper/Utils.ts");





Hooks.once("init", async () => {
    _module_helper_Utils__WEBPACK_IMPORTED_MODULE_4__.Logger.Log('Initializing Bellows - The lungs of the Foundry!');
    _module_helper_Settings__WEBPACK_IMPORTED_MODULE_2__.BellowsSettings.registerSettings();
    _module_helper_Patch__WEBPACK_IMPORTED_MODULE_3__.BellowsPatch.patchFunctions();
    await _module_helper_TemplatePreloader__WEBPACK_IMPORTED_MODULE_1__.TemplatePreloader.preloadHandlebarsTemplates();
});
/*
 * Feature Hooks
 */
_module_features_YoutubeFeature__WEBPACK_IMPORTED_MODULE_0__.YoutubeApiFeature.hooks();
if (false) {}

})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9iZWxsb3dzLy4vc3JjL21vZHVsZS9hcGkvWW91dHViZUlmcmFtZUFwaS50cyIsIndlYnBhY2s6Ly9iZWxsb3dzLy4vc3JjL21vZHVsZS9hcHBsaWNhdGlvbnMvWW91dHViZVBsYXlsaXN0SW1wb3J0Rm9ybS50cyIsIndlYnBhY2s6Ly9iZWxsb3dzLy4vc3JjL21vZHVsZS9mZWF0dXJlcy9Zb3V0dWJlRmVhdHVyZS50cyIsIndlYnBhY2s6Ly9iZWxsb3dzLy4vc3JjL21vZHVsZS9oZWxwZXIvUGF0Y2gudHMiLCJ3ZWJwYWNrOi8vYmVsbG93cy8uL3NyYy9tb2R1bGUvaGVscGVyL1NldHRpbmdzLnRzIiwid2VicGFjazovL2JlbGxvd3MvLi9zcmMvbW9kdWxlL2hlbHBlci9UZW1wbGF0ZVByZWxvYWRlci50cyIsIndlYnBhY2s6Ly9iZWxsb3dzLy4vc3JjL21vZHVsZS9oZWxwZXIvVXRpbHMudHMiLCJ3ZWJwYWNrOi8vYmVsbG93cy8uL3NyYy9tb2R1bGUvcGF0Y2hlcy9BbWJpZW50U291bmRQYXRjaC50cyIsIndlYnBhY2s6Ly9iZWxsb3dzLy4vc3JjL21vZHVsZS9wYXRjaGVzL1BsYXlsaXN0U291bmRQYXRjaC50cyIsIndlYnBhY2s6Ly9iZWxsb3dzLy4vc3JjL21vZHVsZS9zZXJ2aWNlcy9Zb3VUdWJlUGxheWxpc3RJbXBvcnRTZXJ2aWNlLmpzIiwid2VicGFjazovL2JlbGxvd3Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vYmVsbG93cy93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vYmVsbG93cy93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2JlbGxvd3Mvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9iZWxsb3dzLy4vc3JjL2JlbGxvd3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5n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V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHdGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7Ozs7Ozs7Ozs7Ozs7O0FDTnFFO0FBQ0M7QUFDWjtBQUNMO0FBQ047QUFFL0MsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxJQUFJLEVBQUU7SUFDMUIsNERBQVUsQ0FBQyxrREFBa0QsQ0FBQyxDQUFDO0lBRS9ELHFGQUFnQyxFQUFFLENBQUM7SUFFbkMsNkVBQTJCLEVBQUUsQ0FBQztJQUU5QixNQUFNLDBHQUE0QyxFQUFFLENBQUM7QUFDekQsQ0FBQyxDQUFDLENBQUM7QUFFSDs7R0FFRztBQUVILG9GQUF1QixFQUFFLENBQUM7QUFFMUIsSUFBSSxLQUFVLEVBQUUsRUFpQmYiLCJmaWxlIjoiYmVsbG93cy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuLi9oZWxwZXIvVXRpbHNcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBZb3V0dWJlSWZyYW1lQXBpIHtcclxuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBZb3V0dWJlSWZyYW1lQXBpO1xyXG5cclxuICAgIHByaXZhdGUgcGxheWVyc01hcDogTWFwPHN0cmluZywgWVQuUGxheWVyPjtcclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGluaXRpYWxpemVBcGkoKSB7XHJcbiAgICAgICAgaWYgKFlvdXR1YmVJZnJhbWVBcGkuaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGluaXRpYWxpemUgWW91dHViZUlmcmFtZUFwaSBtb3JlIHRoYW4gb25jZSFcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUpID0+IHtcclxuICAgICAgICAgICAgd2luZG93Lm9uWW91VHViZUlmcmFtZUFQSVJlYWR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgWW91dHViZUlmcmFtZUFwaS5pbnN0YW5jZSA9IG5ldyBZb3V0dWJlSWZyYW1lQXBpKCk7XHJcbiAgICAgICAgICAgICAgICBMb2dnZXIuTG9nRGVidWcoXCJZb3V0dWJlSWZyYW1lQXBpIHN1Y2Nlc3NmdWxseSBpbml0aWFsaXplZFwiKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGlmICghJChcIiN5dC1hcGktc2NyaXB0XCIpLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgdGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuICAgICAgICAgICAgICAgIHRhZy5pZCA9IFwieXQtYXBpLXNjcmlwdFwiO1xyXG4gICAgICAgICAgICAgICAgdGFnLnNyYyA9IFwiaHR0cHM6Ly93d3cueW91dHViZS5jb20vaWZyYW1lX2FwaVwiO1xyXG4gICAgICAgICAgICAgICAgdGFnLnR5cGUgPSBcInRleHQvamF2YXNjcmlwdFwiO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpcnN0U2NyaXB0VGFnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIilbMF07XHJcbiAgICAgICAgICAgICAgICBmaXJzdFNjcmlwdFRhZy5wYXJlbnROb2RlPy5pbnNlcnRCZWZvcmUodGFnLCBmaXJzdFNjcmlwdFRhZyk7XHJcbiAgICAgICAgICAgICAgICBMb2dnZXIuTG9nRGVidWcoXCJEb3dubG9hZGluZyBZb3V0dWJlSWZyYW1lQXBpLi4uXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLnBsYXllcnNNYXAgPSBuZXcgTWFwPHN0cmluZywgWVQuUGxheWVyPigpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogWW91dHViZUlmcmFtZUFwaSB7XHJcbiAgICAgICAgaWYgKCFZb3V0dWJlSWZyYW1lQXBpLmluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlRyaWVkIHRvIGdldCBZb3V0dWJlSWZyYW1lQXBpIGJlZm9yZSBpbml0aWFsaXphdGlvbiFcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQbGF5ZXIoY29udGFpbmVySWQ6IG51bWJlciwgdmlkZW9JZDogc3RyaW5nKTogWVQuUGxheWVyIHwgdW5kZWZpbmVkIHtcclxuICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IHRoaXMuZ2V0SWRTdHJpbmcoY29udGFpbmVySWQsIHZpZGVvSWQpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNNYXAuZ2V0KHBsYXllcklkKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyBjcmVhdGVQbGF5ZXIoY29udGFpbmVySWQ6IG51bWJlciwgdmlkZW9JZDogc3RyaW5nKTogUHJvbWlzZTxZVC5QbGF5ZXI+IHtcclxuICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IHRoaXMuZ2V0SWRTdHJpbmcoY29udGFpbmVySWQsIHZpZGVvSWQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJzTWFwLmhhcyhwbGF5ZXJJZCkpIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUGxheWVyIGFscmVhZHkgZXhpc3RzIGZvciB0aGlzIGF1ZGlvIGNvbnRhaW5lciFcIik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8WVQuUGxheWVyPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9uUGxheWVyRXJyb3IgPSBmdW5jdGlvbiAoZXZlbnQ6IFlULk9uRXJyb3JFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgbGV0IGVycm9yTWVzc2FnZTogc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBZVC5QbGF5ZXJFcnJvci5JbnZhbGlkUGFyYW06XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IFwiSW52YWxpZCB2aWRlb0lkIHZhbHVlLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFlULlBsYXllckVycm9yLkh0bWw1RXJyb3I6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yTWVzc2FnZSA9IFwiVGhlIHJlcXVlc3RlZCBjb250ZW50IGNhbm5vdCBiZSBwbGF5ZWQgaW4gYW4gSFRNTDUgcGxheWVyIG9yIGFub3RoZXIgZXJyb3IgcmVsYXRlZCB0byB0aGUgSFRNTDUgcGxheWVyIGhhcyBvY2N1cnJlZC5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBZVC5QbGF5ZXJFcnJvci5WaWRlb05vdEZvdW5kOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvck1lc3NhZ2UgPSBcIlZpZGVvIG5vdCBmb3VuZDsgSXQgbWF5IGhhdmUgYmVlbiBkZWxldGVkIG9yIG1hcmtlZCBhcyBwcml2YXRlLlwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICBjYXNlIFlULlBsYXllckVycm9yLkVtYmVkZGluZ05vdEFsbG93ZWQ6XHJcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBZVC5QbGF5ZXJFcnJvci5FbWJlZGRpbmdOb3RBbGxvd2VkMjpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gXCJFbWJlZGRpbmcgaXMgbm90IHN1cHBvcnRlZCBmb3IgdGhpcyB2aWRlby5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JNZXNzYWdlID0gXCJVbnNwZWNpZmllZCBFcnJvclwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHJlamVjdChlcnJvck1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb25QbGF5ZXJSZWFkeUNhbGxiYWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wbGF5ZXJzTWFwLnNldChwbGF5ZXJJZCwgcGxheWVyKTtcclxuICAgICAgICAgICAgICAgIC8vVGhpcyBjbGFzcyBvbmx5IGhhbmRsZXMgaW5pdGlhbCBlcnJvcnMgYmVmb3JlIG9uUmVhZHkuIENvbnRhaW5lcidzIHJlc3BvbnNpYmlsaXR5IHRvIGRlYWwgd2l0aCB0aGVzZSBhZnRlci5cclxuICAgICAgICAgICAgICAgIHBsYXllci5yZW1vdmVFdmVudExpc3RlbmVyKFwib25FcnJvclwiLCBvblBsYXllckVycm9yKTtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUocGxheWVyKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICQoXCJib2R5XCIpLmFwcGVuZChgPGRpdiBjbGFzcz1cInl0LXBsYXllclwiIGlkPVwiJHtwbGF5ZXJJZH1cIj48L2Rpdj5gKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBsYXllcjogWVQuUGxheWVyID0gbmV3IFlULlBsYXllcihwbGF5ZXJJZCwge1xyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBcIjI3MHB4XCIsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogXCI0ODBweFwiLFxyXG4gICAgICAgICAgICAgICAgdmlkZW9JZDogdmlkZW9JZCxcclxuICAgICAgICAgICAgICAgIGV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgICAgIFwib25SZWFkeVwiOiBvblBsYXllclJlYWR5Q2FsbGJhY2ssXHJcbiAgICAgICAgICAgICAgICAgICAgXCJvbkVycm9yXCI6IG9uUGxheWVyRXJyb3JcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYXN5bmMgZGVzdHJveVBsYXllcihjb250YWluZXJJZDogbnVtYmVyLCB2aWRlb0lkOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBwbGF5ZXJJZCA9IHRoaXMuZ2V0SWRTdHJpbmcoY29udGFpbmVySWQsIHZpZGVvSWQpO1xyXG5cclxuICAgICAgICBjb25zdCBwbGF5ZXIgPSB0aGlzLnBsYXllcnNNYXAuZ2V0KHBsYXllcklkKTtcclxuICAgICAgICBpZiAoIXBsYXllcikge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQbGF5ZXIgZG9lcyBub3QgZXhpc3QhXCIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHBsYXllci5nZXRQbGF5ZXJTdGF0ZSgpID09PSBZVC5QbGF5ZXJTdGF0ZS5QTEFZSU5HKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cGxheWVyLnN0b3BWaWRlbygpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG4gICAgICAgICAgICB0aGlzLnBsYXllcnNNYXAuZGVsZXRlKHBsYXllcklkKTtcclxuICAgICAgICAgICAgcGxheWVyLmRlc3Ryb3koKTtcclxuXHJcblx0XHRcdCQoYGRpdiMke3BsYXllcklkfWApLnJlbW92ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0SWRTdHJpbmcoY29udGFpbmVySWQ6IG51bWJlciwgdmlkZW9JZDogc3RyaW5nKSB7XHJcbiAgICAgICAgcmV0dXJuIGBiZWxsb3dzLXl0LWlmcmFtZS0ke2NvbnRhaW5lcklkfS0ke3ZpZGVvSWR9YDtcclxuICAgIH1cclxufSIsImltcG9ydCB7IFlvdXR1YmVQbGF5bGlzdEl0ZW0gfSBmcm9tIFwiLi4vbW9kZWxzL1lvdXR1YmVQbGF5bGlzdEl0ZW1cIjtcclxuaW1wb3J0IHsgTG9nZ2VyIH0gZnJvbSBcIi4uL2hlbHBlci9VdGlsc1wiO1xyXG5pbXBvcnQgeyBZb3VUdWJlUGxheWxpc3RJbXBvcnRTZXJ2aWNlIH0gZnJvbSBcIi4uL3NlcnZpY2VzL1lvdVR1YmVQbGF5bGlzdEltcG9ydFNlcnZpY2VcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBZb3V0dWJlUGxheWxpc3RJbXBvcnRGb3JtIGV4dGVuZHMgRm9ybUFwcGxpY2F0aW9uPGFueSwgYW55LCBhbnk+IHtcclxuXHJcbiAgcHJpdmF0ZSBfd29ya2luZzogYm9vbGVhbjtcclxuICBwcml2YXRlIF9wbGF5bGlzdEl0ZW1zOiBZb3V0dWJlUGxheWxpc3RJdGVtW107XHJcbiAgcHJpdmF0ZSBfeW91dHViZVBsYXlsaXN0SW1wb3J0U2VydmljZTogWW91VHViZVBsYXlsaXN0SW1wb3J0U2VydmljZTtcclxuXHJcbiAgY29uc3RydWN0b3Iob2JqZWN0LCBvcHRpb25zKSB7XHJcbiAgICBvcHRpb25zLmhlaWdodCA9IFwiYXV0b1wiO1xyXG4gICAgc3VwZXIob2JqZWN0LCBvcHRpb25zKTtcclxuICAgIHRoaXMuX3dvcmtpbmcgPSBmYWxzZTtcclxuICAgIHRoaXMuX3BsYXlsaXN0SXRlbXMgPSBbXTtcclxuICAgIHRoaXMuX3lvdXR1YmVQbGF5bGlzdEltcG9ydFNlcnZpY2UgPSBuZXcgWW91VHViZVBsYXlsaXN0SW1wb3J0U2VydmljZSgpO1xyXG4gIH1cclxuICBcclxuICBzdGF0aWMgZ2V0IGRlZmF1bHRPcHRpb25zKCkge1xyXG4gICAgcmV0dXJuIG1lcmdlT2JqZWN0KHN1cGVyLmRlZmF1bHRPcHRpb25zLCB7XHJcbiAgICAgIHRpdGxlOiBnYW1lLmkxOG4ubG9jYWxpemUoXCJiZWxsb3dzLmltcG9ydC15dC1wbGF5bGlzdC1uYXYtdGV4dFwiKSxcclxuICAgICAgdGVtcGxhdGU6IFwiL21vZHVsZXMvYmVsbG93cy90ZW1wbGF0ZXMvYXBwcy9pbXBvcnQteW91dHViZS1wbGF5bGlzdC5odG1sXCJcclxuICAgIH0gYXMgRm9ybUFwcGxpY2F0aW9uLk9wdGlvbnMpO1xyXG4gIH1cclxuICBcclxuICBhY3RpdmF0ZUxpc3RlbmVycyhodG1sKSB7XHJcbiAgICBzdXBlci5hY3RpdmF0ZUxpc3RlbmVycyhodG1sKTtcclxuICAgIFxyXG4gICAgaHRtbC5maW5kKFwiYnV0dG9uW2lkPSdiZWxsb3dzLXl0LWltcG9ydC1idG4taW1wb3J0J11cIikub24oXCJjbGlja1wiLCAoZSkgPT4gdGhpcy5fb25JbXBvcnQuY2FsbCh0aGlzLCBlKSk7XHJcbiAgICBodG1sLmZpbmRcclxuICB9XHJcbiAgXHJcbiAgZ2V0RGF0YSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHdvcmtpbmc6IHRoaXMuX3dvcmtpbmcsXHJcbiAgICAgIHBsYXlsaXN0SXRlbXM6IHRoaXMuX3BsYXlsaXN0SXRlbXNcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFzeW5jIGltcG9ydFBsYXlsaXN0KHBsYXlsaXN0U3RyKSB7XHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLl95b3V0dWJlUGxheWxpc3RJbXBvcnRTZXJ2aWNlLmV4dHJhY3RQbGF5bGlzdEtleShwbGF5bGlzdFN0cik7XHJcbiAgICBcclxuICAgIGlmICgha2V5KSB7XHJcbiAgICAgIHVpLm5vdGlmaWNhdGlvbnM/LmVycm9yKGdhbWUuaTE4bi5sb2NhbGl6ZShcImJlbGxvd3MuaW1wb3J0LXl0LXBsYXlsaXN0LW1zZy1pbnZhbGlkLWtleVwiKSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0cnkge1xyXG4gICAgICB0aGlzLl9wbGF5bGlzdEl0ZW1zID0gYXdhaXQgdGhpcy5feW91dHViZVBsYXlsaXN0SW1wb3J0U2VydmljZS5nZXRQbGF5bGlzdEluZm8oa2V5KTtcclxuICAgIH0gY2F0Y2goZXgpIHtcclxuICAgICAgaWYgKGV4ID09IFwiSW52YWxpZCBQbGF5bGlzdFwiKSB7XHJcbiAgICAgICAgdWkubm90aWZpY2F0aW9ucz8uZXJyb3IoZ2FtZS5pMThuLmZvcm1hdChcImJlbGxvd3MuaW1wb3J0LXl0LXBsYXlsaXN0LW1zZy1rZXktbm90LWZvdW5kXCIsIHtwbGF5bGlzdEtleToga2V5fSkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHVpLm5vdGlmaWNhdGlvbnM/LmVycm9yKGdhbWUuaTE4bi5sb2NhbGl6ZShcImJlbGxvd3MuaW1wb3J0LXl0LXBsYXlsaXN0LW1zZy1lcnJvclwiKSk7XHJcbiAgICAgICAgTG9nZ2VyLkxvZ0Vycm9yKGV4KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgYXN5bmMgX29uSW1wb3J0KGUpIHtcclxuICAgIGlmICh0aGlzLl93b3JraW5nKSB7XHJcbiAgICAgIHVpLm5vdGlmaWNhdGlvbnM/LmVycm9yKGdhbWUuaTE4bi5sb2NhbGl6ZShcImJlbGxvd3MuaW1wb3J0LXl0LXBsYXlsaXN0LW1zZy1hbHJlYWR5LXdvcmtpbmdcIikpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fd29ya2luZyA9IHRydWU7XHJcbiAgICB0aGlzLl9wbGF5bGlzdEl0ZW1zID0gW107XHJcblxyXG4gICAgY29uc3QgYnV0dG9uID0gJChlLmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgY29uc3QgcGxheWxpc3RVcmkgPSBidXR0b24uc2libGluZ3MoXCJpbnB1dFtpZD0nYmVsbG93cy15dC1pbXBvcnQtdXJsLXRleHRcIikudmFsKCk7XHJcbiAgICBcclxuICAgIGF3YWl0IHRoaXMucmVyZW5kZXIoKTtcclxuICAgIFxyXG4gICAgYXdhaXQgdGhpcy5pbXBvcnRQbGF5bGlzdChwbGF5bGlzdFVyaSk7XHJcbiAgICB0aGlzLl93b3JraW5nID0gZmFsc2U7XHJcbiAgICBcclxuICAgIGF3YWl0IHRoaXMucmVyZW5kZXIoKTtcclxuICB9XHJcbiAgXHJcbiAgcHJpdmF0ZSBhc3luYyByZXJlbmRlcigpIHtcclxuICAgIGF3YWl0IHRoaXMuX3JlbmRlcihmYWxzZSk7XHJcbiAgICB0aGlzLnNldFBvc2l0aW9uKCk7XHJcbiAgfVxyXG4gIFxyXG4gIGFzeW5jIF91cGRhdGVPYmplY3QoX2UsIGZvcm1EYXRhKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBhd2FpdCB0aGlzLl95b3V0dWJlUGxheWxpc3RJbXBvcnRTZXJ2aWNlLmNyZWF0ZUZvdW5kcnlWVFRQbGF5bGlzdChmb3JtRGF0YS5wbGF5bGlzdG5hbWUsIHRoaXMuX3BsYXlsaXN0SXRlbXMsIGZvcm1EYXRhLnBsYXlsaXN0dm9sdW1lKTtcclxuICAgICAgdWkubm90aWZpY2F0aW9ucz8uaW5mbyhnYW1lLmkxOG4uZm9ybWF0KFwiYmVsbG93cy5pbXBvcnQteXQtcGxheWxpc3QtbXNnLWltcG9ydGVkXCIsIHtwbGF5bGlzdE5hbWU6IGZvcm1EYXRhLnBsYXlsaXN0bmFtZX0pKTtcclxuICAgIH0gY2F0Y2ggKGV4KSB7XHJcbiAgICAgIExvZ2dlci5Mb2dFcnJvcihleCk7XHJcbiAgICAgIHVpLm5vdGlmaWNhdGlvbnM/LmVycm9yKGdhbWUuaTE4bi5sb2NhbGl6ZShcImJlbGxvd3MuaW1wb3J0LXl0LXBsYXlsaXN0LW1zZy1lcnJvclwiKSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IExvZ2dlciB9IGZyb20gXCIuLi9oZWxwZXIvVXRpbHNcIjtcclxuaW1wb3J0IHsgWW91dHViZUlmcmFtZUFwaSB9IGZyb20gXCIuLi9hcGkvWW91dHViZUlmcmFtZUFwaVwiO1xyXG5pbXBvcnQgeyBZb3V0dWJlUGxheWxpc3RJbXBvcnRGb3JtIH0gZnJvbSBcIi4uL2FwcGxpY2F0aW9ucy9Zb3V0dWJlUGxheWxpc3RJbXBvcnRGb3JtXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgWW91dHViZUFwaUZlYXR1cmUge1xyXG4gICAgc3RhdGljIGhvb2tzKCkge1xyXG4gICAgICAgIEhvb2tzLm9uY2UoXCJpbml0XCIsIGFzeW5jICgpID0+IHtcclxuICAgICAgICAgICAgTG9nZ2VyLkxvZ0RlYnVnKFwiSW5pdGlhbGl6aW5nIFlvdXR1YmVBcGkgRmVhdHVyZVwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGF3YWl0IFlvdXR1YmVJZnJhbWVBcGkuaW5pdGlhbGl6ZUFwaSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBIb29rcy5vbihcInJlbmRlclBsYXlsaXN0RGlyZWN0b3J5XCIsIChodG1sKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZ2FtZS51c2VyPy5pc0dNKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGltcG9ydEJ1dHRvbiA9ICQoYFxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImltcG9ydC15dC1wbGF5bGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwiZmFiIGZhLXlvdXR1YmVcIj48L2k+ICR7Z2FtZS5pMThuLmxvY2FsaXplKCdiZWxsb3dzLmltcG9ydC15dC1wbGF5bGlzdC1uYXYtdGV4dCcpfVxyXG4gICAgICAgICAgICAgICAgPC9idXR0b24+YCk7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgaHRtbC5maW5kKFwiLmRpcmVjdG9yeS1mb290ZXJcIikuYXBwZW5kKGltcG9ydEJ1dHRvbik7XHJcblxyXG4gICAgICAgICAgICBpbXBvcnRCdXR0b24ub24oXCJjbGlja1wiLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBuZXcgWW91dHViZVBsYXlsaXN0SW1wb3J0Rm9ybSh7fSwge30pLnJlbmRlcih0cnVlKTtcclxuICAgICAgICAgICAgfSk7XHRcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSIsImltcG9ydCB7IEFtYmllbnRTb3VuZFBhdGNoIH0gZnJvbSBcIi4uL3BhdGNoZXMvQW1iaWVudFNvdW5kUGF0Y2hcIjtcclxuaW1wb3J0IHsgUGxheWxpc3RTb3VuZFBhdGNoIH0gZnJvbSBcIi4uL3BhdGNoZXMvUGxheWxpc3RTb3VuZFBhdGNoXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgQmVsbG93c1BhdGNoIHtcclxuICAgIHN0YXRpYyBwYXRjaEZ1bmN0aW9ucygpIHtcclxuICAgICAgICBQbGF5bGlzdFNvdW5kUGF0Y2gucGF0Y2goKTtcclxuICAgICAgICBBbWJpZW50U291bmRQYXRjaC5wYXRjaCgpO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIEJlbGxvd3NTZXR0aW5ncyB7XHJcbiAgICBzdGF0aWMgcmVnaXN0ZXJTZXR0aW5ncygpIHtcclxuICAgICAgICBnYW1lLnNldHRpbmdzLnJlZ2lzdGVyKFwiYmVsbG93c1wiLCBcImVuYWJsZUxlZ2FjeVlvdXR1YmVJbXBvcnRcIiwge1xyXG4gICAgICAgICAgICBuYW1lOiBnYW1lLmkxOG4ubG9jYWxpemUoXCJCZWxsb3dzLlNldHRpbmdzLkxlZ2FjeUltcG9ydC5OYW1lXCIpLFxyXG4gICAgICAgICAgICBoaW50OiBnYW1lLmkxOG4ubG9jYWxpemUoXCJCZWxsb3dzLlNldHRpbmdzLkxlZ2FjeUltcG9ydC5IaW50XCIpLFxyXG4gICAgICAgICAgICBzY29wZTogXCJ3b3JsZFwiLFxyXG4gICAgICAgICAgICB0eXBlOiBCb29sZWFuLFxyXG4gICAgICAgICAgICBkZWZhdWx0OiBmYWxzZVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFRlbXBsYXRlUHJlbG9hZGVyIHtcbiAgICAvKipcbiAgICAgKiBQcmVsb2FkIGEgc2V0IG9mIHRlbXBsYXRlcyB0byBjb21waWxlIGFuZCBjYWNoZSB0aGVtIGZvciBmYXN0IGFjY2VzcyBkdXJpbmcgcmVuZGVyaW5nXG4gICAgICovXG4gICAgc3RhdGljIGFzeW5jIHByZWxvYWRIYW5kbGViYXJzVGVtcGxhdGVzKCkge1xuICAgICAgICBjb25zdCB0ZW1wbGF0ZVBhdGhzID0gW107XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gbG9hZFRlbXBsYXRlcyh0ZW1wbGF0ZVBhdGhzKTtcbiAgICB9XG59IiwiZXhwb3J0IGludGVyZmFjZSBJTG9nZ2VyIHtcclxuICAgIExvZzogKC4uLmFyZ3M6IGFueSkgPT4gdm9pZDtcclxuICAgIExvZ0RlYnVnOiAoLi4uYXJnczogYW55KSA9PiB2b2lkO1xyXG4gICAgTG9nRXJyb3I6ICguLi5hcmdzOiBhbnkpID0+IHZvaWQ7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBMb2dnZXI6IElMb2dnZXIgPSB7XHJcbiAgICBMb2c6IG5ldyBmdW5jdGlvbiAoLi4uYXJnczogYW55KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJCZWxsb3dzIHwgXCIsIC4uLmFyZ3MpO1xyXG4gICAgfSxcclxuICAgIExvZ0RlYnVnOiBuZXcgZnVuY3Rpb24gKC4uLmFyZ3M6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUuZGVidWcoXCJCZWxsb3dzIERCRyB8IFwiLCAuLi5hcmdzKTtcclxuICAgIH0sXHJcbiAgICBMb2dFcnJvcjogbmV3IGZ1bmN0aW9uICguLi5hcmdzOiBhbnkpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKFwiQmVsbG93cyBFUlIgfCBcIiwgLi4uYXJncyk7XHJcbiAgICB9XHJcbn0iLCJleHBvcnQgY2xhc3MgQW1iaWVudFNvdW5kUGF0Y2gge1xyXG4gICAgc3RhdGljIHBhdGNoKCkge1xyXG4gICAgICAgIGNvbnN0IG9yaWdpbmFsRnVuY3Rpb24gPSBBbWJpZW50U291bmQucHJvdG90eXBlLl9jcmVhdGVTb3VuZDtcclxuXHJcbiAgICAgICAgQW1iaWVudFNvdW5kLnByb3RvdHlwZS5fY3JlYXRlU291bmQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiTW9ua2V5IHBhdGNoZWQgQW1iaWVudFNvdW5kIVwiKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb24uYXBwbHkodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiZXhwb3J0IGNsYXNzIFBsYXlsaXN0U291bmRQYXRjaCB7XHJcbiAgICBzdGF0aWMgcGF0Y2goKSB7XHJcbiAgICAgICAgY29uc3Qgb3JpZ2luYWxGdW5jdGlvbiA9IFBsYXlsaXN0U291bmQucHJvdG90eXBlLl9jcmVhdGVTb3VuZDtcclxuXHJcbiAgICAgICAgUGxheWxpc3RTb3VuZC5wcm90b3R5cGUuX2NyZWF0ZVNvdW5kID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBhbGVydChcIk1vbmtleSBwYXRjaGVkIFBsYXlsaXN0U291bmQhXCIpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGdW5jdGlvbi5hcHBseSh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgeyBZb3V0dWJlUGxheWxpc3RJdGVtIH0gZnJvbSAnLi4vbW9kZWxzL1lvdXR1YmVQbGF5bGlzdEl0ZW0nO1xyXG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tICcuLi9oZWxwZXIvVXRpbHMnO1xyXG5cclxuXHJcbi8vcHJpdmF0ZSBjb25zdHMgJiBmdW5jc1xyXG5jb25zdCBwbGF5ZXJJZCA9ICdiZWxsb3dzLXBsYXlsaXN0LXBsYXllcic7XHJcbmxldCBwbGF5ZXI7XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVQbGF5ZXIocGxheWxpc3RJZCkge1xyXG5cdGlmIChwbGF5ZXIgIT0gbnVsbCkge1xyXG5cdFx0dGhyb3cgJ1BsYXllciBhbHJlYWR5IGV4aXN0cyc7XHJcblx0fVxyXG5cdCQoJ2JvZHknKS5hcHBlbmQoYDxkaXYgc3R5bGU9XCJkaXNwbGF5OiBoaWRkZW47XCI+PGRpdiBpZD1cIiR7cGxheWVySWR9XCI+PC9kaXY+PC9kaXY+YCk7XHJcblx0XHJcblx0cGxheWVyID0gbmV3IFlULlBsYXllcihwbGF5ZXJJZCwge1xyXG5cdFx0d2lkdGg6ICc0ODBweCcsXHJcblx0XHRoZWlnaHQ6ICcyNzBweCcsXHJcblx0XHRwbGF5ZXJWYXJzOiB7XHJcblx0XHRcdGxpc3RUeXBlOidwbGF5bGlzdCcsXHJcblx0XHRcdGxpc3Q6IHBsYXlsaXN0SWRcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG5cclxuZnVuY3Rpb24gY2xlYW51cFBsYXllcigpIHtcclxuXHQvL0Fsd2F5cyBjbGVhbiB1cCBhbGwgdHJhY2VzIG9mIHRoZSBwbGF5ZXJcclxuXHRpZiAocGxheWVyICE9IG51bGwpIHtcclxuXHRcdHBsYXllci5kZXN0cm95KCk7XHJcblx0XHRwbGF5ZXIgPSBudWxsO1xyXG5cdH1cclxuXHRcclxuXHQkKGAjJHtwbGF5ZXJJZH1gKS5wYXJlbnQoKS5yZW1vdmUoKTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFlvdVR1YmVQbGF5bGlzdEltcG9ydFNlcnZpY2Uge1xyXG5cdFxyXG5cdGV4dHJhY3RQbGF5bGlzdEtleShwbGF5bGlzdFN0cmluZykge1xyXG5cdFx0Ly9Zb3VUdWJlIHVybCAoYW55IHN0cmluZyB3aXRoIGEgbGlzdCBxdWVyeXN0cmluZyB2YXIpXHJcblx0XHQvL05vIHJlbGlhYmxlIHJlZ2V4IGxvb2tiZWhpbmQgZm9yIGFsbCBicm93c2VycyB5ZXQsIHNvIHdlJ2xsIGp1c3QgZ2V0IHRoZSBmaXJzdCBjYXB0dXJlIGdyb3VwIGluc3RlYWRcclxuXHRcdGNvbnN0IHVybFJlZ0V4ID0gL2xpc3RcXD0oW2EtekEtWjAtOV8tXSspL1xyXG5cdFx0Ly9QbGFpbiBwbGF5bGlzdCBrZXlcclxuXHRcdGNvbnN0IGtleVJlZ0V4ID0gL15bYS16QS1aMC05Xy1dKyQvXHJcblx0XHRcclxuXHRcdGlmICghcGxheWxpc3RTdHJpbmcgfHwgcGxheWxpc3RTdHJpbmcubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0dmFyIG1hdGNoZXMgPSB1cmxSZWdFeC5leGVjKHBsYXlsaXN0U3RyaW5nKTtcclxuXHRcdGlmIChtYXRjaGVzKSB7XHJcblx0XHRcdHJldHVybiBtYXRjaGVzWzFdO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHBsYXlsaXN0U3RyaW5nLm1hdGNoKGtleVJlZ0V4KVswXTtcclxuXHRcdH1cclxuXHR9XHJcblx0XHJcblx0YXN5bmMgZ2V0UGxheWxpc3RJbmZvKHBsYXlsaXN0S2V5KSB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKHBsYXlsaXN0S2V5ID09IG51bGwpIHtcclxuXHRcdFx0XHRyZWplY3QoJ0VtcHR5IHBsYXlsaXN0IGtleScpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0LypcclxuXHRcdFx0KlRoaXMgaXMgbm90IHRvbyBlbGVnYW50IGFzIHRoZSBZb3VUdWJlQXBpL1lvdVR1YmVQbGF5ZXIgY2xhc3NlcyBhcmUgcXVpdGUgdGlnaHRseSBjb3VwbGVkIHdpdGggcGxheWluZyBzb3VuZHMgZm9yIEZvdW5kcnksIHdoaWNoIHdlJ3JlIG5vdCBpbnRlcmVzdGVkIGluIGRvaW5nLlxyXG5cdFx0XHQqV2UgY2FuIGdldCBhcm91bmQgdGhpcyBzb21ld2hhdCBieSBjcmVhdGluZyBvdXIgb3duIFlULlBsYXllciBhbmQgaWdub3JpbmcgdGhlIFlvdVR1YmVQbGF5ZXIgY2xhc3MgYWx0b2dldGhlclxyXG5cdFx0XHQqV2lsbCBwcm9iYWJseSBuZWVkIHJlZmFjdG9yaW5nIGxhdGVyLlxyXG5cdFx0XHQqL1xyXG5cdFx0XHRsZXQgYXBpID0gZ2V0QXBpKCd5b3V0dWJlJyk7XHJcblx0XHRcdGlmICghYXBpIHx8ICFhcGkuaXNSZWFkeSgpKSB7XHJcblx0XHRcdFx0Ly90aGlzIHNob3VsZCBuZXZlciByZWFsbHkgaGFwcGVuLiBUaGUgQVBJIGlzIGNyZWF0ZWQgZHVyaW5nIEZvdW5kcnkgaW5pdC5cclxuXHRcdFx0XHRMb2dnZXIuTG9nRXJyb3IoXCJVbmFibGUgdG8gZXh0cmFjdCBwbGF5bGlzdCBpbmZvIC0gQVBJIG5vdCByZWFkeVwiKTtcclxuXHRcdFx0XHRyZWplY3QoJ0FQSSBub3QgcmVhZHknKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cdFxyXG5cdFx0XHRcclxuXHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRjcmVhdGVQbGF5ZXIocGxheWxpc3RLZXkpO1xyXG5cdFx0XHR9IFxyXG5cdFx0XHRjYXRjaCAoZXgpIHtcclxuXHRcdFx0XHRyZWplY3QoZXgpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoJ29uUmVhZHknLCBhc3luYyAoZSkgPT4ge1xyXG5cdFx0XHRcdGxldCBwbGF5ZXIgPSBlLnRhcmdldDtcclxuXHRcdFx0XHR0cnkge1xyXG5cdFx0XHRcdFx0dmFyIHZpZGVvcyA9IGF3YWl0IHRoaXMuc2NyYXBlVmlkZW9OYW1lcyhwbGF5ZXIpO1xyXG5cdFx0XHRcdFx0cmVzb2x2ZSh2aWRlb3MpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRjYXRjaCAoZXgpIHtcclxuXHRcdFx0XHRcdExvZ2dlci5Mb2dFcnJvcihcIkVycm9yIHNjcmFwaW5nIHlvdXR1YmUgaWZyYW1lOiBcIiArIGV4KTtcclxuXHRcdFx0XHRcdHJlamVjdChleCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZpbmFsbHkge1xyXG5cdFx0XHRcdFx0Y2xlYW51cFBsYXllcigpO1xyXG5cdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdFxyXG5cdFx0XHRwbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignb25FcnJvcicsIGUgPT4ge1xyXG5cdFx0XHRcdExvZ2dlci5Mb2dFcnJvcihcIllUIFBsYXllciBlcnJvcmVkIHdpdGggY29kZTogXCIgKyBlLmRhdGEpO1xyXG5cdFx0XHRcdHJlamVjdChcIllUIHBsYXllciBlcnJvcjogXCIgKyBlLmRhdGEpO1xyXG5cdFx0XHRcdGNsZWFudXBQbGF5ZXIoKTtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdFxyXG5cdGFzeW5jIGNyZWF0ZUZvdW5kcnlWVFRQbGF5bGlzdChwbGF5bGlzdE5hbWUsIHRyYWNrTGlzdCwgdm9sdW1lKSB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRpZiAoIXBsYXlsaXN0TmFtZSB8fCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwocGxheWxpc3ROYW1lKSAhPT0gXCJbb2JqZWN0IFN0cmluZ11cIikge1xyXG5cdFx0XHRcdHJlamVjdChcIkVudGVyIHBsYXlsaXN0IG5hbWVcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdHRyeSB7XHJcblx0XHRcdFx0bGV0IHBsYXlsaXN0ID0gYXdhaXQgUGxheWxpc3QuY3JlYXRlKHtcclxuXHRcdFx0XHRcdFwibmFtZVwiOiBwbGF5bGlzdE5hbWUsXHJcblx0XHRcdFx0XHRcInNodWZmbGVcIjogZmFsc2VcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRsZXQgcmVhbFZvbHVtZSA9IEF1ZGlvSGVscGVyLmlucHV0VG9Wb2x1bWUodm9sdW1lKTtcclxuXHRcdFx0XHRsZXQgcGxheWxpc3RTb3VuZHMgPSBbXTtcclxuXHRcdFx0XHQvL3ZpZGVvczogQXJyIG9mIHtpZCwgdGl0bGV9XHJcblx0XHRcdFx0Zm9yIChsZXQgaT0wOyBpIDwgdHJhY2tMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdFx0XHRwbGF5bGlzdFNvdW5kcy5wdXNoKHtcclxuXHRcdFx0XHRcdFx0bmFtZTogdHJhY2tMaXN0W2ldLnRpdGxlLFxyXG5cdFx0XHRcdFx0XHRsdm9sdW1lOiB2b2x1bWUsXHJcblx0XHRcdFx0XHRcdHZvbHVtZTogcmVhbFZvbHVtZSxcclxuXHRcdFx0XHRcdFx0cGF0aDogJ2ludmFsaWQubXAzJyxcclxuXHRcdFx0XHRcdFx0cmVwZWF0OiBmYWxzZSxcclxuXHRcdFx0XHRcdFx0ZmxhZ3M6IHtcclxuXHRcdFx0XHRcdFx0XHRiSXNTdHJlYW1lZDogdHJ1ZSxcclxuXHRcdFx0XHRcdFx0XHRzdHJlYW1pbmdBcGk6ICd5b3V0dWJlJyxcclxuXHRcdFx0XHRcdFx0XHRzdHJlYW1pbmdJZDogdHJhY2tMaXN0W2ldLmlkXHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRhd2FpdCBwbGF5bGlzdC5jcmVhdGVFbWJlZGRlZERvY3VtZW50cyhcIlBsYXlsaXN0U291bmRcIiwgcGxheWxpc3RTb3VuZHMpO1xyXG5cdFx0XHRcdHJlc29sdmUoKTtcclxuXHRcdFx0fSBjYXRjaCAoZXgpIHtcclxuXHRcdFx0XHRyZWplY3QoZXgpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGFzeW5jIHNjcmFwZVZpZGVvTmFtZXMocGxheWVyKSB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoYXN5bmMgKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHRcclxuXHRcdFx0aWYgKCFwbGF5ZXIuZ2V0UGxheWxpc3QoKSkge1xyXG5cdFx0XHRcdHJlamVjdCgnSW52YWxpZCBQbGF5bGlzdCcpO1xyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0bGV0IHNjcmFwZWRUcmFja3MgPSBbXTtcclxuXHRcdFx0XHJcblx0XHRcdGZvciAobGV0IGYgPSAwOyBmIDwgMzsgZisrKSB7XHJcblx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdGF3YWl0IHRoaXMuZ2V0VHJhY2socGxheWVyLCAwKTtcclxuXHRcdFx0XHRcdGJyZWFrO1xyXG5cdFx0XHRcdH0gY2F0Y2goZXgpIHtcclxuXHRcdFx0XHRcdExvZ2dlci5Mb2dEZWJ1ZyhgZ2V0TmV4dFRyYWNrIHRpbWVkIG91dCwgcmV0cnlpbmcuLi5gKTtcclxuXHRcdFx0XHRcdGlmIChmID09IDIpIHtcclxuXHRcdFx0XHRcdFx0cmVqZWN0KGV4KTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Zm9yIChsZXQgaT0wOyBpIDwgcGxheWVyLmdldFBsYXlsaXN0KCkubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRhd2FpdCB0aGlzLmdldFRyYWNrKHBsYXllciwgaSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0bGV0IGRhdGEgPSBwbGF5ZXIuZ2V0VmlkZW9EYXRhKCk7XHJcblx0XHRcdFx0c2NyYXBlZFRyYWNrcy5wdXNoKHtcclxuXHRcdFx0XHRcdGlkOiBkYXRhLnZpZGVvX2lkLFxyXG5cdFx0XHRcdFx0dGl0bGU6IGRhdGEudGl0bGVcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0cmVzb2x2ZShzY3JhcGVkVHJhY2tzKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHRhc3luYyBnZXRUcmFjayhwbGF5ZXIsIGlkeCkge1xyXG5cdFx0bGV0IHBsYXlOZXh0VmlkZW8gPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xyXG5cdFx0XHRwbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcignb25TdGF0ZUNoYW5nZScsIGUgPT4ge1xyXG5cdFx0XHRcdGlmIChlLmRhdGEgPT0gLTEpIHtcclxuXHRcdFx0XHRcdGUudGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ29uU3RhdGVDaGFuZ2UnKTtcclxuXHRcdFx0XHRcdHJlc29sdmUoZS5kYXRhKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRwbGF5ZXIucGxheVZpZGVvQXQoaWR4KTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRsZXQgdGltZW91dCA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuXHRcdFx0bGV0IGlkID0gc2V0VGltZW91dCgoKSA9PiB7XHJcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KGlkKTtcclxuXHRcdFx0XHRyZWplY3QoJ3RpbWVkIG91dCcpO1xyXG5cdFx0XHR9LCAxMDAwKTtcclxuXHRcdH0pO1xyXG5cdFx0XHJcblx0XHRyZXR1cm4gUHJvbWlzZS5yYWNlKFtcclxuXHRcdFx0cGxheU5leHRWaWRlbyxcclxuXHRcdFx0dGltZW91dFxyXG5cdFx0XSk7XHJcblx0fVxyXG59XHJcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwiaW1wb3J0IHsgWW91dHViZUFwaUZlYXR1cmUgfSBmcm9tIFwiLi9tb2R1bGUvZmVhdHVyZXMvWW91dHViZUZlYXR1cmVcIjtcbmltcG9ydCB7IFRlbXBsYXRlUHJlbG9hZGVyIH0gZnJvbSBcIi4vbW9kdWxlL2hlbHBlci9UZW1wbGF0ZVByZWxvYWRlclwiO1xuaW1wb3J0IHsgQmVsbG93c1NldHRpbmdzIH0gZnJvbSBcIi4vbW9kdWxlL2hlbHBlci9TZXR0aW5nc1wiXG5pbXBvcnQgeyBCZWxsb3dzUGF0Y2ggfSBmcm9tIFwiLi9tb2R1bGUvaGVscGVyL1BhdGNoXCI7XG5pbXBvcnQgeyBMb2dnZXIgfSBmcm9tIFwiLi9tb2R1bGUvaGVscGVyL1V0aWxzXCI7XG5cbkhvb2tzLm9uY2UoXCJpbml0XCIsIGFzeW5jICgpID0+IHtcbiAgICBMb2dnZXIuTG9nKCdJbml0aWFsaXppbmcgQmVsbG93cyAtIFRoZSBsdW5ncyBvZiB0aGUgRm91bmRyeSEnKTtcblxuICAgIEJlbGxvd3NTZXR0aW5ncy5yZWdpc3RlclNldHRpbmdzKCk7XG5cbiAgICBCZWxsb3dzUGF0Y2gucGF0Y2hGdW5jdGlvbnMoKTtcbiAgICBcbiAgICBhd2FpdCBUZW1wbGF0ZVByZWxvYWRlci5wcmVsb2FkSGFuZGxlYmFyc1RlbXBsYXRlcygpO1xufSk7XG5cbi8qIFxuICogRmVhdHVyZSBIb29rc1xuICovXG5cbllvdXR1YmVBcGlGZWF0dXJlLmhvb2tzKCk7XG5cbmlmIChtb2R1bGUuaG90KSB7XG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoKTtcbiAgICBpZiAobW9kdWxlLmhvdC5zdGF0dXMoKSA9PT0gXCJhcHBseVwiKSB7XG4gICAgICAgIGZvciAoY29uc3QgdGVtcGxhdGUgaW4gX3RlbXBsYXRlQ2FjaGUpIHtcbiAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoX3RlbXBsYXRlQ2FjaGUsIHRlbXBsYXRlKSkge1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBfdGVtcGxhdGVDYWNoZVt0ZW1wbGF0ZV07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIFRlbXBsYXRlUHJlbG9hZGVyLnByZWxvYWRIYW5kbGViYXJzVGVtcGxhdGVzKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICBmb3IgKGNvbnN0IGFwcGxpY2F0aW9uIGluIHVpLndpbmRvd3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHVpLndpbmRvd3MsIGFwcGxpY2F0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICB1aS53aW5kb3dzW2FwcGxpY2F0aW9uXS5yZW5kZXIodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG59Il0sInNvdXJjZVJvb3QiOiIifQ==