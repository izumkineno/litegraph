import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.resolve(projectRoot, "build");

const bundles = [
    {
        entry: "src/entries/litegraph.full.js",
        fileBase: "litegraph",
    },
    {
        entry: "src/entries/litegraph.mini.js",
        fileBase: "litegraph.mini",
    },
    {
        entry: "src/entries/litegraph.core.js",
        fileBase: "litegraph.core",
    },
];

const resourcesToCopy = [
    {
        from: "css",
        to: "resources/css",
    },
    {
        from: "editor/imgs",
        to: "resources/editor/imgs",
    },
    {
        from: "nodes_data",
        to: "resources/nodes_data",
    },
];

async function buildBundle({ entry, fileBase }) {
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
                output: {
                    exports: "named",
                    hoistTransitiveImports: false,
                },
            },
        },
    });
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

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

for (const bundle of bundles) {
    console.log(`Building ${bundle.fileBase}.js ...`);
    await buildBundle(bundle);
}

await copyBuildResources();
