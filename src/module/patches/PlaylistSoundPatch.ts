import { StreamIdExtractorFactory } from "../services/streaming/StreamIdExtractorFactory";
import Logger from "../helper/Utils";

export class PlaylistSoundPatch {
    static patch() {
        const createSoundFunction = PlaylistSound.prototype._createSound;

        PlaylistSound.prototype._createSound = function () {
            return createSoundFunction.apply(this);
        }

        //Protected functions - get around that by ignoring.
        // @ts-ignore
        const updateObjectFunction = PlaylistSoundConfig.prototype._updateObject

        // @ts-ignore
        PlaylistSoundConfig.prototype._updateObject = function (event: Event, formData: any) {
            if (!game.user?.isGM) throw "You do not have the ability to configure an PlaylistSound object.";

            if (!formData.streamed) {
                updateObjectFunction.apply(this, [event, formData]);
                return;
            }

            formData["volume"] = AudioHelper.inputToVolume(formData["lvolume"]);

            formData.path = 'streamed.mp3';
            formData.flags = {
                bIsStreamed: formData.streamed,
                streamingApi: formData.streamType,
                streamingId: formData.streamurl,
            };

            if (this.object.id)  return this.object.update(formData);
            return this.object.constructor.create(formData, {parent: this.object.parent});
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

            inputStreamUrl.on('change', evt => {
                const url = inputStreamUrl.val() as string;
                if (url && url.length > 0) {
                    const extractor = StreamIdExtractorFactory.getStreamIdExtractor(selectStreamType.val() as string);

                    try {
                        const id = extractor.extract(url);
                    } catch (ex) {
                        Logger.LogError(ex);
                    }
                    sender.setPosition();
                }
            });

            adjustVisibility(bIsStreamed);

            sender.options.height = 'auto';
            sender.setPosition();
        })
    }
}