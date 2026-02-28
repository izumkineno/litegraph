// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import { resolveRenderMode } from "../../src/lgraphcanvas/modes/resolve-render-mode.ts";

describe("render mode decoupled-compat resolve", () => {
    test("resolves explicit decoupled-compat strategy with compat bridge capability", () => {
        const runtime = resolveRenderMode({
            options: {
                renderForm: "leafer",
                renderStrategy: "decoupled-compat",
            },
        });

        expect(runtime.form).toBe("leafer");
        expect(runtime.strategy).toBe("decoupled-compat");
        expect(runtime.capabilities.frontNative).toBe(true);
        expect(runtime.capabilities.backNative).toBe(true);
        expect(runtime.capabilities.forceLegacyNodeCtx).toBe(false);
        expect(runtime.capabilities.useCompatBridge).toBe(true);
    });

    test("does not map legacy adapter mode to decoupled-compat implicitly", () => {
        const runtime = resolveRenderMode({
            options: {
                rendererAdapter: {
                    options: {
                        mode: "full-leafer",
                    },
                },
            },
        });

        expect(runtime.strategy).toBe("full-leafer");
        expect(runtime.capabilities.useCompatBridge).toBe(false);
    });
});
