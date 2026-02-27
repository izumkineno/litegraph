# 文件文档：`src/lgraphcanvas/controllers/ui-controller.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/controllers`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/controllers` 的职责为：控制器层，负责将宿主行为路由到具体功能模块。
> 规模：包含 6 个文件，导出 6 项（AUTO 6 项），耦合强度 33。
> 关键耦合：出边 `src/lgraphcanvas/modules`(24)；入边 `src/lgraphcanvas`(8)、`src`(1)。
> 主要导出：`CoreController`、`createLGraphCanvasControllers`、`EventsController`、`RenderController`、`SelectionController`、`UiController`。
> 代表文件：`core-controller.js`、`events-controller.js`、`index.js`。

- 导出项数量：1
- AUTO 说明数量：1

## 1. `UiController`

- 类型：`class`
- 位置：`src/lgraphcanvas/controllers/ui-controller.js:4-81` (`#L4`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出类 `UiController`，定义于 `src/lgraphcanvas/controllers/ui-controller.js`。

- 代码片段（L4-L23）：
```js
export class UiController {
    constructor(host) {
        this.host = host;
    }

    showLinkMenu(...args) {
        return ui_menus.showLinkMenu.apply(this.host, args);
    }

    createDefaultNodeForSlot(...args) {
        return ui_menus.createDefaultNodeForSlot.apply(this.host, args);
    }

    showConnectionMenu(...args) {
        return ui_menus.showConnectionMenu.apply(this.host, args);
    }

    getCanvasMenuOptions(...args) {
        return ui_menus.getCanvasMenuOptions.apply(this.host, args);
    }
```

> 片段已按最大行数裁剪。
