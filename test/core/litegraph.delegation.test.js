const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;
import { LiteGraph } from "../../src/litegraph.js";
import { LGraph } from "../../src/lgraph.js";
import { LGraphNode } from "../../src/lgraphnode.js";

describe("LiteGraph delegates", () => {
    test("keeps LiteGraph singleton API after delegate installation", () => {
        const methods = [
            "registerNodeType",
            "unregisterNodeType",
            "createNode",
            "isValidConnection",
            "fetchFile",
            "pointerAddListener",
            "pointerRemoveListener",
            "closeAllContextMenus",
            "cloneObject",
            "uuidv4",
        ];

        methods.forEach((methodName) => {
            expect(typeof LiteGraph[methodName]).toBe("function");
        });

        expect(LiteGraph.LGraph).toBe(LGraph);
        expect(LiteGraph.LGraphNode).toBe(LGraphNode);
    });

    test("pointer event mode setter/getter behavior remains compatible", () => {
        LiteGraph.pointerevents_method = "mouse";
        expect(LiteGraph.pointerevents_method).toBe("mouse");

        LiteGraph.pointerevents_method = "pointer";
        expect(LiteGraph.pointerevents_method).toBe("pointer");

        LiteGraph.pointerevents_method = "invalid";
        expect(LiteGraph.pointerevents_method).toBe("pointer");
    });
});
