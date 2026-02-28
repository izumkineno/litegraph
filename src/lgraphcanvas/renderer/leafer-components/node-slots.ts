import { createLeaferText, scaledFontSize, snapPixel } from "./text-layout.ts";
import type { LeaferNodeComponentEnv, LeaferUiFactory, LiteGraphLike } from "../leafer-types.ts";

const SLOT_LABEL_X_OFFSET = 10;
const SLOT_LABEL_CENTER_OFFSET = 0;
const SLOT_LABEL_INPUT_VERTICAL_OFFSET = -10;
const SLOT_LABEL_OUTPUT_VERTICAL_OFFSET = -8;

function estimateLabelWidth(text, fontSize, scale) {
    const raw = String(text ?? "");
    const estimatedTextWidth = raw.length * fontSize * 0.62;
    return Math.max(18 * scale, Math.min(220 * scale, estimatedTextWidth + 8 * scale));
}

function resolveSlotLabelPlacement(
    text,
    slot,
    isOutput,
    sx,
    sy,
    horizontal,
    scale,
    fontSize,
    LiteGraph,
): {
    x: number;
    y: number;
    width: number;
    height: number;
    textAlign: "left" | "right" | "center";
} {
    const verticalDir = isOutput ? LiteGraph.DOWN : LiteGraph.UP;
    const vertical = horizontal || slot?.dir === verticalDir;
    const labelHeight = Math.max(fontSize * 1.25, 12 * scale);

    if (vertical) {
        const width = Math.max(40 * scale, estimateLabelWidth(text, fontSize, scale));
        const top = sy + (isOutput ? SLOT_LABEL_OUTPUT_VERTICAL_OFFSET : SLOT_LABEL_INPUT_VERTICAL_OFFSET) * scale - labelHeight * 0.5;
        return {
            x: snapPixel(sx - width * 0.5),
            y: snapPixel(top),
            width,
            height: labelHeight,
            textAlign: "center",
        };
    }

    const labelWidth = estimateLabelWidth(text, fontSize, scale);
    const x = isOutput
        ? sx - SLOT_LABEL_X_OFFSET * scale - labelWidth
        : sx + SLOT_LABEL_X_OFFSET * scale;
    const top = sy + SLOT_LABEL_CENTER_OFFSET * scale - labelHeight * 0.5;
    return {
        x: snapPixel(x),
        y: snapPixel(top),
        width: labelWidth,
        height: labelHeight,
        textAlign: isOutput ? "right" : "left",
    };
}

function resolveSlotShape(slot, slotType, LiteGraph) {
    if (slotType === "array") {
        return LiteGraph.GRID_SHAPE;
    }
    if (slot?.name === "onTrigger" || slot?.name === "onExecuted") {
        return LiteGraph.ARROW_SHAPE;
    }
    if (slotType === LiteGraph.EVENT || slotType === LiteGraph.ACTION) {
        return LiteGraph.BOX_SHAPE;
    }
    return slot?.shape || LiteGraph.CIRCLE_SHAPE;
}

function createGridShape(createUi: LeaferUiFactory, sx: number, sy: number, scale: number, fill: string) {
    const group = createUi("Group", { hittable: false });
    const step = 3 * scale;
    const dot = Math.max(1, 2 * scale);
    for (let yy = -1; yy <= 1; yy += 1) {
        for (let xx = -1; xx <= 1; xx += 1) {
            group.add(
                createUi("Rect", {
                    x: sx + xx * step,
                    y: sy + yy * step,
                    width: dot,
                    height: dot,
                    fill,
                    hittable: false,
                }),
            );
        }
    }
    return group;
}

function createInputArrowShape(createUi: LeaferUiFactory, sx: number, sy: number, horizontal: boolean, scale: number, fill: string) {
    if (horizontal) {
        return createUi("Polygon", {
            points: [sx + 8 * scale, sy, sx - 4 * scale, sy + 6 * scale, sx - 4 * scale, sy - 6 * scale],
            fill,
            hittable: false,
        });
    }
    return createUi("Polygon", {
        points: [sx + 8 * scale, sy, sx - 4 * scale, sy + 6 * scale, sx - 4 * scale, sy - 6 * scale],
        fill,
        hittable: false,
    });
}

function createOutputArrowShape(createUi: LeaferUiFactory, sx: number, sy: number, horizontal: boolean, scale: number, fill: string) {
    if (horizontal) {
        return createUi("Polygon", {
            points: [sx - 8 * scale, sy, sx + 4 * scale, sy + 6 * scale, sx + 4 * scale, sy - 6 * scale],
            fill,
            hittable: false,
        });
    }
    return createUi("Polygon", {
        points: [sx - 8 * scale, sy, sx + 4 * scale, sy + 6 * scale, sx + 4 * scale, sy - 6 * scale],
        fill,
        hittable: false,
    });
}

