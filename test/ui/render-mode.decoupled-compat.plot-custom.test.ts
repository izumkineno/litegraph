// @ts-nocheck
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
        _renderModeRuntime: {
            form: "leafer",
            strategy: "decoupled-compat",
            capabilities: {
                frontNative: true,
                backNative: true,
                forceLegacyNodeCtx: false,
                useCompatBridge: true,
            },
            fallbackPolicy: {
                nodeLevelLegacyFallback: true,
                markNodeErrorOnFailure: true,
            },
        },
        rendererAdapter: {
            options: { nodeRenderMode: "uiapi-components", nodeRenderLogs: false },
            isLayerNative: () => false,
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
        node_widget: null,
    };
}

describe("render mode decoupled-compat plot/custom compatibility", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("executes legacy plot-like background and custom widget draw on leafer bridge ctx", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);

        let backgroundCalls = 0;
        let customWidgetCalls = 0;
        const node = {
            id: 3001,
            pos: [50, 40],
            size: [220, 140],
            color: "#446688",
            bgcolor: "#1A1A1A",
            flags: { collapsed: false },
            inputs: [{ type: "number", name: "A", link: 1, color_on: "#fff" }],
            outputs: [{ type: "number", name: "out", links: [2], color_on: "#fff" }],
            widgets: [
                {
                    type: "custom",
                    name: "preview",
                    value: null,
                    options: {},
                    draw(drawCtx, drawNodeRef, width, y, h) {
                        customWidgetCalls += 1;
                        drawCtx.fillRect?.(10, y, width - 20, h);
                        expect(drawNodeRef).toBe(node);
                    },
                    computeSize() {
                        return [220, 20];
                    },
                },
            ],
            values: [[0.1, 0.2, 0.3]],
            properties: { scale: 2 },
            getTitle() {
                return "PlotCompatNode";
            },
            getConnectionPos(isInput) {
                return isInput ? [this.pos[0], this.pos[1] + 24] : [this.pos[0] + this.size[0], this.pos[1] + 24];
            },
            onDrawBackground(drawCtx) {
                backgroundCalls += 1;
                drawCtx.beginPath?.();
                drawCtx.moveTo?.(0, 10);
                drawCtx.lineTo?.(30, 20);
                drawCtx.stroke?.();
            },
        };

        expect(beginNodeFrameLeafer.call(host, ctx, [node])).toBe(true);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);

        expect(backgroundCalls).toBeGreaterThan(0);
        expect(customWidgetCalls).toBeGreaterThan(0);
        expect(host._leaferNodeUiLayer?._nodeViews?.get(node.id)).toBeTruthy();
    });
});
