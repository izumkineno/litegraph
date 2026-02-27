const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;
import { draw } from "../../src/lgraphcanvas/modules/render-frame.js";
import { setCanvas } from "../../src/lgraphcanvas/modules/lifecycle.js";
import { Canvas2DRendererAdapter } from "../../src/lgraphcanvas/renderer/canvas2d-adapter.js";
import { LiteGraph } from "../../src/litegraph.js";
import {
    RENDER_CONTEXT_COMPAT_METHODS,
    RENDER_CONTEXT_COMPAT_PROPERTIES,
    applyRenderContextCompatAliases,
    validateRenderContext2DCompat,
} from "../../src/lgraphcanvas/renderer/contracts.js";
import { createMockCanvasContext, createMockCanvasElement } from "../helpers/canvas-mock.js";
import { installDomEnvironment } from "../helpers/dom-env.js";

function createCanvasPair() {
    const frontCtx = createMockCanvasContext();
    const frontCanvas = createMockCanvasElement(frontCtx);
    frontCanvas.localName = "canvas";
    frontCanvas.className = "";
    frontCanvas.tabindex = "";

    const backCtx = createMockCanvasContext();
    const backCanvas = createMockCanvasElement(backCtx);
    backCanvas.localName = "canvas";

    frontCanvas.ownerDocument = {
        createElement(tagName) {
            if (tagName !== "canvas") {
                throw new Error("unexpected element request");
            }
            return backCanvas;
        },
    };

    return {
        frontCtx,
        frontCanvas,
        backCtx,
        backCanvas,
    };
}

describe("renderer adapter and contracts", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("compat contract lists baseline methods and properties", () => {
        expect(RENDER_CONTEXT_COMPAT_METHODS).toContain("drawImage");
        expect(RENDER_CONTEXT_COMPAT_METHODS).toContain("measureText");
        expect(RENDER_CONTEXT_COMPAT_PROPERTIES).toContain("canvas");
        expect(RENDER_CONTEXT_COMPAT_PROPERTIES).toContain("imageSmoothingEnabled");
    });

    test("LiteGraph exposes Canvas2DRendererAdapter for adapter injection", () => {
        expect(LiteGraph.Canvas2DRendererAdapter).toBe(Canvas2DRendererAdapter);
    });

    test("compat alias maps mozImageSmoothingEnabled to imageSmoothingEnabled", () => {
        const ctx = createMockCanvasContext();
        ctx.imageSmoothingEnabled = true;

        applyRenderContextCompatAliases(ctx);
        expect("mozImageSmoothingEnabled" in ctx).toBe(true);

        ctx.mozImageSmoothingEnabled = false;
        expect(ctx.imageSmoothingEnabled).toBe(false);
    });

    test("canvas2d adapter creates front/back surfaces and supports blit + resize", () => {
        const { frontCtx, frontCanvas, backCanvas } = createCanvasPair();
        const adapter = new Canvas2DRendererAdapter().init({ canvas: frontCanvas });

        expect(adapter.getFrontSurface().canvas).toBe(frontCanvas);
        expect(adapter.getBackSurface().canvas).toBe(backCanvas);
        expect(adapter.getFrontCtx()).toBe(frontCtx);

        adapter.resize(640, 360);
        expect(frontCanvas.width).toBe(640);
        expect(backCanvas.width).toBe(640);

        const before = frontCtx.calls.length;
        adapter.blitBackToFront(frontCtx);
        const drawCalls = frontCtx.calls.slice(before).filter((call) => call.name === "drawImage");
        expect(drawCalls.length).toBe(1);
        expect(drawCalls[0].args[0]).toBe(backCanvas);
    });

    test("setCanvas accepts injected rendererAdapter and wires contexts", () => {
        const { frontCtx, frontCanvas, backCtx, backCanvas } = createCanvasPair();
        const adapter = {
            init() {
                return this;
            },
            getFrontSurface() {
                return { canvas: frontCanvas, getContextCompat: () => frontCtx, resize() {} };
            },
            getBackSurface() {
                return { canvas: backCanvas, getContextCompat: () => backCtx, resize() {} };
            },
            getFrontCtx() {
                return frontCtx;
            },
            getBackCtx() {
                return backCtx;
            },
            destroy() {},
        };

        const host = {
            options: { rendererAdapter: adapter },
            rendererAdapter: null,
            ds: {},
            bindEvents() {},
            unbindEvents() {},
        };

        setCanvas.call(host, frontCanvas, true);
        expect(host.rendererAdapter).toBe(adapter);
        expect(host.ctx).toBe(frontCtx);
        expect(host.bgctx).toBe(backCtx);
        expect(host.canvas).toBe(frontCanvas);
        expect(host.bgcanvas).toBe(backCanvas);
    });

    test("compat validator reports invalid contexts", () => {
        const result = validateRenderContext2DCompat({ canvas: {} });
        expect(result.ok).toBe(false);
        expect(result.missingMethods.length).toBeGreaterThan(0);
    });
});

describe("render pipeline order", () => {
    test("draw calls background before front when both are dirty", () => {
        const calls = [];
        const host = {
            frontSurface: { canvas: { width: 300, height: 180 } },
            canvas: { width: 300, height: 180 },
            graph: null,
            ds: { scale: 1, computeVisibleArea() {} },
            dirty_bgcanvas: true,
            dirty_canvas: true,
            always_render_background: false,
            last_draw_time: 0,
            frame: 0,
            low_quality_rendering_threshold: 5,
            low_quality_rendering_counter: 0,
            drawBackCanvas() {
                calls.push("back");
            },
            drawFrontCanvas() {
                calls.push("front");
            },
        };

        draw.call(host);
        expect(calls).toEqual(["back", "front"]);
        expect(host.frame).toBe(1);
    });
});