function createBoxShape(createUi: LeaferUiFactory, sx: number, sy: number, horizontal: boolean, scale: number, fill: string) {
    return createUi("Rect", {
        x: sx + (horizontal ? -5 : -6) * scale,
        y: sy + (horizontal ? -8 : -5) * scale,
        width: (horizontal ? 10 : 14) * scale,
        height: (horizontal ? 14 : 10) * scale,
        fill,
        hittable: false,
    });
}

function createCircleShape(createUi: LeaferUiFactory, sx: number, sy: number, scale: number, fill: string, lowQuality: boolean) {
    const radius = lowQuality ? 4 * scale : 4 * scale;
    return createUi("Ellipse", {
        x: sx - radius,
        y: sy - radius,
        width: radius * 2,
        height: radius * 2,
        fill,
        hittable: false,
    });
}

function createSlotGraphic(
    createUi: LeaferUiFactory,
    slotShape: number,
    sx: number,
    sy: number,
    horizontal: boolean,
    scale: number,
    fill: string,
    lowQuality: boolean,
    isOutput: boolean,
    LiteGraph: LiteGraphLike,
) {
    if (slotShape === LiteGraph.BOX_SHAPE) {
        return createBoxShape(createUi, sx, sy, horizontal, scale, fill);
    }
    if (slotShape === LiteGraph.ARROW_SHAPE) {
        return isOutput
            ? createOutputArrowShape(createUi, sx, sy, horizontal, scale, fill)
            : createInputArrowShape(createUi, sx, sy, horizontal, scale, fill);
    }
    if (slotShape === LiteGraph.GRID_SHAPE) {
        return createGridShape(createUi, sx, sy, scale, fill);
    }
    return createCircleShape(createUi, sx, sy, scale, fill, lowQuality);
}

function renderCollapsedSlotIndicators(env: LeaferNodeComponentEnv): void {
    const {
        view,
        createUi,
        addChildren,
        node,
        host,
        LiteGraph,
        tokens,
        shape,
        width,
        titleHeightScaled,
        scale,
    } = env;

    if (!host?.render_collapsed_slots) {
        return;
    }
    let inputSlot = null;
    let outputSlot = null;
    if (Array.isArray(node?.inputs)) {
        inputSlot = node.inputs.find((slot) => slot?.link != null) || null;
    }
    if (Array.isArray(node?.outputs)) {
        for (let i = 0; i < node.outputs.length; i += 1) {
            if (Array.isArray(node.outputs[i]?.links) && node.outputs[i].links.length) {
                outputSlot = node.outputs[i];
            }
        }
    }
    const fill = tokens.slotInputColor || "#686";
    const horizontal = Boolean(node?.horizontal);

    if (inputSlot) {
        let x = 0;
        let y = -titleHeightScaled * 0.5;
        if (horizontal) {
            x = width * 0.5;
            y = -titleHeightScaled;
        }
        const slotType = inputSlot?.type;
        const slotShape = resolveSlotShape(inputSlot, slotType, LiteGraph);
        const graphic = createSlotGraphic(createUi, slotShape, x, y, horizontal, scale, fill, false, false, LiteGraph);
        addChildren(view.slotsGroup, graphic);
    }

    if (outputSlot) {
        let x = width;
        let y = -titleHeightScaled * 0.5;
        if (horizontal) {
            x = width * 0.5;
            y = 0;
        }
        const slotType = outputSlot?.type;
        const slotShape = resolveSlotShape(outputSlot, slotType, LiteGraph);
        const graphic = createSlotGraphic(createUi, slotShape, x, y, horizontal, scale, fill, false, true, LiteGraph);
        addChildren(view.slotsGroup, graphic);
    }
}

/**
 * @param {object} env
 */
