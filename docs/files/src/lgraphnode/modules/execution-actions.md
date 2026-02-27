# 文件文档：`src/lgraphnode/modules/execution-actions.js`

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

## 1. `setExecutionActionsMethodsLiteGraph`

- 类型：`function`
- 位置：`src/lgraphnode/modules/execution-actions.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setExecutionActionsMethodsLiteGraph`，定义于 `src/lgraphnode/modules/execution-actions.js`。

- 代码片段（L3-L8）：
```js
export function setExecutionActionsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const executionActionsMethods = {
addOnTriggerInput() {
```

## 2. `executionActionsMethods`

- 类型：`variable`
- 位置：`src/lgraphnode/modules/execution-actions.js:7-269` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `executionActionsMethods`（const），定义于 `src/lgraphnode/modules/execution-actions.js`。

- 代码片段（L7-L26）：
```js
export const executionActionsMethods = {
addOnTriggerInput() {
        var trigS = this.findInputSlot("onTrigger");
        if (trigS == -1) { // !trigS ||
            this.addInput("onTrigger", LiteGraph.EVENT, {removable: true, nameLocked: true});
            return this.findInputSlot("onTrigger");
        }
        return trigS;
    },

addOnExecutedOutput() {
        var trigS = this.findOutputSlot("onExecuted");
        if (trigS == -1) { // !trigS ||
            this.addOutput("onExecuted", LiteGraph.ACTION, {removable: true, nameLocked: true});
            return this.findOutputSlot("onExecuted");
        }
        return trigS;
    },

onAfterExecuteNode(param, options) {
```

> 片段已按最大行数裁剪。
