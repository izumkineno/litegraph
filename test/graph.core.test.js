const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach } = testRuntime;
import { LiteGraph } from "../src/litegraph.js";
import { LGraph } from "../src/lgraph.js";
import { LGraphNode } from "../src/lgraphnode.js";

class TestSourceNode extends LGraphNode {
    constructor() {
        super();
        this.addOutput("out", "number");
    }
}

class TestTargetNode extends LGraphNode {
    constructor() {
        super();
        this.addInput("in", "number");
    }
}

describe("graph core regressions", () => {
    beforeEach(() => {
        LiteGraph.registered_node_types = {};
        LiteGraph.registerNodeType("test/source", TestSourceNode);
        LiteGraph.registerNodeType("test/target", TestTargetNode);
    });

    test("connect returns null and rolls back when target slot is invalid", () => {
        const graph = new LGraph();
        const source = LiteGraph.createNode("test/source");
        const target = LiteGraph.createNode("test/target");
        graph.add(source);
        graph.add(target);

        const result = source.connect(0, target, 99);
        expect(result).toBeNull();
        expect(Object.keys(graph.links).length).toBe(0);
        expect(source.outputs[0].links ?? []).toEqual([]);
    });
});
