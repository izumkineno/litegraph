let LiteGraph = null;

export function setGeometryHitMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const geometryHitMethods = {
computeSize(out) {
        if (this.constructor.size) {
            return this.constructor.size.concat();
        }

        var size = out || new Float32Array([0, 0]);

        var font_size = LiteGraph.NODE_TEXT_SIZE; // although it should be graphcanvas.inner_text_font size

        // computeWidth
        const get_text_width = (text) => {
            if (!text) {
                return 0;
            }
            return font_size * text.length * 0.6;
        };
        var title_width = get_text_width(this.title);
        var input_width = 0;
        var output_width = 0;

        if (this.inputs) {
            input_width = this.inputs.reduce((maxWidth, input) => {
                const text = input.label || input.name || "";
                const text_width = get_text_width(text);
                return Math.max(maxWidth, text_width);
            }, 0);
        }
        if (this.outputs) {
            output_width = this.outputs.reduce((maxWidth, output) => {
                const text = output.label || output.name || "";
                const text_width = get_text_width(text);

                return Math.max(maxWidth, text_width);
            }, 0);
        }

        size[0] = Math.max(input_width + output_width + 10, title_width);
        size[0] = Math.max(size[0], LiteGraph.NODE_WIDTH);
        if (this.widgets && this.widgets.length) {
            size[0] = Math.max(size[0], LiteGraph.NODE_WIDTH * 1.5);
        }

        // computeHeight

        // minimum height calculated by slots or 1
        const rowHeight = Math.max(
            this.inputs ? this.inputs.length : 1,
            this.outputs ? this.outputs.length : 1,
            1,
        ) * LiteGraph.NODE_SLOT_HEIGHT;

        // add margin (should this be always?)
        size[1] = rowHeight + (this.constructor.slot_start_y || 0);

        // minimum height calculated by widgets
        let widgetsHeight = 0;
        if (this.widgets && this.widgets.length) {
            for (var i = 0, l = this.widgets.length; i < l; ++i) {
                if (this.widgets[i].computeSize)
                    widgetsHeight += this.widgets[i].computeSize(size[0])[1] + 4;
                else
                    widgetsHeight += LiteGraph.NODE_WIDGET_HEIGHT + 4;
            }
            widgetsHeight += 8;
        }

        // compute height using widgets height
        if( this.widgets_up )
            size[1] = Math.max( size[1], widgetsHeight );
        else if( this.widgets_start_y != null )
            size[1] = Math.max( size[1], widgetsHeight + this.widgets_start_y );
        else
            size[1] += widgetsHeight;
        if (
            this.constructor.min_height &&
            size[1] < this.constructor.min_height
        ) {
            size[1] = this.constructor.min_height;
        }

        size[1] += 6; // margin
        return size;
    },

getBounding(out = new Float32Array(4), compute_outer) {
        const nodePos = this.pos;
        const isCollapsed = this.flags.collapsed;
        const nodeSize = this.size;

        let left_offset = 0;
        // 1 offset due to how nodes are rendered
        let right_offset = 1 ;
        let top_offset = 0;
        let bottom_offset = 0;

        if (compute_outer) {
            // 4 offset for collapsed node connection points
            left_offset = 4;
            // 6 offset for right shadow and collapsed node connection points
            right_offset = 6 + left_offset;
            // 4 offset for collapsed nodes top connection points
            top_offset = 4;
            // 5 offset for bottom shadow and collapsed node connection points
            bottom_offset = 5 + top_offset;
        }

        out[0] = nodePos[0] - left_offset;
        out[1] = nodePos[1] - LiteGraph.NODE_TITLE_HEIGHT - top_offset;
        out[2] = isCollapsed ?
            (this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH) + right_offset :
            nodeSize[0] + right_offset;
        out[3] = isCollapsed ?
            LiteGraph.NODE_TITLE_HEIGHT + bottom_offset :
            nodeSize[1] + LiteGraph.NODE_TITLE_HEIGHT + bottom_offset;

        if (this.onBounding) {
            this.onBounding(out);
        }
        return out;
    },

isPointInside(x, y, margin = 0, skip_title) {
        var margin_top = this.graph && this.graph.isLive() ? 0 : LiteGraph.NODE_TITLE_HEIGHT;
        if (skip_title) {
            margin_top = 0;
        }
        if (this.flags && this.flags.collapsed) {
            // if ( distance([x,y], [this.pos[0] + this.size[0]*0.5, this.pos[1] + this.size[1]*0.5]) < LiteGraph.NODE_COLLAPSED_RADIUS)
            if (
                LiteGraph.isInsideRectangle(
                    x,
                    y,
                    this.pos[0] - margin,
                    this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT - margin,
                    (this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH) +
                        2 * margin,
                    LiteGraph.NODE_TITLE_HEIGHT + 2 * margin,
                )
            ) {
                return true;
            }
        } else if (
            this.pos[0] - 4 - margin < x &&
            this.pos[0] + this.size[0] + 4 + margin > x &&
            this.pos[1] - margin_top - margin < y &&
            this.pos[1] + this.size[1] + margin > y
        ) {
            return true;
        }
        return false;
    },

getConnectionPos(is_input, slot_number, out = new Float32Array(2)) {
        var num_slots = 0;
        if (is_input && this.inputs) {
            num_slots = this.inputs.length;
        }
        if (!is_input && this.outputs) {
            num_slots = this.outputs.length;
        }

        var offset = LiteGraph.NODE_SLOT_HEIGHT * 0.5;

        if (this.flags.collapsed) {
            var w = this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH;
            if (this.horizontal) {
                out[0] = this.pos[0] + w * 0.5;
                if (is_input) {
                    out[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT;
                } else {
                    out[1] = this.pos[1];
                }
            } else {
                if (is_input) {
                    out[0] = this.pos[0];
                } else {
                    out[0] = this.pos[0] + w;
                }
                out[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT * 0.5;
            }
            return out;
        }

        // weird feature that never got finished
        if (is_input && slot_number == -1) {
            out[0] = this.pos[0] + LiteGraph.NODE_TITLE_HEIGHT * 0.5;
            out[1] = this.pos[1] + LiteGraph.NODE_TITLE_HEIGHT * 0.5;
            return out;
        }

        // hard-coded pos
        if (
            is_input &&
            num_slots > slot_number &&
            this.inputs[slot_number].pos
        ) {
            out[0] = this.pos[0] + this.inputs[slot_number].pos[0];
            out[1] = this.pos[1] + this.inputs[slot_number].pos[1];
            return out;
        } else if (
            !is_input &&
            num_slots > slot_number &&
            this.outputs[slot_number].pos
        ) {
            out[0] = this.pos[0] + this.outputs[slot_number].pos[0];
            out[1] = this.pos[1] + this.outputs[slot_number].pos[1];
            return out;
        }

        // horizontal distributed slots
        if (this.horizontal) {
            out[0] =
                this.pos[0] + (slot_number + 0.5) * (this.size[0] / num_slots);
            if (is_input) {
                out[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT;
            } else {
                out[1] = this.pos[1] + this.size[1];
            }
            return out;
        }

        // default vertical slots
        if (is_input) {
            out[0] = this.pos[0] + offset;
        } else {
            out[0] = this.pos[0] + this.size[0] + 1 - offset;
        }
        out[1] =
            this.pos[1] +
            (slot_number + 0.7) * LiteGraph.NODE_SLOT_HEIGHT +
            (this.constructor.slot_start_y || 0);
        return out;
    },

localToScreen(x, y, graphcanvas) {
        return [
            (x + this.pos[0]) * graphcanvas.scale + graphcanvas.offset[0],
            (y + this.pos[1]) * graphcanvas.scale + graphcanvas.offset[1],
        ];
    },
};
