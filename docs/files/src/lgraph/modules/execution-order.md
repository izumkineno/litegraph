# 文件文档：`src/lgraph/modules/execution-order.js`

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

## 1. `setExecutionOrderMethodsLiteGraph`

- 类型：`function`
- 位置：`src/lgraph/modules/execution-order.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setExecutionOrderMethodsLiteGraph`，定义于 `src/lgraph/modules/execution-order.js`。

- 代码片段（L3-L8）：
```js
export function setExecutionOrderMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const executionOrderMethods = {
updateExecutionOrder() {
```

## 2. `executionOrderMethods`

- 类型：`variable`
- 位置：`src/lgraph/modules/execution-order.js:7-276` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `executionOrderMethods`（const），定义于 `src/lgraph/modules/execution-order.js`。

- 代码片段（L7-L26）：
```js
export const executionOrderMethods = {
updateExecutionOrder() {
        this._nodes_in_order = this.computeExecutionOrder(false);
        this._nodes_executable = [];
        for (var i = 0; i < this._nodes_in_order.length; ++i) {
            if (this._nodes_in_order[i].onExecute) {
                this._nodes_executable.push(this._nodes_in_order[i]);
            }
        }
    },

computeExecutionOrder(only_onExecute, set_level) {
        var L = [];
        var S = [];
        var M = {};
        var visited_links = {}; // to avoid repeating links
        var remaining_links = {}; // to a

        // search for the nodes without inputs (starting nodes)
        for (let i = 0, l = this._nodes.length; i < l; ++i) {
```

> 片段已按最大行数裁剪。
