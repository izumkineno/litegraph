import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { parse } from "@babel/parser";

export const DEFAULT_PARSER_OPTIONS = {
    sourceType: "module",
    errorRecovery: true,
    ranges: true,
    plugins: [
        "jsx",
        "classProperties",
        "classPrivateProperties",
        "classPrivateMethods",
        "decorators-legacy",
        "dynamicImport",
        "importMeta",
        "objectRestSpread",
        "optionalChaining",
        "nullishCoalescingOperator",
        "numericSeparator",
        "logicalAssignment",
        "optionalCatchBinding",
        "topLevelAwait",
        "typescript",
    ],
};

export function toPosixPath(value) {
    return value.replace(/\\/g, "/");
}

function normalizeLineEndings(value) {
    return value.replace(/\r\n/g, "\n");
}

function trimCommentLines(lines) {
    let start = 0;
    let end = lines.length - 1;
    while (start <= end && lines[start].trim() === "") {
        start += 1;
    }
    while (end >= start && lines[end].trim() === "") {
        end -= 1;
    }
    return lines.slice(start, end + 1);
}

function normalizeCommentText(comment) {
    const raw = comment?.value ?? "";
    const lines = raw.split(/\r?\n/);
    const cleaned = lines.map((line) => line.replace(/^\s*\* ?/, "").replace(/\s+$/g, ""));
    return trimCommentLines(cleaned).join("\n").trim();
}

function hasOnlyBlankLines(lines, startLine, endLine) {
    if (startLine > endLine) {
        return true;
    }
    for (let lineNo = startLine; lineNo <= endLine; lineNo += 1) {
        if ((lines[lineNo - 1] ?? "").trim() !== "") {
            return false;
        }
    }
    return true;
}

function isJsdocComment(comment) {
    return comment?.type === "CommentBlock" && (comment.value ?? "").trimStart().startsWith("*");
}

function getNearestLeadingComment(startLine, comments, lines) {
    const candidates = comments.filter((comment) => {
        if (!comment?.loc) {
            return false;
        }
        if (comment.loc.end.line >= startLine) {
            return false;
        }
        return hasOnlyBlankLines(lines, comment.loc.end.line + 1, startLine - 1);
    });

    if (!candidates.length) {
        return null;
    }

    const jsdocCandidates = candidates.filter(isJsdocComment);
    const source = jsdocCandidates.length ? jsdocCandidates : candidates;
    source.sort((a, b) => b.loc.end.line - a.loc.end.line || b.loc.end.column - a.loc.end.column);
    return source[0] ?? null;
}

function getTopModuleComment(programBody, comments, lines) {
    const firstBodyLine = programBody[0]?.loc?.start?.line ?? Number.MAX_SAFE_INTEGER;
    const topCandidates = comments.filter((comment) => {
        if (!comment?.loc || comment.type !== "CommentBlock") {
            return false;
        }
        if (comment.loc.start.line > 12) {
            return false;
        }
        if (comment.loc.end.line >= firstBodyLine) {
            return false;
        }
        return hasOnlyBlankLines(lines, comment.loc.end.line + 1, firstBodyLine - 1);
    });

    if (!topCandidates.length) {
        return "";
    }

    topCandidates.sort((a, b) => a.loc.start.line - b.loc.start.line || a.loc.start.column - b.loc.start.column);
    return normalizeCommentText(topCandidates[0]);
}

function collectBindingNames(pattern, out = []) {
    if (!pattern) {
        return out;
    }

    switch (pattern.type) {
        case "Identifier":
            out.push(pattern.name);
            break;
        case "ObjectPattern":
            for (const property of pattern.properties ?? []) {
                if (property.type === "RestElement") {
                    collectBindingNames(property.argument, out);
                    continue;
                }
                collectBindingNames(property.value ?? property.key, out);
            }
            break;
        case "ArrayPattern":
            for (const element of pattern.elements ?? []) {
                collectBindingNames(element, out);
            }
            break;
        case "AssignmentPattern":
            collectBindingNames(pattern.left, out);
            break;
        case "RestElement":
            collectBindingNames(pattern.argument, out);
            break;
        default:
            break;
    }

    return out;
}

function getModuleKey(sourceRelPath) {
    return toPosixPath(path.posix.dirname(sourceRelPath));
}

function createAutoDescription(item, sourceRelPath) {
    switch (item.kind) {
        case "function":
            return `[AUTO] 导出函数 \`${item.exportedName}\`，定义于 \`${sourceRelPath}\`。`;
        case "class":
            return `[AUTO] 导出类 \`${item.exportedName}\`，定义于 \`${sourceRelPath}\`。`;
        case "variable":
            return `[AUTO] 导出变量 \`${item.exportedName}\`（${item.declarationKind ?? "声明"}），定义于 \`${sourceRelPath}\`。`;
        case "named_export":
            return `[AUTO] 命名导出 \`${item.exportedName}\`，来自当前模块作用域。`;
        case "re_export_named":
            return `[AUTO] 命名转发导出 \`${item.exportedName}\`，来源 \`${item.reexport?.source ?? "未知"}\`。`;
        case "export_all":
            return `[AUTO] 通配转发导出，来源 \`${item.reexport?.source ?? "未知"}\`。`;
        case "default_export":
            return `[AUTO] 默认导出 \`${item.exportedName}\`。`;
        default:
            return `[AUTO] 导出项 \`${item.exportedName}\`。`;
    }
}

