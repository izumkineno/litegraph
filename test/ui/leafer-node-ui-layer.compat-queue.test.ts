// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;

import { LeaferNodeUiLayer } from "../../src/lgraphcanvas/renderer/leafer-node-ui-layer.js";
import { createMockCanvasContext, createMockCanvasElement } from "../helpers/canvas-mock.js";
import { installDomEnvironment } from "../helpers/dom-env.js";

function createRuntimeWithOrder(order) {
    class MockGroup {
        constructor(data = {}) {
            this.children = [];
            Object.assign(this, data);
        }
        add(child) {
            if (child) this.children.push(child);
        }
        clear() {
            this.children.length = 0;
        }
        remove(child) {
            const index = this.children.indexOf(child);
            if (index >= 0) {
                this.children.splice(index, 1);
            }
        }
        set(data) {
            Object.assign(this, data);
        }
    }

    class MockCanvas extends MockGroup {
        constructor(data = {}) {
            super(data);
            this.context = createMockCanvasContext();
            this.context.canvas = { width: this.width ?? 1, height: this.height ?? 1 };
        }
        paint() {}
    }

    class MockLeafer extends MockGroup {
        constructor(config = {}) {
            super(config);
            this.view = config.view;
        }
        forceRender() {
            order.push("forceRender");
        }
        resize() {}
        destroy() {}
    }

    return {
        Leafer: MockLeafer,
        Group: MockGroup,
        Rect: MockGroup,
        Text: MockGroup,
        Ellipse: MockGroup,
        Polygon: MockGroup,
        Line: MockGroup,
        Path: MockGroup,
        Canvas: MockCanvas,
    };
}

describe("leafer node ui layer compat queue", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("renderTo flush order is forceRender -> fallback queue -> drawImage", () => {
        const order = [];
        const runtime = createRuntimeWithOrder(order);
        const layer = new LeaferNodeUiLayer();
        const ownerDocument = {
            createElement(tag) {
                if (tag !== "canvas") {
                    throw new Error("unexpected element request");
                }
                return createMockCanvasElement(createMockCanvasContext());
            },
        };

        layer.init({
            runtime,
            ownerDocument,
            width: 320,
            height: 180,
            enableLogs: false,
        });
        layer.beginFrame({
            nodeRenderMode: "uiapi-components",
            renderStyleProfile: "leafer-pragmatic-v1",
        });
        layer.queueLegacyNodeFallback(
            { id: 1, pos: [10, 20] },
            { ds: { scale: 1, offset: [0, 0] } },
            () => {
                order.push("fallbackDraw");
            },
        );
        layer.endFrame();

        const targetCtx = createMockCanvasContext();
        const drawImage = targetCtx.drawImage;
        targetCtx.drawImage = (...args) => {
            order.push("drawImage");
            drawImage(...args);
        };

        layer.renderTo(targetCtx);
        expect(order).toEqual(["forceRender", "fallbackDraw", "drawImage"]);
    });
});
