// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import { drawNode } from "../../src/lgraphcanvas/modules/render-nodes.js";
import { createMockCanvasContext } from "../helpers/canvas-mock.js";

function createHost() {
    const queued = [];
    return {
        _renderModeRuntime: {
            form: "leafer",
            strategy: "full-leafer",
            fallbackPolicy: {
                nodeLevelLegacyFallback: true,
                markNodeErrorOnFailure: true,
            },
        },
        rendererAdapter: {
            options: { nodeRenderMode: "uiapi-components" },
            isLayerNative: () => true,
            getLeaferRuntime: () => ({}),
        },
        _leaferNodeUiFrameActive: true,
        _leaferNodeUiLayer: {
            upsertNode: () => false,
            queueLegacyNodeFallback(node, hostRef, drawLegacyWithCtx) {
                queued.push({ node, hostRef, drawLegacyWithCtx });
                return true;
            },
        },
        _queuedFallbacks: queued,
        renderStyleProfile: "leafer-pragmatic-v1",
        renderStyleEngine: "leafer-components",
        ds: { scale: 1, offset: [0, 0] },
        live_mode: true,
        canvas: {},
    };
}

describe("render mode node fallback", () => {
    test("queues node-level fallback when component route fails", () => {
        const host = createHost();
        const ctx = createMockCanvasContext();
        let foregroundCalls = 0;
        const node = {
            flags: { collapsed: false },
            onDrawForeground() {
                foregroundCalls += 1;
            },
        };

        drawNode.call(host, node, ctx);

        expect(foregroundCalls).toBe(0);
        expect(host._queuedFallbacks.length).toBe(1);
        expect(typeof host._queuedFallbacks[0].drawLegacyWithCtx).toBe("function");
        expect(node._render_error).toBeUndefined();
        expect(host._leaferNodeUiFrameActive).toBe(true);
    });
});