function getSnippet(lines, startLine, endLine, snippetOptions) {
    const minLines = Math.max(1, Number(snippetOptions?.minLines ?? 6));
    const maxLines = Math.max(minLines, Number(snippetOptions?.maxLines ?? 20));
    const fileLineCount = lines.length;

    let snippetStart = Math.max(1, startLine);
    let snippetEnd = Math.min(fileLineCount, Math.max(endLine, snippetStart));
    let snippetLength = snippetEnd - snippetStart + 1;

    if (snippetLength < minLines) {
        snippetEnd = Math.min(fileLineCount, snippetStart + minLines - 1);
        snippetLength = snippetEnd - snippetStart + 1;
        if (snippetLength < minLines) {
            snippetStart = Math.max(1, snippetEnd - minLines + 1);
        }
    }

    let truncated = false;
    if (snippetEnd - snippetStart + 1 > maxLines) {
        snippetEnd = snippetStart + maxLines - 1;
        truncated = true;
    }

    const snippet = lines.slice(snippetStart - 1, snippetEnd).join("\n");
    return {
        snippet,
        snippetStartLine: snippetStart,
        snippetEndLine: snippetEnd,
        snippetTruncated: truncated,
    };
}

function resolveLocalModulePath(importerAbsPath, sourceValue) {
    if (!sourceValue || !sourceValue.startsWith(".")) {
        return null;
    }

    const baseDir = path.dirname(importerAbsPath);
    const rawResolved = path.resolve(baseDir, sourceValue);
    const candidates = [];
    const ext = path.extname(rawResolved);

    if (ext) {
        candidates.push(rawResolved);
    } else {
        candidates.push(`${rawResolved}.ts`);
        candidates.push(`${rawResolved}.js`);
        candidates.push(path.join(rawResolved, "index.ts"));
        candidates.push(path.join(rawResolved, "index.js"));
    }

    return candidates;
}

async function fileExists(filePath) {
    try {
        const stats = await fs.stat(filePath);
        return stats.isFile();
    } catch {
        return false;
    }
}

async function resolveExistingLocalModulePath(importerAbsPath, sourceValue) {
    const candidates = resolveLocalModulePath(importerAbsPath, sourceValue);
    if (!candidates) {
        return null;
    }

    for (const candidate of candidates) {
        if (await fileExists(candidate)) {
            return candidate;
        }
    }

    return null;
}

async function parseTargetExportMap(targetAbsPath, parseCache) {
    const cached = parseCache.get(targetAbsPath);
    if (cached) {
        return cached;
    }

    const source = normalizeLineEndings(await fs.readFile(targetAbsPath, "utf8"));
    const ast = parse(source, {
        ...DEFAULT_PARSER_OPTIONS,
        sourceFilename: targetAbsPath,
    });
    const body = ast.program?.body ?? [];
    const byName = new Map();

    for (const node of body) {
        if (node.type === "ExportNamedDeclaration") {
            if (node.declaration) {
                if (node.declaration.type === "FunctionDeclaration" || node.declaration.type === "ClassDeclaration") {
                    const name = node.declaration.id?.name;
                    if (name && node.declaration.loc) {
                        byName.set(name, {
                            startLine: node.declaration.loc.start.line,
                            endLine: node.declaration.loc.end.line,
                        });
                    }
                } else if (node.declaration.type === "VariableDeclaration") {
                    for (const declarator of node.declaration.declarations ?? []) {
                        const names = collectBindingNames(declarator.id);
                        for (const name of names) {
                            if (!declarator.loc) {
                                continue;
                            }
                            byName.set(name, {
                                startLine: declarator.loc.start.line,
                                endLine: declarator.loc.end.line,
                            });
                        }
                    }
                }
            } else {
                for (const specifier of node.specifiers ?? []) {
                    if (!specifier.loc) {
                        continue;
                    }
                    const exportedName = specifier.exported?.name ?? specifier.exported?.value;
                    if (!exportedName) {
                        continue;
                    }
                    byName.set(exportedName, {
                        startLine: specifier.loc.start.line,
                        endLine: specifier.loc.end.line,
                    });
                }
            }
            continue;
        }

        if (node.type === "ExportDefaultDeclaration" && node.loc) {
            byName.set("default", {
                startLine: node.loc.start.line,
                endLine: node.loc.end.line,
            });
        }
    }

    const mapped = {
        byName,
        resolvableCount: byName.size,
    };
    parseCache.set(targetAbsPath, mapped);
    return mapped;
}

function createItemBase({ exportedName, kind, startLine, endLine, sourceRelPath }) {
    return {
        exportedName,
        kind,
        startLine,
        endLine,
        location: `${sourceRelPath}:${startLine}-${endLine}`,
        anchor: `#L${startLine}`,
    };
}

