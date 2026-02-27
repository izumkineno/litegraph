# 文件文档：`src/lgraphnode.js`

## 所属模块介绍

- 模块：`src`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/llink.js`
- 介绍：
> Class representing a link object that stores link information between two nodes.

- 导出项数量：2
- AUTO 说明数量：1

## 1. `LGraphNode`

- 类型：`class`
- 位置：`src/lgraphnode.js:61-102` (`#L61`)
- 说明来源：源码注释
- 说明：
> Base Class for all the node type classes
> @class LGraphNode
> @param {String} name a name for the node

- 代码片段（L61-L80）：
```js
export class LGraphNode {

    constructor(title = "Unnamed") {

        this.title = title;
        this.size = [LiteGraph.NODE_WIDTH, 60];
        this.graph = null;

        this._pos = new Float32Array(10, 10);

        if (LiteGraph.use_uuids) {
            this.id = LiteGraph.uuidv4();
        } else {
            this.id = -1; // not know till not added
        }
        this.type = null;

        // inputs available: array of inputs
        this.inputs = [];
        this.outputs = [];
```

> 片段已按最大行数裁剪。

## 2. `setupLGraphNodeDelegates`

- 类型：`function`
- 位置：`src/lgraphnode.js:104-106` (`#L104`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setupLGraphNodeDelegates`，定义于 `src/lgraphnode.js`。

- 代码片段（L102-L107）：
```js
}

export function setupLGraphNodeDelegates(liteGraph = LiteGraph) {
    installLGraphNodeDelegates(LGraphNode, liteGraph);
}

```
