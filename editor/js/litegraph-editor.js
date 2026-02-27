import { LGraphCanvas, LGraph, LiteGraph } from "../../build/litegraph.core.js";

const RENDERER_PROFILE_STORAGE_KEY = "litegraph:renderer-profile";
const THEME_STORAGE_KEY = "litegraph:editor-theme";
const GRAPH_THEME_STORAGE_KEY = "litegraph:graph-theme";
const DEFAULT_RENDERER_PROFILE = "leafer-parity";
const DEFAULT_THEME = "neogrid";
const DEFAULT_GRAPH_THEME = "pragmatic-slate";
const RENDERER_PROFILE_OPTIONS = [
    { value: "legacy-canvas", label: "Legacy Canvas2D" },
    { value: "leafer-hybrid", label: "Leafer Hybrid (Back)" },
    { value: "leafer-parity", label: "Leafer UIAPI (Parity)" },
];
const THEME_OPTIONS = [
    { value: "classic", label: "Classic Dark" },
    { value: "neogrid", label: "NeoGrid Orange" },
];
const GRAPH_THEME_OPTIONS = [
    { value: "classic", label: "Classic Graph" },
    { value: "leafer-cobalt", label: "Leafer Cobalt" },
    { value: "pragmatic-slate", label: "Pragmatic Slate" },
];

