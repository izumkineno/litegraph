export function closeAllContextMenus(ref_window = window) {
    const elements = ref_window.document.querySelectorAll(".litecontextmenu");
    if (!elements.length) {
        return;
    }

    elements.forEach((element) => {
        if (element.close) {
            element.close();
        } else {
            element.parentNode?.removeChild(element);
        }
    });
}

export function triggerContextMenuEvent(element, event_name, params, origin) {
    const evt = new CustomEvent(event_name, {
        bubbles: true,
        cancelable: true,
        detail: params,
    });
    if (origin) {
        Object.defineProperty(evt, "litegraphTarget", { value: origin });
    }
    if (element.dispatchEvent) {
        element.dispatchEvent(evt);
    } else if (element.__events) {
        element.__events.dispatchEvent(evt);
    }
    return evt;
}

export function isCursorOverContextElement(event, element, LiteGraph) {
    return LiteGraph.isInsideRectangle(
        event.clientX,
        event.clientY,
        element.left,
        element.top,
        element.width,
        element.height,
    );
}