function parseProgramExportItems(ast, sourceRelPath) {
    const body = ast.program?.body ?? [];
    const items = [];

    for (const node of body) {
        if (node.type === "ExportNamedDeclaration") {
            if (node.declaration) {
                if (node.declaration.type === "FunctionDeclaration" && node.declaration.id?.name && node.declaration.loc) {
                    items.push({
                        ...createItemBase({
                            exportedName: node.declaration.id.name,
                            kind: "function",
                            startLine: node.declaration.loc.start.line,
                            endLine: node.declaration.loc.end.line,
                            sourceRelPath,
                        }),
                    });
                } else if (node.declaration.type === "ClassDeclaration" && node.declaration.id?.name && node.declaration.loc) {
                    items.push({
                        ...createItemBase({
                            exportedName: node.declaration.id.name,
                            kind: "class",
                            startLine: node.declaration.loc.start.line,
                            endLine: node.declaration.loc.end.line,
                            sourceRelPath,
                        }),
                    });
                } else if (node.declaration.type === "VariableDeclaration") {
                    for (const declarator of node.declaration.declarations ?? []) {
                        if (!declarator.loc) {
                            continue;
                        }
                        const names = collectBindingNames(declarator.id);
                        for (const name of names) {
                            items.push({
                                ...createItemBase({
                                    exportedName: name,
                                    kind: "variable",
                                    startLine: declarator.loc.start.line,
                                    endLine: declarator.loc.end.line,
                                    sourceRelPath,
                                }),
                                declarationKind: node.declaration.kind,
                            });
                        }
                    }
                }
                continue;
            }

            const sourceValue = node.source?.value ?? null;
            for (const specifier of node.specifiers ?? []) {
                if (!specifier.loc) {
                    continue;
                }
                const exportedName = specifier.exported?.name ?? specifier.exported?.value ?? "(unknown)";
                const localName = specifier.local?.name ?? specifier.local?.value ?? exportedName;
                items.push({
                    ...createItemBase({
                        exportedName,
                        kind: sourceValue ? "re_export_named" : "named_export",
                        startLine: specifier.loc.start.line,
                        endLine: specifier.loc.end.line,
                        sourceRelPath,
                    }),
                    localName,
                    reexport: sourceValue
                        ? {
                            source: sourceValue,
                        }
                        : null,
                });
            }
            continue;
        }

        if (node.type === "ExportAllDeclaration" && node.loc) {
            items.push({
                ...createItemBase({
                    exportedName: "*",
                    kind: "export_all",
                    startLine: node.loc.start.line,
                    endLine: node.loc.end.line,
                    sourceRelPath,
                }),
                reexport: {
                    source: node.source?.value ?? null,
                },
            });
            continue;
        }

        if (node.type === "ExportDefaultDeclaration" && node.loc) {
            let exportedName = "default";
            const declaration = node.declaration;
            if (declaration?.id?.name) {
                exportedName = `default (${declaration.id.name})`;
            }

            items.push({
                ...createItemBase({
                    exportedName,
                    kind: "default_export",
                    startLine: node.loc.start.line,
                    endLine: node.loc.end.line,
                    sourceRelPath,
                }),
                localName: declaration?.id?.name ?? "default",
            });
        }
    }

    return items;
}

function attachDescriptionsAndSnippets(items, lines, comments, sourceRelPath, snippetOptions) {
    return items.map((item) => {
        const comment = getNearestLeadingComment(item.startLine, comments, lines);
        const commentText = comment ? normalizeCommentText(comment) : "";
        const hasComment = Boolean(commentText);
        const description = hasComment ? commentText : createAutoDescription(item, sourceRelPath);
        const descriptionSource = hasComment ? "comment" : "auto";
        const snippetInfo = getSnippet(lines, item.startLine, item.endLine, snippetOptions);

        return {
            ...item,
            description,
            descriptionSource,
            autoGenerated: !hasComment,
            ...snippetInfo,
        };
    });
}

async function enrichReexportItems(items, sourceAbsPath, rootDir, parseCache) {
    const enriched = [];
    for (const item of items) {
        if (!item.reexport?.source) {
            enriched.push(item);
            continue;
        }

        const targetAbsPath = await resolveExistingLocalModulePath(sourceAbsPath, item.reexport.source);
        if (!targetAbsPath) {
            enriched.push(item);
            continue;
        }

        const parsed = await parseTargetExportMap(targetAbsPath, parseCache);
        const targetRelPath = toPosixPath(path.relative(rootDir, targetAbsPath));

        if (item.kind === "re_export_named") {
            const nameToResolve = item.localName ?? item.exportedName;
            const targetInfo = parsed.byName.get(nameToResolve);
            enriched.push({
                ...item,
                reexport: {
                    ...item.reexport,
                    targetFile: targetRelPath,
                    targetExportedName: nameToResolve,
                    targetStartLine: targetInfo?.startLine ?? null,
                    targetEndLine: targetInfo?.endLine ?? null,
                    resolvableCount: parsed.resolvableCount,
                },
            });
            continue;
        }

        if (item.kind === "export_all") {
            enriched.push({
                ...item,
                reexport: {
                    ...item.reexport,
                    targetFile: targetRelPath,
                    resolvableCount: parsed.resolvableCount,
                },
            });
            continue;
        }

        enriched.push(item);
    }
    return enriched;
}

async function collectImportMetadata({
    ast,
    sourceAbsPath,
    sourceRelPath,
    sourceModuleKey,
    rootDir,
}) {
    const importEdges = [];
    const importBindings = new Map();
    const importSourceMap = new Map();
    const body = ast.program?.body ?? [];

    for (const node of body) {
        if (node.type !== "ImportDeclaration") {
            continue;
        }

        const sourceValue = node.source?.value;
        if (typeof sourceValue !== "string" || !sourceValue.startsWith(".")) {
            continue;
        }

        const targetAbsPath = await resolveExistingLocalModulePath(sourceAbsPath, sourceValue);
        if (!targetAbsPath) {
            continue;
        }

        const targetRelPath = toPosixPath(path.relative(rootDir, targetAbsPath));
        const targetModule = getModuleKey(targetRelPath);

        importSourceMap.set(sourceValue, {
            source: sourceValue,
            targetFile: targetRelPath,
            targetModule,
        });

        if (targetModule !== sourceModuleKey) {
            importEdges.push({
                kind: "import",
                reason: "import",
                fromModule: sourceModuleKey,
                toModule: targetModule,
                fromFile: sourceRelPath,
                toFile: targetRelPath,
                weight: 1,
            });
        }

        for (const specifier of node.specifiers ?? []) {
            const localName = specifier.local?.name;
            if (!localName) {
                continue;
            }
            importBindings.set(localName, {
                source: sourceValue,
                targetFile: targetRelPath,
                targetModule,
            });
        }
    }

    return {
        importEdges,
        importBindings,
        importSourceMap,
    };
}

