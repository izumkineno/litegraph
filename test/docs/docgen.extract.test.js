const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { extractFileDocumentation } from "../../scripts/docs/docgen-lib.mjs";

async function makeTempRoot() {
    const tmpRoot = await fs.mkdtemp(path.join(os.tmpdir(), "litegraph-docgen-extract-"));
    await fs.mkdir(path.join(tmpRoot, "src"), { recursive: true });
    return tmpRoot;
}

describe("docgen export extraction", () => {
    test("extracts direct exports and one-hop re-export metadata", async () => {
        const rootDir = await makeTempRoot();
        const mainFile = path.join(rootDir, "src/main.js");
        const depFile = path.join(rootDir, "src/dep.js");

        await fs.writeFile(depFile, [
            "export const foo = 1;",
            "export const bar = 2;",
        ].join("\n"), "utf8");

        await fs.writeFile(mainFile, [
            "/** foo function */",
            "export function fooFn() {",
            "    return 1;",
            "}",
            "export class BarCls {}",
            "export const A = 1, B = 2;",
            "const local = 3;",
            "export { local as localAlias };",
            "export { foo as depFoo } from './dep.js';",
            "export * from './dep.js';",
            "export default function namedDefault() {",
            "    return 'ok';",
            "}",
        ].join("\n"), "utf8");

        const doc = await extractFileDocumentation({
            sourceAbsPath: mainFile,
            sourceRelPath: "src/main.js",
            rootDir,
            snippetOptions: { minLines: 6, maxLines: 20 },
            parseCache: new Map(),
        });

        const kinds = new Map(doc.items.map((item) => [item.exportedName, item.kind]));
        expect(kinds.get("fooFn")).toBe("function");
        expect(kinds.get("BarCls")).toBe("class");
        expect(kinds.get("A")).toBe("variable");
        expect(kinds.get("B")).toBe("variable");
        expect(kinds.get("localAlias")).toBe("named_export");
        expect(kinds.get("depFoo")).toBe("re_export_named");
        expect(doc.items.some((item) => item.kind === "export_all")).toBe(true);
        expect(doc.items.some((item) => item.kind === "default_export")).toBe(true);

        const depFoo = doc.items.find((item) => item.exportedName === "depFoo");
        expect(depFoo.reexport.targetFile).toBe("src/dep.js");
        expect(depFoo.reexport.targetStartLine).toBe(1);
        expect(depFoo.reexport.targetEndLine).toBe(1);
    });
});
