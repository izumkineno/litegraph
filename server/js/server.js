import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();

const API_VERSION = "v1";
const API_PREFIX = `/api/${API_VERSION}`;
const SERVER_NODES_PREFIX = `${API_PREFIX}/editor/server-nodes`;
const MODULES_PREFIX = `${SERVER_NODES_PREFIX}/modules`;
const GRAPHS_PREFIX = `${SERVER_NODES_PREFIX}/graphs`;
const BACKEND = "js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");
const sharedDemoEditorDir = path.join(repoRoot, "server", "shared", "editor");
const serverNodesModulesDir = path.join(__dirname, "examples", "nodes");
const serverNodesGraphsDir = path.join(__dirname, "examples", "graphs");

const serverNodesManifestData = Object.freeze({
    version: 1,
    backend: BACKEND,
    displayName: "JavaScript",
    expectedNodeTypes: [
        "server_demo/counter",
        "server_demo/scale",
    ],
    modules: [
        `${MODULES_PREFIX}/server-demo-nodes.js`,
    ],
    graphUrl: `${GRAPHS_PREFIX}/server-demo.json`,
});

const serverNodesManifest = Object.freeze({
    data: serverNodesManifestData,
    meta: Object.freeze({
        apiVersion: API_VERSION,
        schema: "server-nodes-manifest",
        backend: BACKEND,
    }),
});

function sendApiError(res, status, code, message, recovery, requestPath) {
    res.status(status).json({
        error: {
            code,
            message,
            recovery,
            details: {
                path: requestPath,
            },
        },
        meta: {
            apiVersion: API_VERSION,
            backend: BACKEND,
        },
    });
}

function resolveApiFilePath(baseDir, relativePath) {
    if (!relativePath || typeof relativePath !== "string") {
        return {
            kind: "not_found",
        };
    }

    if (
        relativePath.startsWith("/")
        || relativePath.includes("\\")
        || relativePath.split("/").includes("..")
    ) {
        return {
            kind: "invalid_path",
        };
    }

    const normalizedBaseDir = path.resolve(baseDir);
    const normalizedFilePath = path.resolve(baseDir, relativePath);
    if (
        normalizedFilePath !== normalizedBaseDir
        && !normalizedFilePath.startsWith(`${normalizedBaseDir}${path.sep}`)
    ) {
        return {
            kind: "invalid_path",
        };
    }

    return {
        kind: "ok",
        normalizedFilePath,
    };
}

async function sendApiStaticFile(res, requestPath, baseDir, relativePath, contentType) {
    const resolved = resolveApiFilePath(baseDir, relativePath);
    if (resolved.kind === "invalid_path") {
        sendApiError(
            res,
            400,
            "INVALID_PATH",
            "Requested file path is invalid",
            "Use a relative file path within the allowed API resource directory.",
            requestPath,
        );
        return;
    }
    if (resolved.kind === "not_found") {
        sendApiError(
            res,
            404,
            "NOT_FOUND",
            "Requested file was not found",
            "Check the manifest and ensure the requested file exists.",
            requestPath,
        );
        return;
    }

    try {
        const stat = await fs.stat(resolved.normalizedFilePath);
        if (!stat.isFile()) {
            sendApiError(
                res,
                404,
                "NOT_FOUND",
                "Requested file was not found",
                "Check the manifest and ensure the requested file exists.",
                requestPath,
            );
            return;
        }
    } catch (error) {
        if (error.code === "ENOENT") {
            sendApiError(
                res,
                404,
                "NOT_FOUND",
                "Requested file was not found",
                "Check the manifest and ensure the requested file exists.",
                requestPath,
            );
            return;
        }

        sendApiError(
            res,
            500,
            "INTERNAL_ERROR",
            "Failed to access requested file",
            "Retry the request and check server logs if the issue persists.",
            requestPath,
        );
        return;
    }

    try {
        const content = await fs.readFile(resolved.normalizedFilePath);
        res.status(200).set("Content-Type", contentType).send(content);
    } catch {
        sendApiError(
            res,
            500,
            "INTERNAL_ERROR",
            "Failed to read requested file",
            "Retry the request and check server logs if the issue persists.",
            requestPath,
        );
    }
}

app.get(`${SERVER_NODES_PREFIX}/manifest`, (_req, res) => {
    res.json(serverNodesManifest);
});

app.get(/^\/api\/v1\/editor\/server-nodes\/modules\/(.+)$/, async (req, res) => {
    const relativePath = req.params[0];
    await sendApiStaticFile(
        res,
        req.path,
        serverNodesModulesDir,
        relativePath,
        "text/javascript; charset=utf-8",
    );
});

app.get(/^\/api\/v1\/editor\/server-nodes\/graphs\/(.+)$/, async (req, res) => {
    const relativePath = req.params[0];
    await sendApiStaticFile(
        res,
        req.path,
        serverNodesGraphsDir,
        relativePath,
        "application/json; charset=utf-8",
    );
});

app.get("/editor/server_nodes_from_server.html", (_req, res) => {
    res.sendFile(path.join(sharedDemoEditorDir, "server_nodes_from_server.html"));
});

app.get("/editor/js/server_nodes_from_server.js", (_req, res) => {
    res.sendFile(path.join(sharedDemoEditorDir, "js", "server_nodes_from_server.js"));
});

app.use(/^\/api\/v1(?:\/.*)?$/, (req, res) => {
    if (req.method !== "GET") {
        sendApiError(
            res,
            405,
            "METHOD_NOT_ALLOWED",
            "Only GET is supported for this API",
            "Use GET for API reads, or update the server if write operations are needed.",
            req.path,
        );
        return;
    }

    sendApiError(
        res,
        404,
        "NOT_FOUND",
        "Requested API endpoint was not found",
        "Check the API path and migrate to /api/v1/editor/server-nodes/* endpoints.",
        req.path,
    );
});

app.use("/css", express.static(path.join(repoRoot, "css")));
app.use("/src", express.static(path.join(repoRoot, "src")));
app.use("/build", express.static(path.join(repoRoot, "build")));
app.use("/editor", express.static(path.join(repoRoot, "editor")));
app.use("/", express.static(path.join(repoRoot, "editor")));

const port = Number(process.env.PORT) || 8000;
app.listen(port, () => {
    console.log(`Example app listening on http://127.0.0.1:${port}`);
});
