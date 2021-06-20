interface Sound {
    id: number;
    src: string;
    container: AudioContainer;
    startTime: number | undefined;
    pausedTime: number | undefined;
    event: { stop: {}, start: {}, end: {}, pause: {}, load: {} };
    loading: Promise<void> | undefined;
    context: AudioContext;
    node: AudioBufferSourceNode | MediaElementAudioSourceNode;
    gain: AudioParam;
    currentTime: number;
    duration: number;
    loaded: boolean;
    playing: boolean;
    loop: boolean;
    volume: number;
    fade(volume: number, options: { duration: number, from: number, type: string }): Promise<void>;
    load(options: { autoplay: boolean, autoplayOptions: {} }): Promise<Sound>;
    play(loop: boolean, options: { offset: number, volume: number, fade: number });
    pause();
    stop();
    schedule(fn: Function, playbackTime: number): Promise<null>;
    emit(eventName: string);
    off(eventName: string, fn: number | Function);
    on(eventName: string, fn: Function, options: { once: boolean });
}