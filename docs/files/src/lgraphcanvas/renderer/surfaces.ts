# 文件文档：`src/lgraphcanvas/renderer/surfaces.ts`

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
- AUTO 说明数量：0

## 1. `Canvas2DSurface`

- 类型：`class`
- 位置：`src/lgraphcanvas/renderer/surfaces.ts:5-36` (`#L5`)
- 说明来源：源码注释
- 说明：
> 中文说明：Canvas2DSurface 为迁移后的 TS 导出类，封装 Leafer 渲染相关能力。

- 代码片段（L5-L24）：
```js
export class Canvas2DSurface {
    /**
     * @param {HTMLCanvasElement | null} canvas
     * @param {CanvasRenderingContext2D | null} context
     */
    constructor(canvas, context = null) {
        this.canvas = canvas;
        this._context = context;
    }

    /**
     * @returns {CanvasRenderingContext2D | null}
     */
    getContextCompat() {
        if (!this._context && this.canvas?.getContext) {
            this._context = this.canvas.getContext("2d");
        }
        return applyRenderContextCompatAliases(this._context);
    }

```

> 片段已按最大行数裁剪。

## 2. `LeaferSurface`

- 类型：`class`
- 位置：`src/lgraphcanvas/renderer/surfaces.ts:39-78` (`#L39`)
- 说明来源：源码注释
- 说明：
> 中文说明：LeaferSurface 为迁移后的 TS 导出类，封装 Leafer 渲染相关能力。

- 代码片段（L39-L58）：
```js
export class LeaferSurface {
    /**
     * @param {any} leaferCanvas
     */
    constructor(leaferCanvas) {
        this.leaferCanvas = leaferCanvas;
        this.canvas = leaferCanvas?.view ?? null;
    }

    /**
     * @returns {any}
     */
    getContextCompat() {
        const ctx = this.leaferCanvas?.context ?? null;
        return applyRenderContextCompatAliases(ctx);
    }

    /**
     * @param {number} width
     * @param {number} height
```

> 片段已按最大行数裁剪。
