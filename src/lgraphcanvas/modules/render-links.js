import { LiteGraph } from "../../litegraph.js";
import { LGraphCanvas } from "../../lgraphcanvas.js";
import { margin_area, link_bounding, tempA, tempB } from "../shared/scratch.js";
import {
    drawConnectionsWithLeaferLayer,
    drawLinkTooltipWithLeaferLayer,
    renderLinkWithLeaferLayer,
} from "../renderer/leafer-link-layer.ts";

/** @typedef {import("../renderer/contracts.js").IRenderContext2DCompat} IRenderContext2DCompat */

/**
 * @param {IRenderContext2DCompat} ctx
 * @param {any} link
 */
function drawLinkTooltipLegacy(ctx, link) {
    var pos = link._pos;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc( pos[0], pos[1], 3, 0, Math.PI * 2 );
    ctx.fill();

    if(link.data == null)
        return;

    if(this.onDrawLinkTooltip?.(ctx,link,this))
        return;

    var data = link.data;
    var text = null;

    if( data.constructor === Number )
        text = data.toFixed(2);
    else if( data.constructor === String )
        text = "\"" + data + "\"";
    else if( data.constructor === Boolean )
        text = String(data);
    else if (data.toToolTip)
        text = data.toToolTip();
    else
        text = "[" + data.constructor.name + "]";

    if(text == null)
        return;
    text = text.substr(0,30); // avoid weird

    ctx.font = "14px Courier New";
    var info = ctx.measureText(text);
    var w = info.width + 20;
    var h = 24;
    ctx.shadowColor = "black";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 3;
    ctx.fillStyle = "#454";
    ctx.beginPath();
    ctx.roundRect( pos[0] - w*0.5, pos[1] - 15 - h, w, h, [3]);
    ctx.moveTo( pos[0] - 10, pos[1] - 15 );
    ctx.lineTo( pos[0] + 10, pos[1] - 15 );
    ctx.lineTo( pos[0], pos[1] - 5 );
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.textAlign = "center";
    ctx.fillStyle = "#CEC";
    ctx.fillText(text, pos[0], pos[1] - 15 - h * 0.3);
}

export function drawLinkTooltip(ctx, link) {
    return drawLinkTooltipWithLeaferLayer(this, () => drawLinkTooltipLegacy.call(this, ctx, link));
}

/**
 * @param {IRenderContext2DCompat} ctx
 */
