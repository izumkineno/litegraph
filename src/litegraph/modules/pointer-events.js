let LiteGraph = null;

export function setPointerEventsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const pointerEventsMethods = {
applyPointerDefaults() {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return;
        }
        const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
        if (isCoarsePointer) {
            this.dialog_close_on_mouse_leave = false;
            this.search_hide_on_mouse_leave = false;
        }
    },

resolvePointerEventName(event_name) {
        if (typeof event_name !== "string") {
            return event_name;
        }

        const normalized_event_name = event_name.toLowerCase();
        const mode = this.pointerevents_method;
        if (mode === "mouse") {
            return this.pointer_to_mouse_events[normalized_event_name] || normalized_event_name;
        }
        if (mode === "pointer") {
            return this.mouse_to_pointer_events[normalized_event_name] || normalized_event_name;
        }

        return normalized_event_name;
    },

pointerAddListener(target, event_name, callback, options) {
        if (!target?.addEventListener || typeof callback !== "function") {
            return false;
        }

        const resolved_event_name = this.resolvePointerEventName(event_name);
        target.addEventListener(resolved_event_name, callback, options);
        return true;
    },

pointerRemoveListener(target, event_name, callback, options) {
        if (!target?.removeEventListener || typeof callback !== "function") {
            return false;
        }

        const resolved_event_name = this.resolvePointerEventName(event_name);
        target.removeEventListener(resolved_event_name, callback, options);
        return true;
    },

set pointerevents_method(v) {
        const method = typeof v === "string" ? v.toLowerCase() : "";
        if (method === "mouse" || method === "pointer") {
            this._pointerevents_method = method;
            return;
        }
        this._pointerevents_method = "pointer";
    },

get pointerevents_method() {
        return this._pointerevents_method || "pointer";
    },
};
