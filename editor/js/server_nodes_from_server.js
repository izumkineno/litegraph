import { LiteGraph } from "../../src/litegraph.js";
import { Editor } from "../../src/litegraph-editor.js";

const MANIFEST_URL = "/api/editor/server-nodes/manifest";
const MODULES_PREFIX = "/api/editor/server-nodes/modules/";
const GRAPHS_PREFIX = "/api/editor/server-nodes/graphs/";
const GRAPH_LOAD_TIMEOUT_MS = 6000;

const statusListElement = document.getElementById("server-demo-status-list");
const reloadButton = document.getElementById("reload-server-nodes");

const editor = new Editor("main", { miniwindow: false });
window.graph = editor.graph;
window.graphcanvas = editor.graphcanvas;

function addStatus(message, kind = "info") {
    const item = document.createElement("li");
    item.className = `server-demo-status-item ${kind}`;
    item.textContent = message;
    statusListElement.appendChild(item);
}

function clearStatus() {
    statusListElement.innerHTML = "";
}

function validatePathUrl(value, prefix, fieldName) {
    if (typeof value !== "string" || value.length === 0) {
        throw new Error(`${fieldName} must be a non-empty string`);
    }
    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("//")) {
        throw new Error(`${fieldName} must be same-origin path`);
    }
    if (!value.startsWith(prefix)) {
        throw new Error(`${fieldName} must start with ${prefix}`);
    }
    if (value.includes("..")) {
        throw new Error(`${fieldName} must not contain ..`);
    }
    return value;
}

function validateManifest(manifest) {
    if (!manifest || typeof manifest !== "object") {
        throw new Error("Manifest must be a JSON object");
    }
    if (!Array.isArray(manifest.modules) || manifest.modules.some((moduleUrl) => typeof moduleUrl !== "string")) {
        throw new Error("Manifest modules must be a string array");
    }

    const modules = manifest.modules.map((moduleUrl, index) => {
        return validatePathUrl(moduleUrl, MODULES_PREFIX, `modules[${index}]`);
    });
    const graphUrl = validatePathUrl(manifest.graphUrl, GRAPHS_PREFIX, "graphUrl");

    return {
        version: manifest.version,
        modules,
        graphUrl,
    };
}

async function fetchManifest() {
    const response = await fetch(MANIFEST_URL, {
        headers: {
            Accept: "application/json",
        },
    });
    if (!response.ok) {
        throw new Error(`Failed to fetch manifest (${response.status})`);
    }
    return response.json();
}

async function loadModules(modules) {
    for (const moduleUrl of modules) {
        await import(moduleUrl);
        addStatus(`Module loaded: ${moduleUrl}`, "success");
    }
}

function loadGraph(graphUrl) {
    return new Promise((resolve, reject) => {
        let finished = false;
        const timeoutId = setTimeout(() => {
            if (finished) {
                return;
            }
            finished = true;
            reject(new Error(`Graph load timed out: ${graphUrl}`));
        }, GRAPH_LOAD_TIMEOUT_MS);

        try {
            editor.graph.load(graphUrl, () => {
                if (finished) {
                    return;
                }
                finished = true;
                clearTimeout(timeoutId);
                resolve();
            });
        } catch (error) {
            finished = true;
            clearTimeout(timeoutId);
            reject(error);
        }
    });
}

async function reloadFromServer() {
    clearStatus();
    addStatus("Starting server-side node loading...");

    try {
        const manifest = validateManifest(await fetchManifest());
        addStatus("Manifest fetched successfully", "success");

        await loadModules(manifest.modules);

        editor.graph.stop();
        editor.graph.clear();
        await loadGraph(manifest.graphUrl);
        addStatus("Graph loaded successfully", "success");

        editor.graph.start();
        addStatus("Graph started; basic/watch output should now update", "success");
    } catch (error) {
        addStatus(`Load failed: ${error.message}`, "error");
        LiteGraph.error?.(error);
    }
}

reloadButton?.addEventListener("click", () => {
    reloadFromServer();
});

reloadFromServer();