function collectVariableArrayIdentifiers(programBody, variableName) {
    const names = [];
    for (const node of programBody) {
        if (node.type !== "VariableDeclaration") {
            continue;
        }
        for (const declarator of node.declarations ?? []) {
            if (declarator.id?.type !== "Identifier" || declarator.id.name !== variableName) {
                continue;
            }
            if (declarator.init?.type !== "ArrayExpression") {
                continue;
            }
            for (const element of declarator.init.elements ?? []) {
                if (element?.type === "Identifier") {
                    names.push(element.name);
                }
            }
        }
    }
    return names;
}

function collectVariableObjectStringValues(programBody, variableName) {
    const values = [];
    for (const node of programBody) {
        if (node.type !== "VariableDeclaration") {
            continue;
        }
        for (const declarator of node.declarations ?? []) {
            if (declarator.id?.type !== "Identifier" || declarator.id.name !== variableName) {
                continue;
            }
            if (declarator.init?.type !== "ObjectExpression") {
                continue;
            }
            for (const property of declarator.init.properties ?? []) {
                if (property.type !== "ObjectProperty") {
                    continue;
                }
                if (property.value?.type === "StringLiteral") {
                    values.push(property.value.value);
                }
            }
        }
    }
    return values;
}

function isInstallDelegatesFile(sourceRelPath) {
    return /\/install-delegates\.js$/.test(sourceRelPath);
}

function isLGraphCanvasControllerFile(sourceRelPath) {
    return /^src\/lgraphcanvas\/controllers\/[^/]+\.js$/.test(sourceRelPath);
}

function collectDelegateEdges({
    ast,
    sourceRelPath,
    sourceModuleKey,
    importBindings,
    importSourceMap,
}) {
    const edgeCounter = new Map();
    const body = ast.program?.body ?? [];

    function addEdge(targetInfo, reason, weight = 1) {
        if (!targetInfo?.targetModule || targetInfo.targetModule === sourceModuleKey) {
            return;
        }
        const key = `${targetInfo.targetModule}|${reason}`;
        if (!edgeCounter.has(key)) {
            edgeCounter.set(key, {
                kind: "delegate",
                reason,
                fromModule: sourceModuleKey,
                toModule: targetInfo.targetModule,
                fromFile: sourceRelPath,
                toFile: targetInfo.targetFile ?? null,
                weight: 0,
            });
        }
        edgeCounter.get(key).weight += weight;
    }

    if (isInstallDelegatesFile(sourceRelPath)) {
        for (const [importSource, targetInfo] of importSourceMap.entries()) {
            if (importSource.startsWith("./modules/") || importSource.startsWith("./controllers/")) {
                addEdge(targetInfo, "install-delegates import", 1);
            }
        }

        const methodGroupNames = collectVariableArrayIdentifiers(body, "methodGroups");
        for (const name of methodGroupNames) {
            const targetInfo = importBindings.get(name);
            if (targetInfo) {
                addEdge(targetInfo, "methodGroups", 1);
            }
        }

        if (sourceRelPath === "src/lgraphcanvas/install-delegates.js") {
            const delegateControllers = new Set(collectVariableObjectStringValues(body, "delegateMap"));
            const controllerFactoryTarget = importBindings.get("createLGraphCanvasControllers");
            if (controllerFactoryTarget) {
                addEdge(controllerFactoryTarget, "controllerFactory", 1);
                if (delegateControllers.size > 0) {
                    addEdge(controllerFactoryTarget, "delegateMap", delegateControllers.size);
                }
            }
        }
    }

    if (isLGraphCanvasControllerFile(sourceRelPath)) {
        for (const [importSource, targetInfo] of importSourceMap.entries()) {
            if (importSource.startsWith("../modules/")) {
                addEdge(targetInfo, "controller-module-binding", 1);
            }
        }
    }

    return Array.from(edgeCounter.values());
}

export async function extractFileDocumentation({
    sourceAbsPath,
    sourceRelPath,
    rootDir,
    snippetOptions,
    parseCache,
}) {
    const source = normalizeLineEndings(await fs.readFile(sourceAbsPath, "utf8"));
    const ast = parse(source, {
        ...DEFAULT_PARSER_OPTIONS,
        sourceFilename: sourceAbsPath,
    });
    const lines = source.split("\n");
    const comments = ast.comments ?? [];
    const programBody = ast.program?.body ?? [];
    const moduleKey = getModuleKey(sourceRelPath);

    const { importEdges, importBindings, importSourceMap } = await collectImportMetadata({
        ast,
        sourceAbsPath,
        sourceRelPath,
        sourceModuleKey: moduleKey,
        rootDir,
    });
    const delegateEdges = collectDelegateEdges({
        ast,
        sourceRelPath,
        sourceModuleKey: moduleKey,
        importBindings,
        importSourceMap,
    });

    const baseItems = parseProgramExportItems(ast, sourceRelPath);
    const withDescriptions = attachDescriptionsAndSnippets(baseItems, lines, comments, sourceRelPath, snippetOptions);
    const items = await enrichReexportItems(withDescriptions, sourceAbsPath, rootDir, parseCache);
    const autoCount = items.filter((item) => item.autoGenerated).length;

    return {
        sourceFile: sourceRelPath,
        moduleKey,
        moduleTopComment: getTopModuleComment(programBody, comments, lines),
        items,
        autoCount,
        importEdges,
        delegateEdges,
    };
}

