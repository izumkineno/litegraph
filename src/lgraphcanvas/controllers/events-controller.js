import * as events_pointer from "../modules/events-pointer.js";
import * as events_keyboard_drop from "../modules/events-keyboard-drop.js";

export class EventsController {
    constructor(host) {
        this.host = host;
    }

    processUserInputDown(...args) {
        return events_pointer.processUserInputDown.apply(this.host, args);
    }

    processMouseDown(...args) {
        return events_pointer.processMouseDown.apply(this.host, args);
    }

    processMouseMove(...args) {
        return events_pointer.processMouseMove.apply(this.host, args);
    }

    processMouseUp(...args) {
        return events_pointer.processMouseUp.apply(this.host, args);
    }

    processMouseWheel(...args) {
        return events_pointer.processMouseWheel.apply(this.host, args);
    }

    blockClick(...args) {
        return events_keyboard_drop.blockClick.apply(this.host, args);
    }

    processKey(...args) {
        return events_keyboard_drop.processKey.apply(this.host, args);
    }

    processDrop(...args) {
        return events_keyboard_drop.processDrop.apply(this.host, args);
    }

    checkDropItem(...args) {
        return events_keyboard_drop.checkDropItem.apply(this.host, args);
    }

}
