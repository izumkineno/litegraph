# 文件文档：`src/contextmenu.js`

## 所属模块介绍

- 模块：`src`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/llink.js`
- 介绍：
> Class representing a link object that stores link information between two nodes.

- 导出项数量：1
- AUTO 说明数量：1

## 1. `ContextMenu`

- 类型：`class`
- 位置：`src/contextmenu.js:22-144` (`#L22`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出类 `ContextMenu`，定义于 `src/contextmenu.js`。

- 代码片段（L22-L41）：
```js
export class ContextMenu {

    /**
    * @constructor
    * @param {Array<Object>} values (allows object { title: "Nice text", callback: function ... })
    * @param {Object} options [optional] Some options:\
    * - title: title to show on top of the menu
    * - callback: function to call when an option is clicked, it receives the item information
    * - ignore_item_callbacks: ignores the callback inside the item, it just calls the options.callback
    * - event: you can pass a MouseEvent, this way the ContextMenu appears in that position
    *
    *   Rendering notes: This is only relevant to rendered graphs, and is rendered using HTML+CSS+JS.
    */
    constructor(values, options = {}) {
        this.options = normalizeContextMenuOptions(options);
        this.menu_elements = [];

        this.#linkToParent();
        this.#validateEventClass();
        this.#createRoot();
```

> 片段已按最大行数裁剪。
