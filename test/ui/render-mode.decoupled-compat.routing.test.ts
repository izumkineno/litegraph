// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;

import { beginNodeFrameLeafer } from "../../src/lgraphcanvas/modules/render-nodes.js";
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
            // Simulate front layer not reported as native; compat bridge should still allow node frame.
            isLayerNative: () => false,
            getLeaferRuntime: () => runtime,
        },
        renderStyleProfile: "leafer-pragmatic-v1",
        renderStyleEngine: "leafer-components",
        frontSurface: { canvas: frontCanvas },
        canvas: frontCanvas,
        ds: { scale: 1, offset: [0, 0] },
    };
}

describe("render mode decoupled-compat routing", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("enters leafer node frame in decoupled-compat mode", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);

        expect(beginNodeFrameLeafer.call(host, ctx, [])).toBe(true);
        expect(host._leaferNodeUiFrameActive).toBe(true);
        expect(host._leaferNodeUiLayer).toBeTruthy();
    });
});
