# 文件文档：`src/lgraphcanvas/renderer/leafer-components/node-shell.ts`

## 所属模块介绍

- 模块：`src/lgraphcanvas/renderer/leafer-components`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/lgraphcanvas/renderer/leafer-components/text-layout.ts`
- 介绍：
> 中文说明：scaledFontSize 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 导出项数量：1
- AUTO 说明数量：0

## 1. `renderNodeShell`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/leafer-components/node-shell.ts:82-136` (`#L82`)
- 说明来源：源码注释
- 说明：
> 中文说明：renderNodeShell 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L82-L101）：
```js
export function renderNodeShell(env) {
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
```

> 片段已按最大行数裁剪。
