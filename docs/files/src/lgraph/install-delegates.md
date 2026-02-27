# 文件文档：`src/lgraph/install-delegates.js`

## 所属模块介绍

- 模块：`src/lgraph`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraph` 的职责为：模块化源码目录，承载同一子域下的实现。
> 规模：包含 1 个文件，导出 1 项（AUTO 1 项），耦合强度 21。
> 关键耦合：出边 `src/lgraph/modules`(20)；入边 `src`(1)。
> 主要导出：`installLGraphDelegates`。
> 代表文件：`install-delegates.js`。

- 导出项数量：1
- AUTO 说明数量：1

## 1. `installLGraphDelegates`

- 类型：`function`
- 位置：`src/lgraph/install-delegates.js:12-56` (`#L12`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `installLGraphDelegates`，定义于 `src/lgraph/install-delegates.js`。

- 代码片段（L12-L31）：
```js
export function installLGraphDelegates(LGraph, LiteGraph) {
    if (LGraph.__delegates_installed) {
        return;
    }

    setLifecycleMethodsLiteGraph(LiteGraph);
    setCanvasBindingMethodsLiteGraph(LiteGraph);
    setRuntimeLoopMethodsLiteGraph(LiteGraph);
    setExecutionOrderMethodsLiteGraph(LiteGraph);
    setNodeMutationMethodsLiteGraph(LiteGraph);
    setNodeQueryMethodsLiteGraph(LiteGraph);
    setGraphPortsMethodsLiteGraph(LiteGraph);
    setGraphEventsMethodsLiteGraph(LiteGraph);
    setSerializationLoadMethodsLiteGraph(LiteGraph);
    setHistoryMethodsLiteGraph(LiteGraph);

    const methodGroups = [
        lifecycleMethods,
        canvasBindingMethods,
        runtimeLoopMethods,
```

> 片段已按最大行数裁剪。
