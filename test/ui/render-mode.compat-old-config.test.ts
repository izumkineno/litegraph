// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import { resolveRenderMode } from "../../src/lgraphcanvas/modes/resolve-render-mode.ts";

describe("render mode compatibility with old config", () => {
    test("maps old hybrid adapter mode into leafer + hybrid-back runtime", () => {
        const runtime = resolveRenderMode({
            options: {
                rendererAdapter: {
                    options: {
                        mode: "hybrid-back",
                        nodeRenderMode: "legacy-ctx",
                    },
                },
            },
        });

        expect(runtime.form).toBe("leafer");
        expect(runtime.strategy).toBe("hybrid-back");
        expect(runtime.capabilities.forceLegacyNodeCtx).toBe(true);
    });

    test("maps old full-leafer adapter mode into leafer + full-leafer runtime", () => {
        const runtime = resolveRenderMode({
            options: {
                rendererAdapter: {
                    options: {
                        mode: "full-leafer",
                        nodeRenderMode: "uiapi-components",
                    },
                },
            },
        });

        expect(runtime.form).toBe("leafer");
        expect(runtime.strategy).toBe("full-leafer");
        expect(runtime.capabilities.frontNative).toBe(true);
    });
});
