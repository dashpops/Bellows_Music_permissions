import { YoutubeStreamIdExtractor } from "./YoutubeStreamIdExtractor";

export class StreamIdExtractorFactory {
    static getStreamIdExtractor(api: string): StreamIdExtractor {
        switch(api) {
            case "youtube":
                return new YoutubeStreamIdExtractor
            default:
                throw new Error("No extractor exists for given API");
        }
    }
}