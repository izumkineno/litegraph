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
            options: {
                nodeRenderMode: "uiapi-experimental",
            },
            isLayerNative(layer) {
                return layer === "front";
            },
            getLeaferRuntime() {
                return runtime;
            },
        },
        frontSurface: { canvas: frontCanvas },
        canvas: frontCanvas,
        ds: { scale: 1, offset: [0, 0] },
        round_radius: 8,
        node_title_color: "#DDD",
        default_connection_color: {
            input_off: "#777",
            output_off: "#777",
        },
        graph_mouse: [22, 48],
    };
}

describe("render-nodes leafer uiapi widgets and tooltip", () => {
    let restoreDom;
    let previousTooltipFlag;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
        previousTooltipFlag = LiteGraph.show_node_tooltip;
        LiteGraph.show_node_tooltip = true;
    });

    afterEach(() => {
        LiteGraph.show_node_tooltip = previousTooltipFlag;
        restoreDom?.();
    });

    test("creates widget and tooltip UI elements in uiapi mode", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        const node = {
            id: 777,
            pos: [30, 40],
            size: [200, 120],
            flags: { collapsed: false },
            inputs: [],
            outputs: [],
            mouseOver: true,
            is_selected: true,
            widgets: [
                { type: "number", name: "speed", value: 42, y: 10 },
                { type: "toggle", name: "enabled", value: true, y: 36 },
            ],
            properties: { tooltip: "node tooltip text" },
            getTitle() {
                return "WidgetNode";
            },
            getConnectionPos(isInput) {
                return isInput
                    ? [this.pos[0], this.pos[1] + 20]
                    : [this.pos[0] + this.size[0], this.pos[1] + 20];
            },
        };

        beginNodeFrameLeafer.call(host, ctx, [node]);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);

        const nodeView = host._leaferNodeUiLayer._nodeViews.get(node.id);
        expect(nodeView).toBeTruthy();
        expect(nodeView.widgetsGroup.children.length).toBeGreaterThan(0);
        expect(nodeView.tooltipGroup.children.length).toBeGreaterThan(0);
    });
});
