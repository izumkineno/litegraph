# 文件文档：`src/lgraph/modules/node-mutation.js`

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

## 1. `setNodeMutationMethodsLiteGraph`

- 类型：`function`
- 位置：`src/lgraph/modules/node-mutation.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setNodeMutationMethodsLiteGraph`，定义于 `src/lgraph/modules/node-mutation.js`。

- 代码片段（L3-L8）：
```js
export function setNodeMutationMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const nodeMutationMethods = {
add(node, skip_compute_order, optsIn = {}) {
```

## 2. `nodeMutationMethods`

- 类型：`variable`
- 位置：`src/lgraph/modules/node-mutation.js:7-201` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `nodeMutationMethods`（const），定义于 `src/lgraph/modules/node-mutation.js`。

- 代码片段（L7-L26）：
```js
export const nodeMutationMethods = {
add(node, skip_compute_order, optsIn = {}) {

        var optsDef = {
            doProcessChange: true,
            doCalcSize: true,
        };
        var opts = Object.assign(optsDef,optsIn);

        if (!node) {
            return;
        }

        // groups
        if (node.constructor === LiteGraph.LGraphGroup) {
            this._groups.push(node);
            this.setDirtyCanvas(true);
            this.change();
            node.graph = this;
            this.onGraphChanged({action: "groupAdd", doSave: opts.doProcessChange});
```

> 片段已按最大行数裁剪。