const GRAPH_THEME_PRESETS = {
    classic: {
        nodeTitleColor: "#999",
        nodeSelectedTitleColor: "#FFF",
        nodeTextColor: "#AAA",
        nodeDefaultColor: "#333",
        nodeDefaultBgColor: "#353535",
        nodeDefaultBoxColor: "#666",
        nodeOutlineColor: "#FFF",
        defaultShadowColor: "rgba(0,0,0,0.5)",
        widgetBgColor: "#222",
        widgetOutlineColor: "#666",
        widgetTextColor: "#DDD",
        widgetSecondaryTextColor: "#999",
        linkColor: "#9A9",
        eventLinkColor: "#A86",
        connectingLinkColor: "#AFA",
        clearBackgroundColor: "#222",
        defaultConnectionColor: {
            input_off: "#778",
            input_on: "#7F7",
            output_off: "#778",
            output_on: "#7F7",
        },
        defaultConnectionColorByType: {
            number: "#7F7",
            string: "#77F",
            boolean: "#F77",
            node: "#DCA",
            "-1": "#A86",
        },
        defaultConnectionColorByTypeOff: {
            number: "#474",
            string: "#447",
            boolean: "#744",
            node: "#564",
            "-1": "#744",
        },
        linkTypeColors: {
            "-1": "#A86",
            number: "#AAA",
            node: "#DCA",
            string: "#77F",
            boolean: "#F77",
        },
        nodeColors: {
            red: { color: "#322", bgcolor: "#533", groupcolor: "#A88" },
            brown: { color: "#332922", bgcolor: "#593930", groupcolor: "#b06634" },
            green: { color: "#232", bgcolor: "#353", groupcolor: "#8A8" },
            blue: { color: "#223", bgcolor: "#335", groupcolor: "#88A" },
            pale_blue: { color: "#2a363b", bgcolor: "#3f5159", groupcolor: "#3f789e" },
            cyan: { color: "#233", bgcolor: "#355", groupcolor: "#8AA" },
            purple: { color: "#323", bgcolor: "#535", groupcolor: "#a1309b" },
            yellow: { color: "#432", bgcolor: "#653", groupcolor: "#b58b2a" },
            black: { color: "#222", bgcolor: "#000", groupcolor: "#444" },
        },
    },
    "leafer-cobalt": {
        nodeTitleColor: "#E7F4FF",
        nodeSelectedTitleColor: "#FFF8E6",
        nodeTextColor: "#CDE0EE",
        nodeDefaultColor: "#2D7AA5",
        nodeDefaultBgColor: "#1A2633",
        nodeDefaultBoxColor: "#4A8FBD",
        nodeOutlineColor: "#C7E7FF",
        defaultShadowColor: "rgba(2, 8, 16, 0.62)",
        widgetBgColor: "#10202D",
        widgetOutlineColor: "#2C6E93",
        widgetTextColor: "#EAF7FF",
        widgetSecondaryTextColor: "#8DAFC6",
        linkColor: "#6BC6FF",
        eventLinkColor: "#F2B56D",
        connectingLinkColor: "#74F0B6",
        clearBackgroundColor: "#0C131C",
        defaultConnectionColor: {
            input_off: "#5E7890",
            input_on: "#6DE1FF",
            output_off: "#5E7890",
            output_on: "#FFC97C",
        },
        defaultConnectionColorByType: {
            number: "#62D1FF",
            string: "#8FB4FF",
            boolean: "#FF8E80",
            node: "#9FE7B1",
            "-1": "#F2B56D",
        },
        defaultConnectionColorByTypeOff: {
            number: "#2E5872",
            string: "#374C72",
            boolean: "#6B4342",
            node: "#335A4A",
            "-1": "#73563D",
        },
        linkTypeColors: {
            "-1": "#F2B56D",
            number: "#62D1FF",
            node: "#9FE7B1",
            string: "#8FB4FF",
            boolean: "#FF8E80",
        },
        nodeColors: {
            red: { color: "#7F3F3B", bgcolor: "#3A2223", groupcolor: "#9A5750" },
            brown: { color: "#805C36", bgcolor: "#35281D", groupcolor: "#B37E45" },
            green: { color: "#2E7358", bgcolor: "#193126", groupcolor: "#2F9871" },
            blue: { color: "#2D7AA5", bgcolor: "#1A2633", groupcolor: "#2A7AA8" },
            pale_blue: { color: "#2B637D", bgcolor: "#17232C", groupcolor: "#3D8DB0" },
            cyan: { color: "#1E7A82", bgcolor: "#132A2D", groupcolor: "#37A6AF" },
            purple: { color: "#5B4E8C", bgcolor: "#26213D", groupcolor: "#7A6CB7" },
            yellow: { color: "#8A7331", bgcolor: "#332D1D", groupcolor: "#C3A248" },
            black: { color: "#2E3C4A", bgcolor: "#10161C", groupcolor: "#4E6174" },
        },
        canvas: {
            roundRadius: 8,
            connectionsWidth: 3,
            renderShadows: true,
            renderConnectionsShadows: false,
            titleTextFont: "600 14px 'Segoe UI', 'Inter', sans-serif",
            innerTextFont: "500 12px 'Open Sans', 'Segoe UI', sans-serif",
        },
    },
    "pragmatic-slate": {
        nodeTitleColor: "#F1F5F9",
        nodeSelectedTitleColor: "#FFFFFF",
        nodeTextColor: "#D1D9E6",
        nodeDefaultColor: "#334155",
        nodeDefaultBgColor: "#1E293B",
        nodeDefaultBoxColor: "#475569",
        nodeOutlineColor: "#CBD5E1",
        defaultShadowColor: "rgba(0,0,0,0)",
        widgetBgColor: "#0F172A",
        widgetOutlineColor: "#334155",
        widgetTextColor: "#E2E8F0",
        widgetSecondaryTextColor: "#94A3B8",
        linkColor: "#38BDF8",
        eventLinkColor: "#F59E0B",
        connectingLinkColor: "#22D3EE",
        clearBackgroundColor: "#0B1220",
        defaultConnectionColor: {
            input_off: "#64748B",
            input_on: "#22D3EE",
            output_off: "#64748B",
            output_on: "#38BDF8",
        },
        defaultConnectionColorByType: {
            number: "#38BDF8",
            string: "#A78BFA",
            boolean: "#FB7185",
            node: "#34D399",
            "-1": "#F59E0B",
        },
        defaultConnectionColorByTypeOff: {
            number: "#1E3A5F",
            string: "#3B2F61",
            boolean: "#5A2B37",
            node: "#1F4A3C",
            "-1": "#5C4A1E",
        },
        linkTypeColors: {
            "-1": "#F59E0B",
            number: "#38BDF8",
            node: "#34D399",
            string: "#A78BFA",
            boolean: "#FB7185",
        },
        nodeColors: {
            red: { color: "#7F1D1D", bgcolor: "#450A0A", groupcolor: "#9F1239" },
            brown: { color: "#7C2D12", bgcolor: "#431407", groupcolor: "#B45309" },
            green: { color: "#166534", bgcolor: "#052E16", groupcolor: "#15803D" },
            blue: { color: "#1D4ED8", bgcolor: "#172554", groupcolor: "#2563EB" },
            pale_blue: { color: "#0E7490", bgcolor: "#083344", groupcolor: "#0891B2" },
            cyan: { color: "#0F766E", bgcolor: "#042F2E", groupcolor: "#14B8A6" },
            purple: { color: "#6D28D9", bgcolor: "#2E1065", groupcolor: "#7C3AED" },
            yellow: { color: "#A16207", bgcolor: "#422006", groupcolor: "#CA8A04" },
            black: { color: "#334155", bgcolor: "#0F172A", groupcolor: "#475569" },
        },
        canvas: {
            roundRadius: 6,
            connectionsWidth: 2,
            renderShadows: false,
            renderConnectionsShadows: false,
            titleTextFont: "600 14px 'Segoe UI', 'Inter', sans-serif",
            innerTextFont: "500 12px 'Open Sans', 'Segoe UI', sans-serif",
        },
    },
};

