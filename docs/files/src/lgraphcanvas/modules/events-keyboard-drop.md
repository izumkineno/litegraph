# 文件文档：`src/lgraphcanvas/modules/events-keyboard-drop.js`

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

## 1. `blockClick`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/events-keyboard-drop.js:3-6` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `blockClick`，定义于 `src/lgraphcanvas/modules/events-keyboard-drop.js`。

- 代码片段（L3-L8）：
```js
export function blockClick() {
    this.block_click = true;
    this.last_mouseclick = 0;
}

export function processKey(e) {
```

## 2. `processKey`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/events-keyboard-drop.js:8-104` (`#L8`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `processKey`，定义于 `src/lgraphcanvas/modules/events-keyboard-drop.js`。

- 代码片段（L8-L27）：
```js
export function processKey(e) {
    if (!this.graph) {
        return;
    }

    var block_default = false;
    // LiteGraph.log?.(e); //debug

    if (e.target.localName == "input") {
        return;
    }

    if (e.type == "keydown") {
        if (e.keyCode == 32) {
            // space
            this.dragging_canvas = true;
            block_default = true;
        }

        if (e.keyCode == 27) {
```

> 片段已按最大行数裁剪。

## 3. `processDrop`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/events-keyboard-drop.js:106-187` (`#L106`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `processDrop`，定义于 `src/lgraphcanvas/modules/events-keyboard-drop.js`。

- 代码片段（L106-L125）：
```js
export function processDrop(e) {
    e.preventDefault();
    this.adjustMouseEvent(e);
    var x = e.clientX;
    var y = e.clientY;
    var is_inside = !this.viewport || ( this.viewport && x >= this.viewport[0] && x < (this.viewport[0] + this.viewport[2]) && y >= this.viewport[1] && y < (this.viewport[1] + this.viewport[3]) );
    if(!is_inside) {
        return;
        // --- BREAK ---
    }

    x = e.localX;
    y = e.localY;
    var is_inside = !this.viewport || ( this.viewport && x >= this.viewport[0] && x < (this.viewport[0] + this.viewport[2]) && y >= this.viewport[1] && y < (this.viewport[1] + this.viewport[3]) );
    if(!is_inside) {
        return;
        // --- BREAK ---
    }

    var pos = [e.canvasX, e.canvasY];
```

> 片段已按最大行数裁剪。

## 4. `checkDropItem`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/events-keyboard-drop.js:189-204` (`#L189`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `checkDropItem`，定义于 `src/lgraphcanvas/modules/events-keyboard-drop.js`。

- 代码片段（L189-L204）：
```js
export function checkDropItem(e) {
    if (e.dataTransfer.files.length) {
        var file = e.dataTransfer.files[0];
        var ext = LGraphCanvas.getFileExtension(file.name).toLowerCase();
        var nodetype = LiteGraph.node_types_by_file_extension[ext];
        if (nodetype) {
            this.graph.beforeChange();
            var node = LiteGraph.createNode(nodetype.type);
            node.pos = [e.canvasX, e.canvasY];
            this.graph.add(node, false, {doProcessChange: false});
            node.onDropFile?.(file);
            this.graph.onGraphChanged({action: "fileDrop", doSave: true});
            this.graph.afterChange();
        }
    }
}
```
