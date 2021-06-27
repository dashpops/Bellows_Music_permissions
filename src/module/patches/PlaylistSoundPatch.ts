import { StreamIdExtractorFactory } from "../factories/StreamIdExtractorFactory";
import Logger from "../helper/Utils";
import { StreamingSound } from "../integration/StreamingSound";

export class PlaylistSoundPatch {
    static patch() {
        const createSoundFunction = PlaylistSound.prototype._createSound;

        PlaylistSound.prototype._createSound = function () {
            if (!hasProperty(this, "data.flags.bIsStreamed") || !this.data.flags.bIsStreamed) {
                return createSoundFunction.apply(this);
            }
            
            const sound = new StreamingSound(this.data.flags.streamingApi, this.data.flags.streamingId);

            sound.on("start", this._onStart.bind(this));
            sound.on("end", this._onEnd.bind(this));
            sound.on("stop", this._onStop.bind(this));
            
            return sound;
        }

        //Protected function - get around that by ignoring typescript errors.
        // @ts-ignore
        const updateObjectFunction = PlaylistSoundConfig.prototype._updateObject

        // @ts-ignore
        PlaylistSoundConfig.prototype._updateObject = function (event: Event, formData: any) {
            if (!game.user?.isGM) throw new Error("You do not have the ability to configure a PlaylistSound object.");

            if (!formData.streamed) {
                updateObjectFunction.apply(this, [event, formData]);
                return;
            }

            const extractor = StreamIdExtractorFactory.getStreamIdExtractor(formData.streamtype);
            let streamId: string;
            try {
                streamId = extractor.extract(formData.streamurl);
            } catch (ex) {
                Logger.LogError(ex);
                throw new Error(game.i18n.localize("Bellows.PlaylistConfig.Errors.InvalidUri"));
            }

            formData["volume"] = AudioHelper.inputToVolume(formData["lvolume"]);

            formData.path = 'streamed.mp3';
            formData.flags = {
                bIsStreamed: formData.streamed,
                streamingApi: formData.streamType,
                streamingId: streamId,
            };

            if (this.object.id) return this.object.update(formData);
            return this.object.constructor.create(formData, { parent: this.object.parent });
        }

        Hooks.on("renderPlaylistSoundConfig", (sender, html, data) => {
            //TODO: Hacky and fragile. Rewrite
            const bIsStreamed = (data.flags || {}).bIsStreamed || false;
            //const streamType = (data.flags || {}).streamingApi || "";
            const streamId = (data.flags || {}).streamingId || "";

            const audioUrlDiv = $(html).find("div.form-fields input[name='path']").parent().parent();

            audioUrlDiv.before(`
            <div class="form-group">
                <label>${game.i18n.localize("Bellows.PlaylistConfig.Labels.Streamed")}</label>
                <input type="checkbox" name="streamed" data-dtype="Boolean" ${bIsStreamed ? "checked" : ""} />
            </div>`);

            audioUrlDiv.after(`
            <div class="form-group">
                <label>
                    ${game.i18n.localize("Bellows.PlaylistConfig.Labels.AudioUrl")}
                </label>
                <input type="text" name="streamurl" data-dtype="Url" value="${streamId}" />
            </div>
            `);

            audioUrlDiv.after(`
            <div class="form-group">
                <label>
                    ${game.i18n.localize("Bellows.PlaylistConfig.Labels.StreamType")}
                </label>
                <select name="streamtype" disabled>
                    <option value="youtube" selected>${game.i18n.localize("Bellows.PlaylistConfig.Selects.StreamTypes.Youtube")}</option>
                </select>
            </div>
            `);

            const inputIsStreamed = $(html).find("input[name='streamed']");
            const inputStreamUrl = $(html).find("input[name='streamurl']");
            const selectStreamType = $(html).find("select[name='streamtype']");

            const adjustVisibility = (isStream) => {
                audioUrlDiv.css('display', !isStream ? "flex" : "none");
                inputStreamUrl.parent().css("display", isStream ? "flex" : "none");
                selectStreamType.parent().css("display", isStream ? "flex" : "none")
            };

            inputIsStreamed.on('change', evt => {
                const chkEvent = evt as JQuery.ChangeEvent<HTMLElement, undefined, HTMLElement, HTMLInputElement>
                adjustVisibility(chkEvent.target.checked);
                sender.setPosition();
            });

            adjustVisibility(bIsStreamed);

            sender.options.height = 'auto';
            sender.setPosition();
        })
    }
}