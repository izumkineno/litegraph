# 图形引擎迁移指南（Renderer Adapter）

本项目已引入可替换渲染层：

- `IRenderContext2DCompat`
- `IRenderSurface`
- `IRenderEngineAdapter`
- 默认实现：`Canvas2DRendererAdapter`

## 0. 当前渲染模式矩阵（2026-02）

- `legacy`（默认）  
  `renderStyleProfile=legacy` + `renderStyleEngine=legacy`，节点走 `render-nodes.js` 传统 Canvas2D 绘制。
- `uiapi-parity`（Leafer 对齐模式）  
  `rendererAdapter=LeaferUIRendererAdapter(mode=full-leafer)` + `nodeRenderMode=uiapi-parity`，节点仍复用 legacy 绘制算法，但渲染目标切到 Leafer bridge canvas。
- `uiapi-components`（Leafer 组件模式）  
  需要同时满足：
  1. `mode=full-leafer`
  2. `nodeRenderMode=uiapi-components`
  3. `renderStyleProfile=leafer-pragmatic-v1` 或 `leafer-classic-v1`
  4. `renderStyleEngine=leafer-components`

不满足条件时自动回退到 legacy 节点绘制，不中断渲染。

## 1. 当前接入点

- `LGraphCanvas` 构造参数支持注入 `rendererAdapter`（可传实例或构造器）。
- `setCanvas` 中初始化适配器并建立：
  - `frontSurface/backSurface`
  - `ctx/bgctx`
  - `canvas/bgcanvas`（兼容旧代码）
- `drawFrontCanvas/drawBackCanvas` 已优先使用 surface + adapter 取上下文。

## 2. 新引擎最小实现要求

实现一个适配器类，满足：

1. `init({ canvas, ownerDocument })`
2. `resize(width, height)`
3. `getFrontCtx()/getBackCtx()` 返回兼容 `IRenderContext2DCompat` 的对象
4. `getFrontSurface()/getBackSurface()`
5. `blitBackToFront(targetCtx?)`

建议可选实现：

1. `beginFrame/endFrame`
2. `destroy`
3. `adoptExternalContexts`（处理共享上下文或 WebGL 回退）

## 3. 兼容性要求（必须保持）

1. `src/nodes/**` 的 `onDrawBackground/onDrawForeground/onDrawCollapsed/onDrawTitle` 不改签名可运行。
2. `LGraphCanvas` 的旧字段仍可访问：`canvas/bgcanvas/ctx/bgctx`。
3. 右键菜单、拖拽、连线命中仍使用现有坐标链路（`viewport-coords + dragandscale`）。

## 4. 推荐迁移顺序

1. 先实现上下文与表面映射（确保可绘制基础路径、文本、图像）。
2. 对齐前后景分层语义（back 画连线和背景，front 画节点和交互层）。
3. 跑行为回归：节点拖拽、连线创建、框选、缩放、右键菜单。
4. 最后做视觉回归（截图对比）。

## 5. 风险提示

- 若新引擎不是原生 Canvas2D 语义，需要在适配器层补齐 `roundRect/measureText/createPattern` 等行为。
- `start/start2D/finish/finish2D` 仅为可选扩展，不应作为渲染成功前提。

## 6. 组件化节点层（Leafer）

- 组件目录：`src/lgraphcanvas/renderer/leafer-components/`
- 注册表：`registry.js`
  - 节点组件：`node-shell/node-title/node-slots/node-tooltip`
  - Widget 组件：`button/toggle/slider/number/combo/text/string/custom`
- 调度层：`src/lgraphcanvas/renderer/leafer-node-ui-layer.js`
  - `uiapi-components` 时按注册表渲染
  - 组件缺失触发逐节点回退到 legacy
- 双基准 token：
  - `leafer-classic-v1` -> `tokens-classic.js`
  - `leafer-pragmatic-v1` -> `tokens-pragmatic-slate.js`
- 兼容要求保持：
  - `onDrawBackground/onDrawForeground/onDrawCollapsed/onDrawTitle` 签名与调用时机不变
  - `w.draw` / `onDraw*` 继续使用 Canvas 回调层（兼容例外，不迁移到 Leafer 事件链）
  - 交互与命中继续走 LiteGraph 现有 `processMouse*` 和坐标链路
