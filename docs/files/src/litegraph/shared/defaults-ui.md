# 文件文档：`src/litegraph/shared/defaults-ui.js`

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

## 1. `applyUiDefaults`

- 类型：`function`
- 位置：`src/litegraph/shared/defaults-ui.js:1-46` (`#L1`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `applyUiDefaults`，定义于 `src/litegraph/shared/defaults-ui.js`。

- 代码片段（L1-L20）：
```js
export function applyUiDefaults(liteGraph) {
    liteGraph.searchbox_extras = {};
    liteGraph.auto_sort_node_types = false;

    liteGraph.node_box_coloured_when_on = false;
    liteGraph.node_box_coloured_by_mode = false;

    liteGraph.dialog_close_on_mouse_leave = true;
    liteGraph.dialog_close_on_mouse_leave_delay = 500;

    liteGraph.search_hide_on_mouse_leave = true;
    liteGraph.search_filter_enabled = false;
    liteGraph.search_show_all_on_open = true;

    liteGraph.show_node_tooltip = false;
    liteGraph.show_node_tooltip_use_descr_property = false;

    liteGraph.showCanvasOptions = false;
    liteGraph.availableCanvasOptions = [
        "allow_addOutSlot_onExecuted",
```

> 片段已按最大行数裁剪。
