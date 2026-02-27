# 文件文档：`src/litegraph/shared/defaults-behavior.js`

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

## 1. `applyBehaviorDefaults`

- 类型：`function`
- 位置：`src/litegraph/shared/defaults-behavior.js:1-71` (`#L1`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `applyBehaviorDefaults`，定义于 `src/litegraph/shared/defaults-behavior.js`。

- 代码片段（L1-L20）：
```js
export function applyBehaviorDefaults(liteGraph) {
    liteGraph.shift_click_do_break_link_from = false;
    liteGraph.click_do_break_link_to = false;

    liteGraph.pointer_to_mouse_events = Object.freeze({
        pointerdown: "mousedown",
        pointermove: "mousemove",
        pointerup: "mouseup",
        pointercancel: "mouseup",
        pointerover: "mouseover",
        pointerout: "mouseout",
        pointerenter: "mouseenter",
        pointerleave: "mouseleave",
    });

    liteGraph.mouse_to_pointer_events = Object.freeze({
        mousedown: "pointerdown",
        mousemove: "pointermove",
        mouseup: "pointerup",
        mouseover: "pointerover",
```

> 片段已按最大行数裁剪。
