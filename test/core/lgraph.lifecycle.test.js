const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";
import { LGraph } from "../../src/lgraph.js";
import { LGraphNode } from "../../src/lgraphnode.js";
import { resetLiteGraphRegistry } from "../helpers/graph-factory.js";

class ExecutableNode extends LGraphNode {
    constructor() {
        super("Executable");
        this.mode = LiteGraph.ALWAYS;
        this.executions = 0;
    }

    onExecute() {
        this.executions += 1;
    }
}

describe("LGraph lifecycle", () => {
    beforeEach(() => {
        resetLiteGraphRegistry();
    });

    test("add/remove keeps node lookup in sync", () => {
        const graph = new LGraph();
        const node = new ExecutableNode();
        graph.add(node);

        expect(graph.getNodeById(node.id)).toBe(node);
        expect(graph._nodes.length).toBe(1);

        graph.remove(node);
        expect(graph.getNodeById(node.id)).toBeUndefined();
        expect(graph._nodes.length).toBe(0);
    });

    test("runStep executes ALWAYS nodes and updates timing state", () => {
        const graph = new LGraph();
        const node = new ExecutableNode();
        graph.add(node);

        graph.starttime = LiteGraph.getTime();
        graph.last_update_time = graph.starttime;
        graph.runStep(3, true);

        expect(node.executions).toBe(3);
        expect(graph.iteration).toBe(1);
        expect(graph.fixedtime).toBeCloseTo(graph.fixedtime_lapse * 3);
    });

    test("onGraphChanged is suppressed during configure except graphConfigure action", () => {
        const graph = new LGraph();
        const baseVersion = graph._version;

        graph._configuring = true;
        graph.onGraphChanged({ action: "nodeAdd" });
        expect(graph._version).toBe(baseVersion);

        graph.onGraphChanged({ action: "graphConfigure" });
        expect(graph._version).toBe(baseVersion + 1);
    });

    test("global inputs and outputs can be managed", () => {
        const graph = new LGraph();

        graph.addInput("in", "number", 1);
        expect(graph.getInputData("in")).toBe(1);

        graph.setInputData("in", 42);
        expect(graph.getInputData("in")).toBe(42);

        graph.renameInput("in", "renamed");
        expect(graph.getInputData("renamed")).toBe(42);
        expect(graph.getInputData("in")).toBeNull();

        graph.addOutput("out", "number", 0);
        graph.setOutputData("out", 7);
        expect(graph.getOutputData("out")).toBe(7);

        graph.renameOutput("out", "renamedOut");
        expect(graph.getOutputData("renamedOut")).toBe(7);
        expect(graph.getOutputData("out")).toBeNull();
    });
});