function cloneNodeColors(nodeColors) {
    return Object.fromEntries(
        Object.entries(nodeColors || {}).map(([key, value]) => [key, { ...value }]),
    );
}

function cloneFlatRecord(record) {
    return { ...(record || {}) };
}

function normalizeRendererProfile(profile) {
    if (!profile) {
        return null;
    }
    return RENDERER_PROFILE_OPTIONS.some((item) => item.value === profile)
        ? profile
        : null;
}

function normalizeTheme(theme) {
    if (!theme) {
        return null;
    }
    return THEME_OPTIONS.some((item) => item.value === theme)
        ? theme
        : null;
}

function normalizeGraphTheme(theme) {
    if (!theme) {
        return null;
    }
    return GRAPH_THEME_OPTIONS.some((item) => item.value === theme)
        ? theme
        : null;
}

function getRendererProfileFromQuery() {
    try {
        const params = new URLSearchParams(globalThis.location?.search || "");
        return params.get("renderer");
    } catch (_error) {
        return null;
    }
}

function getThemeFromQuery() {
    try {
        const params = new URLSearchParams(globalThis.location?.search || "");
        return params.get("theme");
    } catch (_error) {
        return null;
    }
}

function getGraphThemeFromQuery() {
    try {
        const params = new URLSearchParams(globalThis.location?.search || "");
        return params.get("graphTheme");
    } catch (_error) {
        return null;
    }
}

function getRendererProfile() {
    const fromQuery = normalizeRendererProfile(getRendererProfileFromQuery());
    if (fromQuery) {
        return fromQuery;
    }
    try {
        const stored = globalThis.localStorage?.getItem(RENDERER_PROFILE_STORAGE_KEY);
        const normalizedStored = normalizeRendererProfile(stored);
        if (normalizedStored) {
            return normalizedStored;
        }
    } catch (_error) {
        // ignore localStorage read errors
    }
    return DEFAULT_RENDERER_PROFILE;
}

function setRendererProfile(profile) {
    const normalized = normalizeRendererProfile(profile) || DEFAULT_RENDERER_PROFILE;
    try {
        globalThis.localStorage?.setItem(RENDERER_PROFILE_STORAGE_KEY, normalized);
    } catch (_error) {
        // ignore localStorage write errors
    }
    return normalized;
}

function getEditorTheme() {
    const fromQuery = normalizeTheme(getThemeFromQuery());
    if (fromQuery) {
        return fromQuery;
    }
    try {
        const stored = globalThis.localStorage?.getItem(THEME_STORAGE_KEY);
        const normalizedStored = normalizeTheme(stored);
        if (normalizedStored) {
            return normalizedStored;
        }
    } catch (_error) {
        // ignore localStorage read errors
    }
    return DEFAULT_THEME;
}

function setEditorTheme(theme) {
    const normalized = normalizeTheme(theme) || DEFAULT_THEME;
    try {
        globalThis.localStorage?.setItem(THEME_STORAGE_KEY, normalized);
    } catch (_error) {
        // ignore localStorage write errors
    }
    return normalized;
}

function getGraphTheme() {
    const fromQuery = normalizeGraphTheme(getGraphThemeFromQuery());
    if (fromQuery) {
        return fromQuery;
    }
    try {
        const stored = globalThis.localStorage?.getItem(GRAPH_THEME_STORAGE_KEY);
        const normalizedStored = normalizeGraphTheme(stored);
        if (normalizedStored) {
            return normalizedStored;
        }
    } catch (_error) {
        // ignore localStorage read errors
    }
    return DEFAULT_GRAPH_THEME;
}

