# 文件文档：`src/lgraphcanvas/modules/render-nodes.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 13 个文件，导出 115 项（AUTO 115 项），耦合强度 50。
> 关键耦合：出边 `src`(22)、`src/lgraphcanvas/shared`(3)；入边 `src/lgraphcanvas/controllers`(24)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

- 导出项数量：7
- AUTO 说明数量：7

## 1. `drawNode`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.js:4-434` (`#L4`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `drawNode`，定义于 `src/lgraphcanvas/modules/render-nodes.js`。

- 代码片段（L4-L23）：
```js
export function drawNode(node, ctx) {

    this.current_node = node;

    var color = node.color || node.constructor.color || LiteGraph.NODE_DEFAULT_COLOR;
    var bgcolor = node.bgcolor || node.constructor.bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR;
    var low_quality = this.ds.scale < 0.6; // zoomed out

    // only render if it forces it to do it
    if (this.live_mode) {
        if (!node.flags.collapsed) {
            ctx.shadowColor = "transparent";
            node.onDrawForeground?.(ctx, this, this.canvas);
        }
        return;
    }

    var editor_alpha = this.editor_alpha;
    ctx.globalAlpha = editor_alpha;

```

> 片段已按最大行数裁剪。

## 2. `drawNodeTooltip`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.js:436-492` (`#L436`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `drawNodeTooltip`，定义于 `src/lgraphcanvas/modules/render-nodes.js`。

- 代码片段（L436-L455）：
```js
export function drawNodeTooltip( ctx, node ) {
    if(!node || !ctx) {
        LiteGraph.warn?.("drawNodeTooltip: invalid node or ctx",node,ctx);
        return;
    }
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
    // text = text + "\n" + text;
```

> 片段已按最大行数裁剪。

## 3. `drawNodeShape`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.js:494-798` (`#L494`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `drawNodeShape`，定义于 `src/lgraphcanvas/modules/render-nodes.js`。

- 代码片段（L494-L513）：
```js
export function drawNodeShape(node, ctx, size, fgcolor, bgcolor, selected, mouse_over) {
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
    }

```

> 片段已按最大行数裁剪。

## 4. `drawExecutionOrder`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.js:800-834` (`#L800`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `drawExecutionOrder`，定义于 `src/lgraphcanvas/modules/render-nodes.js`。

- 代码片段（L800-L819）：
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

## 5. `drawNodeWidgets`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.js:836-1046` (`#L836`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `drawNodeWidgets`，定义于 `src/lgraphcanvas/modules/render-nodes.js`。

- 代码片段（L836-L855）：
```js
export function drawNodeWidgets(node, posY, ctx, active_widget) {
    if (!node.widgets || !node.widgets.length) {
        return 0;
    }
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
        var y = posY;
```

> 片段已按最大行数裁剪。

## 6. `processNodeWidgets`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.js:1048-1250` (`#L1048`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `processNodeWidgets`，定义于 `src/lgraphcanvas/modules/render-nodes.js`。

- 代码片段（L1048-L1067）：
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

## 7. `adjustNodesSize`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-nodes.js:1252-1258` (`#L1252`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `adjustNodesSize`，定义于 `src/lgraphcanvas/modules/render-nodes.js`。

- 代码片段（L1252-L1258）：
```js
export function adjustNodesSize() {
    var nodes = this.graph._nodes;
    for (let i = 0; i < nodes.length; ++i) {
        nodes[i].size = nodes[i].computeSize();
    }
    this.setDirty(true, true);
}
```