export async function listSourceFiles(rootDir, config) {
    const includeRoot = config.includeRoot ?? "src";
    const includeExtensions = new Set(config.includeExtensions ?? [".js"]);
    const excludePrefixes = (config.excludePrefixes ?? []).map((prefix) => toPosixPath(prefix));
    const includeRootAbs = path.resolve(rootDir, includeRoot);

    async function walk(dir, out) {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const abs = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                await walk(abs, out);
                continue;
            }
            if (!entry.isFile()) {
                continue;
            }
            const ext = path.extname(entry.name);
            if (!includeExtensions.has(ext)) {
                continue;
            }
            if (entry.name.endsWith(".d.ts")) {
                continue;
            }
            const rel = toPosixPath(path.relative(rootDir, abs));
            if (excludePrefixes.some((prefix) => rel.startsWith(prefix))) {
                continue;
            }
            out.push({
                absPath: abs,
                relPath: rel,
            });
        }
    }

    const files = [];
    await walk(includeRootAbs, files);
    files.sort((a, b) => a.relPath.localeCompare(b.relPath));
    return files;
}

function inferModuleRole(moduleKey) {
    if (moduleKey.includes("/controllers")) {
        return "控制器层，负责将宿主行为路由到具体功能模块。";
    }
    if (moduleKey.includes("/modules")) {
        return "功能实现层，按职责拆分核心能力并通过委托装配。";
    }
    if (moduleKey.includes("/shared")) {
        return "共享支撑层，提供默认配置与复用工具。";
    }
    if (moduleKey.includes("/entries")) {
        return "入口聚合层，对外暴露可消费的模块入口。";
    }
    if (moduleKey === "src") {
        return "核心顶层层，承载基础类型与总入口装配。";
    }
    return "模块化源码目录，承载同一子域下的实现。";
}

function formatCouplingList(couplings, fallbackText = "无显著内部耦合") {
    if (!couplings?.length) {
        return fallbackText;
    }
    return couplings.map((edge) => `\`${edge.module}\`(${edge.weight})`).join("、");
}

function collectMajorExports(fileDocs) {
    const counter = new Map();
    for (const fileDoc of fileDocs) {
        for (const item of fileDoc.items) {
            if (!item.exportedName || item.exportedName === "*") {
                continue;
            }
            counter.set(item.exportedName, (counter.get(item.exportedName) ?? 0) + 1);
        }
    }
    return Array.from(counter.entries())
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 6)
        .map(([name]) => name);
}

function pickModuleManualIntro(fileDocs) {
    const candidates = fileDocs
        .filter((fileDoc) => Boolean(fileDoc.moduleTopComment))
        .map((fileDoc) => {
            const baseName = path.posix.basename(fileDoc.sourceFile);
            let score = 0;
            if (baseName === "index.js") {
                score += 100;
            }
            if (baseName === "install-delegates.js") {
                score += 50;
            }
            score -= fileDoc.sourceFile.length * 0.001;
            return {
                sourceFile: fileDoc.sourceFile,
                comment: fileDoc.moduleTopComment,
                score,
            };
        });

    if (!candidates.length) {
        return null;
    }

    candidates.sort((a, b) => b.score - a.score || a.sourceFile.localeCompare(b.sourceFile));
    return candidates[0];
}

export function createAutoModuleIntro(moduleStat, options = {}) {
    const topLimit = Math.max(1, Number(options.topCouplingLimit ?? 3));
    const outgoingTop = moduleStat.outgoingTop.slice(0, topLimit);
    const incomingTop = moduleStat.incomingTop.slice(0, topLimit);
    const role = inferModuleRole(moduleStat.moduleKey);
    const majorExports = moduleStat.majorExports.length
        ? moduleStat.majorExports.map((name) => `\`${name}\``).join("、")
        : "当前以装配与结构性导出为主";
    const representativeFiles = moduleStat.files
        .slice(0, 3)
        .map((fileDoc) => `\`${path.posix.basename(fileDoc.sourceFile)}\``)
        .join("、");

    return [
        `[AUTO-MODULE] 模块 \`${moduleStat.moduleKey}\` 的职责为：${role}`,
        `规模：包含 ${moduleStat.fileCount} 个文件，导出 ${moduleStat.exportCount} 项（AUTO ${moduleStat.autoCount} 项），耦合强度 ${moduleStat.couplingStrength}。`,
        `关键耦合：出边 ${formatCouplingList(outgoingTop, "低耦合/未发现内部下游依赖")}；入边 ${formatCouplingList(incomingTop, "低耦合/未发现内部上游依赖")}。`,
        `主要导出：${majorExports}。`,
        `代表文件：${representativeFiles || "无"}。`,
    ].join("\n");
}

