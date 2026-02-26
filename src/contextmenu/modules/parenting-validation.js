export function linkContextMenuToParent(contextMenu, LiteGraph) {
    const parentMenu = contextMenu.options.parentMenu;
    if (!parentMenu) {
        return;
    }
    if (parentMenu.constructor !== contextMenu.constructor) {
        LiteGraph.error?.("parentMenu must be of class ContextMenu, ignoring it");
        contextMenu.options.parentMenu = null;
        return;
    }
    contextMenu.parentMenu = parentMenu;
    contextMenu.parentMenu.lock = true;
    contextMenu.parentMenu.current_submenu = contextMenu;
}

export function validateContextMenuEventClass(contextMenu, LiteGraph) {
    if (!contextMenu.options.event) {
        return;
    }

    // use strings because comparing classes between windows doesnt work
    const eventClass = contextMenu.options.event.constructor.name;
    if (
        eventClass !== "MouseEvent" &&
        eventClass !== "CustomEvent" &&
        eventClass !== "PointerEvent"
    ) {
        LiteGraph.error?.(`Event passed to ContextMenu is not of type MouseEvent or CustomEvent. Ignoring it. (${eventClass})`);
        contextMenu.options.event = null;
    }
}

