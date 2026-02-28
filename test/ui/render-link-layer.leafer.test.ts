// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import {
    drawConnectionsWithLeaferLayer,
    drawLinkTooltipWithLeaferLayer,
    renderLinkWithLeaferLayer,
} from "../../src/lgraphcanvas/renderer/leafer-link-layer.ts";

describe("leafer link layer route", () => {
    test("routes link calls in full-leafer", () => {
        const host = {
            _renderModeRuntime: { form: "leafer", strategy: "full-leafer" },
            rendererAdapter: { isLayerNative: () => true },
        };
        let calls = 0;
        drawConnectionsWithLeaferLayer(host, () => {
            calls += 1;
        });
        renderLinkWithLeaferLayer(host, () => {
            calls += 1;
        });
        drawLinkTooltipWithLeaferLayer(host, () => {
            calls += 1;
        });

        expect(calls).toBe(3);
        expect(host._leaferLayerStats.link.calls).toBe(3);
        expect(host._leaferLayerStats.link.fallbackCalls).toBe(0);
    });
});
