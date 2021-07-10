export class AmbientSoundPatch {
    static patch() {
        const originalFunction = AmbientSound.prototype._createSound;

        AmbientSound.prototype._createSound = function () {
            return originalFunction.apply(this);
        }
    }
}