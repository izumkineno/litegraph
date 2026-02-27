# 文件文档：`src/litegraph/modules/canvas-text-utils.js`

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

## 1. `setCanvasTextUtilsMethodsLiteGraph`

- 类型：`function`
- 位置：`src/litegraph/modules/canvas-text-utils.js:3-5` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `setCanvasTextUtilsMethodsLiteGraph`，定义于 `src/litegraph/modules/canvas-text-utils.js`。

- 代码片段（L3-L8）：
```js
export function setCanvasTextUtilsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const canvasTextUtilsMethods = {
canvasFillTextMultiline(context, text, x, y, maxWidth, lineHeight) {
```

## 2. `canvasTextUtilsMethods`

- 类型：`variable`
- 位置：`src/litegraph/modules/canvas-text-utils.js:7-35` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `canvasTextUtilsMethods`（const），定义于 `src/litegraph/modules/canvas-text-utils.js`。

- 代码片段（L7-L26）：
```js
export const canvasTextUtilsMethods = {
canvasFillTextMultiline(context, text, x, y, maxWidth, lineHeight) {
        var words = (text+"").trim().split(' ');
        var line = '';
        var ret = {lines: [], maxW: 0, height: 0};
        if (words.length>1) {
            for(var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    context.fillText(line, x, y+(lineHeight*ret.lines.length));
                    line = words[n] + ' ';
                    // y += lineHeight;
                    ret.max = testWidth;
                    ret.lines.push(line);
                }else{
                    line = testLine;
                }
            }
```

> 片段已按最大行数裁剪。
