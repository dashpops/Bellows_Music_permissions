/**
 * Simple interface to represent the Foundry VTT AudioContainer at compile time. Can be removed once the typescript types are updated in the community types package.
 * This is NOT a complete interface.
 */
interface AudioContainer {
    sourceNode: AudioBufferSourceNode | MediaElementAudioSourceNode | undefined;
    gainNode: GainNode | undefined;
    isBuffer: boolean;
    loaded: boolean;
    playing: boolean;
    duration: number;
    buffer: AudioBuffer;
    context: AudioContext;
    element: HTMLMediaElement;
    load(): Promise<void>;
    play(offset: number, onended: Function): void;
    stop(): void;
}