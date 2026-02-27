# 文件文档：`src/lgraphcanvas/modules/render-frame.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 13 个文件，导出 115 项（AUTO 115 项），耦合强度 50。
> 关键耦合：出边 `src`(22)、`src/lgraphcanvas/shared`(3)；入边 `src/lgraphcanvas/controllers`(24)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

- 导出项数量：3
- AUTO 说明数量：3

## 1. `draw`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-frame.js:2-54` (`#L2`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `draw`，定义于 `src/lgraphcanvas/modules/render-frame.js`。

- 代码片段（L2-L21）：
```js
export function draw(force_canvas, force_bgcanvas) {
    if (!this.canvas || this.canvas.width == 0 || this.canvas.height == 0) {
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
            this.graph._last_trigger_time &&
```

> 片段已按最大行数裁剪。

## 2. `drawFrontCanvas`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-frame.js:56-299` (`#L56`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `drawFrontCanvas`，定义于 `src/lgraphcanvas/modules/render-frame.js`。

- 代码片段（L56-L75）：
```js
export function drawFrontCanvas() {
    this.dirty_canvas = false;

    if (!this.ctx) {
        this.ctx = this.bgcanvas.getContext("2d");
    }
    var ctx = this.ctx;
    if (!ctx) {
        // maybe is using webgl...
        return;
    }

    var canvas = this.canvas;
    if ( ctx.start2D && !this.viewport ) {
        ctx.start2D();
        ctx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // clip dirty area if there is one, otherwise work in full canvas
```

> 片段已按最大行数裁剪。

## 3. `lowQualityRenderingRequired`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/render-frame.js:301-306` (`#L301`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `lowQualityRenderingRequired`，定义于 `src/lgraphcanvas/modules/render-frame.js`。

- 代码片段（L301-L306）：
```js
export function lowQualityRenderingRequired(activation_scale) {
    if ( this.ds.scale < activation_scale) {
        return this.low_quality_rendering_counter > this.low_quality_rendering_threshold;
    }
    return false;
}
```
