export function createContextMenuRoot(contextMenu) {
    const root = contextMenu.root = document.createElement("div");
    if (contextMenu.options.className) {
        root.className = contextMenu.options.className;
    }
    root.classList.add("litegraph", "litecontextmenu", "litemenubar-panel");
    root.style.minWidth = "80px";
    root.style.minHeight = "10px";
    return root;
}

export function setContextMenuTitle(contextMenu, title) {
    if (!title) {
        return;
    }
    contextMenu.titleElement ??= document.createElement("div");
    const element = contextMenu.titleElement;
    element.className = "litemenu-title";
    element.innerHTML = title;
    if (!contextMenu.root.parentElement) {
        contextMenu.root.appendChild(element);
    }
}

export function addContextMenuItems(contextMenu, values) {
    for (let i = 0; i < values.length; i++) {
        let name = values[i];

        if (typeof name !== "string") {
            name = name && name.content !== undefined ? String(name.content) : String(name);
        }

        const value = values[i];
        contextMenu.menu_elements.push(contextMenu.addItem(name, value, contextMenu.options));
    }
}

export function resolveContextMenuHost(contextMenu) {
    const doc = contextMenu.options.event?.target.ownerDocument ?? document;
    const parent = doc.fullscreenElement ?? doc.body;
    return { doc, parent };
}

export function appendContextMenuRoot(contextMenu, parent) {
    parent.appendChild(contextMenu.root);
}

