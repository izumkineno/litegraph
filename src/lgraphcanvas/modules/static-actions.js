import { LiteGraph } from "../../litegraph.js";
import { LGraphCanvas } from "../../lgraphcanvas.js";

export function getFileExtension(url) {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const lastDotIndex = path.lastIndexOf(".");

    if (lastDotIndex === -1) {
        return "";
    }

    return path.slice(lastDotIndex + 1).toLowerCase();
}

export function onGroupAdd(info, entry, mouse_event) {
    var canvas = LGraphCanvas.active_canvas;
    var group = new LiteGraph.LGraphGroup();
    group.pos = canvas.convertEventToCanvasOffset(mouse_event);
    canvas.graph.add(group);
}

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
            left = node;
        }
    }

    return {
        "top": top,
        "right": right,
        "bottom": bottom,
        "left": left,
    };
}

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
            case "right":
                node.pos[0] = boundaryNodes["right"].pos[0] + boundaryNodes["right"].size[0] - node.size[0];
                break;
            case "left":
                node.pos[0] = boundaryNodes["left"].pos[0];
                break;
            case "top":
                node.pos[1] = boundaryNodes["top"].pos[1];
                break;
            case "bottom":
                node.pos[1] = boundaryNodes["bottom"].pos[1] + boundaryNodes["bottom"].size[1] - node.size[1];
                break;
        }
    }

    canvas.dirty_canvas = true;
    canvas.dirty_bgcanvas = true;
}

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

            var base_category_regex = new RegExp('^(' + base_category + ')');
            var category_name = category.replace(base_category_regex,"").split('/')[0];
            var category_path = base_category === '' ? category_name + '/' : base_category + category_name + '/';

            var name = category_name;
            if(name.indexOf("::") != -1) // in case it has a namespace like "shader::math/rand" it hides the namespace
                name = name.split("::")[1];

            var index = entries.findIndex(function(entry) {
                return entry.value === category_path
            });
            if (index === -1) {
                entries.push({
                    value: category_path,
                    content: name,
                    has_submenu: true,
                    callback: function(value, event, mouseEvent, contextMenu) {
                        inner_onMenuAdded(value.value, contextMenu);
                    },
                });
            }

        });

        var nodes = LiteGraph.getNodeTypesInCategory(base_category.slice(0, -1), canvas.filter || graph.filter);
        nodes.map(function(node) {

            if (node.skip_list)
                return;

            var entry = {
                value: node.type,
                content: node.title,
                has_submenu: false ,
                callback: function(value, event, mouseEvent, contextMenu) {
                    var first_event = contextMenu.getFirstEvent();
                    canvas.graph.beforeChange();
                    var node = LiteGraph.createNode(value.value);
                    if (node) {
                        node.pos = canvas.convertEventToCanvasOffset(first_event);
                        canvas.graph.add(node);
                    }
                    if(callback)
                        callback(node);
                    canvas.graph.afterChange();
                },
            };

            entries.push(entry);

        });

        new LiteGraph.ContextMenu( entries, { event: e, parentMenu: prev_menu }, ref_window );

    }

    inner_onMenuAdded('',prev_menu);
    return false;

}

export function onMenuCollapseAll() {}

