const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";
import { LGraph } from "../../src/lgraph.js";
import { LGraphNode } from "../../src/lgraphnode.js";
import { resetLiteGraphRegistry } from "../helpers/graph-factory.js";

class ProducerNode extends LGraphNode {
    constructor() {
        super("Producer");
        this.addOutput("out", "number");
    }
}

class ProcessorNode extends LGraphNode {
    constructor() {
        super("Processor");
        this.addInput("in", "number");
        this.addOutput("out", "number");
    }
}

class ConsumerNode extends LGraphNode {
    constructor() {
        super("Consumer");
        this.addInput("in", "number");
    }
}

describe("LGraph execution order", () => {
    beforeEach(() => {
        resetLiteGraphRegistry();
        LiteGraph.registerNodeType("test/producer", ProducerNode);
        LiteGraph.registerNodeType("test/processor", ProcessorNode);
        LiteGraph.registerNodeType("test/consumer", ConsumerNode);
    });

    test("orders DAG nodes from sources to sinks", () => {
        const graph = new LGraph();
        const producer = LiteGraph.createNode("test/producer");
        const processor = LiteGraph.createNode("test/processor");
        const consumer = LiteGraph.createNode("test/consumer");
        graph.add(producer);
        graph.add(processor);
        graph.add(consumer);

        producer.connect(0, processor, 0);
        processor.connect(0, consumer, 0);

        const order = graph.computeExecutionOrder(false, true);
        const names = order.map((node) => node.title);

        expect(names.indexOf("Producer")).toBeLessThan(names.indexOf("Processor"));
        expect(names.indexOf("Processor")).toBeLessThan(names.indexOf("Consumer"));
        expect(producer._level).toBe(1);
        expect(processor._level).toBe(2);
        expect(consumer._level).toBe(3);
    });

    test("returns all nodes even when there is a cycle", () => {
        const graph = new LGraph();
        const a = LiteGraph.createNode("test/processor");
        const b = LiteGraph.createNode("test/processor");
        graph.add(a);
        graph.add(b);

        a.connect(0, b, 0);
        b.connect(0, a, 0);

        const order = graph.computeExecutionOrder(false, true);
        const ids = order.map((node) => node.id);

        expect(order.length).toBe(2);
        expect(ids).toContain(a.id);
        expect(ids).toContain(b.id);
    });
});
