import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");
const sharedDemoEditorDir = path.join(repoRoot, "server", "shared", "editor");

const serverNodesManifest = Object.freeze({
    version: 1,
    backend: "js",
    displayName: "JavaScript",
    expectedNodeTypes: [
        "server_demo/counter",
        "server_demo/scale",
    ],
    modules: [
        "/api/editor/server-nodes/modules/server-demo-nodes.js",
    ],
    graphUrl: "/api/editor/server-nodes/graphs/server-demo.json",
});

app.use(
    "/api/editor/server-nodes/modules",
    express.static(path.join(__dirname, "examples", "nodes")),
);
app.use(
    "/api/editor/server-nodes/graphs",
    express.static(path.join(__dirname, "examples", "graphs")),
);
app.get("/api/editor/server-nodes/manifest", (_req, res) => {
    res.json(serverNodesManifest);
});
app.get("/editor/server_nodes_from_server.html", (_req, res) => {
    res.sendFile(path.join(sharedDemoEditorDir, "server_nodes_from_server.html"));
});
app.get("/editor/js/server_nodes_from_server.js", (_req, res) => {
    res.sendFile(path.join(sharedDemoEditorDir, "js", "server_nodes_from_server.js"));
});

app.use("/css", express.static(path.join(repoRoot, "css")));
app.use("/src", express.static(path.join(repoRoot, "src")));
app.use("/build", express.static(path.join(repoRoot, "build")));
app.use("/external", express.static(path.join(repoRoot, "external")));
app.use("/editor", express.static(path.join(repoRoot, "editor")));
app.use("/", express.static(path.join(repoRoot, "editor")));

const port = Number(process.env.PORT) || 8000;
app.listen(port, () => {
    console.log(`Example app listening on http://127.0.0.1:${port}`);
});
