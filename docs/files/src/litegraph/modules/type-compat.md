# 文件文档：`src/litegraph/modules/type-compat.js`

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

## 1. `setTypeCompatMethodsLiteGraph`

- 类型：`function`
- 位置：`src/litegraph/modules/type-compat.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setTypeCompatMethodsLiteGraph`，定义于 `src/litegraph/modules/type-compat.js`。

- 代码片段（L3-L8）：
```js
export function setTypeCompatMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const typeCompatMethods = {
isValidConnection(type_a, type_b) {
```

## 2. `typeCompatMethods`

- 类型：`variable`
- 位置：`src/litegraph/modules/type-compat.js:7-36` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `typeCompatMethods`（const），定义于 `src/litegraph/modules/type-compat.js`。

- 代码片段（L7-L26）：
```js
export const typeCompatMethods = {
isValidConnection(type_a, type_b) {
        if (type_a === "" || type_a === "*") type_a = 0;
        if (type_b === "" || type_b === "*") type_b = 0;

        if (!type_a || !type_b || type_a === type_b || (type_a === LiteGraph.EVENT && type_b === LiteGraph.ACTION)) {
            return true;
        }

        type_a = String(type_a).toLowerCase();
        type_b = String(type_b).toLowerCase();

        if (!type_a.includes(",") && !type_b.includes(",")) {
            return type_a === type_b;
        }

        const supported_types_a = type_a.split(",");
        const supported_types_b = type_b.split(",");

        for (const supported_type_a of supported_types_a) {
```

> 片段已按最大行数裁剪。
