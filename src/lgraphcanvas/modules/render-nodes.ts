// @ts-nocheck
import { LiteGraph } from "../../litegraph.ts";
import { temp_vec2, tmp_area } from "../shared/scratch.js";
import { LeaferNodeUiLayer } from "../renderer/leafer-node-ui-layer.ts";

/** @typedef {import("../renderer/contracts.js").IRenderContext2DCompat} IRenderContext2DCompat */

const titleGradientCacheByContext = new WeakMap();

/**
 * Leafer and other compat contexts may not expose roundRect.
 * Fallback to rect so draw pipelines remain functional.
 * @param {IRenderContext2DCompat | any} ctx
 */
function ensureRoundRectCompat(ctx) {
    if (!ctx || typeof ctx.roundRect === "function") {
        return;
    }

    const fallback = typeof ctx.rect === "function"
        ? function roundRectFallback(x, y, width, height) {
            this.rect(x, y, width, height);
        }
        : function roundRectNoop() {
        };

    try {
        ctx.roundRect = fallback;
    } catch (_error) {
        // Some context wrappers may lock properties; in that case keep going.
    }
}

/**
 * @param {IRenderContext2DCompat} ctx
 * @returns {Map<string, CanvasGradient | string>}
 */
function getTitleGradientCache(ctx) {
    let cache = titleGradientCacheByContext.get(ctx);
    if (!cache) {
        cache = new Map();
        titleGradientCacheByContext.set(ctx, cache);
    }
    return cache;
}

/**
 * @param {IRenderContext2DCompat} ctx
 * @param {string} titleColor
 * @returns {CanvasGradient | string}
 */
function getTitleGradientForContext(ctx, titleColor) {
    const color = titleColor || LiteGraph.NODE_DEFAULT_COLOR;
    if (!ctx || typeof ctx.createLinearGradient !== "function") {
        return color;
    }

    const cache = getTitleGradientCache(ctx);
    let gradient = cache.get(color);
    if (!gradient) {
        gradient = ctx.createLinearGradient(0, 0, 400, 0);
        try {
            gradient.addColorStop(0, color);
        } catch (_error) {
            gradient.addColorStop(0, LiteGraph.NODE_DEFAULT_COLOR);
        }
        gradient.addColorStop(1, "#000");
        cache.set(color, gradient);
    }
    return gradient;
}

function shouldUseLeaferNodeUiMode(host) {
    const adapter = host?.rendererAdapter;
    const nodeRenderMode = adapter?.options?.nodeRenderMode;
    if (!adapter || (nodeRenderMode !== "uiapi-parity" && nodeRenderMode !== "uiapi-components")) {
        return false;
    }
    if (nodeRenderMode === "uiapi-components") {
        const profile = host?.renderStyleProfile;
        const validProfile = profile === "leafer-pragmatic-v1" || profile === "leafer-classic-v1";
        if (host?.renderStyleEngine !== "leafer-components" || !validProfile) {
            return false;
        }
    }
    if (adapter.isLayerNative?.("front") !== true) {
        return false;
    }
    if (typeof adapter.getLeaferRuntime !== "function") {
        return false;
    }
    return Boolean(adapter.getLeaferRuntime());
}

function isLeaferNodeUiParityMode(host) {
    return host?.rendererAdapter?.options?.nodeRenderMode === "uiapi-parity";
}

function isLeaferNodeUiComponentsMode(host) {
    return host?.rendererAdapter?.options?.nodeRenderMode === "uiapi-components";
}

function warnLeaferNodeUiFallback(host, message, meta) {
    if (host?._leaferNodeUiWarned) {
        return;
    }
    host._leaferNodeUiWarned = true;
    LiteGraph.warn?.(`[LeaferNodeUI] ${message}`, meta);
}

function decayTriggerCounters(node) {
    // Keep the same semantics as legacy drawNodeShape counters.
    if (node?.execute_triggered > 0) {
        node.execute_triggered -= 1;
    }
    if (node?.action_triggered > 0) {
        node.action_triggered -= 1;
    }
}

function ensureLeaferNodeUiLayer(host, ctx) {
    const adapter = host?.rendererAdapter;
    const runtime = adapter?.getLeaferRuntime?.();
    if (!runtime) {
        warnLeaferNodeUiFallback(host, "runtime unavailable, fallback to legacy Canvas2D node rendering.");
        return null;
    }

    const canvas = host?.frontSurface?.canvas || host?.canvas || ctx?.canvas;
    if (!canvas) {
        warnLeaferNodeUiFallback(host, "front canvas unavailable, fallback to legacy Canvas2D node rendering.");
        return null;
    }

    try {
        if (!host._leaferNodeUiLayer) {
            host._leaferNodeUiLayer = new LeaferNodeUiLayer();
        }
        if (!host._leaferNodeUiLayer.runtime) {
            host._leaferNodeUiLayer.init({
                runtime,
                ownerDocument: canvas.ownerDocument,
                width: canvas.width,
                height: canvas.height,
                enableLogs: Boolean(adapter?.options?.nodeRenderLogs),
            });
        } else if (host._leaferNodeUiLayer._bridgeCanvas?.width !== canvas.width
            || host._leaferNodeUiLayer._bridgeCanvas?.height !== canvas.height) {
            host._leaferNodeUiLayer.resize(canvas.width, canvas.height);
        }
    } catch (error) {
        warnLeaferNodeUiFallback(host, "initialization failed, fallback to legacy Canvas2D node rendering.", error);
        host._leaferNodeUiLayer?.destroy?.();
        host._leaferNodeUiLayer = null;
        return null;
    }
    return host._leaferNodeUiLayer;
}

/** 中文说明：beginNodeFrameLeafer 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function beginNodeFrameLeafer(ctx, _visibleNodes) {
    if (!shouldUseLeaferNodeUiMode(this)) {
        this._leaferNodeUiFrameActive = false;
        return false;
    }
    const layer = ensureLeaferNodeUiLayer(this, ctx);
    if (!layer) {
        this._leaferNodeUiFrameActive = false;
        return false;
    }
    const nodeRenderMode = this?.rendererAdapter?.options?.nodeRenderMode || "uiapi-parity";
    layer.beginFrame({
        nodeRenderMode,
        renderStyleProfile: this?.renderStyleProfile || "legacy",
    });
    this._leaferNodeUiFrameActive = true;
    return true;
}

/** 中文说明：endNodeFrameLeafer 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function endNodeFrameLeafer(ctx, _visibleNodes) {
    if (!this._leaferNodeUiFrameActive || !this._leaferNodeUiLayer) {
        return;
    }
    this._leaferNodeUiLayer.endFrame();
    this._leaferNodeUiLayer.renderTo(ctx);
    this._leaferNodeUiFrameActive = false;
}

/**
 * @param {any} node
 * @param {IRenderContext2DCompat} ctx
 */
