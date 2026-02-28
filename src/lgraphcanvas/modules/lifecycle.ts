// @ts-nocheck
import { LiteGraph } from "../../litegraph.ts";
import { LGraphCanvas } from "../../lgraphcanvas.js";
import { Canvas2DRendererAdapter } from "../renderer/canvas2d-adapter.js";
import { LeaferUIRendererAdapter } from "../renderer/leafer-ui-adapter.ts";
import { createLegacyModeRuntime } from "../modes/forms/legacy/legacy-mode.ts";
import { resolveRenderMode } from "../modes/resolve-render-mode.ts";

function resolveRendererAdapter(instance, runtimeMode) {
    const resolveLeaferDefaults = () => {
        const mode = runtimeMode?.strategy === "hybrid-back" ? "hybrid-back" : "full-leafer";
        const nodeRenderMode = runtimeMode?.strategy === "decoupled-compat"
            ? "uiapi-components"
            : (runtimeMode?.capabilities?.forceLegacyNodeCtx ? "legacy-ctx" : "uiapi-parity");
        return { mode, nodeRenderMode };
    };

    const hasNewModeFields = instance?.options?.renderForm != null
        || instance?.options?.renderStrategy != null
        || instance?.renderForm != null
        || instance?.renderStrategy != null;
    const candidate = instance.options?.rendererAdapter ?? instance.rendererAdapter;

    if (hasNewModeFields && runtimeMode?.form === "legacy") {
        return new Canvas2DRendererAdapter();
    }

    if (!candidate) {
        if (runtimeMode?.form === "leafer") {
            const { mode, nodeRenderMode } = resolveLeaferDefaults();
            return new LeaferUIRendererAdapter({ mode, nodeRenderMode });
        }
        return new Canvas2DRendererAdapter();
    }
    const candidateInstance = typeof candidate === "function"
        ? new candidate()
        : candidate;

    if (hasNewModeFields && runtimeMode?.form === "leafer") {
        const isCanvas2DOnly = candidateInstance instanceof Canvas2DRendererAdapter;
        if (isCanvas2DOnly) {
            const { mode, nodeRenderMode } = resolveLeaferDefaults();
            return new LeaferUIRendererAdapter({ mode, nodeRenderMode });
        }
    }

    if (typeof candidate === "function") {
        return candidateInstance;
    }
    return candidateInstance;
}

