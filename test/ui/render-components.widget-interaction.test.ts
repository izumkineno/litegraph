// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import { processNodeWidgets } from "../../src/lgraphcanvas/modules/render-nodes.js";

describe("render components widget interaction compatibility", () => {
    test("processNodeWidgets keeps toggle interaction behavior and marks canvas dirty", () => {
        const node = {
            pos: [0, 0],
            size: [220, 80],
            flags: { allow_interaction: true },
            widgets: [
                {
                    type: "toggle",
                    name: "enabled",
                    value: false,
                    options: { on: "yes", off: "no" },
                    last_y: 2,
                },
            ],
            graph: {
                onGraphChanged() {},
            },
            properties: {},
            onWidgetChanged() {},
            setProperty() {},
        };
        const host = {
            allow_interaction: true,
            ds: { scale: 1 },
            dirty_canvas: false,
            getCanvasWindow() {
                return { document: {} };
            },
            prompt() {},
        };

        const widget = processNodeWidgets.call(
            host,
            node,
            [20, 10],
            { type: "pointerdown", deltaX: 0, click_time: 0 },
            null,
        );

        expect(widget?.type).toBe("toggle");
        expect(node.widgets[0].value).toBe(true);
        expect(host.dirty_canvas).toBe(true);
    });
});



