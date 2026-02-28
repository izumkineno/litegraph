# 文件文档：`src/lgraphcanvas/renderer/leafer-components/node-slots.ts`

## 所属模块介绍

- 模块：`src/lgraphcanvas/renderer/leafer-components`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/lgraphcanvas/renderer/leafer-components/text-layout.ts`
- 介绍：
> 中文说明：scaledFontSize 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 导出项数量：1
- AUTO 说明数量：0

## 1. `renderNodeSlots`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/leafer-components/node-slots.ts:212-320` (`#L212`)
- 说明来源：源码注释
- 说明：
> 中文说明：renderNodeSlots 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L212-L231）：
```js
export function renderNodeSlots(env) {
    const {
        view,
        createUi,
        addChildren,
        clearChildren,
        node,
        host,
        scale,
        showCollapsed,
        renderText,
        lowQuality,
        LiteGraph,
        tokens,
    } = env;

    clearChildren(view.slotsGroup);
    if (showCollapsed) {
        renderCollapsedSlotIndicators(env);
        return;
```

> 片段已按最大行数裁剪。
