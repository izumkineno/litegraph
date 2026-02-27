# 文件文档：`src/dragandscale.js`

## 所属模块介绍

- 模块：`src`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/llink.js`
- 介绍：
> Class representing a link object that stores link information between two nodes.

- 导出项数量：1
- AUTO 说明数量：0

## 1. `DragAndScale`

- 类型：`class`
- 位置：`src/dragandscale.js:7-244` (`#L7`)
- 说明来源：源码注释
- 说明：
> Class responsible for handling scale and offset transformations for an HTML element,
> enabling zooming and dragging functionalities.

- 代码片段（L7-L26）：
```js
export class DragAndScale {
    /**
     * Creates an instance of DragAndScale.
     * @param {HTMLElement} element - The HTML element to apply scale and offset transformations.
     * @param {boolean} skip_events - Flag indicating whether to skip binding mouse and wheel events.
     *
     * Rendering:
     * toCanvasContext() is HTMLCanvas, and onredraw is probably also.  The rest is all HTML+CSS+JS
     */

    constructor(element, skip_events) {

        this.offset = new Float32Array([0, 0]);
        this.scale = 1;
        this.max_scale = 10;
        this.min_scale = 0.1;
        this.onredraw = null;
        this.enabled = true;
        this.last_mouse = [0, 0];
        this.element = null;
```

> 片段已按最大行数裁剪。