function drawConnectionsLegacy(ctx) {
    var now = LiteGraph.getTime();
    var visible_area = this.visible_area;
    margin_area[0] = visible_area[0] - 20;
    margin_area[1] = visible_area[1] - 20;
    margin_area[2] = visible_area[2] + 40;
    margin_area[3] = visible_area[3] + 40;

    // draw connections
    ctx.lineWidth = this.connections_width;

    ctx.fillStyle = "#AAA";
    ctx.strokeStyle = "#AAA";
    ctx.globalAlpha = this.editor_alpha;
    // for every node
    var nodes = this.graph._nodes;
    for (var n = 0, l = nodes.length; n < l; ++n) {
        var node = nodes[n];
        // for every input (we render just inputs because it is easier as every slot can only have one input)
        if (!node.inputs || !node.inputs.length) {
            continue;
        }

        for (let i = 0; i < node.inputs.length; ++i) {
            var input = node.inputs[i];
            if (!input || input.link == null) {
                continue;
            }
            var link_id = input.link;
            var link = this.graph.links[link_id];
            if (!link) {
                continue;
            }

            // find link info
            var start_node = this.graph.getNodeById(link.origin_id);
            if (start_node == null) {
                continue;
            }
            var start_node_slot = link.origin_slot;
            var start_node_slotpos = null;
            if (start_node_slot == -1) {
                start_node_slotpos = [
                    start_node.pos[0] + 10,
                    start_node.pos[1] + 10,
                ];
            } else {
                start_node_slotpos = start_node.getConnectionPos(
                    false,
                    start_node_slot,
                    tempA,
                );
            }
            var end_node_slotpos = node.getConnectionPos(true, i, tempB);

            // compute link bounding
            link_bounding[0] = start_node_slotpos[0];
            link_bounding[1] = start_node_slotpos[1];
            link_bounding[2] = end_node_slotpos[0] - start_node_slotpos[0];
            link_bounding[3] = end_node_slotpos[1] - start_node_slotpos[1];
            if (link_bounding[2] < 0) {
                link_bounding[0] += link_bounding[2];
                link_bounding[2] = Math.abs(link_bounding[2]);
            }
            if (link_bounding[3] < 0) {
                link_bounding[1] += link_bounding[3];
                link_bounding[3] = Math.abs(link_bounding[3]);
            }

            // skip links outside of the visible area of the canvas
            if (!LiteGraph.overlapBounding(link_bounding, margin_area)) {
                continue;
            }

            var start_slot = start_node.outputs[start_node_slot];
            var end_slot = node.inputs[i];
            if (!start_slot || !end_slot) {
                continue;
            }
            var start_dir =
                start_slot.dir ||
                (start_node.horizontal ? LiteGraph.DOWN : LiteGraph.RIGHT);
            var end_dir =
                end_slot.dir ||
                (node.horizontal ? LiteGraph.UP : LiteGraph.LEFT);

            this.renderLink(
                ctx,
                start_node_slotpos,
                end_node_slotpos,
                link,
                false,
                0,
                null,
                start_dir,
                end_dir,
            );

            // event triggered rendered on top
            if (link && link._last_time && now - link._last_time < 1000) {
                var f = 2.0 - (now - link._last_time) * 0.002;
                var tmp = ctx.globalAlpha;
                ctx.globalAlpha = tmp * f;
                this.renderLink(
                    ctx,
                    start_node_slotpos,
                    end_node_slotpos,
                    link,
                    true,
                    f,
                    "white",
                    start_dir,
                    end_dir,
                );
                ctx.globalAlpha = tmp;
            }
        }
    }
    ctx.globalAlpha = 1;
}

export function drawConnections(ctx) {
    return drawConnectionsWithLeaferLayer(this, () => drawConnectionsLegacy.call(this, ctx));
}

/**
 * @param {IRenderContext2DCompat} ctx
 */