function setGraphTheme(theme) {
    const normalized = normalizeGraphTheme(theme) || DEFAULT_GRAPH_THEME;
    try {
        globalThis.localStorage?.setItem(GRAPH_THEME_STORAGE_KEY, normalized);
    } catch (_error) {
        // ignore localStorage write errors
    }
    return normalized;
}

function resolveGraphThemePreset(theme) {
    const resolvedTheme = normalizeGraphTheme(theme) || DEFAULT_GRAPH_THEME;
    return GRAPH_THEME_PRESETS[resolvedTheme] || GRAPH_THEME_PRESETS.classic;
}

function applyGraphThemeStatics(theme) {
    const preset = resolveGraphThemePreset(theme);

    LiteGraph.NODE_TITLE_COLOR = preset.nodeTitleColor;
    LiteGraph.NODE_SELECTED_TITLE_COLOR = preset.nodeSelectedTitleColor;
    LiteGraph.NODE_TEXT_COLOR = preset.nodeTextColor;
    LiteGraph.NODE_DEFAULT_COLOR = preset.nodeDefaultColor;
    LiteGraph.NODE_DEFAULT_BGCOLOR = preset.nodeDefaultBgColor;
    LiteGraph.NODE_DEFAULT_BOXCOLOR = preset.nodeDefaultBoxColor;
    LiteGraph.NODE_BOX_OUTLINE_COLOR = preset.nodeOutlineColor;
    LiteGraph.DEFAULT_SHADOW_COLOR = preset.defaultShadowColor;
    LiteGraph.WIDGET_BGCOLOR = preset.widgetBgColor;
    LiteGraph.WIDGET_OUTLINE_COLOR = preset.widgetOutlineColor;
    LiteGraph.WIDGET_TEXT_COLOR = preset.widgetTextColor;
    LiteGraph.WIDGET_SECONDARY_TEXT_COLOR = preset.widgetSecondaryTextColor;
    LiteGraph.LINK_COLOR = preset.linkColor;
    LiteGraph.EVENT_LINK_COLOR = preset.eventLinkColor;
    LiteGraph.CONNECTING_LINK_COLOR = preset.connectingLinkColor;
    LGraphCanvas.link_type_colors = cloneFlatRecord(preset.linkTypeColors);
    LGraphCanvas.node_colors = cloneNodeColors(preset.nodeColors);
}

function applyGraphThemeToCanvas(graphcanvas, theme) {
    if (!graphcanvas) {
        return;
    }
    const preset = resolveGraphThemePreset(theme);

    graphcanvas.node_title_color = preset.nodeTitleColor;
    graphcanvas.default_link_color = preset.linkColor;
    graphcanvas.clear_background_color = preset.clearBackgroundColor;
    graphcanvas.default_connection_color = cloneFlatRecord(preset.defaultConnectionColor);
    graphcanvas.default_connection_color_byType = cloneFlatRecord(preset.defaultConnectionColorByType);
    graphcanvas.default_connection_color_byTypeOff = cloneFlatRecord(preset.defaultConnectionColorByTypeOff);
    if (preset.canvas) {
        graphcanvas.round_radius = preset.canvas.roundRadius ?? graphcanvas.round_radius;
        graphcanvas.connections_width = preset.canvas.connectionsWidth ?? graphcanvas.connections_width;
        graphcanvas.render_shadows = preset.canvas.renderShadows ?? graphcanvas.render_shadows;
        graphcanvas.render_connections_shadows = preset.canvas.renderConnectionsShadows
            ?? graphcanvas.render_connections_shadows;
        graphcanvas.title_text_font = preset.canvas.titleTextFont ?? graphcanvas.title_text_font;
        graphcanvas.inner_text_font = preset.canvas.innerTextFont ?? graphcanvas.inner_text_font;
    }
    graphcanvas.setDirty?.(true, true);
}

function applyGraphTheme(theme = getGraphTheme(), graphcanvas = null) {
    const resolvedTheme = normalizeGraphTheme(theme) || DEFAULT_GRAPH_THEME;
    applyGraphThemeStatics(resolvedTheme);
    applyGraphThemeToCanvas(graphcanvas, resolvedTheme);
    return resolvedTheme;
}