/** 中文说明：drawNode 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function drawNode(node, ctx) {
    ensureRoundRectCompat(ctx);

    if (shouldUseLeaferNodeUiMode(this) && this._leaferNodeUiFrameActive && this._leaferNodeUiLayer) {
        if (isLeaferNodeUiParityMode(this)) {
            const frameActive = this._leaferNodeUiFrameActive;
            this.current_node = node;
            this._leaferNodeUiFrameActive = false;
            try {
                this._leaferNodeUiLayer.drawLegacyNode(node, this, (legacyCtx) => {
                    drawNode.call(this, node, legacyCtx);
                });
            } finally {
                this._leaferNodeUiFrameActive = frameActive;
            }
            decayTriggerCounters(node);
            return;
        }
        if (isLeaferNodeUiComponentsMode(this)) {
            this.current_node = node;
            const rendered = this._leaferNodeUiLayer.upsertNode(node, this) !== false;
            if (!rendered) {
                const frameActive = this._leaferNodeUiFrameActive;
                this._leaferNodeUiFrameActive = false;
                try {
                    drawNode.call(this, node, ctx);
                } finally {
                    this._leaferNodeUiFrameActive = frameActive;
                }
            }
            decayTriggerCounters(node);
            return;
        }
        this.current_node = node;
        this._leaferNodeUiLayer.upsertNode(node, this);
        decayTriggerCounters(node);
        return;
    }

    this.current_node = node;

    var color = node.color || node.constructor.color || LiteGraph.NODE_DEFAULT_COLOR;
    var bgcolor = node.bgcolor || node.constructor.bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR;
    var low_quality = this.ds.scale < 0.6; // zoomed out

    // only render if it forces it to do it
    if (this.live_mode) {
        if (!node.flags.collapsed) {
            ctx.shadowColor = "transparent";
            node.onDrawForeground?.(ctx, this, this.canvas);
        }
        return;
    }

    var editor_alpha = this.editor_alpha;
    ctx.globalAlpha = editor_alpha;

    if (this.render_shadows && !low_quality) {
        ctx.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR;
        ctx.shadowOffsetX = 2 * this.ds.scale;
        ctx.shadowOffsetY = 2 * this.ds.scale;
        ctx.shadowBlur = 3 * this.ds.scale;
    } else {
        ctx.shadowColor = "transparent";
    }

    // custom draw collapsed method (draw after shadows because they are affected)
    if (
        node.flags.collapsed &&
        node.onDrawCollapsed?.(ctx, this)
    ) {
        return;
    }

    // clip if required (mask)
    var shape = node._shape || LiteGraph.BOX_SHAPE;
    var size = temp_vec2;
    temp_vec2.set(node.size);
    var horizontal = node.horizontal; // || node.flags.horizontal;

    if (node.flags.collapsed) {
        ctx.font = this.inner_text_font;
        var title = node.getTitle ? node.getTitle() : node.title;
        if (title != null) {
            node._collapsed_width = Math.min(
                node.size[0],
                ctx.measureText(title).width +
                    LiteGraph.NODE_TITLE_HEIGHT * 2,
            ); // LiteGraph.NODE_COLLAPSED_WIDTH;
            size[0] = node._collapsed_width;
            size[1] = 0;
        }
    }

    if (node.clip_area || this.clip_all_nodes) {
        // Start clipping
        ctx.save();
        ctx.beginPath();
        if (shape == LiteGraph.BOX_SHAPE) {
            ctx.rect(0, 0, size[0], size[1]);
        } else if (shape == LiteGraph.ROUND_SHAPE) {
            ctx.roundRect(0, 0, size[0], size[1], [10]);
        } else if (shape == LiteGraph.CIRCLE_SHAPE) {
            ctx.arc(
                size[0] * 0.5,
                size[1] * 0.5,
                size[0] * 0.5,
                0,
                Math.PI * 2,
            );
        }
        ctx.clip();
    }

    // draw shape
    if (node.has_errors) {
        bgcolor = "red";
    }
    this.drawNodeShape(
        node,
        ctx,
        size,
        color,
        bgcolor,
        node.is_selected,
        node.mouseOver,
    );
    ctx.shadowColor = "transparent";

    // draw foreground
    node.onDrawForeground?.(ctx, this, this.canvas);

    // node tooltip
    if (LiteGraph.show_node_tooltip
        && node.mouseOver
        && (node.is_selected && (!this.selected_nodes || Object.keys(this.selected_nodes).length <= 1))
    ) {
        this.drawNodeTooltip(ctx,node);
    }

    // connection slots
    ctx.textAlign = horizontal ? "center" : "left";
    ctx.font = this.inner_text_font;

    var render_text = !this.lowQualityRenderingRequired(0.6);

    var out_slot = this.connecting_output;
    var in_slot = this.connecting_input;
    ctx.lineWidth = 1;

    var max_y = 0;
    var slot_pos = new Float32Array(2); // to reuse
    var doStroke;

    // render inputs and outputs
    if (!node.flags.collapsed) {
        // input connection slots
        if (node.inputs) {
            for (let i = 0; i < node.inputs.length; i++) {
                let slot = node.inputs[i];
                let slot_type = slot.type;
                let slot_shape = slot.shape;

                ctx.globalAlpha = editor_alpha;
                // change opacity of incompatible slots when dragging a connection
                if ( this.connecting_output && !LiteGraph.isValidConnection( slot.type , out_slot.type) ) {
                    ctx.globalAlpha = 0.4 * editor_alpha;
                }

                ctx.fillStyle =
                    slot.link != null
                        ? slot.color_on ||
                            this.default_connection_color_byType[slot_type] ||
                            this.default_connection_color.input_on
                        : slot.color_off ||
                            this.default_connection_color_byTypeOff[slot_type] ||
                            this.default_connection_color_byType[slot_type] ||
                            this.default_connection_color.input_off;

                let pos = node.getConnectionPos(true, i, slot_pos);
                pos[0] -= node.pos[0];
                pos[1] -= node.pos[1];
                if (max_y < pos[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5) {
                    max_y = pos[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5;
                }

                ctx.beginPath();

                if (slot_type == "array") {
                    slot_shape = LiteGraph.GRID_SHAPE; // place in addInput? addOutput instead?
                } else if (slot.name == "onTrigger" || slot.name == "onExecuted") {
                    slot_shape = LiteGraph.ARROW_SHAPE;
                } else if(slot_type === LiteGraph.EVENT || slot_type === LiteGraph.ACTION) {
                    slot_shape = LiteGraph.BOX_SHAPE;
                }

                doStroke = true;

                if (slot_shape === LiteGraph.BOX_SHAPE) {
                    if (horizontal) {
                        ctx.rect(
                            pos[0] - 5 + 0.5,
                            pos[1] - 8 + 0.5,
                            10,
                            14,
                        );
                    } else {
                        ctx.rect(
                            pos[0] - 6 + 0.5,
                            pos[1] - 5 + 0.5,
                            14,
                            10,
                        );
                    }
                } else if (slot_shape === LiteGraph.ARROW_SHAPE) {
                    ctx.moveTo(pos[0] + 8, pos[1] + 0.5);
                    ctx.lineTo(pos[0] - 4, pos[1] + 6 + 0.5);
                    ctx.lineTo(pos[0] - 4, pos[1] - 6 + 0.5);
                    ctx.closePath();
                } else if (slot_shape === LiteGraph.GRID_SHAPE) {
                    ctx.rect(pos[0] - 4, pos[1] - 4, 2, 2);
                    ctx.rect(pos[0] - 1, pos[1] - 4, 2, 2);
                    ctx.rect(pos[0] + 2, pos[1] - 4, 2, 2);
                    ctx.rect(pos[0] - 4, pos[1] - 1, 2, 2);
                    ctx.rect(pos[0] - 1, pos[1] - 1, 2, 2);
                    ctx.rect(pos[0] + 2, pos[1] - 1, 2, 2);
                    ctx.rect(pos[0] - 4, pos[1] + 2, 2, 2);
                    ctx.rect(pos[0] - 1, pos[1] + 2, 2, 2);
                    ctx.rect(pos[0] + 2, pos[1] + 2, 2, 2);
                    doStroke = false;
                } else {
                    if(low_quality)
                        ctx.rect(pos[0] - 4, pos[1] - 4, 8, 8 ); // faster
                    else
                        ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
                }
                ctx.fill();

                // render name
                if (render_text
                    && !(slot.name == "onTrigger" || slot.name == "onExecuted")
                ) {
                    let text = slot.label != null ? slot.label : slot.name;
                    if (text) {
                        ctx.fillStyle = LiteGraph.NODE_TEXT_COLOR;
                        if (horizontal || slot.dir == LiteGraph.UP) {
                            ctx.fillText(text, pos[0], pos[1] - 10);
                        } else {
                            ctx.fillText(text, pos[0] + 10, pos[1] + 5);
                        }
                    }
                }
            }
        }

        // output connection slots

        ctx.textAlign = horizontal ? "center" : "right";
        ctx.strokeStyle = "black";
        if (node.outputs) {
            for (let i = 0; i < node.outputs.length; i++) {
                let slot = node.outputs[i];
                let slot_type = slot.type;
                let slot_shape = slot.shape;

                // change opacity of incompatible slots when dragging a connection
                if (this.connecting_input && !LiteGraph.isValidConnection( slot_type , in_slot.type) ) {
                    ctx.globalAlpha = 0.4 * editor_alpha;
                }

                let pos = node.getConnectionPos(false, i, slot_pos);
                pos[0] -= node.pos[0];
                pos[1] -= node.pos[1];
                if (max_y < pos[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5) {
                    max_y = pos[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5;
                }

                ctx.fillStyle =
                    slot.links && slot.links.length
                        ? slot.color_on ||
                            this.default_connection_color_byType[slot_type] ||
                            this.default_connection_color.output_on
                        : slot.color_off ||
                            this.default_connection_color_byTypeOff[slot_type] ||
                            this.default_connection_color_byType[slot_type] ||
                            this.default_connection_color.output_off;
                ctx.beginPath();
                // ctx.rect( node.size[0] - 14,i*14,10,10);

                if (slot_type == "array") {
                    slot_shape = LiteGraph.GRID_SHAPE;
                } else if (slot.name == "onTrigger" || slot.name == "onExecuted") {
                    slot_shape = LiteGraph.ARROW_SHAPE;
                } else if(slot_type === LiteGraph.EVENT || slot_type === LiteGraph.ACTION) {
                    slot_shape = LiteGraph.BOX_SHAPE;
                }

                doStroke = true;

                if (slot_shape === LiteGraph.BOX_SHAPE) {
                    if (horizontal) {
                        ctx.rect(
                            pos[0] - 5 + 0.5,
                            pos[1] - 8 + 0.5,
                            10,
                            14,
                        );
                    } else {
                        ctx.rect(
                            pos[0] - 6 + 0.5,
                            pos[1] - 5 + 0.5,
                            14,
                            10,
                        );
                    }
                } else if (slot_shape === LiteGraph.ARROW_SHAPE) {
                    ctx.moveTo(pos[0] + 8, pos[1] + 0.5);
                    ctx.lineTo(pos[0] - 4, pos[1] + 6 + 0.5);
                    ctx.lineTo(pos[0] - 4, pos[1] - 6 + 0.5);
                    ctx.closePath();
                } else if (slot_shape === LiteGraph.GRID_SHAPE) {
                    ctx.rect(pos[0] - 4, pos[1] - 4, 2, 2);
                    ctx.rect(pos[0] - 1, pos[1] - 4, 2, 2);
                    ctx.rect(pos[0] + 2, pos[1] - 4, 2, 2);
                    ctx.rect(pos[0] - 4, pos[1] - 1, 2, 2);
                    ctx.rect(pos[0] - 1, pos[1] - 1, 2, 2);
                    ctx.rect(pos[0] + 2, pos[1] - 1, 2, 2);
                    ctx.rect(pos[0] - 4, pos[1] + 2, 2, 2);
                    ctx.rect(pos[0] - 1, pos[1] + 2, 2, 2);
                    ctx.rect(pos[0] + 2, pos[1] + 2, 2, 2);
                    doStroke = false;
                } else {
                    if(low_quality)
                        ctx.rect(pos[0] - 4, pos[1] - 4, 8, 8 );
                    else
                        ctx.arc(pos[0], pos[1], 4, 0, Math.PI * 2);
                }

                // trigger
                // if(slot.node_id != null && slot.slot == -1)
                //	ctx.fillStyle = "#F85";

                // if(slot.links != null && slot.links.length)
                ctx.fill();
                if(!low_quality && doStroke)
                    ctx.stroke();

                // render output name
                if (render_text
                    && !(slot.name == "onTrigger" || slot.name == "onExecuted")
                ) {
                    let text = slot.label != null ? slot.label : slot.name;
                    if (text) {
                        ctx.fillStyle = LiteGraph.NODE_TEXT_COLOR;
                        if (horizontal || slot.dir == LiteGraph.DOWN) {
                            ctx.fillText(text, pos[0], pos[1] - 8);
                        } else {
                            ctx.fillText(text, pos[0] - 10, pos[1] + 5);
                        }
                    }
                }
            }
        }

        ctx.textAlign = "left";
        ctx.globalAlpha = 1;

        if (node.widgets) {
            var widgets_y = max_y;
            if (horizontal || node.widgets_up) {
                widgets_y = 2;
            }
            if( node.widgets_start_y != null )
                widgets_y = node.widgets_start_y;
            this.drawNodeWidgets(
                node,
                widgets_y,
                ctx,
                this.node_widget && this.node_widget[0] == node
                    ? this.node_widget[1]
                    : null,
            );
        }
    } else if (this.render_collapsed_slots) {
        // if collapsed
        var input_slot = null;
        var output_slot = null;

        // get first connected slot to render
        if (node.inputs) {
            for (let i = 0; i < node.inputs.length; i++) {
                var slot = node.inputs[i];
                if (slot.link == null) {
                    continue;
                }
                input_slot = slot;
                break;
            }
        }
        if (node.outputs) {
            for (let i = 0; i < node.outputs.length; i++) {
                var slot = node.outputs[i];
                if (!slot.links || !slot.links.length) {
                    continue;
                }
                output_slot = slot;
            }
        }

        if (input_slot) {
            let x = 0;
            let y = LiteGraph.NODE_TITLE_HEIGHT * -0.5; // center
            if (horizontal) {
                x = node._collapsed_width * 0.5;
                y = -LiteGraph.NODE_TITLE_HEIGHT;
            }
            ctx.fillStyle = "#686";
            ctx.beginPath();
            if (
                slot.type === LiteGraph.EVENT || slot.type === LiteGraph.ACTION ||
                slot.shape === LiteGraph.BOX_SHAPE
            ) {
                ctx.rect(x - 7 + 0.5, y - 4, 14, 8);
            } else if (slot.shape === LiteGraph.ARROW_SHAPE) {
                ctx.moveTo(x + 8, y);
                ctx.lineTo(x + -4, y - 4);
                ctx.lineTo(x + -4, y + 4);
                ctx.closePath();
            } else {
                ctx.arc(x, y, 4, 0, Math.PI * 2);
            }
            ctx.fill();
        }

        if (output_slot) {
            let x = node._collapsed_width;
            let y = LiteGraph.NODE_TITLE_HEIGHT * -0.5; // center
            if (horizontal) {
                x = node._collapsed_width * 0.5;
                y = 0;
            }
            ctx.fillStyle = "#686";
            ctx.strokeStyle = "black";
            ctx.beginPath();
            if (
                slot.type === LiteGraph.EVENT || slot.type === LiteGraph.ACTION ||
                slot.shape === LiteGraph.BOX_SHAPE
            ) {
                ctx.rect(x - 7 + 0.5, y - 4, 14, 8);
            } else if (slot.shape === LiteGraph.ARROW_SHAPE) {
                ctx.moveTo(x + 6, y);
                ctx.lineTo(x - 6, y - 4);
                ctx.lineTo(x - 6, y + 4);
                ctx.closePath();
            } else {
                ctx.arc(x, y, 4, 0, Math.PI * 2);
            }
            ctx.fill();
            // ctx.stroke();
        }
    }

    if (node.clip_area || this.clip_all_nodes) {
        ctx.restore();
    }

    ctx.globalAlpha = 1.0;
}

/**
 * @param {IRenderContext2DCompat} ctx
 * @param {any} node
 */
