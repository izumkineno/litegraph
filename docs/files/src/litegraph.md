# 文件文档：`src/litegraph.js`

## 所属模块介绍

- 模块：`src`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/llink.js`
- 介绍：
> Class representing a link object that stores link information between two nodes.

- 导出项数量：1
- AUTO 说明数量：0

## 1. `LiteGraph`

- 类型：`variable`
- 位置：`src/litegraph.js:21-46` (`#L21`)
- 说明来源：源码注释
- 说明：
> @class LiteGraph
> 
> @NOTE:
> Try to avoid adding things to this class.
> https://dzone.com/articles/singleton-anti-pattern

- 代码片段（L21-L40）：
```js
export var LiteGraph = new class {
    constructor() {
        // from OG LiteGraph, just bringing it back for compatibility
        this.LLink = LLink;
        this.LGraph = LGraph;
        setupLGraphDelegates(this);
        this.LGraphNode = LGraphNode;
        setupLGraphNodeDelegates(this);
        this.LGraphGroup = LGraphGroup;
        this.LGraphCanvas = LGraphCanvas;
        this.DragAndScale = DragAndScale;
        this.ContextMenu = ContextMenu;

        installLiteGraphDelegates(this);

        applyCoreDefaults(this);
        applyUiDefaults(this);
        applyBehaviorDefaults(this);
        applySlotsDefaults(this);

```

> 片段已按最大行数裁剪。
