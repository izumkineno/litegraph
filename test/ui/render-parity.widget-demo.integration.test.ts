// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;

import { LiteGraph } from "../../src/litegraph.js";
import { LeaferUIRendererAdapter } from "../../src/lgraphcanvas/renderer/leafer-ui-adapter.js";
import { createMockCanvasContext, createMockCanvasElement } from "../helpers/canvas-mock.js";
import { createMockLeaferUiRuntime } from "../helpers/leafer-ui-mock-runtime.js";
import { installDomEnvironment } from "../helpers/dom-env.js";
import { createCanvas, createGraphStub, createNodeStub } from "../helpers/lgraphcanvas-harness.js";

function createLeaferRuntime() {
    const runtime = createMockLeaferUiRuntime();
    class MockLeaferCanvas {
        constructor(config = {}) {
            this.view = config.view;
            this.context = createMockCanvasContext();
            this.context.canvas = this.view;
            this.pixelRatio = 1;
        }

        resize(size) {
            this.view.width = size.width;
            this.view.height = size.height;
            this.context = createMockCanvasContext();
            this.context.canvas = this.view;
        }

        destroy() {}
    }
    runtime.LeaferCanvas = MockLeaferCanvas;
    return runtime;
}

function makeEvent(overrides = {}) {
    return {
        clientX: 0,
        clientY: 0,
        localX: overrides.localX ?? overrides.clientX ?? 0,
        localY: overrides.localY ?? overrides.clientY ?? 0,
        which: 1,
        button: 0,
        isPrimary: true,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        wheelDeltaY: 0,
        deltaY: 0,
        preventDefault() {},
        stopPropagation() {},
        ...overrides,
    };
}

describe("render parity widget demo integration", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("keeps zoom/pan/drag/link/widget interactions in uiapi-components mode", () => {
        const canvasElement = createCanvas({ width: 1200, height: 800 });
        const context = createMockCanvasContext();
        canvasElement.getContext = () => context;
        canvasElement.ownerDocument = {
            ...document,
            createElement(tag) {
                if (tag !== "canvas") {
                    throw new Error("unexpected element request");
                }
                const nextCtx = createMockCanvasContext();
                const nextCanvas = createMockCanvasElement(nextCtx);
                nextCanvas.localName = "canvas";
                nextCanvas.ownerDocument = document;
                return nextCanvas;
            },
        };

        const source = createNodeStub({
            id: 201,
            pos: [80, 80],
            size: [200, 100],
            outputs: [{ type: "number", links: [] }],
        });
        const target = createNodeStub({
            id: 202,
            pos: [420, 90],
            size: [200, 100],
            inputs: [{ type: "number", link: null }],
        });
        const widgetNode = createNodeStub({
            id: 203,
            pos: [80, 260],
            size: [240, 140],
            flags: { allow_interaction: true },
            inputs: [],
            outputs: [],
        });
        widgetNode.widgets = [{
            type: "slider",
            name: "Amount",
            value: 0.2,
            options: { min: 0, max: 1, precision: 2 },
            last_y: 2,
        }];
        widgetNode.graph = null;
        widgetNode.properties = {};
        widgetNode.onWidgetChanged = () => {};
        widgetNode.setProperty = () => {};

        const graph = createGraphStub({
            _nodes: [source, target, widgetNode],
            getNodeOnPos(x, y) {
                if (x >= source.pos[0] && x <= source.pos[0] + source.size[0]
                    && y >= source.pos[1] && y <= source.pos[1] + source.size[1]) {
                    return source;
                }
                if (x >= target.pos[0] && x <= target.pos[0] + target.size[0]
                    && y >= target.pos[1] && y <= target.pos[1] + target.size[1]) {
                    return target;
                }
                return null;
            },
        });
        source.graph = graph;
        target.graph = graph;
        widgetNode.graph = graph;

        const adapter = new LeaferUIRendererAdapter({
            mode: "full-leafer",
            nodeRenderMode: "uiapi-components",
            leaferRuntime: createLeaferRuntime(),
            enableLogs: false,
        });
        const graphCanvas = new LiteGraph.LGraphCanvas(canvasElement, graph, {
            skip_render: true,
            skip_events: true,
            rendererAdapter: adapter,
            renderStyleProfile: "leafer-pragmatic-v1",
            renderStyleEngine: "leafer-components",
        });
        graphCanvas.ds.scale = 1;
        graphCanvas.ds.offset = [0, 0];

        const zoomEvent = makeEvent({ clientX: 120, clientY: 120, wheelDeltaY: 120, deltaY: -120 });
        graphCanvas.processMouseWheel(zoomEvent);
        expect(graphCanvas.ds.scale).toBeGreaterThan(1);

        graphCanvas.dragging_canvas = true;
        graphCanvas.last_mouse = [0, 0];
        const panOffsetBefore = [...graphCanvas.ds.offset];
        graphCanvas.processMouseMove(makeEvent({ clientX: 16, clientY: 10 }));
        expect(graphCanvas.ds.offset[0]).not.toBe(panOffsetBefore[0]);
        expect(graphCanvas.ds.offset[1]).not.toBe(panOffsetBefore[1]);

        graphCanvas.dragging_canvas = false;
        const originalProcessNodeWidgets = graphCanvas.processNodeWidgets.bind(graphCanvas);
        graphCanvas.processNodeWidgets = () => null;
        graphCanvas.processNodeSelected = () => {};
        graphCanvas.processMouseDown(makeEvent({ clientX: 90, clientY: 90, which: 1 }));
        const draggedBefore = [...source.pos];
        graphCanvas.selected_nodes = { [source.id]: source };
        graphCanvas.processMouseMove(makeEvent({ clientX: 140, clientY: 140 }));
        expect(source.pos[0]).toBeGreaterThanOrEqual(draggedBefore[0]);
        graphCanvas.processMouseUp(makeEvent({ clientX: 140, clientY: 140, which: 1 }));
        graphCanvas.processNodeWidgets = originalProcessNodeWidgets;

        graphCanvas.connecting_node = source;
        graphCanvas.connecting_output = source.outputs[0];
        graphCanvas.connecting_slot = 0;
        graphCanvas.isOverNodeInput = () => 0;
        graph.getNodeOnPos = () => target;
        graphCanvas.processMouseUp(makeEvent({ clientX: 430, clientY: 100, which: 1 }));
        expect(source.connectCalls.length).toBeGreaterThan(0);

        const sliderRef = widgetNode.widgets[0];
        const sliderWidget = graphCanvas.processNodeWidgets(
            widgetNode,
            [widgetNode.pos[0] + 140, widgetNode.pos[1] + 8],
            { type: "pointerdown", deltaX: 0, click_time: 0 },
            sliderRef,
        );
        expect(sliderWidget?.type).toBe("slider");
        expect(widgetNode.widgets[0].value).toBeGreaterThan(0.2);
    });
});



