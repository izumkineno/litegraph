// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;

import { beginNodeFrameLeafer } from "../../src/lgraphcanvas/modules/render-nodes.js";
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
            options: { nodeRenderMode: "legacy-ctx", nodeRenderLogs: false },
            isLayerNative: (layer) => layer === "front",
            getLeaferRuntime: () => runtime,
        },
        renderStyleProfile: "legacy",
        renderStyleEngine: "legacy",
        frontSurface: { canvas: frontCanvas },
        canvas: frontCanvas,
        ds: { scale: 1, offset: [0, 0] },
    };
}

describe("render components mode switch", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("enables only in valid uiapi modes and style profile", () => {
        const runtime = createMockLeaferUiRuntime();
        const ctx = createMockCanvasContext();
        const host = createHost(runtime, ctx);

        host.rendererAdapter.options.nodeRenderMode = "legacy-ctx";
        expect(beginNodeFrameLeafer.call(host, ctx, [])).toBe(false);

        host.rendererAdapter.options.nodeRenderMode = "uiapi-parity";
        expect(beginNodeFrameLeafer.call(host, ctx, [])).toBe(true);

        host.rendererAdapter.options.nodeRenderMode = "uiapi-components";
        host.renderStyleProfile = "legacy";
        host.renderStyleEngine = "legacy";
        expect(beginNodeFrameLeafer.call(host, ctx, [])).toBe(false);

        host.renderStyleProfile = "leafer-pragmatic-v1";
        host.renderStyleEngine = "leafer-components";
        expect(beginNodeFrameLeafer.call(host, ctx, [])).toBe(true);

        host.renderStyleProfile = "leafer-classic-v1";
        host.renderStyleEngine = "leafer-components";
        expect(beginNodeFrameLeafer.call(host, ctx, [])).toBe(true);
    });
});



