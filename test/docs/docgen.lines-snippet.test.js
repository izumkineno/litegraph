const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { extractFileDocumentation } from "../../scripts/docs/docgen-lib.mjs";

async function makeTempRoot() {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "litegraph-docgen-lines-"));
    await fs.mkdir(path.join(tmpRoot, "src"), { recursive: true });
    return tmpRoot;
}

describe("docgen line range and snippet", () => {
    test("keeps accurate line ranges and clips snippets by maxLines", async () => {
        const rootDir = await makeTempRoot();
        const mainFile = path.join(rootDir, "src/ranges.js");
        const bodyLines = [];
        for (let i = 0; i < 40; i += 1) {
            bodyLines.push(`    const v${i} = ${i};`);
        }

        await fs.writeFile(mainFile, [
            "export function veryLongFunction() {",
            ...bodyLines,
            "    return v0;",
            "}",
        ].join("\n"), "utf8");

        const doc = await extractFileDocumentation({
            sourceAbsPath: mainFile,
            sourceRelPath: "src/ranges.js",
            rootDir,
            snippetOptions: { minLines: 6, maxLines: 20 },
            parseCache: new Map(),
        });

        const fn = doc.items.find((item) => item.exportedName === "veryLongFunction");
        expect(fn.startLine).toBe(1);
        expect(fn.endLine).toBeGreaterThan(20);
        expect(fn.location).toContain("src/ranges.js:1-");

        const snippetLen = fn.snippetEndLine - fn.snippetStartLine + 1;
        expect(snippetLen).toBeLessThanOrEqual(20);
        expect(fn.snippetTruncated).toBe(true);
        expect(fn.snippet.includes("const v0 = 0;")).toBe(true);
    });
});
