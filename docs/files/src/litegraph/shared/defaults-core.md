# 文件文档：`src/litegraph/shared/defaults-core.js`

## 所属模块介绍

- 模块：`src/litegraph/shared`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/litegraph/shared` 的职责为：共享支撑层，提供默认配置与复用工具。
> 规模：包含 4 个文件，导出 4 项（AUTO 4 项），耦合强度 4。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src`(4)。
> 主要导出：`applyBehaviorDefaults`、`applyCoreDefaults`、`applySlotsDefaults`、`applyUiDefaults`。
> 代表文件：`defaults-behavior.js`、`defaults-core.js`、`defaults-slots.js`。

- 导出项数量：1
- AUTO 说明数量：1

## 1. `applyCoreDefaults`

- 类型：`function`
- 位置：`src/litegraph/shared/defaults-core.js:1-88` (`#L1`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `applyCoreDefaults`，定义于 `src/litegraph/shared/defaults-core.js`。

- 代码片段（L1-L20）：
```js
export function applyCoreDefaults(liteGraph) {
    liteGraph.VERSION = "0.10.2";

    liteGraph.CANVAS_GRID_SIZE = 10;
    liteGraph.NODE_TITLE_HEIGHT = 30;
    liteGraph.NODE_TITLE_TEXT_Y = 20;
    liteGraph.NODE_SLOT_HEIGHT = 20;
    liteGraph.NODE_WIDGET_HEIGHT = 20;
    liteGraph.NODE_WIDTH = 140;
    liteGraph.NODE_MIN_WIDTH = 50;
    liteGraph.NODE_COLLAPSED_RADIUS = 10;
    liteGraph.NODE_COLLAPSED_WIDTH = 80;
    liteGraph.NODE_TITLE_COLOR = "#999";
    liteGraph.NODE_SELECTED_TITLE_COLOR = "#FFF";
    liteGraph.NODE_TEXT_SIZE = 14;
    liteGraph.NODE_TEXT_COLOR = "#AAA";
    liteGraph.NODE_SUBTEXT_SIZE = 12;
    liteGraph.NODE_DEFAULT_COLOR = "#333";
    liteGraph.NODE_DEFAULT_BGCOLOR = "#353535";
    liteGraph.NODE_DEFAULT_BOXCOLOR = "#666";
```

> 片段已按最大行数裁剪。
