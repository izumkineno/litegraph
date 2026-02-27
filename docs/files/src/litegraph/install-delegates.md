# 文件文档：`src/litegraph/install-delegates.js`

## 所属模块介绍

- 模块：`src/litegraph`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/litegraph` 的职责为：模块化源码目录，承载同一子域下的实现。
> 规模：包含 1 个文件，导出 1 项（AUTO 1 项），耦合强度 25。
> 关键耦合：出边 `src/litegraph/modules`(24)；入边 `src`(1)。
> 主要导出：`installLiteGraphDelegates`。
> 代表文件：`install-delegates.js`。

- 导出项数量：1
- AUTO 说明数量：1

## 1. `installLiteGraphDelegates`

- 类型：`function`
- 位置：`src/litegraph/install-delegates.js:14-67` (`#L14`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `installLiteGraphDelegates`，定义于 `src/litegraph/install-delegates.js`。

- 代码片段（L14-L33）：
```js
export function installLiteGraphDelegates(liteGraph) {
    const proto = Object.getPrototypeOf(liteGraph);

    if (proto.__litegraph_delegates_installed) {
        return;
    }

    setLoggingMethodsLiteGraph(liteGraph);
    setNodeRegistryMethodsLiteGraph(liteGraph);
    setNodeFactoryMethodsLiteGraph(liteGraph);
    setSlotTypesMethodsLiteGraph(liteGraph);
    setTypeCompatMethodsLiteGraph(liteGraph);
    setFileUtilsMethodsLiteGraph(liteGraph);
    setPointerEventsMethodsLiteGraph(liteGraph);
    setObjectUtilsMethodsLiteGraph(liteGraph);
    setMathColorUtilsMethodsLiteGraph(liteGraph);
    setCanvasTextUtilsMethodsLiteGraph(liteGraph);
    setClassUtilsMethodsLiteGraph(liteGraph);
    setLegacyCompatMethodsLiteGraph(liteGraph);

```

> 片段已按最大行数裁剪。
