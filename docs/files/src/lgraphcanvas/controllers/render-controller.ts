# 文件文档：`src/lgraphcanvas/controllers/render-controller.ts`

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
- AUTO 说明数量：0

## 1. `RenderController`

- 类型：`class`
- 位置：`src/lgraphcanvas/controllers/render-controller.ts:8-109` (`#L8`)
- 说明来源：源码注释
- 说明：
> 中文说明：RenderController 为迁移后的 TS 导出类，封装 Leafer 渲染相关能力。

- 代码片段（L8-L27）：
```js
export class RenderController {
    constructor(host) {
        this.host = host;
    }

    draw(...args) {
        return render_frame.draw.apply(this.host, args);
    }

    drawFrontCanvas(...args) {
        return render_frame.drawFrontCanvas.apply(this.host, args);
    }

    lowQualityRenderingRequired(...args) {
        return render_frame.lowQualityRenderingRequired.apply(this.host, args);
    }

    beginNodeFrameLeafer(...args) {
        return render_nodes.beginNodeFrameLeafer.apply(this.host, args);
    }
```

> 片段已按最大行数裁剪。
