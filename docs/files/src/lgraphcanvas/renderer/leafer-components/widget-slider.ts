# 文件文档：`src/lgraphcanvas/renderer/leafer-components/widget-slider.ts`

## 所属模块介绍

- 模块：`src/lgraphcanvas/renderer/leafer-components`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/lgraphcanvas/renderer/leafer-components/text-layout.ts`
- 介绍：
> 中文说明：scaledFontSize 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 导出项数量：1
- AUTO 说明数量：0

## 1. `renderWidgetSlider`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/leafer-components/widget-slider.ts:8-77` (`#L8`)
- 说明来源：源码注释
- 说明：
> 中文说明：renderWidgetSlider 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L8-L27）：
```js
export function renderWidgetSlider(env) {
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
    const precision = widget.options?.precision ?? 3;
    const valueText = Number(widget.value ?? 0).toFixed(precision);

    const track = createUi("Rect", {
        x: margin,
        y: sy,
        width: barWidth,
```

> 片段已按最大行数裁剪。
