let LiteGraph = null;

export function setCanvasIntegrationMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const canvasIntegrationMethods = {
trace(msg) {
        if (!this.console) {
            this.console = [];
        }

        this.console.push?.(msg);
        if (this.console.length > this.constructor.MAX_CONSOLE) {
            this.console.shift?.();
        }

        if(this.graph.onNodeTrace)
            this.graph.onNodeTrace(this, msg);
    },

setDirtyCanvas(dirty_foreground, dirty_background) {
        if (!this.graph) {
            return;
        }
        this.graph.sendActionToCanvas("setDirty", [
            dirty_foreground,
            dirty_background,
        ]);
    },

loadImage(url) {
        var img = new Image();
        img.src = LiteGraph.node_images_path + url;
        img.ready = false;

        var that = this;
        img.onload = function() {
            this.ready = true;
            that.setDirtyCanvas(true);
        };
        return img;
    },

captureInput(v) {
        if (!this.graph || !this.graph.list_of_graphcanvas) {
            return;
        }

        var list = this.graph.list_of_graphcanvas;

        for (var i = 0; i < list.length; ++i) {
            var c = list[i];
            // releasing somebody elses capture?!
            if (!v && c.node_capturing_input != this) {
                continue;
            }

            // change
            c.node_capturing_input = v ? this : null;
        }
    },

collapse(force) {
        this.graph.onGraphChanged({action: "collapse"});
        if (this.constructor.collapsable === false && !force) {
            return;
        }
        if (!this.flags.collapsed) {
            this.flags.collapsed = true;
        } else {
            this.flags.collapsed = false;
        }
        this.setDirtyCanvas(true, true);
    },

pin(v) {
        this.graph.onGraphChanged({action: "pin"});
        if (v === undefined) {
            this.flags.pinned = !this.flags.pinned;
        } else {
            this.flags.pinned = v;
        }
    },
};
