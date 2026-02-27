# 文件文档：`src/lgraph.js`

## 所属模块介绍

- 模块：`src`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/llink.js`
- 介绍：
> Class representing a link object that stores link information between two nodes.

- 导出项数量：2
- AUTO 说明数量：1

## 1. `LGraph`

- 类型：`class`
- 位置：`src/lgraph.js:11-32` (`#L11`)
- 说明来源：源码注释
- 说明：
> LGraph is the class that contain a full graph. We instantiate one and add nodes to it, and then we can run the execution loop.
> supported callbacks:
>     + onNodeAdded: when a new node is added to the graph
>     + onNodeRemoved: when a node inside this graph is removed
>     + onNodeConnectionChange: some connection has changed in the graph (connected or disconnected)

- 代码片段（L11-L30）：
```js
export class LGraph {

    // default supported types
    static supported_types = ["number", "string", "boolean"];

    static STATUS_STOPPED = 1;
    static STATUS_RUNNING = 2;

    /**
     * @constructor
     * @param {Object} o data from previous serialization [optional]} o
     */
    constructor(o) {
        LiteGraph.log?.("Graph created");
        this.list_of_graphcanvas = null;
        this.clear();

        if (o) {
            this.configure(o);
        }
```

> 片段已按最大行数裁剪。

## 2. `setupLGraphDelegates`

- 类型：`function`
- 位置：`src/lgraph.js:34-36` (`#L34`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setupLGraphDelegates`，定义于 `src/lgraph.js`。

- 代码片段（L32-L37）：
```js
}

export function setupLGraphDelegates(liteGraph = LiteGraph) {
    installLGraphDelegates(LGraph, liteGraph);
}

```
