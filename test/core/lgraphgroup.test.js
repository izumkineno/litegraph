const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";

describe("LGraphGroup", () => {
    test("initializes with defaults and guards position/size setters", () => {
        const group = new LiteGraph.LGraphGroup("Demo");
        expect(group.title).toBe("Demo");
        expect(group.font_size).toBe(24);

        group.pos = [100, 200];
        expect(Array.from(group.pos)).toEqual([100, 200]);

        group.pos = [50];
        expect(Array.from(group.pos)).toEqual([100, 200]);

        group.size = [20, 10];
        expect(Array.from(group.size)).toEqual([140, 80]);
    });

    test("configure and serialize maintain shape data", () => {
        const group = new LiteGraph.LGraphGroup("A");
        group.configure({
            title: "B",
            bounding: [1.4, 2.6, 150.3, 88.9],
            color: "#123456",
            font_size: 18,
        });

        const serialized = group.serialize();
        expect(serialized.title).toBe("B");
        expect(Array.from(serialized.bounding)).toEqual([1, 3, 150, 89]);
        expect(serialized.color).toBe("#123456");
        expect(serialized.font_size).toBe(18);
    });

    test("move updates group and inner node positions", () => {
        const group = new LiteGraph.LGraphGroup();
        const nodeA = { pos: [10, 10] };
        const nodeB = { pos: [0, 5] };
        group._nodes = [nodeA, nodeB];

        group.move(5, -2, false);
        expect(Array.from(group.pos)).toEqual([15, 8]);
        expect(nodeA.pos).toEqual([15, 8]);
        expect(nodeB.pos).toEqual([5, 3]);

        group.move(10, 10, true);
        expect(Array.from(group.pos)).toEqual([25, 18]);
        expect(nodeA.pos).toEqual([15, 8]);
        expect(nodeB.pos).toEqual([5, 3]);
    });

    test("recomputeInsideNodes selects overlapping nodes only", () => {
        const group = new LiteGraph.LGraphGroup();
        group.configure({
            title: "inside",
            bounding: [0, 0, 100, 100],
            color: "#fff",
            font_size: 20,
        });

        const insideNode = {
            id: 1,
            getBounding(out) {
                out.set([10, 10, 20, 20]);
            },
        };
        const outsideNode = {
            id: 2,
            getBounding(out) {
                out.set([200, 200, 30, 30]);
            },
        };
        group.graph = { _nodes: [insideNode, outsideNode] };

        group.recomputeInsideNodes();
        expect(group._nodes.length).toBe(1);
        expect(group._nodes[0].id).toBe(1);
    });
});
