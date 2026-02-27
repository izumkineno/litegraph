const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import { LiteGraph } from "../../src/litegraph.js";
import { drawNode, drawNodeShape } from "../../src/lgraphcanvas/modules/render-nodes.js";
import { createMockCanvasContext } from "../helpers/canvas-mock.js";

function createNodeDrawContext() {
    const ctx = createMockCanvasContext();
    ctx.rect = () => {};
    ctx.clip = () => {};
    return ctx;
}

describe("render-nodes callback compatibility", () => {
    test("onDrawBackground and onDrawForeground keep signature and order", () => {
        const ctx = createNodeDrawContext();
        const callOrder = [];
        const host = {
            current_node: null,
            ds: { scale: 1 },
            live_mode: false,
            editor_alpha: 1,
            render_shadows: false,
            canvas: { id: "front-canvas" },
            graph_mouse: [42, 84],
            inner_text_font: "12px Arial",
            title_text_font: "14px Arial",
            node_title_color: "#EEE",
            use_gradients: false,
            render_title_colored: false,
            round_radius: 8,
            render_collapsed_slots: false,
            lowQualityRenderingRequired() {
                return false;
            },
            drawNodeShape,
            drawNodeWidgets() {},
        };

        const backgroundArgs = [];
        const foregroundArgs = [];
        const node = {
            color: "#778899",
            bgcolor: "#111111",
            constructor: {
                color: "#778899",
                bgcolor: "#111111",
                title_mode: LiteGraph.NORMAL_TITLE,
            },
            flags: { collapsed: false },
            horizontal: false,
            size: [160, 90],
            pos: [0, 0],
            inputs: [],
            outputs: [],
            mouseOver: false,
            is_selected: false,
            getTitle() {
                return "CompatNode";
            },
            onDrawBackground(...args) {
                callOrder.push("background");
                backgroundArgs.push(args);
            },
            onDrawForeground(...args) {
                callOrder.push("foreground");
                foregroundArgs.push(args);
            },
        };

        drawNode.call(host, node, ctx);

        expect(callOrder).toEqual(["background", "foreground"]);
        expect(backgroundArgs[0][0]).toBe(ctx);
        expect(backgroundArgs[0][1]).toBe(host);
        expect(backgroundArgs[0][2]).toBe(host.canvas);
        expect(backgroundArgs[0][3]).toBe(host.graph_mouse);
        expect(foregroundArgs[0][0]).toBe(ctx);
        expect(foregroundArgs[0][1]).toBe(host);
        expect(foregroundArgs[0][2]).toBe(host.canvas);
    });
});
