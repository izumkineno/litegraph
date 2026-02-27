import { scaledFontSize, snapPixel, widgetTextTop } from "./text-layout.js";

/**
 * @param {object} env
 */
export function renderNodeTooltip(env) {
    const {
        view,
        createUi,
        addChildren,
        clearChildren,
        host,
        width,
        scale,
        titleHeightScaled,
        tooltip,
        node,
        LiteGraph,
        tokens,
    } = env;

    clearChildren(view.tooltipGroup);
    const showTooltip = LiteGraph.show_node_tooltip
        && Boolean(node?.mouseOver)
        && Boolean(node?.is_selected)
        && (!host?.selected_nodes || Object.keys(host.selected_nodes).length <= 1)
        && tooltip !== "";

    if (!showTooltip) {
        return;
    }

    const tooltipWidth = Math.max(160 * scale, Math.min(width * 1.2, 320 * scale));
    const tooltipHeight = 26 * scale;
    const tooltipRect = createUi("Rect", {
        x: (width - tooltipWidth) * 0.5,
        y: -(titleHeightScaled + tooltipHeight + 8 * scale),
        width: tooltipWidth,
        height: tooltipHeight,
        fill: tokens.tooltipBg,
        stroke: tokens.tooltipBorder,
        strokeWidth: Math.max(1, scale),
        cornerRadius: Math.max(3, 4 * scale),
        hittable: false,
    });
    const tooltipFontSize = scaledFontSize(tokens.bodyFontSize, scale);
    const tooltipText = createUi("Text", {
        x: snapPixel(width * 0.5),
        y: snapPixel(widgetTextTop(tooltipRect.y, tooltipHeight, tooltipFontSize)),
        text: tooltip.slice(0, 120),
        fill: tokens.tooltipText,
        fontSize: tooltipFontSize,
        textAlign: "center",
        textWrap: "none",
        hittable: false,
    });
    const tipArrow = createUi("Polygon", {
        points: [
            width * 0.5 - 10 * scale,
            -titleHeightScaled - 8 * scale,
            width * 0.5 + 10 * scale,
            -titleHeightScaled - 8 * scale,
            width * 0.5,
            -titleHeightScaled + 2 * scale,
        ],
        fill: tokens.tooltipBg,
        stroke: tokens.tooltipBorder,
        strokeWidth: Math.max(1, scale),
        hittable: false,
    });
    addChildren(view.tooltipGroup, tooltipRect, tipArrow, tooltipText);
}