function applyEditorTheme(theme = getEditorTheme()) {
    const resolved = normalizeTheme(theme) || DEFAULT_THEME;
    globalThis.document?.documentElement?.setAttribute("data-lg-theme", resolved);
    return resolved;
}

if (typeof window !== "undefined") {
    applyEditorTheme();
    applyGraphTheme();
    window.__litegraphGetRendererProfile = getRendererProfile;
    window.__litegraphSetRendererProfile = (profile) => {
        setRendererProfile(profile);
        window.location.reload();
    };
    window.__litegraphGetTheme = getEditorTheme;
    window.__litegraphSetTheme = (theme) => {
        setEditorTheme(theme);
        window.location.reload();
    };
    window.__litegraphGetGraphTheme = getGraphTheme;
    window.__litegraphSetGraphTheme = (theme) => {
        setGraphTheme(theme);
        window.location.reload();
    };
}

function createDefaultRendererAdapter() {
    const LeaferAdapter = LiteGraph?.LeaferUIRendererAdapter;
    const Canvas2DAdapter = LiteGraph?.Canvas2DRendererAdapter;
    const leaferRuntime = globalThis.LeaferUI;
    const profile = getRendererProfile();

    if (profile === "legacy-canvas") {
        return Canvas2DAdapter ? new Canvas2DAdapter() : null;
    }

    if (LeaferAdapter && leaferRuntime) {
        const graphTheme = getGraphTheme();
        const useLeaferComponents = graphTheme === "pragmatic-slate" || graphTheme === "classic";
        if (profile === "leafer-hybrid") {
            return new LeaferAdapter({
                mode: "hybrid-back",
                nodeRenderMode: "legacy-ctx",
                leaferRuntime,
            });
        }

        return new LeaferAdapter({
            mode: "full-leafer",
            nodeRenderMode: useLeaferComponents ? "uiapi-components" : "uiapi-parity",
            nodeRenderLogs: true,
            leaferRuntime,
        });

    }

    if (LeaferAdapter && !leaferRuntime && profile !== "legacy-canvas") {
        console.warn(`[LiteGraph] LeaferUI runtime missing for profile "${profile}", fallback to Canvas2DRendererAdapter.`);
    }

    return Canvas2DAdapter ? new Canvas2DAdapter() : null;
}

function createGraphCanvas(canvas, graph) {
    applyGraphTheme(getGraphTheme());
    const graphTheme = getGraphTheme();
    const rendererAdapter = createDefaultRendererAdapter();
    const options = rendererAdapter
        ? {
            rendererAdapter,
            renderStyleProfile: graphTheme === "pragmatic-slate"
                ? "leafer-pragmatic-v1"
                : graphTheme === "classic"
                    ? "leafer-classic-v1"
                    : "legacy",
            renderStyleEngine: graphTheme === "pragmatic-slate" || graphTheme === "classic"
                ? "leafer-components"
                : "legacy",
        }
        : undefined;
    const graphcanvas = new LGraphCanvas(canvas, graph, options);
    applyGraphThemeToCanvas(graphcanvas, getGraphTheme());
    return graphcanvas;
}

// Creates an interface to access extra features from a graph (like play, stop, live, etc)
export class Editor {

