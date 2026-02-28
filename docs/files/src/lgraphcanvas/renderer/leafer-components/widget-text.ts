# 文件文档：`src/lgraphcanvas/renderer/leafer-components/widget-text.ts`

## 所属模块介绍

- 模块：`src/lgraphcanvas/renderer/leafer-components`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/lgraphcanvas/renderer/leafer-components/text-layout.ts`
- 介绍：
> 中文说明：scaledFontSize 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 导出项数量：1
- AUTO 说明数量：0

## 1. `renderWidgetText`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/leafer-components/widget-text.ts:8-60` (`#L8`)
- 说明来源：源码注释
- 说明：
> 中文说明：renderWidgetText 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L8-L27）：
```js
export function renderWidgetText(env) {
    const { createUi, addChildren, view, widget, y, scale, width, tokens, showText } = env;
    const height = env.widgetHeight;
    const sy = y * scale;
    const sh = height * scale;
    const widgetWidth = (widget.width || width) * scale;
    const margin = 15 * scale;
    const label = widget.label || widget.name || "text";
    const rawValue = String(widget.value ?? "");
    const value = rawValue.length > 30 ? rawValue.slice(0, 30) : rawValue;

    const rect = createUi("Rect", {
        x: margin,
        y: sy,
        width: Math.max(1, widgetWidth - margin * 2),
        height: sh,
        fill: tokens.widgetBg,
        stroke: tokens.widgetBorder,
        strokeWidth: Math.max(1, scale),
        cornerRadius: Math.max(2, (height * 0.5) * scale),
```

> 片段已按最大行数裁剪。
