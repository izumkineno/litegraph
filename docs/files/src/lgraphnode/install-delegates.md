# 文件文档：`src/lgraphnode/install-delegates.js`

## 所属模块介绍

- 模块：`src/lgraphnode`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphnode` 的职责为：模块化源码目录，承载同一子域下的实现。
> 规模：包含 1 个文件，导出 1 项（AUTO 1 项），耦合强度 23。
> 关键耦合：出边 `src/lgraphnode/modules`(22)；入边 `src`(1)。
> 主要导出：`installLGraphNodeDelegates`。
> 代表文件：`install-delegates.js`。

- 导出项数量：1
- AUTO 说明数量：1

## 1. `installLGraphNodeDelegates`

- 类型：`function`
- 位置：`src/lgraphnode/install-delegates.js:13-49` (`#L13`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `installLGraphNodeDelegates`，定义于 `src/lgraphnode/install-delegates.js`。

- 代码片段（L13-L32）：
```js
export function installLGraphNodeDelegates(LGraphNode, LiteGraph) {
    setLifecycleSerializationMethodsLiteGraph(LiteGraph);
    setPropertiesWidgetsMethodsLiteGraph(LiteGraph);
    setIoDataMethodsLiteGraph(LiteGraph);
    setExecutionActionsMethodsLiteGraph(LiteGraph);
    setSlotsMutationMethodsLiteGraph(LiteGraph);
    setSlotsQueryMethodsLiteGraph(LiteGraph);
    setConnectionsMethodsLiteGraph(LiteGraph);
    setGeometryHitMethodsLiteGraph(LiteGraph);
    setCanvasIntegrationMethodsLiteGraph(LiteGraph);
    setAncestorRefreshMethodsLiteGraph(LiteGraph);
    setMiscMethodsLiteGraph(LiteGraph);

    const methodGroups = [
        lifecycleSerializationMethods,
        propertiesWidgetsMethods,
        ioDataMethods,
        executionActionsMethods,
        slotsMutationMethods,
        slotsQueryMethods,
```

> 片段已按最大行数裁剪。