export function onMenuNodeEdit() {}


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
                continue;
            }
            var label = entry[0];
            if(!entry[2])
                entry[2] = {};

            if (entry[2].label) {
                label = entry[2].label;
            }

            entry[2].removable = true;
            var data = { content: label, value: entry };
            if (entry[1] == LiteGraph.ACTION) {
                data.className = "event";
            }
            entries.push(data);
        }
    }

    if (node.onMenuNodeInputs) {
        var retEntries = node.onMenuNodeInputs(entries);
        if(retEntries)
            entries = retEntries;
    }

    if (LiteGraph.do_add_triggers_slots) { // canvas.allow_addOutSlot_onExecuted
        if (node.findInputSlot("onTrigger") == -1) {
            entries.push({content: "On Trigger", value: ["onTrigger", LiteGraph.EVENT, {nameLocked: true, removable: true}], className: "event"}); // , opts: {}
        }
    }

    if (!entries.length) {
        if (LiteGraph.debug)
            LiteGraph.log?.("no input entries");
        return;
    }

    new LiteGraph.ContextMenu(
        entries,
        {
            event: e,
            callback: inner_clicked,
            parentMenu: prev_menu,
            node: node,
        },
        ref_window,
    );

    function inner_clicked(v, e, prev) {
        if (!node) {
            return;
        }

        if (v.callback) {
            v.callback.call(that, node, v, e, prev);
        }

        if (v.value) {
            node.graph.beforeChange();
            const slotOpts = v.value[2] ? Object.assign({}, v.value[2]) : {};

            node.addInput(v.value[0], v.value[1], slotOpts);
            node.onNodeInputAdd?.(v.value);
            node.setDirtyCanvas(true, true);
            node.graph.afterChange();
        }
    }

    return false;
}

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
                entries.push(null);
                continue;
            }

            if (
                node.flags &&
                node.flags.skip_repeated_outputs &&
                node.findOutputSlot(entry[0]) != -1
            ) {
                continue;
            } // skip the ones already on
            var label = entry[0];
            if(!entry[2])
                entry[2] = {};
            if (entry[2].label) {
                label = entry[2].label;
            }
            entry[2].removable = true;
            var data = { content: label, value: entry };
            if (entry[1] == LiteGraph.EVENT) {
                data.className = "event";
            }
            entries.push(data);
        }
    }

    if (this.onMenuNodeOutputs) {
        entries = this.onMenuNodeOutputs(entries);
    }
    if (LiteGraph.do_add_triggers_slots) { // canvas.allow_addOutSlot_onExecuted
        if (node.findOutputSlot("onExecuted") == -1) {
            entries.push({
                content: "On Executed",
                value: [
                    "onExecuted",
                    LiteGraph.EVENT,
                    {
                        nameLocked: true,
                        removable: true,
                    },
                ],
                className: "event",
            });
        }
    }
    // add callback for modifing the menu elements onMenuNodeOutputs
    if (node.onMenuNodeOutputs) {
        var retEntries = node.onMenuNodeOutputs(entries);
        if(retEntries) entries = retEntries;
    }

    if (!entries.length) {
        return;
    }

    new LiteGraph.ContextMenu(
        entries,
        {
            event: e,
            callback: inner_clicked,
            parentMenu: prev_menu,
            node: node,
        },
        ref_window,
    );

    function inner_clicked(v, e, prev) {
        if (!node) {
            return;
        }

        if (v.callback) {
            v.callback.call(that, node, v, e, prev);
        }

        if (!v.value) {
            return;
        }

        var value = v.value[1];

        if (
            value &&
            (value.constructor === Object || value.constructor === Array)
        ) {
            // submenu why?
            var entries = [];
            for (let i in value) {
                entries.push({ content: i, value: value[i] });
            }
            new LiteGraph.ContextMenu(entries, {
                event: e,
                callback: inner_clicked,
                parentMenu: prev_menu,
                node: node,
            });
            return false;
        } else {
            node.graph.beforeChange();
            const slotOpts = v.value[2] ? Object.assign({}, v.value[2]) : {};
            // if(v.opts) slotOpts = Object.assign(slotOpts, v.opts);

            node.addOutput(v.value[0], v.value[1], slotOpts);
            node.onNodeOutputAdd?.(v.value); // a callback to the node when adding a slot
            node.setDirtyCanvas(true, true);
            node.graph.afterChange();
        }
    }

    return false;
}

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
            content:
                "<span class='property_name'>" +
                (info.label ? info.label : i) +
                "</span>" +
                "<span class='property_value'>" +
                value +
                "</span>",
            value: i,
        });
    }
    if (!entries.length) {
        return;
    }

    new LiteGraph.ContextMenu(
        entries,
        {
            event: e,
            callback: inner_clicked,
            parentMenu: prev_menu,
            allow_html: true,
            node: node,
        },
        ref_window,
    );

    function inner_clicked(v) {
        if (!node) {
            return;
        }
        var rect = this.getBoundingClientRect();
        canvas.showEditPropertyValue(node, v.value, { position: [rect.left, rect.top] });
    }

    return false;
}

