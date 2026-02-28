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
        graph_mouse: [16, 12],
    };
}

describe("render components callbacks compatibility", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("preserves onDraw* callback signatures and invocation", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);
        const calls = [];
        const node = {
            id: 901,
            pos: [10, 15],
            size: [180, 90],
            color: "#446688",
            bgcolor: "#1A1A1A",
            flags: { collapsed: false },
            inputs: [],
            outputs: [],
            widgets: [],
            properties: {},
            onDrawBackground(...args) {
                calls.push({ name: "bg", count: args.length, thisIsNode: this === node });
            },
            onDrawTitle(...args) {
                calls.push({ name: "title", count: args.length, thisIsNode: this === node });
            },
            onDrawForeground(...args) {
                calls.push({ name: "fg", count: args.length, thisIsNode: this === node });
            },
            getTitle() {
                return "CallbackNode";
            },
            getConnectionPos(isInput) {
                return isInput ? [this.pos[0], this.pos[1] + 24] : [this.pos[0] + this.size[0], this.pos[1] + 24];
            },
        };

        expect(beginNodeFrameLeafer.call(host, ctx, [node])).toBe(true);
        drawNode.call(host, node, ctx);
        endNodeFrameLeafer.call(host, ctx, [node]);

        const names = calls.map((call) => call.name);
        expect(names.includes("bg")).toBe(true);
        expect(names.includes("title")).toBe(true);
        expect(names.includes("fg")).toBe(true);
        expect(calls.every((call) => call.thisIsNode)).toBe(true);
    });
});



