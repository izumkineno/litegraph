const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { generateDocumentationOutputs } from "../../scripts/docs/docgen-lib.mjs";

async function makeTempRoot() {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "litegraph-docgen-intro-render-"));
    await fs.mkdir(path.join(tmpRoot, "src/a"), { recursive: true });
    return tmpRoot;
}

describe("docgen module intro render", () => {
    test("renders module overview in index and module intro in file docs", async () => {
        const rootDir = await makeTempRoot();
        await fs.writeFile(path.join(rootDir, "src/a/a.js"), "export const A = 1;\n", "utf8");

        const result = await generateDocumentationOutputs(rootDir, {
            includeRoot: "src",
            includeExtensions: [".js"],
            excludePrefixes: ["src/nodes/"],
            outputDir: "docs",
            fileDocsDir: "files",
            cleanKeep: [],
            snippet: { minLines: 6, maxLines: 20 },
            moduleIntro: { enabled: true, topCouplingLimit: 3 },
        });

        const index = result.outputs.get("index.md");
        const fileDoc = result.outputs.get("files/src/a/a.md");

        expect(index).toContain("## 模块总览");
        expect(index).toContain("[AUTO-MODULE]");
        expect(fileDoc).toContain("## 所属模块介绍");
        expect(fileDoc).toContain("[AUTO-MODULE]");
    });
});
