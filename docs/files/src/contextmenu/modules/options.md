# 文件文档：`src/contextmenu/modules/options.js`

## 所属模块介绍

- 模块：`src/contextmenu/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/contextmenu/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 9 个文件，导出 16 项（AUTO 16 项），耦合强度 9。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src`(9)。
> 主要导出：`addContextMenuItems`、`appendContextMenuRoot`、`bindContextMenuRootEvents`、`calculateContextMenuBestPosition`、`closeAllContextMenus`、`closeContextMenuInstance`。
> 代表文件：`close-flow.js`、`filtering.js`、`item-actions.js`。

- 导出项数量：1
- AUTO 说明数量：1

## 1. `normalizeContextMenuOptions`

- 类型：`function`
- 位置：`src/contextmenu/modules/options.js:1-4` (`#L1`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `normalizeContextMenuOptions`，定义于 `src/contextmenu/modules/options.js`。

- 代码片段（L1-L6）：
```js
export function normalizeContextMenuOptions(options = {}) {
    options.scroll_speed ??= 0.1;
    return options;
}


```