export function decodeHTML(str) {
    var e = document.createElement("div");
    e.innerText = str;
    return e.innerHTML;
}

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

    node.setDirtyCanvas(true, true);
}

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
    };

    if (input) {
        input.value = value;
        input.addEventListener("blur", function(_event) {
            this.focus();
        });
        input.addEventListener("keydown", function(e) {
            dialog.is_modified = true;
            if (e.keyCode == 27) {
                // ESC
                dialog.close();
            } else if (e.keyCode == 13) {
                inner(); // save
            } else if (e.keyCode != 13 && e.target.localName != "textarea") {
                return;
            }
            e.preventDefault();
            e.stopPropagation();
        });
    }

    var graphcanvas = LGraphCanvas.active_canvas;
    var canvas = graphcanvas.canvas;

    var rect = canvas.getBoundingClientRect();
    var offsetx = -20;
    var offsety = -20;
    if (rect) {
        offsetx -= rect.left;
        offsety -= rect.top;
    }

    if (event) {
        dialog.style.left = event.clientX + offsetx + "px";
        dialog.style.top = event.clientY + offsety + "px";
    } else {
        dialog.style.left = canvas.width * 0.5 + offsetx + "px";
        dialog.style.top = canvas.height * 0.5 + offsety + "px";
    }

    var button = dialog.querySelector("button");
    button.addEventListener("click", inner);
    canvas.parentNode.appendChild(dialog);

    if(input) input.focus();

    let dialogCloseTimer = null;

    dialog.addEventListener("pointerleave", (_event) => {
        if (LiteGraph.dialog_close_on_mouse_leave && !dialog.is_modified) {
            dialogCloseTimer = setTimeout(dialog.close, LiteGraph.dialog_close_on_mouse_leave_delay);
        }
    });

    dialog.addEventListener("pointerenter", (_event) => {
        if (LiteGraph.dialog_close_on_mouse_leave && dialogCloseTimer) {
            clearTimeout(dialogCloseTimer);
        }
    });

    const setValue = (value) => {
        switch (item.type) {
            case "Number":
                value = Number(value);
                break;
            case "Boolean":
                value = Boolean(value);
                break;
        }
        node[property] = value;
        dialog.parentNode?.removeChild(dialog);
        node.setDirtyCanvas(true, true);
    };
}

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

export function onMenuNodePin(value, options, e, menu, node) {
    node.pin();
}

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

        var graphcanvas = LGraphCanvas.active_canvas;
        if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
            fApplyMultiNode(node);
        }else{
            for (let i in graphcanvas.selected_nodes) {
                fApplyMultiNode(graphcanvas.selected_nodes[i]);
            }
        }
    }

    return false;
}

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
                color.bgcolor +
                "'>" +
                i +
                "</span>",
        };
        values.push(value);
    }
    new LiteGraph.ContextMenu(values, {
        event: e,
        callback: inner_clicked,
        parentMenu: menu,
        node: node,
    });

    function inner_clicked(v) {
        if (!node) {
            return;
        }

        let color = v.value ? LGraphCanvas.node_colors[v.value] : null;

        const fApplyColor = (node) => {
            if (color) {
                if (node.constructor === LiteGraph.LGraphGroup) {
                    node.color = color.groupcolor;
                } else {
                    node.color = color.color;
                    node.bgcolor = color.bgcolor;
                }
            } else {
                delete node.color;
                delete node.bgcolor;
            }
        }

        var graphcanvas = LGraphCanvas.active_canvas;
        if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
            fApplyColor(node);
        }else{
            for (let i in graphcanvas.selected_nodes) {
                fApplyColor(graphcanvas.selected_nodes[i]);
            }
        }
        node.setDirtyCanvas(true, true);
    }

    return false;
}

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
        }

        var graphcanvas = LGraphCanvas.active_canvas;
        if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
            fApplyMultiNode(node);
        }else{
            for (let i in graphcanvas.selected_nodes) {
                fApplyMultiNode(graphcanvas.selected_nodes[i]);
            }
        }

        node.graph.afterChange(/* ?*/); // node
        node.setDirtyCanvas(true);
    }

    return false;
}

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
        for (let i in graphcanvas.selected_nodes) {
            fApplyMultiNode(graphcanvas.selected_nodes[i]);
        }
    }

    graph.afterChange();
    node.setDirtyCanvas(true, true);
}

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
    if (!graphcanvas.selected_nodes || Object.keys(graphcanvas.selected_nodes).length <= 1) {
        fApplyMultiNode(node);
    }else{
        for (let i in graphcanvas.selected_nodes) {
            fApplyMultiNode(graphcanvas.selected_nodes[i]);
        }
    }

    if(Object.keys(newSelected).length) {
        graphcanvas.selectNodes(newSelected);
    }

    node.graph.afterChange();

    node.setDirtyCanvas(true, true);
}

