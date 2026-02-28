# Core Library Sequence Diagrams

> 范围：仅 `src/**` 核心库调用链，不包含 `editor/**`。

## 1) 初始化与渲染模式解析（用户 -> Canvas -> Adapter）

```mermaid
sequenceDiagram
    actor User as 用户代码
    box 用户与图模型层
        participant G as src/lgraph.js::LGraph.constructor
        participant GC as src/lgraph/modules/canvas-binding.js::attachCanvas/change
    end
    box Core 委托与控制器层
        participant C as src/lgraphcanvas.js::LGraphCanvas.constructor
        participant D as src/lgraphcanvas/install-delegates.js::installLGraphCanvasDelegates
        participant Core as src/lgraphcanvas/controllers/core-controller.js::setCanvas
    end
    box 模式与生命周期模块层
        participant Life as src/lgraphcanvas/modules/lifecycle.ts::setCanvas
        participant Mode as src/lgraphcanvas/modes/resolve-render-mode.ts::resolveRenderMode
        participant LeaferMode as src/lgraphcanvas/modes/forms/leafer/leafer-mode.ts::createLeaferModeRuntime
        participant LegacyMode as src/lgraphcanvas/modes/forms/legacy/legacy-mode.ts::createLegacyModeRuntime
    end
    box 渲染底层适配层
        participant Adapter as src/lgraphcanvas/renderer/{canvas2d-adapter.js|leafer-ui-adapter.ts}
        participant Surface as src/lgraphcanvas/renderer/surfaces.ts::{Canvas2DSurface,LeaferSurface}
    end

    User->>G: new LGraph()
    User->>C: new LGraphCanvas(canvas, graph, options)
    C->>D: 安装委托方法
    C->>C: createLGraphCanvasControllers()
    C->>Core: setCanvas(canvas, skip_events)
    Core->>Life: setCanvas(...)
    Life->>Mode: resolveRenderMode(this)
    alt form=leafer
        Mode->>LeaferMode: createLeaferModeRuntime(...)
    else form=legacy
        Mode->>LegacyMode: createLegacyModeRuntime(...)
    end
    Life->>Adapter: init({canvas, ownerDocument})
    Adapter->>Surface: 创建 front/back surface + ctx
    Life->>Life: 回写 this.canvas/bgcanvas/ctx/bgctx
    Life->>Life: bindEvents()
    C->>G: setGraph(graph)
    G->>GC: attachCanvas(canvas)
    GC->>C: graph 引用绑定完成
```

## 2) 用户交互链（Pointer/Keyboard -> 命中与脏标记）

```mermaid
sequenceDiagram
    actor User as 用户输入
    box 输入设备层
        participant Canvas as HTMLCanvasElement
    end
    box Core 委托与控制器层
        participant C as src/lgraphcanvas.js::LGraphCanvas(委托入口)
        participant EventsCtl as src/lgraphcanvas/controllers/events-controller.js
        participant CoreCtl as src/lgraphcanvas/controllers/core-controller.js::{bringToFront,setDirty}
    end
    box 事件模块层
        participant Pointer as src/lgraphcanvas/modules/events-pointer.js::{processMouseDown,processMouseMove,processMouseUp}
        participant KeyDrop as src/lgraphcanvas/modules/events-keyboard-drop.js::{processKey,processDrop}
    end
    box 图模型通知层
        participant Graph as src/lgraph.js::LGraph
        participant Binding as src/lgraph/modules/canvas-binding.js::{change,setDirtyCanvas,sendActionToCanvas}
    end

    User->>Canvas: pointerdown / move / up / wheel / keydown
    Canvas->>C: 委托方法触发
    C->>EventsCtl: processMouseDown/Move/Up 或 processKey
    alt Pointer 事件
        EventsCtl->>Pointer: processMouseDown(e)
        Pointer->>CoreCtl: bringToFront(node) / select / connect / drag
        Pointer->>C: setDirty(true, true) 或 draw()
    else 键盘/拖放
        EventsCtl->>KeyDrop: processKey/processDrop
        KeyDrop->>Graph: delete/copy/paste/新增节点等
    end
    Graph->>Binding: change() / setDirtyCanvas()
    Binding->>C: sendActionToCanvas("setDirty", [fg,bg])
```

## 3) 执行与渲染主链（Graph Step -> Frame -> Nodes/Links -> 底层 Context）

```mermaid
sequenceDiagram
    actor User as 用户操作(开始/下一步)
    box 图执行层
        participant Runtime as src/lgraph/modules/runtime-loop.js::{start,runStep}
        participant Graph as src/lgraph.js::LGraph
        participant Binding as src/lgraph/modules/canvas-binding.js::change
    end
    box Core 委托与控制器层
        participant C as src/lgraphcanvas.js::LGraphCanvas(委托入口)
        participant CoreCtl as src/lgraphcanvas/controllers/core-controller.js::startRendering
        participant RenderCtl as src/lgraphcanvas/controllers/render-controller.ts
    end
    box 渲染模块层
        participant Life as src/lgraphcanvas/modules/lifecycle.ts::startRendering
        participant Frame as src/lgraphcanvas/modules/render-frame.ts::{draw,drawBackCanvas,drawFrontCanvas}
        participant Back as src/lgraphcanvas/modules/render-background-groups.js::drawBackCanvas
        participant Nodes as src/lgraphcanvas/modules/render-nodes.ts::{beginNodeFrameLeafer,drawNode,endNodeFrameLeafer}
        participant Links as src/lgraphcanvas/modules/render-links.js::{drawConnections,renderLink}
    end
    box 渲染底层适配层
        participant Adapter as src/lgraphcanvas/renderer/{canvas2d-adapter.js|leafer-ui-adapter.ts}
        participant Ctx as Canvas2D/Leafer Context
    end

    User->>Runtime: graph.start() / graph.runStep()
    Runtime->>Graph: node.doExecute()
    Graph->>Binding: change()
    Binding->>C: setDirty(true, true)
    C->>CoreCtl: startRendering()
    CoreCtl->>Life: requestAnimationFrame 循环
    Life->>RenderCtl: draw()
    RenderCtl->>Frame: draw(force_canvas, force_bgcanvas)
    Frame->>Back: drawBackCanvas()
    Frame->>Adapter: beginFrame("front")
    Frame->>Frame: computeVisibleNodes()
    alt Leafer 节点帧启用
        Frame->>Nodes: beginNodeFrameLeafer(ctx, visibleNodes)
        loop 每个可见节点
            Frame->>Nodes: drawNode(node, ctx)
        end
        Frame->>Nodes: endNodeFrameLeafer(ctx, visibleNodes)
    else Legacy 节点路径
        loop 每个可见节点
            Frame->>Ctx: save + translate(node.pos)
            Frame->>Nodes: drawNode(node, ctx)
            Frame->>Ctx: restore
        end
    end
    Frame->>Links: drawConnections(ctx) / renderLink(...)
    Frame->>Adapter: syncLayer("front") + endFrame("front")
    Adapter->>Ctx: drawImage / blitBackToFront / 原生刷新
```
