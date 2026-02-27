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

describe("render parity collapsed mode", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("collapsed nodes render collapsed slots and hide widgets", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        const node = {
            id: 1301,
            pos: [20, 20],
            size: [260, 140],
            color: "#445566",
            bgcolor: "#1A1A1A",
            flags: { collapsed: true },
            inputs: [{ name: "in", type: "number", link: 5 }],
            outputs: [{ name: "out", type: "number", links: [8] }],
            widgets: [{ type: "slider", name: "gain", value: 0.5, options: { min: 0, max: 1 } }],
            properties: {},
            getTitle() {
                return "Collapsed Node With Long Title";
            },
            getConnectionPos(isInput) {
                return isInput ? [this.pos[0], this.pos[1]] : [this.pos[0] + this.size[0], this.pos[1]];
            },
        };

        expect(beginNodeFrameLeafer.call(host, ctx, [node])).toBe(true);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);

        const view = host._leaferNodeUiLayer._nodeViews.get(node.id);
        expect(view).toBeTruthy();
        expect(node._collapsed_width).toBeGreaterThan(1);
        expect(node._collapsed_width).toBeLessThanOrEqual(node.size[0]);
        expect(view.slotsGroup.children.length).toBeGreaterThan(0);
        expect(view.widgetsGroup.children.length).toBe(0);
    });

    test("widgets are restored after expanding from collapsed mode", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        const node = {
            id: 1302,
            pos: [20, 20],
            size: [260, 140],
            color: "#445566",
            bgcolor: "#1A1A1A",
            flags: { collapsed: true },
            inputs: [{ name: "in", type: "number", link: 5 }],
            outputs: [{ name: "out", type: "number", links: [8] }],
            widgets: [{ type: "slider", name: "gain", value: 0.5, options: { min: 0, max: 1 } }],
            properties: {},
            getTitle() {
                return "Collapsed Toggle";
            },
            getConnectionPos(isInput) {
                return isInput ? [this.pos[0], this.pos[1]] : [this.pos[0] + this.size[0], this.pos[1]];
            },
        };

        expect(beginNodeFrameLeafer.call(host, ctx, [node])).toBe(true);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);
        let view = host._leaferNodeUiLayer._nodeViews.get(node.id);
        expect(view.widgetsGroup.children.length).toBe(0);

        node.flags.collapsed = false;
        expect(beginNodeFrameLeafer.call(host, ctx, [node])).toBe(true);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);
        view = host._leaferNodeUiLayer._nodeViews.get(node.id);
        expect(view.widgetsGroup.children.length).toBeGreaterThan(0);
    });
});