function aggregateCouplingMaps(modules, allEdges, topCouplingLimit) {
    const edgeMap = new Map();
    for (const edge of allEdges) {
        if (!edge?.fromModule || !edge?.toModule) {
            continue;
        }
        if (edge.fromModule === edge.toModule) {
            continue;
        }
        const key = `${edge.fromModule}=>${edge.toModule}`;
        if (!edgeMap.has(key)) {
            edgeMap.set(key, {
                fromModule: edge.fromModule,
                toModule: edge.toModule,
                weight: 0,
            });
        }
        edgeMap.get(key).weight += edge.weight ?? 1;
    }

    const outgoingMap = new Map();
    const incomingMap = new Map();
    for (const edge of edgeMap.values()) {
        if (!outgoingMap.has(edge.fromModule)) {
            outgoingMap.set(edge.fromModule, []);
        }
        if (!incomingMap.has(edge.toModule)) {
            incomingMap.set(edge.toModule, []);
        }
        outgoingMap.get(edge.fromModule).push({
            module: edge.toModule,
            weight: edge.weight,
        });
        incomingMap.get(edge.toModule).push({
            module: edge.fromModule,
            weight: edge.weight,
        });
    }

    for (const moduleStat of modules.values()) {
        const outgoing = outgoingMap.get(moduleStat.moduleKey) ?? [];
        const incoming = incomingMap.get(moduleStat.moduleKey) ?? [];

        outgoing.sort((a, b) => b.weight - a.weight || a.module.localeCompare(b.module));
        incoming.sort((a, b) => b.weight - a.weight || a.module.localeCompare(b.module));

        moduleStat.outgoingTop = outgoing.slice(0, topCouplingLimit);
        moduleStat.incomingTop = incoming.slice(0, topCouplingLimit);
        moduleStat.couplingStrength =
            outgoing.reduce((sum, edge) => sum + edge.weight, 0)
            + incoming.reduce((sum, edge) => sum + edge.weight, 0);
    }
}

export function buildModuleStats(fileDocs, importEdges = [], delegateEdges = [], options = {}) {
    const topCouplingLimit = Math.max(1, Number(options.topCouplingLimit ?? 3));
    const modules = new Map();

    for (const fileDoc of fileDocs) {
        const moduleKey = fileDoc.moduleKey ?? getModuleKey(fileDoc.sourceFile);
        if (!modules.has(moduleKey)) {
            modules.set(moduleKey, {
                moduleKey,
                files: [],
                fileCount: 0,
                exportCount: 0,
                autoCount: 0,
                majorExports: [],
                outgoingTop: [],
                incomingTop: [],
                couplingStrength: 0,
                introText: "",
                introSource: "auto-module",
                introCommentSourceFile: null,
                docLink: null,
            });
        }

        const moduleStat = modules.get(moduleKey);
        moduleStat.files.push(fileDoc);
        moduleStat.fileCount += 1;
        moduleStat.exportCount += fileDoc.items.length;
        moduleStat.autoCount += fileDoc.autoCount;
    }

    const allImportEdges = importEdges.length
        ? importEdges
        : fileDocs.flatMap((fileDoc) => fileDoc.importEdges ?? []);
    const allDelegateEdges = delegateEdges.length
        ? delegateEdges
        : fileDocs.flatMap((fileDoc) => fileDoc.delegateEdges ?? []);
    aggregateCouplingMaps(modules, [...allImportEdges, ...allDelegateEdges], topCouplingLimit);

    for (const moduleStat of modules.values()) {
        moduleStat.files.sort((a, b) => a.sourceFile.localeCompare(b.sourceFile));
        moduleStat.majorExports = collectMajorExports(moduleStat.files);
        moduleStat.docLink = moduleStat.files[0]?.docPath ?? null;

        const manualIntro = pickModuleManualIntro(moduleStat.files);
        if (manualIntro?.comment) {
            moduleStat.introSource = "comment";
            moduleStat.introText = manualIntro.comment;
            moduleStat.introCommentSourceFile = manualIntro.sourceFile;
        } else {
            moduleStat.introSource = "auto-module";
            moduleStat.introText = createAutoModuleIntro(moduleStat, options);
            moduleStat.introCommentSourceFile = null;
        }
    }

    return Array.from(modules.values()).sort((a, b) => a.moduleKey.localeCompare(b.moduleKey));
}

function renderDescriptionBlock(text) {
    const lines = text.split("\n");
    return lines.map((line) => `> ${line}`).join("\n");
}

