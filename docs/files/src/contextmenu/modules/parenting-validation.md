# 文件文档：`src/contextmenu/modules/parenting-validation.js`

## 所属模块介绍

- 模块：`src/contextmenu/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/contextmenu/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 9 个文件，导出 16 项（AUTO 16 项），耦合强度 9。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src`(9)。
> 主要导出：`addContextMenuItems`、`appendContextMenuRoot`、`bindContextMenuRootEvents`、`calculateContextMenuBestPosition`、`closeAllContextMenus`、`closeContextMenuInstance`。
> 代表文件：`close-flow.js`、`filtering.js`、`item-actions.js`。

- 导出项数量：2
- AUTO 说明数量：2

## 1. `linkContextMenuToParent`

- 类型：`function`
- 位置：`src/contextmenu/modules/parenting-validation.js:1-14` (`#L1`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `linkContextMenuToParent`，定义于 `src/contextmenu/modules/parenting-validation.js`。

- 代码片段（L1-L14）：
```js
export function linkContextMenuToParent(contextMenu, LiteGraph) {
    const parentMenu = contextMenu.options.parentMenu;
    if (!parentMenu) {
        return;
    }
    if (parentMenu.constructor !== contextMenu.constructor) {
        LiteGraph.error?.("parentMenu must be of class ContextMenu, ignoring it");
        contextMenu.options.parentMenu = null;
        return;
    }
    contextMenu.parentMenu = parentMenu;
    contextMenu.parentMenu.lock = true;
    contextMenu.parentMenu.current_submenu = contextMenu;
}
```

## 2. `validateContextMenuEventClass`

- 类型：`function`
- 位置：`src/contextmenu/modules/parenting-validation.js:16-31` (`#L16`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `validateContextMenuEventClass`，定义于 `src/contextmenu/modules/parenting-validation.js`。

- 代码片段（L16-L31）：
```js
export function validateContextMenuEventClass(contextMenu, LiteGraph) {
    if (!contextMenu.options.event) {
        return;
    }

    // use strings because comparing classes between windows doesnt work
    const eventClass = contextMenu.options.event.constructor.name;
    if (
        eventClass !== "MouseEvent" &&
        eventClass !== "CustomEvent" &&
        eventClass !== "PointerEvent"
    ) {
        LiteGraph.error?.(`Event passed to ContextMenu is not of type MouseEvent or CustomEvent. Ignoring it. (${eventClass})`);
        contextMenu.options.event = null;
    }
}
```
