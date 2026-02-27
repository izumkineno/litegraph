const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { generateDocumentationOutputs } from "../../scripts/docs/docgen-lib.mjs";

async function makeTempRoot() {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "litegraph-docgen-delegate-coupling-"));
    await fs.mkdir(path.join(tmpRoot, "src/lgraphcanvas/controllers"), { recursive: true });
    await fs.mkdir(path.join(tmpRoot, "src/lgraphcanvas/modules"), { recursive: true });
    return tmpRoot;
}

describe("docgen delegate coupling", () => {
    test("enhances coupling by install-delegates/controllers semantics", async () => {
        const rootDir = await makeTempRoot();

        await fs.writeFile(path.join(rootDir, "src/lgraphcanvas/modules/core.js"), "export const coreMethods = { ping() {} };\n", "utf8");
        await fs.writeFile(path.join(rootDir, "src/lgraphcanvas/controllers/index.js"), "export function createLGraphCanvasControllers() { return {}; }\n", "utf8");
        await fs.writeFile(path.join(rootDir, "src/lgraphcanvas/controllers/core-controller.js"), "import * as core from '../modules/core.js';\nexport class CoreController { constructor(){ this.core = core; } }\n", "utf8");
        await fs.writeFile(path.join(rootDir, "src/lgraphcanvas/install-delegates.js"), [
            "import { createLGraphCanvasControllers } from './controllers/index.js';",
            "import { coreMethods } from './modules/core.js';",
            "const delegateMap = { draw: 'core' };",
            "const methodGroups = [coreMethods];",
            "export function installLGraphCanvasDelegates() {",
            "  createLGraphCanvasControllers();",
            "  return methodGroups;",
            "}",
        ].join("\n"), "utf8");

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

        const installModule = result.moduleStats.find((item) => item.moduleKey === "src/lgraphcanvas");
        const controllersModule = result.moduleStats.find((item) => item.moduleKey === "src/lgraphcanvas/controllers");
        const modulesModule = result.moduleStats.find((item) => item.moduleKey === "src/lgraphcanvas/modules");

        expect(installModule).toBeDefined();
        expect(controllersModule).toBeDefined();
        expect(modulesModule).toBeDefined();
        expect(installModule.outgoingTop.some((edge) => edge.module === "src/lgraphcanvas/controllers")).toBe(true);
        expect(installModule.outgoingTop.some((edge) => edge.module === "src/lgraphcanvas/modules")).toBe(true);
        expect(controllersModule.outgoingTop.some((edge) => edge.module === "src/lgraphcanvas/modules")).toBe(true);
    });
});
