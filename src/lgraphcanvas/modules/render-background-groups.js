import { LiteGraph } from "../../litegraph.js";
export function drawSubgraphPanel(ctx) {
    var subgraph = this.graph;
    if( !subgraph)
        return;
    var subnode = subgraph._subgraph_node;
    if (!subnode) {
        LiteGraph.warn?.("subgraph without subnode");
        return;
    }
    this.drawSubgraphPanelLeft(subgraph, subnode, ctx)
    this.drawSubgraphPanelRight(subgraph, subnode, ctx)
}

export function drawSubgraphPanelLeft(subgraph, subnode, ctx) {
    var num = subnode.inputs ? subnode.inputs.length : 0;
    var w = 200;
    var h = Math.floor(LiteGraph.NODE_SLOT_HEIGHT * 1.6);

    ctx.fillStyle = "#111";
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.roundRect(10, 10, w, (num + 1) * h + 50, [8]);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#888";
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Graph Inputs", 20, 34);
    // var pos = this.mouse;

    if (this.drawButton(w - 20, 20, 20, 20, "X", "#151515")) {
        this.closeSubgraph();
        return;
    }

    var y = 50;
    ctx.font = "14px Arial";
    if (subnode.inputs)
        for (var i = 0; i < subnode.inputs.length; ++i) {
            var input = subnode.inputs[i];
            if (input.not_subgraph_input)
                continue;

            // input button clicked
            if (this.drawButton(20, y + 2, w - 20, h - 2)) {
                var type = subnode.constructor.input_node_type || "graph/input";
                this.graph.beforeChange();
                var newnode = LiteGraph.createNode(type);
                if (newnode) {
                    subgraph.add(newnode, false, {doProcessChange: false} );
                    this.block_click = false;
                    this.last_click_position = null;
                    this.selectNodes([newnode]);
                    this.node_dragged = newnode;
                    this.dragging_canvas = false;
                    newnode.setProperty("name", input.name);
                    newnode.setProperty("type", input.type);
                    this.node_dragged.pos[0] = this.graph_mouse[0] - 5;
                    this.node_dragged.pos[1] = this.graph_mouse[1] - 5;
                    this.graph.afterChange();
                } else
                    LiteGraph.error?.("graph input node not found:", type);
            }
            ctx.fillStyle = "#9C9";
            ctx.beginPath();
            ctx.arc(w - 16, y + h * 0.5, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "#AAA";
            ctx.fillText(input.name, 30, y + h * 0.75);
            // var tw = ctx.measureText(input.name);
            ctx.fillStyle = "#777";
            ctx.fillText(input.type, 130, y + h * 0.75);
            y += h;
        }
    // add + button
    if (this.drawButton(20, y + 2, w - 20, h - 2, "+", "#151515", "#222")) {
        this.showSubgraphPropertiesDialog(subnode);
    }
}

export function drawSubgraphPanelRight(subgraph, subnode, ctx) {
    var num = subnode.outputs ? subnode.outputs.length : 0;
    var canvas_w = (this.backSurface?.canvas || this.bgcanvas).width;
    var w = 200;
    var h = Math.floor(LiteGraph.NODE_SLOT_HEIGHT * 1.6);

    ctx.fillStyle = "#111";
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.roundRect(canvas_w - w - 10, 10, w, (num + 1) * h + 50, [8]);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.fillStyle = "#888";
    ctx.font = "14px Arial";
    ctx.textAlign = "left";
    const title_text = "Graph Outputs";
    var tw = ctx.measureText(title_text).width
    ctx.fillText(title_text, (canvas_w - tw) - 20, 34);
    // var pos = this.mouse;
    if (this.drawButton(canvas_w - w, 20, 20, 20, "X", "#151515")) {
        this.closeSubgraph();
        return;
    }

    var y = 50;
    ctx.font = "14px Arial";
    if (subnode.outputs)
        for (var i = 0; i < subnode.outputs.length; ++i) {
            var output = subnode.outputs[i];
            if (output.not_subgraph_input)
                continue;

            // output button clicked
            if (this.drawButton(canvas_w - w, y + 2, w - 20, h - 2)) {
                var type = subnode.constructor.output_node_type || "graph/output";
                this.graph.beforeChange();
                var newnode = LiteGraph.createNode(type);
                if (newnode) {
                    subgraph.add(newnode, false, {doProcessChange: false} );
                    this.block_click = false;
                    this.last_click_position = null;
                    this.selectNodes([newnode]);
                    this.node_dragged = newnode;
                    this.dragging_canvas = false;
                    newnode.setProperty("name", output.name);
                    newnode.setProperty("type", output.type);
                    this.node_dragged.pos[0] = this.graph_mouse[0] - 5;
                    this.node_dragged.pos[1] = this.graph_mouse[1] - 5;
                    this.graph.afterChange();
                } else
                    LiteGraph.error?.("graph input node not found:", type);
            }
            ctx.fillStyle = "#9C9";
            ctx.beginPath();
            ctx.arc(canvas_w - w + 16, y + h * 0.5, 5, 0, 2 * Math.PI);
            ctx.fill();
            ctx.fillStyle = "#AAA";
            ctx.fillText(output.name, canvas_w - w + 30, y + h * 0.75);
            // var tw = ctx.measureText(input.name);
            ctx.fillStyle = "#777";
            ctx.fillText(output.type, canvas_w - w + 130, y + h * 0.75);
            y += h;
        }
    // add + button
    if (this.drawButton(canvas_w - w, y + 2, w - 20, h - 2, "+", "#151515", "#222")) {
        this.showSubgraphPropertiesDialogRight(subnode);
    }
}

export function drawButton(x, y, w, h, text, bgcolor, hovercolor, textcolor) {
    var ctx = this.ctx;
    bgcolor = bgcolor || LiteGraph.NODE_DEFAULT_COLOR;
    hovercolor = hovercolor || "#555";
    textcolor = textcolor || LiteGraph.NODE_TEXT_COLOR;
    var pos = this.ds.convertOffsetToCanvas(this.graph_mouse);
    var hover = LiteGraph.isInsideRectangle( pos[0], pos[1], x,y,w,h );
    pos = this.last_click_position ? [this.last_click_position[0], this.last_click_position[1]] : null;
    if(pos) {
        var rect = this.canvas.getBoundingClientRect();
        pos[0] -= rect.left;
        pos[1] -= rect.top;
    }
    var clicked = pos && LiteGraph.isInsideRectangle( pos[0], pos[1], x,y,w,h );

    ctx.fillStyle = hover ? hovercolor : bgcolor;
    if(clicked)
        ctx.fillStyle = "#AAA";
    ctx.beginPath();
    ctx.roundRect(x,y,w,h,[4] );
    ctx.fill();

    if(text != null) {
        if(text.constructor == String) {
            ctx.fillStyle = textcolor;
            ctx.textAlign = "center";
            ctx.font = ((h * 0.65)|0) + "px Arial";
            ctx.fillText( text, x + w * 0.5,y + h * 0.75 );
            ctx.textAlign = "left";
        }
    }

    var was_clicked = clicked && !this.block_click;
    if(clicked)
        this.blockClick();
    return was_clicked;
}

export function isAreaClicked(x, y, w, h, hold_click) {
    var pos = this.last_click_position;
    var clicked = pos && LiteGraph.isInsideRectangle( pos[0], pos[1], x,y,w,h );
    var was_clicked = clicked && !this.block_click;
    if(clicked && hold_click)
        this.blockClick();
    return was_clicked;
}

export function renderInfo(ctx, x, y) {
    x = x || 10;
    y = y || this.canvas.height - 80;

    ctx.save();
    ctx.translate(x, y);

    ctx.font = "10px Arial";
    ctx.fillStyle = "#888";
    ctx.textAlign = "left";
    if (this.graph) {
        ctx.fillText( "T: " + this.graph.globaltime.toFixed(2) + "s", 5, 13 * 1 );
        ctx.fillText("I: " + this.graph.iteration, 5, 13 * 2 );
        ctx.fillText("N: " + this.graph._nodes.length + " [" + this.visible_nodes.length + "]", 5, 13 * 3 );
        ctx.fillText("V: " + this.graph._version, 5, 13 * 4);
        ctx.fillText("FPS:" + this.fps.toFixed(2), 5, 13 * 5);
    } else {
        ctx.fillText("No graph selected", 5, 13 * 1);
    }
    ctx.restore();
}

export function drawBackCanvas() {
    var canvas = this.backSurface?.canvas || this.bgcanvas;

    if (!this.bgctx) {
        this.bgctx = this.rendererAdapter?.getBackCtx?.() ?? this.backSurface?.getContextCompat?.() ?? this.bgcanvas.getContext("2d");
    }
    var ctx = this.bgctx;
    this.rendererAdapter?.beginFrame?.("back");
    ctx.start?.();

    var viewport = this.viewport || [0,0,ctx.canvas.width,ctx.canvas.height];

    // clear
    if (this.clear_background) {
        ctx.clearRect( viewport[0], viewport[1], viewport[2], viewport[3] );
    }

    // show subgraph stack header
    if (this._graph_stack && this._graph_stack.length) {
        ctx.save();
        var subgraph_node = this.graph._subgraph_node;
        ctx.strokeStyle = subgraph_node.bgcolor;
        ctx.lineWidth = 10;
        ctx.strokeRect(1, 1, canvas.width - 2, canvas.height - 2);
        ctx.lineWidth = 1;
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = subgraph_node.bgcolor || "#AAA";
        let title = "";
        this._graph_stack.slice(1).forEach((item, index) => {
            title += `${item._subgraph_node.getTitle()} ${index < this._graph_stack.length - 2 ? ">> " : ""}`;
        });
        ctx.fillText(
            title + subgraph_node.getTitle(),
            canvas.width * 0.5,
            40,
        );
        ctx.restore();
    }

    var bg_already_painted = false;
    if (this.onRenderBackground) {
        bg_already_painted = this.onRenderBackground(canvas, ctx);
    }

    // reset in case of error
    if ( !this.viewport ) {
        ctx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    this.visible_links.length = 0;

    if (this.graph) {
        // apply transformations
        ctx.save();
        this.ds.toCanvasContext(ctx);

        // render BG
        if ( this.ds.scale < 1.5 && !bg_already_painted && this.clear_background_color ) {
            ctx.fillStyle = this.clear_background_color;
            ctx.fillRect(
                this.visible_area[0],
                this.visible_area[1],
                this.visible_area[2],
                this.visible_area[3],
            );
        }

        if (
            this.background_image &&
            this.ds.scale > 0.5 &&
            !bg_already_painted
        ) {
            if (this.zoom_modify_alpha) {
                ctx.globalAlpha =
                    (1.0 - 0.5 / this.ds.scale) * this.editor_alpha;
            } else {
                ctx.globalAlpha = this.editor_alpha;
            }
            ctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled = false; // ctx.mozImageSmoothingEnabled =
            if (
                !this._bg_img ||
                this._bg_img.name != this.background_image
            ) {
                this._bg_img = new Image();
                this._bg_img.name = this.background_image;
                this._bg_img.src = this.background_image;
                var that = this;
                this._bg_img.onload = function() {
                    that.draw(true, true);
                };
            }

            var pattern = null;
            if (this._pattern == null && this._bg_img.width > 0) {
                pattern = ctx.createPattern(this._bg_img, "repeat");
                this._pattern_img = this._bg_img;
                this._pattern = pattern;
            } else {
                pattern = this._pattern;
            }
            if (pattern) {
                ctx.fillStyle = pattern;
                ctx.fillRect(
                    this.visible_area[0],
                    this.visible_area[1],
                    this.visible_area[2],
                    this.visible_area[3],
                );
                ctx.fillStyle = "transparent";
            }

            ctx.globalAlpha = 1.0;
            ctx.imageSmoothingEnabled = ctx.imageSmoothingEnabled = true; // = ctx.mozImageSmoothingEnabled
        }

        // groups
        if (this.graph._groups.length && !this.live_mode) {
            this.drawGroups(canvas, ctx);
        }

        this.onDrawBackground?.(ctx, this.visible_area);
        if (this.onBackgroundRender) {
            // LEGACY
            LiteGraph.error?.("WARNING! onBackgroundRender deprecated, now is named onDrawBackground ");
            this.onBackgroundRender = null;
        }

        // DEBUG: show clipping area
        // ctx.fillStyle = "red";
        // ctx.fillRect( this.visible_area[0] + 10, this.visible_area[1] + 10, this.visible_area[2] - 20, this.visible_area[3] - 20);

        // bg
        if (this.render_canvas_border) {
            ctx.strokeStyle = "#235";
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
        }

        if (this.render_connections_shadows) {
            ctx.shadowColor = "#000";
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;
            ctx.shadowBlur = 6;
        } else {
            ctx.shadowColor = "rgba(0,0,0,0)";
        }

        // draw connections
        if (!this.live_mode) {
            this.drawConnections(ctx);
        }

        ctx.shadowColor = "rgba(0,0,0,0)";

        // restore state
        ctx.restore();
    }

    ctx.finish?.();
    this.rendererAdapter?.endFrame?.("back");
    this.dirty_bgcanvas = false;
    this.dirty_canvas = true; // to force to repaint the front canvas with the bgcanvas
}

export function drawGroups(canvas, ctx) {
    if (!this.graph) {
        return;
    }

    var groups = this.graph._groups;

    ctx.save();
    ctx.globalAlpha = 0.5 * this.editor_alpha;

    for (let i = 0; i < groups.length; ++i) {
        var group = groups[i];

        if (!LiteGraph.overlapBounding(this.visible_area, group._bounding)) {
            continue;
        } // out of the visible area

        ctx.fillStyle = group.color || "#335";
        ctx.strokeStyle = group.color || "#335";
        var pos = group._pos;
        var size = group._size;
        ctx.globalAlpha = 0.25 * this.editor_alpha;
        ctx.beginPath();
        ctx.rect(pos[0] + 0.5, pos[1] + 0.5, size[0], size[1]);
        ctx.fill();
        ctx.globalAlpha = this.editor_alpha;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(pos[0] + size[0], pos[1] + size[1]);
        ctx.lineTo(pos[0] + size[0] - 10, pos[1] + size[1]);
        ctx.lineTo(pos[0] + size[0], pos[1] + size[1] - 10);
        ctx.fill();

        var font_size =
            group.font_size || LiteGraph.DEFAULT_GROUP_FONT_SIZE;
        ctx.font = font_size + "px Arial";
        ctx.textAlign = "left";
        ctx.fillText(group.title, pos[0] + 4, pos[1] + font_size);
    }

    ctx.restore();
}
