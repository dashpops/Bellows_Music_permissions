
export class StreamingSound implements Sound {
    
    id: number;
    src: string;
    container: AudioContainer;
    startTime: number | undefined;
    pausedTime: number | undefined;
    event: { stop: {}; start: {}; end: {}; pause: {}; load: {}; };
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

    fade(volume: number, options: { duration: number; from: number; type: string; }): Promise<void> {
        throw new Error("Method not implemented.");
    }
    load(options: { autoplay: boolean; autoplayOptions: {}; }): Promise<Sound> {
        throw new Error("Method not implemented.");
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
    on(eventName: string, fn: Function, options: { once: boolean; }) {
        throw new Error("Method not implemented.");
    }

}