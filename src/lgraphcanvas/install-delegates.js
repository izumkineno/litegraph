import { createLGraphCanvasControllers } from "./controllers/index.js";

const delegateMap = {
    "clear": "core",
    "setGraph": "core",
    "getTopGraph": "core",
    "openSubgraph": "core",
    "closeSubgraph": "core",
    "getCurrentGraph": "core",
    "setCanvas": "core",
    "_doNothing": "core",
    "_doReturnTrue": "core",
    "bindEvents": "core",
    "unbindEvents": "core",
    "enableWebGL": "core",
    "setDirty": "core",
    "getCanvasWindow": "core",
    "startRendering": "core",
    "stopRendering": "core",
    "blockClick": "events",
    "processUserInputDown": "events",
    "processMouseDown": "events",
    "processMouseMove": "events",
    "processMouseUp": "events",
    "processMouseWheel": "events",
    "isOverNodeBox": "core",
    "isOverNodeInput": "core",
    "isOverNodeOutput": "core",
    "processKey": "events",
    "copyToClipboard": "selection",
    "pasteFromClipboard": "selection",
    "processDrop": "events",
    "checkDropItem": "events",
    "processNodeDblClicked": "selection",
    "processNodeSelected": "selection",
    "selectNode": "selection",
    "selectNodes": "selection",
    "deselectNode": "selection",
    "deselectAllNodes": "selection",
    "deleteSelectedNodes": "selection",
    "centerOnNode": "core",
    "adjustMouseEvent": "core",
    "setZoom": "core",
    "convertOffsetToCanvas": "core",
    "convertCanvasToOffset": "core",
    "convertEventToCanvasOffset": "core",
    "bringToFront": "core",
    "sendToBack": "core",
    "computeVisibleNodes": "core",
    "draw": "render",
    "drawFrontCanvas": "render",
    "drawSubgraphPanel": "render",
    "drawSubgraphPanelLeft": "render",
    "drawSubgraphPanelRight": "render",
    "drawButton": "render",
    "isAreaClicked": "render",
    "renderInfo": "render",
    "drawBackCanvas": "render",
    "drawNode": "render",
    "drawNodeTooltip": "render",
    "drawLinkTooltip": "render",
    "drawNodeShape": "render",
    "drawConnections": "render",
    "renderLink": "render",
    "computeConnectionPoint": "render",
    "drawExecutionOrder": "render",
    "drawNodeWidgets": "render",
    "processNodeWidgets": "render",
    "drawGroups": "render",
    "adjustNodesSize": "render",
    "resize": "core",
    "switchLiveMode": "core",
    "onNodeSelectionChange": "selection",
    "boundaryNodesForSelection": "selection",
    "showLinkMenu": "ui",
    "createDefaultNodeForSlot": "ui",
    "showConnectionMenu": "ui",
    "prompt": "ui",
    "showSearchBox": "ui",
    "showEditPropertyValue": "ui",
    "createDialog": "ui",
    "createPanel": "ui",
    "closePanels": "ui",
    "showShowGraphOptionsPanel": "ui",
    "showShowNodePanel": "ui",
    "showSubgraphPropertiesDialog": "ui",
    "showSubgraphPropertiesDialogRight": "ui",
    "checkPanels": "ui",
    "getCanvasMenuOptions": "ui",
    "getNodeMenuOptions": "ui",
    "getGroupMenuOptions": "ui",
    "processContextMenu": "ui",
    "lowQualityRenderingRequired": "render"
};

function ensureControllers(instance) {
    if (!instance.controllers) {
        instance.controllers = createLGraphCanvasControllers(instance);
    }
    return instance.controllers;
}

export function installLGraphCanvasDelegates(LGraphCanvasClass) {
    for (const [methodName, controllerName] of Object.entries(delegateMap)) {
        Object.defineProperty(LGraphCanvasClass.prototype, methodName, {
            value: function (...args) {
                const controllers = ensureControllers(this);
                return controllers[controllerName][methodName](...args);
            },
            writable: true,
            configurable: true,
        });
    }
}
