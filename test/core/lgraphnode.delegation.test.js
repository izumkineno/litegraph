const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";
import { LGraphNode } from "../../src/lgraphnode.js";
import { resetLiteGraphRegistry } from "../helpers/graph-factory.js";

class DelegatedNode extends LGraphNode {
    constructor() {
        super("Delegated");
    }
}

describe("LGraphNode delegates", () => {
    beforeEach(() => {
        resetLiteGraphRegistry();
    });

    test("keeps representative methods on LGraphNode prototype", () => {
        const methods = [
            "configure",
            "serialize",
            "setProperty",
            "setOutputData",
            "doExecute",
            "addInput",
            "findInputSlot",
            "connect",
            "getConnectionPos",
            "refreshAncestors",
            "setDirtyCanvas",
            "alignToGrid",
        ];

        methods.forEach((methodName) => {
            expect(typeof LGraphNode.prototype[methodName]).toBe("function");
        });
    });

    test("registerNodeType still copies delegated prototype methods", () => {
        LiteGraph.registerNodeType("test/delegated", DelegatedNode);

        expect(DelegatedNode.prototype.configure).toBe(LGraphNode.prototype.configure);
        expect(DelegatedNode.prototype.connect).toBe(LGraphNode.prototype.connect);
        expect(DelegatedNode.prototype.getConnectionPos).toBe(LGraphNode.prototype.getConnectionPos);

        const instance = LiteGraph.createNode("test/delegated");
        expect(instance).toBeTruthy();
        expect(typeof instance.serialize).toBe("function");
        expect(typeof instance.connect).toBe("function");
    });
});
