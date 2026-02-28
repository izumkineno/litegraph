import { createLeaferText, scaledFontSize } from "./text-layout.ts";
import type { LeaferWidgetComponentEnv, LeaferWidgetRenderResult } from "../leafer-types.ts";

/**
 * @param {object} env
 */
/** 中文说明：renderWidgetSlider 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function renderWidgetSlider(env: LeaferWidgetComponentEnv): LeaferWidgetRenderResult {
    const { createUi, addChildren, view, widget, y, scale, width, tokens, showText, active } = env;
    const height = env.widgetHeight;
    const sy = y * scale;
    const sh = height * scale;
    const widgetWidth = (widget.width || width) * scale;
    const margin = 15 * scale;
    const min = Number(widget.options?.min ?? 0);
    const max = Number(widget.options?.max ?? 1);
    const range = max - min || 1;
    const ratio = Math.max(0, Math.min(1, (Number(widget.value ?? min) - min) / range));
    const barWidth = Math.max(1, widgetWidth - margin * 2);
    const label = widget.label || widget.name || "slider";
    const precision = Number(widget.options?.precision ?? 3);
    const valueText = Number(widget.value ?? 0).toFixed(precision);

    const track = createUi("Rect", {
        x: margin,
        y: sy,
        width: barWidth,
        height: sh,
        fill: tokens.widgetBg,
        stroke: tokens.widgetBorder,
        strokeWidth: Math.max(1, scale),
        cornerRadius: Math.max(2, 3 * scale),
        opacity: widget.disabled ? 0.5 : 1,
        hittable: false,
    });
    const fill = createUi("Rect", {
        x: margin,
        y: sy,
        width: barWidth * ratio,
        height: sh,
        fill: widget.options?.slider_color || (active ? "#89A" : (tokens.widgetAccent || "#678")),
        cornerRadius: Math.max(2, 3 * scale),
        opacity: widget.disabled ? 0.5 : 1,
        hittable: false,
    });
    addChildren(view.widgetsGroup, track, fill);
    if (showText) {
        const fontSize = scaledFontSize(tokens.bodyFontSize, scale);
        const text = createLeaferText(createUi, {
            x: 0,
            y: sy,
            width: widgetWidth,
            height: sh,
            text: widget.label || `${widget.name || "slider"}  ${valueText}`,
            fill: tokens.widgetText,
            fontSize,
            textAlign: "center",
            verticalAlign: "middle",
        });
        addChildren(view.widgetsGroup, text);
    }

    if (widget.marker != null) {
        const markerRatio = Math.max(0, Math.min(1, (Number(widget.marker) - min) / range));
        const marker = createUi("Rect", {
            x: margin + barWidth * markerRatio,
            y: sy,
            width: Math.max(1, 2 * scale),
            height: sh,
            fill: widget.options?.marker_color || tokens.widgetWarning,
            hittable: false,
        });
        addChildren(view.widgetsGroup, marker);
    }

    return { nextY: y + height + 4 };
}





