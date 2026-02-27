# 文件文档：`src/litegraph/modules/object-utils.js`

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

## 1. `setObjectUtilsMethodsLiteGraph`

- 类型：`function`
- 位置：`src/litegraph/modules/object-utils.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setObjectUtilsMethodsLiteGraph`，定义于 `src/litegraph/modules/object-utils.js`。

- 代码片段（L3-L8）：
```js
export function setObjectUtilsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const objectUtilsMethods = {
cloneObject(obj, target) {
```

## 2. `objectUtilsMethods`

- 类型：`variable`
- 位置：`src/litegraph/modules/object-utils.js:7-39` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `objectUtilsMethods`（const），定义于 `src/litegraph/modules/object-utils.js`。

- 代码片段（L7-L26）：
```js
export const objectUtilsMethods = {
cloneObject(obj, target) {
        if (obj == null) {
            return null;
        }

        const clonedObj = JSON.parse(JSON.stringify(obj));

        if (!target) {
            return clonedObj;
        }
        for (const key in clonedObj) {
            if (Object.prototype.hasOwnProperty.call(clonedObj, key)) {
                target[key] = clonedObj[key];
            }
        }
        return target;
    },

uuidv4() {
```

> 片段已按最大行数裁剪。
