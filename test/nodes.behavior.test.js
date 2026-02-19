const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect, beforeEach } = testRuntime;
import { LiteGraph } from "../src/litegraph.js";

function toFreshModuleUrl(modulePath) {
    const url = new URL(modulePath, import.meta.url);
    url.searchParams.set("t", `${Date.now()}_${Math.random()}`);
    return url.href;
}

describe("nodes behavior regressions", () => {
    beforeEach(() => {
        LiteGraph.registered_node_types = {};
    });

    test("logic/IF routes to true and false branches using normalized booleans", async () => {
        await import(toFreshModuleUrl("../src/nodes/logic.js"));
        const Branch = LiteGraph.registered_node_types["logic/IF"];
        expect(Branch).toBeTruthy();

        const node = new Branch();
        const called = [];
        node.triggerSlot = (slot) => called.push(slot);

        node.getInputData = () => 1;
        node.onExecute();
        node.getInputData = () => 0;
        node.onExecute();

        expect(called).toEqual([0, 1]);
    });

    test("events/sequence can be constructed and triggers every output", async () => {
        await import(toFreshModuleUrl("../src/nodes/events.js"));
        const Sequence = LiteGraph.registered_node_types["events/sequence"];
        expect(Sequence).toBeTruthy();

        const node = new Sequence();
        expect(node.inputs.length).toBeGreaterThanOrEqual(3);
        expect(node.outputs.length).toBeGreaterThanOrEqual(3);

        const calls = [];
        node.triggerSlot = (slot, param, _linkId, options) => {
            calls.push({ slot, param, actionCall: options?.action_call });
        };
        node.onAction("go", 42, { action_call: "root" });

        expect(calls.length).toBe(node.outputs.length);
        expect(calls[0].slot).toBe(0);
        expect(calls[0].param).toBe(42);
        expect(calls[0].actionCall).toContain("_seq_0");
    });
});
