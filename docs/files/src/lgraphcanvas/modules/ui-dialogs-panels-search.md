# 文件文档：`src/lgraphcanvas/modules/ui-dialogs-panels-search.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 16 个文件，导出 120 项（AUTO 84 项），耦合强度 47。
> 关键耦合：出边 `src`(21)、`src/lgraphcanvas/shared`(3)、`src/lgraphcanvas/renderer`(2)；入边 `src/lgraphcanvas/controllers`(20)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

- 导出项数量：11
- AUTO 说明数量：11

## 1. `prompt`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-dialogs-panels-search.js:3-123` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `prompt`，定义于 `src/lgraphcanvas/modules/ui-dialogs-panels-search.js`。

- 代码片段（L3-L22）：
```js
export function prompt(title = "", value, callback, event, multiline) {

    var dialog = document.createElement("div");
    dialog.is_modified = false;
    dialog.className = "graphdialog rounded";
    if(multiline)
        dialog.innerHTML = "<span class='name'></span> <textarea autofocus class='value'></textarea><button class='rounded'>OK</button>";
    else
        dialog.innerHTML = "<span class='name'></span> <input autofocus type='text' class='value'/><button class='rounded'>OK</button>";

    dialog.close = () => {
        this.prompt_box = null;
        dialog.parentNode?.removeChild(dialog);
    };

    var graphcanvas = LGraphCanvas.active_canvas;
    var canvas = graphcanvas.canvas;
    canvas.parentNode.appendChild(dialog);

    if (this.ds.scale > 1) {
```

> 片段已按最大行数裁剪。

## 2. `showSearchBox`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-dialogs-panels-search.js:125-708` (`#L125`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `showSearchBox`，定义于 `src/lgraphcanvas/modules/ui-dialogs-panels-search.js`。

- 代码片段（L125-L144）：
```js
export function showSearchBox(event, options) {
    // proposed defaults
    var def_options = {
        slot_from: null,
        node_from: null,
        node_to: null,
        do_type_filter: LiteGraph.search_filter_enabled &&
            (
                Object.keys(LiteGraph.registered_slot_in_types || {}).length > 0 ||
                Object.keys(LiteGraph.registered_slot_out_types || {}).length > 0
            ),
        type_filter_in: false, // these are default: pass to set initially set values
        type_filter_out: false,
        show_general_if_none_on_typefilter: true,
        show_general_after_typefiltered: true,
        hide_on_mouse_leave: LiteGraph.search_hide_on_mouse_leave,
        show_all_if_empty: true,
        show_all_on_open: LiteGraph.search_show_all_on_open,
    };
    options = Object.assign(def_options, options || {});
```

> 片段已按最大行数裁剪。

## 3. `showEditPropertyValue`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-dialogs-panels-search.js:710-843` (`#L710`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `showEditPropertyValue`，定义于 `src/lgraphcanvas/modules/ui-dialogs-panels-search.js`。

- 代码片段（L710-L729）：
```js
export function showEditPropertyValue(node, property, options) {
    if (!node || node.properties[property] === undefined) {
        return;
    }

    options = options || {};

    var info = node.getPropertyInfo(property);
    var type = info.type;

    let input_html;

    if (type == "string" || type == "number" || type == "array" || type == "object") {
        input_html = "<input autofocus type='text' class='value'/>";
    } else if ( (type == "enum" || type == "combo") && info.values) {
        LiteGraph.debug?.("CREATING showEditPropertyValue ENUM COMBO",input,type,dialog);
        input_html = "<select autofocus type='text' class='value'>";
        for (let i in info.values) {
            var v = i;
            if( info.values.constructor === Array )
```

> 片段已按最大行数裁剪。

## 4. `createDialog`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-dialogs-panels-search.js:845-943` (`#L845`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `createDialog`，定义于 `src/lgraphcanvas/modules/ui-dialogs-panels-search.js`。

- 代码片段（L845-L864）：
```js
export function createDialog(html, options) {
    var def_options = { checkForInput: false, closeOnLeave: true, closeOnLeave_checkModified: true };
    options = Object.assign(def_options, options || {});

    var dialog = document.createElement("div");
    dialog.className = "graphdialog";
    dialog.innerHTML = html;
    dialog.is_modified = false;

    var rect = this.canvas.getBoundingClientRect();
    var offsetx = -20;
    var offsety = -20;
    if (rect) {
        offsetx -= rect.left;
        offsety -= rect.top;
    }

    if (options.position) {
        offsetx += options.position[0];
        offsety += options.position[1];
```

> 片段已按最大行数裁剪。

## 5. `createPanel`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-dialogs-panels-search.js:945-1136` (`#L945`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `createPanel`，定义于 `src/lgraphcanvas/modules/ui-dialogs-panels-search.js`。

- 代码片段（L945-L964）：
```js
export function createPanel(title, options) {
    options = options || {};

    var ref_window = options.window || window;
    var root = document.createElement("div");
    root.className = "litegraph dialog";
    root.innerHTML = "<div class='dialog-header'><span class='dialog-title'></span></div><div class='dialog-content'></div><div style='display:none;' class='dialog-alt-content'></div><div class='dialog-footer'></div>";
    root.header = root.querySelector(".dialog-header");

    if(options.width)
        root.style.width = options.width + (options.width.constructor === Number ? "px" : "");
    if(options.height)
        root.style.height = options.height + (options.height.constructor === Number ? "px" : "");
    if(options.closable) {
        var close = document.createElement("span");
        close.innerHTML = "&#10005;";
        close.classList.add("close");
        close.addEventListener("click",function() {
            root.close();
        });
```

