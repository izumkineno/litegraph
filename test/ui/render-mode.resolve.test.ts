// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import { resolveRenderMode } from "../../src/lgraphcanvas/modes/resolve-render-mode.ts";

describe("render mode resolve", () => {
    test("new renderForm/renderStrategy fields override legacy adapter fields", () => {
        const runtime = resolveRenderMode({
            options: {
                renderForm: "legacy",
                renderStrategy: "legacy",
                rendererAdapter: {
                    options: {
                        mode: "full-leafer",
                    },
                },
            },
        });

        expect(runtime.form).toBe("legacy");
        expect(runtime.strategy).toBe("legacy");
        expect(runtime.capabilities.forceLegacyNodeCtx).toBe(true);
    });

    test("legacy adapter mode maps to leafer strategy when new fields are absent", () => {
        const runtime = resolveRenderMode({
            options: {
                rendererAdapter: {
                    options: {
                        mode: "hybrid-back",
                    },
                },
            },
        });

        expect(runtime.form).toBe("leafer");
        expect(runtime.strategy).toBe("hybrid-back");
        expect(runtime.capabilities.frontNative).toBe(false);
        expect(runtime.capabilities.backNative).toBe(true);
    });
});