    constructor(container_id, options = {}) {
        applyEditorTheme(getEditorTheme());

        const root = this.root = document.createElement("div");
        root.className = "litegraph litegraph-editor";
        root.innerHTML = `
        <div class="header">
            <div class="tools tools-left"></div>
            <div class="tools tools-right"></div>
        </div>
        <div class="content">
            <div class="editor-area">
                <canvas class="graphcanvas" width="1000" height="500" tabindex="10"></canvas>
            </div>
        </div>
        <div class="footer">
            <div class="tools tools-left"></div>
            <div class="tools tools-right"></div>
        </div>`;

        this.tools = root.querySelector(".tools");
        this.content = root.querySelector(".content");
        this.footer = root.querySelector(".footer");

        const canvas = this.canvas = root.querySelector(".graphcanvas");
        const graph = this.graph = new LGraph();
        const graphcanvas = this.graphcanvas = createGraphCanvas(canvas, graph);

        graphcanvas.background_image = "imgs/grid.png";
        graph.onAfterExecute = () => {
            graphcanvas.draw(true);
        };

        graphcanvas.onDropItem = this.onDropItem.bind(this);

        // add stuff
        // this.addToolsButton("loadsession_button","Load","imgs/icon-load.png", this.onLoadButton.bind(this), ".tools-left" );
        // this.addToolsButton("savesession_button","Save","imgs/icon-save.png", this.onSaveButton.bind(this), ".tools-left" );
        this.addLoadCounter();
        this.addThemeSwitcher();
        this.addGraphThemeSwitcher();
        this.addRendererSwitcher();
        this.addToolsButton(
            "playnode_button",
            "Play",
            "imgs/icon-play.png",
            this.onPlayButton.bind(this),
            ".tools-right",
        );
        this.addToolsButton(
            "playstepnode_button",
            "Step",
            "imgs/icon-playstep.png",
            this.onPlayStepButton.bind(this),
            ".tools-right",
        );

        if (!options.skip_livemode) {
            this.addToolsButton(
                "livemode_button",
                "Live",
                "imgs/icon-record.png",
                this.onLiveButton.bind(this),
                ".tools-right",
            );
        }
        if (!options.skip_maximize) {
            this.addToolsButton(
                "maximize_button",
                "",
                "imgs/icon-maximize.png",
                this.onFullscreenButton.bind(this),
                ".tools-right",
            );
        }
        if (options.miniwindow) {
            this.addMiniWindow(300, 200);
        }

        // append to DOM
        const parent = document.getElementById(container_id);
        if (parent) {
            parent?.appendChild(root);
        } else {
            throw new Error("Editor has no parentElement to bind to");
        }

        graph.onPlayEvent = () => {
            const button = this.root.querySelector("#playnode_button");
            button.innerHTML = `<img src="imgs/icon-stop.png"/> Stop`;
        };

        graph.onStopEvent = () => {
            const button = this.root.querySelector("#playnode_button");
            button.innerHTML = `<img src="imgs/icon-play.png"/> Play`;
        };

        graphcanvas.resize();
    }

    addLoadCounter() {
        const meter = document.createElement("div");
        meter.className = "headerpanel loadmeter toolbar-widget";
        meter.innerHTML = `
            <div class="cpuload">
                <strong>CPU</strong> 
                <div class="bgload">
                    <div class="fgload"></div>
                </div>
            </div>
            <div class="gpuload">
                <strong>GFX</strong> 
                <div class="bgload">
                    <div class="fgload"></div>
                </div>
            </div>`;

        this.root.querySelector(".header .tools-left").appendChild(meter);
        var self = this;

        setInterval(() => {
            meter.querySelector(".cpuload .fgload").style.width =
                `${2 * self.graph.execution_time * 90}px`;
            if (self.graph.status == LGraph.STATUS_RUNNING) {
                meter.querySelector(".gpuload .fgload").style.width =
                    `${self.graphcanvas.render_time * 10 * 90}px`;
            } else {
                meter.querySelector(".gpuload .fgload").style.width = `${4}px`;
            }
        }, 200);
    }

    addRendererSwitcher() {
        const wrapper = document.createElement("label");
        wrapper.className = "toolbar-widget renderer-switcher";
        wrapper.style.display = "inline-flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "6px";
        wrapper.style.marginLeft = "8px";
        wrapper.style.fontSize = "12px";
        wrapper.textContent = "Renderer";

        const select = document.createElement("select");
        select.className = "toolbar-select";

        for (const option of RENDERER_PROFILE_OPTIONS) {
            const item = document.createElement("option");
            item.value = option.value;
            item.textContent = option.label;
            select.appendChild(item);
        }
        select.value = getRendererProfile();

        select.addEventListener("change", () => {
            setRendererProfile(select.value);
            globalThis.location?.reload?.();
        });

        wrapper.appendChild(select);
        this.root.querySelector(".header .tools-left")?.appendChild(wrapper);
    }

