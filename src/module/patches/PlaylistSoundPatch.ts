export class PlaylistSoundPatch {
    static patch() {
        const originalFunction = PlaylistSound.prototype._createSound;

        PlaylistSound.prototype._createSound = function () {
            return originalFunction.apply(this);
        }
    }
}