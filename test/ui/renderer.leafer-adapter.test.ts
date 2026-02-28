// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;

import { LeaferUIRendererAdapter } from "../../src/lgraphcanvas/renderer/leafer-ui-adapter.js";
import { createMockCanvasContext, createMockCanvasElement } from "../helpers/canvas-mock.js";
import { installDomEnvironment } from "../helpers/dom-env.js";

function createCanvasPair() {
    const frontCtx = createMockCanvasContext();
    const frontCanvas = createMockCanvasElement(frontCtx);
    frontCanvas.localName = "canvas";
    frontCanvas.className = "";
    frontCanvas.tabindex = "";

    const createdCanvases = [];
    const ownerDocument = {
        createElement(tagName) {
            if (tagName !== "canvas") {
                throw new Error("unexpected element request");
            }
            const ctx = createMockCanvasContext();
            const canvas = createMockCanvasElement(ctx);
            canvas.localName = "canvas";
            createdCanvases.push(canvas);
            return canvas;
        },
    };
    frontCanvas.ownerDocument = ownerDocument;

    return {
        frontCtx,
        frontCanvas,
        ownerDocument,
        createdCanvases,
    };
}

function createMockLeaferRuntime() {
    class MockLeaferCanvas {
        constructor(config = {}) {
            this.view = config.view;
            this.context = createMockCanvasContext();
            this.context.canvas = this.view;
            this.pixelRatio = 1;
            this.destroyed = false;
        }

        resize(size) {
            this.view.width = size.width;
            this.view.height = size.height;
            this.context = createMockCanvasContext();
            this.context.canvas = this.view;
        }

        destroy() {
            this.destroyed = true;
        }
    }

    return {
        LeaferCanvas: MockLeaferCanvas,
    };
}

describe("leafer renderer adapter", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("hybrid mode keeps front canvas2d and back leafer", () => {
        const runtime = createMockLeaferRuntime();
        const { frontCtx, frontCanvas, ownerDocument } = createCanvasPair();

        const adapter = new LeaferUIRendererAdapter({
            mode: "hybrid-back",
            leaferRuntime: runtime,
            nodeRenderMode: "uiapi-parity",
            nodeRenderLogs: true,
        }).init({ canvas: frontCanvas, ownerDocument });

        expect(adapter.getFrontSurface().canvas).toBe(frontCanvas);
        expect(adapter.getFrontCtx()).toBe(frontCtx);
        expect(adapter.getBackSurface().canvas).not.toBe(frontCanvas);
        expect(adapter.getBackCtx()).toBeTruthy();
        expect(adapter.isLayerNative("front")).toBe(false);
        expect(adapter.isLayerNative("back")).toBe(true);
        expect(adapter.options.nodeRenderMode).toBe("uiapi-parity");
        expect(adapter.options.nodeRenderLogs).toBe(true);
        expect(adapter.getLeaferRuntime()).toBe(runtime);
        expect(() => adapter.syncLayer("front")).not.toThrow();

        adapter.resize(640, 360);
        expect(adapter.getFrontSurface().canvas.width).toBe(640);
        expect(adapter.getBackSurface().canvas.width).toBe(640);

        const before = frontCtx.calls.length;
        adapter.blitBackToFront(frontCtx);
        const drawCalls = frontCtx.calls.slice(before).filter((call) => call.name === "drawImage");
        expect(drawCalls.length).toBe(1);
    });

    test("full leafer mode uses leafer context on both layers", () => {
        const runtime = createMockLeaferRuntime();
        const { frontCtx, frontCanvas, ownerDocument } = createCanvasPair();

        const adapter = new LeaferUIRendererAdapter({
            mode: "full-leafer",
            leaferRuntime: runtime,
        }).init({ canvas: frontCanvas, ownerDocument });

        expect(adapter.getFrontCtx()).not.toBe(frontCtx);
        expect(adapter.getBackCtx()).toBeTruthy();
        expect(adapter.getFrontSurface().canvas).toBe(frontCanvas);
        expect(adapter.getBackSurface().canvas).not.toBe(frontCanvas);
        expect(adapter.isLayerNative("front")).toBe(true);
        expect(adapter.isLayerNative("back")).toBe(true);
    });

    test("throws when leafer runtime is missing", () => {
        const { frontCanvas, ownerDocument } = createCanvasPair();
        const adapter = new LeaferUIRendererAdapter({
            mode: "hybrid-back",
        });
        expect(() => adapter.init({ canvas: frontCanvas, ownerDocument })).toThrow(
            "LeaferUI runtime is not available",
        );
    });
});



