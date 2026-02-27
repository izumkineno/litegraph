const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;

import { beginNodeFrameLeafer, drawNode, endNodeFrameLeafer } from "../../src/lgraphcanvas/modules/render-nodes.js";
import { createMockCanvasContext, createMockCanvasElement } from "../helpers/canvas-mock.js";
import { createMockLeaferUiRuntime } from "../helpers/leafer-ui-mock-runtime.js";
import { installDomEnvironment } from "../helpers/dom-env.js";

function createHost(runtime, ctx) {
    const frontCanvas = createMockCanvasElement(ctx);
    frontCanvas.ownerDocument = {
        createElement(tag) {
            if (tag !== "canvas") {
                throw new Error("unexpected element request");
            }
            return createMockCanvasElement(createMockCanvasContext());
        },
    };

    return {
        rendererAdapter: {
            options: { nodeRenderMode: "uiapi-components", nodeRenderLogs: false },
            isLayerNative: (layer) => layer === "front",
            getLeaferRuntime: () => runtime,
        },
        renderStyleProfile: "leafer-pragmatic-v1",
        renderStyleEngine: "leafer-components",
        frontSurface: { canvas: frontCanvas },
        canvas: frontCanvas,
        ds: { scale: 1, offset: [0, 0] },
        round_radius: 8,
        editor_alpha: 1,
        live_mode: false,
        render_shadows: false,
        render_collapsed_slots: true,
        node_title_color: "#DDD",
        default_connection_color: { input_off: "#777", output_off: "#777" },
        default_connection_color_byType: {},
        default_connection_color_byTypeOff: {},
        lowQualityRenderingRequired() { return false; },
        drawNodeShape() {},
        drawNodeWidgets() { return 0; },
        drawNodeTooltip() {},
        graph_mouse: [0, 0],
    };
}

describe("leafer components widget parity", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("renders all widget types through component registry and stores widget layout", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        const node = {
            id: 777,
            pos: [30, 40],
            size: [220, 160],
            color: "#446688",
            bgcolor: "#1A1A1A",
            flags: { collapsed: false },
            inputs: [{ type: "number", name: "in", color_on: "#fff" }],
            outputs: [{ type: "number", name: "out", color_on: "#fff" }],
            widgets: [
                { type: "button", name: "run", value: null, options: {} },
                { type: "toggle", name: "enabled", value: true, options: { on: "on", off: "off" } },
                { type: "slider", name: "gain", value: 0.5, options: { min: 0, max: 1 } },
                { type: "number", name: "steps", value: 10, options: { precision: 0 } },
                { type: "combo", name: "mode", value: "fast", options: { values: ["fast", "safe"] } },
                { type: "text", name: "label", value: "hello", options: {} },
                {
                    type: "custom",
                    name: "preview",
                    value: null,
                    options: {},
                    draw() {},
                },
            ],
            properties: {},
            getTitle() {
                return "WidgetParity";
            },
            getConnectionPos(isInput) {
                return isInput ? [this.pos[0], this.pos[1] + 24] : [this.pos[0] + this.size[0], this.pos[1] + 24];
            },
        };

        expect(beginNodeFrameLeafer.call(host, ctx, [node])).toBe(true);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);

        const view = host._leaferNodeUiLayer._nodeViews.get(node.id);
        expect(view).toBeTruthy();
        expect(view.widgetsGroup.children.length).toBeGreaterThan(6);
        const hasCustomPlaceholder = view.widgetsGroup.children.some(
            (child) => typeof child?.text === "string" && child.text.includes("[custom]"),
        );
        expect(hasCustomPlaceholder).toBe(false);
        expect(view.callbackFgCanvas).toBeTruthy();
        expect(view.legacyWidgetDrawFns?.length).toBeGreaterThan(0);
        expect(node.widgets.every((widget) => typeof widget.last_y === "number")).toBe(true);

        // Draw a second frame with unchanged widgets to ensure custom callback layer stays stable.
        expect(beginNodeFrameLeafer.call(host, ctx, [node])).toBe(true);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);
        const nextView = host._leaferNodeUiLayer._nodeViews.get(node.id);
        expect(nextView.callbackFgCanvas).toBeTruthy();
        expect(nextView.legacyWidgetDrawFns?.length).toBeGreaterThan(0);
    });
});
