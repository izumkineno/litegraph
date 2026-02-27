# 文件文档：`src/lgraphcanvas/modules/viewport-coords.js`

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

## 1. `centerOnNode`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/viewport-coords.js:2-12` (`#L2`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `centerOnNode`，定义于 `src/lgraphcanvas/modules/viewport-coords.js`。

- 代码片段（L2-L12）：
```js
export function centerOnNode(node) {
    this.ds.offset[0] =
        -node.pos[0] -
        node.size[0] * 0.5 +
        (this.canvas.width * 0.5) / this.ds.scale;
    this.ds.offset[1] =
        -node.pos[1] -
        node.size[1] * 0.5 +
        (this.canvas.height * 0.5) / this.ds.scale;
    this.setDirty(true, true);
}
```

## 2. `adjustMouseEvent`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/viewport-coords.js:14-37` (`#L14`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `adjustMouseEvent`，定义于 `src/lgraphcanvas/modules/viewport-coords.js`。

- 代码片段（L14-L33）：
```js
export function adjustMouseEvent(e) {
    var clientX_rel = 0;
    var clientY_rel = 0;

    if (this.canvas) {
        var b = this.canvas.getBoundingClientRect();
        clientX_rel = e.clientX - b.left;
        clientY_rel = e.clientY - b.top;
    } else {
        clientX_rel = e.clientX;
        clientY_rel = e.clientY;
    }

    // e.deltaX = clientX_rel - this.last_mouse_position[0];
    // e.deltaY = clientY_rel- this.last_mouse_position[1];

    this.last_mouse_position[0] = clientX_rel;
    this.last_mouse_position[1] = clientY_rel;

    e.canvasX = clientX_rel / this.ds.scale - this.ds.offset[0];
```

> 片段已按最大行数裁剪。

## 3. `setZoom`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/viewport-coords.js:39-63` (`#L39`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setZoom`，定义于 `src/lgraphcanvas/modules/viewport-coords.js`。

- 代码片段（L39-L58）：
```js
export function setZoom(value, zooming_center) {
    this.ds.changeScale(value, zooming_center);
    /*
if(!zooming_center && this.canvas)
    zooming_center = [this.canvas.width * 0.5,this.canvas.height * 0.5];

var center = this.convertOffsetToCanvas( zooming_center );

this.ds.scale = value;

if(this.scale > this.max_zoom)
    this.scale = this.max_zoom;
else if(this.scale < this.min_zoom)
    this.scale = this.min_zoom;

var new_center = this.convertOffsetToCanvas( zooming_center );
var delta_offset = [new_center[0] - center[0], new_center[1] - center[1]];

this.offset[0] += delta_offset[0];
this.offset[1] += delta_offset[1];
```

> 片段已按最大行数裁剪。

## 4. `convertOffsetToCanvas`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/viewport-coords.js:65-67` (`#L65`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `convertOffsetToCanvas`，定义于 `src/lgraphcanvas/modules/viewport-coords.js`。

- 代码片段（L65-L70）：
```js
export function convertOffsetToCanvas(pos, out) {
    return this.ds.convertOffsetToCanvas(pos, out);
}

export function convertCanvasToOffset(pos, out) {
    return this.ds.convertCanvasToOffset(pos, out);
```

## 5. `convertCanvasToOffset`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/viewport-coords.js:69-71` (`#L69`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `convertCanvasToOffset`，定义于 `src/lgraphcanvas/modules/viewport-coords.js`。

- 代码片段（L69-L74）：
```js
export function convertCanvasToOffset(pos, out) {
    return this.ds.convertCanvasToOffset(pos, out);
}

export function convertEventToCanvasOffset(e) {
    var rect = this.canvas.getBoundingClientRect();
```

## 6. `convertEventToCanvasOffset`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/viewport-coords.js:73-79` (`#L73`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `convertEventToCanvasOffset`，定义于 `src/lgraphcanvas/modules/viewport-coords.js`。

- 代码片段（L73-L79）：
```js
export function convertEventToCanvasOffset(e) {
    var rect = this.canvas.getBoundingClientRect();
    return this.convertCanvasToOffset([
        e.clientX - rect.left,
        e.clientY - rect.top,
    ]);
}
```
