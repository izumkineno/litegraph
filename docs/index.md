# LiteGraph Markdown 文档索引

- 覆盖文件数：132
- 导出项总数：306
- AUTO 说明总数：214

## 模块总览

| 模块 | 文件数 | 导出数 | AUTO | 主要耦合 | 文档链接 |
| --- | ---: | ---: | ---: | --- | --- |
| `src` | 10 | 12 | 5 | 出: `src/contextmenu/modules`(9)、`src/litegraph/shared`(4)、`src/lgraphcanvas/renderer`(3)；入: `src/lgraphcanvas/modules`(21)、`src/lgraphcanvas/renderer`(1) | [首文件](./files/src/contextmenu.md) |
| `src/contextmenu/modules` | 9 | 16 | 16 | 出: 低耦合；入: `src`(9) | [首文件](./files/src/contextmenu/modules/close-flow.md) |
| `src/entries` | 8 | 16 | 16 | 出: `src/nodes`(40)；入: 低耦合 | [首文件](./files/src/entries/litegraph.core.md) |
| `src/lgraph` | 1 | 1 | 1 | 出: `src/lgraph/modules`(20)；入: `src`(1) | [首文件](./files/src/lgraph/install-delegates.md) |
| `src/lgraph/modules` | 10 | 20 | 20 | 出: `src/lgraph/shared`(2)；入: `src/lgraph`(20) | [首文件](./files/src/lgraph/modules/canvas-binding.md) |
| `src/lgraph/shared` | 2 | 2 | 2 | 出: 低耦合；入: `src/lgraph/modules`(2) | [首文件](./files/src/lgraph/shared/initializers.md) |
| `src/lgraphcanvas` | 1 | 1 | 1 | 出: `src/lgraphcanvas/controllers`(8)；入: `src`(1) | [首文件](./files/src/lgraphcanvas/install-delegates.md) |
| `src/lgraphcanvas/controllers` | 7 | 7 | 5 | 出: `src/lgraphcanvas/modules`(20)；入: `src/lgraphcanvas`(8)、`src`(1) | [首文件](./files/src/lgraphcanvas/controllers/core-controller.md) |
| `src/lgraphcanvas/modules` | 16 | 120 | 84 | 出: `src`(21)、`src/lgraphcanvas/shared`(3)、`src/lgraphcanvas/renderer`(2)；入: `src/lgraphcanvas/controllers`(20)、`src`(1) | [首文件](./files/src/lgraphcanvas/modules/events-keyboard-drop.md) |
| `src/lgraphcanvas/renderer` | 8 | 14 | 4 | 出: `src/lgraphcanvas/renderer/leafer-components`(2)、`src`(1)；入: `src`(3)、`src/lgraphcanvas/modules`(2) | [首文件](./files/src/lgraphcanvas/renderer/canvas2d-adapter.md) |
| `src/lgraphcanvas/renderer/leafer-components` | 30 | 38 | 1 | 出: 低耦合；入: `src/lgraphcanvas/renderer`(2) | [首文件](./files/src/lgraphcanvas/renderer/leafer-components/node-shell.md) |
| `src/lgraphcanvas/shared` | 1 | 7 | 7 | 出: 低耦合；入: `src/lgraphcanvas/modules`(3) | [首文件](./files/src/lgraphcanvas/shared/scratch.md) |
| `src/lgraphnode` | 1 | 1 | 1 | 出: `src/lgraphnode/modules`(22)；入: `src`(1) | [首文件](./files/src/lgraphnode/install-delegates.md) |
| `src/lgraphnode/modules` | 11 | 22 | 22 | 出: 低耦合；入: `src/lgraphnode`(22) | [首文件](./files/src/lgraphnode/modules/ancestor-refresh.md) |
| `src/litegraph` | 1 | 1 | 1 | 出: `src/litegraph/modules`(24)；入: `src`(1) | [首文件](./files/src/litegraph/install-delegates.md) |
| `src/litegraph/modules` | 12 | 24 | 24 | 出: 低耦合；入: `src/litegraph`(24) | [首文件](./files/src/litegraph/modules/canvas-text-utils.md) |
| `src/litegraph/shared` | 4 | 4 | 4 | 出: 低耦合；入: `src`(4) | [首文件](./files/src/litegraph/shared/defaults-behavior.md) |

