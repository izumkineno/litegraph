// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import { drawNode } from "../../src/lgraphcanvas/modules/render-nodes.js";
import { createMockCanvasContext } from "../helpers/canvas-mock.js";

describe("render mode decoupled-compat fallback queue", () => {
    test("queues node-level legacy fallback on bridge instead of immediate front ctx draw", () => {
        const ctx = createMockCanvasContext();
        let foregroundCalls = 0;
        const queued = [];

        const host = {
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
                options: { nodeRenderMode: "uiapi-components" },
                isLayerNative: () => false,
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
            renderStyleProfile: "leafer-pragmatic-v1",
            renderStyleEngine: "leafer-components",
            ds: { scale: 1, offset: [0, 0] },
            live_mode: true,
            canvas: {},
        };
        const node = {
            id: 42,
            flags: { collapsed: false },
            onDrawForeground() {
                foregroundCalls += 1;
            },
        };

        drawNode.call(host, node, ctx);

        expect(queued.length).toBe(1);
        expect(queued[0].node).toBe(node);
        expect(typeof queued[0].drawLegacyWithCtx).toBe("function");
        expect(foregroundCalls).toBe(0);
        expect(host._leaferNodeUiFrameActive).toBe(true);
    });
});
