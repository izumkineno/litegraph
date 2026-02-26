const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";
import { installDomEnvironment } from "../helpers/dom-env.js";

const ContextMenu = LiteGraph.ContextMenu;

function dispatchKey(key) {
    document.dispatchEvent(new KeyboardEvent("keydown", { key }));
}

describe("ContextMenu keyboard filtering", () => {
    let restoreDom;
    let previousFilterFlag;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
        previousFilterFlag = LiteGraph.context_menu_filter_enabled;
        LiteGraph.context_menu_filter_enabled = true;
    });

    afterEach(() => {
        LiteGraph.context_menu_filter_enabled = previousFilterFlag;
        restoreDom?.();
    });

    test("filters visible options using typed keys and updates selected option", () => {
        const menu = new ContextMenu(
            [{ title: "Alpha" }, { title: "Beta" }, { title: "Gamma" }],
            {},
        );

        dispatchKey("b");
        expect(menu.filteringText).toBe("b");
        expect(menu.menu_elements[0].style.display).toBe("none");
        expect(menu.menu_elements[1].style.display).toBe("block");
        expect(menu.menu_elements[2].style.display).toBe("none");

        dispatchKey("ArrowDown");
        expect(menu.selectedOption).toBe(1);
        expect(menu.menu_elements[1].classList.contains("selected")).toBe(true);

        dispatchKey("Backspace");
        expect(menu.filteringText).toBe("");
        expect(menu.menu_elements[0].style.display).toBe("block");

        dispatchKey("Escape");
        expect(menu.root.parentNode).toBeNull();
        expect(document._listeners.get("keydown")?.size ?? 0).toBe(0);
    });
});
