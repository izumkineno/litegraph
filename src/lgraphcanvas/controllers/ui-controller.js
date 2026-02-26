import * as ui_menus from "../modules/ui-menus.js";
import * as ui_dialogs_panels_search from "../modules/ui-dialogs-panels-search.js";

export class UiController {
    constructor(host) {
        this.host = host;
    }

    showLinkMenu(...args) {
        return ui_menus.showLinkMenu.apply(this.host, args);
    }

    createDefaultNodeForSlot(...args) {
        return ui_menus.createDefaultNodeForSlot.apply(this.host, args);
    }

    showConnectionMenu(...args) {
        return ui_menus.showConnectionMenu.apply(this.host, args);
    }

    getCanvasMenuOptions(...args) {
        return ui_menus.getCanvasMenuOptions.apply(this.host, args);
    }

    getNodeMenuOptions(...args) {
        return ui_menus.getNodeMenuOptions.apply(this.host, args);
    }

    getGroupMenuOptions(...args) {
        return ui_menus.getGroupMenuOptions.apply(this.host, args);
    }

    processContextMenu(...args) {
        return ui_menus.processContextMenu.apply(this.host, args);
    }

    prompt(...args) {
        return ui_dialogs_panels_search.prompt.apply(this.host, args);
    }

    showSearchBox(...args) {
        return ui_dialogs_panels_search.showSearchBox.apply(this.host, args);
    }

    showEditPropertyValue(...args) {
        return ui_dialogs_panels_search.showEditPropertyValue.apply(this.host, args);
    }

    createDialog(...args) {
        return ui_dialogs_panels_search.createDialog.apply(this.host, args);
    }

    createPanel(...args) {
        return ui_dialogs_panels_search.createPanel.apply(this.host, args);
    }

    closePanels(...args) {
        return ui_dialogs_panels_search.closePanels.apply(this.host, args);
    }

    showShowGraphOptionsPanel(...args) {
        return ui_dialogs_panels_search.showShowGraphOptionsPanel.apply(this.host, args);
    }

    showShowNodePanel(...args) {
        return ui_dialogs_panels_search.showShowNodePanel.apply(this.host, args);
    }

    showSubgraphPropertiesDialog(...args) {
        return ui_dialogs_panels_search.showSubgraphPropertiesDialog.apply(this.host, args);
    }

    showSubgraphPropertiesDialogRight(...args) {
        return ui_dialogs_panels_search.showSubgraphPropertiesDialogRight.apply(this.host, args);
    }

    checkPanels(...args) {
        return ui_dialogs_panels_search.checkPanels.apply(this.host, args);
    }

}
