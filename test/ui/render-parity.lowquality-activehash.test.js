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
        _lowQuality: false,
        lowQualityRenderingRequired() {
            return this._lowQuality;
        },
        drawNodeShape() {},
        drawNodeWidgets() { return 0; },
        drawNodeTooltip() {},
        graph_mouse: [0, 0],
        node_widget: null,
    };
}

function renderNodeFrame(host, ctx, node) {
    expect(beginNodeFrameLeafer.call(host, ctx, [node])).toBe(true);
    drawNode.call(host, node, ctx);
    endNodeFrameLeafer.call(host, ctx, [node]);
    return host._leaferNodeUiLayer._nodeViews.get(node.id);
}

describe("render parity low-quality and active-widget hash", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("re-renders when lowQuality/renderText or active widget changes", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        const node = {
            id: 1501,
            pos: [20, 30],
            size: [220, 130],
            color: "#446688",
            bgcolor: "#1A1A1A",
            flags: { collapsed: false },
            inputs: [],
            outputs: [],
            widgets: [
                { type: "slider", name: "gain", value: 0.5, options: { min: 0, max: 1, precision: 2 } },
            ],
            properties: {},
            getTitle() {
                return "LowQualityHash";
            },
            getConnectionPos(isInput) {
                return isInput ? [this.pos[0], this.pos[1] + 24] : [this.pos[0] + this.size[0], this.pos[1] + 24];
            },
        };

        const viewNormal = renderNodeFrame(host, ctx, node);
        const normalStyleHash = viewNormal.styleHash;
        const normalWidgetHash = viewNormal.widgetHash;
        const normalWidgetChildren = viewNormal.widgetsGroup.children.length;

        host._lowQuality = true;
        host.node_widget = null;
        const viewLowQuality = renderNodeFrame(host, ctx, node);
        const lowQualityStyleHash = viewLowQuality.styleHash;
        const lowQualityWidgetHash = viewLowQuality.widgetHash;
        const lowQualityWidgetChildren = viewLowQuality.widgetsGroup.children.length;

        expect(lowQualityStyleHash).not.toBe(normalStyleHash);
        expect(lowQualityWidgetChildren).toBeLessThan(normalWidgetChildren);

        host.node_widget = [node, node.widgets[0]];
        const viewActiveWidget = renderNodeFrame(host, ctx, node);
        expect(viewActiveWidget.widgetHash).not.toBe(lowQualityWidgetHash);
        expect(viewActiveWidget.widgetHash).not.toBe(normalWidgetHash);
    });
});
