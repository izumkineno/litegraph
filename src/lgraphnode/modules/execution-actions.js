let LiteGraph = null;

export function setExecutionActionsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const executionActionsMethods = {
addOnTriggerInput() {
        var trigS = this.findInputSlot("onTrigger");
        if (trigS == -1) { // !trigS ||
            this.addInput("onTrigger", LiteGraph.EVENT, {removable: true, nameLocked: true});
            return this.findInputSlot("onTrigger");
        }
        return trigS;
    },

addOnExecutedOutput() {
        var trigS = this.findOutputSlot("onExecuted");
        if (trigS == -1) { // !trigS ||
            this.addOutput("onExecuted", LiteGraph.ACTION, {removable: true, nameLocked: true});
            return this.findOutputSlot("onExecuted");
        }
        return trigS;
    },

onAfterExecuteNode(param, options) {
        var trigS = this.findOutputSlot("onExecuted");
        if (trigS != -1) {
            LiteGraph.debug?.(this.id+":"+this.order+" triggering slot onAfterExecute", param, options);
            this.triggerSlot(trigS, param, null, options);
        }
    },

changeMode(modeTo) {
        switch(modeTo) {

            case LiteGraph.ON_TRIGGER:
                this.addOnTriggerInput();
                this.addOnExecutedOutput();
                break;

            case LiteGraph.ON_EVENT:
                // this.addOnExecutedOutput();
                break;
            case LiteGraph.NEVER:
                break;
            case LiteGraph.ALWAYS:
                break;
            case LiteGraph.ON_REQUEST:
                break;

            default:
                return false;
        }
        this.mode = modeTo;
        return true;
    },

executePendingActions() {
        if(!this._waiting_actions || !this._waiting_actions.length)
            return;
        this._waiting_actions.forEach((p) => {
            this.onAction(p[0], p[1], p[2], p[3], p[4]);
        });
        this._waiting_actions.length = 0;
    },

doExecute(param, options = {}) {
        if (this.onExecute) {

            // enable this to give the event an ID
            options.action_call ??= `${this.id}_exec_${Math.floor(Math.random()*9999)}`;

            if (this.graph.nodes_executing && this.graph.nodes_executing[this.id]) {
                LiteGraph.debug?.("NODE already executing! Prevent! "+this.id+":"+this.order);
                return;
            }
            if (LiteGraph.ensureNodeSingleExecution && this.exec_version && this.exec_version >= this.graph.iteration && this.exec_version !== undefined) {
                LiteGraph.debug?.("!! NODE already EXECUTED THIS STEP !! "+this.exec_version);
                return;
            }
            // LiteGraph.debug?.("Actioned ? "+this.id+":"+this.order+" :: "+this.action_call);
            if (LiteGraph.ensureUniqueExecutionAndActionCall) {
                // if(this.action_call && options && options.action_call && this.action_call == options.action_call){
                if(this.graph.nodes_executedAction[this.id] && options && options.action_call && this.graph.nodes_executedAction[this.id] == options.action_call) {
                    LiteGraph.debug?.("!! NODE already ACTION THIS STEP !! "+options.action_call);
                    return;
                }
            }

            this.graph.nodes_executing[this.id] = true; // .push(this.id);

            this.onExecute(param, options);

            this.graph.nodes_executing[this.id] = false; // .pop();

            // save execution/action ref
            this.exec_version = this.graph.iteration;
            if(options && options.action_call) {
                this.action_call = options.action_call; // if (param)
                this.graph.nodes_executedAction[this.id] = options.action_call;
            }
        }
        this.execute_triggered = 2; // the nFrames it will be used (-- each step), means "how old" is the event
        this.onAfterExecuteNode?.(param, options); // callback
    },

execute(param, options = {}) {
        return this.doExecute(param, options);
    },

actionDo(action, param, options = {}, action_slot) {
        if (this.onAction) {

            // enable this to give the event an ID
            options.action_call ??= `${this.id}_${action?action:"action"}_${Math.floor(Math.random()*9999)}`;

            if (LiteGraph.ensureNodeSingleAction) {
                if (this.graph.nodes_actioning && this.graph.nodes_actioning[this.id] == options.action_call) { // == action){
                    // LiteGraph.debug?.("NODE already actioning! Prevent! "+this.id+":"+this.order+" :: "+options.action_call);
                    return;
                }
            }
            LiteGraph.debug?.("CheckActioned ? "+this.id+":"+this.order+" :: "+this.action_call);
            if (LiteGraph.ensureUniqueExecutionAndActionCall) {
                // if(this.action_call && options && options.action_call && this.action_call == options.action_call){
                if(this.graph.nodes_executedAction[this.id] && options && options.action_call && this.graph.nodes_executedAction[this.id] == options.action_call) {
                    LiteGraph.debug?.("!! NODE already ACTION THIS STEP !! "+options.action_call);ç
                    return;
                }
            }

            this.graph.nodes_actioning[this.id] = (action?action:"actioning"); // .push(this.id);

            this.onAction(action, param, options, action_slot);

            this.graph.nodes_actioning[this.id] = false; // .pop();

            // save execution/action ref
            if(options && options.action_call) {
                this.action_call = options.action_call; // if (param)
                this.graph.nodes_executedAction[this.id] = options.action_call;
            }
        }
        this.action_triggered = 2; // the nFrames it will be used (-- each step), means "how old" is the event
        this.onAfterExecuteNode?.(param, options);
    },

trigger(action, param, options) {
        if (!this.outputs || this.outputs.length === 0) {
            return;
        }

        this.graph && (this.graph._last_trigger_time = LiteGraph.getTime());

        this.outputs.forEach((output, i) => {
            if (output && output.type === LiteGraph.EVENT && (!action || output.name === action)) {
                this.triggerSlot(i, param, null, options);
            }
        });
    },

triggerSlot(slot, param, link_id, options = {}) {
        if (!this.outputs) {
            return;
        }

        if(slot == null) {
            LiteGraph.error?.("triggerSlot","slot must be a number");
            return;
        }

        if(slot.constructor !== Number)
            LiteGraph.warn?.("triggerSlot","slot must be a number, use node.trigger('name') if you want to use a string");

        var output = this.outputs[slot];
        if (!output) {
            return;
        }

        var links = output.links;
        if (!links || !links.length) {
            return;
        }

        // check for ancestors calls
        if (this.graph && this.graph.ancestorsCall) {
            // LiteGraph.debug?.("ancestors call, prevent triggering slot "+slot+" on "+this.id+":"+this.order);
            return;
        }

        if (this.graph) {
            this.graph._last_trigger_time = LiteGraph.getTime();
        }

        // for every link attached here
        for (var k = 0; k < links.length; ++k) {
            var id = links[k];
            if (link_id != null && link_id != id) {
                // to skip links
                continue;
            }
            var link_info = this.graph.links[links[k]];
            if (!link_info) {
                // not connected
                continue;
            }
            link_info._last_time = LiteGraph.getTime();
            var node = this.graph.getNodeById(link_info.target_id);
            if (!node) {
                // node not found?
                continue;
            }

            if (node.mode === LiteGraph.ON_TRIGGER) {
                // generate unique trigger ID if not present
                if (!options.action_call)
                    options.action_call = `${this.id}_trigg_${Math.floor(Math.random()*9999)}`;
                if (LiteGraph.refreshAncestorsOnTriggers)
                    node.refreshAncestors({action: "trigger", param: param, options: options});
                if (node.onExecute) {
                    // -- wrapping node.onExecute(param); --
                    node.doExecute(param, options);
                }
            } else if (node.onAction) {
                // generate unique action ID if not present
                if (!options.action_call) options.action_call = `${this.id}_act_${Math.floor(Math.random()*9999)}`;
                // pass the action name
                let target_connection = node.inputs[link_info.target_slot];

                LiteGraph.debug?.("triggerSlot","will call onACTION: "+this.id+":"+this.order+" :: "+target_connection.name);

                // METHOD 1 ancestors
                if (LiteGraph.refreshAncestorsOnActions)
                    node.refreshAncestors({action: target_connection.name, param: param, options: options});

                // instead of executing them now, it will be executed in the next graph loop, to ensure data flow
                if(LiteGraph.use_deferred_actions && node.onExecute) {
                    node._waiting_actions ??= [];
                    node._waiting_actions.push([target_connection.name, param, options, link_info.target_slot]);
                } else {
                    // wrap node.onAction(target_connection.name, param);
                    node.actionDo( target_connection.name, param, options, link_info.target_slot );
                }
            }
        }
    },

clearTriggeredSlot(slot, link_id) {
        if (!this.outputs || !this.outputs[slot] || !this.outputs[slot].links) {
            return;
        }

        this.outputs[slot].links.forEach((id) => {
            if (link_id !== null && link_id !== id) {
                // Skip links
                return;
            }

            const link_info = this.graph.links[id];
            if (!link_info) {
                // Not connected
                return;
            }

            link_info._last_time = 0;
        });
    },
};
