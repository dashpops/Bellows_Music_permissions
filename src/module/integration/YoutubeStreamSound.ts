import { PlayerState } from "../../types/streaming/youtube";
import { YoutubeIframeApi } from "../api/YoutubeIframeApi";
import Logger from "../helper/Utils";

export class YoutubeStreamSound implements Sound {

    id: number;
    src: string;
    private _player: YT.Player | undefined;
    private _fadeIntervalHandler: number | undefined;
    private _loop = false;
    private _scheduledEvents = new Set<number>();
    private _eventHandlerId = 1;
    private _loaded = false;
    startTime: number | undefined;
    pausedTime: number | undefined;
    events = { stop: {}, start: {}, end: {}, pause: {}, load: {}, };
    loading: Promise<YT.Player> | undefined;
    context: AudioContext | undefined;
    node: AudioBufferSourceNode | MediaElementAudioSourceNode | undefined;
    gain: AudioParam | undefined;

    public get volume(): number {
        if (!this._player) {
            throw new Error("Cannot get volume of uninitialised player!");
        }

        return this._player.getVolume();
    }

    public set volume(volume: number) {
        if (!this._player) {
            throw new Error("Cannot set volume of uninitialised player!");
        }

        this._player.setVolume(volume);
    }

    public get currentTime(): number | undefined {
        if (!this._player) {
            Logger.LogError("Cannot get current time of uninitialised player!");
            return undefined;
        }

        return this._player.getCurrentTime();
    }

    public get duration(): number {
        if (!this._player) {
            this.load().then(s => {
                return s.duration;
            });
        }

        return this._player?.getDuration() ?? 0;
    }

    public get playing(): boolean {
        return (this._player?.getPlayerState() as unknown as PlayerState == PlayerState.PLAYING ?? false)
    }

    public get loop() {
        return this._loop;
    }

    public set loop(looping) {
        if (!this._player) return;
        this._player.setLoop(looping);
        this._loop = looping;
    }

    public get loaded() {
        return this._loaded;
    }

    private set loaded(loaded: boolean) {
        this._loaded = loaded;
    }

    constructor(src: any) {
        this.src = src;
        //@ts-ignore -- missing static var from community types, safe to ignore.
        this.id = ++Sound._nodeId;
    }

    //currently don't support type - uses sin easing function
    async fade(volume: number, { duration = 1000, from }: { duration?: number; from?: number; type?: string }): Promise<void> {
        if (!this._player) return;

        //Current only support linear fade
        const currentVolume = from ?? this._player.getVolume();
        const delta = volume - currentVolume;

        if (delta == 0) {
            return Promise.resolve();
        }

        //clear existing handler
        if (this._fadeIntervalHandler) {
            clearInterval(this._fadeIntervalHandler);
        }

        const tickrate = 100;
        const ticks = Math.floor(duration / tickrate);

        let tick = 1;

        return new Promise(resolve => {
            this._fadeIntervalHandler = window.setInterval(() => {
                this._player?.setVolume(currentVolume + (this._sinEasing(tick / ticks) * delta));

                if (++tick === ticks + 1) {
                    clearInterval(this._fadeIntervalHandler);
                    this._fadeIntervalHandler = undefined;
                    resolve();
                }
            }, tickrate)
        });
    }

    async load({ autoplay = false, autoplayOptions = {} } = {}): Promise<Sound> {
        // Foundry delayed loading - await user gesture
        if (game.audio.locked) {
            Logger.LogDebug(`Delaying load of youtube stream sound ${this.src} until after first user gesture`);

            //@ts-ignore -- types incorrectly define pending as an Array<Howl> - just an array of functions...
            await new Promise(resolve => game.audio.pending.push(resolve));
        }

        if (this.loading instanceof Promise) await this.loading;

        if (!this._player) {
            this.loading = YoutubeIframeApi.getInstance().createPlayer(this.id, this.src);
            this._player = await this.loading;
            this.loading = undefined;
            this.loaded = true;
        }

        // Trigger automatic playback actions
        if (autoplay) this.play(autoplayOptions);

        return this;
    }

