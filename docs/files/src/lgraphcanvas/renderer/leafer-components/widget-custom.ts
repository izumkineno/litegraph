# 文件文档：`src/lgraphcanvas/renderer/leafer-components/widget-custom.ts`

## 所属模块介绍

- 模块：`src/lgraphcanvas/renderer/leafer-components`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/lgraphcanvas/renderer/leafer-components/text-layout.ts`
- 介绍：
> 中文说明：scaledFontSize 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 导出项数量：1
- AUTO 说明数量：0

## 1. `renderWidgetCustom`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/leafer-components/widget-custom.ts:6-24` (`#L6`)
- 说明来源：源码注释
- 说明：
> 中文说明：renderWidgetCustom 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L6-L24）：
```js
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
```
