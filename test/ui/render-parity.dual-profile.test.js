const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;

import { beginNodeFrameLeafer, drawNode, endNodeFrameLeafer } from "../../src/lgraphcanvas/modules/render-nodes.js";
import { createMockCanvasContext, createMockCanvasElement } from "../helpers/canvas-mock.js";
import { createMockLeaferUiRuntime } from "../helpers/leafer-ui-mock-runtime.js";
import { installDomEnvironment } from "../helpers/dom-env.js";

function createHost(runtime, ctx, profile) {
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
        renderStyleProfile: profile,
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

function drawWithProfile(profile) {
    const runtime = createMockLeaferUiRuntime();
    const ctx = createMockCanvasContext();
    const host = createHost(runtime, ctx, profile);
    const node = {
        id: 1401,
        pos: [20, 20],
        size: [220, 120],
        color: "#445566",
        bgcolor: "#1A1A1A",
        flags: { collapsed: false },
        inputs: [],
        outputs: [],
        widgets: [{ type: "slider", name: "gain", value: 0.5, options: { min: 0, max: 1 } }],
        properties: {},
        getTitle() {
            return "Dual Profile";
        },
        getConnectionPos(isInput) {
            return isInput ? [this.pos[0], this.pos[1] + 24] : [this.pos[0] + this.size[0], this.pos[1] + 24];
        },
    };

    beginNodeFrameLeafer.call(host, ctx, [node]);
    drawNode.call(host, node, ctx);
    endNodeFrameLeafer.call(host, ctx, [node]);

    return host._leaferNodeUiLayer._nodeViews.get(node.id);
}

describe("render parity dual profile", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("classic and pragmatic profiles produce different tokenized widget colors", () => {
        const classicView = drawWithProfile("leafer-classic-v1");
        const pragmaticView = drawWithProfile("leafer-pragmatic-v1");

        expect(classicView).toBeTruthy();
        expect(pragmaticView).toBeTruthy();
        const classicTrack = classicView.widgetsGroup.children[0];
        const pragmaticTrack = pragmaticView.widgetsGroup.children[0];

        expect(classicTrack.fill).toBe("#222222");
        expect(pragmaticTrack.fill).toBe("#0F172A");
        expect(classicTrack.fill).not.toBe(pragmaticTrack.fill);
    });
});
