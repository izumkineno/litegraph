# 文件文档：`src/lgraphcanvas/renderer/leafer-components/registry.ts`

## 所属模块介绍

- 模块：`src/lgraphcanvas/renderer/leafer-components`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/lgraphcanvas/renderer/leafer-components/text-layout.ts`
- 介绍：
> 中文说明：scaledFontSize 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 导出项数量：5
- AUTO 说明数量：1

## 1. `REQUIRED_NODE_COMPONENT_KEYS`

- 类型：`variable`
- 位置：`src/lgraphcanvas/renderer/leafer-components/registry.ts:16-21` (`#L16`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `REQUIRED_NODE_COMPONENT_KEYS`（const），定义于 `src/lgraphcanvas/renderer/leafer-components/registry.ts`。

- 代码片段（L16-L21）：
```js
export const REQUIRED_NODE_COMPONENT_KEYS = Object.freeze([
    "node-shell",
    "node-title",
    "node-slots",
    "node-tooltip",
]);
```

## 2. `getNodeComponent`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/leafer-components/registry.ts:42-44` (`#L42`)
- 说明来源：源码注释
- 说明：
> 中文说明：getNodeComponent 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L42-L47）：
```js
export function getNodeComponent(key) {
    return NODE_COMPONENTS[key] || null;
}

/** 中文说明：hasRequiredNodeComponents 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function hasRequiredNodeComponents() {
```

## 3. `hasRequiredNodeComponents`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/leafer-components/registry.ts:47-49` (`#L47`)
- 说明来源：源码注释
- 说明：
> 中文说明：hasRequiredNodeComponents 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L47-L52）：
```js
export function hasRequiredNodeComponents() {
    return REQUIRED_NODE_COMPONENT_KEYS.every((key) => typeof NODE_COMPONENTS[key] === "function");
}

/** 中文说明：getWidgetComponent 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function getWidgetComponent(widget) {
```

## 4. `getWidgetComponent`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/leafer-components/registry.ts:52-61` (`#L52`)
- 说明来源：源码注释
- 说明：
> 中文说明：getWidgetComponent 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L52-L61）：
```js
export function getWidgetComponent(widget) {
    if (!widget) {
        return null;
    }
    if (typeof widget.draw === "function") {
        return WIDGET_COMPONENTS.custom || null;
    }
    const type = String(widget.type || "").toLowerCase();
    return WIDGET_COMPONENTS[type] || null;
}
```

## 5. `getRenderStyleTokens`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/leafer-components/registry.ts:64-69` (`#L64`)
- 说明来源：源码注释
- 说明：
> 中文说明：getRenderStyleTokens 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

- 代码片段（L64-L69）：
```js
export function getRenderStyleTokens(profile) {
    if (profile === "leafer-classic-v1" || profile === "legacy") {
        return CLASSIC_TOKENS;
    }
    return PRAGMATIC_SLATE_TOKENS;
}
```
