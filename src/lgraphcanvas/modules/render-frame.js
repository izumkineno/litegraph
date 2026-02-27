import { LiteGraph } from "../../litegraph.js";
export function draw(force_canvas, force_bgcanvas) {
    const canvas = this.frontSurface?.canvas || this.canvas;
    if (!canvas || canvas.width == 0 || canvas.height == 0) {
        return;
    }

    // fps counting
    var now = LiteGraph.getTime();
    this.render_time = (now - this.last_draw_time) * 0.001;
    this.last_draw_time = now;

    if (this.graph) {
        this.ds.computeVisibleArea(this.viewport);
    }

    if (
        this.dirty_bgcanvas ||
        force_bgcanvas ||
        this.always_render_background ||
        (this.graph &&
            this.graph._last_trigger_time &&
            now - this.graph._last_trigger_time < 1000)
    ) {
        this.drawBackCanvas();
    }

    var draw_front_canvas = this.dirty_canvas || force_canvas;
    if (draw_front_canvas) {
        this.drawFrontCanvas();
    }

    this.fps = this.render_time ? 1.0 / this.render_time : 0;
    this.frame += 1;

    // update low qualty counter
    if (this.ds.scale < 0.7) {
        if (draw_front_canvas) {
            // count only slow frames with havy rendering
            var threshold = this.low_quality_rendering_threshold;
            const acceptable_fps = 45;
            if (this.fps < acceptable_fps) {
                this.low_quality_rendering_counter += acceptable_fps / this.fps;
                this.low_quality_rendering_counter = Math.min(this.low_quality_rendering_counter, 2 * threshold); // clamp counter
            } else {
                // make 100 slower the recovery as there are a lot of cahced rendering calls
                this.low_quality_rendering_counter -= this.fps / acceptable_fps * 0.01;
                this.low_quality_rendering_counter = Math.max(this.low_quality_rendering_counter, 0); // clamp counter
            }
        }
    } else {
        // force reset to high quality when zoomed in
        this.low_quality_rendering_counter = 0;
    }
}

