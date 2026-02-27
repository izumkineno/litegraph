# 文件文档：`src/lgraphnode/modules/connections.js`

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

## 1. `setConnectionsMethodsLiteGraph`

- 类型：`function`
- 位置：`src/lgraphnode/modules/connections.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setConnectionsMethodsLiteGraph`，定义于 `src/lgraphnode/modules/connections.js`。

- 代码片段（L3-L8）：
```js
export function setConnectionsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const connectionsMethods = {
connectByType(slot, target_node, target_slotType = "*", optsIn = {}) {
```

## 2. `connectionsMethods`

- 类型：`variable`
- 位置：`src/lgraphnode/modules/connections.js:7-506` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `connectionsMethods`（const），定义于 `src/lgraphnode/modules/connections.js`。

- 代码片段（L7-L26）：
```js
export const connectionsMethods = {
connectByType(slot, target_node, target_slotType = "*", optsIn = {}) {
        var optsDef = {
            createEventInCase: true,
            firstFreeIfOutputGeneralInCase: true,
            generalTypeInCase: true,
        };
        var opts = Object.assign(optsDef,optsIn);
        if (target_node && target_node.constructor === Number) {
            target_node = this.graph.getNodeById(target_node);
        }
        var target_slot = target_node.findInputSlotByType(target_slotType, false, true);
        if (target_slot >= 0 && target_slot !== null) {
            LiteGraph.debug?.("CONNbyTYPE type "+target_slotType+" for "+target_slot)
            return this.connect(slot, target_node, target_slot);
        }else{
            // LiteGraph.log?.("type "+target_slotType+" not found or not free?")
            if (opts.createEventInCase && target_slotType == LiteGraph.EVENT) {
                // WILL CREATE THE onTrigger IN SLOT
                LiteGraph.debug?.("connect WILL CREATE THE onTrigger "+target_slotType+" to "+target_node);
```

> 片段已按最大行数裁剪。
