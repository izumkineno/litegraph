# 文件文档：`src/lgraphcanvas/renderer/leafer-ui-adapter.ts`

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

## 1. `LeaferUIRendererAdapter`

- 类型：`class`
- 位置：`src/lgraphcanvas/renderer/leafer-ui-adapter.ts:55-262` (`#L55`)
- 说明来源：源码注释
- 说明：
> 中文说明：LeaferUIRendererAdapter 为迁移后的 TS 导出类，封装 Leafer 渲染相关能力。

- 代码片段（L55-L74）：
```js
export class LeaferUIRendererAdapter {
    /**
     * @param {LeaferUIRendererAdapterOptions} options
     */
    constructor(options = {}) {
        this.options = {
            mode: "hybrid-back",
            nodeRenderMode: "legacy-ctx",
            nodeRenderLogs: false,
            enableLogs: true,
            logPrefix: "[LiteGraph][LeaferAdapter]",
            ...options,
        };
        this.ownerDocument = null;
        this.mode = this.options.mode || "hybrid-back";
        this.frontSurface = null;
        this.backSurface = null;
        this._frontLeaferCanvas = null;
        this._backLeaferCanvas = null;
    }
```

> 片段已按最大行数裁剪。

## 2. `LeaferAdapter`

- 类型：`named_export`
- 位置：`src/lgraphcanvas/renderer/leafer-ui-adapter.ts:264-264` (`#L264`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 命名导出 `LeaferAdapter`，来自当前模块作用域。

- 代码片段（L264-L269）：
```js
export { LeaferUIRendererAdapter as LeaferAdapter };





```
