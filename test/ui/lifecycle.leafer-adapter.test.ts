// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;

import { setCanvas, resize } from "../../src/lgraphcanvas/modules/lifecycle.js";
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

describe("lifecycle + leafer adapter", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("setCanvas wires surfaces, contexts and drag element", () => {
        const runtime = createMockLeaferRuntime();
        const { frontCanvas } = createCanvasPair();
        const adapter = new LeaferUIRendererAdapter({
            mode: "hybrid-back",
            leaferRuntime: runtime,
        });

        const host = {
            options: { rendererAdapter: adapter },
            rendererAdapter: null,
            ds: { element: null },
            bindEvents() {},
            unbindEvents() {},
        };

        setCanvas.call(host, frontCanvas, true);

        expect(host.frontSurface).toBeTruthy();
        expect(host.backSurface).toBeTruthy();
        expect(host.canvas).toBe(frontCanvas);
        expect(host.bgcanvas).not.toBe(frontCanvas);
        expect(host.ctx).toBeTruthy();
        expect(host.bgctx).toBeTruthy();
        expect(host.ds.element).toBe(host.canvas);
    });

    test("resize refreshes contexts from adapter surfaces", () => {
        const runtime = createMockLeaferRuntime();
        const { frontCanvas } = createCanvasPair();
        const adapter = new LeaferUIRendererAdapter({
            mode: "hybrid-back",
            leaferRuntime: runtime,
        });

        const host = {
            options: { rendererAdapter: adapter },
            rendererAdapter: null,
            ds: { element: null },
            bindEvents() {},
            unbindEvents() {},
            setDirty() {},
        };

        setCanvas.call(host, frontCanvas, true);
        const previousBackContext = host.bgctx;

        resize.call(host, 960, 540);

        expect(host.canvas.width).toBe(960);
        expect(host.bgcanvas.width).toBe(960);
        expect(host.bgctx).not.toBe(previousBackContext);
        expect(host.ds.element).toBe(host.canvas);
    });
});



