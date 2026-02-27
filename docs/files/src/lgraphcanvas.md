# 文件文档：`src/lgraphcanvas.js`

## 所属模块介绍

- 模块：`src`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/llink.js`
- 介绍：
> Class representing a link object that stores link information between two nodes.

- 导出项数量：1
- AUTO 说明数量：1

## 1. `LGraphCanvas`

- 类型：`class`
- 位置：`src/lgraphcanvas.js:6-137` (`#L6`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出类 `LGraphCanvas`，定义于 `src/lgraphcanvas.js`。

- 代码片段（L6-L25）：
```js
export class LGraphCanvas {
    constructor(canvas, graph, options) {
        options ??= {
            skip_render: false,
            autoresize: false,
            clip_all_nodes: false,
        };
        this.options = options;

        // if(graph === undefined)
        //	throw new Error("No graph assigned");
        this.background_image = LGraphCanvas.DEFAULT_BACKGROUND_IMAGE;

        if (canvas && canvas.constructor === String) {
            canvas = document.querySelector(canvas);
        }

        this.ds = new LiteGraph.DragAndScale();
        this.zoom_modify_alpha = true; // otherwise it generates ugly patterns when scaling down too much

```

> 片段已按最大行数裁剪。
