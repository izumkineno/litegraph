let LiteGraph = null;

export function setIoDataMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const ioDataMethods = {
setOutputData(slot, data) {
        if (!this.outputs) {
            return;
        }

        if(slot?.constructor === String) {
            // not a niche case: consider that removable and optional slots will move indexes! just pass int value if preferred
            slot = this.findOutputSlot(slot);
        }else if (slot == -1 || slot >= this.outputs.length) {
            return;
        }

        var output_info = this.outputs[slot];
        if (!output_info) {
            return;
        }

        // store data in the output itself in case we want to debug
        output_info._data = data;

        // if there are connections, pass the data to the connections
        this.outputs[slot].links?.forEach((link_id) => {
            const link = this.graph.links[link_id];
            if (link) {
                link.data = data;
            }
        });
    },

setOutputDataType(slot, type) {
        if (!this.outputs) {
            return;
        }
        if (slot == -1 || slot >= this.outputs.length) {
            return;
        }
        var output_info = this.outputs[slot];
        if (!output_info) {
            return;
        }
        // store data in the output itself in case we want to debug
        output_info.type = type;

        // if there are connections, pass the data to the connections
        this.outputs[slot]?.links?.forEach((link_id) => {
            if (this.graph.links[link_id]) {
                this.graph.links[link_id].type = type;
            }
        });
    },

getInputData(slot, force_update, refresh_tree) {
        if (!this.inputs) {
            return;
        } // undefined;

        if (slot >= this.inputs.length || this.inputs[slot].link == null) {
            return;
        }

        var link_id = this.inputs[slot].link;
        var link = this.graph.links[link_id];
        if (!link) {
            // bug: weird case but it happens sometimes
            return null;
        }

        if (!force_update) {
            return link.data;
        }

        // special case: used to extract data from the incoming connection before the graph has been executed
        var node = this.graph.getNodeById(link.origin_id);
        if (!node) {
            return link.data;
        }

        // atlasan: refactor: This is a basic, but seems working, version. Consider moving this out of here and use a single ancestorsCalculation (for each event?)
        if (refresh_tree) {
            var uIdRand = this.id+"_getInputData_forced_"+Math.floor(Math.random()*9999);
            var optsAncestors = {action: uIdRand, options: {action_call: uIdRand}};
            this.refreshAncestors(optsAncestors);
        }

        if (node.updateOutputData) {
            node.updateOutputData(link.origin_slot);
        } else {
            node.doExecute?.();
        }

        return link.data;
    },

getInputDataType(slot) {
        if (!this.inputs) {
            return null;
        } // undefined;

        if (slot >= this.inputs.length || this.inputs[slot].link == null) {
            return null;
        }
        var link_id = this.inputs[slot].link;
        var link = this.graph.links[link_id];
        if (!link) {
            // bug: weird case but it happens sometimes
            return null;
        }
        var node = this.graph.getNodeById(link.origin_id);
        if (!node) {
            return link.type;
        }
        var output_info = node.outputs[link.origin_slot];
        if (output_info) {
            return output_info.type;
        }
        return null;
    },

getInputDataByName(slot_name, force_update) {
        var slot = this.findInputSlot(slot_name);
        if (slot == -1) {
            return null;
        }
        return this.getInputData(slot, force_update);
    },

isInputConnected(slot) {
        if (!this.inputs) {
            return false;
        }
        return slot < this.inputs.length && this.inputs[slot].link != null;
    },

getInputInfo(slot) {
        if (!this.inputs) {
            return null;
        }
        if (slot < this.inputs.length) {
            return this.inputs[slot];
        }
        return null;
    },

getInputLink(slot) {
        if (!this.inputs) {
            return null;
        }
        if (slot < this.inputs.length) {
            var slot_info = this.inputs[slot];
            return this.graph.links[slot_info.link];
        }
        return null;
    },

getInputNode(slot) {
        if (!this.inputs) {
            return null;
        }
        if (slot >= this.inputs.length) {
            return null;
        }
        var input = this.inputs[slot];
        if (!input || input.link === null) {
            return null;
        }
        var link_info = this.graph.links[input.link];
        if (!link_info) {
            return null;
        }
        return this.graph.getNodeById(link_info.origin_id);
    },

getInputOrProperty(name) {
        if (this.inputs) {
            for (var i = 0, l = this.inputs.length; i < l; ++i) {
                var input_info = this.inputs[i];
                if (name == input_info.name && input_info.link != null) {
                    var link = this.graph.links[input_info.link];
                    if (link) {
                        return link.data;
                    }
                }
            }
        }
        return this.properties ? this.properties[name] : null;
    },

getOutputData(slot) {
        if (!this.outputs) {
            return null;
        }
        if (slot >= this.outputs.length) {
            return null;
        }

        var info = this.outputs[slot];
        return info._data;
    },

getOutputInfo(slot) {
        if (!this.outputs) {
            return null;
        }
        if (slot < this.outputs.length) {
            return this.outputs[slot];
        }
        return null;
    },

isOutputConnected(slot) {
        if (!this.outputs) {
            return false;
        }
        return (
            slot < this.outputs.length &&
            this.outputs[slot].links &&
            this.outputs[slot].links.length
        );
    },

isAnyOutputConnected() {
        return this.outputs ? this.outputs.some((output) => output.links && output.links.length) : false;
    },

getOutputNodes(slot) {
        if (!this.outputs || slot >= this.outputs.length) {
            return null;
        }

        const output = this.outputs[slot];
        if (!output.links || output.links.length === 0) {
            return null;
        }

        return output.links
            .map((link_id) => this.graph.links[link_id])
            .filter((link) => link)
            .map((link) => this.graph.getNodeById(link.target_id))
            .filter((target_node) => target_node);
    },
};
