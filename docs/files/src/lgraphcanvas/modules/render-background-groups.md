# 文件文档：`src/lgraphcanvas/modules/render-background-groups.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 13 个文件，导出 115 项（AUTO 115 项），耦合强度 50。
> 关键耦合：出边 `src`(22)、`src/lgraphcanvas/shared`(3)；入边 `src/lgraphcanvas/controllers`(24)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

- 导出项数量：8
- AUTO 说明数量：8

## 1. `drawSubgraphPanel`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-background-groups.js:2-13` (`#L2`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `drawSubgraphPanel`，定义于 `src/lgraphcanvas/modules/render-background-groups.js`。

- 代码片段（L2-L13）：
```js
export function drawSubgraphPanel(ctx) {
    var subgraph = this.graph;
    if( !subgraph)
        return;
    var subnode = subgraph._subgraph_node;
    if (!subnode) {
        LiteGraph.warn?.("subgraph without subnode");
        return;
    }
    this.drawSubgraphPanelLeft(subgraph, subnode, ctx)
    this.drawSubgraphPanelRight(subgraph, subnode, ctx)
}
```

## 2. `drawSubgraphPanelLeft`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-background-groups.js:15-81` (`#L15`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `drawSubgraphPanelLeft`，定义于 `src/lgraphcanvas/modules/render-background-groups.js`。

- 代码片段（L15-L34）：
```js
export function drawSubgraphPanelLeft(subgraph, subnode, ctx) {
    var num = subnode.inputs ? subnode.inputs.length : 0;
    var w = 200;
    var h = Math.floor(LiteGraph.NODE_SLOT_HEIGHT * 1.6);

    ctx.fillStyle = "#111";
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.roundRect(10, 10, w, (num + 1) * h + 50, [8]);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#888";
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Graph Inputs", 20, 34);
    // var pos = this.mouse;

    if (this.drawButton(w - 20, 20, 20, 20, "X", "#151515")) {
        this.closeSubgraph();
```

> 片段已按最大行数裁剪。

## 3. `drawSubgraphPanelRight`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-background-groups.js:83-151` (`#L83`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `drawSubgraphPanelRight`，定义于 `src/lgraphcanvas/modules/render-background-groups.js`。

- 代码片段（L83-L102）：
```js
export function drawSubgraphPanelRight(subgraph, subnode, ctx) {
    var num = subnode.outputs ? subnode.outputs.length : 0;
    var canvas_w = this.bgcanvas.width;
    var w = 200;
    var h = Math.floor(LiteGraph.NODE_SLOT_HEIGHT * 1.6);

    ctx.fillStyle = "#111";
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.roundRect(canvas_w - w - 10, 10, w, (num + 1) * h + 50, [8]);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#888";
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    const title_text = "Graph Outputs";
    var tw = ctx.measureText(title_text).width
    ctx.fillText(title_text, (canvas_w - tw) - 20, 34);
    // var pos = this.mouse;
```

> 片段已按最大行数裁剪。

## 4. `drawButton`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-background-groups.js:153-189` (`#L153`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `drawButton`，定义于 `src/lgraphcanvas/modules/render-background-groups.js`。

- 代码片段（L153-L172）：
```js
export function drawButton(x, y, w, h, text, bgcolor, hovercolor, textcolor) {
    var ctx = this.ctx;
    bgcolor = bgcolor || LiteGraph.NODE_DEFAULT_COLOR;
    hovercolor = hovercolor || "#555";
    textcolor = textcolor || LiteGraph.NODE_TEXT_COLOR;
    var pos = this.ds.convertOffsetToCanvas(this.graph_mouse);
    var hover = LiteGraph.isInsideRectangle( pos[0], pos[1], x,y,w,h );
    pos = this.last_click_position ? [this.last_click_position[0], this.last_click_position[1]] : null;
    if(pos) {
        var rect = this.canvas.getBoundingClientRect();
        pos[0] -= rect.left;
        pos[1] -= rect.top;
    }
    var clicked = pos && LiteGraph.isInsideRectangle( pos[0], pos[1], x,y,w,h );

    ctx.fillStyle = hover ? hovercolor : bgcolor;
    if(clicked)
        ctx.fillStyle = "#AAA";
    ctx.beginPath();
    ctx.roundRect(x,y,w,h,[4] );
```