> 片段已按最大行数裁剪。

## 6. `closePanels`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-dialogs-panels-search.js:1138-1145` (`#L1138`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `closePanels`，定义于 `src/lgraphcanvas/modules/ui-dialogs-panels-search.js`。

- 代码片段（L1138-L1145）：
```js
export function closePanels() {
    var panel = document.querySelector("#node-panel");
    if(panel)
        panel.close();
    panel = document.querySelector("#option-panel");
    if(panel)
        panel.close();
}
```

## 7. `showShowGraphOptionsPanel`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-dialogs-panels-search.js:1147-1232` (`#L1147`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `showShowGraphOptionsPanel`，定义于 `src/lgraphcanvas/modules/ui-dialogs-panels-search.js`。

- 代码片段（L1147-L1166）：
```js
export function showShowGraphOptionsPanel(refOpts, obEv) {
    let graphcanvas;
    if(this.constructor && this.constructor.name == "HTMLDivElement") {
        // assume coming from the menu event click
        if (! obEv?.event?.target?.lgraphcanvas) {
            LiteGraph.warn?.("References not found to add optionPanel",refOpts, obEv); // need a ref to canvas obj
            if (LiteGraph.debug)
                LiteGraph.debug?.("!obEv || !obEv.event || !obEv.event.target || !obEv.event.target.lgraphcanvas",obEv,obEv.event,obEv.event.target,obEv.event.target.lgraphcanvas);
            return;
        }
        graphcanvas = obEv.event.target.lgraphcanvas;
    }else{
        // assume called internally
        graphcanvas = this;
    }
    graphcanvas.closePanels();
    var ref_window = graphcanvas.getCanvasWindow();
    panel = graphcanvas.createPanel("Options",{
        closable: true,
        window: ref_window,
```

> 片段已按最大行数裁剪。

## 8. `showShowNodePanel`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-dialogs-panels-search.js:1234-1381` (`#L1234`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `showShowNodePanel`，定义于 `src/lgraphcanvas/modules/ui-dialogs-panels-search.js`。

- 代码片段（L1234-L1253）：
```js
export function showShowNodePanel(node) {
    this.SELECTED_NODE = node;
    this.closePanels();
    var ref_window = this.getCanvasWindow();

    var graphcanvas = this;
    var panel = this.createPanel(node.title || "",{
        closable: true,
        window: ref_window,
        onOpen: function() {
            graphcanvas.NODEPANEL_IS_OPEN = true;
        },
        onClose: function() {
            graphcanvas.NODEPANEL_IS_OPEN = false;
            graphcanvas.node_panel = null;
        },
    });
    graphcanvas.node_panel = panel;
    panel.id = "node-panel";
    panel.node = node;
```

> 片段已按最大行数裁剪。

## 9. `showSubgraphPropertiesDialog`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-dialogs-panels-search.js:1383-1434` (`#L1383`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `showSubgraphPropertiesDialog`，定义于 `src/lgraphcanvas/modules/ui-dialogs-panels-search.js`。

- 代码片段（L1383-L1402）：
```js
export function showSubgraphPropertiesDialog(node) {
    LiteGraph.log?.("showing subgraph properties dialog");

    var old_panel = this.canvas.parentNode.querySelector(".subgraph_dialog");
    if(old_panel)
        old_panel.close();

    var panel = this.createPanel("Subgraph Inputs",{closable: true, width: 500});
    panel.node = node;
    panel.classList.add("subgraph_dialog");

    function inner_refresh() {
        panel.clear();

        // show currents
        if(node.inputs)
            for(let i = 0; i < node.inputs.length; ++i) {
                var input = node.inputs[i];
                if(input.not_subgraph_input)
                    continue;
```

> 片段已按最大行数裁剪。

## 10. `showSubgraphPropertiesDialogRight`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-dialogs-panels-search.js:1436-1496` (`#L1436`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `showSubgraphPropertiesDialogRight`，定义于 `src/lgraphcanvas/modules/ui-dialogs-panels-search.js`。

- 代码片段（L1436-L1455）：
```js
export function showSubgraphPropertiesDialogRight(node) {

    // LiteGraph.log?.("showing subgraph properties dialog");

    // old_panel if old_panel is exist close it
    var old_panel = this.canvas.parentNode.querySelector(".subgraph_dialog");
    if (old_panel)
        old_panel.close();
    // new panel
    var panel = this.createPanel("Subgraph Outputs", { closable: true, width: 500 });
    panel.node = node;
    panel.classList.add("subgraph_dialog");

    function inner_refresh() {
        panel.clear();
        // show currents
        if (node.outputs)
            for (let i = 0; i < node.outputs.length; ++i) {
                var input = node.outputs[i];
                if (input.not_subgraph_output)
```

> 片段已按最大行数裁剪。

## 11. `checkPanels`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/ui-dialogs-panels-search.js:1498-1509` (`#L1498`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `checkPanels`，定义于 `src/lgraphcanvas/modules/ui-dialogs-panels-search.js`。

- 代码片段（L1498-L1509）：
```js
export function checkPanels() {
    if(!this.canvas)
        return;
    var panels = this.canvas.parentNode.querySelectorAll(".litegraph.dialog");
    for(let i = 0; i < panels.length; ++i) {
        var panel = panels[i];
        if( !panel.node )
            continue;
        if( !panel.node.graph || panel.graph != this.graph )
            panel.close();
    }
}
```