### 模块介绍详情

#### `src`

- 来源：模块顶部注释
- 注释文件：`src/llink.js`
- 介绍：
> Class representing a link object that stores link information between two nodes.

#### `src/contextmenu/modules`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/contextmenu/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 9 个文件，导出 16 项（AUTO 16 项），耦合强度 9。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src`(9)。
> 主要导出：`addContextMenuItems`、`appendContextMenuRoot`、`bindContextMenuRootEvents`、`calculateContextMenuBestPosition`、`closeAllContextMenus`、`closeContextMenuInstance`。
> 代表文件：`close-flow.js`、`filtering.js`、`item-actions.js`。

#### `src/entries`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/entries` 的职责为：入口聚合层，对外暴露可消费的模块入口。
> 规模：包含 8 个文件，导出 16 项（AUTO 16 项），耦合强度 40。
> 关键耦合：出边 `src/nodes`(40)；入边 低耦合/未发现内部上游依赖。
> 主要导出：`ContextMenu`、`DragAndScale`、`LGraph`、`LGraphCanvas`、`LGraphGroup`、`LGraphNode`。
> 代表文件：`litegraph.core.js`、`litegraph.core.ts`、`litegraph.nodes.base.js`。

#### `src/lgraph`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraph` 的职责为：模块化源码目录，承载同一子域下的实现。
> 规模：包含 1 个文件，导出 1 项（AUTO 1 项），耦合强度 21。
> 关键耦合：出边 `src/lgraph/modules`(20)；入边 `src`(1)。
> 主要导出：`installLGraphDelegates`。
> 代表文件：`install-delegates.js`。

#### `src/lgraph/modules`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraph/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 10 个文件，导出 20 项（AUTO 20 项），耦合强度 22。
> 关键耦合：出边 `src/lgraph/shared`(2)；入边 `src/lgraph`(20)。
> 主要导出：`canvasBindingMethods`、`executionOrderMethods`、`graphEventsMethods`、`graphPortsMethods`、`historyMethods`、`lifecycleMethods`。
> 代表文件：`canvas-binding.js`、`execution-order.js`、`graph-events.js`。

#### `src/lgraph/shared`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraph/shared` 的职责为：共享支撑层，提供默认配置与复用工具。
> 规模：包含 2 个文件，导出 2 项（AUTO 2 项），耦合强度 2。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src/lgraph/modules`(2)。
> 主要导出：`initializeGraphState`、`mergeOptions`。
> 代表文件：`initializers.js`、`options.js`。

#### `src/lgraphcanvas`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas` 的职责为：模块化源码目录，承载同一子域下的实现。
> 规模：包含 1 个文件，导出 1 项（AUTO 1 项），耦合强度 9。
> 关键耦合：出边 `src/lgraphcanvas/controllers`(8)；入边 `src`(1)。
> 主要导出：`installLGraphCanvasDelegates`。
> 代表文件：`install-delegates.js`。

#### `src/lgraphcanvas/controllers`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/controllers` 的职责为：控制器层，负责将宿主行为路由到具体功能模块。
> 规模：包含 7 个文件，导出 7 项（AUTO 5 项），耦合强度 29。
> 关键耦合：出边 `src/lgraphcanvas/modules`(20)；入边 `src/lgraphcanvas`(8)、`src`(1)。
> 主要导出：`CoreController`、`createLGraphCanvasControllers`、`EventsController`、`RenderController`、`SelectionController`、`UiController`。
> 代表文件：`core-controller.js`、`events-controller.js`、`index.js`。

#### `src/lgraphcanvas/modules`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 16 个文件，导出 120 项（AUTO 84 项），耦合强度 47。
> 关键耦合：出边 `src`(21)、`src/lgraphcanvas/shared`(3)、`src/lgraphcanvas/renderer`(2)；入边 `src/lgraphcanvas/controllers`(20)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

