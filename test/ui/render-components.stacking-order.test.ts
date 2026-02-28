// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;

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
        renderStyleProfile: "leafer-classic-v1",
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
    };
}

function createNode(id, x, y) {
    return {
        id,
        pos: [x, y],
        size: [180, 90],
        color: "#445",
        bgcolor: "#222",
        flags: { collapsed: false },
        inputs: [{ type: "number", name: "in" }],
        outputs: [{ type: "number", name: "out" }],
        widgets: [],
        properties: {},
        getTitle() {
            return `Node-${id}`;
        },
        getConnectionPos(isInput) {
            return isInput ? [this.pos[0], this.pos[1] + 24] : [this.pos[0] + this.size[0], this.pos[1] + 24];
        },
    };
}

describe("leafer components stacking order", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("reorders node groups every frame to match visible node traversal order", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        const nodeA = createNode(1, 40, 50);
        const nodeB = createNode(2, 80, 90);

        expect(beginNodeFrameLeafer.call(host, ctx, [nodeA, nodeB])).toBe(true);
        drawNode.call(host, nodeA, ctx);
        drawNode.call(host, nodeB, ctx);
        endNodeFrameLeafer.call(host, ctx, [nodeA, nodeB]);

        let viewA = host._leaferNodeUiLayer._nodeViews.get(nodeA.id);
        let viewB = host._leaferNodeUiLayer._nodeViews.get(nodeB.id);
        expect(host._leaferNodeUiLayer._rootGroup.children.at(-1)).toBe(viewB.group);

        // Simulate bringToFront(nodeA): traversal order becomes B -> A.
        expect(beginNodeFrameLeafer.call(host, ctx, [nodeB, nodeA])).toBe(true);
        drawNode.call(host, nodeB, ctx);
        drawNode.call(host, nodeA, ctx);
        endNodeFrameLeafer.call(host, ctx, [nodeB, nodeA]);

        viewA = host._leaferNodeUiLayer._nodeViews.get(nodeA.id);
        viewB = host._leaferNodeUiLayer._nodeViews.get(nodeB.id);
        expect(host._leaferNodeUiLayer._rootGroup.children.at(-1)).toBe(viewA.group);
        expect(host._leaferNodeUiLayer._rootGroup.children.at(-2)).toBe(viewB.group);
    });
});



