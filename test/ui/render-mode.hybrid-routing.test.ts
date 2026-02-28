// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import { beginNodeFrameLeafer } from "../../src/lgraphcanvas/modules/render-nodes.js";
import { resolveRenderMode } from "../../src/lgraphcanvas/modes/resolve-render-mode.ts";
import { createMockCanvasContext, createMockCanvasElement } from "../helpers/canvas-mock.js";

describe("render mode hybrid routing", () => {
    test("hybrid runtime keeps front node rendering on legacy path", () => {
        const ctx = createMockCanvasContext();
        const canvas = createMockCanvasElement(ctx);
        const runtime = resolveRenderMode({
            options: {
                renderForm: "leafer",
                renderStrategy: "hybrid-back",
            },
        });
        const host = {
            _renderModeRuntime: runtime,
            rendererAdapter: {
                options: { nodeRenderMode: "uiapi-components" },
                isLayerNative: () => true,
                getLeaferRuntime: () => ({}),
            },
            renderStyleProfile: "leafer-pragmatic-v1",
            renderStyleEngine: "leafer-components",
            frontSurface: { canvas },
            canvas,
        };

        expect(runtime.capabilities.frontNative).toBe(false);
        expect(runtime.capabilities.backNative).toBe(true);
        expect(beginNodeFrameLeafer.call(host, ctx, [])).toBe(false);
    });
});