#### `src/lgraphcanvas/renderer`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/renderer` 的职责为：模块化源码目录，承载同一子域下的实现。
> 规模：包含 8 个文件，导出 14 项（AUTO 4 项），耦合强度 8。
> 关键耦合：出边 `src/lgraphcanvas/renderer/leafer-components`(2)、`src`(1)；入边 `src`(3)、`src/lgraphcanvas/modules`(2)。
> 主要导出：`applyRenderContextCompatAliases`、`Canvas2DAdapter`、`Canvas2DRendererAdapter`、`Canvas2DSurface`、`LeaferAdapter`、`LeaferNodeUiLayer`。
> 代表文件：`canvas2d-adapter.js`、`contracts.js`、`leafer-node-ui-layer.js`。

#### `src/lgraphcanvas/renderer/leafer-components`

- 来源：模块顶部注释
- 注释文件：`src/lgraphcanvas/renderer/leafer-components/text-layout.ts`
- 介绍：
> 中文说明：scaledFontSize 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。

#### `src/lgraphcanvas/shared`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/shared` 的职责为：共享支撑层，提供默认配置与复用工具。
> 规模：包含 1 个文件，导出 7 项（AUTO 7 项），耦合强度 3。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src/lgraphcanvas/modules`(3)。
> 主要导出：`link_bounding`、`margin_area`、`temp`、`temp_vec2`、`tempA`、`tempB`。
> 代表文件：`scratch.js`。

#### `src/lgraphnode`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphnode` 的职责为：模块化源码目录，承载同一子域下的实现。
> 规模：包含 1 个文件，导出 1 项（AUTO 1 项），耦合强度 23。
> 关键耦合：出边 `src/lgraphnode/modules`(22)；入边 `src`(1)。
> 主要导出：`installLGraphNodeDelegates`。
> 代表文件：`install-delegates.js`。

#### `src/lgraphnode/modules`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphnode/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 11 个文件，导出 22 项（AUTO 22 项），耦合强度 22。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src/lgraphnode`(22)。
> 主要导出：`ancestorRefreshMethods`、`canvasIntegrationMethods`、`connectionsMethods`、`executionActionsMethods`、`geometryHitMethods`、`ioDataMethods`。
> 代表文件：`ancestor-refresh.js`、`canvas-integration.js`、`connections.js`。

#### `src/litegraph`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/litegraph` 的职责为：模块化源码目录，承载同一子域下的实现。
> 规模：包含 1 个文件，导出 1 项（AUTO 1 项），耦合强度 25。
> 关键耦合：出边 `src/litegraph/modules`(24)；入边 `src`(1)。
> 主要导出：`installLiteGraphDelegates`。
> 代表文件：`install-delegates.js`。

#### `src/litegraph/modules`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/litegraph/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 12 个文件，导出 24 项（AUTO 24 项），耦合强度 24。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src/litegraph`(24)。
> 主要导出：`canvasTextUtilsMethods`、`classUtilsMethods`、`fileUtilsMethods`、`legacyCompatMethods`、`loggingMethods`、`mathColorUtilsMethods`。
> 代表文件：`canvas-text-utils.js`、`class-utils.js`、`file-utils.js`。

#### `src/litegraph/shared`

- 来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/litegraph/shared` 的职责为：共享支撑层，提供默认配置与复用工具。
> 规模：包含 4 个文件，导出 4 项（AUTO 4 项），耦合强度 4。
> 关键耦合：出边 低耦合/未发现内部下游依赖；入边 `src`(4)。
> 主要导出：`applyBehaviorDefaults`、`applyCoreDefaults`、`applySlotsDefaults`、`applyUiDefaults`。
> 代表文件：`defaults-behavior.js`、`defaults-core.js`、`defaults-slots.js`。

## src

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/contextmenu.js` | [查看](./files/src/contextmenu.md) | 1 | 1 |
| `src/curveeditor.js` | [查看](./files/src/curveeditor.md) | 1 | 0 |
| `src/dragandscale.js` | [查看](./files/src/dragandscale.md) | 1 | 0 |
| `src/lgraph.js` | [查看](./files/src/lgraph.md) | 2 | 1 |
| `src/lgraphcanvas.js` | [查看](./files/src/lgraphcanvas.md) | 1 | 1 |
| `src/lgraphgroup.js` | [查看](./files/src/lgraphgroup.md) | 1 | 1 |
| `src/lgraphnode.js` | [查看](./files/src/lgraphnode.md) | 2 | 1 |
| `src/litegraph.js` | [查看](./files/src/litegraph.md) | 1 | 0 |
| `src/litegraph.ts` | [查看](./files/src/litegraph.ts) | 1 | 0 |
| `src/llink.js` | [查看](./files/src/llink.md) | 1 | 0 |

