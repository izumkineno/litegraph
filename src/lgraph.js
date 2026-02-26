import { LiteGraph } from "./litegraph.js";
import { installLGraphDelegates } from "./lgraph/install-delegates.js";

/**
 * LGraph is the class that contain a full graph. We instantiate one and add nodes to it, and then we can run the execution loop.
 * supported callbacks:
    + onNodeAdded: when a new node is added to the graph
    + onNodeRemoved: when a node inside this graph is removed
    + onNodeConnectionChange: some connection has changed in the graph (connected or disconnected)
 */
export class LGraph {

    // default supported types
    static supported_types = ["number", "string", "boolean"];

    static STATUS_STOPPED = 1;
    static STATUS_RUNNING = 2;

    /**
     * @constructor
     * @param {Object} o data from previous serialization [optional]} o
     */
    constructor(o) {
        LiteGraph.log?.("Graph created");
        this.list_of_graphcanvas = null;
        this.clear();

        if (o) {
            this.configure(o);
        }
    }
}

export function setupLGraphDelegates(liteGraph = LiteGraph) {
    installLGraphDelegates(LGraph, liteGraph);
}
