const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { generateDocumentationOutputs } from "../../scripts/docs/docgen-lib.mjs";

async function makeTempRoot() {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "litegraph-docgen-module-coupling-"));
    await fs.mkdir(path.join(tmpRoot, "src/a"), { recursive: true });
    await fs.mkdir(path.join(tmpRoot, "src/b"), { recursive: true });
    return tmpRoot;
}

describe("docgen module coupling", () => {
    test("aggregates import edges into module-level coupling", async () => {
        const rootDir = await makeTempRoot();
        await fs.writeFile(path.join(rootDir, "src/b/b.js"), "export const B = 1;\n", "utf8");
        await fs.writeFile(path.join(rootDir, "src/a/a.js"), "import { B } from '../b/b.js';\nexport const A = B;\n", "utf8");

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

        const aModule = result.moduleStats.find((item) => item.moduleKey === "src/a");
        const bModule = result.moduleStats.find((item) => item.moduleKey === "src/b");

        expect(aModule).toBeDefined();
        expect(bModule).toBeDefined();
        expect(aModule.outgoingTop.some((edge) => edge.module === "src/b")).toBe(true);
        expect(bModule.incomingTop.some((edge) => edge.module === "src/a")).toBe(true);
    });
});
