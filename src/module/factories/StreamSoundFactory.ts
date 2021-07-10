import { StreamType } from "../../types/streaming/streamType";
import { YoutubeStreamSound as YoutubeStreamSound } from "../integration/YoutubeStreamSound";

export class StreamSoundFactory {
    static getStreamSound(api: StreamType, src: string, preload = false): Sound {
        switch(api) {
            case StreamType.youtube:
                return new YoutubeStreamSound(src, preload);
            default:
                throw new Error("No Stream Sound is registered for given StreamType");
        }
    }
}