import { lifecycleMethods, setLifecycleMethodsLiteGraph } from "./modules/lifecycle.js";
import { canvasBindingMethods, setCanvasBindingMethodsLiteGraph } from "./modules/canvas-binding.js";
import { runtimeLoopMethods, setRuntimeLoopMethodsLiteGraph } from "./modules/runtime-loop.js";
import { executionOrderMethods, setExecutionOrderMethodsLiteGraph } from "./modules/execution-order.js";
import { nodeMutationMethods, setNodeMutationMethodsLiteGraph } from "./modules/node-mutation.js";
import { nodeQueryMethods, setNodeQueryMethodsLiteGraph } from "./modules/node-query.js";
import { graphPortsMethods, setGraphPortsMethodsLiteGraph } from "./modules/graph-ports.js";
import { graphEventsMethods, setGraphEventsMethodsLiteGraph } from "./modules/graph-events.js";
import { serializationLoadMethods, setSerializationLoadMethodsLiteGraph } from "./modules/serialization-load.js";
import { historyMethods, setHistoryMethodsLiteGraph } from "./modules/history.js";

export function installLGraphDelegates(LGraph, LiteGraph) {
    if (LGraph.__delegates_installed) {
        return;
    }

    setLifecycleMethodsLiteGraph(LiteGraph);
    setCanvasBindingMethodsLiteGraph(LiteGraph);
    setRuntimeLoopMethodsLiteGraph(LiteGraph);
    setExecutionOrderMethodsLiteGraph(LiteGraph);
    setNodeMutationMethodsLiteGraph(LiteGraph);
    setNodeQueryMethodsLiteGraph(LiteGraph);
    setGraphPortsMethodsLiteGraph(LiteGraph);
    setGraphEventsMethodsLiteGraph(LiteGraph);
    setSerializationLoadMethodsLiteGraph(LiteGraph);
    setHistoryMethodsLiteGraph(LiteGraph);

    const methodGroups = [
        lifecycleMethods,
        canvasBindingMethods,
        runtimeLoopMethods,
        executionOrderMethods,
        nodeMutationMethods,
        nodeQueryMethods,
        graphPortsMethods,
        graphEventsMethods,
        serializationLoadMethods,
        historyMethods,
    ];

    methodGroups.forEach((methods) => {
        Object.entries(methods).forEach(([name, fn]) => {
            Object.defineProperty(LGraph.prototype, name, {
                value: fn,
                writable: true,
                configurable: true,
            });
        });
    });

    Object.defineProperty(LGraph, "__delegates_installed", {
        value: true,
        writable: false,
        configurable: false,
    });
}
