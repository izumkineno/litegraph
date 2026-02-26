import { initializeGraphState } from "../shared/initializers.js";
import { mergeOptions } from "../shared/options.js";

let LiteGraph = null;

export function setLifecycleMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const lifecycleMethods = {
getSupportedTypes() {
        return this.supported_types ?? this.constructor.supported_types;
    },

clear() {
        this.stop();
        this.status = this.constructor.STATUS_STOPPED;

        // safe clear
        this._nodes?.forEach((node) => {
            node.onRemoved?.();
        });
        initializeGraphState(this);
        this.configApplyDefaults();

        // notify canvas to redraw
        this.change();

        this.sendActionToCanvas("clear");
    },

configApply(opts) {
        /*
        align_to_grid
        links_ontop
        */
        this.config = mergeOptions(this.config, opts);
    },

configApplyDefaults() {
        var opts = LiteGraph.graphDefaultConfig;
        this.configApply(opts);
    },
};