function renderFileMarkdown(fileDoc, moduleStat, moduleIntroOptions) {
    const lines = [];
    lines.push(`# 文件文档：\`${fileDoc.sourceFile}\``);
    lines.push("");

    if (moduleIntroOptions?.enabled && moduleStat) {
        lines.push("## 所属模块介绍");
        lines.push("");
        lines.push(`- 模块：\`${moduleStat.moduleKey}\``);
        lines.push(`- 介绍来源：${moduleStat.introSource === "comment" ? "模块顶部注释" : "[AUTO-MODULE] 自动生成"}`);
        if (moduleStat.introCommentSourceFile) {
            lines.push(`- 注释来源文件：\`${moduleStat.introCommentSourceFile}\``);
        }
        lines.push("- 介绍：");
        lines.push(renderDescriptionBlock(moduleStat.introText));
        lines.push("");
    }

    lines.push(`- 导出项数量：${fileDoc.items.length}`);
    lines.push(`- AUTO 说明数量：${fileDoc.autoCount}`);
    lines.push("");

    fileDoc.items.forEach((item, index) => {
        lines.push(`## ${index + 1}. \`${item.exportedName}\``);
        lines.push("");
        lines.push(`- 类型：\`${item.kind}\``);
        lines.push(`- 位置：\`${item.location}\` (\`${item.anchor}\`)`);
        if (item.reexport?.source) {
            lines.push(`- 转发来源：\`${item.reexport.source}\``);
        }
        if (item.reexport?.targetFile) {
            const targetRange = item.reexport.targetStartLine
                ? `${item.reexport.targetStartLine}-${item.reexport.targetEndLine}`
                : "未定位";
            lines.push(`- 目标文件：\`${item.reexport.targetFile}\` (${targetRange})`);
        }
        if (typeof item.reexport?.resolvableCount === "number") {
            lines.push(`- 可解析导出数量：${item.reexport.resolvableCount}`);
        }
        lines.push(`- 说明来源：${item.descriptionSource === "comment" ? "源码注释" : "[AUTO] 自动回退"}`);
        lines.push("- 说明：");
        lines.push(renderDescriptionBlock(item.description));
        lines.push("");
        lines.push(`- 代码片段（L${item.snippetStartLine}-L${item.snippetEndLine}）：`);
        lines.push("```js");
        lines.push(item.snippet);
        lines.push("```");
        if (item.snippetTruncated) {
            lines.push("");
            lines.push("> 片段已按最大行数裁剪。");
        }
        lines.push("");
    });

    return `${lines.join("\n").trimEnd()}\n`;
}

function renderModuleOverview(lines, moduleStats) {
    lines.push("## 模块总览");
    lines.push("");
    lines.push("| 模块 | 文件数 | 导出数 | AUTO | 主要耦合 | 文档链接 |");
    lines.push("| --- | ---: | ---: | ---: | --- | --- |");
    for (const moduleStat of moduleStats) {
        const outCoupling = formatCouplingList(moduleStat.outgoingTop, "低耦合");
        const inCoupling = formatCouplingList(moduleStat.incomingTop, "低耦合");
        const couplingSummary = `出: ${outCoupling}；入: ${inCoupling}`;
        const docLink = moduleStat.docLink ? `[首文件](./${moduleStat.docLink})` : "-";
        lines.push(`| \`${moduleStat.moduleKey}\` | ${moduleStat.fileCount} | ${moduleStat.exportCount} | ${moduleStat.autoCount} | ${couplingSummary} | ${docLink} |`);
    }
    lines.push("");
    lines.push("### 模块介绍详情");
    lines.push("");
    for (const moduleStat of moduleStats) {
        lines.push(`#### \`${moduleStat.moduleKey}\``);
        lines.push("");
        lines.push(`- 来源：${moduleStat.introSource === "comment" ? "模块顶部注释" : "[AUTO-MODULE] 自动生成"}`);
        if (moduleStat.introCommentSourceFile) {
            lines.push(`- 注释文件：\`${moduleStat.introCommentSourceFile}\``);
        }
        lines.push("- 介绍：");
        lines.push(renderDescriptionBlock(moduleStat.introText));
        lines.push("");
    }
}

function renderIndexMarkdown(fileDocs, moduleStats, moduleIntroOptions) {
    const totalExports = fileDocs.reduce((sum, fileDoc) => sum + fileDoc.items.length, 0);
    const totalAuto = fileDocs.reduce((sum, fileDoc) => sum + fileDoc.autoCount, 0);
    const grouped = new Map();

    for (const fileDoc of fileDocs) {
        const dir = toPosixPath(path.posix.dirname(fileDoc.sourceFile));
        if (!grouped.has(dir)) {
            grouped.set(dir, []);
        }
        grouped.get(dir).push(fileDoc);
    }

    const lines = [];
    lines.push("# LiteGraph Markdown 文档索引");
    lines.push("");
    lines.push(`- 覆盖文件数：${fileDocs.length}`);
    lines.push(`- 导出项总数：${totalExports}`);
    lines.push(`- AUTO 说明总数：${totalAuto}`);
    lines.push("");

    if (moduleIntroOptions?.enabled) {
        renderModuleOverview(lines, moduleStats);
    }

    const groupNames = Array.from(grouped.keys()).sort((a, b) => a.localeCompare(b));
    for (const groupName of groupNames) {
        lines.push(`## ${groupName}`);
        lines.push("");
        lines.push("| 源文件 | 文档 | 导出项 | AUTO |");
        lines.push("| --- | --- | ---: | ---: |");
        const docs = grouped.get(groupName).sort((a, b) => a.sourceFile.localeCompare(b.sourceFile));
        for (const doc of docs) {
            lines.push(`| \`${doc.sourceFile}\` | [查看](./${doc.docPath}) | ${doc.items.length} | ${doc.autoCount} |`);
        }
        lines.push("");
    }

    return `${lines.join("\n").trimEnd()}\n`;
}

function makeDocPath(config, sourceRelPath) {
    const fileDocsDir = config.fileDocsDir ?? "files";
    const markdownRel = sourceRelPath.replace(/\.js$/i, ".md");
    return toPosixPath(path.posix.join(fileDocsDir, markdownRel));
}

function mapFromEntries(entries) {
    const mapped = new Map();
    for (const [key, value] of entries) {
        mapped.set(toPosixPath(key), normalizeLineEndings(value));
    }
    return mapped;
}

