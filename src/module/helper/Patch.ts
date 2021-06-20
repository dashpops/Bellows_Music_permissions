import { AmbientSoundPatch } from "../patches/AmbientSoundPatch";
import { PlaylistSoundPatch } from "../patches/PlaylistSoundPatch";

export class BellowsPatch {
    static patchFunctions() {
        PlaylistSoundPatch.patch();
        AmbientSoundPatch.patch();
    }
}