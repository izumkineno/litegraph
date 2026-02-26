let LiteGraph = null;

export function setCanvasBindingMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const canvasBindingMethods = {
attachCanvas(graphcanvas) {
        if (! graphcanvas instanceof LiteGraph.LGraphCanvas) {
            throw new Error("attachCanvas expects a LiteGraph.LGraphCanvas instance");
        }
        if (graphcanvas.graph && graphcanvas.graph != this) {
            graphcanvas.graph.detachCanvas(graphcanvas);
        }

        graphcanvas.graph = this;
        this.list_of_graphcanvas ??= [];
        this.list_of_graphcanvas.push(graphcanvas);
    },

detachCanvas(graphcanvas) {
        if (!this.list_of_graphcanvas) {
            return;
        }

        var pos = this.list_of_graphcanvas.indexOf(graphcanvas);
        if (pos == -1) {
            return;
        }
        graphcanvas.graph = null;
        this.list_of_graphcanvas.splice(pos, 1);
    },

sendActionToCanvas(action, params) {
        if (!this.list_of_graphcanvas) {
            return;
        }

        for (const c of this.list_of_graphcanvas) {
            if (c[action] && params) {
                c[action](...params);
            }
        }
    },

change() {
        LiteGraph.log?.("Graph visually changed");
        this.sendActionToCanvas("setDirty", [true, true]);
        this.on_change?.(this);
    },

setDirtyCanvas(fg, bg) {
        this.sendActionToCanvas("setDirty", [fg, bg]);
    },

isLive() {
        if (!this.list_of_graphcanvas) {
            return false;
        }

        for (var i = 0; i < this.list_of_graphcanvas.length; ++i) {
            var c = this.list_of_graphcanvas[i];
            if (c.live_mode) {
                return true;
            }
        }
        return false;
    },
};