/** 中文说明：drawNodeTooltip 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function drawNodeTooltip( ctx, node ) {
    if(!node || !ctx) {
        LiteGraph.warn?.("drawNodeTooltip: invalid node or ctx",node,ctx);
        return;
    }
    ensureRoundRectCompat(ctx);
    var text = node.properties.tooltip!=undefined?node.properties.tooltip:"";
    if (!text || text=="") {
        if (LiteGraph.show_node_tooltip_use_descr_property && node.constructor.desc) {
            text = node.constructor.desc;
        }
    }
    text = (text+"").trim();
    if(!text || text == "") {
        // DBG("Empty tooltip");
        return;
    }

    var pos = [0,-LiteGraph.NODE_TITLE_HEIGHT]; // node.pos;
    // text = text.substr(0,30); //avoid weird
    // text = text + "\n" + text;
    var size = node.flags.collapsed? [LiteGraph.NODE_COLLAPSED_WIDTH, LiteGraph.NODE_TITLE_HEIGHT] : node.size;

    // using a trick to save the calculated height of the tip the first time using trasparent, to than show it
    // node.ttip_oTMultiRet is not set or false the first time

    ctx.font = "14px Courier New";
    var info = ctx.measureText(text);
    var w = Math.max(node.size[0],160) + 20; // info.width + 20;
    var h = node.ttip_oTMultiRet ? node.ttip_oTMultiRet.height + 15 : 21;

    ctx.globalAlpha = 0.7 * this.editor_alpha;

    ctx.shadowColor = node.ttip_oTMultiRet?"black":"transparent";
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowBlur = 3;
    ctx.fillStyle = node.ttip_oTMultiRet?"#454":"transparent";
    ctx.beginPath();

    ctx.roundRect( pos[0] - w*0.5 + size[0]/2, pos[1] - 15 - h, w, h, [3]);
    ctx.moveTo( pos[0] - 10 + size[0]/2, pos[1] - 15 );
    ctx.lineTo( pos[0] + 10 + size[0]/2, pos[1] - 15 );
    ctx.lineTo( pos[0] + size[0]/2, pos[1] - 5 );
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.textAlign = "center";
    ctx.fillStyle = node.ttip_oTMultiRet?"#CEC":"transparent";

    ctx.globalAlpha = this.editor_alpha;

    // ctx.fillText(text, pos[0] + size[0]/2, pos[1] - 15 - h * 0.3);
    var oTMultiRet = LiteGraph.canvasFillTextMultiline(ctx, text, pos[0] + size[0]/2, pos[1] - (h), w, 14);

    node.ttip_oTMultiRet = oTMultiRet;

    ctx.closePath();
}

/**
 * @param {any} node
 * @param {IRenderContext2DCompat} ctx
 */
