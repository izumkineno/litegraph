const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;
import { LLink } from "../../src/llink.js";

describe("LLink", () => {
    test("constructs with expected defaults and serializes", () => {
        const link = new LLink(9, "number", 1, 0, 2, 1);

        expect(link.id).toBe(9);
        expect(link.type).toBe("number");
        expect(link.origin_id).toBe(1);
        expect(link.origin_slot).toBe(0);
        expect(link.target_id).toBe(2);
        expect(link.target_slot).toBe(1);
        expect(link._data).toBeNull();
        expect(Array.from(link._pos)).toEqual([0, 0]);
        expect(link.serialize()).toEqual([9, 1, 0, 2, 1, "number"]);
    });

    test("configure supports array format", () => {
        const link = new LLink(0, "old", 0, 0, 0, 0);
        link.configure([7, 10, 3, 11, 4, "string"]);

        expect(link.id).toBe(7);
        expect(link.origin_id).toBe(10);
        expect(link.origin_slot).toBe(3);
        expect(link.target_id).toBe(11);
        expect(link.target_slot).toBe(4);
        expect(link.type).toBe("string");
    });

    test("configure supports object format", () => {
        const link = new LLink(0, "old", 0, 0, 0, 0);
        link.configure({
            id: 12,
            type: "event",
            origin_id: 2,
            origin_slot: 5,
            target_id: 9,
            target_slot: 6,
        });

        expect(link.serialize()).toEqual([12, 2, 5, 9, 6, "event"]);
    });
});
