export function createContextMenuItem(contextMenu, name, value, options = {}, LiteGraph) {
    const element = document.createElement("div");
    element.className = "litemenu-entry submenu";

    let disabled = false;

    if (value === null) {
        element.classList.add("separator");
    } else {
        element.innerHTML = value?.title ?? name;
        element.value = value;

        if (value) {
            if (value.disabled) {
                disabled = true;
                element.classList.add("disabled");
            }
            if (value.submenu || value.has_submenu) {
                element.classList.add("has_submenu");
            }
        }

        if (typeof value == "function") {
            element.dataset["value"] = name;
            element.onclick_callback = value;
        } else {
            element.dataset["value"] = value;
        }

        if (value.className) {
            element.className += " " + value.className;
        }
    }

    contextMenu.root.appendChild(element);
    if (!disabled) {
        element.addEventListener("click", handleMenuItemClick);
    }
    if (!disabled && options.autoopen) {
        element.addEventListener("pointerenter", (event) => {
            const entryValue = contextMenu.value;
            if (!entryValue || !entryValue.has_submenu) {
                return;
            }
            // if it is a submenu, autoopen like the item was clicked
            handleMenuItemClick.call(contextMenu, event);
        });
    }

    const that = contextMenu;

    function handleMenuItemClick(event) {
        const entryValue = this.value;
        let closeParent = true;

        LiteGraph.debug?.("ContextMenu handleMenuItemClick", entryValue, options, closeParent, this.current_submenu, this);

        // Close any current submenu
        that.current_submenu?.close(event);

        // Execute global callback
        if (options.callback) {
            LiteGraph.debug?.("ContextMenu handleMenuItemClick callback", this, entryValue, options, event, that, options.node);

            const globalCallbackResult = options.callback.call(this, entryValue, options, event, that, options.node);
            if (globalCallbackResult === true) {
                closeParent = false;
            }
        }

        // Handle special cases
        if (entryValue) {
            if (entryValue.callback && !options.ignore_item_callbacks && entryValue.disabled !== true) {
                LiteGraph.debug?.("ContextMenu using value callback and !ignore_item_callbacks", this, entryValue, options, event, that, options.node);
                const itemCallbackResult = entryValue.callback.call(this, entryValue, options, event, that, options.extra);
                if (itemCallbackResult === true) {
                    closeParent = false;
                }
            }
            if (entryValue.submenu) {
                LiteGraph.debug?.("ContextMenu SUBMENU", this, entryValue, entryValue.submenu.options, e, that, options);

                if (!entryValue.submenu.options) {
                    throw new Error("ContextMenu submenu needs options");
                }
                // Recursively create submenu
                new that.constructor(entryValue.submenu.options, {
                    callback: entryValue.submenu.callback,
                    event: event,
                    parentMenu: that,
                    ignore_item_callbacks: entryValue.submenu.ignore_item_callbacks,
                    title: entryValue.submenu.title,
                    extra: entryValue.submenu.extra,
                    autoopen: options.autoopen,
                });
                closeParent = false;
            }
        }

        // Close parent menu if necessary and not locked
        if (closeParent && !that.lock) {
            that.close();
        }
    }

    return element;
}
