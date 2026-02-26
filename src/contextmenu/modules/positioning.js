export function calculateContextMenuBestPosition(contextMenu, LiteGraph) {
    const options = contextMenu.options;
    const root = contextMenu.root;

    let left = options.left || 0;
    let top = options.top || 0;
    contextMenu.top_original = top;

    if (options.event) {
        left = options.event.clientX - 10;
        top = options.event.clientY - 10;

        if (options.title) {
            top -= 20;
        }
        contextMenu.top_original = top;

        if (options.parentMenu) {
            const rect = options.parentMenu.root.getBoundingClientRect();
            left = rect.left + rect.width;
        }

        const body_rect = document.body.getBoundingClientRect();
        const root_rect = root.getBoundingClientRect();
        if (body_rect.height === 0) {
            LiteGraph.error?.("document.body height is 0. That is dangerous, set html,body { height: 100%; }");
        }

        if (body_rect.width && left > body_rect.width - root_rect.width - 10) {
            left = body_rect.width - root_rect.width - 10;
        }
        if (body_rect.height && top > body_rect.height - root_rect.height - 10) {
            top = body_rect.height - root_rect.height - 10;
        }
    }

    root.style.left = `${left}px`;
    root.style.top = `${top}px`;

    if (options.scale) {
        root.style.transform = `scale(${options.scale})`;
    }
}

