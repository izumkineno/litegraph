import { CoreController } from "./core-controller.js";
import { EventsController } from "./events-controller.js";
import { RenderController } from "./render-controller.js";
import { SelectionController } from "./selection-controller.js";
import { UiController } from "./ui-controller.js";

export function createLGraphCanvasControllers(host) {
    return {
        core: new CoreController(host),
        events: new EventsController(host),
        render: new RenderController(host),
        selection: new SelectionController(host),
        ui: new UiController(host),
    };
}