const DEFAULT_BACKGROUND_IMAGE = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNrs1rEKwjAUhlETUkj3vP9rdmr1Ysammk2w5wdxuLgcMHyptfawuZX4pJSWZTnfnu/lnIe/jNNxHHGNn//HNbbv+4dr6V+11uF527arU7+u63qfa/bnmh8sWLBgwYJlqRf8MEptXPBXJXa37BSl3ixYsGDBMliwFLyCV/DeLIMFCxYsWLBMwSt4Be/NggXLYMGCBUvBK3iNruC9WbBgwYJlsGApeAWv4L1ZBgsWLFiwYJmCV/AK3psFC5bBggULloJX8BpdwXuzYMGCBctgwVLwCl7Be7MMFixYsGDBsu8FH1FaSmExVfAxBa/gvVmwYMGCZbBg/W4vAQYA5tRF9QYlv/QAAAAASUVORK5CYII=";
const link_type_colors = {
        "-1": "#A86",
        "number": "#AAA",
        "node": "#DCA",
        "string": "#77F",
        "boolean": "#F77",
    };
const gradients = {};
const search_limit = -1;
const node_colors = {
        red: { color: "#322", bgcolor: "#533", groupcolor: "#A88" },
        brown: { color: "#332922", bgcolor: "#593930", groupcolor: "#b06634" },
        green: { color: "#232", bgcolor: "#353", groupcolor: "#8A8" },
        blue: { color: "#223", bgcolor: "#335", groupcolor: "#88A" },
        pale_blue: { color: "#2a363b", bgcolor: "#3f5159", groupcolor: "#3f789e" },
        cyan: { color: "#233", bgcolor: "#355", groupcolor: "#8AA" },
        purple: { color: "#323", bgcolor: "#535", groupcolor: "#a1309b" },
        yellow: { color: "#432", bgcolor: "#653", groupcolor: "#b58b2a" },
        black: { color: "#222", bgcolor: "#000", groupcolor: "#444" },
    };

export function applyLGraphCanvasStatics(LGraphCanvasClass) {
    Object.assign(LGraphCanvasClass, { getFileExtension, onGroupAdd, getBoundaryNodes, alignNodes, onNodeAlign, onGroupAlign, onMenuAdd, onMenuCollapseAll, onMenuNodeEdit, showMenuNodeOptionalInputs, showMenuNodeOptionalOutputs, onShowMenuNodeProperties, decodeHTML, onMenuResizeNode, onShowPropertyEditor, getPropertyPrintableValue, onMenuNodeCollapse, onMenuNodePin, onMenuNodeMode, onMenuNodeColors, onMenuNodeShapes, onMenuNodeRemove, onMenuNodeToSubgraph, onMenuNodeClone });
    LGraphCanvasClass.DEFAULT_BACKGROUND_IMAGE = DEFAULT_BACKGROUND_IMAGE;
    LGraphCanvasClass.link_type_colors = link_type_colors;
    LGraphCanvasClass.gradients = gradients;
    LGraphCanvasClass.search_limit = search_limit;
    LGraphCanvasClass.node_colors = node_colors;
}
