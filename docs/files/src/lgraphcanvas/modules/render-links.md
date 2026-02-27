# 文件文档：`src/lgraphcanvas/modules/render-links.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 13 个文件，导出 115 项（AUTO 115 项），耦合强度 50。
> 关键耦合：出边 `src`(22)、`src/lgraphcanvas/shared`(3)；入边 `src/lgraphcanvas/controllers`(24)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

- 导出项数量：4
- AUTO 说明数量：4

## 1. `drawLinkTooltip`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-links.js:4-54` (`#L4`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `drawLinkTooltip`，定义于 `src/lgraphcanvas/modules/render-links.js`。

- 代码片段（L4-L23）：
```js
export function drawLinkTooltip(ctx, link) {
    var pos = link._pos;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc( pos[0], pos[1], 3, 0, Math.PI * 2 );
    ctx.fill();

    if(link.data == null)
        return;

    if(this.onDrawLinkTooltip?.(ctx,link,this))
        return;

    var data = link.data;
    var text = null;

    if( data.constructor === Number )
        text = data.toFixed(2);
    else if( data.constructor === String )
        text = "\"" + data + "\"";
```

> 片段已按最大行数裁剪。

## 2. `drawConnections`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-links.js:56-175` (`#L56`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `drawConnections`，定义于 `src/lgraphcanvas/modules/render-links.js`。

- 代码片段（L56-L75）：
```js
export function drawConnections(ctx) {
    var now = LiteGraph.getTime();
    var visible_area = this.visible_area;
    margin_area[0] = visible_area[0] - 20;
    margin_area[1] = visible_area[1] - 20;
    margin_area[2] = visible_area[2] + 40;
    margin_area[3] = visible_area[3] + 40;

    // draw connections
    ctx.lineWidth = this.connections_width;

    ctx.fillStyle = "#AAA";
    ctx.strokeStyle = "#AAA";
    ctx.globalAlpha = this.editor_alpha;
    // for every node
    var nodes = this.graph._nodes;
    for (var n = 0, l = nodes.length; n < l; ++n) {
        var node = nodes[n];
        // for every input (we render just inputs because it is easier as every slot can only have one input)
        if (!node.inputs || !node.inputs.length) {
```

> 片段已按最大行数裁剪。

## 3. `renderLink`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-links.js:177-448` (`#L177`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `renderLink`，定义于 `src/lgraphcanvas/modules/render-links.js`。

- 代码片段（L177-L196）：
```js
export function renderLink(
    ctx,
    a,
    b,
    link,
    skip_border,
    flow,
    color,
    start_dir,
    end_dir,
    num_sublines,
) {
    if (link) {
        this.visible_links.push(link);
    }

    // choose color
    if (!color && link) {
        color = link.color || LGraphCanvas.link_type_colors[link.type];
    }
```

> 片段已按最大行数裁剪。

## 4. `computeConnectionPoint`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-links.js:450-497` (`#L450`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `computeConnectionPoint`，定义于 `src/lgraphcanvas/modules/render-links.js`。

- 代码片段（L450-L469）：
```js
export function computeConnectionPoint(a, b, t, start_dir, end_dir) {
    start_dir = start_dir || LiteGraph.RIGHT;
    end_dir = end_dir || LiteGraph.LEFT;

    var dist = LiteGraph.distance(a, b);
    var p0 = a;
    var p1 = [a[0], a[1]];
    var p2 = [b[0], b[1]];
    var p3 = b;

    switch (start_dir) {
        case LiteGraph.LEFT:
            p1[0] += dist * -0.25;
            break;
        case LiteGraph.RIGHT:
            p1[0] += dist * 0.25;
            break;
        case LiteGraph.UP:
            p1[1] += dist * -0.25;
            break;
```

> 片段已按最大行数裁剪。
