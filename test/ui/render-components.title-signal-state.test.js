const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;

import { beginNodeFrameLeafer, drawNode, endNodeFrameLeafer } from "../../src/lgraphcanvas/modules/render-nodes.js";
import { LiteGraph } from "../../src/litegraph.js";
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
        renderStyleProfile: "leafer-classic-v1",
        renderStyleEngine: "leafer-components",
        frontSurface: { canvas: frontCanvas },
        canvas: frontCanvas,
        ds: { scale: 1, offset: [0, 0] },
        round_radius: 8,
        editor_alpha: 1,
        live_mode: false,
        render_shadows: false,
        render_collapsed_slots: true,
        render_title_colored: false,
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

describe("leafer components title signal state", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("title signal box follows dynamic boxcolor and trigger counters decay", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        const node = {
            id: 3001,
            pos: [20, 40],
            size: [180, 80],
            color: "#445",
            bgcolor: "#222",
            boxcolor: "#F00",
            mode: 0,
            execute_triggered: 2,
            action_triggered: 0,
            flags: { collapsed: false },
            inputs: [{ type: "number", name: "in" }],
            outputs: [{ type: "number", name: "out" }],
            widgets: [],
            properties: {},
            getTitle() {
                return "SignalNode";
            },
            getConnectionPos(isInput) {
                return isInput ? [this.pos[0], this.pos[1] + 24] : [this.pos[0] + this.size[0], this.pos[1] + 24];
            },
        };

        expect(beginNodeFrameLeafer.call(host, ctx, [node])).toBe(true);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);

        let view = host._leaferNodeUiLayer._nodeViews.get(node.id);
        expect(view?.titleGroup?.children?.[0]?.fill).toBe("#F00");
        expect(node.execute_triggered).toBe(1);

        node.boxcolor = "#0F0";
        expect(beginNodeFrameLeafer.call(host, ctx, [node])).toBe(true);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);

        view = host._leaferNodeUiLayer._nodeViews.get(node.id);
        expect(view?.titleGroup?.children?.[0]?.fill).toBe("#0F0");
        const titleText = view?.titleGroup?.children?.find((child) => typeof child?.text === "string");
        expect(titleText?.verticalAlign).toBe("middle");
        expect(titleText?.y).toBe(-LiteGraph.NODE_TITLE_HEIGHT);
        expect(node.execute_triggered).toBe(0);
    });

    test("title signal refreshes in same frame when onDrawBackground mutates boxcolor", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        const node = {
            id: 3002,
            pos: [40, 60],
            size: [180, 80],
            color: "#445",
            bgcolor: "#222",
            boxcolor: "#222",
            mode: 0,
            execute_triggered: 0,
            action_triggered: 0,
            flags: { collapsed: false },
            inputs: [{ type: "number", name: "in" }],
            outputs: [{ type: "number", name: "out" }],
            widgets: [],
            properties: {},
            triggered: true,
            getTitle() {
                return "TimerLike";
            },
            getConnectionPos(isInput) {
                return isInput ? [this.pos[0], this.pos[1] + 24] : [this.pos[0] + this.size[0], this.pos[1] + 24];
            },
            onDrawBackground() {
                this.boxcolor = this.triggered ? "#AAA" : "#222";
                this.triggered = false;
            },
        };

        expect(beginNodeFrameLeafer.call(host, ctx, [node])).toBe(true);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);

        let view = host._leaferNodeUiLayer._nodeViews.get(node.id);
        expect(view?.titleGroup?.children?.[0]?.fill).toBe("#AAA");
        expect(node.triggered).toBe(false);

        expect(beginNodeFrameLeafer.call(host, ctx, [node])).toBe(true);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);

        view = host._leaferNodeUiLayer._nodeViews.get(node.id);
        expect(view?.titleGroup?.children?.[0]?.fill).toBe("#222");
    });
});
