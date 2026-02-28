import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transformWithEsbuild } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const inputPath = path.resolve(projectRoot, "editor/js/litegraph-editor.ts");
const outputPath = path.resolve(projectRoot, "editor/js/litegraph-editor.js");

const source = await readFile(inputPath, "utf8");
const transformed = await transformWithEsbuild(source, inputPath, {
    loader: "ts",
    format: "esm",
    target: "es2019",
    sourcemap: false,
});

await writeFile(outputPath, transformed.code, "utf8");
console.log("Built editor/js/litegraph-editor.js from TS source.");
