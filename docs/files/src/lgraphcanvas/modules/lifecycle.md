# 文件文档：`src/lgraphcanvas/modules/lifecycle.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 13 个文件，导出 115 项（AUTO 115 项），耦合强度 50。
> 关键耦合：出边 `src`(22)、`src/lgraphcanvas/shared`(3)；入边 `src/lgraphcanvas/controllers`(24)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

- 导出项数量：18
- AUTO 说明数量：18

## 1. `clear`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.js:3-41` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `clear`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L3-L22）：
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
- 位置：`src/lgraphcanvas/modules/lifecycle.js:43-62` (`#L43`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setGraph`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L43-L62）：
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
- 位置：`src/lgraphcanvas/modules/lifecycle.js:64-68` (`#L64`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `getTopGraph`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L64-L69）：
```js
export function getTopGraph() {
    if(this._graph_stack.length)
        return this._graph_stack[0];
    return this.graph;
}

```

## 4. `openSubgraph`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.js:70-89` (`#L70`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `openSubgraph`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L70-L89）：
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
- 位置：`src/lgraphcanvas/modules/lifecycle.js:91-108` (`#L91`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `closeSubgraph`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L91-L108）：
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
- 位置：`src/lgraphcanvas/modules/lifecycle.js:110-112` (`#L110`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `getCurrentGraph`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L110-L115）：
```js
export function getCurrentGraph() {
    return this.graph;
}

export function setCanvas(canvas, skip_events) {

```

## 7. `setCanvas`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.js:114-171` (`#L114`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setCanvas`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L114-L133）：
```js
export function setCanvas(canvas, skip_events) {

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
```

> 片段已按最大行数裁剪。

## 8. `_doNothing`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.js:173-177` (`#L173`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `_doNothing`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L173-L178）：
```js
export function _doNothing(e) {
    // LiteGraph.debug?.("pointerevents: _doNothing "+e.type);
    e.preventDefault();
    return false;
}

```

## 9. `_doReturnTrue`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.js:179-182` (`#L179`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `_doReturnTrue`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L179-L184）：
```js
export function _doReturnTrue(e) {
    e.preventDefault();
    return true;
}

export function bindEvents() {
```

## 10. `bindEvents`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.js:184-215` (`#L184`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `bindEvents`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L184-L203）：
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
- 位置：`src/lgraphcanvas/modules/lifecycle.js:217-248` (`#L217`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `unbindEvents`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L217-L236）：
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
- 位置：`src/lgraphcanvas/modules/lifecycle.js:250-269` (`#L250`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `enableWebGL`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L250-L269）：
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
    this.canvas.webgl_enabled = true;

    /*
GL.create({ canvas: this.bgcanvas });
this.bgctx = enableWebGLCanvas( this.bgcanvas );
window.gl = this.gl;
*/
}
```

## 13. `setDirty`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.js:271-278` (`#L271`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setDirty`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L271-L278）：
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
- 位置：`src/lgraphcanvas/modules/lifecycle.js:280-286` (`#L280`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `getCanvasWindow`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L280-L286）：
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
- 位置：`src/lgraphcanvas/modules/lifecycle.js:288-306` (`#L288`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `startRendering`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L288-L306）：
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
- 位置：`src/lgraphcanvas/modules/lifecycle.js:308-317` (`#L308`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `stopRendering`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L308-L317）：
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
- 位置：`src/lgraphcanvas/modules/lifecycle.js:319-335` (`#L319`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `resize`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L319-L335）：
```js
export function resize(width, height) {
    if (!width && !height) {
        var parent = this.canvas.parentNode;
        width = parent.offsetWidth;
        height = parent.offsetHeight;
    }

    if (this.canvas.width == width && this.canvas.height == height) {
        return;
    }

    this.canvas.width = width;
    this.canvas.height = height;
    this.bgcanvas.width = this.canvas.width;
    this.bgcanvas.height = this.canvas.height;
    this.setDirty(true, true);
}
```

## 18. `switchLiveMode`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/lifecycle.js:337-368` (`#L337`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `switchLiveMode`，定义于 `src/lgraphcanvas/modules/lifecycle.js`。

- 代码片段（L337-L356）：
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
