# 文件文档：`src/lgraphcanvas/modules/render-frame.ts`

## 所属模块介绍

- 模块：`src/lgraphcanvas/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 16 个文件，导出 120 项（AUTO 84 项），耦合强度 47。
> 关键耦合：出边 `src`(21)、`src/lgraphcanvas/shared`(3)、`src/lgraphcanvas/renderer`(2)；入边 `src/lgraphcanvas/controllers`(20)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

- 导出项数量：3
- AUTO 说明数量：0

## 1. `draw`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-frame.ts:4-57` (`#L4`)
- 说明来源：源码注释
- 说明：
> 中文说明：draw 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L4-L23）：
```js
export function draw(force_canvas, force_bgcanvas) {
    const canvas = this.frontSurface?.canvas || this.canvas;
    if (!canvas || canvas.width == 0 || canvas.height == 0) {
        return;
    }

    // fps counting
    var now = LiteGraph.getTime();
    this.render_time = (now - this.last_draw_time) * 0.001;
    this.last_draw_time = now;

    if (this.graph) {
        this.ds.computeVisibleArea(this.viewport);
    }

    if (
        this.dirty_bgcanvas ||
        force_bgcanvas ||
        this.always_render_background ||
        (this.graph &&
```

> 片段已按最大行数裁剪。

## 2. `drawFrontCanvas`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-frame.ts:60-328` (`#L60`)
- 说明来源：源码注释
- 说明：
> 中文说明：drawFrontCanvas 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L60-L79）：
```js
export function drawFrontCanvas() {
    this.dirty_canvas = false;
    const rendererAdapter = this.rendererAdapter ?? null;
    const frontLayerNative = rendererAdapter?.isLayerNative?.("front") === true;
    const backLayerNative = rendererAdapter?.isLayerNative?.("back") === true;

    if (!this.ctx) {
        this.ctx = rendererAdapter?.getFrontCtx?.() ?? this.frontSurface?.getContextCompat?.() ?? null;
    }
    var ctx = this.ctx;
    if (!ctx) {
        // maybe is using webgl...
        return;
    }

    rendererAdapter?.beginFrame?.("front");
    var canvas = this.frontSurface?.canvas || this.canvas;
    if ( ctx.start2D && !this.viewport ) {
        ctx.start2D();
        ctx.restore();
```

> 片段已按最大行数裁剪。

## 3. `lowQualityRenderingRequired`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-frame.ts:331-336` (`#L331`)
- 说明来源：源码注释
- 说明：
> 中文说明：lowQualityRenderingRequired 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L331-L336）：
```js
export function lowQualityRenderingRequired(activation_scale) {
    if ( this.ds.scale < activation_scale) {
        return this.low_quality_rendering_counter > this.low_quality_rendering_threshold;
    }
    return false;
}
```
