# 文件文档：`src/contextmenu/modules/statics.js`

## 所属模块介绍

- 模块：`src/contextmenu/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/contextmenu/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 9 个文件，导出 16 项（AUTO 16 项），耦合强度 9。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src`(9)。
> 主要导出：`addContextMenuItems`、`appendContextMenuRoot`、`bindContextMenuRootEvents`、`calculateContextMenuBestPosition`、`closeAllContextMenus`、`closeContextMenuInstance`。
> 代表文件：`close-flow.js`、`filtering.js`、`item-actions.js`。

- 导出项数量：3
- AUTO 说明数量：3

## 1. `closeAllContextMenus`

- 类型：`function`
- 位置：`src/contextmenu/modules/statics.js:1-14` (`#L1`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `closeAllContextMenus`，定义于 `src/contextmenu/modules/statics.js`。

- 代码片段（L1-L14）：
```js
export function closeAllContextMenus(ref_window = window) {
    const elements = ref_window.document.querySelectorAll(".litecontextmenu");
    if (!elements.length) {
        return;
    }

    elements.forEach((element) => {
        if (element.close) {
            element.close();
        } else {
            element.parentNode?.removeChild(element);
        }
    });
}
```

## 2. `triggerContextMenuEvent`

- 类型：`function`
- 位置：`src/contextmenu/modules/statics.js:16-31` (`#L16`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `triggerContextMenuEvent`，定义于 `src/contextmenu/modules/statics.js`。

- 代码片段（L16-L31）：
```js
export function triggerContextMenuEvent(element, event_name, params, origin) {
    const evt = new CustomEvent(event_name, {
        bubbles: true,
        cancelable: true,
        detail: params,
    });
    if (origin) {
        Object.defineProperty(evt, "litegraphTarget", { value: origin });
    }
    if (element.dispatchEvent) {
        element.dispatchEvent(evt);
    } else if (element.__events) {
        element.__events.dispatchEvent(evt);
    }
    return evt;
}
```

## 3. `isCursorOverContextElement`

- 类型：`function`
- 位置：`src/contextmenu/modules/statics.js:33-42` (`#L33`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `isCursorOverContextElement`，定义于 `src/contextmenu/modules/statics.js`。

- 代码片段（L33-L42）：
```js
export function isCursorOverContextElement(event, element, LiteGraph) {
    return LiteGraph.isInsideRectangle(
        event.clientX,
        event.clientY,
        element.left,
        element.top,
        element.width,
        element.height,
    );
}
```
