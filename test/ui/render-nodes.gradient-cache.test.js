const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import { LiteGraph } from "../../src/litegraph.js";
import { drawNodeShape } from "../../src/lgraphcanvas/modules/render-nodes.js";
import { createMockCanvasContext } from "../helpers/canvas-mock.js";

function createGradientTrackingContext() {
    const ctx = createMockCanvasContext();
    let gradientCount = 0;
    ctx.rect = () => {};
    ctx.clip = () => {};
    ctx.createLinearGradient = () => {
        gradientCount += 1;
        return {
            addColorStop() {},
        };
    };
    return {
        ctx,
        getGradientCount: () => gradientCount,
    };
}

function createShapeHost() {
    return {
        round_radius: 8,
        ds: { scale: 1 },
        use_gradients: true,
        render_title_colored: true,
        title_text_font: "12px Arial",
        node_title_color: "#DDD",
        graph_mouse: [0, 0],
        canvas: {},
        lowQualityRenderingRequired() {
            return false;
        },
    };
}

function createNode() {
    return {
        _shape: LiteGraph.BOX_SHAPE,
        constructor: {
            title_mode: LiteGraph.NORMAL_TITLE,
            title_color: "#66AAFF",
        },
        flags: { collapsed: false },
        mode: LiteGraph.ALWAYS,
        size: [140, 70],
        pos: [0, 0],
        getTitle() {
            return "GradientNode";
        },
    };
}

describe("render-nodes gradient cache", () => {
    test("caches gradients per rendering context", () => {
        const host = createShapeHost();
        const node = createNode();
        const size = [node.size[0], node.size[1]];
        const first = createGradientTrackingContext();
        const second = createGradientTrackingContext();

        drawNodeShape.call(host, node, first.ctx, size, "#223344", "#111111", false, false);
        drawNodeShape.call(host, node, first.ctx, size, "#223344", "#111111", false, false);
        drawNodeShape.call(host, node, second.ctx, size, "#223344", "#111111", false, false);

        expect(first.getGradientCount()).toBe(1);
        expect(second.getGradientCount()).toBe(1);
    });
});
