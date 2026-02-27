# 文件文档：`src/lgraph/shared/options.js`

## 所属模块介绍

- 模块：`src/lgraph/shared`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraph/shared` 的职责为：共享支撑层，提供默认配置与复用工具。
> 规模：包含 2 个文件，导出 2 项（AUTO 2 项），耦合强度 2。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src/lgraph/modules`(2)。
> 主要导出：`initializeGraphState`、`mergeOptions`。
> 代表文件：`initializers.js`、`options.js`。

- 导出项数量：1
- AUTO 说明数量：1

## 1. `mergeOptions`

- 类型：`function`
- 位置：`src/lgraph/shared/options.js:1-3` (`#L1`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `mergeOptions`，定义于 `src/lgraph/shared/options.js`。

- 代码片段（L1-L4）：
```js
export function mergeOptions(defaults, overrides) {
    return Object.assign({}, defaults, overrides);
}

```