## src/contextmenu/modules

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/contextmenu/modules/close-flow.js` | [查看](./files/src/contextmenu/modules/close-flow.md) | 1 | 1 |
| `src/contextmenu/modules/filtering.js` | [查看](./files/src/contextmenu/modules/filtering.md) | 1 | 1 |
| `src/contextmenu/modules/item-actions.js` | [查看](./files/src/contextmenu/modules/item-actions.md) | 1 | 1 |
| `src/contextmenu/modules/options.js` | [查看](./files/src/contextmenu/modules/options.md) | 1 | 1 |
| `src/contextmenu/modules/parenting-validation.js` | [查看](./files/src/contextmenu/modules/parenting-validation.md) | 2 | 2 |
| `src/contextmenu/modules/positioning.js` | [查看](./files/src/contextmenu/modules/positioning.md) | 1 | 1 |
| `src/contextmenu/modules/root-dom.js` | [查看](./files/src/contextmenu/modules/root-dom.md) | 5 | 5 |
| `src/contextmenu/modules/root-events.js` | [查看](./files/src/contextmenu/modules/root-events.md) | 1 | 1 |
| `src/contextmenu/modules/statics.js` | [查看](./files/src/contextmenu/modules/statics.md) | 3 | 3 |

## src/entries

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/entries/litegraph.core.js` | [查看](./files/src/entries/litegraph.core.md) | 8 | 8 |
| `src/entries/litegraph.core.ts` | [查看](./files/src/entries/litegraph.core.ts) | 8 | 8 |
| `src/entries/litegraph.nodes.base.js` | [查看](./files/src/entries/litegraph.nodes.base.md) | 0 | 0 |
| `src/entries/litegraph.nodes.base.ts` | [查看](./files/src/entries/litegraph.nodes.base.ts) | 0 | 0 |
| `src/entries/litegraph.nodes.feature.js` | [查看](./files/src/entries/litegraph.nodes.feature.md) | 0 | 0 |
| `src/entries/litegraph.nodes.feature.ts` | [查看](./files/src/entries/litegraph.nodes.feature.ts) | 0 | 0 |
| `src/entries/litegraph.nodes.webgl.js` | [查看](./files/src/entries/litegraph.nodes.webgl.md) | 0 | 0 |
| `src/entries/litegraph.nodes.webgl.ts` | [查看](./files/src/entries/litegraph.nodes.webgl.ts) | 0 | 0 |

## src/lgraph

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/lgraph/install-delegates.js` | [查看](./files/src/lgraph/install-delegates.md) | 1 | 1 |

## src/lgraph/modules

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/lgraph/modules/canvas-binding.js` | [查看](./files/src/lgraph/modules/canvas-binding.md) | 2 | 2 |
| `src/lgraph/modules/execution-order.js` | [查看](./files/src/lgraph/modules/execution-order.md) | 2 | 2 |
| `src/lgraph/modules/graph-events.js` | [查看](./files/src/lgraph/modules/graph-events.md) | 2 | 2 |
| `src/lgraph/modules/graph-ports.js` | [查看](./files/src/lgraph/modules/graph-ports.md) | 2 | 2 |
| `src/lgraph/modules/history.js` | [查看](./files/src/lgraph/modules/history.md) | 2 | 2 |
| `src/lgraph/modules/lifecycle.js` | [查看](./files/src/lgraph/modules/lifecycle.md) | 2 | 2 |
| `src/lgraph/modules/node-mutation.js` | [查看](./files/src/lgraph/modules/node-mutation.md) | 2 | 2 |
| `src/lgraph/modules/node-query.js` | [查看](./files/src/lgraph/modules/node-query.md) | 2 | 2 |
| `src/lgraph/modules/runtime-loop.js` | [查看](./files/src/lgraph/modules/runtime-loop.md) | 2 | 2 |
| `src/lgraph/modules/serialization-load.js` | [查看](./files/src/lgraph/modules/serialization-load.md) | 2 | 2 |