/** 中文说明：clear 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function clear() {
    this.frame = 0;
    this.last_draw_time = 0;
    this.render_time = 0;
    this.fps = 0;
    this.low_quality_rendering_counter = 0;

    // this.scale = 1;
    // this.offset = [0,0];

    this.dragging_rectangle = null;

    this.selected_nodes = {};
    this.selected_group = null;

    this.visible_nodes = [];
    this.node_dragged = null;
    this.node_over = null;
    this.node_capturing_input = null;
    this.connecting_node = null;
    this.highlighted_links = {};

    this.dragging_canvas = false;

    this.dirty_canvas = true;
    this.dirty_bgcanvas = true;
    this.dirty_area = null;

    this.node_in_panel = null;
    this.node_widget = null;

    this.last_mouse = [0, 0];
    this.last_mouseclick = 0;
    this.pointer_is_down = false;
    this.pointer_is_double = false;
    this.visible_area.set([0, 0, 0, 0]);

    this.onClear?.();
}

/** 中文说明：setGraph 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function setGraph(graph, skip_clear) {
    if (this.graph == graph) {
        return;
    }

    if (!skip_clear) {
        this.clear();
    }

    if (!graph) {
        this.graph?.detachCanvas(this);
        return;
    }

    graph.attachCanvas(this);

    // remove the graph stack in case a subgraph was open
    this._graph_stack &&= null;
    this.setDirty(true, true);
}

/** 中文说明：getTopGraph 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function getTopGraph() {
    if(this._graph_stack.length)
        return this._graph_stack[0];
    return this.graph;
}

/** 中文说明：openSubgraph 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function openSubgraph(graph) {
    if (!graph) {
        throw new Error("graph cannot be null");
    }

    if (this.graph == graph) {
        throw new Error("graph cannot be the same");
    }

    this.clear();

    if (this.graph) {
        this._graph_stack ||= [];
        this._graph_stack.push(this.graph);
    }

    graph.attachCanvas(this);
    this.checkPanels();
    this.setDirty(true, true);
}

/** 中文说明：closeSubgraph 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function closeSubgraph() {
    if (!this._graph_stack || this._graph_stack.length == 0) {
        return;
    }
    var subgraph_node = this.graph._subgraph_node;
    var graph = this._graph_stack.pop();
    this.selected_nodes = {};
    this.highlighted_links = {};
    graph.attachCanvas(this);
    this.setDirty(true, true);
    if (subgraph_node) {
        this.centerOnNode(subgraph_node);
        this.selectNodes([subgraph_node]);
    }
    // when close sub graph back to offset [0, 0] scale 1
    this.ds.offset = [0, 0]
    this.ds.scale = 1
}

/** 中文说明：getCurrentGraph 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function getCurrentGraph() {
    return this.graph;
}

/** 中文说明：setCanvas 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function setCanvas(canvas, skip_events) {
    this._renderModeRuntime = resolveRenderMode(this);
    this.renderForm = this._renderModeRuntime.form;
    this.renderStrategy = this._renderModeRuntime.strategy;
    this.renderStyleProfile = this.options?.renderStyleProfile || this.renderStyleProfile || "legacy";
    this.renderStyleEngine = this.options?.renderStyleEngine
        || this.renderStyleEngine
        || (this.renderStyleProfile === "legacy" ? "legacy" : "leafer-components");

    if (canvas) {
        if (canvas.constructor === String) {
            canvas = document.getElementById(canvas);
            if (!canvas) {
                throw new Error("Error creating LiteGraph canvas: Canvas not found");
            }
        }
    }

    if (canvas === this.canvas) {
        return;
    }

    if (!canvas && this.canvas) {
        // maybe detach events from old_canvas
        if (!skip_events) {
            this.unbindEvents();
        }
    }

    if (this.rendererAdapter && this.canvas && canvas !== this.canvas) {
        this.rendererAdapter.destroy?.();
    }

    this.canvas = canvas;

    if (!canvas) {
        this.ctx = null;
        this.bgctx = null;
        this.bgcanvas = null;
        this.frontSurface = null;
        this.backSurface = null;
        this.ds.element = null;
        return;
    }

    // this.canvas.tabindex = "1000";
    canvas.className += " lgraphcanvas";
    canvas.data = this;
    canvas.tabindex = "1"; // to allow key events

    if (canvas.getContext == null) {
        if (canvas.localName != "canvas") {
            throw new Error("Element supplied for LGraphCanvas must be a <canvas> element, you passed a "+canvas.localName);
        }
        throw new Error("This browser doesn't support Canvas");
    }

    this.rendererAdapter = resolveRendererAdapter(this, this._renderModeRuntime);
    try {
        this.rendererAdapter.init?.({
            canvas,
            ownerDocument: canvas.ownerDocument,
        });
    } catch (error) {
        LiteGraph.warn?.("[RenderMode] Renderer adapter init failed. Falling back to Canvas2D.", error);
        this.rendererAdapter = new Canvas2DRendererAdapter();
        this.rendererAdapter.init?.({
            canvas,
            ownerDocument: canvas.ownerDocument,
        });
        this._renderModeRuntime = createLegacyModeRuntime("adapter-init-fallback");
        this.renderForm = this._renderModeRuntime.form;
        this.renderStrategy = this._renderModeRuntime.strategy;
    }

    this.frontSurface = this.rendererAdapter.getFrontSurface?.() ?? null;
    this.backSurface = this.rendererAdapter.getBackSurface?.() ?? null;
    this.canvas = this.frontSurface?.canvas || canvas;
    this.bgcanvas = this.backSurface?.canvas || this.canvas;
    this.ds.element = this.canvas;

    var ctx = this.ctx = this.rendererAdapter.getFrontCtx?.() ?? this.frontSurface?.getContextCompat?.() ?? null;
    this.bgctx = this.rendererAdapter.getBackCtx?.() ?? this.backSurface?.getContextCompat?.() ?? ctx;
    if (ctx == null) {
        if (!canvas.webgl_enabled) {
            LiteGraph.info?.("This canvas seems to be WebGL, enabling WebGL renderer");
        }
        this.enableWebGL();
    }

    if (!skip_events) {
        this.bindEvents();
    }
}

/** 中文说明：_doNothing 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function _doNothing(e) {
    // LiteGraph.debug?.("pointerevents: _doNothing "+e.type);
    e.preventDefault();
    return false;
}

/** 中文说明：_doReturnTrue 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function _doReturnTrue(e) {
    e.preventDefault();
    return true;
}

/** 中文说明：bindEvents 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function bindEvents() {
    if (this._events_binded) {
        LiteGraph.warn?.("LGraphCanvas: events already binded");
        return;
    }
    this._events_binded = true;
    var canvas = this.canvas;
    var ref_window = this.getCanvasWindow();
    var document = ref_window.document; // hack used when moving canvas between windows

    // Pointer
    this._mousedown_callback = this.processMouseDown.bind(this);
    this._mousemove_callback = this.processMouseMove.bind(this);
    this._mouseup_callback = this.processMouseUp.bind(this);
    canvas.addEventListener("pointerdown", this._mousedown_callback, true);
    canvas.addEventListener("pointermove", this._mousemove_callback);
    canvas.addEventListener("pointerup", this._mouseup_callback, true);
    canvas.addEventListener("contextmenu", this._doNothing);

    // Wheel
    canvas.addEventListener("wheel", this.processMouseWheel);

    // Keyboard
    canvas.addEventListener("keydown", this.processKey);
    document.addEventListener("keyup", this.processKey); // in document, otherwise it doesn't fire keyup

    // Drop
    canvas.addEventListener("dragover", this._doNothing, false);
    canvas.addEventListener("dragend", this._doNothing, false);
    canvas.addEventListener("drop", this.processDrop);
    canvas.addEventListener("dragenter", this._doReturnTrue, false);
}

/** 中文说明：unbindEvents 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function unbindEvents() {
    if (!this._events_binded) {
        LiteGraph.warn?.("LGraphCanvas: no events binded");
        return;
    }
    this._events_binded = false;
    var canvas = this.canvas;
    var ref_window = this.getCanvasWindow();
    var document = ref_window.document;

    // Pointer
    canvas.removeEventListener("pointerdown", this._mousedown_callback);
    canvas.removeEventListener("pointermove", this._mousemove_callback);
    canvas.removeEventListener("pointerup", this._mouseup_callback);
    canvas.removeEventListener("contextmenu", this._doNothing);

    // Wheel
    canvas.removeEventListener("wheel", this.processMouseWheel);

    // Keyboard
    canvas.removeEventListener("keydown", this.processKey);
    document.removeEventListener("keyup", this.processKey);

    // Drop
    canvas.removeEventListener("dragover", this._doNothing, false);
    canvas.removeEventListener("dragend", this._doNothing, false);
    canvas.removeEventListener("drop", this.processDrop);
    canvas.removeEventListener("dragenter", this._doReturnTrue);

    this._mousedown_callback = null;

}

/** 中文说明：enableWebGL 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function enableWebGL() {
    if (typeof GL === "undefined") {
        throw new Error("litegl.js must be included to use a WebGL canvas");
    }
    if (typeof enableWebGLCanvas === "undefined") {
        throw new Error("webglCanvas.js must be included to use this feature");
    }

    this.gl = this.ctx = enableWebGLCanvas(this.canvas);
    this.ctx.webgl = true;
    this.bgcanvas = this.canvas;
    this.bgctx = this.gl;
    this.frontSurface = {
        canvas: this.canvas,
        getContextCompat: () => this.ctx,
        resize: (width, height) => {
            this.canvas.width = width;
            this.canvas.height = height;
        },
    };
    this.backSurface = this.frontSurface;
    this.rendererAdapter?.adoptExternalContexts?.({
        frontCanvas: this.canvas,
        backCanvas: this.canvas,
        frontContext: this.ctx,
        backContext: this.bgctx,
    });
    this.canvas.webgl_enabled = true;

    /*
GL.create({ canvas: this.bgcanvas });
this.bgctx = enableWebGLCanvas( this.bgcanvas );
window.gl = this.gl;
*/
}

