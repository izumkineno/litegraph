export function bindContextMenuRootEvents(contextMenu) {
    const root = contextMenu.root;

    root.style.pointerEvents = "none";
    setTimeout(() => {
        root.style.pointerEvents = "auto";
    }, 100); // delay so the mouse up event is not caught by this element

    // this prevents the default context browser menu to open in case this menu was created when pressing right button
    root.addEventListener("pointerup", (e) => {
        e.preventDefault();
        return true;
    });
    root.addEventListener("contextmenu", (e) => {
        if (e.button != 2) {
            // right button
            return false;
        }
        e.preventDefault();
        return false;
    });
    root.addEventListener("pointerdown", (e) => {
        if (e.button == 2) {
            contextMenu.close();
            e.preventDefault();
            return true;
        }
    });
    root.addEventListener("wheel", (e) => {
        const pos = parseInt(root.style.top);
        root.style.top =
            (pos + e.deltaY * contextMenu.options.scroll_speed).toFixed() + "px";
        e.preventDefault();
        return true;
    });
    root.addEventListener("pointerenter", (_event) => {
        if (root.closing_timer) {
            clearTimeout(root.closing_timer);
        }
    });
}