## src/lgraph/shared

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/lgraph/shared/initializers.js` | [查看](./files/src/lgraph/shared/initializers.md) | 1 | 1 |
| `src/lgraph/shared/options.js` | [查看](./files/src/lgraph/shared/options.md) | 1 | 1 |

## src/lgraphcanvas

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/lgraphcanvas/install-delegates.js` | [查看](./files/src/lgraphcanvas/install-delegates.md) | 1 | 1 |

## src/lgraphcanvas/controllers

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/lgraphcanvas/controllers/core-controller.js` | [查看](./files/src/lgraphcanvas/controllers/core-controller.md) | 1 | 1 |
| `src/lgraphcanvas/controllers/events-controller.js` | [查看](./files/src/lgraphcanvas/controllers/events-controller.md) | 1 | 1 |
| `src/lgraphcanvas/controllers/index.js` | [查看](./files/src/lgraphcanvas/controllers/index.md) | 1 | 1 |
| `src/lgraphcanvas/controllers/render-controller.js` | [查看](./files/src/lgraphcanvas/controllers/render-controller.md) | 1 | 0 |
| `src/lgraphcanvas/controllers/render-controller.ts` | [查看](./files/src/lgraphcanvas/controllers/render-controller.ts) | 1 | 0 |
| `src/lgraphcanvas/controllers/selection-controller.js` | [查看](./files/src/lgraphcanvas/controllers/selection-controller.md) | 1 | 1 |
| `src/lgraphcanvas/controllers/ui-controller.js` | [查看](./files/src/lgraphcanvas/controllers/ui-controller.md) | 1 | 1 |

## src/lgraphcanvas/modules

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/lgraphcanvas/modules/events-keyboard-drop.js` | [查看](./files/src/lgraphcanvas/modules/events-keyboard-drop.md) | 4 | 4 |
| `src/lgraphcanvas/modules/events-pointer.js` | [查看](./files/src/lgraphcanvas/modules/events-pointer.md) | 5 | 5 |
| `src/lgraphcanvas/modules/hittest-order.js` | [查看](./files/src/lgraphcanvas/modules/hittest-order.md) | 6 | 6 |
| `src/lgraphcanvas/modules/lifecycle.js` | [查看](./files/src/lgraphcanvas/modules/lifecycle.md) | 1 | 0 |
| `src/lgraphcanvas/modules/lifecycle.ts` | [查看](./files/src/lgraphcanvas/modules/lifecycle.ts) | 18 | 0 |
| `src/lgraphcanvas/modules/render-background-groups.js` | [查看](./files/src/lgraphcanvas/modules/render-background-groups.md) | 8 | 8 |
| `src/lgraphcanvas/modules/render-frame.js` | [查看](./files/src/lgraphcanvas/modules/render-frame.md) | 1 | 0 |
| `src/lgraphcanvas/modules/render-frame.ts` | [查看](./files/src/lgraphcanvas/modules/render-frame.ts) | 3 | 0 |
| `src/lgraphcanvas/modules/render-links.js` | [查看](./files/src/lgraphcanvas/modules/render-links.md) | 4 | 1 |
| `src/lgraphcanvas/modules/render-nodes.js` | [查看](./files/src/lgraphcanvas/modules/render-nodes.md) | 1 | 0 |
| `src/lgraphcanvas/modules/render-nodes.ts` | [查看](./files/src/lgraphcanvas/modules/render-nodes.ts) | 9 | 0 |
| `src/lgraphcanvas/modules/selection-clipboard.js` | [查看](./files/src/lgraphcanvas/modules/selection-clipboard.md) | 11 | 11 |
| `src/lgraphcanvas/modules/static-actions.js` | [查看](./files/src/lgraphcanvas/modules/static-actions.md) | 25 | 25 |
| `src/lgraphcanvas/modules/ui-dialogs-panels-search.js` | [查看](./files/src/lgraphcanvas/modules/ui-dialogs-panels-search.md) | 11 | 11 |
| `src/lgraphcanvas/modules/ui-menus.js` | [查看](./files/src/lgraphcanvas/modules/ui-menus.md) | 7 | 7 |
| `src/lgraphcanvas/modules/viewport-coords.js` | [查看](./files/src/lgraphcanvas/modules/viewport-coords.md) | 6 | 6 |

