const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";
import { installDomEnvironment } from "../helpers/dom-env.js";

const LGraphCanvas = LiteGraph.LGraphCanvas;

describe("LGraphCanvas core helpers", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("getFileExtension normalizes extensions", () => {
        expect(LGraphCanvas.getFileExtension("https://demo.local/file.PNG?x=1")).toBe("png");
        expect(LGraphCanvas.getFileExtension("https://demo.local/path/noext")).toBe("");
    });

    test("setDirty and blockClick update state flags", () => {
        const canvas = Object.create(LGraphCanvas.prototype);
        canvas.dirty_canvas = false;
        canvas.dirty_bgcanvas = false;
        canvas.block_click = false;
        canvas.last_mouseclick = 100;

        canvas.setDirty(true, false);
        expect(canvas.dirty_canvas).toBe(true);
        expect(canvas.dirty_bgcanvas).toBe(false);

        canvas.setDirty(false, true);
        expect(canvas.dirty_bgcanvas).toBe(true);

        canvas.blockClick();
        expect(canvas.block_click).toBe(true);
        expect(canvas.last_mouseclick).toBe(0);
    });

    test("setGraph, openSubgraph and closeSubgraph maintain graph stack state", () => {
        const canvas = Object.create(LGraphCanvas.prototype);
        let clears = 0;
        let panelChecks = 0;
        let dirtyCalls = 0;
        let centered = null;
        let selected = null;

        const rootGraph = {
            attachCanvas(target) {
                target.graph = this;
            },
            detachCanvas() {},
        };
        const subgraph = {
            _subgraph_node: { id: "sub-node" },
            attachCanvas(target) {
                target.graph = this;
            },
        };

        canvas.graph = rootGraph;
        canvas.ds = { offset: [10, 10], scale: 2 };
        canvas.clear = () => {
            clears += 1;
        };
        canvas.checkPanels = () => {
            panelChecks += 1;
        };
        canvas.setDirty = () => {
            dirtyCalls += 1;
        };
        canvas.centerOnNode = (node) => {
            centered = node;
        };
        canvas.selectNodes = (nodes) => {
            selected = nodes;
        };

        canvas.openSubgraph(subgraph);
        expect(clears).toBe(1);
        expect(panelChecks).toBe(1);
        expect(dirtyCalls).toBe(1);
        expect(canvas._graph_stack.length).toBe(1);
        expect(canvas.graph).toBe(subgraph);

        canvas.closeSubgraph();
        expect(canvas.graph).toBe(rootGraph);
        expect(Array.isArray(canvas.selected_nodes)).toBe(false);
        expect(centered).toEqual({ id: "sub-node" });
        expect(selected).toEqual([{ id: "sub-node" }]);
        expect(canvas.ds.offset).toEqual([0, 0]);
        expect(canvas.ds.scale).toBe(1);
    });

    test("setGraph detaches and reattaches according to input graph", () => {
        const canvas = Object.create(LGraphCanvas.prototype);
        let cleared = 0;
        let dirty = 0;
        let detached = 0;
        let attached = 0;

        const oldGraph = {
            detachCanvas() {
                detached += 1;
            },
        };
        const newGraph = {
            attachCanvas(target) {
                attached += 1;
                target.graph = this;
            },
        };

        canvas.graph = oldGraph;
        canvas.clear = () => {
            cleared += 1;
        };
        canvas.setDirty = () => {
            dirty += 1;
        };

        canvas.setGraph(null, false);
        expect(detached).toBe(1);
        expect(cleared).toBe(1);

        canvas.setGraph(newGraph, true);
        expect(attached).toBe(1);
        expect(dirty).toBe(1);
    });

    test("getCanvasWindow returns owner document window or global fallback", () => {
        const refWindow = { name: "canvas-window" };
        const canvas = Object.create(LGraphCanvas.prototype);
        canvas.canvas = { ownerDocument: { defaultView: refWindow } };
        expect(canvas.getCanvasWindow()).toBe(refWindow);

        canvas.canvas = null;
        expect(canvas.getCanvasWindow()).toBe(window);
    });

    test("setCanvas handles detach and successful canvas binding path", () => {
        const canvas = Object.create(LGraphCanvas.prototype);
        canvas.ds = {};
        canvas.unbindEventsCalled = 0;
        canvas.unbindEvents = () => {
            canvas.unbindEventsCalled += 1;
        };

        canvas.canvas = { existing: true };
        canvas.setCanvas(null, false);
        expect(canvas.unbindEventsCalled).toBe(1);

        const htmlCanvas = document.createElement("canvas");
        htmlCanvas.localName = "canvas";
        htmlCanvas.width = 320;
        htmlCanvas.height = 180;
        htmlCanvas.getContext = () => ({});

        canvas.setCanvas(htmlCanvas, true);
        expect(canvas.canvas).toBe(htmlCanvas);
        expect(canvas.ds.element).toBe(htmlCanvas);
        expect(String(htmlCanvas.className)).toContain("lgraphcanvas");
        expect(canvas.bgcanvas.width).toBe(320);
        expect(canvas.bgcanvas.height).toBe(180);
    });

    test("setCanvas throws when a non-canvas element is supplied", () => {
        const canvas = Object.create(LGraphCanvas.prototype);
        canvas.ds = {};

        const badElement = document.createElement("div");
        badElement.localName = "div";
        badElement.getContext = null;

        expect(() => canvas.setCanvas(badElement, true)).toThrow("must be a <canvas> element");
    });

    test("startRendering drives draw loop and stopRendering halts it", () => {
        const canvas = Object.create(LGraphCanvas.prototype);
        let draws = 0;

        canvas.pause_rendering = false;
        canvas.getCanvasWindow = () => ({
            requestAnimationFrame(callback) {
                callback();
                return 1;
            },
        });
        canvas.draw = () => {
            draws += 1;
            if (draws >= 2) {
                canvas.stopRendering();
            }
        };

        canvas.startRendering();
        expect(draws).toBe(2);
        expect(canvas.is_rendering).toBe(false);
    });

    test("enableWebGL validates required globals before enabling", () => {
        const previousGL = globalThis.GL;
        const previousEnable = globalThis.enableWebGLCanvas;
        const canvas = Object.create(LGraphCanvas.prototype);
        canvas.canvas = {};

        try {
            delete globalThis.GL;
            delete globalThis.enableWebGLCanvas;
            expect(() => canvas.enableWebGL()).toThrow("litegl.js must be included");

            globalThis.GL = {};
            expect(() => canvas.enableWebGL()).toThrow("webglCanvas.js must be included");

            globalThis.enableWebGLCanvas = () => ({ webgl: false });
            canvas.enableWebGL();
            expect(canvas.canvas.webgl_enabled).toBe(true);
            expect(canvas.ctx.webgl).toBe(true);
            expect(canvas.bgcanvas).toBe(canvas.canvas);
        } finally {
            if (previousGL === undefined) delete globalThis.GL;
            else globalThis.GL = previousGL;

            if (previousEnable === undefined) delete globalThis.enableWebGLCanvas;
            else globalThis.enableWebGLCanvas = previousEnable;
        }
    });
});
