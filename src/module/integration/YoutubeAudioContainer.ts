import { YoutubeIframeApi } from "../api/YoutubeIframeApi";

export class YoutubeAudioContainer implements AudioContainer {
    src: string;
    isBuffer: boolean = false;
    loaded: boolean = false;
    playing: boolean = false;
    duration: number = 0;

    player: YT.Player | undefined;

    private static _containerId = 0;

    constructor(src: string) {
        this.src = src;
    }

    async load(): Promise<void> {
        if (!this.player) {
            this.player = await YoutubeIframeApi.getInstance().createPlayer(YoutubeAudioContainer._containerId++, this.src);
        }
    }

    play(offset: number, onended: Function): void {
        throw new Error("Method not implemented.");
    }

    stop(): void {
        throw new Error("Method not implemented.");
    }
}