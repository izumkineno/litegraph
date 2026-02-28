# 文件文档：`src/lgraphcanvas/controllers/core-controller.js`

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

## 1. `CoreController`

- 类型：`class`
- 位置：`src/lgraphcanvas/controllers/core-controller.js:5-130` (`#L5`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出类 `CoreController`，定义于 `src/lgraphcanvas/controllers/core-controller.js`。

- 代码片段（L5-L24）：
```js
export class CoreController {
    constructor(host) {
        this.host = host;
    }

    clear(...args) {
        return lifecycle.clear.apply(this.host, args);
    }

    setGraph(...args) {
        return lifecycle.setGraph.apply(this.host, args);
    }

    getTopGraph(...args) {
        return lifecycle.getTopGraph.apply(this.host, args);
    }

    openSubgraph(...args) {
        return lifecycle.openSubgraph.apply(this.host, args);
    }
```

> 片段已按最大行数裁剪。
