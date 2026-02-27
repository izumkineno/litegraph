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
                nodeRenderMode: "uiapi-parity",
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
        editor_alpha: 1,
        live_mode: false,
        render_shadows: false,
        render_collapsed_slots: true,
        inner_text_font: "12px sans-serif",
        title_text_font: "14px sans-serif",
        node_title_color: "#DDD",
        default_connection_color: {
            input_off: "#777",
            output_off: "#777",
        },
        lowQualityRenderingRequired() {
            return false;
        },
        drawNodeShape() {
        },
        drawNodeWidgets() {
            return 0;
        },
        drawNodeTooltip() {
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

    test("parity mode invokes legacy widgets and tooltip draw hooks", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        let widgetCalls = 0;
        let tooltipCalls = 0;
        host.drawNodeWidgets = () => {
            widgetCalls += 1;
            return 0;
        };
        host.drawNodeTooltip = () => {
            tooltipCalls += 1;
        };
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

        expect(widgetCalls).toBe(1);
        expect(tooltipCalls).toBe(1);
    });
});
