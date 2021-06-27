import { YoutubeAudioContainer } from "../integration/YoutubeAudioContainer";
import { StreamType } from "../../types/streaming/streamType";

export class AudioContainerFactory {
    static getAudioContainer(api: StreamType, src: string): AudioContainer {
        switch(api) {
            case StreamType.youtube:
                return new YoutubeAudioContainer(src);
            default:
                throw new Error("No Audio Container is registered for given StreamType");
        }
    }
}