import { PlaylistImportForm } from "../applications/PlaylistImportForm";

export class ImportPlaylistFeature {
    static hooks() {
        Hooks.on("renderPlaylistDirectory", (html) => {
            if (!game.user?.isGM) {
                return;
            }

            const importButton = $(`
                <button class="import-yt-playlist">
                    <i class="fab fa-youtube"></i> ${game.i18n.localize('bellows.import-yt-playlist-nav-text')}
                </button>`);
                
            html.find(".directory-footer").append(importButton);

            importButton.on("click", () => {
                new PlaylistImportForm({}, {}).render(true);
            });	
        });
    }
}