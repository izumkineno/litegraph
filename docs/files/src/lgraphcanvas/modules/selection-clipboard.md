# 文件文档：`src/lgraphcanvas/modules/selection-clipboard.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 13 个文件，导出 115 项（AUTO 115 项），耦合强度 50。
> 关键耦合：出边 `src`(22)、`src/lgraphcanvas/shared`(3)；入边 `src/lgraphcanvas/controllers`(24)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

- 导出项数量：11
- AUTO 说明数量：11

## 1. `copyToClipboard`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/selection-clipboard.js:3-57` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `copyToClipboard`，定义于 `src/lgraphcanvas/modules/selection-clipboard.js`。

- 代码片段（L3-L22）：
```js
export function copyToClipboard() {
    var clipboard_info = {
        nodes: [],
        links: [],
    };
    var index = 0;
    var selected_nodes_array = [];
    for (let i in this.selected_nodes) {
        let node = this.selected_nodes[i];
        if (node.clonable === false)
            continue;
        node._relative_id = index;
        selected_nodes_array.push(node);
        index += 1;
    }

    for (let i = 0; i < selected_nodes_array.length; ++i) {
        let node = selected_nodes_array[i];
        if(node.clonable === false)
            continue;
```

> 片段已按最大行数裁剪。

## 2. `pasteFromClipboard`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/selection-clipboard.js:59-131` (`#L59`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `pasteFromClipboard`，定义于 `src/lgraphcanvas/modules/selection-clipboard.js`。

- 代码片段（L59-L78）：
```js
export function pasteFromClipboard(isConnectUnselected = false) {
    // if ctrl + shift + v is off, return when isConnectUnselected is true (shift is pressed) to maintain old behavior
    if (!LiteGraph.ctrl_shift_v_paste_connect_unselected_outputs && isConnectUnselected) {
        return;
    }
    var data = localStorage.getItem("litegrapheditor_clipboard");
    if (!data) {
        return;
    }

    this.graph.beforeChange();

    // create nodes
    var clipboard_info = JSON.parse(data);
    // calculate top-left node, could work without this processing but using diff with last node pos :: clipboard_info.nodes[clipboard_info.nodes.length-1].pos
    var posMin = false;
    var posMinIndexes = false;
    for (let i = 0; i < clipboard_info.nodes.length; ++i) {
        if (posMin) {
            if(posMin[0]>clipboard_info.nodes[i].pos[0]) {
```

> 片段已按最大行数裁剪。

## 3. `processNodeDblClicked`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/selection-clipboard.js:133-142` (`#L133`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `processNodeDblClicked`，定义于 `src/lgraphcanvas/modules/selection-clipboard.js`。

- 代码片段（L133-L142）：
```js
export function processNodeDblClicked(n) {
    if (this.onShowNodePanel) {
        this.onShowNodePanel(n);
    } else {
        this.showShowNodePanel(n);
    }

    this.onNodeDblClicked?.(n);
    this.setDirty(true);
}
```

## 4. `processNodeSelected`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/selection-clipboard.js:144-147` (`#L144`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `processNodeSelected`，定义于 `src/lgraphcanvas/modules/selection-clipboard.js`。

- 代码片段（L144-L149）：
```js
export function processNodeSelected(node, e) {
    this.selectNode(node, e && (e.shiftKey || e.ctrlKey || this.multi_select));
    this.onNodeSelected?.(node);
}

export function selectNode(node, add_to_current_selection) {
```

## 5. `selectNode`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/selection-clipboard.js:149-155` (`#L149`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `selectNode`，定义于 `src/lgraphcanvas/modules/selection-clipboard.js`。

- 代码片段（L149-L155）：
```js
export function selectNode(node, add_to_current_selection) {
    if (node == null) {
        this.deselectAllNodes();
    } else {
        this.selectNodes([node], add_to_current_selection);
    }
}
```

## 6. `selectNodes`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/selection-clipboard.js:157-187` (`#L157`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `selectNodes`，定义于 `src/lgraphcanvas/modules/selection-clipboard.js`。