    addThemeSwitcher() {
        const wrapper = document.createElement("label");
        wrapper.className = "toolbar-widget theme-switcher";
        wrapper.style.display = "inline-flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "6px";
        wrapper.style.marginLeft = "8px";
        wrapper.style.fontSize = "12px";
        wrapper.textContent = "Theme";

        const select = document.createElement("select");
        select.className = "toolbar-select";

        for (const option of THEME_OPTIONS) {
            const item = document.createElement("option");
            item.value = option.value;
            item.textContent = option.label;
            select.appendChild(item);
        }
        select.value = getEditorTheme();

        select.addEventListener("change", () => {
            setEditorTheme(select.value);
            globalThis.location?.reload?.();
        });

        wrapper.appendChild(select);
        this.root.querySelector(".header .tools-left")?.appendChild(wrapper);
    }

    addGraphThemeSwitcher() {
        const wrapper = document.createElement("label");
        wrapper.className = "toolbar-widget graph-theme-switcher";
        wrapper.style.display = "inline-flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "6px";
        wrapper.style.marginLeft = "8px";
        wrapper.style.fontSize = "12px";
        wrapper.textContent = "Graph";

        const select = document.createElement("select");
        select.className = "toolbar-select";

        for (const option of GRAPH_THEME_OPTIONS) {
            const item = document.createElement("option");
            item.value = option.value;
            item.textContent = option.label;
            select.appendChild(item);
        }
        select.value = getGraphTheme();

        select.addEventListener("change", () => {
            setGraphTheme(select.value);
            globalThis.location?.reload?.();
        });

        wrapper.appendChild(select);
        this.root.querySelector(".header .tools-left")?.appendChild(wrapper);
    }

    addToolsButton(id, name, icon_url, callback, container = ".tools") {
        const button = this.createButton(name, icon_url, callback);
        button.id = id;
        this.root.querySelector(container).appendChild(button);
    }

    createButton(name, icon_url, callback) {
        const button = document.createElement("button");
        if (icon_url) {
            button.innerHTML = `<img src="${icon_url}"/> `;
        }
        button.classList.add("btn");
        button.innerHTML += name;
        if(callback)
            button.addEventListener("click", callback );
        return button;
    }

    onLoadButton() {
        var panel = this.graphcanvas.createPanel("Load session",{closable: true});
        var info = document.createElement("p");
        info.textContent = "Load a graph from a local JSON file or a URL.";
        panel.content.appendChild(info);

        var fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = ".json,application/json";
        fileInput.addEventListener("change", (event) => {
            var file = event.target.files?.[0];
            if (!file) {
                return;
            }
            this.graph.load(file, () => panel.close());
        });
        panel.content.appendChild(fileInput);

        var urlWrapper = document.createElement("div");
        var urlInput = document.createElement("input");
        urlInput.type = "text";
        urlInput.placeholder = "https://example.com/graph.json";
        urlInput.style.width = "100%";

        var loadButton = document.createElement("button");
        loadButton.textContent = "Load URL";
        loadButton.addEventListener("click", () => {
            const url = urlInput.value?.trim();
            if (!url) {
                return;
            }
            this.graph.load(url, () => panel.close());
        });

        urlWrapper.appendChild(urlInput);
        urlWrapper.appendChild(loadButton);
        panel.content.appendChild(urlWrapper);

        this.root.appendChild(panel);
    }

    onSaveButton() {}

    onPlayButton() {
        var graph = this.graph;
        if (graph.status == LGraph.STATUS_STOPPED) {
            graph.start();
        } else {
            graph.stop();
        }
    }

    onPlayStepButton() {
        var graph = this.graph;
        graph.runStep(1);
        this.graphcanvas.draw(true, true);
    }

    onLiveButton() {
        var is_live_mode = !this.graphcanvas.live_mode;
        this.graphcanvas.switchLiveMode(true);
        this.graphcanvas.draw();
        var button = this.root.querySelector("#livemode_button");
        button.innerHTML = !is_live_mode
            ? `<img src="imgs/icon-record.png"/> Live`
            : `<img src="imgs/icon-gear.png"/> Edit`;
    }

    onDropItem(e) {
        var that = this;
        for(var i = 0; i < e.dataTransfer.files.length; ++i) {
            var file = e.dataTransfer.files[i];
            var ext = LGraphCanvas.getFileExtension(file.name);
            var reader = new FileReader();
            if(ext == "json") {
                reader.onload = (event) => {
                    var data = JSON.parse( event.target.result );
                    that.graph.configure(data);
                };
                reader.readAsText(file);
            }
        }
    }

