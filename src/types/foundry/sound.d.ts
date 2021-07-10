/**
 * Simple interface to represent the Foundry VTT Sound at compile time. Can be removed once the typescript types are updated in the community types package.
 * This is NOT a complete interface.
 */
interface Sound {
    id: number;
    src: string;
    startTime: number | undefined;
    pausedTime: number | undefined;
    events: { stop: {} , start: {}, end: {}, pause: {}, load: {} } | undefined;
    context: AudioContext | undefined;
    node: AudioBufferSourceNode | MediaElementAudioSourceNode | undefined;
    gain: AudioParam | undefined;
    readonly currentTime: number | undefined;
    readonly duration: number | undefined;
    loaded: boolean;
    readonly playing: boolean;
    loop: boolean;
    volume: number;
    fade(volume: number, options: { duration: number, from: number, type: string }): Promise<void>;
    load(options: { autoplay: boolean, autoplayOptions: {} }): Promise<Sound>;
    play(options: { loop: boolean; offset: number; volume: number; fade: number; });
    pause();
    stop();
    schedule(fn: Function, playbackTime: number): Promise<void>;
    emit(eventName: string);
    off(eventName: string, fn: number | Function);
    on(eventName: string, fn: Function, options?: { once?: boolean});
}