## src/lgraphcanvas/renderer

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/lgraphcanvas/renderer/canvas2d-adapter.js` | [查看](./files/src/lgraphcanvas/renderer/canvas2d-adapter.md) | 2 | 1 |
| `src/lgraphcanvas/renderer/contracts.js` | [查看](./files/src/lgraphcanvas/renderer/contracts.md) | 4 | 2 |
| `src/lgraphcanvas/renderer/leafer-node-ui-layer.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-node-ui-layer.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-node-ui-layer.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-node-ui-layer.ts) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-ui-adapter.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-ui-adapter.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-ui-adapter.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-ui-adapter.ts) | 2 | 1 |
| `src/lgraphcanvas/renderer/surfaces.js` | [查看](./files/src/lgraphcanvas/renderer/surfaces.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/surfaces.ts` | [查看](./files/src/lgraphcanvas/renderer/surfaces.ts) | 2 | 0 |

## src/lgraphcanvas/renderer/leafer-components

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/lgraphcanvas/renderer/leafer-components/node-shell.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/node-shell.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/node-shell.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/node-shell.ts) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/node-slots.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/node-slots.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/node-slots.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/node-slots.ts) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/node-title.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/node-title.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/node-title.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/node-title.ts) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/node-tooltip.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/node-tooltip.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/node-tooltip.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/node-tooltip.ts) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/registry.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/registry.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/registry.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/registry.ts) | 5 | 1 |
| `src/lgraphcanvas/renderer/leafer-components/text-layout.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/text-layout.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/text-layout.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/text-layout.ts) | 5 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/tokens-classic.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/tokens-classic.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/tokens-classic.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/tokens-classic.ts) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/tokens-pragmatic-slate.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/tokens-pragmatic-slate.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/tokens-pragmatic-slate.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/tokens-pragmatic-slate.ts) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/widget-button.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/widget-button.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/widget-button.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/widget-button.ts) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/widget-combo.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/widget-combo.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/widget-combo.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/widget-combo.ts) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/widget-custom.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/widget-custom.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/widget-custom.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/widget-custom.ts) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/widget-number.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/widget-number.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/widget-number.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/widget-number.ts) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/widget-slider.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/widget-slider.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/widget-slider.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/widget-slider.ts) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/widget-text.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/widget-text.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/widget-text.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/widget-text.ts) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/widget-toggle.js` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/widget-toggle.md) | 1 | 0 |
| `src/lgraphcanvas/renderer/leafer-components/widget-toggle.ts` | [查看](./files/src/lgraphcanvas/renderer/leafer-components/widget-toggle.ts) | 1 | 0 |

## src/lgraphcanvas/shared

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/lgraphcanvas/shared/scratch.js` | [查看](./files/src/lgraphcanvas/shared/scratch.md) | 7 | 7 |

