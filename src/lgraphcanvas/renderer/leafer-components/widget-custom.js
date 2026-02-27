/**
 * @param {object} env
 */
export function renderWidgetCustom(env) {
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
