// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import { drawNode } from "../../src/lgraphcanvas/modules/render-nodes.js";
import { createMockCanvasContext } from "../helpers/canvas-mock.js";

function createHost() {
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
            queueLegacyNodeFallback() {
                throw new Error("legacy node draw failed");
            },
        },
        renderStyleProfile: "leafer-pragmatic-v1",
        renderStyleEngine: "leafer-components",
        ds: { scale: 1, offset: [0, 0] },
        live_mode: true,
        canvas: {},
    };
}

describe("render mode node error state", () => {
    test("marks node as error when fallback queueing throws", () => {
        const host = createHost();
        const ctx = createMockCanvasContext();
        const node = {
            flags: { collapsed: false },
        };

        expect(() => drawNode.call(host, node, ctx)).not.toThrow();
        expect(node.has_errors).toBe(true);
        expect(node._render_error).toContain("legacy node draw failed");
    });
});
