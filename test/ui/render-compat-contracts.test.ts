// @ts-nocheck
const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;

import {
    RENDER_CONTEXT_COMPAT_PROPERTIES,
    validateRenderContext2DCompat,
} from "../../src/lgraphcanvas/renderer/contracts.js";
import { createMockCanvasContext } from "../helpers/canvas-mock.js";

describe("render compat contracts", () => {
    test("includes globalCompositeOperation in compat properties", () => {
        expect(RENDER_CONTEXT_COMPAT_PROPERTIES).toContain("globalCompositeOperation");
    });

    test("validator reports missing globalCompositeOperation", () => {
        const ctx = createMockCanvasContext();
        delete ctx.globalCompositeOperation;
        const result = validateRenderContext2DCompat(ctx);
        expect(result.ok).toBe(false);
        expect(result.missingProperties).toContain("globalCompositeOperation");
    });
});
