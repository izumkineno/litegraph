function setGlobal(name, value) {
    try {
        globalThis[name] = value;
    } catch (_error) {
        Object.defineProperty(globalThis, name, {
            value,
            writable: true,
            configurable: true,
            enumerable: true,
        });
    }
}

function restoreGlobal(name, value) {
    if (value === undefined) {
        try {
            delete globalThis[name];
        } catch (_error) {
            Object.defineProperty(globalThis, name, {
                value: undefined,
                writable: true,
                configurable: true,
                enumerable: true,
            });
        }
        return;
    }

    setGlobal(name, value);
}

function createEvent(type, init = {}) {
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

function createEventTarget() {
    const listeners = new Map();

    return {
        addEventListener(type, handler, options = undefined) {
            if (!listeners.has(type)) {
                listeners.set(type, new Set());
            }
            listeners.get(type).add(handler);

            if (options?.signal?.addEventListener) {
                const onAbort = () => this.removeEventListener(type, handler);
                options.signal.addEventListener("abort", onAbort, { once: true });
            }
        },
        removeEventListener(type, handler) {
            listeners.get(type)?.delete(handler);
        },
        dispatchEvent(event) {
            event.target ??= this;
            event.currentTarget = this;
            const handlers = listeners.get(event.type);
            if (!handlers) {
                return !event.defaultPrevented;
            }
            handlers.forEach((handler) => handler.call(this, event));
            return !event.defaultPrevented;
        },
        _listeners: listeners,
    };
}

function readDimension(value, fallback) {
    if (typeof value === "number" && Number.isFinite(value)) {
        return value;
    }
    if (typeof value === "string") {
        const parsed = parseFloat(value);
        if (Number.isFinite(parsed)) {
            return parsed;
        }
    }
    return fallback;
}

function matchSelector(element, selector) {
    if (!selector) {
        return false;
    }
    if (selector === "*") {
        return true;
    }
    if (selector.startsWith(".")) {
        return element.classList.contains(selector.slice(1));
    }
    return element.tagName.toLowerCase() === selector.toLowerCase();
}

function queryAllWithin(root, selector) {
    const found = [];
    const stack = [...root.children];
    while (stack.length) {
        const current = stack.shift();
        if (matchSelector(current, selector)) {
            found.push(current);
        }
        stack.push(...current.children);
    }
    return found;
}

function createClassList(element) {
    const classes = new Set();

    function syncClassName() {
        element._className = Array.from(classes).join(" ");
    }

    return {
        add(...tokens) {
            tokens.filter(Boolean).forEach((token) => classes.add(String(token)));
            syncClassName();
        },
        remove(...tokens) {
            tokens.forEach((token) => classes.delete(String(token)));
            syncClassName();
        },
        contains(token) {
            return classes.has(String(token));
        },
        toggle(token, force) {
            const normalized = String(token);
            if (force === true) {
                classes.add(normalized);
            } else if (force === false) {
                classes.delete(normalized);
            } else if (classes.has(normalized)) {
                classes.delete(normalized);
            } else {
                classes.add(normalized);
            }
            syncClassName();
            return classes.has(normalized);
        },
        toString() {
            return Array.from(classes).join(" ");
        },
        _setFromClassName(value) {
            classes.clear();
            String(value || "").split(/\s+/).filter(Boolean).forEach((token) => classes.add(token));
            syncClassName();
        },
    };
}

function createElement(document, tagName = "div") {
    const target = createEventTarget();
    const element = {
        ...target,
        ownerDocument: document,
        tagName: String(tagName).toUpperCase(),
        nodeType: 1,
        style: {},
        dataset: {},
        children: [],
        parentNode: null,
        parentElement: null,
        _textContent: "",
        _innerHTML: "",
        width: 0,
        height: 0,
        appendChild(child) {
            if (!child) {
                return child;
            }
            if (child.parentNode && child.parentNode !== this) {
                child.parentNode.removeChild(child);
            }
            child.parentNode = this;
            child.parentElement = this;
            child.ownerDocument = this.ownerDocument;
            this.children.push(child);
            return child;
        },
        removeChild(child) {
            const index = this.children.indexOf(child);
            if (index === -1) {
                return child;
            }
            this.children.splice(index, 1);
            child.parentNode = null;
            child.parentElement = null;
            return child;
        },
        remove() {
            this.parentNode?.removeChild(this);
        },
        setAttribute(name, value) {
            if (name === "class") {
                this.className = value;
                return;
            }
            this[name] = value;
        },
        removeAttribute(name) {
            if (name === "class") {
                this.className = "";
                return;
            }
            delete this[name];
        },
        getContext() {
            return null;
        },
        focus() {},
        blur() {},
        querySelector(selector) {
            return this.querySelectorAll(selector)[0] ?? null;
        },
        querySelectorAll(selector) {
            return queryAllWithin(this, selector);
        },
        getBoundingClientRect() {
            const width = readDimension(this.width || this.style.width, 200);
            const height = readDimension(this.height || this.style.height, 100);
            const left = readDimension(this.left ?? this.style.left, 0);
            const top = readDimension(this.top ?? this.style.top, 0);
            return {
                left,
                top,
                width,
                height,
                right: left + width,
                bottom: top + height,
            };
        },
    };

    const classList = createClassList(element);
    element.classList = classList;
    element._className = "";
    Object.defineProperty(element, "className", {
        get() {
            return element._className;
        },
        set(value) {
            classList._setFromClassName(value);
        },
    });
    Object.defineProperty(element, "textContent", {
        get() {
            return element._textContent;
        },
        set(value) {
            element._textContent = String(value ?? "");
            element._innerHTML = element._textContent;
        },
    });
    Object.defineProperty(element, "innerHTML", {
        get() {
            return element._innerHTML;
        },
        set(value) {
            element._innerHTML = String(value ?? "");
            element._textContent = element._innerHTML.replace(/<[^>]*>/g, "");
        },
    });

    return element;
}

export function installDomEnvironment() {
    const previous = {
        window: globalThis.window,
        document: globalThis.document,
        navigator: globalThis.navigator,
        Event: globalThis.Event,
        KeyboardEvent: globalThis.KeyboardEvent,
        MouseEvent: globalThis.MouseEvent,
        PointerEvent: globalThis.PointerEvent,
        CustomEvent: globalThis.CustomEvent,
    };

    const documentTarget = createEventTarget();
    const document = {
        ...documentTarget,
        nodeType: 9,
        fullscreenElement: null,
        defaultView: null,
        body: null,
        createElement(tagName = "div") {
            return createElement(document, tagName);
        },
        getElementById(id) {
            if (!id) {
                return null;
            }
            const all = this.body.querySelectorAll("*");
            return all.find((el) => el.id === id) ?? null;
        },
        querySelector(selector) {
            return this.body.querySelector(selector);
        },
        querySelectorAll(selector) {
            return this.body.querySelectorAll(selector);
        },
    };
    document.body = createElement(document, "body");
    document.body.width = 1280;
    document.body.height = 720;
    document.body.style.width = "1280";
    document.body.style.height = "720";

    const windowTarget = createEventTarget();
    const window = {
        ...windowTarget,
        document,
        requestAnimationFrame(callback) {
            return setTimeout(() => callback(Date.now()), 0);
        },
        cancelAnimationFrame(id) {
            clearTimeout(id);
        },
    };
    document.defaultView = window;
    document.parentWindow = window;

    const EventClass = class Event {
        constructor(type, init = {}) {
            Object.assign(this, createEvent(type, init));
        }
    };
    const KeyboardEventClass = class KeyboardEvent extends EventClass {
        constructor(type, init = {}) {
            super(type, init);
            this.key = init.key ?? "";
            this.code = init.code ?? "";
            this.ctrlKey = Boolean(init.ctrlKey);
            this.shiftKey = Boolean(init.shiftKey);
            this.altKey = Boolean(init.altKey);
            this.metaKey = Boolean(init.metaKey);
        }
    };
    const MouseEventClass = class MouseEvent extends EventClass {
        constructor(type, init = {}) {
            super(type, init);
            this.clientX = init.clientX ?? 0;
            this.clientY = init.clientY ?? 0;
            this.button = init.button ?? 0;
        }
    };
    const PointerEventClass = class PointerEvent extends MouseEventClass {};
    const CustomEventClass = class CustomEvent extends EventClass {
        constructor(type, init = {}) {
            super(type, init);
            this.detail = init.detail;
        }
    };

    setGlobal("window", window);
    setGlobal("document", document);
    setGlobal("navigator", previous.navigator ?? { userAgent: "test" });
    setGlobal("Event", EventClass);
    setGlobal("KeyboardEvent", KeyboardEventClass);
    setGlobal("MouseEvent", MouseEventClass);
    setGlobal("PointerEvent", PointerEventClass);
    setGlobal("CustomEvent", CustomEventClass);

    return function restoreDomEnvironment() {
        restoreGlobal("window", previous.window);
        restoreGlobal("document", previous.document);
        restoreGlobal("navigator", previous.navigator);
        restoreGlobal("Event", previous.Event);
        restoreGlobal("KeyboardEvent", previous.KeyboardEvent);
        restoreGlobal("MouseEvent", previous.MouseEvent);
        restoreGlobal("PointerEvent", previous.PointerEvent);
        restoreGlobal("CustomEvent", previous.CustomEvent);
    };
}
