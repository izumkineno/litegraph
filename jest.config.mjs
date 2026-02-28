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
    extensionsToTreatAsEsm: [".ts"],
    transform: {
        "^.+\\.ts$": [
            "ts-jest",
            {
                useESM: true,
                tsconfig: "tsconfig.test.json",
            },
        ],
    },
    testPathIgnorePatterns: [
        "/node_modules/",
        "<rootDir>/test/ui/.*leafer.*\\.test\\.js$",
        "<rootDir>/test/ui/render-components.*\\.test\\.js$",
        "<rootDir>/test/ui/render-parity.*\\.test\\.js$",
    ],
    collectCoverageFrom: ["src/**/*.js", "src/**/*.ts", ...hardScopeExcludes],
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "<rootDir>/build/",
        "<rootDir>/docs/",
        "<rootDir>/server/",
    ],
    coverageDirectory: "coverage",
    coverageReporters: ["text-summary", "json-summary", "lcov", "json"],
};
