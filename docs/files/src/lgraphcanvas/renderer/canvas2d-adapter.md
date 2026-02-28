# 文件文档：`src/lgraphcanvas/renderer/canvas2d-adapter.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/renderer`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/renderer` 的职责为：模块化源码目录，承载同一子域下的实现。
> 规模：包含 8 个文件，导出 14 项（AUTO 4 项），耦合强度 8。
> 关键耦合：出边 `src/lgraphcanvas/renderer/leafer-components`(2)、`src`(1)；入边 `src`(3)、`src/lgraphcanvas/modules`(2)。
> 主要导出：`applyRenderContextCompatAliases`、`Canvas2DAdapter`、`Canvas2DRendererAdapter`、`Canvas2DSurface`、`LeaferAdapter`、`LeaferNodeUiLayer`。
> 代表文件：`canvas2d-adapter.js`、`contracts.js`、`leafer-node-ui-layer.js`。

- 导出项数量：2
- AUTO 说明数量：1

## 1. `Canvas2DRendererAdapter`

- 类型：`class`
- 位置：`src/lgraphcanvas/renderer/canvas2d-adapter.js:6-108` (`#L6`)
- 说明来源：源码注释
- 说明：
> Default renderer adapter that preserves existing Canvas2D behavior.

- 代码片段（L6-L25）：
```js
export class Canvas2DRendererAdapter {
    constructor() {
        this.ownerDocument = null;
        this.frontSurface = null;
        this.backSurface = null;
    }

    /**
     * @param {{ canvas: HTMLCanvasElement, ownerDocument?: Document }} options
     * @returns {Canvas2DRendererAdapter}
     */
    init({ canvas, ownerDocument }) {
        this.ownerDocument = ownerDocument ?? canvas?.ownerDocument ?? null;
        this.frontSurface = new Canvas2DSurface(canvas);

        const backCanvas = this.ownerDocument?.createElement
            ? this.ownerDocument.createElement("canvas")
            : document.createElement("canvas");
        backCanvas.width = canvas.width;
        backCanvas.height = canvas.height;
```

> 片段已按最大行数裁剪。

## 2. `Canvas2DAdapter`

- 类型：`named_export`
- 位置：`src/lgraphcanvas/renderer/canvas2d-adapter.js:110-110` (`#L110`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 命名导出 `Canvas2DAdapter`，来自当前模块作用域。

- 代码片段（L106-L111）：
```js
        this.getBackCtx();
    }
}

export { Canvas2DRendererAdapter as Canvas2DAdapter };

```