/** 中文说明：drawNodeShape 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function drawNodeShape(node, ctx, size, fgcolor, bgcolor, selected, mouse_over) {
    ensureRoundRectCompat(ctx);

    // bg rect
    ctx.strokeStyle = fgcolor;
    ctx.fillStyle = bgcolor;

    var title_height = LiteGraph.NODE_TITLE_HEIGHT;
    var low_quality = this.lowQualityRenderingRequired(0.5);

    // render node area depending on shape
    var shape = node._shape || node.constructor.shape || LiteGraph.ROUND_SHAPE;

    var title_mode = node.constructor.title_mode;

    var render_title = true;
    if (title_mode == LiteGraph.TRANSPARENT_TITLE || title_mode == LiteGraph.NO_TITLE) {
        render_title = false;
    } else if (title_mode == LiteGraph.AUTOHIDE_TITLE && mouse_over) {
        render_title = true;
    }

    var area = tmp_area;
    area[0] = 0; // x
    area[1] = render_title ? -title_height : 0; // y
    area[2] = size[0] + 1; // w
    area[3] = render_title ? size[1] + title_height : size[1]; // h

    var old_alpha = ctx.globalAlpha;

    // full node shape
    // if(node.flags.collapsed)
    {
        ctx.beginPath();
        if (shape == LiteGraph.BOX_SHAPE || low_quality) {
            ctx.fillRect(area[0], area[1], area[2], area[3]);
        } else if (
            shape == LiteGraph.ROUND_SHAPE ||
            shape == LiteGraph.CARD_SHAPE
        ) {
            ctx.roundRect(
                area[0],
                area[1],
                area[2],
                area[3],
                shape == LiteGraph.CARD_SHAPE ? [this.round_radius,this.round_radius,0,0] : [this.round_radius],
            );
        } else if (shape == LiteGraph.CIRCLE_SHAPE) {
            ctx.arc(
                size[0] * 0.5,
                size[1] * 0.5,
                size[0] * 0.5,
                0,
                Math.PI * 2,
            );
        }
        ctx.fill();

        // separator
        if(!node.flags.collapsed && render_title) {
            ctx.shadowColor = "transparent";
            ctx.fillStyle = "rgba(0,0,0,0.2)";
            ctx.fillRect(0, -1, area[2], 2);
        }
    }
    ctx.shadowColor = "transparent";
    node.onDrawBackground?.(ctx, this, this.canvas, this.graph_mouse );

    // title bg (remember, it is rendered ABOVE the node)
    if (render_title || title_mode == LiteGraph.TRANSPARENT_TITLE) {
        // title bar
        if (node.onDrawTitleBar) {
            node.onDrawTitleBar( ctx, title_height, size, this.ds.scale, fgcolor );
        } else if (
            title_mode != LiteGraph.TRANSPARENT_TITLE &&
            (node.constructor.title_color || this.render_title_colored)
        ) {
            var title_color = node.constructor.title_color || fgcolor;

            if (node.flags.collapsed) {
                ctx.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR;
            }

            //* gradient test
            if (this.use_gradients) {
                ctx.fillStyle = getTitleGradientForContext(ctx, title_color);
            } else {
                ctx.fillStyle = title_color;
            }

            // ctx.globalAlpha = 0.5 * old_alpha;
            ctx.beginPath();
            if (shape == LiteGraph.BOX_SHAPE || low_quality) {
                ctx.rect(0, -title_height, size[0] + 1, title_height);
            } else if ( shape == LiteGraph.ROUND_SHAPE || shape == LiteGraph.CARD_SHAPE ) {
                ctx.roundRect(
                    0,
                    -title_height,
                    size[0] + 1,
                    title_height,
                    node.flags.collapsed ? [this.round_radius] : [this.round_radius,this.round_radius,0,0],
                );
            }
            ctx.fill();
            ctx.shadowColor = "transparent";
        }

        let colState = false;
        if (LiteGraph.node_box_coloured_by_mode && LiteGraph.NODE_MODES_COLORS[node.mode]) {
            colState = LiteGraph.NODE_MODES_COLORS[node.mode];
        }
        if (LiteGraph.node_box_coloured_when_on) {
            colState = node.action_triggered ? "#FFF" : (node.execute_triggered ? "#AAA" : colState);
        }

        // title box
        var box_size = 10;
        if (node.onDrawTitleBox) {
            node.onDrawTitleBox(ctx, title_height, size, this.ds.scale);
        } else if (
            shape == LiteGraph.ROUND_SHAPE ||
            shape == LiteGraph.CIRCLE_SHAPE ||
            shape == LiteGraph.CARD_SHAPE
        ) {
            if (low_quality) {
                ctx.fillStyle = "black";
                ctx.beginPath();
                ctx.arc(
                    title_height * 0.5,
                    title_height * -0.5,
                    box_size * 0.5 + 1,
                    0,
                    Math.PI * 2,
                );
                ctx.fill();
            }

            ctx.fillStyle = node.boxcolor || colState || LiteGraph.NODE_DEFAULT_BOXCOLOR;
            if(low_quality)
                ctx.fillRect( title_height * 0.5 - box_size *0.5, title_height * -0.5 - box_size *0.5, box_size , box_size );
            else {
                ctx.beginPath();
                ctx.arc(
                    title_height * 0.5,
                    title_height * -0.5,
                    box_size * 0.5,
                    0,
                    Math.PI * 2,
                );
                ctx.fill();
            }
        } else {
            if (low_quality) {
                ctx.fillStyle = "black";
                ctx.fillRect(
                    (title_height - box_size) * 0.5 - 1,
                    (title_height + box_size) * -0.5 - 1,
                    box_size + 2,
                    box_size + 2,
                );
            }
            ctx.fillStyle = node.boxcolor || colState || LiteGraph.NODE_DEFAULT_BOXCOLOR;
            ctx.fillRect(
                (title_height - box_size) * 0.5,
                (title_height + box_size) * -0.5,
                box_size,
                box_size,
            );
        }
        ctx.globalAlpha = old_alpha;

        // title text
        if (node.onDrawTitleText) {
            node.onDrawTitleText(
                ctx,
                title_height,
                size,
                this.ds.scale,
                this.title_text_font,
                selected,
            );
        }
        if (!low_quality) {
            ctx.font = this.title_text_font;
            var title = String(node.getTitle());
            if (title) {
                if (selected) {
                    ctx.fillStyle = LiteGraph.NODE_SELECTED_TITLE_COLOR;
                } else {
                    ctx.fillStyle =
                        node.constructor.title_text_color ||
                        this.node_title_color;
                }
                if (node.flags.collapsed) {
                    ctx.textAlign = "left";
                    ctx.fillText(
                        title.substring(0, 20), // avoid urls too long
                        title_height,// + measure.width * 0.5,
                        LiteGraph.NODE_TITLE_TEXT_Y - title_height,
                    );
                    ctx.textAlign = "left";
                } else {
                    ctx.textAlign = "left";
                    ctx.fillText(
                        title,
                        title_height,
                        LiteGraph.NODE_TITLE_TEXT_Y - title_height,
                    );
                }
            }
        }

        // subgraph box
        if (!node.flags.collapsed && node.subgraph && !node.skip_subgraph_button) {
            var w = LiteGraph.NODE_TITLE_HEIGHT;
            var x = node.size[0] - w;
            var over = LiteGraph.isInsideRectangle( this.graph_mouse[0] - node.pos[0], this.graph_mouse[1] - node.pos[1], x+2, -w+2, w-4, w-4 );
            ctx.fillStyle = over ? "#888" : "#555";
            if( shape == LiteGraph.BOX_SHAPE || low_quality)
                ctx.fillRect(x+2, -w+2, w-4, w-4);
            else {
                ctx.beginPath();
                ctx.roundRect(x+2, -w+2, w-4, w-4,[4]);
                ctx.fill();
            }
            ctx.fillStyle = "#333";
            ctx.beginPath();
            ctx.moveTo(x + w * 0.2, -w * 0.6);
            ctx.lineTo(x + w * 0.8, -w * 0.6);
            ctx.lineTo(x + w * 0.5, -w * 0.3);
            ctx.fill();
        }

        // custom title render
        if (node.onDrawTitle) {
            node.onDrawTitle(ctx);
        }
    }

    // render selection marker
    if (selected) {
        if (node.onBounding) {
            node.onBounding(area);
        }

        if (title_mode == LiteGraph.TRANSPARENT_TITLE) {
            area[1] -= title_height;
            area[3] += title_height;
        }
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.8;
        ctx.beginPath();
        if (shape == LiteGraph.BOX_SHAPE) {
            ctx.rect(
                -6 + area[0],
                -6 + area[1],
                12 + area[2],
                12 + area[3],
            );
        } else if (
            shape == LiteGraph.ROUND_SHAPE ||
            (shape == LiteGraph.CARD_SHAPE && node.flags.collapsed)
        ) {
            ctx.roundRect(
                -6 + area[0],
                -6 + area[1],
                12 + area[2],
                12 + area[3],
                [this.round_radius * 2],
            );
        } else if (shape == LiteGraph.CARD_SHAPE) {
            ctx.roundRect(
                -6 + area[0],
                -6 + area[1],
                12 + area[2],
                12 + area[3],
                [this.round_radius * 2,2,this.round_radius * 2,2],
            );
        } else if (shape == LiteGraph.CIRCLE_SHAPE) {
            ctx.arc(
                size[0] * 0.5,
                size[1] * 0.5,
                size[0] * 0.5 + 6,
                0,
                Math.PI * 2,
            );
        }
        ctx.strokeStyle = LiteGraph.NODE_BOX_OUTLINE_COLOR;
        ctx.stroke();
        ctx.strokeStyle = fgcolor;
        ctx.globalAlpha = 1;
    }

    // these counter helps in conditioning drawing based on if the node has been executed or an action occurred
    if (node.execute_triggered>0) node.execute_triggered--;
    if (node.action_triggered>0) node.action_triggered--;
}

/**
 * @param {IRenderContext2DCompat} ctx
 */
