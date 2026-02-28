# 文件文档：`src/lgraphcanvas/renderer/leafer-node-ui-layer.ts`

## 所属模块介绍

- 模块：`src/lgraphcanvas/renderer`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/renderer` 的职责为：模块化源码目录，承载同一子域下的实现。
> 规模：包含 8 个文件，导出 14 项（AUTO 4 项），耦合强度 8。
> 关键耦合：出边 `src/lgraphcanvas/renderer/leafer-components`(2)、`src`(1)；入边 `src`(3)、`src/lgraphcanvas/modules`(2)。
> 主要导出：`applyRenderContextCompatAliases`、`Canvas2DAdapter`、`Canvas2DRendererAdapter`、`Canvas2DSurface`、`LeaferAdapter`、`LeaferNodeUiLayer`。
> 代表文件：`canvas2d-adapter.js`、`contracts.js`、`leafer-node-ui-layer.js`。

- 导出项数量：1
- AUTO 说明数量：0

## 1. `LeaferNodeUiLayer`

- 类型：`class`
- 位置：`src/lgraphcanvas/renderer/leafer-node-ui-layer.ts:236-957` (`#L236`)
- 说明来源：源码注释
- 说明：
> 中文说明：LeaferNodeUiLayer 为迁移后的 TS 导出类，封装 Leafer 渲染相关能力。

- 代码片段（L236-L255）：
```js
export class LeaferNodeUiLayer {
    constructor() {
        this.runtime = null;
        this.ownerDocument = null;
        this.enableLogs = false;
        this._bridgeCanvas = null;
        this._leafer = null;
        this._rootGroup = null;
        this._nodeViews = new Map();
        this._visibleNodeKeys = new Set();
        this._active = false;
        this._nodeRenderMode = "uiapi-parity";
        this._renderStyleProfile = "legacy";
        this._parityContext = null;
    }

    _log(message, meta) {
        if (!this.enableLogs) {
            return;
        }
```

> 片段已按最大行数裁剪。
