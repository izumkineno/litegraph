// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import {
    drawSubgraphPanelWithLeaferLayer,
    renderInfoWithLeaferLayer,
} from "../../src/lgraphcanvas/renderer/leafer-panel-layer.ts";

describe("leafer panel layer route", () => {
    test("routes panel and info in full-leafer", () => {
        const host = {
            _renderModeRuntime: { form: "leafer", strategy: "full-leafer" },
            rendererAdapter: { isLayerNative: () => true },
        };
        let calls = 0;
        drawSubgraphPanelWithLeaferLayer(host, () => {
            calls += 1;
        });
        renderInfoWithLeaferLayer(host, () => {
            calls += 1;
        });

        expect(calls).toBe(2);
        expect(host._leaferLayerStats.panel.calls).toBe(2);
        expect(host._leaferLayerStats.panel.fallbackCalls).toBe(0);
    });
});
