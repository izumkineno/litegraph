const testRuntime = typeof globalThis.Bun !== "undefined"
    ? await import("bun:test")
    : await import("@jest/globals");

const { describe, test, expect } = testRuntime;
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");

describe("platform smoke: gl nodes", () => {
    test("gl modules exist and preserve key registrations", () => {
        const textures = readFileSync(path.join(root, "src/nodes/gltextures.js"), "utf8");
        const shaders = readFileSync(path.join(root, "src/nodes/glshaders.js"), "utf8");
        const geometry = readFileSync(path.join(root, "src/nodes/geometry.js"), "utf8");
        const gfx = readFileSync(path.join(root, "src/nodes/glfx.js"), "utf8");

        expect(textures).toContain("LiteGraph.registerNodeType(\"texture/texture\"");
        expect(shaders).toContain("LiteGraph.registerNodeType(\"texture/shaderGraph\"");
        expect(geometry).toContain("LiteGraph.registerNodeType(\"geometry/points3D\"");
        expect(gfx).toContain("LiteGraph.registerNodeType(\"fx/lens\"");
    });
});
