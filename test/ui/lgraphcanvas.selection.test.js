const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";
import { installDomEnvironment } from "../helpers/dom-env.js";

const LGraphCanvas = LiteGraph.LGraphCanvas;

function setGlobalValue(name, value) {
    Object.defineProperty(globalThis, name, {
        value,
        writable: true,
        configurable: true,
        enumerable: true,
    });
}

function createCanvasHarness() {
    const canvas = Object.create(LGraphCanvas.prototype);
    canvas.ds = {
        scale: 2,
        offset: [10, 20],
        visible_area: new Float32Array([0, 0, 200, 200]),
        changeScale(value, center) {
            this.lastScale = value;
            this.lastCenter = center;
        },
        convertOffsetToCanvas(pos) {
            return [(pos[0] + this.offset[0]) * this.scale, (pos[1] + this.offset[1]) * this.scale];
        },
        convertCanvasToOffset(pos) {
            return [pos[0] / this.scale - this.offset[0], pos[1] / this.scale - this.offset[1]];
        },
    };
    canvas.canvas = {
        width: 400,
        height: 300,
        getBoundingClientRect() {
            return { left: 5, top: 6, width: 400, height: 300 };
        },
    };
    canvas.visible_area = canvas.ds.visible_area;
    canvas.last_mouse_position = [0, 0];
    canvas.selected_nodes = {};
    canvas.highlighted_links = {};
    canvas.current_node = null;
    canvas.graph = {
        _nodes: [],
        links: {},
        beforeChange() {},
        afterChange() {},
        change() {},
        remove() {},
        onGraphChanged() {},
        add() {},
        getNodeById() {
            return null;
        },
    };
    canvas.setDirtyCalls = [];
    canvas.setDirty = (fg, bg) => {
        canvas.setDirtyCalls.push([fg, bg]);
    };
    return canvas;
}