    play({ loop = false, offset, volume, fade = 0 }: { loop?: boolean; offset?: number; volume?: number; fade?: number; } = {}) {
        if (!this.loaded) {
            return Logger.LogError(`You cannot play youtube stream sound ${this.src} before it has loaded`);
        }

        // If we are still awaiting the first user interaction, add this playback to a pending queue
        if (game.audio.locked) {
            Logger.LogDebug(`Delaying playback of youtube stream sound ${this.src} until after first user gesture`);

            //@ts-ignore -- types incorrectly define pending as an Array<Howl> - just an array of functions...
            return game.audio.pending.push(() => this.play({ loop, offset, volume, fade }));
        }

        const adjust = () => {
            this.loop = loop;
            if ((volume !== undefined) && (volume !== this.volume)) {
                if (fade) return this.fade(volume, { duration: fade });
                else this.volume = volume * 100; //foundry volume is between 0 & 1, YT player volume is between 0 and 100
            }
            return;
        }

        // If the sound is already playing, and a specific offset is not provided, do nothing
        if (this.playing) {
            if (offset === undefined) return adjust();
            this.stop();
        }

        // Configure playback
        offset = (offset ?? this.pausedTime ?? 0) % this.duration;
        this.startTime = this.currentTime;
        this.pausedTime = undefined;

        // Start playback
        this.volume = 0; // Start volume at 0
        this._player?.playVideo()
        this._player?.seekTo(offset, true);
        this._player?.addEventListener<YT.OnStateChangeEvent>('onStateChange', this._onEnd.bind(this));
        adjust(); // Adjust to the desired volume
        this._onStart();
    }

    pause() {
        this.pausedTime = this.currentTime;
        this.startTime = undefined;
        this._player?.pauseVideo();
        this._onPause();
    }

    stop() {
        if (this.playing === false) return;
        this.pausedTime = undefined;
        this.startTime = undefined;
        this._player?.stopVideo();
        this._onStop();
    }

    /* eslint-disable */
    schedule(fn: Function, playbackTime: number): Promise<void> {
        /* eslint-enable */
        const now = this.currentTime ?? 0;
        playbackTime = Math.clamped(playbackTime, 0, this.duration);
        if (playbackTime < now) playbackTime += this.duration;
        const deltaMS = (playbackTime - now) * 1000;
        return new Promise(resolve => {
            const timeoutId = setTimeout(() => {
                this._scheduledEvents.delete(timeoutId);
                fn(this);
                return resolve();
            }, deltaMS);
            this._scheduledEvents.add(timeoutId);
        });
    }

    emit(eventName: string) {
        const events = this.events[eventName]
        if (!events) return;
        for (const [fnId, callback] of Object.entries(events)) {
            //@ts-ignore -- typings stuff. Safe to ignore.
            callback.fn(this);
            //@ts-ignore
            if (callback.once) delete events[fnId];
        }
    }

    /* eslint-disable */
    off(eventName: string, fn: number | Function) {
        /* eslint-enable */
        const events = this.events[eventName];
        if (!events) return;
        if (Number.isNumeric(fn)) delete events[fn];
        for (const [id, f] of Object.entries(events)) {
            if (f === fn) {
                delete events[id];
                break;
            }
        }
    }
    /* eslint-disable */
    on(eventName: string, fn: Function, { once = false } = {}) {
        /* eslint-enable */
        return this._registerForEvent(eventName, { fn, once });
    }

    /* eslint-disable */
    private _registerForEvent(eventName, callback: { fn: Function, once?: boolean }) {
        /* eslint-enable */
        const events = this.events[eventName];
        if (!events) return;
        const fnId = this._eventHandlerId++;
        events[fnId] = callback;
        return fnId;
    }

    private _sinEasing(x: number) {
        return 1 - Math.cos((x * Math.PI) / 2);
    }

    /* -------------------------------------------- */

    protected _clearEvents() {
        for (const timeoutId of this._scheduledEvents) {
            window.clearTimeout(timeoutId)
        }
        this._scheduledEvents.clear();
    }

    protected _onEnd(e: YT.OnStateChangeEvent) {
        console.log("_onEnd Called!")
        if (e.data as unknown as PlayerState == PlayerState.ENDED) {
            this._clearEvents();
            //@ts-ignore
            game.audio.playing.delete(this.id);
            this.emit("end");
        }
    }

    protected _onLoad() {
        this.emit("load");
    }

    protected _onPause() {
        this._clearEvents();
        this.emit("pause");
    }

    protected _onStart() {
        //@ts-ignore
        game.audio.playing.set(this.id, this);
        this.emit("start");
    }

    protected _onStop() {
        this._clearEvents();
        //@ts-ignore
        game.audio.playing.delete(this.id);
        this.emit("stop");
    }
}