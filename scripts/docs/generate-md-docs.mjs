#!/usr/bin/env node
import path from "node:path";
import process from "node:process";
import {
    cleanOutputDirectory,
    compareOutputMaps,
    generateDocumentationOutputs,
    loadConfig,
    readExistingOutputs,
    writeOutputMap,
} from "./docgen-lib.mjs";

function parseArgs(argv) {
    const args = {
        check: false,
        root: process.cwd(),
        config: null,
    };

    for (let i = 0; i < argv.length; i += 1) {
        const token = argv[i];
        switch (token) {
            case "--check":
                args.check = true;
                break;
            case "--root":
                args.root = argv[i + 1] ? path.resolve(argv[i + 1]) : args.root;
                i += 1;
                break;
            case "--config":
                args.config = argv[i + 1] ?? null;
                i += 1;
                break;
            default:
                break;
        }
    }

    return args;
}

function printDiff(diff) {
    if (diff.missing.length) {
        console.error("缺失文件（应生成但不存在）:");
        diff.missing.forEach((item) => console.error(`  + ${item}`));
    }
    if (diff.extra.length) {
        console.error("多余文件（生成结果不存在）:");
        diff.extra.forEach((item) => console.error(`  - ${item}`));
    }
    if (diff.changed.length) {
        console.error("内容变化文件:");
        diff.changed.forEach((item) => console.error(`  ~ ${item}`));
    }
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const rootDir = args.root;
    const config = await loadConfig(rootDir, args.config);
    const { outputs, summary } = await generateDocumentationOutputs(rootDir, config);

    if (args.check) {
        const existing = await readExistingOutputs(rootDir, config);
        const diff = compareOutputMaps(outputs, existing);
        if (diff.hasDiff) {
            console.error("文档检查失败：存在未同步的 Markdown 文档变更。");
            printDiff(diff);
            process.exitCode = 1;
            return;
        }
        console.log(`文档检查通过：${summary.fileCount} 个文件，${summary.exportCount} 个导出项。`);
        return;
    }

    await cleanOutputDirectory(rootDir, config);
    await writeOutputMap(rootDir, config, outputs);
    console.log(`Markdown 文档已生成：${summary.fileCount} 个文件，${summary.exportCount} 个导出项，AUTO ${summary.autoCount} 项。`);
}

main().catch((error) => {
    console.error("生成 Markdown 文档失败：", error);
    process.exitCode = 1;
});
