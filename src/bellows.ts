import { ImportPlaylistFeature } from "./module/features/ImportPlaylistFeature";
import { TemplatePreloader } from "./module/helper/TemplatePreloader";

Hooks.once("init", async () =>
{
    console.log('Bellows | Initializing Bellows - The lungs of the Foundry!');

    await TemplatePreloader.preloadHandlebarsTemplates();
});

Hooks.once("ready", async () => {
    console.log('Bellows | Initialized Bellows');
});

/* 
 * Feature Hooks
 */

ImportPlaylistFeature.hooks();

if (module.hot) {
    module.hot.accept();
    if (module.hot.status() === "apply") {
        for (const template in _templateCache) {
            if (Object.prototype.hasOwnProperty.call(_templateCache, template)) {
                delete _templateCache[template];
            }
        }
        
        TemplatePreloader.preloadHandlebarsTemplates().then(() => {
            for (const application in ui.windows) {
                if (Object.prototype.hasOwnProperty.call(ui.windows, application)) {
                    ui.windows[application].render(true);
                }
            }
        });
    }
}