import { StreamType } from "../../types/streaming/streamType";
import { AudioContainerFactory } from "../factories/AudioContainerFactory";

export class StreamingSound implements Sound {
    
    id: number;
    streamType: StreamType;
    src: string;
    container: AudioContainer;
    startTime: number | undefined;
    pausedTime: number | undefined;
    event: { stop: {}; start: {}; end: {}; pause: {}; load: {}; } | undefined;
    loading: Promise<void> | undefined;
    context: AudioContext | undefined;
    node: AudioBufferSourceNode | MediaElementAudioSourceNode | undefined;
    gain: AudioParam | undefined;
    currentTime: number = 0;
    duration: number = 0;
    loaded: boolean = false;
    playing: boolean = false;
    loop: boolean = false;
    volume: number = 0;

    constructor(streamType: StreamType, src: any) {
       this.streamType = streamType; 
       this.src = src;
       //@ts-ignore -- missing static var from community types, safe to ignore.
       this.id = ++Sound._nodeId;

       this.container =  AudioContainerFactory.getAudioContainer(streamType, src);
    }

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
    on(eventName: string, fn: Function, options: { once: boolean; } = { once: true }) {
        throw new Error("Method not implemented.");
    }
}