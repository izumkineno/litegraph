const softScopeFiles = [
    "src/nodes/audio.js",
    "src/nodes/midi.js",
    "src/nodes/glfx.js",
    "src/nodes/glshaders.js",
    "src/nodes/gltextures.js",
    "src/nodes/geometry.js",
];

export default {
    testEnvironment: "node",
    workerThreads: true,
    collectCoverageFrom: softScopeFiles,
    coveragePathIgnorePatterns: ["/node_modules/"],
    coverageDirectory: "coverage/soft",
    coverageReporters: ["text-summary", "json-summary", "lcov", "json"],
};
