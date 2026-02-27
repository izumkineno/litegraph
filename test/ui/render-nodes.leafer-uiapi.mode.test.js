const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;

import { beginNodeFrameLeafer, drawNode, endNodeFrameLeafer } from "../../src/lgraphcanvas/modules/render-nodes.js";
import { createMockCanvasContext, createMockCanvasElement } from "../helpers/canvas-mock.js";
import { createMockLeaferUiRuntime } from "../helpers/leafer-ui-mock-runtime.js";
import { installDomEnvironment } from "../helpers/dom-env.js";

function createNode() {
    return {
        id: 101,
        pos: [20, 30],
        size: [180, 100],
        color: "#446688",
        bgcolor: "#1A1A1A",
        flags: { collapsed: false },
        inputs: [],
        outputs: [],
        widgets: [],
        properties: {},
        getTitle() {
            return "LeaferNode";
        },
        getConnectionPos(isInput) {
            return isInput
                ? [this.pos[0], this.pos[1] + 20]
                : [this.pos[0] + this.size[0], this.pos[1] + 20];
        },
    };
}

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
            options: {
                nodeRenderMode: "uiapi-experimental",
                nodeRenderLogs: false,
            },
            isLayerNative(layer) {
                return layer === "front";
            },
            getLeaferRuntime() {
                return runtime;
            },
        },
        frontSurface: { canvas: frontCanvas },
        canvas: frontCanvas,
        ds: { scale: 1, offset: [0, 0] },
        round_radius: 8,
        node_title_color: "#DDD",
        default_connection_color: {
            input_off: "#777",
            output_off: "#777",
        },
        graph_mouse: [0, 0],
    };
}

describe("render-nodes leafer uiapi mode", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("uiapi mode initializes layer and renders through bridge canvas", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        const node = createNode();

        const started = beginNodeFrameLeafer.call(host, ctx, [node]);
        expect(started).toBe(true);

        drawNode.call(host, node, ctx);
        expect(host._leaferNodeUiLayer).toBeTruthy();
        expect(host._leaferNodeUiLayer._nodeViews.size).toBe(1);

        endNodeFrameLeafer.call(host, ctx, [node]);
        const drawImageCalls = ctx.calls.filter((call) => call.name === "drawImage");
        expect(drawImageCalls.length).toBe(1);
    });

    test("legacy mode or non-native front does not enable uiapi node frame", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        host.rendererAdapter.options.nodeRenderMode = "legacy-ctx";
        expect(beginNodeFrameLeafer.call(host, ctx, [])).toBe(false);

        host.rendererAdapter.options.nodeRenderMode = "uiapi-experimental";
        host.rendererAdapter.isLayerNative = () => false;
        expect(beginNodeFrameLeafer.call(host, ctx, [])).toBe(false);
    });

    test("uiapi-parity mode draws through legacy node path on bridge context", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        host.rendererAdapter.options.nodeRenderMode = "uiapi-parity";
        host.live_mode = true;
        const node = createNode();
        let foregroundCalls = 0;
        node.onDrawForeground = () => {
            foregroundCalls += 1;
        };

        const started = beginNodeFrameLeafer.call(host, ctx, [node]);
        expect(started).toBe(true);

        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);

        expect(foregroundCalls).toBe(1);
        expect(host._leaferNodeUiLayer._nodeViews.size).toBe(0);
        const bridgeCtx = host._leaferNodeUiLayer._parityContext;
        expect(bridgeCtx).toBeTruthy();
        const translateCalls = bridgeCtx.calls.filter((call) => call.name === "translate");
        expect(translateCalls.length).toBeGreaterThan(0);
    });
});
