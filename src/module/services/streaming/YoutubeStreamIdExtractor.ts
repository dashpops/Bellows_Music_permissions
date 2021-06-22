export class YoutubeStreamIdExtractor implements StreamIdExtractor {
    extract(uri: string): string {
        /**
         * Url regex string credit https://stackoverflow.com/questions/3717115/regular-expression-for-youtube-links
         * should work for any given youtube link
         */
        const urlRegEx = /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)[\w\=]*)?/
		//Plain video key
		const keyRegEx = /^[a-zA-Z0-9_-]+$/
		
		if (!uri || uri.length === 0) {
			throw new Error("Cannot extract an empty URI");
		}
		
		var matches = urlRegEx.exec(uri);
		if (matches) {
			return matches[1];
		} else {
			const match = uri.match(keyRegEx);
            if (match) {
                return match[0];
            } else {
                throw new Error ("Invalid video Id");
            }
		}
    }
}