export default {
    includeRoot: "src",
    includeExtensions: [".js", ".ts"],
    excludePrefixes: ["src/nodes/"],
    outputDir: "docs",
    fileDocsDir: "files",
    cleanKeep: [".jsdoc.config", "rendering"],
    snippet: {
        minLines: 6,
        maxLines: 20,
    },
    moduleIntro: {
        enabled: true,
        topCouplingLimit: 3,
    },
};
