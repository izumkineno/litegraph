import { createLeaferText, scaledFontSize, snapPixel } from "./text-layout.ts";
import type { LeaferWidgetComponentEnv, LeaferWidgetRenderResult } from "../leafer-types.ts";

/**
 * @param {object} env
 */
/** 中文说明：renderWidgetToggle 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function renderWidgetToggle(env: LeaferWidgetComponentEnv): LeaferWidgetRenderResult {
    const { createUi, addChildren, view, widget, y, scale, width, tokens, showText } = env;
    const height = env.widgetHeight;
    const sy = y * scale;
    const sh = height * scale;
    const widgetWidth = (widget.width || width) * scale;
    const margin = 15 * scale;
    const label = widget.label || widget.name || "toggle";
    const toggleText = widget.value ? (widget.options?.on || "true") : (widget.options?.off || "false");

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
    const knob = createUi("Ellipse", {
        x: widgetWidth - margin * 2 - sh * 0.72,
        y: sy + (sh * 0.5 - sh * 0.36),
        width: sh * 0.72,
        height: sh * 0.72,
        fill: widget.value ? tokens.widgetAccentAlt : tokens.widgetBorder,
        hittable: false,
    });
    addChildren(view.widgetsGroup, rect, knob);
    if (showText) {
        const fontSize = scaledFontSize(tokens.smallFontSize, scale);
        const labelText = createLeaferText(createUi, {
            x: margin * 2,
            y: sy,
            width: Math.max(1, widgetWidth * 0.48),
            height: sh,
            text: String(label),
            fill: tokens.widgetSecondaryText,
            fontSize,
            textAlign: "left",
            verticalAlign: "middle",
        });
        const valueText = createLeaferText(createUi, {
            x: margin * 2,
            y: sy,
            width: Math.max(1, widgetWidth - margin * 2 - 6 * scale),
            height: sh,
            text: String(toggleText),
            fill: widget.value ? tokens.widgetText : tokens.widgetSecondaryText,
            fontSize,
            textAlign: "right",
            verticalAlign: "middle",
        });
        addChildren(view.widgetsGroup, labelText, valueText);
    }
    return { nextY: y + height + 4 };
}





