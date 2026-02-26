let LiteGraph = null;

export function setAncestorRefreshMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const ancestorRefreshMethods = {
refreshAncestors(optsIn = {}) {
        var optsDef = {
            action: "",
            param: null,
            options: null,
            passParam: true,
        };
        var opts = Object.assign(optsDef,optsIn);

        if (!this.inputs) {
            return;
        }
        if (LiteGraph.preventAncestorRecalculation) {
            if (this.graph.node_ancestorsCalculated && this.graph.node_ancestorsCalculated[this.id]) {
                // LiteGraph.debug?.("NODE already calculated subtree! Prevent! "+this.id+":"+this.order);
                return;
            }
        }

        if (!opts.action || opts.action == "")
            opts.action = this.id+"_ancestors";
        if (!opts.param || opts.param == "")
            opts.param = this.id+"_ancestors";
        if (!opts.options)
            opts.options = {};
        opts.options = Object.assign({action_call: opts.action},opts.options);

        // LiteGraph.debug?.("ancestors processing");
        // LiteGraph.debug?.(this.id+":"+this.order+" "+opts.options.action_call);

        this.graph.ancestorsCall = true; // prevent triggering slots

        var optsAncestors = {
            modesSkip: [LiteGraph.NEVER, LiteGraph.ON_EVENT, LiteGraph.ON_TRIGGER],
            modesOnly: [LiteGraph.ALWAYS, LiteGraph.ON_REQUEST],
            typesSkip: [LiteGraph.ACTION],
            typesOnly: [],
        };
        var aAncestors = this.graph.getAncestors(this,optsAncestors);
        for(iN in aAncestors) {
            aAncestors[iN].doExecute(opts.param, opts.options);
            this.graph.node_ancestorsCalculated[aAncestors[iN].id] = true;
        }

        this.graph.ancestorsCall = false; // restore triggering slots
        this.graph.node_ancestorsCalculated[this.id] = true;

        return true;
    },
};
