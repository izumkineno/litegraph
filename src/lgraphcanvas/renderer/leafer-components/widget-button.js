import { createLeaferText, scaledFontSize } from "./text-layout.js";

/**
 * @param {object} env
 */
export function renderWidgetButton(env) {
    const { createUi, addChildren, view, widget, host, y, scale, width, tokens, showText } = env;
    const height = env.widgetHeight;
    const sy = y * scale;
    const sh = height * scale;
    const widgetWidth = (widget.width || width) * scale;
    const margin = 15 * scale;
    const label = widget.label || widget.name || "button";

    const rect = createUi("Rect", {
        x: margin,
        y: sy,
        width: Math.max(1, widgetWidth - margin * 2),
        height: sh,
        fill: widget.clicked ? tokens.widgetAccent : tokens.widgetBg,
        stroke: tokens.widgetBorder,
        strokeWidth: Math.max(1, scale),
        cornerRadius: Math.max(2, 3 * scale),
        opacity: widget.disabled ? 0.5 : 1,
        hittable: false,
    });
    addChildren(view.widgetsGroup, rect);
    if (showText) {
        const fontSize = scaledFontSize(tokens.bodyFontSize, scale);
        const text = createLeaferText(createUi, {
            x: 0,
            y: sy,
            width: widgetWidth,
            height: sh,
            text: String(label),
            fill: tokens.widgetText,
            fontSize,
            textAlign: "center",
            verticalAlign: "middle",
        });
        addChildren(view.widgetsGroup, text);
    }
    if (widget.clicked) {
        widget.clicked = false;
        if (host) {
            host.dirty_canvas = true;
        }
    }
    return { nextY: y + height + 4 };
}
