# 文件文档：`src/contextmenu/modules/root-dom.js`

## 所属模块介绍

- 模块：`src/contextmenu/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/contextmenu/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 9 个文件，导出 16 项（AUTO 16 项），耦合强度 9。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src`(9)。
> 主要导出：`addContextMenuItems`、`appendContextMenuRoot`、`bindContextMenuRootEvents`、`calculateContextMenuBestPosition`、`closeAllContextMenus`、`closeContextMenuInstance`。
> 代表文件：`close-flow.js`、`filtering.js`、`item-actions.js`。

- 导出项数量：5
- AUTO 说明数量：5

## 1. `createContextMenuRoot`

- 类型：`function`
- 位置：`src/contextmenu/modules/root-dom.js:1-10` (`#L1`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `createContextMenuRoot`，定义于 `src/contextmenu/modules/root-dom.js`。

- 代码片段（L1-L10）：
```js
export function createContextMenuRoot(contextMenu) {
    const root = contextMenu.root = document.createElement("div");
    if (contextMenu.options.className) {
        root.className = contextMenu.options.className;
    }
    root.classList.add("litegraph", "litecontextmenu", "litemenubar-panel");
    root.style.minWidth = "80px";
    root.style.minHeight = "10px";
    return root;
}
```

## 2. `setContextMenuTitle`

- 类型：`function`
- 位置：`src/contextmenu/modules/root-dom.js:12-23` (`#L12`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setContextMenuTitle`，定义于 `src/contextmenu/modules/root-dom.js`。

- 代码片段（L12-L23）：
```js
export function setContextMenuTitle(contextMenu, title) {
    if (!title) {
        return;
    }
    contextMenu.titleElement ??= document.createElement("div");
    const element = contextMenu.titleElement;
    element.className = "litemenu-title";
    element.innerHTML = title;
    if (!contextMenu.root.parentElement) {
        contextMenu.root.appendChild(element);
    }
}
```

## 3. `addContextMenuItems`

- 类型：`function`
- 位置：`src/contextmenu/modules/root-dom.js:25-36` (`#L25`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `addContextMenuItems`，定义于 `src/contextmenu/modules/root-dom.js`。

- 代码片段（L25-L36）：
```js
export function addContextMenuItems(contextMenu, values) {
    for (let i = 0; i < values.length; i++) {
        let name = values[i];

        if (typeof name !== "string") {
            name = name && name.content !== undefined ? String(name.content) : String(name);
        }

        const value = values[i];
        contextMenu.menu_elements.push(contextMenu.addItem(name, value, contextMenu.options));
    }
}
```

## 4. `resolveContextMenuHost`

- 类型：`function`
- 位置：`src/contextmenu/modules/root-dom.js:38-42` (`#L38`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `resolveContextMenuHost`，定义于 `src/contextmenu/modules/root-dom.js`。

- 代码片段（L38-L43）：
```js
export function resolveContextMenuHost(contextMenu) {
    const doc = contextMenu.options.event?.target.ownerDocument ?? document;
    const parent = doc.fullscreenElement ?? doc.body;
    return { doc, parent };
}

```

## 5. `appendContextMenuRoot`

- 类型：`function`
- 位置：`src/contextmenu/modules/root-dom.js:44-46` (`#L44`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `appendContextMenuRoot`，定义于 `src/contextmenu/modules/root-dom.js`。

- 代码片段（L43-L48）：
```js

export function appendContextMenuRoot(contextMenu, parent) {
    parent.appendChild(contextMenu.root);
}


```
