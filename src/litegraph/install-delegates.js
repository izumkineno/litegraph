import { loggingMethods, setLoggingMethodsLiteGraph } from "./modules/logging.js";
import { nodeRegistryMethods, setNodeRegistryMethodsLiteGraph } from "./modules/node-registry.js";
import { nodeFactoryMethods, setNodeFactoryMethodsLiteGraph } from "./modules/node-factory.js";
import { slotTypesMethods, setSlotTypesMethodsLiteGraph } from "./modules/slot-types.js";
import { typeCompatMethods, setTypeCompatMethodsLiteGraph } from "./modules/type-compat.js";
import { fileUtilsMethods, setFileUtilsMethodsLiteGraph } from "./modules/file-utils.js";
import { pointerEventsMethods, setPointerEventsMethodsLiteGraph } from "./modules/pointer-events.js";
import { objectUtilsMethods, setObjectUtilsMethodsLiteGraph } from "./modules/object-utils.js";
import { mathColorUtilsMethods, setMathColorUtilsMethodsLiteGraph } from "./modules/math-color-utils.js";
import { canvasTextUtilsMethods, setCanvasTextUtilsMethodsLiteGraph } from "./modules/canvas-text-utils.js";
import { classUtilsMethods, setClassUtilsMethodsLiteGraph } from "./modules/class-utils.js";
import { legacyCompatMethods, setLegacyCompatMethodsLiteGraph } from "./modules/legacy-compat.js";

export function installLiteGraphDelegates(liteGraph) {
    const proto = Object.getPrototypeOf(liteGraph);

    if (proto.__litegraph_delegates_installed) {
        return;
    }

    setLoggingMethodsLiteGraph(liteGraph);
    setNodeRegistryMethodsLiteGraph(liteGraph);
    setNodeFactoryMethodsLiteGraph(liteGraph);
    setSlotTypesMethodsLiteGraph(liteGraph);
    setTypeCompatMethodsLiteGraph(liteGraph);
    setFileUtilsMethodsLiteGraph(liteGraph);
    setPointerEventsMethodsLiteGraph(liteGraph);
    setObjectUtilsMethodsLiteGraph(liteGraph);
    setMathColorUtilsMethodsLiteGraph(liteGraph);
    setCanvasTextUtilsMethodsLiteGraph(liteGraph);
    setClassUtilsMethodsLiteGraph(liteGraph);
    setLegacyCompatMethodsLiteGraph(liteGraph);

    const methodGroups = [
        loggingMethods,
        nodeRegistryMethods,
        nodeFactoryMethods,
        slotTypesMethods,
        typeCompatMethods,
        fileUtilsMethods,
        pointerEventsMethods,
        objectUtilsMethods,
        mathColorUtilsMethods,
        canvasTextUtilsMethods,
        classUtilsMethods,
        legacyCompatMethods,
    ];

    methodGroups.forEach((methods) => {
        const descriptors = Object.getOwnPropertyDescriptors(methods);
        delete descriptors.__proto__;

        Object.entries(descriptors).forEach(([name, descriptor]) => {
            Object.defineProperty(proto, name, {
                ...descriptor,
                configurable: true,
            });
        });
    });

    Object.defineProperty(proto, "__litegraph_delegates_installed", {
        value: true,
        writable: false,
        enumerable: false,
        configurable: false,
    });
}