> 片段已按最大行数裁剪。

## 5. `isAreaClicked`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-background-groups.js:191-198` (`#L191`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `isAreaClicked`，定义于 `src/lgraphcanvas/modules/render-background-groups.js`。

- 代码片段（L191-L198）：
```js
export function isAreaClicked(x, y, w, h, hold_click) {
    var pos = this.last_click_position;
    var clicked = pos && LiteGraph.isInsideRectangle( pos[0], pos[1], x,y,w,h );
    var was_clicked = clicked && !this.block_click;
    if(clicked && hold_click)
        this.blockClick();
    return was_clicked;
}
```

## 6. `renderInfo`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-background-groups.js:200-220` (`#L200`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `renderInfo`，定义于 `src/lgraphcanvas/modules/render-background-groups.js`。

- 代码片段（L200-L219）：
```js
export function renderInfo(ctx, x, y) {
    x = x || 10;
    y = y || this.canvas.height - 80;

    ctx.save();
    ctx.translate(x, y);

    ctx.font = "10px Arial";
    ctx.fillStyle = "#888";
    ctx.textAlign = "left";
    if (this.graph) {
        ctx.fillText( "T: " + this.graph.globaltime.toFixed(2) + "s", 5, 13 * 1 );
        ctx.fillText("I: " + this.graph.iteration, 5, 13 * 2 );
        ctx.fillText("N: " + this.graph._nodes.length + " [" + this.visible_nodes.length + "]", 5, 13 * 3 );
        ctx.fillText("V: " + this.graph._version, 5, 13 * 4);
        ctx.fillText("FPS:" + this.fps.toFixed(2), 5, 13 * 5);
    } else {
        ctx.fillText("No graph selected", 5, 13 * 1);
    }
    ctx.restore();
```

> 片段已按最大行数裁剪。

## 7. `drawBackCanvas`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-background-groups.js:222-384` (`#L222`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `drawBackCanvas`，定义于 `src/lgraphcanvas/modules/render-background-groups.js`。

- 代码片段（L222-L241）：
```js
export function drawBackCanvas() {
    var canvas = this.bgcanvas;

    if (!this.bgctx) {
        this.bgctx = this.bgcanvas.getContext("2d");
    }
    var ctx = this.bgctx;
    if (ctx.start) {
        ctx.start();
    }

    var viewport = this.viewport || [0,0,ctx.canvas.width,ctx.canvas.height];

    // clear
    if (this.clear_background) {
        ctx.clearRect( viewport[0], viewport[1], viewport[2], viewport[3] );
    }

    // show subgraph stack header
    if (this._graph_stack && this._graph_stack.length) {
```

> 片段已按最大行数裁剪。

## 8. `drawGroups`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-background-groups.js:386-428` (`#L386`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `drawGroups`，定义于 `src/lgraphcanvas/modules/render-background-groups.js`。

- 代码片段（L386-L405）：
```js
export function drawGroups(canvas, ctx) {
    if (!this.graph) {
        return;
    }

    var groups = this.graph._groups;

    ctx.save();
    ctx.globalAlpha = 0.5 * this.editor_alpha;

    for (let i = 0; i < groups.length; ++i) {
        var group = groups[i];

        if (!LiteGraph.overlapBounding(this.visible_area, group._bounding)) {
            continue;
        } // out of the visible area

        ctx.fillStyle = group.color || "#335";
        ctx.strokeStyle = group.color || "#335";
        var pos = group._pos;
```

> 片段已按最大行数裁剪。