function renderLinkLegacy(
    ctx,
    a,
    b,
    link,
    skip_border,
    flow,
    color,
    start_dir,
    end_dir,
    num_sublines,
) {
    if (link) {
        this.visible_links.push(link);
    }

    // choose color
    if (!color && link) {
        color = link.color || LGraphCanvas.link_type_colors[link.type];
    }
    if (!color) {
        color = this.default_link_color;
    }
    if (link != null && this.highlighted_links[link.id]) {
        color = "#FFF";
    }

    start_dir = start_dir || LiteGraph.RIGHT;
    end_dir = end_dir || LiteGraph.LEFT;

    var dist = LiteGraph.distance(a, b);

    if (this.render_connections_border && this.ds.scale > 0.6) {
        ctx.lineWidth = this.connections_width + 4;
    }
    ctx.lineJoin = "round";
    num_sublines = num_sublines || 1;
    if (num_sublines > 1) {
        ctx.lineWidth = 0.5;
    }

    // begin line shape
    ctx.beginPath();
    for (let i = 0; i < num_sublines; i += 1) {
        var offsety = (i - (num_sublines - 1) * 0.5) * 5;

        if (this.links_render_mode == LiteGraph.SPLINE_LINK) {
            ctx.moveTo(a[0], a[1] + offsety);
            let start_offset_x = 0;
            let start_offset_y = 0;
            let end_offset_x = 0;
            let end_offset_y = 0;
            switch (start_dir) {
                case LiteGraph.LEFT:
                    start_offset_x = dist * -0.25;
                    break;
                case LiteGraph.RIGHT:
                    start_offset_x = dist * 0.25;
                    break;
                case LiteGraph.UP:
                    start_offset_y = dist * -0.25;
                    break;
                case LiteGraph.DOWN:
                    start_offset_y = dist * 0.25;
                    break;
            }
            switch (end_dir) {
                case LiteGraph.LEFT:
                    end_offset_x = dist * -0.25;
                    break;
                case LiteGraph.RIGHT:
                    end_offset_x = dist * 0.25;
                    break;
                case LiteGraph.UP:
                    end_offset_y = dist * -0.25;
                    break;
                case LiteGraph.DOWN:
                    end_offset_y = dist * 0.25;
                    break;
            }
            ctx.bezierCurveTo(
                a[0] + start_offset_x,
                a[1] + start_offset_y + offsety,
                b[0] + end_offset_x,
                b[1] + end_offset_y + offsety,
                b[0],
                b[1] + offsety,
            );
        } else if (this.links_render_mode == LiteGraph.LINEAR_LINK) {
            ctx.moveTo(a[0], a[1] + offsety);
            let start_offset_x = 0;
            let start_offset_y = 0;
            let end_offset_x = 0;
            let end_offset_y = 0;
            switch (start_dir) {
                case LiteGraph.LEFT:
                    start_offset_x = -1;
                    break;
                case LiteGraph.RIGHT:
                    start_offset_x = 1;
                    break;
                case LiteGraph.UP:
                    start_offset_y = -1;
                    break;
                case LiteGraph.DOWN:
                    start_offset_y = 1;
                    break;
            }
            switch (end_dir) {
                case LiteGraph.LEFT:
                    end_offset_x = -1;
                    break;
                case LiteGraph.RIGHT:
                    end_offset_x = 1;
                    break;
                case LiteGraph.UP:
                    end_offset_y = -1;
                    break;
                case LiteGraph.DOWN:
                    end_offset_y = 1;
                    break;
            }
            var l = 15;
            ctx.lineTo(
                a[0] + start_offset_x * l,
                a[1] + start_offset_y * l + offsety,
            );
            ctx.lineTo(
                b[0] + end_offset_x * l,
                b[1] + end_offset_y * l + offsety,
            );
            ctx.lineTo(b[0], b[1] + offsety);
        } else if (this.links_render_mode == LiteGraph.STRAIGHT_LINK) {
            ctx.moveTo(a[0], a[1]);
            var start_x = a[0];
            var start_y = a[1];
            var end_x = b[0];
            var end_y = b[1];
            if (start_dir == LiteGraph.RIGHT) {
                start_x += 10;
            } else {
                start_y += 10;
            }
            if (end_dir == LiteGraph.LEFT) {
                end_x -= 10;
            } else {
                end_y -= 10;
            }
            ctx.lineTo(start_x, start_y);
            ctx.lineTo((start_x + end_x) * 0.5, start_y);
            ctx.lineTo((start_x + end_x) * 0.5, end_y);
            ctx.lineTo(end_x, end_y);
            ctx.lineTo(b[0], b[1]);
        } else {
            return;
        } // unknown
    }

    // rendering the outline of the connection can be a little bit slow
    if (
        this.render_connections_border &&
        this.ds.scale > 0.6 &&
        !skip_border
    ) {
        ctx.strokeStyle = "rgba(0,0,0,0.5)";
        ctx.stroke();
    }

    ctx.lineWidth = this.connections_width;
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.stroke();
    // end line shape

    var pos = this.computeConnectionPoint(a, b, 0.5, start_dir, end_dir);
    if (link && link._pos) {
        link._pos[0] = pos[0];
        link._pos[1] = pos[1];
    }

    // render arrow in the middle
    if (
        this.ds.scale >= 0.6 &&
        this.highquality_render &&
        end_dir != LiteGraph.CENTER
    ) {
        // render arrow
        if (this.render_connection_arrows) {
            // compute two points in the connection
            var posA = this.computeConnectionPoint(
                a,
                b,
                0.25,
                start_dir,
                end_dir,
            );
            var posB = this.computeConnectionPoint(
                a,
                b,
                0.26,
                start_dir,
                end_dir,
            );
            var posC = this.computeConnectionPoint(
                a,
                b,
                0.75,
                start_dir,
                end_dir,
            );
            var posD = this.computeConnectionPoint(
                a,
                b,
                0.76,
                start_dir,
                end_dir,
            );

            // compute the angle between them so the arrow points in the right direction
            var angleA = 0;
            var angleB = 0;
            if (this.render_curved_connections) {
                angleA = -Math.atan2(posB[0] - posA[0], posB[1] - posA[1]);
                angleB = -Math.atan2(posD[0] - posC[0], posD[1] - posC[1]);
            } else {
                angleB = angleA = b[1] > a[1] ? 0 : Math.PI;
            }

            // render arrow
            ctx.save();
            ctx.translate(posA[0], posA[1]);
            ctx.rotate(angleA);
            ctx.beginPath();
            ctx.moveTo(-5, -3);
            ctx.lineTo(0, +7);
            ctx.lineTo(+5, -3);
            ctx.fill();
            ctx.restore();
            ctx.save();
            ctx.translate(posC[0], posC[1]);
            ctx.rotate(angleB);
            ctx.beginPath();
            ctx.moveTo(-5, -3);
            ctx.lineTo(0, +7);
            ctx.lineTo(+5, -3);
            ctx.fill();
            ctx.restore();
        }

        // circle
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 5, 0, Math.PI * 2);
        ctx.fill();
    }

    // render flowing points
    if (flow) {
        ctx.fillStyle = color;
        for (let i = 0; i < 5; ++i) {
            var f = (LiteGraph.getTime() * 0.001 + i * 0.2) % 1;
            pos = this.computeConnectionPoint(
                a,
                b,
                f,
                start_dir,
                end_dir,
            );
            ctx.beginPath();
            ctx.arc(pos[0], pos[1], 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    }
}

export function renderLink(
    ctx,
    a,
    b,
    link,
    skip_border,
    flow,
    color,
    start_dir,
    end_dir,
    num_sublines,
) {
    return renderLinkWithLeaferLayer(this, () => renderLinkLegacy.call(
        this,
        ctx,
        a,
        b,
        link,
        skip_border,
        flow,
        color,
        start_dir,
        end_dir,
        num_sublines,
    ));
}

export function computeConnectionPoint(a, b, t, start_dir, end_dir) {
    start_dir = start_dir || LiteGraph.RIGHT;
    end_dir = end_dir || LiteGraph.LEFT;

    var dist = LiteGraph.distance(a, b);
    var p0 = a;
    var p1 = [a[0], a[1]];
    var p2 = [b[0], b[1]];
    var p3 = b;

    switch (start_dir) {
        case LiteGraph.LEFT:
            p1[0] += dist * -0.25;
            break;
        case LiteGraph.RIGHT:
            p1[0] += dist * 0.25;
            break;
        case LiteGraph.UP:
            p1[1] += dist * -0.25;
            break;
        case LiteGraph.DOWN:
            p1[1] += dist * 0.25;
            break;
    }
    switch (end_dir) {
        case LiteGraph.LEFT:
            p2[0] += dist * -0.25;
            break;
        case LiteGraph.RIGHT:
            p2[0] += dist * 0.25;
            break;
        case LiteGraph.UP:
            p2[1] += dist * -0.25;
            break;
        case LiteGraph.DOWN:
            p2[1] += dist * 0.25;
            break;
    }

    var c1 = (1 - t) * (1 - t) * (1 - t);
    var c2 = 3 * ((1 - t) * (1 - t)) * t;
    var c3 = 3 * (1 - t) * (t * t);
    var c4 = t * t * t;

    var x = c1 * p0[0] + c2 * p1[0] + c3 * p2[0] + c4 * p3[0];
    var y = c1 * p0[1] + c2 * p1[1] + c3 * p2[1] + c4 * p3[1];
    return [x, y];
}
