import { createLeaferText, scaledFontSize, snapPixel } from "./text-layout.js";

/**
 * @param {object} env
 */
export function renderWidgetNumber(env) {
    const { createUi, addChildren, view, widget, y, scale, width, tokens, showText } = env;
    const height = env.widgetHeight;
    const sy = y * scale;
    const sh = height * scale;
    const widgetWidth = (widget.width || width) * scale;
    const margin = 15 * scale;
    const label = widget.label || widget.name || "number";
    const precision = widget.options?.precision ?? 3;
    const value = Number(widget.value ?? 0).toFixed(precision);

    const rect = createUi("Rect", {
        x: margin,
        y: sy,
        width: Math.max(1, widgetWidth - margin * 2),
        height: sh,
        fill: tokens.widgetBg,
        stroke: tokens.widgetBorder,
        strokeWidth: Math.max(1, scale),
        cornerRadius: Math.max(2, (height * 0.5) * scale),
        opacity: widget.disabled ? 0.5 : 1,
        hittable: false,
    });
    addChildren(view.widgetsGroup, rect);
    if (showText) {
        const fontSize = scaledFontSize(tokens.smallFontSize, scale);
        const labelStart = margin * 2 + 5 * scale;
        const valueRight = widgetWidth - margin * 2 - 20 * scale;
        const valueBoxX = margin;
        const valueBoxWidth = Math.max(1, valueRight - valueBoxX);
        const labelBoxWidth = Math.max(1, valueRight - labelStart - 4 * scale);
        const leftArrow = !widget.disabled ? createUi("Polygon", {
            points: [
                margin + 16 * scale, sy + 5 * scale,
                margin + 6 * scale, sy + sh * 0.5,
                margin + 16 * scale, sy + sh - 5 * scale,
            ],
            fill: tokens.widgetText,
            hittable: false,
        }) : null;
        const rightArrow = !widget.disabled ? createUi("Polygon", {
            points: [
                widgetWidth - margin - 16 * scale, sy + 5 * scale,
                widgetWidth - margin - 6 * scale, sy + sh * 0.5,
                widgetWidth - margin - 16 * scale, sy + sh - 5 * scale,
            ],
            fill: tokens.widgetText,
            hittable: false,
        }) : null;
        const labelText = createUi("Text", {
            x: snapPixel(labelStart),
            y: snapPixel(sy),
            width: labelBoxWidth,
            height: sh,
            text: String(label),
            fill: tokens.widgetSecondaryText,
            fontSize,
            fontFamily: "Arial",
            verticalAlign: "middle",
            autoSizeAlign: false,
            hittable: false,
        });
        const valueText = createLeaferText(createUi, {
            x: valueBoxX,
            y: sy,
            width: valueBoxWidth,
            height: sh,
            text: value,
            fill: tokens.widgetText,
            fontSize,
            textAlign: "right",
            verticalAlign: "middle",
        });
        addChildren(view.widgetsGroup, leftArrow, rightArrow, labelText, valueText);
    }
    return { nextY: y + height + 4 };
}
