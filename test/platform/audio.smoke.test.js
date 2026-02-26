const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");

describe("platform smoke: audio nodes", () => {
    test("audio module exists and keeps node registrations", () => {
        const source = readFileSync(path.join(root, "src/nodes/audio.js"), "utf8");
        expect(source.length).toBeGreaterThan(1000);
        expect(source).toContain("LiteGraph.registerNodeType(\"audio/source\"");
        expect(source).toContain("ScriptProcessorNode");
    });
});
