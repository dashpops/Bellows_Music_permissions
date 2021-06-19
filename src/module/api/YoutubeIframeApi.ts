import { Logger } from "../../utils";

export class YoutubeIframeApi {
    private static instance: YoutubeIframeApi;

    private playersMap: Map<string, YT.Player>;

    public static async initializeApi() {
        if (YoutubeIframeApi.instance) {
            throw new Error("Cannot initialize YoutubeIframeApi more than once!");
        }

        return new Promise<void>((resolve) => {
            window.onYouTubeIframeAPIReady = function () {
                YoutubeIframeApi.instance = new YoutubeIframeApi();
                Logger.Log("YoutubeIframeApi successfully initialized");
                resolve();
            };

            if (!$("#yt-api-script").length) {
                const tag = document.createElement("script");
                tag.id = "yt-api-script";
                tag.src = "https://www.youtube.com/iframe_api";
                tag.type = "text/javascript";

                const firstScriptTag = document.getElementsByTagName("script")[0];
                firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
                Logger.Log("Downloading YoutubeIframeApi...");
            }
        });
    }

    private constructor() {
        this.playersMap = new Map<string, YT.Player>();
    }

    public static getInstance(): YoutubeIframeApi {
        if (!YoutubeIframeApi.instance) {
            throw new Error("Tried to get YoutubeIframeApi before initialization!");
        }

        return this.instance;
    }

    getPlayer(containerId: number, videoId: string): YT.Player | undefined {
        const playerId = this.getIdString(containerId, videoId);
        return this.playersMap.get(playerId);
    }

    async createPlayer(containerId: number, videoId: string): Promise<YT.Player> {
        const playerId = this.getIdString(containerId, videoId);

        if (this.playersMap.has(playerId)) {
            throw Error("Player already exists for this audio container!");
        }

        return new Promise<YT.Player>((resolve, reject) => {
            let player: YT.Player;

            const onPlayerError = function (event: YT.OnErrorEvent) {
                let errorMessage: string;
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

            player = new YT.Player(playerId, {
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

    async destroyPlayer(containerId: number, videoId: string) {
        const playerId = this.getIdString(containerId, videoId);
    }

    private getIdString(containerId: number, videoId: string) {
        return `bellows-yt-iframe-${containerId}-${videoId}`;
    }
}