export class AmbientSoundPatch {
    static patch() {
        const originalFunction = AmbientSound.prototype._createSound;

        AmbientSound.prototype._createSound = function () {
            alert("Monkey patched AmbientSound!");
            return originalFunction.apply(this);
        }
    }
}