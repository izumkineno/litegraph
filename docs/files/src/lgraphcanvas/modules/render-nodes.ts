# 文件文档：`src/lgraphcanvas/modules/render-nodes.ts`

## 所属模块介绍

- 模块：`src/lgraphcanvas/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 16 个文件，导出 120 项（AUTO 84 项），耦合强度 47。
> 关键耦合：出边 `src`(21)、`src/lgraphcanvas/shared`(3)、`src/lgraphcanvas/renderer`(2)；入边 `src/lgraphcanvas/controllers`(20)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

- 导出项数量：9
- AUTO 说明数量：0

## 1. `beginNodeFrameLeafer`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.ts:161-178` (`#L161`)
- 说明来源：源码注释
- 说明：
> 中文说明：beginNodeFrameLeafer 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L161-L178）：
```js
export function beginNodeFrameLeafer(ctx, _visibleNodes) {
    if (!shouldUseLeaferNodeUiMode(this)) {
        this._leaferNodeUiFrameActive = false;
        return false;
    }
    const layer = ensureLeaferNodeUiLayer(this, ctx);
    if (!layer) {
        this._leaferNodeUiFrameActive = false;
        return false;
    }
    const nodeRenderMode = this?.rendererAdapter?.options?.nodeRenderMode || "uiapi-parity";
    layer.beginFrame({
        nodeRenderMode,
        renderStyleProfile: this?.renderStyleProfile || "legacy",
    });
    this._leaferNodeUiFrameActive = true;
    return true;
}
```

## 2. `endNodeFrameLeafer`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.ts:181-188` (`#L181`)
- 说明来源：源码注释
- 说明：
> 中文说明：endNodeFrameLeafer 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L181-L188）：
```js
export function endNodeFrameLeafer(ctx, _visibleNodes) {
    if (!this._leaferNodeUiFrameActive || !this._leaferNodeUiLayer) {
        return;
    }
    this._leaferNodeUiLayer.endFrame();
    this._leaferNodeUiLayer.renderTo(ctx);
    this._leaferNodeUiFrameActive = false;
}
```

## 3. `drawNode`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.ts:195-662` (`#L195`)
- 说明来源：源码注释
- 说明：
> 中文说明：drawNode 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L195-L214）：
```js
export function drawNode(node, ctx) {
    ensureRoundRectCompat(ctx);

    if (shouldUseLeaferNodeUiMode(this) && this._leaferNodeUiFrameActive && this._leaferNodeUiLayer) {
        if (isLeaferNodeUiParityMode(this)) {
            const frameActive = this._leaferNodeUiFrameActive;
            this.current_node = node;
            this._leaferNodeUiFrameActive = false;
            try {
                this._leaferNodeUiLayer.drawLegacyNode(node, this, (legacyCtx) => {
                    drawNode.call(this, node, legacyCtx);
                });
            } finally {
                this._leaferNodeUiFrameActive = frameActive;
            }
            decayTriggerCounters(node);
            return;
        }
        if (isLeaferNodeUiComponentsMode(this)) {
            this.current_node = node;
```

> 片段已按最大行数裁剪。

## 4. `drawNodeTooltip`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.ts:669-726` (`#L669`)
- 说明来源：源码注释
- 说明：
> 中文说明：drawNodeTooltip 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L669-L688）：
```js
export function drawNodeTooltip( ctx, node ) {
    if(!node || !ctx) {
        LiteGraph.warn?.("drawNodeTooltip: invalid node or ctx",node,ctx);
        return;
    }
    ensureRoundRectCompat(ctx);
    var text = node.properties.tooltip!=undefined?node.properties.tooltip:"";
    if (!text || text=="") {
        if (LiteGraph.show_node_tooltip_use_descr_property && node.constructor.desc) {
            text = node.constructor.desc;
        }
    }
    text = (text+"").trim();
    if(!text || text == "") {
        // DBG("Empty tooltip");
        return;
    }

    var pos = [0,-LiteGraph.NODE_TITLE_HEIGHT]; // node.pos;
    // text = text.substr(0,30); //avoid weird
```

> 片段已按最大行数裁剪。