/** 中文说明：drawExecutionOrder 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function drawExecutionOrder(ctx) {
    ctx.shadowColor = "transparent";
    ctx.globalAlpha = 0.25;

    ctx.textAlign = "center";
    ctx.strokeStyle = "white";
    ctx.globalAlpha = 0.75;

    var visible_nodes = this.visible_nodes;
    for (let i = 0; i < visible_nodes.length; ++i) {
        var node = visible_nodes[i];
        ctx.fillStyle = "black";
        ctx.fillRect(
            node.pos[0] - LiteGraph.NODE_TITLE_HEIGHT,
            node.pos[1] - LiteGraph.NODE_TITLE_HEIGHT,
            LiteGraph.NODE_TITLE_HEIGHT,
            LiteGraph.NODE_TITLE_HEIGHT,
        );
        if (node.order == 0) {
            ctx.strokeRect(
                node.pos[0] - LiteGraph.NODE_TITLE_HEIGHT + 0.5,
                node.pos[1] - LiteGraph.NODE_TITLE_HEIGHT + 0.5,
                LiteGraph.NODE_TITLE_HEIGHT,
                LiteGraph.NODE_TITLE_HEIGHT,
            );
        }
        ctx.fillStyle = "#FFF";
        ctx.fillText(
            node.order,
            node.pos[0] + LiteGraph.NODE_TITLE_HEIGHT * -0.5,
            node.pos[1] - 6,
        );
    }
    ctx.globalAlpha = 1;
}

/**
 * @param {any} node
 * @param {number} posY
 * @param {IRenderContext2DCompat} ctx
 * @param {any} active_widget
 */