- 代码片段（L157-L176）：
```js
export function selectNodes(nodes, add_to_current_selection) {
    if (!add_to_current_selection) {
        this.deselectAllNodes();
    }

    nodes = nodes || this.graph._nodes;
    if (typeof nodes == "string") nodes = [nodes];
    Object.values(nodes).forEach((node) => {
        if (node.is_selected) {
            this.deselectNode(node);
            return;
        }

        node.is_selected = true;
        this.selected_nodes[node.id] = node;

        node.onSelected?.();

        node.inputs?.forEach((input) => {
            this.highlighted_links[input.link] = true;
```

> 片段已按最大行数裁剪。

## 7. `deselectNode`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/selection-clipboard.js:189-203` (`#L189`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `deselectNode`，定义于 `src/lgraphcanvas/modules/selection-clipboard.js`。

- 代码片段（L189-L203）：
```js
export function deselectNode(node) {
    if (!node.is_selected) return;

    node.onDeselected?.();
    node.is_selected = false;
    this.onNodeDeselected?.(node);

    // Remove highlighted
    node.inputs?.forEach((input) => {
        delete this.highlighted_links?.[input.link]
    });
    node.outputs?.forEach((out) => {
        out.links?.forEach((link) => delete this.highlighted_links?.[link])
    });
}
```

## 8. `deselectAllNodes`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/selection-clipboard.js:205-224` (`#L205`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `deselectAllNodes`，定义于 `src/lgraphcanvas/modules/selection-clipboard.js`。

- 代码片段（L205-L224）：
```js
export function deselectAllNodes() {
    if (!this.graph) {
        return;
    }

    this.graph._nodes?.forEach((node) => {
        if (!node.is_selected) return;

        node.onDeselected?.();
        node.is_selected = false;
        this.onNodeDeselected?.(node);
    });

    this.selected_nodes = {};
    this.current_node = null;
    this.highlighted_links = {};

    this.onSelectionChange?.(this.selected_nodes);
    this.setDirty(true);
}
```

## 9. `deleteSelectedNodes`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/selection-clipboard.js:226-255` (`#L226`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `deleteSelectedNodes`，定义于 `src/lgraphcanvas/modules/selection-clipboard.js`。

- 代码片段（L226-L245）：
```js
export function deleteSelectedNodes() {

    this.graph.beforeChange();

    for (let i in this.selected_nodes) {
        var node = this.selected_nodes[i];

        if(node.block_delete)
            continue;

        // autoconnect when possible (very basic, only takes into account first input-output)
        if(node.inputs && node.inputs.length && node.outputs && node.outputs.length && LiteGraph.isValidConnection( node.inputs[0].type, node.outputs[0].type ) && node.inputs[0].link && node.outputs[0].links && node.outputs[0].links.length ) {
            var input_link = node.graph.links[node.inputs[0].link];
            var output_link = node.graph.links[node.outputs[0].links[0]];
            var input_node = node.getInputNode(0);
            var output_node = node.getOutputNodes(0)[0];
            if(input_node && output_node)
                input_node.connect( input_link.origin_slot, output_node, output_link.target_slot );
        }
        this.graph.remove(node);
```

> 片段已按最大行数裁剪。

## 10. `onNodeSelectionChange`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/selection-clipboard.js:257-259` (`#L257`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `onNodeSelectionChange`，定义于 `src/lgraphcanvas/modules/selection-clipboard.js`。

- 代码片段（L257-L262）：
```js
export function onNodeSelectionChange() {
    return; // disabled
}

export function boundaryNodesForSelection() {
    return LGraphCanvas.getBoundaryNodes(Object.values(this.selected_nodes));
```

## 11. `boundaryNodesForSelection`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/selection-clipboard.js:261-263` (`#L261`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `boundaryNodesForSelection`，定义于 `src/lgraphcanvas/modules/selection-clipboard.js`。

- 代码片段（L259-L264）：
```js
}

export function boundaryNodesForSelection() {
    return LGraphCanvas.getBoundaryNodes(Object.values(this.selected_nodes));
}

```
