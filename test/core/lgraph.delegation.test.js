const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";
import { LGraph } from "../../src/lgraph.js";
import { LGraphNode } from "../../src/lgraphnode.js";
import { resetLiteGraphRegistry } from "../helpers/graph-factory.js";

describe("LGraph delegates", () => {
    beforeEach(() => {
        resetLiteGraphRegistry();
    });

    test("LiteGraph constructor installs LGraph delegates", () => {
        expect(LiteGraph.LGraph).toBe(LGraph);

        const methods = [
            "runStep",
            "serialize",
            "configure",
            "add",
            "remove",
            "computeExecutionOrder",
            "onGraphChanged",
            "actionHistoryBack",
        ];

        methods.forEach((methodName) => {
            expect(typeof LGraph.prototype[methodName]).toBe("function");
        });

        const graph = new LGraph();
        expect(typeof graph.runStep).toBe("function");
        expect(typeof graph.serialize).toBe("function");
    });

    test("actionHistoryBack/Forward replays serialized graph snapshots", () => {
        const previousHistoryFlag = LiteGraph.actionHistory_enabled;
        LiteGraph.actionHistory_enabled = true;

        try {
            class HistoryNode extends LGraphNode {
                constructor() {
                    super("History");
                }
            }
            LiteGraph.registerNodeType("test/history_node", HistoryNode);

            const graph = new LGraph();
            const first = LiteGraph.createNode("test/history_node");
            const second = LiteGraph.createNode("test/history_node");

            graph.add(first);
            graph.add(second);
            graph.addInput("history_marker", "number", 1);

            expect(graph._nodes.length).toBe(2);
            expect(graph.history.actionHistoryVersions.length).toBeGreaterThanOrEqual(3);

            const movedBack = graph.actionHistoryBack();
            expect(movedBack).toBe(true);
            expect(graph._nodes.length).toBe(1);

            const movedForward = graph.actionHistoryForward();
            expect(movedForward).toBe(true);
            expect(graph._nodes.length).toBe(2);
        } finally {
            LiteGraph.actionHistory_enabled = previousHistoryFlag;
        }
    });
});