/** 中文说明：drawNodeWidgets 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function drawNodeWidgets(node, posY, ctx, active_widget) {
    if (!node.widgets || !node.widgets.length) {
        return 0;
    }
    ensureRoundRectCompat(ctx);
    var width = node.size[0];
    var widgets = node.widgets;
    posY += 2;
    var H = LiteGraph.NODE_WIDGET_HEIGHT;
    var show_text = !this.lowQualityRenderingRequired(0.5);
    ctx.save();
    ctx.globalAlpha = this.editor_alpha;
    var outline_color = LiteGraph.WIDGET_OUTLINE_COLOR;
    var background_color = LiteGraph.WIDGET_BGCOLOR;
    var text_color = LiteGraph.WIDGET_TEXT_COLOR;
    var secondary_text_color = LiteGraph.WIDGET_SECONDARY_TEXT_COLOR;
    var margin = 15;

    for (let i = 0; i < widgets.length; ++i) {
        var w = widgets[i];
        var y = posY;
        if (w.y) {
            y = w.y;
        }
        w.last_y = y;
        ctx.strokeStyle = outline_color;
        ctx.fillStyle = "#222";
        ctx.textAlign = "left";
        // ctx.lineWidth = 2;
        if(w.disabled)
            ctx.globalAlpha *= 0.5;
        var widget_width = w.width || width;

        switch (w.type) {
            case "button":
                if (w.clicked) {
                    ctx.fillStyle = "#AAA";
                    w.clicked = false;
                    this.dirty_canvas = true;
                }
                ctx.fillRect(margin, y, widget_width - margin * 2, H);
                if(show_text && !w.disabled)
                    ctx.strokeRect( margin, y, widget_width - margin * 2, H );
                if (show_text) {
                    ctx.textAlign = "center";
                    ctx.fillStyle = text_color;
                    ctx.fillText(w.label || w.name, widget_width * 0.5, y + H * 0.7);
                }
                break;
            case "toggle":
                ctx.textAlign = "left";
                ctx.strokeStyle = outline_color;
                ctx.fillStyle = background_color;
                ctx.beginPath();
                if (show_text)
                    ctx.roundRect(margin, y, widget_width - margin * 2, H, [H * 0.5]);
                else
                    ctx.rect(margin, y, widget_width - margin * 2, H );
                ctx.fill();
                if(show_text && !w.disabled)
                    ctx.stroke();
                ctx.fillStyle = w.value ? "#89A" : "#333";
                ctx.beginPath();
                ctx.arc( widget_width - margin * 2, y + H * 0.5, H * 0.36, 0, Math.PI * 2 );
                ctx.fill();
                if (show_text) {
                    ctx.fillStyle = secondary_text_color;
                    const label = w.label || w.name;
                    if (label != null) {
                        ctx.fillText(label, margin * 2, y + H * 0.7);
                    }
                    ctx.fillStyle = w.value ? text_color : secondary_text_color;
                    ctx.textAlign = "right";
                    ctx.fillText(
                        w.value
                            ? w.options.on || "true"
                            : w.options.off || "false",
                        widget_width - 40,
                        y + H * 0.7,
                    );
                }
                break;
            case "slider":
                ctx.fillStyle = background_color;
                ctx.fillRect(margin, y, widget_width - margin * 2, H);
                var range = w.options.max - w.options.min;
                var nvalue = (w.value - w.options.min) / range;
                if(nvalue < 0.0) nvalue = 0.0;
                if(nvalue > 1.0) nvalue = 1.0;
                ctx.fillStyle = w.options.hasOwnProperty("slider_color") ? w.options.slider_color : (active_widget == w ? "#89A" : "#678");
                ctx.fillRect(margin, y, nvalue * (widget_width - margin * 2), H);
                if(show_text && !w.disabled)
                    ctx.strokeRect(margin, y, widget_width - margin * 2, H);
                if (w.marker) {
                    var marker_nvalue = (w.marker - w.options.min) / range;
                    if(marker_nvalue < 0.0) marker_nvalue = 0.0;
                    if(marker_nvalue > 1.0) marker_nvalue = 1.0;
                    ctx.fillStyle = w.options.hasOwnProperty("marker_color") ? w.options.marker_color : "#AA9";
                    ctx.fillRect( margin + marker_nvalue * (widget_width - margin * 2), y, 2, H );
                }
                if (show_text) {
                    ctx.textAlign = "center";
                    ctx.fillStyle = text_color;
                    ctx.fillText(
                        w.label || w.name + "  " + Number(w.value).toFixed(w.options.precision != null
                            ? w.options.precision
                            : 3),
                        widget_width * 0.5,
                        y + H * 0.7,
                    );
                }
                break;
            case "number":
            case "combo":
                ctx.textAlign = "left";
                ctx.strokeStyle = outline_color;
                ctx.fillStyle = background_color;
                ctx.beginPath();
                if(show_text)
                    ctx.roundRect(margin, y, widget_width - margin * 2, H, [H * 0.5] );
                else
                    ctx.rect(margin, y, widget_width - margin * 2, H );
                ctx.fill();
                if (show_text) {
                    if(!w.disabled)
                        ctx.stroke();
                    ctx.fillStyle = text_color;
                    if(!w.disabled) {
                        ctx.beginPath();
                        ctx.moveTo(margin + 16, y + 5);
                        ctx.lineTo(margin + 6, y + H * 0.5);
                        ctx.lineTo(margin + 16, y + H - 5);
                        ctx.fill();
                        ctx.beginPath();
                        ctx.moveTo(widget_width - margin - 16, y + 5);
                        ctx.lineTo(widget_width - margin - 6, y + H * 0.5);
                        ctx.lineTo(widget_width - margin - 16, y + H - 5);
                        ctx.fill();
                    }
                    ctx.fillStyle = secondary_text_color;
                    ctx.fillText(w.label || w.name, margin * 2 + 5, y + H * 0.7);
                    ctx.fillStyle = text_color;
                    ctx.textAlign = "right";
                    if (w.type == "number") {
                        ctx.fillText(
                            Number(w.value).toFixed(w.options.precision !== undefined
                                ? w.options.precision
                                : 3),
                            widget_width - margin * 2 - 20,
                            y + H * 0.7,
                        );
                    } else {
                        var v = w.value;
                        if( w.options.values ) {
                            var values = w.options.values;
                            if( values.constructor === Function )
                                values = values();
                            if(values && values.constructor !== Array)
                                v = values[w.value];
                        }
                        ctx.fillText(
                            v,
                            widget_width - margin * 2 - 20,
                            y + H * 0.7,
                        );
                    }
                }
                break;
            case "string":
            case "text":
                ctx.textAlign = "left";
                ctx.strokeStyle = outline_color;
                ctx.fillStyle = background_color;
                ctx.beginPath();
                if (show_text)
                    ctx.roundRect(margin, y, widget_width - margin * 2, H, [H * 0.5]);
                else
                    ctx.rect( margin, y, widget_width - margin * 2, H );
                ctx.fill();
                if (show_text) {
                    if(!w.disabled)
                        ctx.stroke();
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(margin, y, widget_width - margin * 2, H);
                    ctx.clip();

                    // ctx.stroke();
                    ctx.fillStyle = secondary_text_color;
                    const label = w.label || w.name;
                    if (label != null) {
                        ctx.fillText(label, margin * 2, y + H * 0.7);
                    }
                    ctx.fillStyle = text_color;
                    ctx.textAlign = "right";
                    ctx.fillText(String(w.value).substr(0,30), widget_width - margin * 2, y + H * 0.7); // 30 chars max
                    ctx.restore();
                }
                break;
            default:
                if (w.draw) {
                    w.draw(ctx, node, widget_width, y, H);
                }
                break;
        }
        posY += (w.computeSize ? w.computeSize(widget_width)[1] : H) + 4;
        ctx.globalAlpha = this.editor_alpha;

    }
    ctx.restore();
    ctx.textAlign = "left";
}

/** 中文说明：processNodeWidgets 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function processNodeWidgets(node, pos, event, active_widget) {
    if (!node.widgets || !node.widgets.length || (!this.allow_interaction && !node.flags.allow_interaction)) {
        return null;
    }

    var x = pos[0] - node.pos[0];
    var y = pos[1] - node.pos[1];
    var width = node.size[0];
    var deltaX = event.deltaX || event.deltax || 0;
    var that = this;
    var ref_window = this.getCanvasWindow();

    for (let i = 0; i < node.widgets.length; ++i) {
        var w = node.widgets[i];
        if(!w || w.disabled)
            continue;
        var widget_height = w.computeSize ? w.computeSize(width)[1] : LiteGraph.NODE_WIDGET_HEIGHT;
        var widget_width = w.width || width;
        // outside
        if ( w != active_widget &&
            (x < 6 || x > widget_width - 12 || y < w.last_y || y > w.last_y + widget_height || w.last_y === undefined) )
            continue;

        var old_value = w.value;

        // if ( w == active_widget || (x > 6 && x < widget_width - 12 && y > w.last_y && y < w.last_y + widget_height) ) {
        // inside widget
        switch (w.type) {
            case "button":
                if (event.type === "pointerdown") {
                    if (w.callback) {
                        setTimeout(function() {
                            w.callback(w, that, node, pos, event);
                        }, 20);
                    }
                    w.clicked = true;
                    this.dirty_canvas = true;
                }
                break;
            case "slider":
                var nvalue = LiteGraph.clamp((x - 15) / (widget_width - 30), 0, 1);
                if(w.options.read_only) break;
                w.value = w.options.min + (w.options.max - w.options.min) * nvalue;
                if (old_value != w.value) {
                    setTimeout(function() {
                        inner_value_change(w, w.value, old_value);
                    }, 20);
                }
                this.dirty_canvas = true;
                break;
            case "number":
            case "combo":
            case "enum":
                if (event.type == "pointermove" && w.type == "number") {
                    if(deltaX)
                        w.value += deltaX * 0.1 * (w.options.step || 1);
                    if ( w.options.min != null && w.value < w.options.min ) {
                        w.value = w.options.min;
                    }
                    if ( w.options.max != null && w.value > w.options.max ) {
                        w.value = w.options.max;
                    }
                } else if (event.type == "pointerdown") {
                    var values = w.options.values;
                    if (values && values.constructor === Function) {
                        values = w.options.values(w, node);
                    }
                    var values_list = null;

                    if( w.type != "number")
                        values_list = values.constructor === Array ? values : Object.keys(values);

                    let delta = x < 40 ? -1 : x > widget_width - 40 ? 1 : 0;
                    if (w.type == "number") {
                        w.value += delta * 0.1 * (w.options.step || 1);
                        if ( w.options.min != null && w.value < w.options.min ) {
                            w.value = w.options.min;
                        }
                        if ( w.options.max != null && w.value > w.options.max ) {
                            w.value = w.options.max;
                        }
                    } else if (delta) { // clicked in arrow, used for combos
                        var index = -1;
                        this.last_mouseclick = 0; // avoids double click event
                        if(values.constructor === Object)
                            index = values_list.indexOf( String( w.value ) ) + delta;
                        else
                            index = values_list.indexOf( w.value ) + delta;
                        if (index >= values_list.length) {
                            index = values_list.length - 1;
                        }
                        if (index < 0) {
                            index = 0;
                        }
                        if( values.constructor === Array )
                            w.value = values[index];
                        else
                            w.value = index;
                    } else { // combo clicked
                        var text_values = values != values_list ? Object.values(values) : values;
                        new LiteGraph.ContextMenu(
                            text_values, {
                                scale: Math.max(1, this.ds.scale),
                                event: event,
                                className: "dark",
                                callback: inner_clicked.bind(w),
                            },
                            ref_window,
                        );

                        function inner_clicked(v) {
                            if(values != values_list)
                                v = text_values.indexOf(v);
                            this.value = v;
                            inner_value_change(this, v, old_value);
                            that.dirty_canvas = true;
                            return false;
                        }
                    }
                    // end mousedown
                } else if(event.type == "pointerup" && w.type == "number") {
                    let delta = x < 40 ? -1 : x > widget_width - 40 ? 1 : 0;
                    if (event.click_time < 200 && delta == 0) {
                        this.prompt(
                            "Value",w.value,function(v) {
                            // check if v is a valid equation or a number
                                if (/^[0-9+\-*/()\s]+|\d+\.\d+$/.test(v)) {
                                    try {// solve the equation if possible
                                        v = eval(v);
                                    } catch (error) {
                                        LiteGraph.warn?.(error);
                                    }
                                }
                                this.value = Number(v);
                                inner_value_change(this, this.value, old_value);
                            }.bind(w),
                            event,
                        );
                    }
                }

                if( old_value != w.value )
                    setTimeout(
                        function() {
                            inner_value_change(this, this.value, old_value);
                        }.bind(w),
                        20,
                    );
                this.dirty_canvas = true;
                break;
            case "toggle":
                if (event.type == "pointerdown") {
                    w.value = !w.value;
                    setTimeout(function() {
                        inner_value_change(w, w.value);
                    }, 20);
                    this.dirty_canvas = true;
                }
                break;
            case "string":
            case "text":
                if (event.type == "pointerdown") {
                    this.prompt(
                        "Value",w.value,function(v) {
                            inner_value_change(this, v);
                        }.bind(w),
                        event,w.options ? w.options.multiline : false,
                    );
                }
                break;
            default:
                if (w.mouse) {
                    this.dirty_canvas = w.mouse(event, [x, y], node);
                }
                break;
        }

        return w;
    }// end for

    function inner_value_change(widget, value, old_value) {
        LiteGraph.debug?.("inner_value_change for processNodeWidgets",widget,value);
        // value changed
        if( old_value != w.value ) {
            if(node.onWidgetChanged) {
                node.onWidgetChanged( w.name,w.value,old_value,w ); // tag: event entrypoint
            }
            // node.graph._version++;
            node.graph.onGraphChanged({action: "widgetChanged", doSave: true}); // tag: graph event entrypoint
        }
        if(widget.type == "number") {
            value = Number(value);
        }
        widget.value = value;
        if ( widget.options && widget.options.property && node.properties[widget.options.property] !== undefined ) {
            node.setProperty( widget.options.property, value );
        }
        if (widget.callback) {
            widget.callback(widget.value, that, node, pos, event);
        }
    }

    return null;
}

/** 中文说明：adjustNodesSize 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function adjustNodesSize() {
    var nodes = this.graph._nodes;
    for (let i = 0; i < nodes.length; ++i) {
        nodes[i].size = nodes[i].computeSize();
    }
    this.setDirty(true, true);
}




