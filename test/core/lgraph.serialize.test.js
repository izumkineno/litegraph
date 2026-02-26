const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";
import { LGraph } from "../../src/lgraph.js";
import { LGraphNode } from "../../src/lgraphnode.js";
import { resetLiteGraphRegistry } from "../helpers/graph-factory.js";

class SourceNode extends LGraphNode {
    constructor() {
        super("Source");
        this.addOutput("out", "number");
    }
}

class TargetNode extends LGraphNode {
    constructor() {
        super("Target");
        this.addInput("in", "number");
        this.properties = { factor: 2 };
    }
}

describe("LGraph serialize/configure", () => {
    beforeEach(() => {
        resetLiteGraphRegistry();
        LiteGraph.registerNodeType("test/source", SourceNode);
        LiteGraph.registerNodeType("test/target", TargetNode);
    });

    test("round-trips nodes and links", () => {
        const graph = new LGraph();
        const source = LiteGraph.createNode("test/source");
        const target = LiteGraph.createNode("test/target");
        graph.add(source);
        graph.add(target);
        source.connect(0, target, 0);

        const data = graph.serialize();
        const restored = new LGraph();
        const hadErrors = restored.configure(data);

        expect(hadErrors).toBe(false);
        expect(restored._nodes.length).toBe(2);
        expect(Object.keys(restored.links).length).toBe(1);
        expect(restored.getNodeById(target.id).properties.factor).toBe(2);
    });

    test("configure keeps unknown node info with fallback node", () => {
        const graph = new LGraph();
        const hadErrors = graph.configure({
            nodes: [
                {
                    id: 100,
                    type: "missing/type",
                    title: "Unknown",
                    pos: [10, 20],
                    size: [180, 60],
                    properties: { x: 1 },
                },
            ],
            links: [],
            groups: [],
            version: 1,
        });

        expect(hadErrors).toBe(true);
        expect(graph._nodes.length).toBe(1);
        expect(graph._nodes[0].has_errors).toBe(true);
        expect(graph._nodes[0].last_serialization.type).toBe("missing/type");
    });
});
