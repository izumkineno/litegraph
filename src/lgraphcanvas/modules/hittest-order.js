import { LiteGraph } from "../../litegraph.js";
import { temp } from "../shared/scratch.js";
export function isOverNodeBox(node, canvasx, canvasy) {
    var title_height = LiteGraph.NODE_TITLE_HEIGHT;
    if (
        LiteGraph.isInsideRectangle(
            canvasx,
            canvasy,
            node.pos[0] + 2,
            node.pos[1] + 2 - title_height,
            title_height - 4,
            title_height - 4,
        )
    ) {
        return true;
    }
    return false;
}

export function isOverNodeInput(node, canvasx, canvasy, slot_pos) {
    if (node.inputs) {
        for (let i = 0, l = node.inputs.length; i < l; ++i) {
            var link_pos = node.getConnectionPos(true, i);
            var is_inside = false;
            if (node.horizontal) {
                is_inside = LiteGraph.isInsideRectangle(
                    canvasx,
                    canvasy,
                    link_pos[0] - 5,
                    link_pos[1] - 10,
                    10,
                    20,
                );
            } else {
                is_inside = LiteGraph.isInsideRectangle(
                    canvasx,
                    canvasy,
                    link_pos[0] - 10,
                    link_pos[1] - 5,
                    40,
                    10,
                );
            }
            if (is_inside) {
                if (slot_pos) {
                    slot_pos[0] = link_pos[0];
                    slot_pos[1] = link_pos[1];
                }
                return i;
            }
        }
    }
    return -1;
}

export function isOverNodeOutput(node, canvasx, canvasy, slot_pos) {
    if (node.outputs) {
        for (let i = 0, l = node.outputs.length; i < l; ++i) {
            var link_pos = node.getConnectionPos(false, i);
            var is_inside = false;
            if (node.horizontal) {
                is_inside = LiteGraph.isInsideRectangle(
                    canvasx,
                    canvasy,
                    link_pos[0] - 5,
                    link_pos[1] - 10,
                    10,
                    20,
                );
            } else {
                is_inside = LiteGraph.isInsideRectangle(
                    canvasx,
                    canvasy,
                    link_pos[0] - 10,
                    link_pos[1] - 5,
                    40,
                    10,
                );
            }
            if (is_inside) {
                if (slot_pos) {
                    slot_pos[0] = link_pos[0];
                    slot_pos[1] = link_pos[1];
                }
                return i;
            }
        }
    }
    return -1;
}

export function bringToFront(node) {
    var i = this.graph._nodes.indexOf(node);
    if (i == -1) {
        return;
    }

    this.graph._nodes.splice(i, 1);
    this.graph._nodes.push(node);
}

export function sendToBack(node) {
    var i = this.graph._nodes.indexOf(node);
    if (i == -1) {
        return;
    }

    this.graph._nodes.splice(i, 1);
    this.graph._nodes.unshift(node);
}

export function computeVisibleNodes(nodes, out) {
    var visible_nodes = out || [];
    visible_nodes.length = 0;
    nodes = nodes || this.graph._nodes;
    for (var i = 0, l = nodes.length; i < l; ++i) {
        var n = nodes[i];

        // skip rendering nodes in live mode
        if (this.live_mode && !n.onDrawBackground && !n.onDrawForeground) {
            continue;
        }

        if (!LiteGraph.overlapBounding(this.visible_area, n.getBounding(temp, true))) {
            continue;
        } // out of the visible area

        visible_nodes.push(n);
    }
    return visible_nodes;
}
