const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

async function makeTempRoot() {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "litegraph-docgen-module-check-"));
    await fs.mkdir(path.join(tmpRoot, "src/a"), { recursive: true });
    await fs.mkdir(path.join(tmpRoot, "src/b"), { recursive: true });
    return tmpRoot;
}

function runDocgen(args) {
    return spawnSync(process.execPath, args, {
        encoding: "utf8",
    });
}

describe("docgen module check mode", () => {
    test("fails check when module coupling change is not regenerated", async () => {
        const repoRoot = process.cwd();
        const rootDir = await makeTempRoot();
        const scriptPath = path.join(repoRoot, "scripts/docs/generate-md-docs.mjs");
        const configPath = path.join(rootDir, "docgen.config.mjs");
        const sourceA = path.join(rootDir, "src/a/a.js");
        const sourceB = path.join(rootDir, "src/b/b.js");

        await fs.writeFile(sourceA, "export const A = 1;\n", "utf8");
        await fs.writeFile(sourceB, "export const B = 2;\n", "utf8");
        await fs.writeFile(configPath, [
            "export default {",
            "  includeRoot: 'src',",
            "  includeExtensions: ['.js'],",
            "  excludePrefixes: ['src/nodes/'],",
            "  outputDir: 'docs',",
            "  fileDocsDir: 'files',",
            "  cleanKeep: [],",
            "  snippet: { minLines: 6, maxLines: 20 },",
            "  moduleIntro: { enabled: true, topCouplingLimit: 3 },",
            "};",
        ].join("\n"), "utf8");

        const writeResult = runDocgen([scriptPath, "--root", rootDir, "--config", configPath]);
        expect(writeResult.status).toBe(0);

        const checkOk = runDocgen([scriptPath, "--root", rootDir, "--config", configPath, "--check"]);
        expect(checkOk.status).toBe(0);

        await fs.writeFile(sourceA, "import { B } from '../b/b.js';\nexport const A = B;\n", "utf8");

        const checkFail = runDocgen([scriptPath, "--root", rootDir, "--config", configPath, "--check"]);
        expect(checkFail.status).toBe(1);
        expect(checkFail.stderr).toContain("文档检查失败");
    });
});
