import { LiteGraph } from "../../../src/litegraph.js";
import { Editor } from "../../../src/litegraph-editor.js";

const API_VERSION = "v1";
const MANIFEST_URL = `/api/${API_VERSION}/editor/server-nodes/manifest`;
const MODULES_PREFIX = `/api/${API_VERSION}/editor/server-nodes/modules/`;
const GRAPHS_PREFIX = `/api/${API_VERSION}/editor/server-nodes/graphs/`;
const GRAPH_LOAD_TIMEOUT_MS = 6000;

const statusListElement = document.getElementById("server-demo-status-list");
const titleElement = document.getElementById("server-demo-title");
const reloadButton = document.getElementById("reload-server-nodes");

const editor = new Editor("main", { miniwindow: false });
window.graph = editor.graph;
window.graphcanvas = editor.graphcanvas;

function addStatus(message, kind = "info") {
    const item = document.createElement("li");
    item.className = `server-demo-status-item ${kind}`;
    item.textContent = message;
    if (kind === "error") {
        item.setAttribute("role", "alert");
    }
    statusListElement.appendChild(item);
}

function clearStatus() {
    statusListElement.innerHTML = "";
}

function setTitle(name) {
    if (titleElement) {
        titleElement.textContent = `${name} Server Nodes Loader`;
    }
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

function validateManifestEnvelope(payload) {
    if (!payload || typeof payload !== "object") {
        throw new Error("Manifest response must be a JSON object");
    }

    const { data, meta } = payload;
    if (!data || typeof data !== "object") {
        throw new Error("Manifest response missing data object");
    }
    if (!meta || typeof meta !== "object") {
        throw new Error("Manifest response missing meta object");
    }
    if (meta.apiVersion !== API_VERSION) {
        throw new Error(`Unsupported API version: ${meta.apiVersion}`);
    }

    if (!Array.isArray(data.modules) || data.modules.some((moduleUrl) => typeof moduleUrl !== "string")) {
        throw new Error("Manifest modules must be a string array");
    }

    const modules = data.modules.map((moduleUrl, index) => {
        return validatePathUrl(moduleUrl, MODULES_PREFIX, `modules[${index}]`);
    });
    const graphUrl = validatePathUrl(data.graphUrl, GRAPHS_PREFIX, "graphUrl");
    const displayName = typeof data.displayName === "string" && data.displayName.length > 0
        ? data.displayName
        : "Unknown";
    const backend = typeof data.backend === "string" && data.backend.length > 0
        ? data.backend
        : "unknown";
    const expectedNodeTypes = data.expectedNodeTypes == null
        ? []
        : data.expectedNodeTypes;

    if (!Array.isArray(expectedNodeTypes) || expectedNodeTypes.some((type) => typeof type !== "string")) {
        throw new Error("Manifest expectedNodeTypes must be a string array when provided");
    }

    return {
        version: data.version,
        backend,
        displayName,
        expectedNodeTypes,
        modules,
        graphUrl,
        schema: typeof meta.schema === "string" ? meta.schema : "unknown",
    };
}

async function parseApiError(response) {
    const fallbackMessage = `Request failed (${response.status})`;
    try {
        const payload = await response.json();
        const apiError = payload?.error;
        if (!apiError || typeof apiError !== "object") {
            return {
                message: fallbackMessage,
            };
        }
        const code = typeof apiError.code === "string" ? apiError.code : "ERROR";
        const message = typeof apiError.message === "string" ? apiError.message : fallbackMessage;
        const recovery = typeof apiError.recovery === "string" ? apiError.recovery : null;
        return {
            message: `[${code}] ${message}`,
            recovery,
        };
    } catch {
        return {
            message: fallbackMessage,
        };
    }
}

async function fetchManifest() {
    const response = await fetch(MANIFEST_URL, {
        headers: {
            Accept: "application/json",
        },
    });

    if (!response.ok) {
        const apiError = await parseApiError(response);
        const error = new Error(apiError.message);
        if (apiError.recovery) {
            error.recovery = apiError.recovery;
        }
        throw error;
    }

    return response.json();
}

async function loadModules(modules) {
    for (const moduleUrl of modules) {
        await import(moduleUrl);
        addStatus(`Module loaded: ${moduleUrl}`, "success");
    }
}

function ensureExpectedNodeTypes(expectedNodeTypes) {
    if (!expectedNodeTypes.length) {
        return;
    }
    const missing = expectedNodeTypes.filter((type) => !LiteGraph.registered_node_types[type]);
    if (missing.length) {
        throw new Error(`Expected node types were not registered: ${missing.join(", ")}`);
    }
    addStatus(`Node registration verified: ${expectedNodeTypes.join(", ")}`, "success");
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
        const manifest = validateManifestEnvelope(await fetchManifest());
        setTitle(manifest.displayName);
        addStatus(`Backend detected: ${manifest.backend}`, "success");
        addStatus(`Manifest schema: ${manifest.schema}`, "success");
        addStatus("Manifest fetched successfully", "success");

        await loadModules(manifest.modules);
        ensureExpectedNodeTypes(manifest.expectedNodeTypes);

        editor.graph.stop();
        editor.graph.clear();
        await loadGraph(manifest.graphUrl);
        addStatus("Graph loaded successfully", "success");

        editor.graph.start();
        addStatus("Graph started; basic/watch output should now update", "success");
    } catch (error) {
        addStatus(`Load failed: ${error.message}`, "error");
        if (error.recovery) {
            addStatus(`Recovery: ${error.recovery}`, "error");
        }
        LiteGraph.error?.(error);
    }
}

reloadButton?.addEventListener("click", () => {
    reloadFromServer();
});

reloadFromServer();
