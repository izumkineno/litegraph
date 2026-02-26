import { LiteGraph } from "../../litegraph.js";
export function centerOnNode(node) {
    this.ds.offset[0] =
        -node.pos[0] -
        node.size[0] * 0.5 +
        (this.canvas.width * 0.5) / this.ds.scale;
    this.ds.offset[1] =
        -node.pos[1] -
        node.size[1] * 0.5 +
        (this.canvas.height * 0.5) / this.ds.scale;
    this.setDirty(true, true);
}

export function adjustMouseEvent(e) {
    var clientX_rel = 0;
    var clientY_rel = 0;

    if (this.canvas) {
        var b = this.canvas.getBoundingClientRect();
        clientX_rel = e.clientX - b.left;
        clientY_rel = e.clientY - b.top;
    } else {
        clientX_rel = e.clientX;
        clientY_rel = e.clientY;
    }

    // e.deltaX = clientX_rel - this.last_mouse_position[0];
    // e.deltaY = clientY_rel- this.last_mouse_position[1];

    this.last_mouse_position[0] = clientX_rel;
    this.last_mouse_position[1] = clientY_rel;

    e.canvasX = clientX_rel / this.ds.scale - this.ds.offset[0];
    e.canvasY = clientY_rel / this.ds.scale - this.ds.offset[1];

    // LiteGraph.log?.("pointerevents: adjustMouseEvent "+e.clientX+":"+e.clientY+" "+clientX_rel+":"+clientY_rel+" "+e.canvasX+":"+e.canvasY);
}

export function setZoom(value, zooming_center) {
    this.ds.changeScale(value, zooming_center);
    /*
if(!zooming_center && this.canvas)
    zooming_center = [this.canvas.width * 0.5,this.canvas.height * 0.5];

var center = this.convertOffsetToCanvas( zooming_center );

this.ds.scale = value;

if(this.scale > this.max_zoom)
    this.scale = this.max_zoom;
else if(this.scale < this.min_zoom)
    this.scale = this.min_zoom;

var new_center = this.convertOffsetToCanvas( zooming_center );
var delta_offset = [new_center[0] - center[0], new_center[1] - center[1]];

this.offset[0] += delta_offset[0];
this.offset[1] += delta_offset[1];
*/

    this.dirty_canvas = true;
    this.dirty_bgcanvas = true;
}

export function convertOffsetToCanvas(pos, out) {
    return this.ds.convertOffsetToCanvas(pos, out);
}

export function convertCanvasToOffset(pos, out) {
    return this.ds.convertCanvasToOffset(pos, out);
}

export function convertEventToCanvasOffset(e) {
    var rect = this.canvas.getBoundingClientRect();
    return this.convertCanvasToOffset([
        e.clientX - rect.left,
        e.clientY - rect.top,
    ]);
}
