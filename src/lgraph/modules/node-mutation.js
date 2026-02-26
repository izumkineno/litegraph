let LiteGraph = null;

export function setNodeMutationMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const nodeMutationMethods = {
add(node, skip_compute_order, optsIn = {}) {

        var optsDef = {
            doProcessChange: true,
            doCalcSize: true,
        };
        var opts = Object.assign(optsDef,optsIn);

        if (!node) {
            return;
        }

        // groups
        if (node.constructor === LiteGraph.LGraphGroup) {
            this._groups.push(node);
            this.setDirtyCanvas(true);
            this.change();
            node.graph = this;
            this.onGraphChanged({action: "groupAdd", doSave: opts.doProcessChange});
            return;
        }

        // nodes
        if (node.id != -1 && this._nodes_by_id[node.id] != null) {
            LiteGraph.warn?.("LiteGraph: there is already a node with this ID, changing it");
            if (LiteGraph.use_uuids) {
                node.id = LiteGraph.uuidv4();
            } else {
                node.id = ++this.last_node_id;
            }
        }

        if (this._nodes.length >= LiteGraph.MAX_NUMBER_OF_NODES) {
            throw new Error("LiteGraph: max number of nodes in a graph reached");
        }

        // give him an id
        if (LiteGraph.use_uuids) {
            if (node.id == null || node.id == -1)
                node.id = LiteGraph.uuidv4();
        } else {
            if (node.id == null || node.id == -1) {
                node.id = ++this.last_node_id;
            } else if (this.last_node_id < node.id) {
                this.last_node_id = node.id;
            }
        }

        node.graph = this;
        this.onGraphChanged({action: "nodeAdd", doSave: opts.doProcessChange});

        this._nodes.push(node);
        this._nodes_by_id[node.id] = node;

        node.onAdded?.(this);

        if (this.config.align_to_grid) {
            node.alignToGrid();
        }

        if (!skip_compute_order) {
            this.updateExecutionOrder();
        }

        this.onNodeAdded?.(node);

        if (opts.doCalcSize) {
            node.setSize( node.computeSize() );
        }
        this.setDirtyCanvas(true);
        this.change();

        return node; // to chain actions
    },

remove(node) {
        if (node.constructor === LiteGraph.LGraphGroup) {
            var index = this._groups.indexOf(node);
            if (index != -1) {
                this._groups.splice(index, 1);
            }
            node.graph = null;
            this.onGraphChanged({action: "groupRemove"});
            this.setDirtyCanvas(true, true);
            this.change();
            return;
        }

        if (this._nodes_by_id[node.id] == null) {
            return;
        } // not found

        if (node.ignore_remove) {
            return;
        } // cannot be removed

        // this.beforeChange(); // sure? - almost sure is wrong

        // disconnect inputs
        if (node.inputs) {
            for (let i = 0; i < node.inputs.length; i++) {
                let slot = node.inputs[i];
                if (slot.link != null) {
                    node.disconnectInput(i, {doProcessChange: false});
                }
            }
        }

        // disconnect outputs
        if (node.outputs) {
            for (let i = 0; i < node.outputs.length; i++) {
                let slot = node.outputs[i];
                if (slot.links != null && slot.links.length) {
                    node.disconnectOutput(i, false, {doProcessChange: false});
                }
            }
        }

        // node.id = -1; //why?

        // callback
        node.onRemoved?.();
        node.graph = null;
        this.onGraphChanged({action: "nodeRemove"});

        // remove from canvas render
        if (this.list_of_graphcanvas) {
            for (let i = 0; i < this.list_of_graphcanvas.length; ++i) {
                let canvas = this.list_of_graphcanvas[i];
                if (canvas.selected_nodes[node.id]) {
                    delete canvas.selected_nodes[node.id];
                }
                if (canvas.node_dragged == node) {
                    canvas.node_dragged = null;
                }
            }
        }

        // remove from containers
        var pos = this._nodes.indexOf(node);
        if (pos != -1) {
            this._nodes.splice(pos, 1);
        }
        delete this._nodes_by_id[node.id];

        this.onNodeRemoved?.(node);

        // close panels
        this.sendActionToCanvas("checkPanels");

        this.setDirtyCanvas(true, true);
        // this.afterChange(); // sure? - almost sure is wrong
        this.change();

        this.updateExecutionOrder();
    },

removeLink(link_id) {
        var link = this.links[link_id];
        if (!link) {
            return;
        }
        var node = this.getNodeById(link.target_id);
        if(node) {
            this.beforeChange();
            node.disconnectInput(link.target_slot); /* , optsIn */
            this.afterChange();
        }
    },

checkNodeTypes() {
        for (var i = 0; i < this._nodes.length; i++) {
            var node = this._nodes[i];
            var ctor = LiteGraph.registered_node_types[node.type];
            if (node.constructor == ctor) {
                continue;
            }
            if(LiteGraph.debug)
                LiteGraph.log?.(`node being replaced by newer version: ${node.type}`);
            var newnode = LiteGraph.createNode(node.type);
            this._nodes[i] = newnode;
            newnode.configure(node.serialize());
            newnode.graph = this;
            this._nodes_by_id[newnode.id] = newnode;
            if (node.inputs) {
                newnode.inputs = node.inputs.concat();
            }
            if (node.outputs) {
                newnode.outputs = node.outputs.concat();
            }
        }
        this.updateExecutionOrder();
    },
};
