import { StreamType } from "../../types/streaming/streamType";
import { YoutubeIframeApi } from "../api/YoutubeIframeApi";
import { StreamSoundFactory } from "../factories/StreamSoundFactory";
import Logger from "../helper/Utils";

export class YoutubeStreamSound implements Sound {

    id: number;
    src: string;
    player: YT.Player | undefined;
    startTime: number | undefined;
    pausedTime: number | undefined;
    event: { stop: {}; start: {}; end: {}; pause: {}; load: {}; } | undefined;
    loading: Promise<YT.Player> | undefined;
    context: AudioContext | undefined;
    node: AudioBufferSourceNode | MediaElementAudioSourceNode | undefined;
    gain: AudioParam | undefined;
    currentTime: number = 0;
    duration: number = 0;
    loaded: boolean = false;
    playing: boolean = false;
    loop: boolean = false;
    volume: number = 0;

    constructor(src: any) {
        this.src = src;
        //@ts-ignore -- missing static var from community types, safe to ignore.
        this.id = ++Sound._nodeId;
    }

    fade(volume: number, options: { duration: number; from: number; type: string; }): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async load({autoplay=false, autoplayOptions={}}={}): Promise<Sound> {
        // Foundry delayed loading - await user gesture
        if (game.audio.locked) {
            Logger.LogDebug(`Delaying load of youtube stream sound ${this.src} until after first user gesture`);

            //@ts-ignore -- types incorrectly define pending as an Array<Howl> - just an array of functions...
            await new Promise(resolve => game.audio.pending.push(resolve));
        }

        if (this.loading instanceof Promise) await this.loading;

        if (!this.player) {
            this.loading =  YoutubeIframeApi.getInstance().createPlayer(this.id, this.src);
            await this.loading;
            this.loading = undefined;
        }

        // Trigger automatic playback actions
        if (autoplay) this.play(autoplayOptions);
        return this;
    }

    play(loop: boolean, options: { offset: number; volume: number; fade: number; }) {
        throw new Error("Method not implemented.");
    }

    pause() {
        throw new Error("Method not implemented.");
    }

    stop() {
        throw new Error("Method not implemented.");
    }

    schedule(fn: Function, playbackTime: number): Promise<null> {
        throw new Error("Method not implemented.");
    }

    emit(eventName: string) {
        throw new Error("Method not implemented.");
    }

    off(eventName: string, fn: number | Function) {
        throw new Error("Method not implemented.");
    }

    on(eventName: string, fn: Function, options: { once: boolean; } = { once: true }) {
        throw new Error("Method not implemented.");
    }
}