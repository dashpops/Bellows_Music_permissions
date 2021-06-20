export class PlaylistSoundPatch {
    static patch() {
        const originalFunction = PlaylistSound.prototype._createSound;

        PlaylistSound.prototype._createSound = function () {
            alert("Monkey patched PlaylistSound!");
            return originalFunction.apply(this);
        }
    }
}