export function drawFrontCanvas() {
    this.dirty_canvas = false;
    const rendererAdapter = this.rendererAdapter ?? null;
    const frontLayerNative = rendererAdapter?.isLayerNative?.("front") === true;
    const backLayerNative = rendererAdapter?.isLayerNative?.("back") === true;

    if (!this.ctx) {
        this.ctx = rendererAdapter?.getFrontCtx?.() ?? this.frontSurface?.getContextCompat?.() ?? null;
    }
    var ctx = this.ctx;
    if (!ctx) {
        // maybe is using webgl...
        return;
    }

    rendererAdapter?.beginFrame?.("front");
    var canvas = this.frontSurface?.canvas || this.canvas;
    if ( ctx.start2D && !this.viewport ) {
        ctx.start2D();
        ctx.restore();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    // clip dirty area if there is one, otherwise work in full canvas
    var area = this.viewport || this.dirty_area;
    if (area) {
        ctx.save();
        ctx.beginPath();
        ctx.rect( area[0],area[1],area[2],area[3] );
        ctx.clip();
    }

    // clear
    // canvas.width = canvas.width;
    if (this.clear_background) {
        if(area)
            ctx.clearRect( area[0],area[1],area[2],area[3] );
        else
            ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // draw bg canvas
    const backCanvas = this.backSurface?.canvas || this.bgcanvas;
    if (backCanvas == canvas) {
        this.drawBackCanvas();
    } else if (backCanvas) {
        if ((frontLayerNative || backLayerNative) && rendererAdapter?.blitBackToFront) {
            rendererAdapter.blitBackToFront(ctx);
        } else {
            ctx.drawImage(backCanvas, 0, 0);
        }
    }

    // rendering
    this.onRender?.(canvas, ctx);

    // info widget
    if (this.show_info) {
        this.renderInfo(ctx, area ? area[0] : 0, area ? area[1] : 0 );
    }

    if (this.graph) {
        // apply transformations
        ctx.save();
        this.ds.toCanvasContext(ctx);

        var visible_nodes = this.computeVisibleNodes(
            null,
            this.visible_nodes,
        );

        for (let i = 0; i < visible_nodes.length; ++i) {
            let node = visible_nodes[i];

            // transform coords system
            ctx.save();
            ctx.translate(node.pos[0], node.pos[1]);

            // Draw
            this.drawNode(node, ctx);

            // Restore
            ctx.restore();
        }

        // on top (debug)
        if (this.render_execution_order) {
            this.drawExecutionOrder(ctx);
        }

        // connections ontop?
        if (this.graph.config.links_ontop) {
            if (!this.live_mode) {
                this.drawConnections(ctx);
            }
        }

        // current connection (the one being dragged by the mouse)
        if (this.connecting_pos != null) {
            ctx.lineWidth = this.connections_width;
            var link_color = null;

            var connInOrOut = this.connecting_output || this.connecting_input;

            var connType = connInOrOut.type;
            var connDir = connInOrOut.dir;
            if(connDir == null) {
                if (this.connecting_output)
                    connDir = this.connecting_node.horizontal ? LiteGraph.DOWN : LiteGraph.RIGHT;
                else
                    connDir = this.connecting_node.horizontal ? LiteGraph.UP : LiteGraph.LEFT;
            }
            var connShape = connInOrOut.shape;

            switch (connType) {
                case LiteGraph.EVENT:
                case LiteGraph.ACTION:
                    link_color = LiteGraph.EVENT_LINK_COLOR;
                    break;
                default:
                    link_color = LiteGraph.CONNECTING_LINK_COLOR;
            }

            // the connection being dragged by the mouse
            this.renderLink(
                ctx,
                this.connecting_pos,
                [this.graph_mouse[0], this.graph_mouse[1]],
                null,
                false,
                null,
                link_color,
                connDir,
                LiteGraph.CENTER,
            );

            ctx.beginPath();
            if (
                connType === LiteGraph.EVENT ||
                connType === LiteGraph.ACTION ||
                connShape === LiteGraph.BOX_SHAPE
            ) {
                ctx.rect(
                    this.connecting_pos[0] - 6 + 0.5,
                    this.connecting_pos[1] - 5 + 0.5,
                    14,
                    10,
                );
                ctx.fill();
                ctx.beginPath();
                ctx.rect(
                    this.graph_mouse[0] - 6 + 0.5,
                    this.graph_mouse[1] - 5 + 0.5,
                    14,
                    10,
                );
            } else if (connShape === LiteGraph.ARROW_SHAPE) {
                ctx.moveTo(this.connecting_pos[0] + 8, this.connecting_pos[1] + 0.5);
                ctx.lineTo(this.connecting_pos[0] - 4, this.connecting_pos[1] + 6 + 0.5);
                ctx.lineTo(this.connecting_pos[0] - 4, this.connecting_pos[1] - 6 + 0.5);
                ctx.closePath();
            } else {
                ctx.arc(
                    this.connecting_pos[0],
                    this.connecting_pos[1],
                    4,
                    0,
                    Math.PI * 2,
                );
                ctx.fill();
                ctx.beginPath();
                ctx.arc(
                    this.graph_mouse[0],
                    this.graph_mouse[1],
                    4,
                    0,
                    Math.PI * 2,
                );
            }
            ctx.fill();

            ctx.fillStyle = "#ffcc00";
            if (this._highlight_input) {
                ctx.beginPath();
                var shape = this._highlight_input_slot.shape;
                if (shape === LiteGraph.ARROW_SHAPE) {
                    ctx.moveTo(this._highlight_input[0] + 8, this._highlight_input[1] + 0.5);
                    ctx.lineTo(this._highlight_input[0] - 4, this._highlight_input[1] + 6 + 0.5);
                    ctx.lineTo(this._highlight_input[0] - 4, this._highlight_input[1] - 6 + 0.5);
                    ctx.closePath();
                } else {
                    ctx.arc(
                        this._highlight_input[0],
                        this._highlight_input[1],
                        6,
                        0,
                        Math.PI * 2,
                    );
                }
                ctx.fill();
            }
            if (this._highlight_output) {
                ctx.beginPath();
                if (shape === LiteGraph.ARROW_SHAPE) {
                    ctx.moveTo(this._highlight_output[0] + 8, this._highlight_output[1] + 0.5);
                    ctx.lineTo(this._highlight_output[0] - 4, this._highlight_output[1] + 6 + 0.5);
                    ctx.lineTo(this._highlight_output[0] - 4, this._highlight_output[1] - 6 + 0.5);
                    ctx.closePath();
                } else {
                    ctx.arc(
                        this._highlight_output[0],
                        this._highlight_output[1],
                        6,
                        0,
                        Math.PI * 2,
                    );
                }
                ctx.fill();
            }
        }

        // the selection rectangle
        if (this.dragging_rectangle) {
            ctx.strokeStyle = "#FFF";
            ctx.strokeRect(
                this.dragging_rectangle[0],
                this.dragging_rectangle[1],
                this.dragging_rectangle[2],
                this.dragging_rectangle[3],
            );
        }

        // on top of link center
        if(this.over_link_center && this.render_link_tooltip)
            this.drawLinkTooltip( ctx, this.over_link_center );
        else
            this.onDrawLinkTooltip?.(ctx,null);

        // custom info
        this.onDrawForeground?.(ctx, this.visible_rect);
        ctx.restore();
    }

    // draws panel in the corner
    if (this._graph_stack && this._graph_stack.length) {
        this.drawSubgraphPanel( ctx );
    }
    this.onDrawOverlay?.(ctx);
    if (area) {
        ctx.restore();
    }
    ctx.finish2D?.();
    rendererAdapter?.syncLayer?.("front");
    rendererAdapter?.endFrame?.("front");
}

export function lowQualityRenderingRequired(activation_scale) {
    if ( this.ds.scale < activation_scale) {
        return this.low_quality_rendering_counter > this.low_quality_rendering_threshold;
    }
    return false;
}
