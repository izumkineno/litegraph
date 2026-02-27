# 图形引擎迁移指南（Renderer Adapter）

本项目已引入可替换渲染层：

- `IRenderContext2DCompat`
- `IRenderSurface`
- `IRenderEngineAdapter`
- 默认实现：`Canvas2DRendererAdapter`

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

