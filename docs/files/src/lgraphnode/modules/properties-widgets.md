# 文件文档：`src/lgraphnode/modules/properties-widgets.js`

## 所属模块介绍

- 模块：`src/lgraphnode/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphnode/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 11 个文件，导出 22 项（AUTO 22 项），耦合强度 22。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src/lgraphnode`(22)。
> 主要导出：`ancestorRefreshMethods`、`canvasIntegrationMethods`、`connectionsMethods`、`executionActionsMethods`、`geometryHitMethods`、`ioDataMethods`。
> 代表文件：`ancestor-refresh.js`、`canvas-integration.js`、`connections.js`。

- 导出项数量：2
- AUTO 说明数量：2

## 1. `setPropertiesWidgetsMethodsLiteGraph`

- 类型：`function`
- 位置：`src/lgraphnode/modules/properties-widgets.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setPropertiesWidgetsMethodsLiteGraph`，定义于 `src/lgraphnode/modules/properties-widgets.js`。

- 代码片段（L3-L8）：
```js
export function setPropertiesWidgetsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const propertiesWidgetsMethods = {
setProperty(name, value) {
```

## 2. `propertiesWidgetsMethods`

- 类型：`variable`
- 位置：`src/lgraphnode/modules/properties-widgets.js:7-128` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `propertiesWidgetsMethods`（const），定义于 `src/lgraphnode/modules/properties-widgets.js`。

- 代码片段（L7-L26）：
```js
export const propertiesWidgetsMethods = {
setProperty(name, value) {
        this.properties ||= {};

        // Check if the new value is the same as the current value
        if (value === this.properties[name]) {
            return;
        }

        const prevValue = this.properties[name];
        this.properties[name] = value;

        // Call onPropertyChanged and revert the change if needed
        if (this.onPropertyChanged?.(name, value, prevValue) === false) {
            this.properties[name] = prevValue;
        }

        // Update the widget value associated with the property name
        const widgetToUpdate = this.widgets?.find((widget) => widget && widget.options?.property === name);

```

> 片段已按最大行数裁剪。