/** 中文说明：renderNodeSlots 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function renderNodeSlots(env: LeaferNodeComponentEnv): void {
    const {
        view,
        createUi,
        addChildren,
        clearChildren,
        node,
        host,
        scale,
        showCollapsed,
        renderText,
        lowQuality,
        LiteGraph,
        tokens,
    } = env;

    clearChildren(view.slotsGroup);
    if (showCollapsed) {
        renderCollapsedSlotIndicators(env);
        return;
    }

    const slotPos = new Float32Array(2);
    const horizontal = Boolean(node?.horizontal);

    if (Array.isArray(node?.inputs)) {
        for (let i = 0; i < node.inputs.length; i += 1) {
            const slot = node.inputs[i];
            const slotType = slot?.type;
            const slotTypeKey = String(slotType ?? "");
            const slotShape = resolveSlotShape(slot, slotType, LiteGraph);
            const pos = node.getConnectionPos?.(true, i, slotPos) || [node.pos[0], node.pos[1]];
            const sx = (pos[0] - node.pos[0]) * scale;
            const sy = (pos[1] - node.pos[1]) * scale;
            const compatible = host?.connecting_output
                ? LiteGraph.isValidConnection(slot?.type, host.connecting_output?.type)
                : true;
            const fill = slot?.link != null
                ? (slot?.color_on || host?.default_connection_color_byType?.[slotTypeKey] || host?.default_connection_color?.input_on || tokens.slotInputColor)
                : (slot?.color_off || host?.default_connection_color_byTypeOff?.[slotTypeKey] || host?.default_connection_color_byType?.[slotTypeKey] || host?.default_connection_color?.input_off || tokens.slotInputColor);
            const graphic = createSlotGraphic(createUi, slotShape, sx, sy, horizontal, scale, fill, lowQuality, false, LiteGraph);
            if (!compatible) {
                graphic.opacity = 0.4;
            }
            addChildren(view.slotsGroup, graphic);

            if (renderText && slot?.name !== "onTrigger" && slot?.name !== "onExecuted") {
                const text = slot?.label != null ? slot.label : slot?.name;
                if (text) {
                    const fontSize = scaledFontSize(tokens.smallFontSize, scale);
                    const label = resolveSlotLabelPlacement(text, slot, false, sx, sy, horizontal, scale, fontSize, LiteGraph);
                    addChildren(view.slotsGroup, createLeaferText(createUi, {
                        x: label.x,
                        y: label.y,
                        width: label.width,
                        height: label.height,
                        text: String(text),
                        fill: tokens.slotLabelColor || LiteGraph.NODE_TEXT_COLOR,
                        fontSize,
                        textAlign: label.textAlign,
                        verticalAlign: "middle",
                        textWrap: "none",
                    }));
                }
            }
        }
    }

    if (Array.isArray(node?.outputs)) {
        for (let i = 0; i < node.outputs.length; i += 1) {
            const slot = node.outputs[i];
            const slotType = slot?.type;
            const slotTypeKey = String(slotType ?? "");
            const slotShape = resolveSlotShape(slot, slotType, LiteGraph);
            const pos = node.getConnectionPos?.(false, i, slotPos) || [node.pos[0] + node.size[0], node.pos[1]];
            const sx = (pos[0] - node.pos[0]) * scale;
            const sy = (pos[1] - node.pos[1]) * scale;
            const compatible = host?.connecting_input
                ? LiteGraph.isValidConnection(slotType, host.connecting_input?.type)
                : true;
            const fill = (Array.isArray(slot?.links) && slot.links.length)
                ? (slot?.color_on || host?.default_connection_color_byType?.[slotTypeKey] || host?.default_connection_color?.output_on || tokens.slotOutputColor)
                : (slot?.color_off || host?.default_connection_color_byTypeOff?.[slotTypeKey] || host?.default_connection_color_byType?.[slotTypeKey] || host?.default_connection_color?.output_off || tokens.slotOutputColor);
            const graphic = createSlotGraphic(createUi, slotShape, sx, sy, horizontal, scale, fill, lowQuality, true, LiteGraph);
            if (!compatible) {
                graphic.opacity = 0.4;
            }
            addChildren(view.slotsGroup, graphic);

            if (renderText && slot?.name !== "onTrigger" && slot?.name !== "onExecuted") {
                const text = slot?.label != null ? slot.label : slot?.name;
                if (text) {
                    const fontSize = scaledFontSize(tokens.smallFontSize, scale);
                    const label = resolveSlotLabelPlacement(text, slot, true, sx, sy, horizontal, scale, fontSize, LiteGraph);
                    addChildren(view.slotsGroup, createLeaferText(createUi, {
                        x: label.x,
                        y: label.y,
                        width: label.width,
                        height: label.height,
                        text: String(text),
                        fill: tokens.slotLabelColor || LiteGraph.NODE_TEXT_COLOR,
                        fontSize,
                        textAlign: label.textAlign,
                        verticalAlign: "middle",
                        textWrap: "none",
                    }));
                }
            }
        }
    }
}





