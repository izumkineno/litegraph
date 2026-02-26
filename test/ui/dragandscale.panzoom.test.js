const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach, afterEach } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";
import { installDomEnvironment } from "../helpers/dom-env.js";

function createCanvas(width = 400, height = 300) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    canvas.getBoundingClientRect = () => ({
        left: 0,
        top: 0,
        width,
        height,
        right: width,
        bottom: height,
    });
    return canvas;
}

describe("DragAndScale pan/zoom", () => {
    let restoreDom;

    beforeEach(() => {
        restoreDom = installDomEnvironment();
    });

    afterEach(() => {
        restoreDom?.();
    });

    test("binds pointer and wheel events when created with element", () => {
        const canvas = createCanvas();
        new LiteGraph.DragAndScale(canvas, false);

        expect(canvas._listeners.get("pointerdown")?.size).toBe(1);
        expect(canvas._listeners.get("wheel")?.size).toBe(1);
    });

    test("starts drag on pointerdown and updates offset on pointermove", () => {
        const canvas = createCanvas();
        const ds = new LiteGraph.DragAndScale(canvas, true);

        ds.onMouseDown({ clientX: 10, clientY: 20 });
        expect(ds.dragging).toBe(true);
        expect(document._listeners.get("pointermove")?.size).toBe(1);
        expect(document._listeners.get("pointerup")?.size).toBe(1);

        ds.onMouseMove({ clientX: 30, clientY: 50 });
        expect(Array.from(ds.offset)).toEqual([20, 30]);

        ds.onMouseUp({});
        expect(ds.dragging).toBe(false);
        expect(document._listeners.get("pointermove")?.size).toBe(0);
        expect(document._listeners.get("pointerup")?.size).toBe(0);
    });

    test("changeScale clamps values and keeps redraw callback semantics", () => {
        const canvas = createCanvas();
        const ds = new LiteGraph.DragAndScale(canvas, true);
        let redrawCalls = 0;
        ds.onredraw = () => {
            redrawCalls += 1;
        };

        ds.changeScale(20, [200, 150]); // clamp to max
        expect(ds.scale).toBe(10);

        ds.changeScale(0.001, [200, 150]); // clamp to min
        expect(ds.scale).toBe(0.1);
        expect(redrawCalls).toBe(2);
    });

    test("computeVisibleArea and coordinate conversion are consistent", () => {
        const canvas = createCanvas(200, 100);
        const ds = new LiteGraph.DragAndScale(canvas, true);
        ds.scale = 2;
        ds.offset[0] = 10;
        ds.offset[1] = 20;

        ds.computeVisibleArea();
        expect(Array.from(ds.visible_area)).toEqual([-10, -20, 100, 50]);

        ds.computeVisibleArea([20, 10, 40, 20]);
        expect(Array.from(ds.visible_area)).toEqual([0, -15, 20, 10]);

        const canvasPos = ds.convertOffsetToCanvas([5, 6]);
        expect(canvasPos).toEqual([30, 52]);

        const offsetPos = ds.convertCanvasToOffset(canvasPos);
        expect(offsetPos[0]).toBeCloseTo(5);
        expect(offsetPos[1]).toBeCloseTo(6);
    });

    test("wheel computes delta and forwards it to changeDeltaScale", () => {
        const canvas = createCanvas();
        const ds = new LiteGraph.DragAndScale(canvas, true);
        let received = null;
        ds.changeDeltaScale = (value) => {
            received = value;
        };

        ds.onWheel({
            deltaY: 30,
            preventDefault() {},
        });

        expect(received).toBeCloseTo(0.5);
    });
});