## 5. `drawNodeShape`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.ts:733-1029` (`#L733`)
- 说明来源：源码注释
- 说明：
> 中文说明：drawNodeShape 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L733-L752）：
```js
export function drawNodeShape(node, ctx, size, fgcolor, bgcolor, selected, mouse_over) {
    ensureRoundRectCompat(ctx);

    // bg rect
    ctx.strokeStyle = fgcolor;
    ctx.fillStyle = bgcolor;

    var title_height = LiteGraph.NODE_TITLE_HEIGHT;
    var low_quality = this.lowQualityRenderingRequired(0.5);

    // render node area depending on shape
    var shape = node._shape || node.constructor.shape || LiteGraph.ROUND_SHAPE;

    var title_mode = node.constructor.title_mode;

    var render_title = true;
    if (title_mode == LiteGraph.TRANSPARENT_TITLE || title_mode == LiteGraph.NO_TITLE) {
        render_title = false;
    } else if (title_mode == LiteGraph.AUTOHIDE_TITLE && mouse_over) {
        render_title = true;
```

> 片段已按最大行数裁剪。

## 6. `drawExecutionOrder`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.ts:1035-1069` (`#L1035`)
- 说明来源：源码注释
- 说明：
> 中文说明：drawExecutionOrder 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L1035-L1054）：
```js
export function drawExecutionOrder(ctx) {
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = 0.25;

    ctx.textAlign = "center";
    ctx.strokeStyle = "white";
    ctx.globalAlpha = 0.75;

    var visible_nodes = this.visible_nodes;
    for (let i = 0; i < visible_nodes.length; ++i) {
        var node = visible_nodes[i];
        ctx.fillStyle = "black";
        ctx.fillRect(
            node.pos[0] - LiteGraph.NODE_TITLE_HEIGHT,
            node.pos[1] - LiteGraph.NODE_TITLE_HEIGHT,
            LiteGraph.NODE_TITLE_HEIGHT,
            LiteGraph.NODE_TITLE_HEIGHT,
        );
        if (node.order == 0) {
            ctx.strokeRect(
```

> 片段已按最大行数裁剪。

## 7. `drawNodeWidgets`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.ts:1078-1289` (`#L1078`)
- 说明来源：源码注释
- 说明：
> 中文说明：drawNodeWidgets 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L1078-L1097）：
```js
export function drawNodeWidgets(node, posY, ctx, active_widget) {
    if (!node.widgets || !node.widgets.length) {
        return 0;
    }
    ensureRoundRectCompat(ctx);
    var width = node.size[0];
    var widgets = node.widgets;
    posY += 2;
    var H = LiteGraph.NODE_WIDGET_HEIGHT;
    var show_text = !this.lowQualityRenderingRequired(0.5);
    ctx.save();
    ctx.globalAlpha = this.editor_alpha;
    var outline_color = LiteGraph.WIDGET_OUTLINE_COLOR;
    var background_color = LiteGraph.WIDGET_BGCOLOR;
    var text_color = LiteGraph.WIDGET_TEXT_COLOR;
    var secondary_text_color = LiteGraph.WIDGET_SECONDARY_TEXT_COLOR;
    var margin = 15;

    for (let i = 0; i < widgets.length; ++i) {
        var w = widgets[i];
```

> 片段已按最大行数裁剪。

## 8. `processNodeWidgets`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.ts:1292-1495` (`#L1292`)
- 说明来源：源码注释
- 说明：
> 中文说明：processNodeWidgets 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L1292-L1311）：
```js
export function processNodeWidgets(node, pos, event, active_widget) {
    if (!node.widgets || !node.widgets.length || (!this.allow_interaction && !node.flags.allow_interaction)) {
        return null;
    }

    var x = pos[0] - node.pos[0];
    var y = pos[1] - node.pos[1];
    var width = node.size[0];
    var deltaX = event.deltaX || event.deltax || 0;
    var that = this;
    var ref_window = this.getCanvasWindow();

    for (let i = 0; i < node.widgets.length; ++i) {
        var w = node.widgets[i];
        if(!w || w.disabled)
            continue;
        var widget_height = w.computeSize ? w.computeSize(width)[1] : LiteGraph.NODE_WIDGET_HEIGHT;
        var widget_width = w.width || width;
        // outside
        if ( w != active_widget &&
```

> 片段已按最大行数裁剪。

## 9. `adjustNodesSize`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.ts:1498-1504` (`#L1498`)
- 说明来源：源码注释
- 说明：
> 中文说明：adjustNodesSize 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L1498-L1504）：
```js
export function adjustNodesSize() {
    var nodes = this.graph._nodes;
    for (let i = 0; i < nodes.length; ++i) {
        nodes[i].size = nodes[i].computeSize();
    }
    this.setDirty(true, true);
}
```
