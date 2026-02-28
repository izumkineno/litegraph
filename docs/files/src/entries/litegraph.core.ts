# 文件文档：`src/entries/litegraph.core.ts`

## 所属模块介绍

- 模块：`src/entries`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/entries` 的职责为：入口聚合层，对外暴露可消费的模块入口。
> 规模：包含 8 个文件，导出 16 项（AUTO 16 项），耦合强度 40。
> 关键耦合：出边 `src/nodes`(40)；入边 低耦合/未发现内部上游依赖。
> 主要导出：`ContextMenu`、`DragAndScale`、`LGraph`、`LGraphCanvas`、`LGraphGroup`、`LGraphNode`。
> 代表文件：`litegraph.core.js`、`litegraph.core.ts`、`litegraph.nodes.base.js`。

- 导出项数量：8
- AUTO 说明数量：8

## 1. `LiteGraph`

- 类型：`re_export_named`
- 位置：`src/entries/litegraph.core.ts:8-8` (`#L8`)
- 转发来源：`../litegraph.ts`
- 目标文件：`src/litegraph.ts` (24-51)
- 可解析导出数量：1
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 命名转发导出 `LiteGraph`，来源 `../litegraph.ts`。

- 代码片段（L8-L13）：
```js
export { LiteGraph } from "../litegraph.ts";
export { LGraph } from "../lgraph.js";
export { LGraphCanvas } from "../lgraphcanvas.js";
export { LGraphGroup } from "../lgraphgroup.js";
export { LGraphNode } from "../lgraphnode.js";
export { LLink } from "../llink.js";
```

## 2. `LGraph`

- 类型：`re_export_named`
- 位置：`src/entries/litegraph.core.ts:9-9` (`#L9`)
- 转发来源：`../lgraph.js`
- 目标文件：`src/lgraph.js` (11-32)
- 可解析导出数量：2
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 命名转发导出 `LGraph`，来源 `../lgraph.js`。

- 代码片段（L9-L14）：
```js
export { LGraph } from "../lgraph.js";
export { LGraphCanvas } from "../lgraphcanvas.js";
export { LGraphGroup } from "../lgraphgroup.js";
export { LGraphNode } from "../lgraphnode.js";
export { LLink } from "../llink.js";
export { ContextMenu } from "../contextmenu.js";
```

## 3. `LGraphCanvas`

- 类型：`re_export_named`
- 位置：`src/entries/litegraph.core.ts:10-10` (`#L10`)
- 转发来源：`../lgraphcanvas.js`
- 目标文件：`src/lgraphcanvas.js` (7-147)
- 可解析导出数量：1
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 命名转发导出 `LGraphCanvas`，来源 `../lgraphcanvas.js`。

- 代码片段（L10-L15）：
```js
export { LGraphCanvas } from "../lgraphcanvas.js";
export { LGraphGroup } from "../lgraphgroup.js";
export { LGraphNode } from "../lgraphnode.js";
export { LLink } from "../llink.js";
export { ContextMenu } from "../contextmenu.js";
export { DragAndScale } from "../dragandscale.js";
```

## 4. `LGraphGroup`

- 类型：`re_export_named`
- 位置：`src/entries/litegraph.core.ts:11-11` (`#L11`)
- 转发来源：`../lgraphgroup.js`
- 目标文件：`src/lgraphgroup.js` (3-118)
- 可解析导出数量：1
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 命名转发导出 `LGraphGroup`，来源 `../lgraphgroup.js`。

- 代码片段（L11-L16）：
```js
export { LGraphGroup } from "../lgraphgroup.js";
export { LGraphNode } from "../lgraphnode.js";
export { LLink } from "../llink.js";
export { ContextMenu } from "../contextmenu.js";
export { DragAndScale } from "../dragandscale.js";

```

## 5. `LGraphNode`

- 类型：`re_export_named`
- 位置：`src/entries/litegraph.core.ts:12-12` (`#L12`)
- 转发来源：`../lgraphnode.js`
- 目标文件：`src/lgraphnode.js` (61-102)
- 可解析导出数量：2
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 命名转发导出 `LGraphNode`，来源 `../lgraphnode.js`。

- 代码片段（L12-L17）：
```js
export { LGraphNode } from "../lgraphnode.js";
export { LLink } from "../llink.js";
export { ContextMenu } from "../contextmenu.js";
export { DragAndScale } from "../dragandscale.js";


```

## 6. `LLink`

- 类型：`re_export_named`
- 位置：`src/entries/litegraph.core.ts:13-13` (`#L13`)
- 转发来源：`../llink.js`
- 目标文件：`src/llink.js` (5-64)
- 可解析导出数量：1
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 命名转发导出 `LLink`，来源 `../llink.js`。

- 代码片段（L13-L18）：
```js
export { LLink } from "../llink.js";
export { ContextMenu } from "../contextmenu.js";
export { DragAndScale } from "../dragandscale.js";



```

## 7. `ContextMenu`

- 类型：`re_export_named`
- 位置：`src/entries/litegraph.core.ts:14-14` (`#L14`)
- 转发来源：`../contextmenu.js`
- 目标文件：`src/contextmenu.js` (22-144)
- 可解析导出数量：1
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 命名转发导出 `ContextMenu`，来源 `../contextmenu.js`。

- 代码片段（L14-L19）：
```js
export { ContextMenu } from "../contextmenu.js";
export { DragAndScale } from "../dragandscale.js";




```

## 8. `DragAndScale`

- 类型：`re_export_named`
- 位置：`src/entries/litegraph.core.ts:15-15` (`#L15`)
- 转发来源：`../dragandscale.js`
- 目标文件：`src/dragandscale.js` (7-244)
- 可解析导出数量：1
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 命名转发导出 `DragAndScale`，来源 `../dragandscale.js`。

- 代码片段（L14-L19）：
```js
export { ContextMenu } from "../contextmenu.js";
export { DragAndScale } from "../dragandscale.js";




```
