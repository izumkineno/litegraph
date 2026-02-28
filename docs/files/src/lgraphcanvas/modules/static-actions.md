# 文件文档：`src/lgraphcanvas/modules/static-actions.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 16 个文件，导出 120 项（AUTO 84 项），耦合强度 47。
> 关键耦合：出边 `src`(21)、`src/lgraphcanvas/shared`(3)、`src/lgraphcanvas/renderer`(2)；入边 `src/lgraphcanvas/controllers`(20)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

- 导出项数量：25
- AUTO 说明数量：25

## 1. `getFileExtension`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:4-14` (`#L4`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `getFileExtension`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L4-L14）：
```js
export function getFileExtension(url) {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const lastDotIndex = path.lastIndexOf(".");

    if (lastDotIndex === -1) {
        return "";
    }

    return path.slice(lastDotIndex + 1).toLowerCase();
}
```

## 2. `onGroupAdd`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:16-21` (`#L16`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onGroupAdd`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L16-L21）：
```js
export function onGroupAdd(info, entry, mouse_event) {
    var canvas = LGraphCanvas.active_canvas;
    var group = new LiteGraph.LGraphGroup();
    group.pos = canvas.convertEventToCanvasOffset(mouse_event);
    canvas.graph.add(group);
}
```

## 3. `getBoundaryNodes`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:23-53` (`#L23`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `getBoundaryNodes`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L23-L42）：
```js
export function getBoundaryNodes(nodes) {
    let top = null;
    let right = null;
    let bottom = null;
    let left = null;
    for (const nID in nodes) {
        const node = nodes[nID];
        const [x, y] = node.pos;
        const [width, height] = node.size;

        if (top === null || y < top.pos[1]) {
            top = node;
        }
        if (right === null || x + width > right.pos[0] + right.size[0]) {
            right = node;
        }
        if (bottom === null || y + height > bottom.pos[1] + bottom.size[1]) {
            bottom = node;
        }
        if (left === null || x < left.pos[0]) {
```

> 片段已按最大行数裁剪。

## 4. `alignNodes`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:55-92` (`#L55`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `alignNodes`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L55-L74）：
```js
export function alignNodes(nodes, direction, align_to) {
    if (!nodes) {
        return;
    }

    const canvas = LGraphCanvas.active_canvas;
    let boundaryNodes = []
    if (align_to === undefined) {
        boundaryNodes = LGraphCanvas.getBoundaryNodes(nodes)
    } else {
        boundaryNodes = {
            "top": align_to,
            "right": align_to,
            "bottom": align_to,
            "left": align_to,
        }
    }

    for (const [_, node] of Object.entries(canvas.selected_nodes)) {
        switch (direction) {
```

> 片段已按最大行数裁剪。

## 5. `onNodeAlign`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:94-104` (`#L94`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onNodeAlign`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L94-L104）：
```js
export function onNodeAlign(value, options, event, prev_menu, node) {
    new LiteGraph.ContextMenu(["Top", "Bottom", "Left", "Right"], {
        event: event,
        callback: inner_clicked,
        parentMenu: prev_menu,
    });

    function inner_clicked(value) {
        LGraphCanvas.alignNodes(LGraphCanvas.active_canvas.selected_nodes, value.toLowerCase(), node);
    }
}
```

## 6. `onGroupAlign`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:106-116` (`#L106`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onGroupAlign`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L106-L116）：
```js
export function onGroupAlign(value, options, event, prev_menu) {
    new LiteGraph.ContextMenu(["Top", "Bottom", "Left", "Right"], {
        event: event,
        callback: inner_clicked,
        parentMenu: prev_menu,
    });

    function inner_clicked(value) {
        LGraphCanvas.alignNodes(LGraphCanvas.active_canvas.selected_nodes, value.toLowerCase());
    }
}
```

