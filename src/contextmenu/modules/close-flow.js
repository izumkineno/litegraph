export function closeContextMenuInstance(contextMenu, event, ignore_parent_menu, ContextMenuClass) {
    if (contextMenu.root.f_textfilter) {
        const doc = contextMenu._filterDoc || event?.target?.ownerDocument || document;
        doc.removeEventListener("keydown", contextMenu.root.f_textfilter, true);
        doc.removeEventListener("keydown", contextMenu.root.f_textfilter, false);
        contextMenu._filterDoc = null;
    }

    if (contextMenu.parentMenu && !ignore_parent_menu) {
        contextMenu.parentMenu.lock = false;
        contextMenu.parentMenu.current_submenu = null;
        if (event === undefined) {
            contextMenu.parentMenu.close();
        } else if (
            event &&
            !ContextMenuClass.isCursorOverElement(event, contextMenu.parentMenu.root)
        ) {
            ContextMenuClass.trigger(contextMenu.parentMenu.root, "pointerleave", event);
        }
    }
    contextMenu.current_submenu?.close(event, true);

    if (contextMenu.root.closing_timer) {
        clearTimeout(contextMenu.root.closing_timer);
    }

    if (contextMenu.root.parentNode) {
        contextMenu.root.parentNode.removeChild(contextMenu.root);
    }
}

