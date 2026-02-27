const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

async function makeTempRoot() {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "litegraph-docgen-check-"));
    await fs.mkdir(path.join(tmpRoot, "src"), { recursive: true });
    return tmpRoot;
}

function runDocgen(args) {
    return spawnSync(process.execPath, args, {
        encoding: "utf8",
    });
}

describe("docgen check mode", () => {
    test("returns non-zero when docs are outdated", async () => {
        const repoRoot = process.cwd();
        const rootDir = await makeTempRoot();
        const scriptPath = path.join(repoRoot, "scripts/docs/generate-md-docs.mjs");
        const configPath = path.join(rootDir, "docgen.config.mjs");
        const sourcePath = path.join(rootDir, "src/check.js");

        await fs.writeFile(sourcePath, "export const A = 1;\n", "utf8");
        await fs.writeFile(configPath, [
            "export default {",
            "  includeRoot: 'src',",
            "  includeExtensions: ['.js'],",
            "  excludePrefixes: ['src/nodes/'],",
            "  outputDir: 'docs',",
            "  fileDocsDir: 'files',",
            "  cleanKeep: [],",
            "  snippet: { minLines: 6, maxLines: 20 },",
            "};",
        ].join("\n"), "utf8");

        const writeResult = runDocgen([scriptPath, "--root", rootDir, "--config", configPath]);
        expect(writeResult.status).toBe(0);

        const checkOk = runDocgen([scriptPath, "--root", rootDir, "--config", configPath, "--check"]);
        expect(checkOk.status).toBe(0);

        await fs.writeFile(sourcePath, "export const A = 1;\nexport const B = 2;\n", "utf8");

        const checkFail = runDocgen([scriptPath, "--root", rootDir, "--config", configPath, "--check"]);
        expect(checkFail.status).toBe(1);
        expect(checkFail.stderr).toContain("文档检查失败");
    });
});
