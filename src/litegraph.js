import { LLink } from "./llink.js";
import { LGraph, setupLGraphDelegates } from "./lgraph.js";
import { LGraphNode, setupLGraphNodeDelegates } from "./lgraphnode.js";
import { LGraphGroup } from "./lgraphgroup.js";
import { LGraphCanvas } from "./lgraphcanvas.js";
import { DragAndScale } from "./dragandscale.js";
import { ContextMenu } from "./contextmenu.js";
import { Canvas2DRendererAdapter } from "./lgraphcanvas/renderer/canvas2d-adapter.js";
import { installLiteGraphDelegates } from "./litegraph/install-delegates.js";
import { applyCoreDefaults } from "./litegraph/shared/defaults-core.js";
import { applyUiDefaults } from "./litegraph/shared/defaults-ui.js";
import { applyBehaviorDefaults } from "./litegraph/shared/defaults-behavior.js";
import { applySlotsDefaults } from "./litegraph/shared/defaults-slots.js";

/**
 * @class LiteGraph
 *
 * @NOTE:
 * Try to avoid adding things to this class.
 * https://dzone.com/articles/singleton-anti-pattern
 */
export var LiteGraph = new class {
    constructor() {
        // from OG LiteGraph, just bringing it back for compatibility
        this.LLink = LLink;
        this.LGraph = LGraph;
        setupLGraphDelegates(this);
        this.LGraphNode = LGraphNode;
        setupLGraphNodeDelegates(this);
        this.LGraphGroup = LGraphGroup;
        this.LGraphCanvas = LGraphCanvas;
        this.Canvas2DRendererAdapter = Canvas2DRendererAdapter;
        this.DragAndScale = DragAndScale;
        this.ContextMenu = ContextMenu;

        installLiteGraphDelegates(this);

        applyCoreDefaults(this);
        applyUiDefaults(this);
        applyBehaviorDefaults(this);
        applySlotsDefaults(this);

        // this.loggingSetup();
        // this.debug = 1;
        // this.debug_level = 1;
        this.logging_set_level(2);
    }
}

// timer that works everywhere
if (typeof performance != "undefined") {
    LiteGraph.getTime = performance.now.bind(performance);
} else if (typeof Date != "undefined" && Date.now) {
    LiteGraph.getTime = Date.now.bind(Date);
} else if (typeof process != "undefined") {
    LiteGraph.getTime = () => {
        var t = process.hrtime();
        return t[0] * 0.001 + t[1] * 1e-6;
    };
} else {
    LiteGraph.getTime = function getTime() {
        return new Date().getTime();
    };
}

if (typeof window != "undefined" && !window["requestAnimationFrame"]) {
    window.requestAnimationFrame =
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        ((callback) => {
            window.setTimeout(callback, 1000 / 60);
        });
}
