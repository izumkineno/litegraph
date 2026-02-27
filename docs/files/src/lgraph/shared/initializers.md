# 文件文档：`src/lgraph/shared/initializers.js`

## 所属模块介绍

- 模块：`src/lgraph/shared`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraph/shared` 的职责为：共享支撑层，提供默认配置与复用工具。
> 规模：包含 2 个文件，导出 2 项（AUTO 2 项），耦合强度 2。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src/lgraph/modules`(2)。
> 主要导出：`initializeGraphState`、`mergeOptions`。
> 代表文件：`initializers.js`、`options.js`。

- 导出项数量：1
- AUTO 说明数量：1

## 1. `initializeGraphState`

- 类型：`function`
- 位置：`src/lgraph/shared/initializers.js:1-43` (`#L1`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `initializeGraphState`，定义于 `src/lgraph/shared/initializers.js`。

- 代码片段（L1-L20）：
```js
export function initializeGraphState(graph) {
    graph.last_node_id = 0;
    graph.last_link_id = 0;
    graph._version = -1;

    graph._nodes = [];
    graph._nodes_by_id = {};
    graph._nodes_in_order = [];
    graph._nodes_executable = null;

    graph._groups = [];
    graph.links = {};

    graph.iteration = 0;
    graph.config = {};
    graph.vars = {};
    graph.extra = {};

    graph.globaltime = 0;
    graph.runningtime = 0;
```

> 片段已按最大行数裁剪。
