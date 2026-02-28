// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import { drawBackCanvasWithLeaferLayer } from "../../src/lgraphcanvas/renderer/leafer-back-layer.ts";

describe("leafer back layer route", () => {
    test("uses full-leafer route without fallback increment", () => {
        const host = {
            _renderModeRuntime: { form: "leafer", strategy: "full-leafer" },
            rendererAdapter: { isLayerNative: () => true },
        };
        let called = 0;
        drawBackCanvasWithLeaferLayer(host, () => {
            called += 1;
        });
        expect(called).toBe(1);
        expect(host._leaferLayerStats.back.calls).toBe(1);
        expect(host._leaferLayerStats.back.fallbackCalls).toBe(0);
    });

    test("falls back when mode is not full-leafer", () => {
        const host = {
            _renderModeRuntime: { form: "legacy", strategy: "legacy" },
            rendererAdapter: { isLayerNative: () => false },
        };
        let called = 0;
        drawBackCanvasWithLeaferLayer(host, () => {
            called += 1;
        });
        expect(called).toBe(1);
        expect(host._leaferLayerStats.back.fallbackCalls).toBe(1);
    });
});
