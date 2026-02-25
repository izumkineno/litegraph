const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";
import { LGraphNode } from "../../src/lgraphnode.js";
import { LGraph } from "../../src/lgraph.js";
import { resetLiteGraphRegistry } from "../helpers/graph-factory.js";

class SlotNode extends LGraphNode {
    constructor() {
        super("Slots");
        this.addInputs([
            ["in_number", "number"],
            ["in_event", LiteGraph.EVENT],
            ["in_generic", "*"],
        ]);
        this.addOutputs([
            ["out_number", "number"],
            ["out_generic", "0"],
        ]);
    }
}

describe("LGraphNode slot helpers", () => {
    beforeEach(() => {
        resetLiteGraphRegistry();
    });

    test("find slots by name and type", () => {
        const node = new SlotNode();

        expect(node.findInputSlot("in_number")).toBe(0);
        expect(node.findOutputSlot("out_generic")).toBe(1);
        expect(node.findInputSlot("missing")).toBe(-1);
        expect(node.findInputSlotByType("number")).toBe(0);
        expect(node.findInputSlotByType("*")).toBe(2);
        expect(node.findOutputSlotByType("number")).toBe(0);
    });

    test("find free slots and honor blocked types", () => {
        const graph = new LGraph();
        const source = new SlotNode();
        const target = new SlotNode();
        graph.add(source);
        graph.add(target);

        source.connect(0, target, 0);

        expect(target.findInputSlotFree()).toBe(1);
        expect(target.findInputSlotFree({ typesNotAccepted: [LiteGraph.EVENT] })).toBe(2);
        expect(source.findOutputSlotFree()).toBe(1);
        expect(source.findOutputSlotFree({ typesNotAccepted: ["0"] })).toBe(-1);
    });

    test("removeInput and removeOutput update link slot indexes", () => {
        const graph = new LGraph();
        const source = new SlotNode();
        const target = new SlotNode();
        const target2 = new SlotNode();
        graph.add(source);
        graph.add(target);
        graph.add(target2);

        const link = source.connect(1, target, 2);
        expect(link).toBeTruthy();
        expect(graph.links[link.id].target_slot).toBe(2);

        target.removeInput(0);
        expect(graph.links[link.id].target_slot).toBe(1);

        const backLink = source.connect(1, target2, 2);
        expect(backLink).toBeTruthy();
        expect(graph.links[backLink.id].origin_slot).toBe(1);

        source.removeOutput(0);
        expect(graph.links[backLink.id].origin_slot).toBe(0);
    });
});
