# 文件文档：`src/lgraph/modules/lifecycle.js`

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

## 1. `setLifecycleMethodsLiteGraph`

- 类型：`function`
- 位置：`src/lgraph/modules/lifecycle.js:6-8` (`#L6`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setLifecycleMethodsLiteGraph`，定义于 `src/lgraph/modules/lifecycle.js`。

- 代码片段（L6-L11）：
```js
export function setLifecycleMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const lifecycleMethods = {
getSupportedTypes() {
```

## 2. `lifecycleMethods`

- 类型：`variable`
- 位置：`src/lgraph/modules/lifecycle.js:10-44` (`#L10`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `lifecycleMethods`（const），定义于 `src/lgraph/modules/lifecycle.js`。

- 代码片段（L10-L29）：
```js
export const lifecycleMethods = {
getSupportedTypes() {
        return this.supported_types ?? this.constructor.supported_types;
    },

clear() {
        this.stop();
        this.status = this.constructor.STATUS_STOPPED;

        // safe clear
        this._nodes?.forEach((node) => {
            node.onRemoved?.();
        });
        initializeGraphState(this);
        this.configApplyDefaults();

        // notify canvas to redraw
        this.change();

        this.sendActionToCanvas("clear");
```

> 片段已按最大行数裁剪。
