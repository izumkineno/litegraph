# 文件文档：`src/lgraphnode/modules/misc.js`

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

## 1. `setMiscMethodsLiteGraph`

- 类型：`function`
- 位置：`src/lgraphnode/modules/misc.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setMiscMethodsLiteGraph`，定义于 `src/lgraphnode/modules/misc.js`。

- 代码片段（L3-L8）：
```js
export function setMiscMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const miscMethods = {
alignToGrid() {
```

## 2. `miscMethods`

- 类型：`variable`
- 位置：`src/lgraphnode/modules/misc.js:7-16` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `miscMethods`（const），定义于 `src/lgraphnode/modules/misc.js`。

- 代码片段（L7-L16）：
```js
export const miscMethods = {
alignToGrid() {
        this.pos[0] =
            LiteGraph.CANVAS_GRID_SIZE *
            Math.round(this.pos[0] / LiteGraph.CANVAS_GRID_SIZE);
        this.pos[1] =
            LiteGraph.CANVAS_GRID_SIZE *
            Math.round(this.pos[1] / LiteGraph.CANVAS_GRID_SIZE);
    },
};
```