export async function generateDocumentationOutputs(rootDir, config) {
    const parseCache = new Map();
    const files = await listSourceFiles(rootDir, config);
    const fileDocs = [];
    const outputs = new Map();
    const moduleIntroOptions = {
        enabled: config.moduleIntro?.enabled !== false,
        topCouplingLimit: Math.max(1, Number(config.moduleIntro?.topCouplingLimit ?? 3)),
    };

    for (const file of files) {
        const fileDoc = await extractFileDocumentation({
            sourceAbsPath: file.absPath,
            sourceRelPath: file.relPath,
            rootDir,
            snippetOptions: config.snippet,
            parseCache,
        });
        fileDoc.docPath = makeDocPath(config, file.relPath);
        fileDocs.push(fileDoc);
    }

    fileDocs.sort((a, b) => a.sourceFile.localeCompare(b.sourceFile));
    const importEdges = fileDocs.flatMap((fileDoc) => fileDoc.importEdges ?? []);
    const delegateEdges = fileDocs.flatMap((fileDoc) => fileDoc.delegateEdges ?? []);
    const moduleStats = buildModuleStats(fileDocs, importEdges, delegateEdges, moduleIntroOptions);
    const moduleStatsMap = new Map(moduleStats.map((moduleStat) => [moduleStat.moduleKey, moduleStat]));

    for (const fileDoc of fileDocs) {
        outputs.set(
            fileDoc.docPath,
            renderFileMarkdown(fileDoc, moduleStatsMap.get(fileDoc.moduleKey), moduleIntroOptions),
        );
    }

    outputs.set("index.md", renderIndexMarkdown(fileDocs, moduleStats, moduleIntroOptions));

    return {
        outputs: mapFromEntries(outputs),
        fileDocs,
        moduleStats,
        summary: {
            fileCount: fileDocs.length,
            exportCount: fileDocs.reduce((sum, fileDoc) => sum + fileDoc.items.length, 0),
            autoCount: fileDocs.reduce((sum, fileDoc) => sum + fileDoc.autoCount, 0),
        },
    };
}

async function readFilesRecursive(dir, out = []) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
        const abs = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            await readFilesRecursive(abs, out);
            continue;
        }
        if (entry.isFile()) {
            out.push(abs);
        }
    }
    return out;
}

export async function readExistingOutputs(rootDir, config) {
    const outputDirAbs = path.resolve(rootDir, config.outputDir ?? "docs");
    const keepSet = new Set((config.cleanKeep ?? []).map((entry) => toPosixPath(entry)));
    const isKept = (relPath) => {
        for (const keep of keepSet) {
            if (relPath === keep || relPath.startsWith(`${keep}/`)) {
                return true;
            }
        }
        return false;
    };
    const outputs = new Map();

    try {
        const stats = await fs.stat(outputDirAbs);
        if (!stats.isDirectory()) {
            return outputs;
        }
    } catch {
        return outputs;
    }

    const files = await readFilesRecursive(outputDirAbs);
    for (const filePath of files) {
        const relToOutput = toPosixPath(path.relative(outputDirAbs, filePath));
        if (isKept(relToOutput)) {
            continue;
        }
        const content = normalizeLineEndings(await fs.readFile(filePath, "utf8"));
        outputs.set(relToOutput, content);
    }

    return outputs;
}

export function compareOutputMaps(expectedMap, actualMap) {
    const expectedKeys = Array.from(expectedMap.keys()).sort();
    const actualKeys = Array.from(actualMap.keys()).sort();

    const missing = expectedKeys.filter((key) => !actualMap.has(key));
    const extra = actualKeys.filter((key) => !expectedMap.has(key));
    const changed = expectedKeys.filter((key) => actualMap.has(key) && expectedMap.get(key) !== actualMap.get(key));

    return {
        missing,
        extra,
        changed,
        hasDiff: missing.length > 0 || extra.length > 0 || changed.length > 0,
    };
}

export async function cleanOutputDirectory(rootDir, config) {
    const outputDirAbs = path.resolve(rootDir, config.outputDir ?? "docs");
    const keepSet = new Set((config.cleanKeep ?? []).map((entry) => toPosixPath(entry)));
    const isKept = (relPath) => {
        for (const keep of keepSet) {
            if (relPath === keep || relPath.startsWith(`${keep}/`)) {
                return true;
            }
        }
        return false;
    };

    await fs.mkdir(outputDirAbs, { recursive: true });
    const entries = await fs.readdir(outputDirAbs, { withFileTypes: true });
    for (const entry of entries) {
        const rel = toPosixPath(entry.name);
        if (isKept(rel)) {
            continue;
        }
        const abs = path.join(outputDirAbs, entry.name);
        await fs.rm(abs, { recursive: true, force: true });
    }
}

export async function writeOutputMap(rootDir, config, outputs) {
    const outputDirAbs = path.resolve(rootDir, config.outputDir ?? "docs");
    for (const [relPath, content] of outputs.entries()) {
        const absPath = path.join(outputDirAbs, relPath);
        await fs.mkdir(path.dirname(absPath), { recursive: true });
        await fs.writeFile(absPath, content, "utf8");
    }
}

export async function loadConfig(rootDir, configPath) {
    if (!configPath) {
        const defaultPath = path.resolve(rootDir, "scripts/docs/docgen.config.mjs");
        const module = await import(pathToFileURL(defaultPath).href);
        return module.default;
    }

    const absPath = path.resolve(rootDir, configPath);
    const module = await import(pathToFileURL(absPath).href);
    return module.default;
}
