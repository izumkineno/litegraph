const hardScopeExcludes = [
    "!src/entries/**",
    "!src/nodes/audio.js",
    "!src/nodes/midi.js",
    "!src/nodes/glfx.js",
    "!src/nodes/glshaders.js",
    "!src/nodes/gltextures.js",
    "!src/nodes/geometry.js",
];

export default {
    testEnvironment: "node",
    workerThreads: true,
    collectCoverageFrom: ["src/**/*.js", ...hardScopeExcludes],
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "<rootDir>/build/",
        "<rootDir>/docs/",
        "<rootDir>/server/",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text-summary", "json-summary", "lcov", "json"],
};
