import type { LeaferNodeComponentEnv, LeaferUiFactory } from "../leafer-types.ts";

function createBodyShape(
    createUi: LeaferUiFactory,
    env: LeaferNodeComponentEnv,
    fill: string,
    stroke: string,
    strokeWidth: number,
    inflate = 0,
) {
    const {
        LiteGraph,
        shape,
        width,
        height,
        titleHeightScaled,
        renderTitle,
        showCollapsed,
        host,
        scale,
    } = env;
    const areaY = renderTitle ? -titleHeightScaled : 0;
    const areaHeight = showCollapsed
        ? titleHeightScaled
        : (renderTitle ? height + titleHeightScaled : height);
    const radius = (host?.round_radius || env.tokens.radius) * scale;
    const x = -inflate;
    const y = areaY - inflate;
    const w = Math.max(1, width + inflate * 2);
    const h = Math.max(1, areaHeight + inflate * 2);

    if (shape === LiteGraph.CIRCLE_SHAPE && !showCollapsed) {
        return createUi("Ellipse", {
            x,
            y: 0 - inflate,
            width: Math.max(1, width + inflate * 2),
            height: Math.max(1, height + inflate * 2),
            fill,
            stroke,
            strokeWidth,
            hittable: false,
        });
    }

    if (shape === LiteGraph.CARD_SHAPE && !showCollapsed) {
        return createUi("Rect", {
            x,
            y,
            width: w,
            height: h,
            fill,
            stroke,
            strokeWidth,
            cornerRadius: [radius, radius, 2 * scale, 2 * scale],
            hittable: false,
        });
    }

    if (shape === LiteGraph.BOX_SHAPE || env.lowQuality) {
        return createUi("Rect", {
            x,
            y,
            width: w,
            height: h,
            fill,
            stroke,
            strokeWidth,
            cornerRadius: 0,
            hittable: false,
        });
    }

    return createUi("Rect", {
        x,
        y,
        width: w,
        height: h,
        fill,
        stroke,
        strokeWidth,
        cornerRadius: showCollapsed ? [radius] : [radius, radius, radius, radius],
        hittable: false,
    });
}

/**
 * @param {object} env
 */
/** 中文说明：renderNodeShell 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function renderNodeShell(env: LeaferNodeComponentEnv): void {
    const {
        view,
        createUi,
        addChildren,
        clearChildren,
        LiteGraph,
        node,
        host,
        nodeColor,
        bgColor,
        selected,
        renderTitle,
        showCollapsed,
        scale,
        tokens,
    } = env;

    clearChildren(view.bodyGroup);
    const bodyFill = node?.has_errors ? "#FF0000" : (bgColor || tokens.bodyBg);
    const bodyStroke = nodeColor || tokens.bodyBorder;
    const body = createBodyShape(
        createUi,
        env,
        bodyFill,
        bodyStroke,
        Math.max(1, (host?.connections_width || tokens.borderWidth) * 0.33 * scale),
        0,
    );
    addChildren(view.bodyGroup, body);

    if (!showCollapsed && renderTitle) {
        const separator = createUi("Rect", {
            x: 0,
            y: -1 * scale,
            width: Math.max(1, env.width),
            height: Math.max(1, 2 * scale),
            fill: "rgba(0,0,0,0.2)",
            hittable: false,
        });
        addChildren(view.bodyGroup, separator);
    }

    if (selected) {
        const outline = createBodyShape(
            createUi,
            env,
            "transparent",
            LiteGraph.NODE_BOX_OUTLINE_COLOR || "#FFFFFF",
            Math.max(1, scale),
            6 * scale,
        );
        addChildren(view.bodyGroup, outline);
    }
}






