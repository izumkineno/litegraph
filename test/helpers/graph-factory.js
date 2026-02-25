import { LiteGraph } from "../../src/litegraph.js";
import { LGraph } from "../../src/lgraph.js";
import { LGraphNode } from "../../src/lgraphnode.js";

export class TestSourceNode extends LGraphNode {
    constructor() {
        super("Source");
        this.addOutput("out", "number");
        this.mode = LiteGraph.ALWAYS;
    }
}

export class TestTargetNode extends LGraphNode {
    constructor() {
        super("Target");
        this.addInput("in", "number");
    }
}

export function resetLiteGraphRegistry() {
    LiteGraph.registered_node_types = {};
    LiteGraph.Nodes = LiteGraph.Nodes ?? {};
    LiteGraph.node_types_by_file_extension = {};
    LiteGraph.registered_slot_in_types = {};
    LiteGraph.registered_slot_out_types = {};
}

export function registerFactoryNodeTypes(prefix = "test/factory") {
    const sourceType = `${prefix}/source`;
    const targetType = `${prefix}/target`;
    LiteGraph.registerNodeType(sourceType, TestSourceNode);
    LiteGraph.registerNodeType(targetType, TestTargetNode);
    return { sourceType, targetType };
}

export function createGraphWithFactoryNodes(prefix = "test/factory") {
    const graph = new LGraph();
    const { sourceType, targetType } = registerFactoryNodeTypes(prefix);
    const source = LiteGraph.createNode(sourceType);
    const target = LiteGraph.createNode(targetType);

    graph.add(source);
    graph.add(target);

    return { graph, source, target, sourceType, targetType };
}
