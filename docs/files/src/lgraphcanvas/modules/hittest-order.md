# 文件文档：`src/lgraphcanvas/modules/hittest-order.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 13 个文件，导出 115 项（AUTO 115 项），耦合强度 50。
> 关键耦合：出边 `src`(22)、`src/lgraphcanvas/shared`(3)；入边 `src/lgraphcanvas/controllers`(24)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

- 导出项数量：6
- AUTO 说明数量：6

## 1. `isOverNodeBox`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/hittest-order.js:3-18` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `isOverNodeBox`，定义于 `src/lgraphcanvas/modules/hittest-order.js`。

- 代码片段（L3-L18）：
```js
export function isOverNodeBox(node, canvasx, canvasy) {
    var title_height = LiteGraph.NODE_TITLE_HEIGHT;
    if (
        LiteGraph.isInsideRectangle(
            canvasx,
            canvasy,
            node.pos[0] + 2,
            node.pos[1] + 2 - title_height,
            title_height - 4,
            title_height - 4,
        )
    ) {
        return true;
    }
    return false;
}
```

## 2. `isOverNodeInput`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/hittest-order.js:20-54` (`#L20`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `isOverNodeInput`，定义于 `src/lgraphcanvas/modules/hittest-order.js`。

- 代码片段（L20-L39）：
```js
export function isOverNodeInput(node, canvasx, canvasy, slot_pos) {
    if (node.inputs) {
        for (let i = 0, l = node.inputs.length; i < l; ++i) {
            var link_pos = node.getConnectionPos(true, i);
            var is_inside = false;
            if (node.horizontal) {
                is_inside = LiteGraph.isInsideRectangle(
                    canvasx,
                    canvasy,
                    link_pos[0] - 5,
                    link_pos[1] - 10,
                    10,
                    20,
                );
            } else {
                is_inside = LiteGraph.isInsideRectangle(
                    canvasx,
                    canvasy,
                    link_pos[0] - 10,
                    link_pos[1] - 5,
```

> 片段已按最大行数裁剪。

## 3. `isOverNodeOutput`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/hittest-order.js:56-90` (`#L56`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `isOverNodeOutput`，定义于 `src/lgraphcanvas/modules/hittest-order.js`。

- 代码片段（L56-L75）：
```js
export function isOverNodeOutput(node, canvasx, canvasy, slot_pos) {
    if (node.outputs) {
        for (let i = 0, l = node.outputs.length; i < l; ++i) {
            var link_pos = node.getConnectionPos(false, i);
            var is_inside = false;
            if (node.horizontal) {
                is_inside = LiteGraph.isInsideRectangle(
                    canvasx,
                    canvasy,
                    link_pos[0] - 5,
                    link_pos[1] - 10,
                    10,
                    20,
                );
            } else {
                is_inside = LiteGraph.isInsideRectangle(
                    canvasx,
                    canvasy,
                    link_pos[0] - 10,
                    link_pos[1] - 5,
```

> 片段已按最大行数裁剪。

## 4. `bringToFront`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/hittest-order.js:92-100` (`#L92`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `bringToFront`，定义于 `src/lgraphcanvas/modules/hittest-order.js`。

- 代码片段（L92-L100）：
```js
export function bringToFront(node) {
    var i = this.graph._nodes.indexOf(node);
    if (i == -1) {
        return;
    }

    this.graph._nodes.splice(i, 1);
    this.graph._nodes.push(node);
}
```

## 5. `sendToBack`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/hittest-order.js:102-110` (`#L102`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `sendToBack`，定义于 `src/lgraphcanvas/modules/hittest-order.js`。

- 代码片段（L102-L110）：
```js
export function sendToBack(node) {
    var i = this.graph._nodes.indexOf(node);
    if (i == -1) {
        return;
    }

    this.graph._nodes.splice(i, 1);
    this.graph._nodes.unshift(node);
}
```

## 6. `computeVisibleNodes`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/hittest-order.js:112-131` (`#L112`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `computeVisibleNodes`，定义于 `src/lgraphcanvas/modules/hittest-order.js`。

- 代码片段（L112-L131）：
```js
export function computeVisibleNodes(nodes, out) {
    var visible_nodes = out || [];
    visible_nodes.length = 0;
    nodes = nodes || this.graph._nodes;
    for (var i = 0, l = nodes.length; i < l; ++i) {
        var n = nodes[i];

        // skip rendering nodes in live mode
        if (this.live_mode && !n.onDrawBackground && !n.onDrawForeground) {
            continue;
        }

        if (!LiteGraph.overlapBounding(this.visible_area, n.getBounding(temp, true))) {
            continue;
        } // out of the visible area

        visible_nodes.push(n);
    }
    return visible_nodes;
}
```
