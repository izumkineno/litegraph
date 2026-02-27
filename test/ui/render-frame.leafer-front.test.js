const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;

import { drawFrontCanvas } from "../../src/lgraphcanvas/modules/render-frame.js";
import { LeaferUIRendererAdapter } from "../../src/lgraphcanvas/renderer/leafer-ui-adapter.js";
import { createMockCanvasContext, createMockCanvasElement } from "../helpers/canvas-mock.js";
import { installDomEnvironment } from "../helpers/dom-env.js";

function createCanvasPair() {
    const frontCtx = createMockCanvasContext();
    const frontCanvas = createMockCanvasElement(frontCtx);
    frontCanvas.localName = "canvas";
    frontCanvas.className = "";
    frontCanvas.tabindex = "";

    const ownerDocument = {
        createElement(tagName) {
            if (tagName !== "canvas") {
                throw new Error("unexpected element request");
            }
            const ctx = createMockCanvasContext();
            const canvas = createMockCanvasElement(ctx);
            canvas.localName = "canvas";
            return canvas;
        },
    };
    frontCanvas.ownerDocument = ownerDocument;

    return {
        frontCanvas,
        ownerDocument,
    };
}

function createMockLeaferRuntime() {
    class MockLeaferCanvas {
        constructor(config = {}) {
            this.view = config.view;
            this.context = createMockCanvasContext();
            this.context.canvas = this.view;
            this.pixelRatio = 1;
        }

        resize(size) {
            this.view.width = size.width;
            this.view.height = size.height;
            this.context = createMockCanvasContext();
            this.context.canvas = this.view;
        }

        destroy() {
        }
    }

    return {
        LeaferCanvas: MockLeaferCanvas,
    };
}

describe("render-frame leafer front mode", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("drawFrontCanvas runs node loop and overlay in full-leafer mode", () => {
        const runtime = createMockLeaferRuntime();
        const { frontCanvas, ownerDocument } = createCanvasPair();
        const adapter = new LeaferUIRendererAdapter({
            mode: "full-leafer",
            leaferRuntime: runtime,
        }).init({ canvas: frontCanvas, ownerDocument });

        const syncLayers = [];
        const originalSyncLayer = adapter.syncLayer.bind(adapter);
        adapter.syncLayer = (layer) => {
            syncLayers.push(layer);
            originalSyncLayer(layer);
        };

        const drawNodeCalls = [];
        const overlayCalls = [];
        const node = { pos: [10, 20] };

        const host = {
            dirty_canvas: true,
            rendererAdapter: adapter,
            frontSurface: adapter.getFrontSurface(),
            backSurface: adapter.getBackSurface(),
            canvas: frontCanvas,
            bgcanvas: adapter.getBackSurface().canvas,
            ctx: adapter.getFrontCtx(),
            clear_background: true,
            viewport: null,
            dirty_area: null,
            show_info: false,
            graph: { config: { links_ontop: false } },
            ds: { scale: 1, toCanvasContext() {} },
            visible_nodes: [],
            computeVisibleNodes() {
                return [node];
            },
            drawNode(item, ctx) {
                drawNodeCalls.push([item, ctx]);
            },
            drawConnections() {},
            drawExecutionOrder() {},
            render_execution_order: false,
            live_mode: false,
            connecting_pos: null,
            dragging_rectangle: null,
            over_link_center: null,
            render_link_tooltip: false,
            visible_rect: null,
            _graph_stack: null,
            onDrawOverlay(ctx) {
                overlayCalls.push(ctx);
            },
        };

        drawFrontCanvas.call(host);

        expect(adapter.isLayerNative("front")).toBe(true);
        expect(drawNodeCalls).toHaveLength(1);
        expect(drawNodeCalls[0][0]).toBe(node);
        expect(overlayCalls).toHaveLength(1);
        expect(syncLayers).toEqual(["front"]);
    });
});
