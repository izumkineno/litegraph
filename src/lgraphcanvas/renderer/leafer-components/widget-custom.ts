import type { LeaferWidgetComponentEnv, LeaferWidgetRenderResult } from "../leafer-types.ts";
/**
 * @param {object} env
 */
/** 中文说明：renderWidgetCustom 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function renderWidgetCustom(env: LeaferWidgetComponentEnv): LeaferWidgetRenderResult {
    const { widget, y, width } = env;
    const height = widget.computeSize ? widget.computeSize(width)[1] : env.widgetHeight;
    const widgetWidth = widget.width || width;

    // Keep full compatibility with legacy custom widgets:
    // if draw callback exists, rendering is delegated to callback canvas only.
    if (typeof widget.draw === "function") {
        return {
            nextY: y + height + 4,
            legacyDraw(ctx, node) {
                widget.draw(ctx, node, widgetWidth, y, height);
            },
        };
    }

    // Legacy path does not render a placeholder when custom has no draw.
    return { nextY: y + height + 4 };
}