## 7. `onMenuAdd`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:118-197` (`#L118`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onMenuAdd`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L118-L137）：
```js
export function onMenuAdd(node, options, e, prev_menu, callback) {

    var canvas = LGraphCanvas.active_canvas;
    var ref_window = canvas.getCanvasWindow();
    var graph = canvas.graph;
    if (!graph)
        return;

    function inner_onMenuAdded(base_category ,prev_menu) {

        var categories = LiteGraph.getNodeTypesCategories(canvas.filter || graph.filter).filter(function(category) {
            return category.startsWith(base_category)
        });
        var entries = [];

        categories.map(function(category) {

            if (!category)
                return;

```

> 片段已按最大行数裁剪。

## 8. `onMenuCollapseAll`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:199-199` (`#L199`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onMenuCollapseAll`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L199-L204）：
```js
export function onMenuCollapseAll() {}

export function onMenuNodeEdit() {}


export function showMenuNodeOptionalInputs(v, options, e, prev_menu, node) {
```

## 9. `onMenuNodeEdit`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:201-201` (`#L201`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onMenuNodeEdit`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L201-L206）：
```js
export function onMenuNodeEdit() {}


export function showMenuNodeOptionalInputs(v, options, e, prev_menu, node) {
    if (!node) {
        return;
```

## 10. `showMenuNodeOptionalInputs`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:204-293` (`#L204`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `showMenuNodeOptionalInputs`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L204-L223）：
```js
export function showMenuNodeOptionalInputs(v, options, e, prev_menu, node) {
    if (!node) {
        return;
    }

    var that = this;
    var canvas = LGraphCanvas.active_canvas;
    var ref_window = canvas.getCanvasWindow();

    options = node.optional_inputs;
    if (node.onGetInputs) {
        options = node.onGetInputs();
    }

    var entries = [];
    if (options) {
        for (let i=0; i < options.length; i++) {
            var entry = options[i];
            if (!entry) {
                entries.push(null);
```

> 片段已按最大行数裁剪。

## 11. `showMenuNodeOptionalOutputs`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:295-425` (`#L295`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `showMenuNodeOptionalOutputs`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L295-L314）：
```js
export function showMenuNodeOptionalOutputs(v, options, e, prev_menu, node) {
    if (!node) {
        return;
    }

    var that = this;
    var canvas = LGraphCanvas.active_canvas;
    var ref_window = canvas.getCanvasWindow();

    options = node.optional_outputs;
    if (node.onGetOutputs) {
        options = node.onGetOutputs();
    }

    var entries = [];
    if (options) {
        for (let i=0; i < options.length; i++) {
            var entry = options[i];
            if (!entry) {
                // separator?
```

> 片段已按最大行数裁剪。

## 12. `onShowMenuNodeProperties`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:427-482` (`#L427`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onShowMenuNodeProperties`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L427-L446）：
```js
export function onShowMenuNodeProperties(value, options, e, prev_menu, node) {
    if (!node || !node.properties) {
        return;
    }

    var canvas = LGraphCanvas.active_canvas;
    var ref_window = canvas.getCanvasWindow();

    var entries = [];
    for (let i in node.properties) {
        value = node.properties[i] !== undefined ? node.properties[i] : " ";
        if( typeof value == "object" )
            value = JSON.stringify(value);
        var info = node.getPropertyInfo(i);
        if(info.type == "enum" || info.type == "combo")
            value = LGraphCanvas.getPropertyPrintableValue( value, info.values );

        // value could contain invalid html characters, clean that
        value = LGraphCanvas.decodeHTML(value);
        entries.push({
```

> 片段已按最大行数裁剪。

## 13. `decodeHTML`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:484-488` (`#L484`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `decodeHTML`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L484-L489）：
```js
export function decodeHTML(str) {
    var e = document.createElement("div");
    e.innerText = str;
    return e.innerHTML;
}

```

## 14. `onMenuResizeNode`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:490-511` (`#L490`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onMenuResizeNode`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L490-L509）：
```js
export function onMenuResizeNode(value, options, e, menu, node) {
    if (!node) {
        return;
    }

    const fApplyMultiNode = (node) => {
        node.size = node.computeSize();
        if (node.onResize)
            node.onResize(node.size);
    }

    var graphcanvas = LGraphCanvas.active_canvas;
    if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
        fApplyMultiNode(node);
    }else{
        for (let i in graphcanvas.selected_nodes) {
            fApplyMultiNode(graphcanvas.selected_nodes[i]);
        }
    }

```

