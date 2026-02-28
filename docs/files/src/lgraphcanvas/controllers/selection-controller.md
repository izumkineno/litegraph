# 文件文档：`src/lgraphcanvas/controllers/selection-controller.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/controllers`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/controllers` 的职责为：控制器层，负责将宿主行为路由到具体功能模块。
> 规模：包含 7 个文件，导出 7 项（AUTO 5 项），耦合强度 29。
> 关键耦合：出边 `src/lgraphcanvas/modules`(20)；入边 `src/lgraphcanvas`(8)、`src`(1)。
> 主要导出：`CoreController`、`createLGraphCanvasControllers`、`EventsController`、`RenderController`、`SelectionController`、`UiController`。
> 代表文件：`core-controller.js`、`events-controller.js`、`index.js`。

- 导出项数量：1
- AUTO 说明数量：1

## 1. `SelectionController`

- 类型：`class`
- 位置：`src/lgraphcanvas/controllers/selection-controller.js:3-52` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出类 `SelectionController`，定义于 `src/lgraphcanvas/controllers/selection-controller.js`。

- 代码片段（L3-L22）：
```js
export class SelectionController {
    constructor(host) {
        this.host = host;
    }

    copyToClipboard(...args) {
        return selection_clipboard.copyToClipboard.apply(this.host, args);
    }

    pasteFromClipboard(...args) {
        return selection_clipboard.pasteFromClipboard.apply(this.host, args);
    }

    processNodeDblClicked(...args) {
        return selection_clipboard.processNodeDblClicked.apply(this.host, args);
    }

    processNodeSelected(...args) {
        return selection_clipboard.processNodeSelected.apply(this.host, args);
    }
```

> 片段已按最大行数裁剪。
