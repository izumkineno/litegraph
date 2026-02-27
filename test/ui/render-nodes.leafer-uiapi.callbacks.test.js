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
        drawNodeShape(node, ctx) {
            node.onDrawBackground?.(ctx, this, this.canvas, this.graph_mouse);
        },
        drawNodeWidgets() {
            return 0;
        },
        drawNodeTooltip() {
        },
        graph_mouse: [11, 22],
    };
}

describe("render-nodes leafer uiapi callbacks", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("onDrawBackground and onDrawForeground keep callback signature and order", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        const callbackOrder = [];
        const bgCalls = [];
        const fgCalls = [];
        const bgThisRefs = [];
        const fgThisRefs = [];
        const node = {
            id: 501,
            pos: [20, 30],
            size: [160, 90],
            flags: { collapsed: false },
            inputs: [],
            outputs: [],
            widgets: [],
            properties: {},
            getTitle() {
                return "CallbackNode";
            },
            getConnectionPos(isInput) {
                return isInput
                    ? [this.pos[0], this.pos[1] + 20]
                    : [this.pos[0] + this.size[0], this.pos[1] + 20];
            },
            onDrawBackground(...args) {
                bgThisRefs.push(this);
                callbackOrder.push("bg");
                bgCalls.push(args);
            },
            onDrawForeground(...args) {
                fgThisRefs.push(this);
                callbackOrder.push("fg");
                fgCalls.push(args);
            },
        };

        beginNodeFrameLeafer.call(host, ctx, [node]);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);

        expect(callbackOrder).toEqual(["bg", "fg"]);
        expect(bgCalls[0][1]).toBe(host);
        expect(bgCalls[0][2]).toBe(host.canvas);
        expect(bgCalls[0][3]).toBe(host.graph_mouse);
        expect(fgCalls[0][1]).toBe(host);
        expect(fgCalls[0][2]).toBe(host.canvas);
        expect(bgThisRefs[0]).toBe(node);
        expect(fgThisRefs[0]).toBe(node);
    });
});
