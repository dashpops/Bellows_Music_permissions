import { StreamIdExtractorFactory } from "../factories/StreamIdExtractorFactory";
import { StreamSoundFactory } from "../factories/StreamSoundFactory";
import { StreamType } from "../../types/streaming/streamType";
import Logger from "../helper/Utils";

export class PlaylistSoundPatch {
    static patch() {
        const createSoundFunction = PlaylistSound.prototype._createSound;

        PlaylistSound.prototype._createSound = function () {
            if (!hasProperty(this, "data.flags.bIsStreamed") || !this.data.flags.bIsStreamed) {
                return createSoundFunction.apply(this);
            }

            const sound = StreamSoundFactory.getStreamSound(this.data.flags.streamingApi, this.data.flags.streamingId);

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

            if (!formData.streamed) {
                updateObjectFunction.apply(this, [event, formData]);
                return;
            }

            const streamType = StreamType[formData.streamtype as string];
            const extractor = StreamIdExtractorFactory.getStreamIdExtractor(streamType);
            let streamId: string;
            try {
                streamId = extractor.extract(formData.streamurl);
            } catch (ex) {
                Logger.LogError(ex);
                throw new Error(game.i18n.localize("Bellows.PlaylistConfig.Errors.InvalidUri"));
            }

            formData["volume"] = AudioHelper.inputToVolume(formData["lvolume"]);

            formData.path = `${streamId}.mp3`;
            formData.flags = {
                bIsStreamed: formData.streamed,
                streamingApi: streamType,
                streamingId: streamId,
            };

            if (this.object.id) return this.object.update(formData);
            return this.object.constructor.create(formData, { parent: this.object.parent });
        }

        Hooks.on("renderPlaylistSoundConfig", (sender, html, data) => {
            //TODO: Hacky and fragile. Rewrite
            const bIsStreamed = (data.data.flags || {}).bIsStreamed || false;
            //const streamType = (data.flags || {}).streamingApi || "";
            const streamId = (data.data.flags || {}).streamingId || "";

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
                <select name="streamtype">
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
