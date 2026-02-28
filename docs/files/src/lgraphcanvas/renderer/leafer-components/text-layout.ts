# 文件文档：`src/lgraphcanvas/renderer/leafer-components/text-layout.ts`

## 所属模块介绍

- 模块：`src/lgraphcanvas/renderer/leafer-components`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/lgraphcanvas/renderer/leafer-components/text-layout.ts`
- 介绍：
> 中文说明：scaledFontSize 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 导出项数量：5
- AUTO 说明数量：0

## 1. `scaledFontSize`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/leafer-components/text-layout.ts:3-7` (`#L3`)
- 说明来源：源码注释
- 说明：
> 中文说明：scaledFontSize 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L3-L8）：
```js
export function scaledFontSize(basePx, scale) {
    const base = Number.isFinite(basePx) ? basePx : 12;
    const safeScale = Number.isFinite(scale) ? Math.max(0.05, scale) : 1;
    return Math.max(1, base * safeScale);
}

```

## 2. `canvasBaselineToTextTop`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/leafer-components/text-layout.ts:10-12` (`#L10`)
- 说明来源：源码注释
- 说明：
> 中文说明：canvasBaselineToTextTop 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L10-L15）：
```js
export function canvasBaselineToTextTop(baselineY, fontSize) {
    return baselineY - fontSize * 0.78;
}

/** 中文说明：widgetTextTop 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function widgetTextTop(y, height, fontSize) {
```

## 3. `widgetTextTop`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/leafer-components/text-layout.ts:15-17` (`#L15`)
- 说明来源：源码注释
- 说明：
> 中文说明：widgetTextTop 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L15-L20）：
```js
export function widgetTextTop(y, height, fontSize) {
    return canvasBaselineToTextTop(y + height * 0.7, fontSize);
}

/** 中文说明：snapPixel 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function snapPixel(value) {
```

## 4. `snapPixel`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/leafer-components/text-layout.ts:20-22` (`#L20`)
- 说明来源：源码注释
- 说明：
> 中文说明：snapPixel 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L20-L25）：
```js
export function snapPixel(value) {
    return Math.round(value * 2) / 2;
}

/** 中文说明：createLeaferText 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function createLeaferText(createUi, {
```

## 5. `createLeaferText`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/leafer-components/text-layout.ts:25-68` (`#L25`)
- 说明来源：源码注释
- 说明：
> 中文说明：createLeaferText 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L25-L44）：
```js
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
```

> 片段已按最大行数裁剪。
