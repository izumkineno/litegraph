function makeEvent(type, init = {}) {
    return {
        type,
        bubbles: Boolean(init.bubbles),
        cancelable: Boolean(init.cancelable),
        defaultPrevented: false,
        ...init,
        preventDefault() {
            this.defaultPrevented = true;
        },
        stopPropagation() {},
    };
}

export function dispatchKeyboardEvent(target, type, init = {}) {
    const event = makeEvent(type, {
        key: init.key ?? "",
        code: init.code ?? "",
        ctrlKey: Boolean(init.ctrlKey),
        shiftKey: Boolean(init.shiftKey),
        altKey: Boolean(init.altKey),
        metaKey: Boolean(init.metaKey),
    });

    if (typeof target.dispatchEvent === "function") {
        target.dispatchEvent(event);
    } else if (typeof target[`on${type}`] === "function") {
        target[`on${type}`](event);
    }

    return event;
}

export function dispatchMouseEvent(target, type, init = {}) {
    const event = makeEvent(type, {
        button: init.button ?? 0,
        clientX: init.clientX ?? 0,
        clientY: init.clientY ?? 0,
    });

    if (typeof target.dispatchEvent === "function") {
        target.dispatchEvent(event);
    } else if (typeof target[`on${type}`] === "function") {
        target[`on${type}`](event);
    }

    return event;
}