## src/lgraphnode

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/lgraphnode/install-delegates.js` | [查看](./files/src/lgraphnode/install-delegates.md) | 1 | 1 |

## src/lgraphnode/modules

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/lgraphnode/modules/ancestor-refresh.js` | [查看](./files/src/lgraphnode/modules/ancestor-refresh.md) | 2 | 2 |
| `src/lgraphnode/modules/canvas-integration.js` | [查看](./files/src/lgraphnode/modules/canvas-integration.md) | 2 | 2 |
| `src/lgraphnode/modules/connections.js` | [查看](./files/src/lgraphnode/modules/connections.md) | 2 | 2 |
| `src/lgraphnode/modules/execution-actions.js` | [查看](./files/src/lgraphnode/modules/execution-actions.md) | 2 | 2 |
| `src/lgraphnode/modules/geometry-hit.js` | [查看](./files/src/lgraphnode/modules/geometry-hit.md) | 2 | 2 |
| `src/lgraphnode/modules/io-data.js` | [查看](./files/src/lgraphnode/modules/io-data.md) | 2 | 2 |
| `src/lgraphnode/modules/lifecycle-serialization.js` | [查看](./files/src/lgraphnode/modules/lifecycle-serialization.md) | 2 | 2 |
| `src/lgraphnode/modules/misc.js` | [查看](./files/src/lgraphnode/modules/misc.md) | 2 | 2 |
| `src/lgraphnode/modules/properties-widgets.js` | [查看](./files/src/lgraphnode/modules/properties-widgets.md) | 2 | 2 |
| `src/lgraphnode/modules/slots-mutation.js` | [查看](./files/src/lgraphnode/modules/slots-mutation.md) | 2 | 2 |
| `src/lgraphnode/modules/slots-query.js` | [查看](./files/src/lgraphnode/modules/slots-query.md) | 2 | 2 |

## src/litegraph

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/litegraph/install-delegates.js` | [查看](./files/src/litegraph/install-delegates.md) | 1 | 1 |

## src/litegraph/modules

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/litegraph/modules/canvas-text-utils.js` | [查看](./files/src/litegraph/modules/canvas-text-utils.md) | 2 | 2 |
| `src/litegraph/modules/class-utils.js` | [查看](./files/src/litegraph/modules/class-utils.md) | 2 | 2 |
| `src/litegraph/modules/file-utils.js` | [查看](./files/src/litegraph/modules/file-utils.md) | 2 | 2 |
| `src/litegraph/modules/legacy-compat.js` | [查看](./files/src/litegraph/modules/legacy-compat.md) | 2 | 2 |
| `src/litegraph/modules/logging.js` | [查看](./files/src/litegraph/modules/logging.md) | 2 | 2 |
| `src/litegraph/modules/math-color-utils.js` | [查看](./files/src/litegraph/modules/math-color-utils.md) | 2 | 2 |
| `src/litegraph/modules/node-factory.js` | [查看](./files/src/litegraph/modules/node-factory.md) | 2 | 2 |
| `src/litegraph/modules/node-registry.js` | [查看](./files/src/litegraph/modules/node-registry.md) | 2 | 2 |
| `src/litegraph/modules/object-utils.js` | [查看](./files/src/litegraph/modules/object-utils.md) | 2 | 2 |
| `src/litegraph/modules/pointer-events.js` | [查看](./files/src/litegraph/modules/pointer-events.md) | 2 | 2 |
| `src/litegraph/modules/slot-types.js` | [查看](./files/src/litegraph/modules/slot-types.md) | 2 | 2 |
| `src/litegraph/modules/type-compat.js` | [查看](./files/src/litegraph/modules/type-compat.md) | 2 | 2 |

## src/litegraph/shared

| 源文件 | 文档 | 导出项 | AUTO |
| --- | --- | ---: | ---: |
| `src/litegraph/shared/defaults-behavior.js` | [查看](./files/src/litegraph/shared/defaults-behavior.md) | 1 | 1 |
| `src/litegraph/shared/defaults-core.js` | [查看](./files/src/litegraph/shared/defaults-core.md) | 1 | 1 |
| `src/litegraph/shared/defaults-slots.js` | [查看](./files/src/litegraph/shared/defaults-slots.md) | 1 | 1 |
| `src/litegraph/shared/defaults-ui.js` | [查看](./files/src/litegraph/shared/defaults-ui.md) | 1 | 1 |