    goFullscreen() {
        if (this.root.requestFullscreen) {
            this.root.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (this.root.mozRequestFullscreen) {
            this.root.requestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (this.root.webkitRequestFullscreen) {
            this.root.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
        } else {
            throw new Error("Fullscreen not supported");
        }

        var self = this;
        setTimeout(() => {
            self.graphcanvas.resize();
        }, 100);
    }

    onFullscreenButton() {
        if(this.isFullscreen()) {
            this.exitFullscreen();
        } else {
            this.goFullscreen();
        }
    }

    addMiniWindow(w, h) {
        var miniwindow = document.createElement("div");
        miniwindow.className = "litegraph miniwindow";
        miniwindow.innerHTML =
            `<canvas class="graphcanvas" width="${w}" height="${h}" tabindex="10"></canvas>`;
        var canvas = miniwindow.querySelector("canvas");
        var that = this;

        var graphcanvas = createGraphCanvas(canvas, this.graph);
        graphcanvas.show_info = false;
        graphcanvas.background_image = "imgs/grid.png";
        graphcanvas.scale = 0.25;
        graphcanvas.allow_dragnodes = false;
        graphcanvas.allow_interaction = false;
        graphcanvas.render_shadows = false;
        graphcanvas.max_zoom = 0.25;
        this.miniwindow_graphcanvas = graphcanvas;
        graphcanvas.onClear = () => {
            graphcanvas.scale = 0.25;
            graphcanvas.allow_dragnodes = false;
            graphcanvas.allow_interaction = false;
        };
        graphcanvas.onRenderBackground = function(canvas, ctx) {
            ctx.strokeStyle = "#567";
            var tl = that.graphcanvas.convertOffsetToCanvas([0, 0]);
            var br = that.graphcanvas.convertOffsetToCanvas([
                that.graphcanvas.canvas.width,
                that.graphcanvas.canvas.height,
            ]);
            tl = this.convertCanvasToOffset(tl);
            br = this.convertCanvasToOffset(br);
            ctx.lineWidth = 1;
            ctx.strokeRect(
                Math.floor(tl[0]) + 0.5,
                Math.floor(tl[1]) + 0.5,
                Math.floor(br[0] - tl[0]),
                Math.floor(br[1] - tl[1]),
            );
        };

        miniwindow.style.position = "absolute";
        miniwindow.style.top = "4px";
        miniwindow.style.right = "4px";

        var close_button = document.createElement("div");
        close_button.className = "corner-button";
        close_button.innerHTML = "&#10060;";
        close_button.addEventListener("click", (_event) => {
            graphcanvas.setGraph(null);
            miniwindow.parentNode.removeChild(miniwindow);
        });
        miniwindow.appendChild(close_button);

        this.root.querySelector(".content").appendChild(miniwindow);
    }

    addMultiview() {
        var canvas = this.canvas;
        let graphcanvas;

        if (this.graphcanvas2) {
            this.graphcanvas2.setGraph(null, true);
            this.graphcanvas2.viewport = null;
            this.graphcanvas2 = null;
            this.graphcanvas.viewport = null;
            this.graphcanvas.setGraph(null, true);
            this.graphcanvas = null;
            graphcanvas = createGraphCanvas(canvas, this.graph);
            graphcanvas.background_image = "imgs/grid.png";
            this.graphcanvas = graphcanvas;
            window.graphcanvas = this.graphcanvas;
            return;
        }

        this.graphcanvas.ctx.fillStyle = "black";
        this.graphcanvas.ctx.fillRect(0,0,canvas.width,canvas.height);
        this.graphcanvas.viewport = [0,0,canvas.width*0.5-2,canvas.height];

        graphcanvas = createGraphCanvas(canvas, this.graph);
        graphcanvas.background_image = "imgs/grid.png";
        this.graphcanvas2 = graphcanvas;
        this.graphcanvas2.viewport = [canvas.width*0.5,0,canvas.width*0.5,canvas.height];
    }

    isFullscreen() {
        return(
            document.fullscreenElement ||
            document.mozRequestFullscreen ||
            document.webkitRequestFullscreen ||
            false
        );
    }

    exitFullscreen() {
        if(document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullscreen) {
            document.mozCancelFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        }
    }
}
