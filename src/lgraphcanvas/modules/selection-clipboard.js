import { LiteGraph } from "../../litegraph.js";
import { LGraphCanvas } from "../../lgraphcanvas.js";
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
        var cloned = node.clone();
        if(!cloned) {
            LiteGraph.warn?.("node type not found: " + node.type );
            continue;
        }
        clipboard_info.nodes.push(cloned.serialize());
        if (node.inputs && node.inputs.length) {
            for (var j = 0; j < node.inputs.length; ++j) {
                var input = node.inputs[j];
                if (!input || input.link == null) {
                    continue;
                }
                var link_info = this.graph.links[input.link];
                if (!link_info) {
                    continue;
                }
                var target_node = this.graph.getNodeById(link_info.origin_id);
                if (!target_node) {
                    continue;
                }
                clipboard_info.links.push([
                    target_node._relative_id,
                    link_info.origin_slot, // j,
                    node._relative_id,
                    link_info.target_slot,
                    target_node.id,
                ]);
            }
        }
    }
    localStorage.setItem(
        "litegrapheditor_clipboard",
        JSON.stringify(clipboard_info),
    );
}

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
                posMin[0] = clipboard_info.nodes[i].pos[0];
                posMinIndexes[0] = i;
            }
            if(posMin[1]>clipboard_info.nodes[i].pos[1]) {
                posMin[1] = clipboard_info.nodes[i].pos[1];
                posMinIndexes[1] = i;
            }
        } else{
            posMin = [clipboard_info.nodes[i].pos[0], clipboard_info.nodes[i].pos[1]];
            posMinIndexes = [i, i];
        }
    }
    var nodes = [];
    for (let i = 0; i < clipboard_info.nodes.length; ++i) {
        var node_data = clipboard_info.nodes[i];
        var node = LiteGraph.createNode(node_data.type);
        if (node) {
            node.configure(node_data);

            // paste in last known mouse position
            node.pos[0] += this.graph_mouse[0] - posMin[0]; // += 5;
            node.pos[1] += this.graph_mouse[1] - posMin[1]; // += 5;

            this.graph.add(node,{doProcessChange: false});

            nodes.push(node);
        }
    }

    // create links
    for (let i = 0; i < clipboard_info.links.length; ++i) {
        var link_info = clipboard_info.links[i];
        var origin_node = undefined;
        var origin_node_relative_id = link_info[0];
        if (origin_node_relative_id != null) {
            origin_node = nodes[origin_node_relative_id];
        } else if (LiteGraph.ctrl_shift_v_paste_connect_unselected_outputs && isConnectUnselected) {
            var origin_node_id = link_info[4];
            if (origin_node_id) {
                origin_node = this.graph.getNodeById(origin_node_id);
            }
        }
        var target_node = nodes[link_info[2]];
        if( origin_node && target_node )
            origin_node.connect(link_info[1], target_node, link_info[3]);
        else
            LiteGraph.warn?.("Warning, nodes missing on pasting");
    }

    this.selectNodes(nodes);
    this.graph.onGraphChanged({action: "paste", doSave: true});
    this.graph.afterChange();
}

export function processNodeDblClicked(n) {
    if (this.onShowNodePanel) {
        this.onShowNodePanel(n);
    } else {
        this.showShowNodePanel(n);
    }

    this.onNodeDblClicked?.(n);
    this.setDirty(true);
}

export function processNodeSelected(node, e) {
    this.selectNode(node, e && (e.shiftKey || e.ctrlKey || this.multi_select));
    this.onNodeSelected?.(node);
}

export function selectNode(node, add_to_current_selection) {
    if (node == null) {
        this.deselectAllNodes();
    } else {
        this.selectNodes([node], add_to_current_selection);
    }
}

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
        });

        node.outputs?.forEach((out) => {
            out.links?.forEach((link) => {
                this.highlighted_links[link] = true;
            });
        });
    });
    this.onSelectionChange?.( this.selected_nodes );
    this.setDirty(true);
}

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
        if (this.onNodeDeselected) {
            this.onNodeDeselected(node);
        }
    }
    this.selected_nodes = {};
    this.current_node = null;
    this.highlighted_links = {};
    this.setDirty(true);
    this.graph.afterChange();
}

export function onNodeSelectionChange() {
    return; // disabled
}

export function boundaryNodesForSelection() {
    return LGraphCanvas.getBoundaryNodes(Object.values(this.selected_nodes));
}
