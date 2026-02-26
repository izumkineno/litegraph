import * as lifecycle from "../modules/lifecycle.js";
import * as viewport_coords from "../modules/viewport-coords.js";
import * as hittest_order from "../modules/hittest-order.js";

export class CoreController {
    constructor(host) {
        this.host = host;
    }

    clear(...args) {
        return lifecycle.clear.apply(this.host, args);
    }

    setGraph(...args) {
        return lifecycle.setGraph.apply(this.host, args);
    }

    getTopGraph(...args) {
        return lifecycle.getTopGraph.apply(this.host, args);
    }

    openSubgraph(...args) {
        return lifecycle.openSubgraph.apply(this.host, args);
    }

    closeSubgraph(...args) {
        return lifecycle.closeSubgraph.apply(this.host, args);
    }

    getCurrentGraph(...args) {
        return lifecycle.getCurrentGraph.apply(this.host, args);
    }

    setCanvas(...args) {
        return lifecycle.setCanvas.apply(this.host, args);
    }

    _doNothing(...args) {
        return lifecycle._doNothing.apply(this.host, args);
    }

    _doReturnTrue(...args) {
        return lifecycle._doReturnTrue.apply(this.host, args);
    }

    bindEvents(...args) {
        return lifecycle.bindEvents.apply(this.host, args);
    }

    unbindEvents(...args) {
        return lifecycle.unbindEvents.apply(this.host, args);
    }

    enableWebGL(...args) {
        return lifecycle.enableWebGL.apply(this.host, args);
    }

    setDirty(...args) {
        return lifecycle.setDirty.apply(this.host, args);
    }

    getCanvasWindow(...args) {
        return lifecycle.getCanvasWindow.apply(this.host, args);
    }

    startRendering(...args) {
        return lifecycle.startRendering.apply(this.host, args);
    }

    stopRendering(...args) {
        return lifecycle.stopRendering.apply(this.host, args);
    }

    resize(...args) {
        return lifecycle.resize.apply(this.host, args);
    }

    switchLiveMode(...args) {
        return lifecycle.switchLiveMode.apply(this.host, args);
    }

    centerOnNode(...args) {
        return viewport_coords.centerOnNode.apply(this.host, args);
    }

    adjustMouseEvent(...args) {
        return viewport_coords.adjustMouseEvent.apply(this.host, args);
    }

    setZoom(...args) {
        return viewport_coords.setZoom.apply(this.host, args);
    }

    convertOffsetToCanvas(...args) {
        return viewport_coords.convertOffsetToCanvas.apply(this.host, args);
    }

    convertCanvasToOffset(...args) {
        return viewport_coords.convertCanvasToOffset.apply(this.host, args);
    }

    convertEventToCanvasOffset(...args) {
        return viewport_coords.convertEventToCanvasOffset.apply(this.host, args);
    }

    isOverNodeBox(...args) {
        return hittest_order.isOverNodeBox.apply(this.host, args);
    }

    isOverNodeInput(...args) {
        return hittest_order.isOverNodeInput.apply(this.host, args);
    }

    isOverNodeOutput(...args) {
        return hittest_order.isOverNodeOutput.apply(this.host, args);
    }

    bringToFront(...args) {
        return hittest_order.bringToFront.apply(this.host, args);
    }

    sendToBack(...args) {
        return hittest_order.sendToBack.apply(this.host, args);
    }

    computeVisibleNodes(...args) {
        return hittest_order.computeVisibleNodes.apply(this.host, args);
    }

}
