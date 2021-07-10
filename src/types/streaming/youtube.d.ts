/*
* Enums from the @types/youtube package are not compiled to output, so we redefine them as consts here and import them as needed.
* Probably a better way to do this...
*/
export const enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5
}

export const enum PlayerError {
    InvalidParam = 2,
    Html5Error = 5,
    VideoNotFound = 100,
    EmbeddingNotAllowed = 101,
    EmbeddingNotAllowed2 = 150
}