> 片段已按最大行数裁剪。

## 15. `onShowPropertyEditor`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:513-607` (`#L513`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onShowPropertyEditor`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L513-L532）：
```js
export function onShowPropertyEditor(item, options, e, menu, node) {
    var property = item.property || "title";
    var value = node[property];

    var dialog = document.createElement("div");
    dialog.is_modified = false;
    dialog.className = "graphdialog";
    dialog.innerHTML =
        "<span class='name'></span><input autofocus type='text' class='value'/><button>OK</button>";
    dialog.close = () => {
        dialog.parentNode?.removeChild(dialog);
    };
    var title = dialog.querySelector(".name");
    title.innerText = property;
    var input = dialog.querySelector(".value");

    const inner = () => {
        if (input) {
            setValue(input.value);
        }
```

> 片段已按最大行数裁剪。

## 16. `getPropertyPrintableValue`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:609-627` (`#L609`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `getPropertyPrintableValue`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L609-L627）：
```js
export function getPropertyPrintableValue(value, values) {
    if(!values)
        return String(value);

    if(values.constructor === Array) {
        return String(value);
    }

    if(values.constructor === Object) {
        var desc_value = "";
        for(var k in values) {
            if(values[k] != value)
                continue;
            desc_value = k;
            break;
        }
        return String(value) + " ("+desc_value+")";
    }
}
```

## 17. `onMenuNodeCollapse`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:629-646` (`#L629`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onMenuNodeCollapse`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L629-L646）：
```js
export function onMenuNodeCollapse(value, options, e, menu, node) {
    node.graph.beforeChange(/* ?*/);

    var fApplyMultiNode = function(node) {
        node.collapse();
    }

    var graphcanvas = LGraphCanvas.active_canvas;
    if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
        fApplyMultiNode(node);
    }else{
        for (let i in graphcanvas.selected_nodes) {
            fApplyMultiNode(graphcanvas.selected_nodes[i]);
        }
    }

    node.graph.afterChange(/* ?*/);
}
```

## 18. `onMenuNodePin`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:648-650` (`#L648`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onMenuNodePin`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L648-L653）：
```js
export function onMenuNodePin(value, options, e, menu, node) {
    node.pin();
}

export function onMenuNodeMode(value, options, e, menu, node) {
    new LiteGraph.ContextMenu(
```

## 19. `onMenuNodeMode`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:652-683` (`#L652`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onMenuNodeMode`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L652-L671）：
```js
export function onMenuNodeMode(value, options, e, menu, node) {
    new LiteGraph.ContextMenu(
        LiteGraph.NODE_MODES,
        { event: e, callback: inner_clicked, parentMenu: menu, node: node },
    );

    function inner_clicked(v) {
        if (!node) {
            return;
        }
        var kV = Object.values(LiteGraph.NODE_MODES).indexOf(v);
        const fApplyMultiNode = (node) => {
            if (kV>=0 && LiteGraph.NODE_MODES[kV])
                node.changeMode(kV);
            else{
                LiteGraph.warn?.("unexpected mode: "+v);
                node.changeMode(LiteGraph.ALWAYS);
            }
        }

```

> 片段已按最大行数裁剪。

## 20. `onMenuNodeColors`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:685-752` (`#L685`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onMenuNodeColors`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L685-L704）：
```js
export function onMenuNodeColors(value, options, e, menu, node) {
    if (!node) {
        throw new Error("no node for color");
    }

    var values = [];
    values.push({
        value: null,
        content:
            "<span style='display: block; padding-left: 4px;'>No color</span>",
    });

    for (let i in LGraphCanvas.node_colors) {
        let color = LGraphCanvas.node_colors[i];
        value = {
            value: i,
            content:
                "<span style='display: block; color: #999; padding-left: 4px; border-left: 8px solid " +
                color.color +
                "; background-color:" +
```

> 片段已按最大行数裁剪。