describe("LGraphCanvas selection and helpers", () => {
    let restoreDom;
    let previousLocalStorage;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
        previousLocalStorage = globalThis.localStorage;
        const storage = new Map();
        setGlobalValue("localStorage", {
            getItem(key) {
                return storage.has(key) ? storage.get(key) : null;
            },
            setItem(key, value) {
                storage.set(key, String(value));
            },
            removeItem(key) {
                storage.delete(key);
            },
            clear() {
                storage.clear();
            },
        });
    });

    afterEach(() => {
        if (previousLocalStorage === undefined) {
            delete globalThis.localStorage;
        } else {
            setGlobalValue("localStorage", previousLocalStorage);
        }
        restoreDom?.();
    });

    test("selectNodes toggles selection, highlights links and notifies listeners", () => {
        const canvas = createCanvasHarness();
        let deselected = 0;
        let selected = 0;
        let selectionPayload = null;

        const oldNode = {
            id: 2,
            is_selected: true,
            onDeselected() {
                deselected += 1;
            },
        };
        const newNode = {
            id: 1,
            is_selected: false,
            inputs: [{ link: 11 }],
            outputs: [{ links: [12, 13] }],
            onSelected() {
                selected += 1;
            },
            onDeselected() {
                deselected += 1;
            },
        };

        canvas.graph._nodes = [oldNode, newNode];
        canvas.selected_nodes = { 2: oldNode };
        canvas.onSelectionChange = (nodes) => {
            selectionPayload = nodes;
        };

        canvas.selectNodes([newNode], false);

        expect(oldNode.is_selected).toBe(false);
        expect(newNode.is_selected).toBe(true);
        expect(canvas.selected_nodes[1]).toBe(newNode);
        expect(canvas.highlighted_links[11]).toBe(true);
        expect(canvas.highlighted_links[12]).toBe(true);
        expect(canvas.highlighted_links[13]).toBe(true);
        expect(deselected).toBe(1);
        expect(selected).toBe(1);
        expect(selectionPayload).toBe(canvas.selected_nodes);
    });

    test("deselectNode and deselectAllNodes clear state", () => {
        const canvas = createCanvasHarness();
        let deselectCalls = 0;
        const node = {
            id: 3,
            is_selected: true,
            inputs: [{ link: 21 }],
            outputs: [{ links: [22] }],
            onDeselected() {
                deselectCalls += 1;
            },
        };
        canvas.highlighted_links = { 21: true, 22: true };

        canvas.deselectNode(node);
        expect(node.is_selected).toBe(false);
        expect(canvas.highlighted_links[21]).toBeUndefined();
        expect(canvas.highlighted_links[22]).toBeUndefined();

        node.is_selected = true;
        canvas.graph._nodes = [node];
        canvas.selected_nodes = { 3: node };
        canvas.highlighted_links = { 21: true };
        canvas.deselectAllNodes();

        expect(deselectCalls).toBe(2);
        expect(canvas.selected_nodes).toEqual({});
        expect(canvas.highlighted_links).toEqual({});
        expect(canvas.current_node).toBeNull();
    });

    test("deleteSelectedNodes removes only deletable nodes and resets selection", () => {
        const canvas = createCanvasHarness();
        const removed = [];
        let beforeChanges = 0;
        let afterChanges = 0;
        let deselected = 0;

        canvas.graph.beforeChange = () => {
            beforeChanges += 1;
        };
        canvas.graph.afterChange = () => {
            afterChanges += 1;
        };
        canvas.graph.remove = (node) => {
            removed.push(node.id);
        };
        canvas.onNodeDeselected = () => {
            deselected += 1;
        };

        canvas.selected_nodes = {
            1: { id: 1, graph: canvas.graph, inputs: [], outputs: [] },
            2: { id: 2, block_delete: true, graph: canvas.graph, inputs: [], outputs: [] },
        };

        canvas.deleteSelectedNodes();
        expect(beforeChanges).toBe(1);
        expect(afterChanges).toBe(1);
        expect(removed).toEqual([1]);
        expect(deselected).toBe(1);
        expect(canvas.selected_nodes).toEqual({});
        expect(canvas.highlighted_links).toEqual({});
    });

    test("position helpers and zoom wrappers update coordinates", () => {
        const canvas = createCanvasHarness();
        const node = { pos: [100, 50], size: [60, 40] };

        canvas.centerOnNode(node);
        expect(canvas.ds.offset[0]).toBeCloseTo(-30);
        expect(canvas.ds.offset[1]).toBeCloseTo(5);

        const event = { clientX: 25, clientY: 46 };
        canvas.adjustMouseEvent(event);
        expect(event.canvasX).toBeCloseTo(40);
        expect(event.canvasY).toBeCloseTo(15);
        expect(canvas.last_mouse_position).toEqual([20, 40]);

        expect(canvas.convertOffsetToCanvas([0, 0])).toEqual([(canvas.ds.offset[0]) * canvas.ds.scale, (canvas.ds.offset[1]) * canvas.ds.scale]);
        expect(canvas.convertCanvasToOffset([200, 100])).toEqual([200 / canvas.ds.scale - canvas.ds.offset[0], 100 / canvas.ds.scale - canvas.ds.offset[1]]);
        expect(canvas.convertEventToCanvasOffset({ clientX: 45, clientY: 56 })).toEqual([40 / canvas.ds.scale - canvas.ds.offset[0], 50 / canvas.ds.scale - canvas.ds.offset[1]]);

        canvas.setZoom(1.5, [20, 30]);
        expect(canvas.ds.lastScale).toBe(1.5);
        expect(canvas.ds.lastCenter).toEqual([20, 30]);
        expect(canvas.dirty_canvas).toBe(true);
        expect(canvas.dirty_bgcanvas).toBe(true);
    });

    test("node order and visibility helpers work", () => {
        const canvas = createCanvasHarness();
        const nodeA = {
            id: "A",
            getBounding(out) {
                out.set([0, 0, 50, 50]);
                return out;
            },
        };
        const nodeB = {
            id: "B",
            getBounding(out) {
                out.set([500, 500, 20, 20]);
                return out;
            },
        };
        canvas.graph._nodes = [nodeA, nodeB];

        canvas.bringToFront(nodeA);
        expect(canvas.graph._nodes[1]).toBe(nodeA);

        canvas.sendToBack(nodeA);
        expect(canvas.graph._nodes[0]).toBe(nodeA);

        const visible = canvas.computeVisibleNodes(canvas.graph._nodes);
        expect(visible).toEqual([nodeA]);
    });

    test("hit tests for node box and slots", () => {
        const canvas = createCanvasHarness();
        const node = {
            pos: [100, 100],
            horizontal: false,
            inputs: [{}, {}],
            outputs: [{}, {}],
            getConnectionPos(isInput, slot) {
                if (isInput) {
                    return [120, 120 + slot * 20];
                }
                return [200, 120 + slot * 20];
            },
        };

        expect(canvas.isOverNodeBox(node, 104, 74)).toBe(true);
        expect(canvas.isOverNodeBox(node, 200, 200)).toBe(false);
        expect(canvas.isOverNodeInput(node, 122, 121)).toBe(0);
        expect(canvas.isOverNodeInput(node, 1, 1)).toBe(-1);
        expect(canvas.isOverNodeOutput(node, 202, 121)).toBe(0);
        expect(canvas.isOverNodeOutput(node, 1, 1)).toBe(-1);
    });

    test("processKey routes keyboard actions", () => {
        const htmlCanvas = document.createElement("canvas");
        htmlCanvas.localName = "canvas";
        htmlCanvas.width = 300;
        htmlCanvas.height = 200;
        htmlCanvas.getContext = () => ({});
        const canvas = new LGraphCanvas(htmlCanvas, null, { skip_render: true, skip_events: true });
        const calls = {
            selectAll: 0,
            copy: 0,
            paste: 0,
            delete: 0,
            preventDefault: 0,
            stopPropagation: 0,
            keyDown: 0,
            keyUp: 0,
            historyBack: 0,
            historyForward: 0,
            changed: 0,
        };
        const previousHistory = LiteGraph.actionHistory_enabled;
        LiteGraph.actionHistory_enabled = true;

        canvas.node_panel = { close() {} };
        canvas.options_panel = { close() {} };
        canvas.graph = {
            change() {
                calls.changed += 1;
            },
            actionHistoryBack() {
                calls.historyBack += 1;
            },
            actionHistoryForward() {
                calls.historyForward += 1;
            },
        };
        canvas.selectNodes = () => {
            calls.selectAll += 1;
        };
        canvas.copyToClipboard = () => {
            calls.copy += 1;
        };
        canvas.pasteFromClipboard = () => {
            calls.paste += 1;
        };
        canvas.deleteSelectedNodes = () => {
            calls.delete += 1;
        };
        canvas.selected_nodes = {
            1: {
                onKeyDown() {
                    calls.keyDown += 1;
                },
                onKeyUp() {
                    calls.keyUp += 1;
                },
            },
        };

        function makeEvent(type, keyCode, extra = {}) {
            return {
                type,
                keyCode,
                target: { localName: "div" },
                preventDefault() {
                    calls.preventDefault += 1;
                },
                stopImmediatePropagation() {
                    calls.stopPropagation += 1;
                },
                ...extra,
            };
        }

        try {
            expect(canvas.processKey(makeEvent("keydown", 32))).toBe(false);
            expect(canvas.dragging_canvas).toBe(true);

            canvas.processKey(makeEvent("keyup", 32));
            expect(canvas.dragging_canvas).toBe(false);

            canvas.processKey(makeEvent("keydown", 65, { ctrlKey: true }));
            canvas.processKey(makeEvent("keydown", 67, { ctrlKey: true, shiftKey: false }));
            canvas.processKey(makeEvent("keydown", 86, { ctrlKey: true }));
            canvas.processKey(makeEvent("keydown", 46));
            canvas.processKey(makeEvent("keydown", 90, { ctrlKey: true }));
            canvas.processKey(makeEvent("keydown", 89, { ctrlKey: true }));

            expect(calls.selectAll).toBe(1);
            expect(calls.copy).toBe(1);
            expect(calls.paste).toBe(1);
            expect(calls.delete).toBe(1);
            expect(calls.historyBack).toBe(1);
            expect(calls.historyForward).toBe(1);
            expect(calls.keyDown).toBeGreaterThan(0);
            expect(calls.keyUp).toBeGreaterThan(0);
            expect(calls.changed).toBeGreaterThan(0);
            expect(calls.preventDefault).toBeGreaterThan(0);
            expect(calls.stopPropagation).toBeGreaterThan(0);
        } finally {
            LiteGraph.actionHistory_enabled = previousHistory;
        }
    });

    test("copyToClipboard and pasteFromClipboard use graph and clipboard data", () => {
        const canvas = createCanvasHarness();
        const graphAdds = [];
        const graphChanges = [];
        let beforeChanges = 0;
        let afterChanges = 0;
        let selectedAfterPaste = null;

        const nodeA = {
            id: 10,
            clonable: true,
            type: "test/node",
            clone() {
                return {
                    serialize() {
                        return { type: "test/node", pos: [10, 20] };
                    },
                };
            },
            inputs: [],
            outputs: [],
        };
        const nodeB = {
            id: 11,
            clonable: true,
            type: "test/node",
            clone() {
                return {
                    serialize() {
                        return { type: "test/node", pos: [20, 40] };
                    },
                };
            },
            inputs: [{ link: 100 }],
            outputs: [],
        };

        canvas.selected_nodes = { 10: nodeA, 11: nodeB };
        canvas.graph.links = {
            100: { origin_id: 10, origin_slot: 0, target_slot: 0 },
        };
        canvas.graph.getNodeById = (id) => (id === 10 ? nodeA : null);

        canvas.copyToClipboard();
        const copied = JSON.parse(localStorage.getItem("litegrapheditor_clipboard"));
        expect(copied.nodes.length).toBe(2);
        expect(copied.links.length).toBe(1);

        const previousCreateNode = LiteGraph.createNode;
        const createdNodes = [];
        LiteGraph.createNode = (type) => {
            const created = {
                type,
                pos: [0, 0],
                configure(info) {
                    this.type = info.type;
                    this.pos = [...info.pos];
                },
                connect(slot, target, targetSlot) {
                    this.lastConnect = [slot, target, targetSlot];
                },
            };
            createdNodes.push(created);
            return created;
        };

        canvas.graph_mouse = [100, 200];
        canvas.graph.beforeChange = () => {
            beforeChanges += 1;
        };
        canvas.graph.afterChange = () => {
            afterChanges += 1;
        };
        canvas.graph.add = (node) => {
            graphAdds.push(node);
        };
        canvas.graph.onGraphChanged = (payload) => {
            graphChanges.push(payload.action);
        };
        canvas.selectNodes = (nodes) => {
            selectedAfterPaste = nodes;
        };

        try {
            canvas.pasteFromClipboard(false);
        } finally {
            LiteGraph.createNode = previousCreateNode;
        }

        expect(beforeChanges).toBe(1);
        expect(afterChanges).toBe(1);
        expect(graphAdds.length).toBe(2);
        expect(graphChanges).toContain("paste");
        expect(selectedAfterPaste.length).toBe(2);
        expect(createdNodes[0].pos[0]).toBe(100);
        expect(createdNodes[0].pos[1]).toBe(200);
    });
});
