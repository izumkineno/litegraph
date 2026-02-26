import { readFileSync } from "node:fs";
import path from "node:path";

const phaseThresholds = {
    1: { statements: 5, branches: 2.5, functions: 4, lines: 5 },
    2: { statements: 35, branches: 22, functions: 30, lines: 35 },
    3: { statements: 70, branches: 55, functions: 62, lines: 70 },
    4: { statements: 90, branches: 80, functions: 85, lines: 90 },
};

function parseArgs(argv) {
    const args = {};
    argv.forEach((arg) => {
        if (!arg.startsWith("--")) {
            return;
        }
        const [key, value] = arg.slice(2).split("=");
        args[key] = value ?? true;
    });
    return args;
}

function toPct(metric) {
    if (!metric || metric.pct === "Unknown" || metric.pct == null) {
        return 0;
    }
    return Number(metric.pct);
}

const args = parseArgs(process.argv.slice(2));
const phase = Number(args.phase ?? process.env.COVERAGE_PHASE ?? 1);
const summaryPath = args.summary ?? "coverage/coverage-summary.json";
const scope = args.scope ?? "total";

if (!phaseThresholds[phase]) {
    console.error(`[coverage] unsupported phase '${phase}'. expected one of: ${Object.keys(phaseThresholds).join(", ")}`);
    process.exit(2);
}

let summary;
try {
    const raw = readFileSync(summaryPath, "utf8");
    summary = JSON.parse(raw);
} catch (error) {
    console.error(`[coverage] failed to read summary at ${path.resolve(summaryPath)}`);
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(2);
}

const metrics = summary[scope];
if (!metrics) {
    console.error(`[coverage] scope '${scope}' not found in ${summaryPath}`);
    process.exit(2);
}

const thresholds = phaseThresholds[phase];
const current = {
    statements: toPct(metrics.statements),
    branches: toPct(metrics.branches),
    functions: toPct(metrics.functions),
    lines: toPct(metrics.lines),
};

const failures = Object.keys(thresholds).filter((name) => current[name] < thresholds[name]);

console.log(`[coverage] scope=${scope} phase=${phase}`);
console.log(`[coverage] current: statements=${current.statements.toFixed(2)} branches=${current.branches.toFixed(2)} functions=${current.functions.toFixed(2)} lines=${current.lines.toFixed(2)}`);
console.log(`[coverage] target : statements=${thresholds.statements.toFixed(2)} branches=${thresholds.branches.toFixed(2)} functions=${thresholds.functions.toFixed(2)} lines=${thresholds.lines.toFixed(2)}`);

if (failures.length > 0) {
    console.error(`[coverage] failed metrics: ${failures.join(", ")}`);
    process.exit(1);
}

console.log("[coverage] thresholds satisfied");