## 21. `onMenuNodeShapes`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:754-790` (`#L754`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onMenuNodeShapes`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L754-L773）：
```js
export function onMenuNodeShapes(value, options, e, menu, node) {
    if (!node) {
        throw new Error("no node passed");
    }

    new LiteGraph.ContextMenu(LiteGraph.VALID_SHAPES, {
        event: e,
        callback: inner_clicked,
        parentMenu: menu,
        node: node,
    });

    function inner_clicked(v) {
        if (!node) {
            return;
        }
        node.graph.beforeChange(/* ?*/); // node

        const fApplyMultiNode = (node) => {
            node.shape = v;
```

> 片段已按最大行数裁剪。

## 22. `onMenuNodeRemove`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:792-819` (`#L792`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onMenuNodeRemove`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L792-L811）：
```js
export function onMenuNodeRemove(value, options, e, menu, node) {
    if (!node) {
        throw new Error("no node passed");
    }

    var graph = node.graph;
    graph.beforeChange();


    const fApplyMultiNode = (node) => {
        if (node.removable === false) {
            return;
        }
        graph.remove(node);
    }

    var graphcanvas = LGraphCanvas.active_canvas;
    if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
        fApplyMultiNode(node);
    }else{
```

> 片段已按最大行数裁剪。

## 23. `onMenuNodeToSubgraph`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:821-839` (`#L821`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onMenuNodeToSubgraph`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L821-L839）：
```js
export function onMenuNodeToSubgraph(value, options, e, menu, node) {
    var graph = node.graph;
    var graphcanvas = LGraphCanvas.active_canvas;
    if(!graphcanvas) // ??
        return;

    var nodes_list = Object.values( graphcanvas.selected_nodes || {} );
    if( !nodes_list.length )
        nodes_list = [ node ];

    var subgraph_node = LiteGraph.createNode("graph/subgraph");
    subgraph_node.pos = node.pos.concat();
    graph.add(subgraph_node);

    subgraph_node.buildFromNodes( nodes_list );

    graphcanvas.deselectAllNodes();
    node.setDirtyCanvas(true, true);
}
```

## 24. `onMenuNodeClone`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:841-876` (`#L841`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onMenuNodeClone`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L841-L860）：
```js
export function onMenuNodeClone(value, options, e, menu, node) {

    node.graph.beforeChange();

    var newSelected = {};

    const fApplyMultiNode = (node) => {
        if (node.clonable === false) {
            return;
        }
        var newnode = node.clone();
        if (!newnode) {
            return;
        }
        newnode.pos = [node.pos[0] + 5, node.pos[1] + 5];
        node.graph.add(newnode);
        newSelected[newnode.id] = newnode;
    }

    var graphcanvas = LGraphCanvas.active_canvas;
```

> 片段已按最大行数裁剪。

## 25. `applyLGraphCanvasStatics`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/static-actions.js:900-907` (`#L900`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `applyLGraphCanvasStatics`，定义于 `src/lgraphcanvas/modules/static-actions.js`。

- 代码片段（L900-L907）：
```js
export function applyLGraphCanvasStatics(LGraphCanvasClass) {
    Object.assign(LGraphCanvasClass, { getFileExtension, onGroupAdd, getBoundaryNodes, alignNodes, onNodeAlign, onGroupAlign, onMenuAdd, onMenuCollapseAll, onMenuNodeEdit, showMenuNodeOptionalInputs, showMenuNodeOptionalOutputs, onShowMenuNodeProperties, decodeHTML, onMenuResizeNode, onShowPropertyEditor, getPropertyPrintableValue, onMenuNodeCollapse, onMenuNodePin, onMenuNodeMode, onMenuNodeColors, onMenuNodeShapes, onMenuNodeRemove, onMenuNodeToSubgraph, onMenuNodeClone });
    LGraphCanvasClass.DEFAULT_BACKGROUND_IMAGE = DEFAULT_BACKGROUND_IMAGE;
    LGraphCanvasClass.link_type_colors = link_type_colors;
    LGraphCanvasClass.gradients = gradients;
    LGraphCanvasClass.search_limit = search_limit;
    LGraphCanvasClass.node_colors = node_colors;
}
```
