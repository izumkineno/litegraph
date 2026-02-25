const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";
import { installDomEnvironment } from "../helpers/dom-env.js";

const ContextMenu = LiteGraph.ContextMenu;

describe("ContextMenu lifecycle", () => {
    let restoreDom;
    let previousFilterFlag;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
        previousFilterFlag = LiteGraph.context_menu_filter_enabled;
        LiteGraph.context_menu_filter_enabled = false;
    });

    afterEach(() => {
        LiteGraph.context_menu_filter_enabled = previousFilterFlag;
        restoreDom?.();
    });

    test("creates root, title and menu entries", () => {
        const menu = new ContextMenu(
            [{ title: "Item A" }, { title: "Item B" }],
            { title: "Main Menu" },
        );

        expect(menu.root.classList.contains("litecontextmenu")).toBe(true);
        expect(menu.root.classList.contains("litegraph")).toBe(true);
        expect(menu.titleElement.innerHTML).toBe("Main Menu");
        expect(menu.menu_elements.length).toBe(2);
        expect(document.body.children.includes(menu.root)).toBe(true);

        menu.close();
    });

    test("click runs global and item callbacks then closes menu", () => {
        let globalCount = 0;
        let itemCount = 0;

        const menu = new ContextMenu(
            [{
                title: "Run",
                callback: () => {
                    itemCount += 1;
                },
            }],
            {
                callback: () => {
                    globalCount += 1;
                },
            },
        );

        const item = menu.menu_elements[0];
        item.dispatchEvent(new MouseEvent("click", { clientX: 20, clientY: 20 }));

        expect(globalCount).toBe(1);
        expect(itemCount).toBe(1);
        expect(menu.root.parentNode).toBeNull();
    });

    test("close removes keydown filter listener when enabled", () => {
        LiteGraph.context_menu_filter_enabled = true;

        const menu = new ContextMenu([{ title: "Alpha" }, { title: "Beta" }], {});
        expect(document._listeners.get("keydown")?.size ?? 0).toBe(1);

        menu.close();
        expect(document._listeners.get("keydown")?.size ?? 0).toBe(0);
    });

    test("trigger dispatches event and includes litegraph origin", () => {
        const element = document.createElement("div");
        const origin = document.createElement("span");
        let received = null;

        element.addEventListener("custom", (event) => {
            received = event;
        });

        const emitted = ContextMenu.trigger(element, "custom", { ok: true }, origin);
        expect(received.detail.ok).toBe(true);
        expect(emitted.litegraphTarget).toBe(origin);
    });

    test("closeAll removes all open menus in target window", () => {
        new ContextMenu([{ title: "One" }], {});
        new ContextMenu([{ title: "Two" }], {});
        expect(document.querySelectorAll(".litecontextmenu").length).toBe(2);

        ContextMenu.closeAll(window);
        expect(document.querySelectorAll(".litecontextmenu").length).toBe(0);
    });

    test("isCursorOverElement checks rectangle boundaries", () => {
        const inside = ContextMenu.isCursorOverElement(
            { clientX: 5, clientY: 5 },
            { left: 0, top: 0, width: 10, height: 10 },
        );
        const outside = ContextMenu.isCursorOverElement(
            { clientX: 20, clientY: 20 },
            { left: 0, top: 0, width: 10, height: 10 },
        );

        expect(inside).toBe(true);
        expect(outside).toBe(false);
    });
});
