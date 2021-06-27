import { YoutubeStreamIdExtractor } from "../services/streaming/YoutubeStreamIdExtractor";
import { StreamType } from "../../types/streaming/streamType";

export class StreamIdExtractorFactory {
    static getStreamIdExtractor(api: StreamType): StreamIdExtractor {
        switch(api) {
            case StreamType.youtube:
                return new YoutubeStreamIdExtractor();
            default:
                throw new Error("No extractor is registered for given StreamType");
        }
    }
}