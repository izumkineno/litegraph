let LiteGraph = null;

export function setGraphPortsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const graphPortsMethods = {
addInput(name, type, value) {
        var input = this.inputs[name];
        if (input) {
            // already exist
            return;
        }

        this.beforeChange();
        this.inputs[name] = { name: name, type: type, value: value };
        this.onGraphChanged({action: "addInput"});
        this.afterChange();
        this.onInputAdded?.(name, type);
        this.onInputsOutputsChange?.();
    },

setInputData(name, data) {
        var input = this.inputs[name];
        if (!input) {
            return;
        }
        input.value = data;
    },

getInputData(name) {
        var input = this.inputs[name];
        if (!input) {
            return null;
        }
        return input.value;
    },

renameInput(old_name, name) {
        if (name == old_name) {
            return;
        }

        if (!this.inputs[old_name]) {
            return false;
        }

        if (this.inputs[name]) {
            LiteGraph.error?.("there is already one input with that name");
            return false;
        }

        this.inputs[name] = this.inputs[old_name];
        delete this.inputs[old_name];
        this.onGraphChanged({action: "renameInput"});

        this.onInputRenamed?.(old_name, name);
        this.onInputsOutputsChange?.();
    },

changeInputType(name, type) {
        if (!this.inputs[name]) {
            return false;
        }

        if (
            this.inputs[name].type &&
            String(this.inputs[name].type).toLowerCase() ==
                String(type).toLowerCase()
        ) {
            return;
        }

        this.inputs[name].type = type;
        this.onGraphChanged({action: "changeInputType"});
        this.onInputTypeChanged?.(name, type);
    },

removeInput(name) {
        if (!this.inputs[name]) {
            return false;
        }

        delete this.inputs[name];
        this.onGraphChanged({action: "graphRemoveInput"});

        this.onInputRemoved?.(name);
        this.onInputsOutputsChange?.();
        return true;
    },

addOutput(name, type, value) {
        this.outputs[name] = { name: name, type: type, value: value };
        this.onGraphChanged({action: "addOutput"});

        this.onOutputAdded?.(name, type);
        this.onInputsOutputsChange?.();
    },

setOutputData(name, value) {
        var output = this.outputs[name];
        if (!output) {
            return;
        }
        output.value = value;
    },

getOutputData(name) {
        var output = this.outputs[name];
        if (!output) {
            return null;
        }
        return output.value;
    },

renameOutput(old_name, name) {
        if (!this.outputs[old_name]) {
            return false;
        }

        if (this.outputs[name]) {
            LiteGraph.error?.("there is already one output with that name");
            return false;
        }

        this.outputs[name] = this.outputs[old_name];
        delete this.outputs[old_name];
        this._version++;

        this.onOutputRenamed?.(old_name, name);
        this.onInputsOutputsChange?.();
    },

changeOutputType(name, type) {
        if (!this.outputs[name]) {
            return false;
        }

        if (
            this.outputs[name].type &&
            String(this.outputs[name].type).toLowerCase() ==
                String(type).toLowerCase()
        ) {
            return;
        }

        this.outputs[name].type = type;
        this.onGraphChanged({action: "changeOutputType"});
        this.onOutputTypeChanged?.(name, type);
    },

removeOutput(name) {
        if (!this.outputs[name]) {
            return false;
        }
        delete this.outputs[name];
        this.onGraphChanged({action: "removeOutput"});

        this.onOutputRemoved?.(name);
        this.onInputsOutputsChange?.();
        return true;
    },

triggerInput(name, value) {
        var nodes = this.findNodesByTitle(name);
        for (var i = 0; i < nodes.length; ++i) {
            nodes[i].onTrigger(value);
        }
    },

setCallback(name, func) {
        var nodes = this.findNodesByTitle(name);
        for (var i = 0; i < nodes.length; ++i) {
            nodes[i].setTrigger(func);
        }
    },
};
