# 文件文档：`src/litegraph/shared/defaults-slots.js`

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

## 1. `applySlotsDefaults`

- 类型：`function`
- 位置：`src/litegraph/shared/defaults-slots.js:1-15` (`#L1`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `applySlotsDefaults`，定义于 `src/litegraph/shared/defaults-slots.js`。

- 代码片段（L1-L15）：
```js
export function applySlotsDefaults(liteGraph) {
    liteGraph.auto_load_slot_types = false;

    liteGraph.registered_slot_in_types = {};
    liteGraph.registered_slot_out_types = {};
    liteGraph.slot_types_in = [];
    liteGraph.slot_types_out = [];
    liteGraph.slot_types_default_in = [];
    liteGraph.slot_types_default_out = [];

    liteGraph.graphDefaultConfig = {
        align_to_grid: true,
        links_ontop: false,
    };
}
```
