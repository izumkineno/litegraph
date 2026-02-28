import { cp, mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build, transformWithEsbuild } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.resolve(projectRoot, "build");

const bundles = [
    {
        entry: "src/entries/litegraph.core.ts",
        fileBase: "litegraph.core",
    },
    {
        entry: "src/entries/litegraph.nodes.base.ts",
        fileBase: "litegraph.nodes.base",
        external: [
            "../litegraph.js",
        ],
    },
    {
        entry: "src/entries/litegraph.nodes.feature.ts",
        fileBase: "litegraph.nodes.feature",
        external: [
            "../litegraph.js",
        ],
    },
    {
        entry: "src/entries/litegraph.nodes.webgl.ts",
        fileBase: "litegraph.nodes.webgl",
        external: [
            "../litegraph.js",
            "../../editor/js/code.js",
            "../../editor/js/libs/litegl.js",
        ],
    },
];

const resourcesToCopy = [
    {
        from: "src/css/litegraph.css",
        to: "litegraph.css",
    },
];

async function buildBundle({ entry, fileBase, external = [] }) {
    await build({
        configFile: false,
        root: projectRoot,
        build: {
            target: "es2019",
            outDir,
            emptyOutDir: false,
            minify: "esbuild",
            sourcemap: false,
            lib: {
                entry: path.resolve(projectRoot, entry),
                formats: ["es"],
                fileName: () => `${fileBase}.js`,
            },
            rollupOptions: {
                external,
                output: {
                    exports: "named",
                    hoistTransitiveImports: false,
                },
            },
        },
    });
}

async function rewriteBuiltImports(relativeFilePath, replacements) {
    const targetPath = path.resolve(outDir, relativeFilePath);
    let source = await readFile(targetPath, "utf8");
    for (const [from, to] of replacements) {
        source = source.split(from).join(to);
    }
    await writeFile(targetPath, source, "utf8");
}

async function copyBuildResources() {
    for (const { from, to } of resourcesToCopy) {
        const sourcePath = path.resolve(projectRoot, from);
        const targetPath = path.resolve(outDir, to);
        const sourceStat = await stat(sourcePath);

        await mkdir(path.dirname(targetPath), { recursive: true });
        await cp(sourcePath, targetPath, { recursive: sourceStat.isDirectory() });
        console.log(`Copied ${from} -> build/${to}`);
    }
}

async function minifyBuiltJsFiles(directoryPath) {
    const entries = await readdir(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
        const entryPath = path.join(directoryPath, entry.name);
        if (entry.isDirectory()) {
            await minifyBuiltJsFiles(entryPath);
            continue;
        }

        if (!entry.isFile() || !entry.name.endsWith(".js")) {
            continue;
        }

        const source = await readFile(entryPath, "utf8");
        const transformed = await transformWithEsbuild(source, entryPath, {
            loader: "js",
            target: "es2019",
            minify: true,
            legalComments: "none",
        });
        await writeFile(entryPath, transformed.code, "utf8");
        console.log(`Minified ${path.relative(projectRoot, entryPath)}`);
    }
}

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

for (const bundle of bundles) {
    console.log(`Building ${bundle.fileBase}.js ...`);
    await buildBundle(bundle);
}

await minifyBuiltJsFiles(outDir);
await rewriteBuiltImports("litegraph.nodes.base.js", [
    ["\"../litegraph.js\"", "\"./litegraph.core.js\""],
    ["'../litegraph.js'", "'./litegraph.core.js'"],
]);
await rewriteBuiltImports("litegraph.nodes.feature.js", [
    ["\"../litegraph.js\"", "\"./litegraph.core.js\""],
    ["'../litegraph.js'", "'./litegraph.core.js'"],
]);
await rewriteBuiltImports("litegraph.nodes.webgl.js", [
    ["\"../litegraph.js\"", "\"./litegraph.core.js\""],
    ["\"../../editor/js/code.js\"", "\"../editor/js/code.js\""],
    ["\"../../editor/js/libs/litegl.js\"", "\"../editor/js/libs/litegl.js\""],
    ["'../litegraph.js'", "'./litegraph.core.js'"],
    ["'../../editor/js/code.js'", "'../editor/js/code.js'"],
    ["'../../editor/js/libs/litegl.js'", "'../editor/js/libs/litegl.js'"],
]);
await copyBuildResources();
