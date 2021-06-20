
export class YoutubeAudioContainer implements AudioContainer {
    
    sourceNode: AudioBufferSourceNode | MediaElementAudioSourceNode | undefined;
    gainNode: GainNode | undefined;
    isBuffer: boolean;
    loaded: boolean;
    playing: boolean;
    duration: number;
    buffer: AudioBuffer;
    context: AudioContext;
    element: HTMLMediaElement;

    load(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    play(offset: number, onended: Function): void {
        throw new Error("Method not implemented.");
    }
    stop(): void {
        throw new Error("Method not implemented.");
    }

}