/** 中文说明：setDirty 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function setDirty(fgcanvas, bgcanvas) {
    if (fgcanvas) {
        this.dirty_canvas = true;
    }
    if (bgcanvas) {
        this.dirty_bgcanvas = true;
    }
}

/** 中文说明：getCanvasWindow 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function getCanvasWindow() {
    if (!this.canvas) {
        return window;
    }
    var doc = this.canvas.ownerDocument;
    return doc.defaultView ?? doc.parentWindow;
}

/** 中文说明：startRendering 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function startRendering() {
    if (this.is_rendering) {
        return;
    } // already rendering

    this.is_rendering = true;
    renderFrame.call(this);

    function renderFrame() {
        if (!this.pause_rendering) {
            this.draw();
        }

        var window = this.getCanvasWindow();
        if (this.is_rendering) {
            window.requestAnimationFrame(renderFrame.bind(this));
        }
    }
}

/** 中文说明：stopRendering 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function stopRendering() {
    this.is_rendering = false;
    /*
if(this.rendering_timer_id)
{
    clearInterval(this.rendering_timer_id);
    this.rendering_timer_id = null;
}
*/
}

/** 中文说明：resize 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function resize(width, height) {
    if (!width && !height) {
        var parent = this.canvas.parentNode;
        width = parent.offsetWidth;
        height = parent.offsetHeight;
    }

    const frontCanvas = this.frontSurface?.canvas || this.canvas;
    if (frontCanvas.width == width && frontCanvas.height == height) {
        return;
    }

    if (this.rendererAdapter?.resize) {
        this.rendererAdapter.resize(width, height);
        this.frontSurface = this.rendererAdapter.getFrontSurface?.() ?? this.frontSurface;
        this.backSurface = this.rendererAdapter.getBackSurface?.() ?? this.backSurface;
        this.canvas = this.frontSurface?.canvas || this.canvas;
        this.bgcanvas = this.backSurface?.canvas || this.bgcanvas;
        this.ctx = this.rendererAdapter.getFrontCtx?.() ?? this.frontSurface?.getContextCompat?.() ?? this.ctx;
        this.bgctx = this.rendererAdapter.getBackCtx?.() ?? this.backSurface?.getContextCompat?.() ?? this.bgctx;
        this.ds.element = this.canvas;
    } else {
        this.canvas.width = width;
        this.canvas.height = height;
        this.bgcanvas.width = this.canvas.width;
        this.bgcanvas.height = this.canvas.height;
    }
    this.setDirty(true, true);
}

/** 中文说明：switchLiveMode 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function switchLiveMode(transition) {
    if (!transition) {
        this.live_mode = !this.live_mode;
        this.dirty_canvas = true;
        this.dirty_bgcanvas = true;
        return;
    }

    var self = this;
    var delta = this.live_mode ? 1.1 : 0.9;
    if (this.live_mode) {
        this.live_mode = false;
        this.editor_alpha = 0.1;
    }

    var t = setInterval(function() {
        self.editor_alpha *= delta;
        self.dirty_canvas = true;
        self.dirty_bgcanvas = true;

        if (delta < 1 && self.editor_alpha < 0.01) {
            clearInterval(t);
            if (delta < 1) {
                self.live_mode = true;
            }
        }
        if (delta > 1 && self.editor_alpha > 0.99) {
            clearInterval(t);
            self.editor_alpha = 1;
        }
    }, 1);
}




