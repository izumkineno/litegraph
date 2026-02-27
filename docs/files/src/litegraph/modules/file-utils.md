# 文件文档：`src/litegraph/modules/file-utils.js`

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

## 1. `setFileUtilsMethodsLiteGraph`

- 类型：`function`
- 位置：`src/litegraph/modules/file-utils.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setFileUtilsMethodsLiteGraph`，定义于 `src/litegraph/modules/file-utils.js`。

- 代码片段（L3-L8）：
```js
export function setFileUtilsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const fileUtilsMethods = {
fetchFile( url, type, on_complete, on_error ) {
```

## 2. `fileUtilsMethods`

- 类型：`variable`
- 位置：`src/litegraph/modules/file-utils.js:7-57` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `fileUtilsMethods`（const），定义于 `src/litegraph/modules/file-utils.js`。

- 代码片段（L7-L26）：
```js
export const fileUtilsMethods = {
fetchFile( url, type, on_complete, on_error ) {
        if(!url)
            return null;

        type = type || "text";
        if( url.constructor === String ) {
            if (url.substr(0, 4) == "http" && LiteGraph.proxy) {
                url = LiteGraph.proxy + url.substr(url.indexOf(":") + 3);
            }
            return fetch(url)
                .then((response) => {
                    if(!response.ok)
                        throw new Error("File not found"); // it will be catch below
                    if(type == "arraybuffer")
                        return response.arrayBuffer();
                    else if(type == "text" || type == "string")
                        return response.text();
                    else if(type == "json")
                        return response.json();
```

> 片段已按最大行数裁剪。
