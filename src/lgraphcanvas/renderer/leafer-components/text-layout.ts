import type { LeaferUiFactory, LeaferUiLike } from "../leafer-types.ts";

/** 中文说明：scaledFontSize 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function scaledFontSize(basePx: number, scale: number): number {
    const base = Number.isFinite(basePx) ? basePx : 12;
    const safeScale = Number.isFinite(scale) ? Math.max(0.05, scale) : 1;
    return Math.max(1, base * safeScale);
}

/** 中文说明：canvasBaselineToTextTop 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function canvasBaselineToTextTop(baselineY: number, fontSize: number): number {
    return baselineY - fontSize * 0.78;
}

/** 中文说明：widgetTextTop 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function widgetTextTop(y: number, height: number, fontSize: number): number {
    return canvasBaselineToTextTop(y + height * 0.7, fontSize);
}

/** 中文说明：snapPixel 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function snapPixel(value: number): number {
    return Math.round(value * 2) / 2;
}

/** 中文说明：createLeaferText 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function createLeaferText(createUi: LeaferUiFactory, {
    x,
    y,
    width,
    height,
    text,
    fill,
    fontSize,
    textAlign = "left",
    verticalAlign = "middle",
    textWrap = "none",
    autoSizeAlign = false,
    padding,
    lineHeight,
    fontFamily = "Arial",
    hittable = false,
}: {
    x: number;
    y: number;
    width?: number;
    height?: number;
    text: string;
    fill: string;
    fontSize: number;
    textAlign?: "left" | "right" | "center";
    verticalAlign?: "top" | "middle" | "bottom";
    textWrap?: "none" | "break" | "hide";
    autoSizeAlign?: boolean;
    padding?: number | number[];
    lineHeight?: number;
    fontFamily?: string;
    hittable?: boolean;
}): LeaferUiLike {
    const data: Record<string, unknown> = {
        x: snapPixel(x),
        y: snapPixel(y),
        text,
        fill,
        fontSize,
        textAlign,
        verticalAlign,
        textWrap,
        autoSizeAlign,
        fontFamily,
        hittable,
    };
    if (width != null) {
        data.width = Math.max(1, width);
    }
    if (height != null) {
        data.height = Math.max(1, height);
    }
    if (padding != null) {
        data.padding = padding;
    }
    if (lineHeight != null) {
        data.lineHeight = lineHeight;
    }
    return createUi("Text", data);
}





