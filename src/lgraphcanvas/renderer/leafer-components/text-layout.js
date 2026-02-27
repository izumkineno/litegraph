export function scaledFontSize(basePx, scale) {
    const base = Number.isFinite(basePx) ? basePx : 12;
    const safeScale = Number.isFinite(scale) ? Math.max(0.05, scale) : 1;
    return Math.max(1, base * safeScale);
}

export function canvasBaselineToTextTop(baselineY, fontSize) {
    return baselineY - fontSize * 0.78;
}

export function widgetTextTop(y, height, fontSize) {
    return canvasBaselineToTextTop(y + height * 0.7, fontSize);
}

export function snapPixel(value) {
    return Math.round(value * 2) / 2;
}

export function createLeaferText(createUi, {
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
}) {
    const data = {
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
