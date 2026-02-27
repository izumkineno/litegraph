# 文件文档：`src/lgraphnode/modules/geometry-hit.js`

## 所属模块介绍

- 模块：`src/lgraphnode/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphnode/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 11 个文件，导出 22 项（AUTO 22 项），耦合强度 22。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src/lgraphnode`(22)。
> 主要导出：`ancestorRefreshMethods`、`canvasIntegrationMethods`、`connectionsMethods`、`executionActionsMethods`、`geometryHitMethods`、`ioDataMethods`。
> 代表文件：`ancestor-refresh.js`、`canvas-integration.js`、`connections.js`。

- 导出项数量：2
- AUTO 说明数量：2

## 1. `setGeometryHitMethodsLiteGraph`

- 类型：`function`
- 位置：`src/lgraphnode/modules/geometry-hit.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setGeometryHitMethodsLiteGraph`，定义于 `src/lgraphnode/modules/geometry-hit.js`。

- 代码片段（L3-L8）：
```js
export function setGeometryHitMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const geometryHitMethods = {
computeSize(out) {
```

## 2. `geometryHitMethods`

- 类型：`variable`
- 位置：`src/lgraphnode/modules/geometry-hit.js:7-248` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `geometryHitMethods`（const），定义于 `src/lgraphnode/modules/geometry-hit.js`。

- 代码片段（L7-L26）：
```js
export const geometryHitMethods = {
computeSize(out) {
        if (this.constructor.size) {
            return this.constructor.size.concat();
        }

        var size = out || new Float32Array([0, 0]);

        var font_size = LiteGraph.NODE_TEXT_SIZE; // although it should be graphcanvas.inner_text_font size

        // computeWidth
        const get_text_width = (text) => {
            if (!text) {
                return 0;
            }
            return font_size * text.length * 0.6;
        };
        var title_width = get_text_width(this.title);
        var input_width = 0;
        var output_width = 0;
```

> 片段已按最大行数裁剪。
