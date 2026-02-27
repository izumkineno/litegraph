import { scaledFontSize, snapPixel } from "./text-layout.js";

function getTitleModeColor(node, LiteGraph) {
    let modeColor = false;
    if (LiteGraph.node_box_coloured_by_mode && LiteGraph.NODE_MODES_COLORS?.[node?.mode]) {
        modeColor = LiteGraph.NODE_MODES_COLORS[node.mode];
    }
    if (LiteGraph.node_box_coloured_when_on) {
        modeColor = node?.action_triggered ? "#FFF" : (node?.execute_triggered ? "#AAA" : modeColor);
    }
    return modeColor;
}

function createTitleBox(createUi, env, fill, outline = null) {
    const { titleHeightScaled, shape, LiteGraph, lowQuality, scale } = env;
    const size = Math.max(8 * scale, 10 * scale);
    const x = titleHeightScaled * 0.5 - size * 0.5;
    const y = -titleHeightScaled * 0.5 - size * 0.5;

    if (shape === LiteGraph.ROUND_SHAPE || shape === LiteGraph.CIRCLE_SHAPE || shape === LiteGraph.CARD_SHAPE) {
        return createUi("Ellipse", {
            x,
            y,
            width: size,
            height: size,
            fill,
            stroke: outline || "transparent",
            strokeWidth: lowQuality ? Math.max(1, scale) : 0,
            hittable: false,
        });
    }
    return createUi("Rect", {
        x,
        y,
        width: size,
        height: size,
        fill,
        stroke: outline || "transparent",
        strokeWidth: lowQuality ? Math.max(1, scale) : 0,
        cornerRadius: 0,
        hittable: false,
    });
}

/**
 * @param {object} env
 */
export function renderNodeTitle(env) {
    const {
        view,
        createUi,
        addChildren,
        clearChildren,
        LiteGraph,
        width,
        titleHeightScaled,
        scale,
        host,
        title,
        nodeColor,
        node,
        tokens,
        shape,
        titleMode,
        renderTitle,
        showCollapsed,
        lowQuality,
        selected,
    } = env;

    clearChildren(view.titleGroup);

    const transparentTitle = titleMode === LiteGraph.TRANSPARENT_TITLE;
    if (!renderTitle && !transparentTitle) {
        return;
    }

    const renderColoredBar = !transparentTitle && (node?.constructor?.title_color || host?.render_title_colored);
    if (renderColoredBar) {
        const titleRect = createUi("Rect", {
            x: 0,
            y: -titleHeightScaled,
            width,
            height: titleHeightScaled,
            fill: node?.constructor?.title_color || nodeColor || tokens.titleBg,
            cornerRadius: showCollapsed
                ? [(host?.round_radius || tokens.radius) * scale]
                : [(host?.round_radius || tokens.radius) * scale, (host?.round_radius || tokens.radius) * scale, 0, 0],
            hittable: false,
        });
        addChildren(view.titleGroup, titleRect);
    }

    const titleBoxFill = node?.boxcolor || getTitleModeColor(node, LiteGraph) || LiteGraph.NODE_DEFAULT_BOXCOLOR;
    const titleBox = createTitleBox(createUi, env, titleBoxFill, lowQuality ? "black" : null);
    addChildren(view.titleGroup, titleBox);

    if (!lowQuality) {
        const visibleTitle = showCollapsed ? String(title || "").substring(0, 20) : String(title || "");
        const titleFontSize = scaledFontSize(tokens.titleFontSize, scale);
        const titleText = createUi("Text", {
            x: snapPixel(titleHeightScaled),
            y: snapPixel(-titleHeightScaled),
            width: Math.max(1, width - titleHeightScaled - 6 * scale),
            height: Math.max(1, titleHeightScaled),
            text: visibleTitle,
            fill: selected
                ? (LiteGraph.NODE_SELECTED_TITLE_COLOR || "#FFF")
                : (node?.constructor?.title_text_color || host?.node_title_color || tokens.titleTextColor),
            fontSize: titleFontSize,
            fontFamily: "Arial",
            textAlign: "left",
            verticalAlign: "middle",
            textWrap: "none",
            hittable: false,
        });
        addChildren(view.titleGroup, titleText);
    }
}
