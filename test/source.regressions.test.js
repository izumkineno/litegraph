const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

describe("source-level regressions", () => {
    test("gltextures exposition uses computed exp uniform", () => {
        const source = readFileSync(path.join(projectRoot, "src/nodes/gltextures.js"), "utf8");
        expect(source).toContain("uniforms.u_exposition = exp;");
    });

    test("lgraphcanvas search box uses modern key and URI encoding APIs", () => {
        const source = readFileSync(
            path.join(projectRoot, "src/lgraphcanvas/modules/ui-dialogs-panels-search.js"),
            "utf8",
        );
        expect(source).toContain("e.key === \"ArrowUp\"");
        expect(source).toContain("encodeURIComponent(type)");
        expect(source).toContain("decodeURIComponent(this.dataset[\"type\"])");
    });

    test("contextmenu trigger stores origin in litegraphTarget instead of overriding target", () => {
        const source = readFileSync(path.join(projectRoot, "src/contextmenu.js"), "utf8");
        expect(source).toContain("Object.defineProperty(evt, \"litegraphTarget\"");
        expect(source).not.toContain("Object.defineProperty(evt, 'target'");
    });
});
