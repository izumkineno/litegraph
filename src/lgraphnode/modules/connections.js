let LiteGraph = null;

export function setConnectionsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const connectionsMethods = {
connectByType(slot, target_node, target_slotType = "*", optsIn = {}) {
        var optsDef = {
            createEventInCase: true,
            firstFreeIfOutputGeneralInCase: true,
            generalTypeInCase: true,
        };
        var opts = Object.assign(optsDef,optsIn);
        if (target_node && target_node.constructor === Number) {
            target_node = this.graph.getNodeById(target_node);
        }
        var target_slot = target_node.findInputSlotByType(target_slotType, false, true);
        if (target_slot >= 0 && target_slot !== null) {
            LiteGraph.debug?.("CONNbyTYPE type "+target_slotType+" for "+target_slot)
            return this.connect(slot, target_node, target_slot);
        }else{
            // LiteGraph.log?.("type "+target_slotType+" not found or not free?")
            if (opts.createEventInCase && target_slotType == LiteGraph.EVENT) {
                // WILL CREATE THE onTrigger IN SLOT
                LiteGraph.debug?.("connect WILL CREATE THE onTrigger "+target_slotType+" to "+target_node);
                return this.connect(slot, target_node, -1);
            }
            // connect to the first general output slot if not found a specific type and
            if (opts.generalTypeInCase) {
                target_slot = target_node.findInputSlotByType(0, false, true, true);
                LiteGraph.debug?.("connect TO a general type (*, 0), if not found the specific type ",target_slotType," to ",target_node,"RES_SLOT:",target_slot);
                if (target_slot >= 0) {
                    return this.connect(slot, target_node, target_slot);
                }
            }
            // connect to the first free input slot if not found a specific type and this output is general
            if (opts.firstFreeIfOutputGeneralInCase && (target_slotType == 0 || target_slotType == "*" || target_slotType == "")) {
                target_slot = target_node.findInputSlotFree({typesNotAccepted: [LiteGraph.EVENT] });
                LiteGraph.debug?.("connect TO TheFirstFREE ",target_slotType," to ",target_node,"RES_SLOT:",target_slot);
                if (target_slot >= 0) {
                    return this.connect(slot, target_node, target_slot);
                }
            }
            LiteGraph.debug?.("no way to connect type: ",target_slotType," to targetNODE ",target_node);

            return null;
        }
    },

connectByTypeOutput(slot, source_node, source_slotType = "*", optsIn = {}) {
        var optsDef = {
            createEventInCase: true,
            firstFreeIfInputGeneralInCase: true,
            generalTypeInCase: true,
        };
        var opts = Object.assign(optsDef,optsIn);
        if (source_node && source_node.constructor === Number) {
            source_node = this.graph.getNodeById(source_node);
        }
        var source_slot = source_node.findOutputSlotByType(source_slotType, false, true);
        if (source_slot >= 0 && source_slot !== null) {
            LiteGraph.debug?.("CONNbyTYPE OUT! type "+source_slotType+" for "+source_slot)
            return source_node.connect(source_slot, this, slot);
        }else{

            // connect to the first general output slot if not found a specific type and
            if (opts.generalTypeInCase) {
                source_slot = source_node.findOutputSlotByType(0, false, true, true);
                if (source_slot >= 0) {
                    return source_node.connect(source_slot, this, slot);
                }
            }

            if (opts.createEventInCase && source_slotType == LiteGraph.EVENT) {
                // WILL CREATE THE onExecuted OUT SLOT
                if (LiteGraph.do_add_triggers_slots) {
                    source_slot = source_node.addOnExecutedOutput();
                    return source_node.connect(source_slot, this, slot);
                }
            }
            // connect to the first free output slot if not found a specific type and this input is general
            if (opts.firstFreeIfInputGeneralInCase && (source_slotType == 0 || source_slotType == "*" || source_slotType == "" || source_slotType == "undefined")) {
                source_slot = source_node.findOutputSlotFree({typesNotAccepted: [LiteGraph.EVENT] });
                if (source_slot >= 0) {
                    return source_node.connect(source_slot, this, slot);
                }
            }

            LiteGraph.debug?.("no way to connect byOUT type: ",source_slotType," to sourceNODE ",source_node);

            LiteGraph.log?.("type OUT! "+source_slotType+" not found or not free?")
            return null;
        }
    },

connect(slot, target_node, target_slot = 0) {
        if (!this.graph) {
            // could be connected before adding it to a graph
            LiteGraph.log?.("Connect: Error, node doesn't belong to any graph. Nodes must be added first to a graph before connecting them."); // due to link ids being associated with graphs
            return null;
        }

        // seek for the output slot
        if (slot.constructor === String) {
            slot = this.findOutputSlot(slot);
            if (slot == -1) {
                LiteGraph.log?.(`Connect: Error, no slot of name ${slot}`);
                return null;
            }
        } else if (!this.outputs || slot >= this.outputs.length) {
            LiteGraph.log?.("Connect: Error, slot number not found");
            return null;
        }

        if (target_node && target_node.constructor === Number) {
            target_node = this.graph.getNodeById(target_node);
        }
        if (!target_node) {
            throw new Error("target node is null");
        }

        // avoid loopback
        if (target_node == this) {
            return null;
        }

        // you can specify the slot by name
        if (target_slot.constructor === String) {
            target_slot = target_node.findInputSlot(target_slot);
            if (target_slot == -1) {
                LiteGraph.log?.(`Connect: Error, no slot of name ${target_slot}`);
                return null;
            }
        } else if (target_slot === LiteGraph.EVENT) {

            if (LiteGraph.do_add_triggers_slots) {
                // search for first slot with event? :: NO this is done outside
                // LiteGraph.log?.("Connect: Creating triggerEvent");
                // force mode
                target_node.changeMode(LiteGraph.ON_TRIGGER);
                target_slot = target_node.findInputSlot("onTrigger");
            }else{
                return null; // -- break --
            }
        } else if (
            !target_node.inputs ||
            target_slot >= target_node.inputs.length
        ) {
            LiteGraph.log?.("Connect: Error, slot number not found");
            return null;
        }

        var changed = false;

        var input = target_node.inputs[target_slot];
        var link_info = null;
        var output = this.outputs[slot];

        if (!this.outputs[slot]) {
            LiteGraph.log?.("Invalid slot passed: ",slot,this.outputs);
            return null;
        }

        if(target_node.onBeforeConnectInput) {
            target_slot = target_node.onBeforeConnectInput(target_node); // callback
        }

        if ( this.onConnectOutput?.(slot, input.type, input, target_node, target_slot) === false ) {
            return null;
        }

        // check target_slot and check connection types
        if (target_slot===false || target_slot===null || !LiteGraph.isValidConnection(output.type, input.type)) {
            this.setDirtyCanvas(false, true);
            if(changed)
                this.graph.connectionChange(this, link_info);
            return null;
        } else {
            LiteGraph.debug?.("DBG targetSlot",target_slot);
        }

        // allows nodes to block connection, callback
        if ( target_node.onConnectInput?.(target_slot, output.type, output, this, slot) === false ) {
            return null;
        }
        if ( this.onConnectOutput?.(slot, input.type, input, target_node, target_slot) === false ) {
            return null;
        }

        // if there is something already plugged there, disconnect
        if (target_node.inputs[target_slot] && target_node.inputs[target_slot].link != null) {
            this.graph.beforeChange();
            target_node.disconnectInput(target_slot, {doProcessChange: false});
            changed = true;
        }
        if (output.links?.length) {
            switch(output.type) {
                case LiteGraph.EVENT:
                    if (!LiteGraph.allow_multi_output_for_events) {
                        this.graph.beforeChange();
                        this.disconnectOutput(slot, false, {doProcessChange: false}); // Input(target_slot, {doProcessChange: false});
                        changed = true;
                    }
                    break;
                default:
                    break;
            }
        }

        var nextId
        if (LiteGraph.use_uuids)
            nextId = LiteGraph.uuidv4();
        else
            nextId = ++this.graph.last_link_id;

        // create link class
        link_info = new LiteGraph.LLink(
            nextId,
            input.type || output.type,
            this.id,
            slot,
            target_node.id,
            target_slot,
        );

        // add to graph links list
        this.graph.links[link_info.id] = link_info;

        // connect in output
        if (output.links == null) {
            output.links = [];
        }
        output.links.push(link_info.id);
        // connect in input
        if (!target_node.inputs || typeof target_node.inputs[target_slot] === "undefined") {
            LiteGraph.warn?.("connect aborted: target slot does not exist on target node", target_node, target_slot);
            output.links.pop();
            delete this.graph.links[link_info.id];
            return null;
        }
        target_node.inputs[target_slot].link = link_info.id;

        this.onConnectionsChange?.(
            LiteGraph.OUTPUT,
            slot,
            true,
            link_info,
            output,
        );
        // link_info has been created now, so its updated
        target_node.onConnectionsChange?.(
            LiteGraph.INPUT,
            target_slot,
            true,
            link_info,
            input,
        );
        if (this.graph && this.graph.onNodeConnectionChange) {
            this.graph.onNodeConnectionChange(
                LiteGraph.INPUT,
                target_node,
                target_slot,
                this,
                slot,
            );
            this.graph.onNodeConnectionChange(
                LiteGraph.OUTPUT,
                this,
                slot,
                target_node,
                target_slot,
            );
        }

        this.graph.onGraphChanged({action: "connect"});
        this.setDirtyCanvas(false, true);
        this.graph.afterChange();
        this.graph.connectionChange(this, link_info);

        return link_info;
    },

disconnectOutput(slot, target_node, optsIn = {}) {
        var optsDef = { doProcessChange: true };
        var opts = Object.assign(optsDef,optsIn);

        if (slot.constructor === String) {
            slot = this.findOutputSlot(slot);
            if (slot == -1) {
                LiteGraph.log?.(`Connect: Error, no slot of name ${slot}`);
                return false;
            }
        } else if (!this.outputs || slot >= this.outputs.length) {
            LiteGraph.log?.("Connect: Error, slot number not found");
            return false;
        }

        // get output slot
        var output = this.outputs[slot];
        if (!output || !output.links || output.links.length == 0) {
            return false;
        }

        // one of the output links in this slot
        if (target_node) {
            if (target_node.constructor === Number) {
                target_node = this.graph.getNodeById(target_node);
            }
            if (!target_node) {
                throw new Error("Target Node not found");
            }

            for (let i = 0, l = output.links.length; i < l; i++) {
                let link_id = output.links[i];
                let link_info = this.graph.links[link_id];

                // is the link we are searching for...
                if (link_info.target_id == target_node.id) {
                    output.links.splice(i, 1); // remove here
                    var input = target_node.inputs[link_info.target_slot];
                    input.link = null; // remove there
                    delete this.graph.links[link_id]; // remove the link from the links pool
                    this.graph?.onGraphChanged({action: "disconnectOutput", doSave: opts.doProcessChange});
                    target_node.onConnectionsChange?.(
                        LiteGraph.INPUT,
                        link_info.target_slot,
                        false,
                        link_info,
                        input,
                    );
                    // link_info hasn't been modified so its ok
                    this.onConnectionsChange?.(
                        LiteGraph.OUTPUT,
                        slot,
                        false,
                        link_info,
                        output,
                    );
                    if (this.graph && this.graph.onNodeConnectionChange) {
                        this.graph.onNodeConnectionChange(
                            LiteGraph.OUTPUT,
                            this,
                            slot,
                        );
                        this.graph.onNodeConnectionChange(
                            LiteGraph.OUTPUT,
                            this,
                            slot,
                        );
                        this.graph.onNodeConnectionChange(
                            LiteGraph.INPUT,
                            target_node,
                            link_info.target_slot,
                        );
                    }
                    break;
                }
            }
        } else { // all the links in this output slot
            for (let i = 0, l = output.links.length; i < l; i++) {
                let link_id = output.links[i];
                let link_info = this.graph.links[link_id];
                if (!link_info) {
                    // bug: it happens sometimes
                    continue;
                }

                target_node = this.graph.getNodeById(link_info.target_id);
                input = null;
                this.graph?.onGraphChanged({action: "disconnectOutput", doSave: opts.doProcessChange});
                if (target_node) {
                    input = target_node.inputs[link_info.target_slot];
                    input.link = null; // remove other side link
                    if (target_node.onConnectionsChange) {
                        target_node.onConnectionsChange(
                            LiteGraph.INPUT,
                            link_info.target_slot,
                            false,
                            link_info,
                            input,
                        );
                    } // link_info hasn't been modified so its ok
                    if (this.graph && this.graph.onNodeConnectionChange) {
                        this.graph.onNodeConnectionChange(
                            LiteGraph.INPUT,
                            target_node,
                            link_info.target_slot,
                        );
                    }
                }
                delete this.graph.links[link_id]; // remove the link from the links pool
                if (this.onConnectionsChange) {
                    this.onConnectionsChange(
                        LiteGraph.OUTPUT,
                        slot,
                        false,
                        link_info,
                        output,
                    );
                }
                if (this.graph && this.graph.onNodeConnectionChange) {
                    this.graph.onNodeConnectionChange(
                        LiteGraph.OUTPUT,
                        this,
                        slot,
                    );
                    this.graph.onNodeConnectionChange(
                        LiteGraph.INPUT,
                        target_node,
                        link_info.target_slot,
                    );
                }
            }
            output.links = null;
        }

        this.setDirtyCanvas(false, true);
        this.graph.connectionChange(this);
        return true;
    },

disconnectInput(slot, optsIn = {}) {
        var optsDef = { doProcessChange: true };
        var opts = Object.assign(optsDef,optsIn);

        // seek for the output slot
        if (slot.constructor === String) {
            slot = this.findInputSlot(slot);
            if (slot == -1) {
                LiteGraph.log?.(`Connect: Error, no slot of name ${slot}`);
                return false;
            }
        } else if (!this.inputs || slot >= this.inputs.length) {
            LiteGraph.log?.("Connect: Error, slot number not found");
            return false;
        }

        var input = this.inputs[slot];
        if (!input) {
            return false;
        }

        var link_id = this.inputs[slot].link;
        if(link_id != null) {
            this.inputs[slot].link = null;

            // remove other side
            var link_info = this.graph.links[link_id];
            if (link_info) {
                var target_node = this.graph.getNodeById(link_info.origin_id);
                if (!target_node) {
                    return false;
                }

                var output = target_node.outputs[link_info.origin_slot];
                if (!output || !output.links || output.links.length == 0) {
                    return false;
                }

                // search in the inputs list for this link
                for (var i = 0, l = output.links.length; i < l; i++) {
                    if (output.links[i] == link_id) {
                        output.links.splice(i, 1);
                        break;
                    }
                }

                delete this.graph.links[link_id]; // remove from the pool
                this.graph?.onGraphChanged({action: "disconnectInput", doSave: opts.doProcessChange});

                if (this.onConnectionsChange) {
                    this.onConnectionsChange(
                        LiteGraph.INPUT,
                        slot,
                        false,
                        link_info,
                        input,
                    );
                }
                if (target_node.onConnectionsChange) {
                    target_node.onConnectionsChange(
                        LiteGraph.OUTPUT,
                        i,
                        false,
                        link_info,
                        output,
                    );
                }
                if (this.graph && this.graph.onNodeConnectionChange) {
                    this.graph.onNodeConnectionChange(
                        LiteGraph.OUTPUT,
                        target_node,
                        i,
                    );
                    this.graph.onNodeConnectionChange(LiteGraph.INPUT, this, slot);
                }
            }
        } // link != null

        this.setDirtyCanvas(false, true);
        if(this.graph)
            this.graph.connectionChange(this);
        return true;
    },
};
