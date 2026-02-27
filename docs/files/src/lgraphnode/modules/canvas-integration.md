# 文件文档：`src/lgraphnode/modules/canvas-integration.js`

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

## 1. `setCanvasIntegrationMethodsLiteGraph`

- 类型：`function`
- 位置：`src/lgraphnode/modules/canvas-integration.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setCanvasIntegrationMethodsLiteGraph`，定义于 `src/lgraphnode/modules/canvas-integration.js`。

- 代码片段（L3-L8）：
```js
export function setCanvasIntegrationMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const canvasIntegrationMethods = {
trace(msg) {
```

## 2. `canvasIntegrationMethods`

- 类型：`variable`
- 位置：`src/lgraphnode/modules/canvas-integration.js:7-85` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `canvasIntegrationMethods`（const），定义于 `src/lgraphnode/modules/canvas-integration.js`。

- 代码片段（L7-L26）：
```js
export const canvasIntegrationMethods = {
trace(msg) {
        if (!this.console) {
            this.console = [];
        }

        this.console.push?.(msg);
        if (this.console.length > this.constructor.MAX_CONSOLE) {
            this.console.shift?.();
        }

        if(this.graph.onNodeTrace)
            this.graph.onNodeTrace(this, msg);
    },

setDirtyCanvas(dirty_foreground, dirty_background) {
        if (!this.graph) {
            return;
        }
        this.graph.sendActionToCanvas("setDirty", [
```

> 片段已按最大行数裁剪。
