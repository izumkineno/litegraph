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
        live_mode: true,
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

describe("leafer components registry fallback", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("falls back to legacy node drawing when widget component is missing", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        let foregroundCalls = 0;
        const node = {
            id: 501,
            pos: [20, 30],
            size: [180, 100],
            color: "#446688",
            bgcolor: "#1A1A1A",
            flags: { collapsed: false },
            inputs: [],
            outputs: [],
            widgets: [{ type: "mystery-widget", name: "x", value: 1 }],
            properties: {},
            onDrawForeground() {
                foregroundCalls += 1;
            },
            getTitle() {
                return "FallbackNode";
            },
            getConnectionPos(isInput) {
                return isInput ? [this.pos[0], this.pos[1] + 20] : [this.pos[0] + this.size[0], this.pos[1] + 20];
            },
        };

        expect(beginNodeFrameLeafer.call(host, ctx, [node])).toBe(true);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);

        expect(foregroundCalls).toBe(1);
    });
});

