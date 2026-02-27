# 文件文档：`src/litegraph/modules/slot-types.js`

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

## 1. `setSlotTypesMethodsLiteGraph`

- 类型：`function`
- 位置：`src/litegraph/modules/slot-types.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setSlotTypesMethodsLiteGraph`，定义于 `src/litegraph/modules/slot-types.js`。

- 代码片段（L3-L8）：
```js
export function setSlotTypesMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const slotTypesMethods = {
registerNodeAndSlotType(type, slot_type, out = false) {
```

## 2. `slotTypesMethods`

- 类型：`variable`
- 位置：`src/litegraph/modules/slot-types.js:7-63` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `slotTypesMethods`（const），定义于 `src/litegraph/modules/slot-types.js`。

- 代码片段（L7-L26）：
```js
export const slotTypesMethods = {
registerNodeAndSlotType(type, slot_type, out = false) {
        const base_class =
            type.constructor === String &&
            this.registered_node_types[type] !== "anonymous"
                ? this.registered_node_types[type]
                : type;

        const class_type = base_class.constructor.type;

        let allTypes = [];
        if (typeof slot_type === "string") {
            allTypes = slot_type.split(",");
        } else if (slot_type == this.EVENT || slot_type == this.ACTION) {
            allTypes = ["_event_"];
        } else {
            allTypes = ["*"];
        }

        for (let i = 0; i < allTypes.length; ++i) {
```

> 片段已按最大行数裁剪。
