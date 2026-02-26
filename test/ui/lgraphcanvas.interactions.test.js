const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";
import { installDomEnvironment } from "../helpers/dom-env.js";
import { createCanvas, createGraphStub, createNodeStub } from "../helpers/lgraphcanvas-harness.js";

const LGraphCanvas = LiteGraph.LGraphCanvas;

function makeEvent(overrides = {}) {
    return {
        clientX: 0,
        clientY: 0,
        localX: overrides.localX ?? 0,
        localY: overrides.localY ?? 0,
        which: 1,
        button: 0,
        isPrimary: true,
        ctrlKey: false,
        altKey: false,
        shiftKey: false,
        metaKey: false,
        preventDefault() {
            this.prevented = true;
        },
        stopPropagation() {
            this.stopped = true;
        },
        ...overrides,
    };
}

function createCanvasWithGraph(graphOverrides = {}, canvasOverrides = {}) {
    const canvasEl = createCanvas();
    const graph = createGraphStub(graphOverrides);
    const canvas = new LGraphCanvas(canvasEl, graph, {
        skip_render: true,
        skip_events: true,
        ...canvasOverrides,
    });
    canvas.ds.scale = 1;
    canvas.ds.offset = [0, 0];
    return { canvas, graph, canvasEl };
}

describe("LGraphCanvas interactions", () => {
    let restoreDom;
    let previousContextMenu;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
        previousContextMenu = LiteGraph.ContextMenu;
        LiteGraph.ContextMenu = { closeAll() {} };
    });

    afterEach(() => {
        if (previousContextMenu === undefined) {
            delete LiteGraph.ContextMenu;
        } else {
            LiteGraph.ContextMenu = previousContextMenu;
        }
        restoreDom?.();
    });

    test("processMouseDown returns early without graph", () => {
        const canvasEl = createCanvas();
        const canvas = new LGraphCanvas(canvasEl, null, { skip_render: true, skip_events: true });
        canvas.ds.scale = 1;
        canvas.ds.offset = [0, 0];

        const event = makeEvent({ clientX: 10, clientY: 10, which: 1 });
        const result = canvas.processMouseDown(event);

        expect(result).toBeUndefined();
        expect(canvas.pointer_is_down).toBe(false);
    });

    test("processMouseDown ignores clicks outside viewport", () => {
        const { canvas, graph } = createCanvasWithGraph();
        canvas.viewport = [0, 0, 10, 10];

        const event = makeEvent({ clientX: 50, clientY: 50, which: 1 });
        canvas.processMouseDown(event);

        expect(canvas.pointer_is_down).toBe(false);
        expect(canvas.dragging_rectangle).toBeNull();
        expect(graph.changeCalls).toBe(0);
    });

    test("processMouseDown with ctrl starts rectangle selection", () => {
        const { canvas } = createCanvasWithGraph();
        const event = makeEvent({ clientX: 20, clientY: 30, ctrlKey: true, which: 1 });

        canvas.processMouseDown(event);

        expect(canvas.dragging_rectangle).toBeInstanceOf(Float32Array);
        expect(Array.from(canvas.dragging_rectangle)).toEqual([20, 30, 1, 1]);
    });

    test("processMouseDown selects node and starts drag", () => {
        const node = createNodeStub({ id: 10, pos: [0, 0], size: [100, 60], outputs: [], inputs: [] });
        const { canvas, graph } = createCanvasWithGraph({
            _nodes: [node],
            getNodeOnPos() {
                return node;
            },
        });

        let broughtToFront = null;
        let selected = null;
        canvas.bringToFront = (target) => {
            broughtToFront = target;
        };
        canvas.processNodeWidgets = () => null;
        canvas.processNodeSelected = (target) => {
            selected = target;
        };

        const event = makeEvent({ clientX: 10, clientY: 10, which: 1 });
        canvas.processMouseDown(event);

        expect(broughtToFront).toBe(node);
        expect(selected).toBe(node);
        expect(canvas.node_dragged).toBe(node);
        expect(graph.beforeChangeCalls).toBe(1);
    });

    test("processMouseDown alt-drag clones node", () => {
        const previousAltClone = LiteGraph.alt_drag_do_clone_nodes;
        LiteGraph.alt_drag_do_clone_nodes = true;

        const original = createNodeStub({ id: 1, pos: [0, 0], size: [100, 60] });
        const cloned = createNodeStub({ id: 2, pos: [5, 5], size: [100, 60] });
        original.clone = () => cloned;

        const { canvas, graph } = createCanvasWithGraph({
            _nodes: [original],
            getNodeOnPos() {
                return original;
            },
        });

        let selected = null;
        canvas.processNodeWidgets = () => null;
        canvas.processNodeSelected = (target) => {
            selected = target;
        };

        const event = makeEvent({ clientX: 10, clientY: 10, altKey: true, which: 1 });
        canvas.processMouseDown(event);

        expect(graph._nodes).toContain(cloned);
        expect(canvas.node_dragged).toBe(cloned);
        expect(selected).toBe(cloned);

        LiteGraph.alt_drag_do_clone_nodes = previousAltClone;
    });

    test("processMouseMove updates dragging rectangle", () => {
        const { canvas } = createCanvasWithGraph();
        canvas.dragging_rectangle = new Float32Array([10, 10, 1, 1]);

        const event = makeEvent({ clientX: 20, clientY: 25 });
        canvas.processMouseMove(event);

        expect(Array.from(canvas.dragging_rectangle)).toEqual([10, 10, 10, 15]);
    });

    test("processMouseMove drags canvas offset", () => {
        const { canvas } = createCanvasWithGraph();
        canvas.dragging_canvas = true;
        canvas.last_mouse = [0, 0];
        canvas.ds.scale = 1;
        canvas.ds.offset = [0, 0];

        const event = makeEvent({ clientX: 15, clientY: 5 });
        canvas.processMouseMove(event);

        expect(canvas.ds.offset).toEqual([15, 5]);
        expect(canvas.dirty_canvas).toBe(true);
        expect(canvas.dirty_bgcanvas).toBe(true);
    });

    test("processMouseMove drags selected nodes", () => {
        const node = createNodeStub({ id: 4, pos: [0, 0], size: [80, 40] });
        const { canvas, graph } = createCanvasWithGraph({
            _nodes: [node],
            getNodeOnPos() {
                return null;
            },
        });

        canvas.node_dragged = node;
        canvas.selected_nodes = { 4: node };
        canvas.last_mouse = [0, 0];

        const event = makeEvent({ clientX: 12, clientY: 8 });
        canvas.processMouseMove(event);

        expect(node.pos).toEqual([12, 8]);
        expect(canvas.dirty_canvas).toBe(true);
        expect(canvas.dirty_bgcanvas).toBe(true);
    });

    test("processMouseMove highlights input during connection", () => {
        const target = createNodeStub({
            id: 7,
            pos: [0, 0],
            size: [80, 40],
            inputs: [{ type: "number" }],
        });
        const { canvas, graph } = createCanvasWithGraph({
            _nodes: [target],
            getNodeOnPos() {
                return target;
            },
        });

        canvas.connecting_node = createNodeStub({ id: 6 });
        canvas.connecting_output = { type: "number" };
        canvas.isOverNodeBox = () => false;
        canvas.isOverNodeInput = (_node, _x, _y, pos) => {
            pos[0] = 11;
            pos[1] = 22;
            return 0;
        };

        const event = makeEvent({ clientX: 10, clientY: 10 });
        canvas.processMouseMove(event);

        expect(canvas._highlight_input).toEqual([11, 22]);
        expect(canvas._highlight_input_slot).toBe(target.inputs[0]);
    });

    test("processMouseMove highlights output during input connection", () => {
        const target = createNodeStub({
            id: 9,
            pos: [0, 0],
            size: [80, 40],
            outputs: [{ type: "number" }],
        });
        const { canvas, graph } = createCanvasWithGraph({
            _nodes: [target],
            getNodeOnPos() {
                return target;
            },
        });

        canvas.connecting_node = createNodeStub({ id: 8 });
        canvas.connecting_input = { type: "number" };
        canvas.isOverNodeBox = () => true;
        canvas.isOverNodeOutput = (_node, _x, _y, pos) => {
            pos[0] = 5;
            pos[1] = 6;
            return 0;
        };

        const event = makeEvent({ clientX: 12, clientY: 12 });
        canvas.processMouseMove(event);

        expect(canvas._highlight_output).toEqual([5, 6]);
    });

    test("processMouseUp connects output to input", () => {
        const source = createNodeStub({ id: 1, outputs: [{ type: "number" }] });
        const target = createNodeStub({ id: 2, inputs: [{ type: "number" }] });
        const { canvas } = createCanvasWithGraph({
            _nodes: [source, target],
            getNodeOnPos() {
                return target;
            },
        });

        canvas.connecting_node = source;
        canvas.connecting_output = source.outputs[0];
        canvas.connecting_slot = 0;
        canvas.isOverNodeInput = () => 0;

        const event = makeEvent({ clientX: 10, clientY: 10, which: 1 });
        canvas.processMouseUp(event);

        expect(source.connectCalls.length).toBe(1);
        expect(source.connectCalls[0][0]).toBe(0);
        expect(source.connectCalls[0][1]).toBe(target);
        expect(source.connectCalls[0][2]).toBe(0);
    });

    test("processMouseUp completes rectangle selection", () => {
        const node = createNodeStub({
            id: 3,
            pos: [10, 10],
            size: [20, 20],
        });
        const { canvas } = createCanvasWithGraph({
            _nodes: [node],
            getNodeOnPos() {
                return null;
            },
        });

        canvas.dragging_rectangle = new Float32Array([0, 0, 30, 30]);
        let selectedNodes = null;
        canvas.selectNodes = (nodes) => {
            selectedNodes = nodes;
        };

        const event = makeEvent({ clientX: 10, clientY: 10, which: 1 });
        canvas.processMouseUp(event);

        expect(canvas.dragging_rectangle).toBeNull();
        expect(selectedNodes).toEqual([node]);
    });

    test("processMouseUp finalizes node drag", () => {
        const node = createNodeStub({ id: 5, pos: [12.2, 8.7], size: [60, 40] });
        const { canvas, graph } = createCanvasWithGraph({
            _nodes: [node],
            getNodeOnPos() {
                return null;
            },
        });

        let movedNode = null;
        graph.config.align_to_grid = true;
        canvas.node_dragged = node;
        canvas.onNodeMoved = (target) => {
            movedNode = target;
        };

        const event = makeEvent({ clientX: 120, clientY: 120, which: 1 });
        canvas.processMouseUp(event);

        expect(movedNode).toBe(node);
        expect(graph.changedPayloads.some((payload) => payload.action === "nodeDrag")).toBe(true);
        expect(graph.afterChangeCalls).toBe(1);
        expect(canvas.node_dragged).toBeNull();
    });

    test("processMouseWheel scales when inside viewport", () => {
        const { canvas, graph } = createCanvasWithGraph();
        canvas.ds.scale = 1;
        canvas.ds.changeScale = (value, center) => {
            canvas.ds.lastScale = value;
            canvas.ds.lastCenter = center;
        };

        const event = makeEvent({ clientX: 5, clientY: 5, wheelDeltaY: 120 });
        canvas.processMouseWheel(event);

        expect(canvas.ds.lastScale).toBeGreaterThan(1);
        expect(canvas.ds.lastCenter).toEqual([5, 5]);
        expect(graph.changeCalls).toBe(1);
        expect(event.prevented).toBe(true);
    });

    test("processDrop creates node from file extension", () => {
        const { canvas, graph } = createCanvasWithGraph({
            getNodeOnPos() {
                return null;
            },
        });

        const previousTypes = LiteGraph.node_types_by_file_extension;
        const previousCreateNode = LiteGraph.createNode;

        const droppedNode = createNodeStub({ id: 30 });
        let dropFileCalled = 0;
        droppedNode.onDropFile = () => {
            dropFileCalled += 1;
        };

        LiteGraph.node_types_by_file_extension = { json: { type: "demo/node" } };
        LiteGraph.createNode = () => droppedNode;

        const file = { name: "http://localhost/demo.json" };
        const event = makeEvent({
            clientX: 10,
            clientY: 15,
            localX: 10,
            localY: 15,
            dataTransfer: { files: [file] },
        });

        canvas.processDrop(event);

        expect(graph.beforeChangeCalls).toBe(1);
        expect(graph.afterChangeCalls).toBe(1);
        expect(graph._nodes).toContain(droppedNode);
        expect(dropFileCalled).toBe(1);
        expect(graph.changedPayloads.some((payload) => payload.action === "fileDrop")).toBe(true);

        LiteGraph.node_types_by_file_extension = previousTypes;
        LiteGraph.createNode = previousCreateNode;
    });
});
