import { lifecycleSerializationMethods, setLifecycleSerializationMethodsLiteGraph } from "./modules/lifecycle-serialization.js";
import { propertiesWidgetsMethods, setPropertiesWidgetsMethodsLiteGraph } from "./modules/properties-widgets.js";
import { ioDataMethods, setIoDataMethodsLiteGraph } from "./modules/io-data.js";
import { executionActionsMethods, setExecutionActionsMethodsLiteGraph } from "./modules/execution-actions.js";
import { slotsMutationMethods, setSlotsMutationMethodsLiteGraph } from "./modules/slots-mutation.js";
import { slotsQueryMethods, setSlotsQueryMethodsLiteGraph } from "./modules/slots-query.js";
import { connectionsMethods, setConnectionsMethodsLiteGraph } from "./modules/connections.js";
import { geometryHitMethods, setGeometryHitMethodsLiteGraph } from "./modules/geometry-hit.js";
import { canvasIntegrationMethods, setCanvasIntegrationMethodsLiteGraph } from "./modules/canvas-integration.js";
import { ancestorRefreshMethods, setAncestorRefreshMethodsLiteGraph } from "./modules/ancestor-refresh.js";
import { miscMethods, setMiscMethodsLiteGraph } from "./modules/misc.js";

export function installLGraphNodeDelegates(LGraphNode, LiteGraph) {
    setLifecycleSerializationMethodsLiteGraph(LiteGraph);
    setPropertiesWidgetsMethodsLiteGraph(LiteGraph);
    setIoDataMethodsLiteGraph(LiteGraph);
    setExecutionActionsMethodsLiteGraph(LiteGraph);
    setSlotsMutationMethodsLiteGraph(LiteGraph);
    setSlotsQueryMethodsLiteGraph(LiteGraph);
    setConnectionsMethodsLiteGraph(LiteGraph);
    setGeometryHitMethodsLiteGraph(LiteGraph);
    setCanvasIntegrationMethodsLiteGraph(LiteGraph);
    setAncestorRefreshMethodsLiteGraph(LiteGraph);
    setMiscMethodsLiteGraph(LiteGraph);

    const methodGroups = [
        lifecycleSerializationMethods,
        propertiesWidgetsMethods,
        ioDataMethods,
        executionActionsMethods,
        slotsMutationMethods,
        slotsQueryMethods,
        connectionsMethods,
        geometryHitMethods,
        canvasIntegrationMethods,
        ancestorRefreshMethods,
        miscMethods,
    ];

    methodGroups.forEach((methods) => {
        Object.entries(methods).forEach(([name, fn]) => {
            Object.defineProperty(LGraphNode.prototype, name, {
                value: fn,
                writable: true,
                configurable: true,
            });
        });
    });
}
