// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;

import { LiteGraph } from "../../src/litegraph.js";
import { beginNodeFrameLeafer, drawNode, endNodeFrameLeafer } from "../../src/lgraphcanvas/modules/render-nodes.js";
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
        rendererAdapter: {
            options: { nodeRenderMode: "uiapi-components", nodeRenderLogs: false },
            isLayerNative: (layer) => layer === "front",
            getLeaferRuntime: () => runtime,
        },
        renderStyleProfile: "leafer-pragmatic-v1",
        renderStyleEngine: "leafer-components",
        frontSurface: { canvas: frontCanvas },
        canvas: frontCanvas,
        ds: { scale: 1, offset: [0, 0] },
        round_radius: 8,
        editor_alpha: 1,
        live_mode: false,
        render_shadows: false,
        render_collapsed_slots: true,
        node_title_color: "#DDD",
        default_connection_color: { input_off: "#777", output_off: "#777" },
        default_connection_color_byType: {},
        default_connection_color_byTypeOff: {},
        lowQualityRenderingRequired() { return false; },
        drawNodeShape() {},
        drawNodeWidgets() { return 0; },
        drawNodeTooltip() {},
        graph_mouse: [0, 0],
        connecting_output: { type: "string" },
    };
}

describe("render parity slot shapes", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("renders BOX/ARROW/GRID/CIRCLE slot shapes and incompatibility opacity", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        const node = {
            id: 1201,
            pos: [20, 40],
            size: [260, 140],
            color: "#445566",
            bgcolor: "#1A1A1A",
            flags: { collapsed: false },
            inputs: [
                { name: "evt", type: LiteGraph.EVENT },
                { name: "arr", type: "array" },
                { name: "onTrigger", type: "number" },
                { name: "num", type: "number" },
            ],
            outputs: [
                { name: "onExecuted", type: "number" },
                { name: "out", type: "number" },
            ],
            widgets: [],
            properties: {},
            getTitle() {
                return "Slots";
            },
            getConnectionPos(isInput, slot) {
                return isInput
                    ? [this.pos[0], this.pos[1] + 24 + slot * 20]
                    : [this.pos[0] + this.size[0], this.pos[1] + 24 + slot * 20];
            },
        };

        expect(beginNodeFrameLeafer.call(host, ctx, [node])).toBe(true);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);

        const view = host._leaferNodeUiLayer._nodeViews.get(node.id);
        expect(view).toBeTruthy();
        const graphics = view.slotsGroup.children.filter((child) => !("text" in child));

        const hasBox = graphics.some((g) => g.constructor?.name === "MockRect" && g.width >= 10 && g.height >= 8);
        const hasArrow = graphics.some((g) => g.constructor?.name === "MockPolygon" || g.__tag === "Polygon");
        const hasGrid = graphics.some((g) => Array.isArray(g.children) && g.children.length === 9);
        const hasCircle = graphics.some((g) => g.constructor?.name === "MockEllipse");
        const hasIncompatible = graphics.some((g) => g.opacity === 0.4);
        const arrowPolygons = graphics.filter((g) => Array.isArray(g.points) && g.points.length === 6);
        const inputArrow = arrowPolygons.find((g) => Math.min(g.points[0], g.points[2], g.points[4]) < 40);
        const outputArrow = arrowPolygons.find((g) => Math.max(g.points[0], g.points[2], g.points[4]) > 200);
        const inputHeadRight = Boolean(inputArrow && inputArrow.points[0] > inputArrow.points[2] && inputArrow.points[0] > inputArrow.points[4]);
        const outputHeadLeft = Boolean(outputArrow && outputArrow.points[0] < outputArrow.points[2] && outputArrow.points[0] < outputArrow.points[4]);

        expect(hasBox).toBe(true);
        expect(hasArrow).toBe(true);
        expect(hasGrid).toBe(true);
        expect(hasCircle).toBe(true);
        expect(hasIncompatible).toBe(true);
        expect(inputHeadRight).toBe(true);
        expect(outputHeadLeft).toBe(true);
    });
});



