# 文件文档：`src/litegraph/modules/pointer-events.js`

## 所属模块介绍

- 模块：`src/litegraph/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/litegraph/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 12 个文件，导出 24 项（AUTO 24 项），耦合强度 24。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src/litegraph`(24)。
> 主要导出：`canvasTextUtilsMethods`、`classUtilsMethods`、`fileUtilsMethods`、`legacyCompatMethods`、`loggingMethods`、`mathColorUtilsMethods`。
> 代表文件：`canvas-text-utils.js`、`class-utils.js`、`file-utils.js`。

- 导出项数量：2
- AUTO 说明数量：2

## 1. `setPointerEventsMethodsLiteGraph`

- 类型：`function`
- 位置：`src/litegraph/modules/pointer-events.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setPointerEventsMethodsLiteGraph`，定义于 `src/litegraph/modules/pointer-events.js`。

- 代码片段（L3-L8）：
```js
export function setPointerEventsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const pointerEventsMethods = {
applyPointerDefaults() {
```

## 2. `pointerEventsMethods`

- 类型：`variable`
- 位置：`src/litegraph/modules/pointer-events.js:7-68` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `pointerEventsMethods`（const），定义于 `src/litegraph/modules/pointer-events.js`。

- 代码片段（L7-L26）：
```js
export const pointerEventsMethods = {
applyPointerDefaults() {
        if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
            return;
        }
        const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
        if (isCoarsePointer) {
            this.dialog_close_on_mouse_leave = false;
            this.search_hide_on_mouse_leave = false;
        }
    },

resolvePointerEventName(event_name) {
        if (typeof event_name !== "string") {
            return event_name;
        }

        const normalized_event_name = event_name.toLowerCase();
        const mode = this.pointerevents_method;
        if (mode === "mouse") {
```

> 片段已按最大行数裁剪。
