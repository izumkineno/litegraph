let LiteGraph = null;

export function setGraphEventsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const graphEventsMethods = {
sendEventToAllNodes(eventname, params, mode = LiteGraph.ALWAYS) {
        var nodes = this._nodes_in_order ? this._nodes_in_order : this._nodes;
        if (!nodes) {
            return;
        }

        for (let j = 0, l = nodes.length; j < l; ++j) {
            const node = nodes[j];

            if (
                node.constructor === LiteGraph.Subgraph &&
                eventname !== "onExecute"
            ) {
                if (node.mode == mode) {
                    node.sendEventToAllNodes(eventname, params, mode);
                }
                continue;
            }

            if (!node[eventname] || node.mode !== mode) {
                continue;
            }
            if (params === undefined) {
                node[eventname]();
            } else if (Array.isArray(params)) {
                node[eventname].apply(node, params);
            } else {
                node[eventname](params);
            }
        }
    },

onAction(action, param, options) {
        this._input_nodes = this.findNodesByClass(
            LiteGraph.GraphInput,
            this._input_nodes,
        );
        for (var i = 0; i < this._input_nodes.length; ++i) {
            var node = this._input_nodes[i];
            if (node.properties.name != action) {
                continue;
            }
            // wrap node.onAction(action, param);
            node.actionDo(action, param, options);
            break;
        }
    },

trigger(action, param) {
        this.onTrigger?.(action, param);
    },

beforeChange(info) {
        this.onBeforeChange?.(this,info);
        this.sendActionToCanvas("onBeforeChange", this);
    },

afterChange(info) {
        this.onAfterChange?.(this,info);
        this.sendActionToCanvas("onAfterChange", this);
    },

connectionChange(node) {
        this.updateExecutionOrder();
        this.onConnectionChange?.(node);
        this.onGraphChanged({action: "connectionChange", doSave: false});
        this.sendActionToCanvas("onConnectionChange");
    },
};
