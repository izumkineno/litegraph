const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";
import { LGraphNode } from "../../src/lgraphnode.js";
import { resetLiteGraphRegistry, createGraphWithFactoryNodes } from "../helpers/graph-factory.js";

class MultiInputNode extends LGraphNode {
    constructor() {
        super("Multi");
        this.addInput("a", "number");
        this.addInput("b", "number");
    }
}

describe("LGraphNode connect/disconnect", () => {
    beforeEach(() => {
        resetLiteGraphRegistry();
    });

    test("connect creates link and disconnectOutput removes it", () => {
        const { graph, source, target } = createGraphWithFactoryNodes("test/connect");

        const linkInfo = source.connect(0, target, 0);
        expect(linkInfo).toBeTruthy();
        expect(Object.keys(graph.links).length).toBe(1);
        expect(target.inputs[0].link).toBe(linkInfo.id);

        const ok = source.disconnectOutput(0, target);
        expect(ok).toBe(true);
        expect(Object.keys(graph.links).length).toBe(0);
        expect(target.inputs[0].link).toBeNull();
    });

    test("connect accepts slot names and connectByType uses matching slot", () => {
        LiteGraph.registerNodeType("test/multi_input", MultiInputNode);
        const { graph, source } = createGraphWithFactoryNodes("test/connect-by-type");
        const target = LiteGraph.createNode("test/multi_input");
        graph.add(target);

        const first = source.connect("out", target, "a");
        expect(first).toBeTruthy();
        expect(target.inputs[0].link).toBe(first.id);

        source.disconnectOutput("out", target);
        const second = source.connectByType(0, target, "number");
        expect(second).toBeTruthy();
        expect(target.inputs.some((slot) => slot.link === second.id)).toBe(true);
    });

    test("disconnectInput removes link from both sides", () => {
        const { graph, source, target } = createGraphWithFactoryNodes("test/disconnect-input");
        const linkInfo = source.connect(0, target, 0);
        expect(linkInfo).toBeTruthy();
        expect(source.outputs[0].links.length).toBe(1);

        const ok = target.disconnectInput(0);
        expect(ok).toBe(true);
        expect(target.inputs[0].link).toBeNull();
        expect(source.outputs[0].links.length).toBe(0);
        expect(Object.keys(graph.links).length).toBe(0);
    });
});
