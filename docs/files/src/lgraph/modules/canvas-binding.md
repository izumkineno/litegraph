# 文件文档：`src/lgraph/modules/canvas-binding.js`

## 所属模块介绍

- 模块：`src/lgraph/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraph/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 10 个文件，导出 20 项（AUTO 20 项），耦合强度 22。
> 关键耦合：出边 `src/lgraph/shared`(2)；入边 `src/lgraph`(20)。
> 主要导出：`canvasBindingMethods`、`executionOrderMethods`、`graphEventsMethods`、`graphPortsMethods`、`historyMethods`、`lifecycleMethods`。
> 代表文件：`canvas-binding.js`、`execution-order.js`、`graph-events.js`。

- 导出项数量：2
- AUTO 说明数量：2

## 1. `setCanvasBindingMethodsLiteGraph`

- 类型：`function`
- 位置：`src/lgraph/modules/canvas-binding.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setCanvasBindingMethodsLiteGraph`，定义于 `src/lgraph/modules/canvas-binding.js`。

- 代码片段（L3-L8）：
```js
export function setCanvasBindingMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const canvasBindingMethods = {
attachCanvas(graphcanvas) {
```

## 2. `canvasBindingMethods`

- 类型：`variable`
- 位置：`src/lgraph/modules/canvas-binding.js:7-69` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `canvasBindingMethods`（const），定义于 `src/lgraph/modules/canvas-binding.js`。

- 代码片段（L7-L26）：
```js
export const canvasBindingMethods = {
attachCanvas(graphcanvas) {
        if (! graphcanvas instanceof LiteGraph.LGraphCanvas) {
            throw new Error("attachCanvas expects a LiteGraph.LGraphCanvas instance");
        }
        if (graphcanvas.graph && graphcanvas.graph != this) {
            graphcanvas.graph.detachCanvas(graphcanvas);
        }

        graphcanvas.graph = this;
        this.list_of_graphcanvas ??= [];
        this.list_of_graphcanvas.push(graphcanvas);
    },

detachCanvas(graphcanvas) {
        if (!this.list_of_graphcanvas) {
            return;
        }

        var pos = this.list_of_graphcanvas.indexOf(graphcanvas);
```

> 片段已按最大行数裁剪。
