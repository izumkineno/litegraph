import { LiteGraph } from "./litegraph.js";
import { normalizeContextMenuOptions } from "./contextmenu/modules/options.js";
import { linkContextMenuToParent, validateContextMenuEventClass } from "./contextmenu/modules/parenting-validation.js";
import {
    createContextMenuRoot,
    setContextMenuTitle,
    addContextMenuItems,
    resolveContextMenuHost,
    appendContextMenuRoot,
} from "./contextmenu/modules/root-dom.js";
import { bindContextMenuRootEvents } from "./contextmenu/modules/root-events.js";
import { setupContextMenuFiltering } from "./contextmenu/modules/filtering.js";
import { calculateContextMenuBestPosition } from "./contextmenu/modules/positioning.js";
import { createContextMenuItem } from "./contextmenu/modules/item-actions.js";
import { closeContextMenuInstance } from "./contextmenu/modules/close-flow.js";
import {
    closeAllContextMenus,
    triggerContextMenuEvent,
    isCursorOverContextElement,
} from "./contextmenu/modules/statics.js";

export class ContextMenu {

    /**
    * @constructor
    * @param {Array<Object>} values (allows object { title: "Nice text", callback: function ... })
    * @param {Object} options [optional] Some options:\
    * - title: title to show on top of the menu
    * - callback: function to call when an option is clicked, it receives the item information
    * - ignore_item_callbacks: ignores the callback inside the item, it just calls the options.callback
    * - event: you can pass a MouseEvent, this way the ContextMenu appears in that position
    *
    *   Rendering notes: This is only relevant to rendered graphs, and is rendered using HTML+CSS+JS.
    */
    constructor(values, options = {}) {
        this.options = normalizeContextMenuOptions(options);
        this.menu_elements = [];

        this.#linkToParent();
        this.#validateEventClass();
        this.#createRoot();
        this.#bindEvents();
        this.setTitle(this.options.title);
        this.addItems(values);
        this.#insertMenu();
        this.#calculateBestPosition();
    }

    #createRoot() {
        return createContextMenuRoot(this);
    }

    #bindEvents() {
        bindContextMenuRootEvents(this);
    }

    #linkToParent() {
        linkContextMenuToParent(this, LiteGraph);
    }

    #validateEventClass() {
        validateContextMenuEventClass(this, LiteGraph);
    }

    /**
     * Creates a title element if it doesn't have one.
     * Sets the title of the menu.
     * @param {string} title - The title to be set.
     */
    setTitle(title) {
        setContextMenuTitle(this, title);
    }

    /**
     * Adds a set of values to the menu.
     * @param {Array<string|object>} values - An array of values to be added.
     */
    addItems(values) {
        addContextMenuItems(this, values);
    }

    #insertMenu() {
        const { doc, parent } = resolveContextMenuHost(this);
        if (LiteGraph.context_menu_filter_enabled && !this.options.parentMenu) {
            setupContextMenuFiltering(this, doc, this.root, LiteGraph);
        }
        appendContextMenuRoot(this, parent);
    }

    #calculateBestPosition() {
        calculateContextMenuBestPosition(this, LiteGraph);
    }

    /**
     * Adds an item to the menu.
     * @param {string} name - The name of the item.
     * @param {object | null} value - The value associated with the item.
     * @param {object} [options={}] - Additional options for the item.
     * @returns {HTMLElement} - The created HTML element representing the added item.
     */
    addItem(name, value, options = {}) {
        return createContextMenuItem(this, name, value, options, LiteGraph);
    }

    /**
     * Closes this menu.
     * @param {Event} [e] - The event that triggered the close action.
     * @param {boolean} [ignore_parent_menu=false] - Whether to ignore the parent menu when closing.
     */
    close(e, ignore_parent_menu) {
        closeContextMenuInstance(this, e, ignore_parent_menu, ContextMenu);
    }

    /**
     * Closes all open ContextMenus in the specified window.
     * @param {Window} [ref_window=window] - The window object to search for open menus.
     */
    static closeAll = (ref_window = window) => closeAllContextMenus(ref_window);

    /**
     * Triggers an event on the specified element with the given event name and parameters.
     * @param {HTMLElement} element - The element on which to trigger the event.
     * @param {string} event_name - The name of the event to trigger.
     * @param {Object} params - Additional parameters to include in the event.
     * @param {HTMLElement} origin - Optional origin element.
     * @returns {CustomEvent} - The created CustomEvent instance.
     */
    static trigger(element, event_name, params, origin) {
        return triggerContextMenuEvent(element, event_name, params, origin);
    }

    // returns the top most menu
    getTopMenu() {
        return this.options.parentMenu?.getTopMenu() ?? this;
    }

    getFirstEvent() {
        return this.options.parentMenu?.getFirstEvent() ?? this.options.event;
    }

    static isCursorOverElement(event, element) {
        return isCursorOverContextElement(event, element, LiteGraph);
    }
}
