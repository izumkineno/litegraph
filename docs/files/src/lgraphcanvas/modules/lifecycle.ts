# 文件文档：`src/lgraphcanvas/modules/lifecycle.ts`

## 所属模块介绍

- 模块：`src/lgraphcanvas/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 16 个文件，导出 120 项（AUTO 84 项），耦合强度 47。
> 关键耦合：出边 `src`(21)、`src/lgraphcanvas/shared`(3)、`src/lgraphcanvas/renderer`(2)；入边 `src/lgraphcanvas/controllers`(20)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

- 导出项数量：18
- AUTO 说明数量：0

## 1. `clear`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:18-56` (`#L18`)
- 说明来源：源码注释
- 说明：
> 中文说明：clear 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L18-L37）：
```js
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
```

> 片段已按最大行数裁剪。

## 2. `setGraph`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:59-78` (`#L59`)
- 说明来源：源码注释
- 说明：
> 中文说明：setGraph 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L59-L78）：
```js
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
```

## 3. `getTopGraph`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:81-85` (`#L81`)
- 说明来源：源码注释
- 说明：
> 中文说明：getTopGraph 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L81-L86）：
```js
export function getTopGraph() {
    if(this._graph_stack.length)
        return this._graph_stack[0];
    return this.graph;
}

```

## 4. `openSubgraph`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:88-107` (`#L88`)
- 说明来源：源码注释
- 说明：
> 中文说明：openSubgraph 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L88-L107）：
```js
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
```

## 5. `closeSubgraph`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:110-127` (`#L110`)
- 说明来源：源码注释
- 说明：
> 中文说明：closeSubgraph 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L110-L127）：
```js
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
```

## 6. `getCurrentGraph`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:130-132` (`#L130`)
- 说明来源：源码注释
- 说明：
> 中文说明：getCurrentGraph 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L130-L135）：
```js
export function getCurrentGraph() {
    return this.graph;
}

/** 中文说明：setCanvas 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function setCanvas(canvas, skip_events) {
```

## 7. `setCanvas`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:135-214` (`#L135`)
- 说明来源：源码注释
- 说明：
> 中文说明：setCanvas 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L135-L154）：
```js
export function setCanvas(canvas, skip_events) {

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

```

> 片段已按最大行数裁剪。

## 8. `_doNothing`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:217-221` (`#L217`)
- 说明来源：源码注释
- 说明：
> 中文说明：_doNothing 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L217-L222）：
```js
export function _doNothing(e) {
    // LiteGraph.debug?.("pointerevents: _doNothing "+e.type);
    e.preventDefault();
    return false;
}

```

## 9. `_doReturnTrue`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:224-227` (`#L224`)
- 说明来源：源码注释
- 说明：
> 中文说明：_doReturnTrue 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L224-L229）：
```js
export function _doReturnTrue(e) {
    e.preventDefault();
    return true;
}

/** 中文说明：bindEvents 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
```

## 10. `bindEvents`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:230-261` (`#L230`)
- 说明来源：源码注释
- 说明：
> 中文说明：bindEvents 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L230-L249）：
```js
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
```

> 片段已按最大行数裁剪。

## 11. `unbindEvents`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:264-295` (`#L264`)
- 说明来源：源码注释
- 说明：
> 中文说明：unbindEvents 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L264-L283）：
```js
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
```

> 片段已按最大行数裁剪。

## 12. `enableWebGL`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:298-332` (`#L298`)
- 说明来源：源码注释
- 说明：
> 中文说明：enableWebGL 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L298-L317）：
```js
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
```

> 片段已按最大行数裁剪。

## 13. `setDirty`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:335-342` (`#L335`)
- 说明来源：源码注释
- 说明：
> 中文说明：setDirty 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L335-L342）：
```js
export function setDirty(fgcanvas, bgcanvas) {
    if (fgcanvas) {
        this.dirty_canvas = true;
    }
    if (bgcanvas) {
        this.dirty_bgcanvas = true;
    }
}
```

## 14. `getCanvasWindow`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:345-351` (`#L345`)
- 说明来源：源码注释
- 说明：
> 中文说明：getCanvasWindow 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L345-L351）：
```js
export function getCanvasWindow() {
    if (!this.canvas) {
        return window;
    }
    var doc = this.canvas.ownerDocument;
    return doc.defaultView ?? doc.parentWindow;
}
```

## 15. `startRendering`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:354-372` (`#L354`)
- 说明来源：源码注释
- 说明：
> 中文说明：startRendering 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L354-L372）：
```js
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
```

## 16. `stopRendering`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:375-384` (`#L375`)
- 说明来源：源码注释
- 说明：
> 中文说明：stopRendering 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L375-L384）：
```js
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
```

## 17. `resize`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:387-415` (`#L387`)
- 说明来源：源码注释
- 说明：
> 中文说明：resize 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L387-L406）：
```js
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
```

> 片段已按最大行数裁剪。

## 18. `switchLiveMode`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.ts:418-449` (`#L418`)
- 说明来源：源码注释
- 说明：
> 中文说明：switchLiveMode 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L418-L437）：
```js
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

```

> 片段已按最大行数裁剪。
