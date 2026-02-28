# 文件文档：`src/lgraphcanvas/controllers/index.js`

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

## 1. `createLGraphCanvasControllers`

- 类型：`function`
- 位置：`src/lgraphcanvas/controllers/index.js:7-15` (`#L7`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `createLGraphCanvasControllers`，定义于 `src/lgraphcanvas/controllers/index.js`。

- 代码片段（L7-L15）：
```js
export function createLGraphCanvasControllers(host) {
    return {
        core: new CoreController(host),
        events: new EventsController(host),
        render: new RenderController(host),
        selection: new SelectionController(host),
        ui: new UiController(host),
    };
}
```
