// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import { drawFrontOverlayWithLeaferLayer } from "../../src/lgraphcanvas/renderer/leafer-overlay-layer.ts";

describe("leafer overlay layer route", () => {
    test("falls back when front layer is non-native", () => {
        const host = {
            _renderModeRuntime: { form: "leafer", strategy: "full-leafer" },
            rendererAdapter: { isLayerNative: (layer) => layer !== "front" },
        };
        let called = 0;
        drawFrontOverlayWithLeaferLayer(host, () => {
            called += 1;
        });

        expect(called).toBe(1);
        expect(host._leaferLayerStats.overlay.fallbackCalls).toBe(1);
    });
});
