# 文件文档：`src/lgraphcanvas/modules/ui-menus.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 13 个文件，导出 115 项（AUTO 115 项），耦合强度 50。
> 关键耦合：出边 `src`(22)、`src/lgraphcanvas/shared`(3)；入边 `src/lgraphcanvas/controllers`(24)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

- 导出项数量：7
- AUTO 说明数量：7

## 1. `showLinkMenu`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-menus.js:3-52` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `showLinkMenu`，定义于 `src/lgraphcanvas/modules/ui-menus.js`。

- 代码片段（L3-L22）：
```js
export function showLinkMenu(link, e) {
    var that = this;
    // LiteGraph.log?.(link);
    var node_left = that.graph.getNodeById( link.origin_id );
    var node_right = that.graph.getNodeById( link.target_id );
    var fromType = false;
    if (node_left && node_left.outputs && node_left.outputs[link.origin_slot]) fromType = node_left.outputs[link.origin_slot].type;
    var destType = false;
    if (node_right && node_right.outputs && node_right.outputs[link.target_slot]) destType = node_right.inputs[link.target_slot].type;

    var options = ["Add Node", null, "Delete"];
    var menu = new LiteGraph.ContextMenu(options, {
        event: e,
        title: link.data != null ? link.data.constructor.name : null,
        callback: inner_clicked,
    });

    function inner_clicked(v,options,e) {
        switch (v) {
            case "Add Node":
```

> 片段已按最大行数裁剪。

## 2. `createDefaultNodeForSlot`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-menus.js:54-201` (`#L54`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `createDefaultNodeForSlot`，定义于 `src/lgraphcanvas/modules/ui-menus.js`。

- 代码片段（L54-L73）：
```js
export function createDefaultNodeForSlot(optPass = {}) { // addNodeMenu for connection
    var opts = Object.assign(
        {
            nodeFrom: null, // input
            slotFrom: null, // input
            nodeTo: null, // output
            slotTo: null, // output
            position: [],	// pass the event coords
            nodeType: null,	// choose a nodetype to add, AUTO to set at first good
            posAdd: [0,0],	// adjust x,y
            posSizeFix: [0,0], // alpha, adjust the position x,y based on the new node size w,h
        },
        optPass,
    );
    var that = this;

    var isFrom = opts.nodeFrom && opts.slotFrom!==null;
    var isTo = !isFrom && opts.nodeTo && opts.slotTo!==null;

    if (!isFrom && !isTo) {
```

> 片段已按最大行数裁剪。

## 3. `showConnectionMenu`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-menus.js:203-294` (`#L203`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `showConnectionMenu`，定义于 `src/lgraphcanvas/modules/ui-menus.js`。

- 代码片段（L203-L222）：
```js
export function showConnectionMenu(optPass = {}) { // addNodeMenu for connection

    var opts = Object.assign({
        nodeFrom: null, // input
        slotFrom: null, // input
        nodeTo: null, // output
        slotTo: null, // output
        e: null,
    },optPass);

    var that = this;
    var isFrom = opts.nodeFrom && opts.slotFrom;
    var isTo = !isFrom && opts.nodeTo && opts.slotTo;

    if (!isFrom && !isTo) {
        LiteGraph.warn?.("No data passed to showConnectionMenu");
        return false;
    }

    var nodeX = isFrom ? opts.nodeFrom : opts.nodeTo;
```

> 片段已按最大行数裁剪。

## 4. `getCanvasMenuOptions`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-menus.js:296-339` (`#L296`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `getCanvasMenuOptions`，定义于 `src/lgraphcanvas/modules/ui-menus.js`。

- 代码片段（L296-L315）：
```js
export function getCanvasMenuOptions() {
    var options = null;
    if (this.getMenuOptions) {
        options = this.getMenuOptions();
    } else {
        options = [
            {
                content: "Add Node",
                has_submenu: true,
                callback: LGraphCanvas.onMenuAdd,
            },
            { content: "Add Group", callback: LGraphCanvas.onGroupAdd },
            // { content: "Arrange", callback: that.graph.arrange },
            // {content:"Collapse All", callback: LGraphCanvas.onMenuCollapseAll }
        ];
        if (LiteGraph.showCanvasOptions) {
            options.push({ content: "Options", callback: this.showShowGraphOptionsPanel });
        }

        if (Object.keys(this.selected_nodes).length > 1) {
```

> 片段已按最大行数裁剪。

## 5. `getNodeMenuOptions`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-menus.js:341-452` (`#L341`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `getNodeMenuOptions`，定义于 `src/lgraphcanvas/modules/ui-menus.js`。

- 代码片段（L341-L360）：
```js
export function getNodeMenuOptions(node) {
    var options = null;

    if (node.getMenuOptions) {
        options = node.getMenuOptions(this);
    } else {
        options = [
            {
                content: "Inputs",
                has_submenu: true,
                disabled: true,
                callback: LGraphCanvas.showMenuNodeOptionalInputs,
            },
            {
                content: "Outputs",
                has_submenu: true,
                disabled: true,
                callback: LGraphCanvas.showMenuNodeOptionalOutputs,
            },
            null,
```

> 片段已按最大行数裁剪。

## 6. `getGroupMenuOptions`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-menus.js:454-473` (`#L454`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `getGroupMenuOptions`，定义于 `src/lgraphcanvas/modules/ui-menus.js`。

- 代码片段（L454-L473）：
```js
export function getGroupMenuOptions() {
    var o = [
        { content: "Title", callback: LGraphCanvas.onShowPropertyEditor },
        {
            content: "Color",
            has_submenu: true,
            callback: LGraphCanvas.onMenuNodeColors,
        },
        {
            content: "Font size",
            property: "font_size",
            type: "Number",
            callback: LGraphCanvas.onShowPropertyEditor,
        },
        null,
        { content: "Remove", callback: LGraphCanvas.onMenuNodeRemove },
    ];

    return o;
}
```

## 7. `processContextMenu`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-menus.js:475-625` (`#L475`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `processContextMenu`，定义于 `src/lgraphcanvas/modules/ui-menus.js`。

- 代码片段（L475-L494）：
```js
export function processContextMenu(node, event) {
    var that = this;
    var canvas = LGraphCanvas.active_canvas;
    var ref_window = canvas.getCanvasWindow();

    var menu_info = null;
    var options = {
        event: event,
        callback: inner_option_clicked,
        extra: node,
    };

    if(node)
        options.title = node.type;

    // check if mouse is in input
    var slot = null;
    if (node) {
        slot = node.getSlotInPosition(event.canvasX, event.canvasY);
        LGraphCanvas.active_node = node;
```

> 片段已按最大行数裁剪。
