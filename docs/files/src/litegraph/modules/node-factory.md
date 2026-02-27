# 文件文档：`src/litegraph/modules/node-factory.js`

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

## 1. `setNodeFactoryMethodsLiteGraph`

- 类型：`function`
- 位置：`src/litegraph/modules/node-factory.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setNodeFactoryMethodsLiteGraph`，定义于 `src/litegraph/modules/node-factory.js`。

- 代码片段（L3-L8）：
```js
export function setNodeFactoryMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const nodeFactoryMethods = {
buildNodeClassFromObject(
```

## 2. `nodeFactoryMethods`

- 类型：`variable`
- 位置：`src/litegraph/modules/node-factory.js:7-155` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `nodeFactoryMethods`（const），定义于 `src/litegraph/modules/node-factory.js`。

- 代码片段（L7-L26）：
```js
export const nodeFactoryMethods = {
buildNodeClassFromObject(
        name,
        object,
    ) {
        var ctor_code = "";
        if(object.inputs)
            for(let i=0; i < object.inputs.length; ++i) {
                let _name = object.inputs[i][0];
                let _type = object.inputs[i][1];
                if(_type && _type.constructor === String)
                    _type = '"'+_type+'"';
                ctor_code += "this.addInput('"+_name+"',"+_type+");\n";
            }
        if(object.outputs)
            for(let i=0; i < object.outputs.length; ++i) {
                let _name = object.outputs[i][0];
                let _type = object.outputs[i][1];
                if(_type && _type.constructor === String)
                    _type = '"'+_type+'"';
```

> 片段已按最大行数裁剪。
