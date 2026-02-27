# Canvas API Catalog（冻结基线）

本文档用于冻结当前 `LGraphCanvas` 渲染相关 API，作为后续图形引擎替换的契约基线。  
范围覆盖：`src/lgraphcanvas/modules/*`、`src/dragandscale.js`、`src/litegraph/modules/canvas-text-utils.js`。

## 1. 生命周期与画布绑定

- `setCanvas`：创建/绑定 front/back 渲染表面，初始化 `rendererAdapter`，建立 `ctx/bgctx`。  
位置：`src/lgraphcanvas/modules/lifecycle.js:127`
- `enableWebGL`：兼容 legacy WebGL 上下文，并回写到 `rendererAdapter`。  
位置：`src/lgraphcanvas/modules/lifecycle.js:279`
- `setDirty`：标记前景/背景脏区刷新。  
位置：`src/lgraphcanvas/modules/lifecycle.js:315`
- `resize`：统一通过 `rendererAdapter.resize` 调整 front/back 尺寸。  
位置：`src/lgraphcanvas/modules/lifecycle.js:363`

## 2. 帧渲染管线

- `draw`：主循环入口，调度背景与前景。  
位置：`src/lgraphcanvas/modules/render-frame.js:2`
- `drawFrontCanvas`：前景清理、背景合成、节点与交互层绘制。  
位置：`src/lgraphcanvas/modules/render-frame.js:57`
- `drawBackCanvas`：背景、分组、连线、网格与背景图案绘制。  
位置：`src/lgraphcanvas/modules/render-background-groups.js:222`
- `drawNode`：节点绘制入口（保留 `onDrawForeground/onDrawCollapsed` 兼容）。  
位置：`src/lgraphcanvas/modules/render-nodes.js:11`
- `drawNodeShape`：节点主体几何与标题区域绘制。  
位置：`src/lgraphcanvas/modules/render-nodes.js:509`
- `drawConnections`：连线批量绘制。  
位置：`src/lgraphcanvas/modules/render-links.js:66`
- `renderLink`：单条连线路径、箭头、流动点绘制。  
位置：`src/lgraphcanvas/modules/render-links.js:190`

## 3. 坐标与变换

- `toCanvasContext`：应用缩放和平移矩阵。  
位置：`src/dragandscale.js:150`
- `adjustMouseEvent`：屏幕坐标到图坐标映射。  
位置：`src/lgraphcanvas/modules/viewport-coords.js:14`
- `setZoom/convertOffsetToCanvas/convertCanvasToOffset`：视口变换 API。  
位置：`src/lgraphcanvas/modules/viewport-coords.js:39`, `:65`, `:69`

## 4. 文本与图像相关

- 文本测量/绘制：`measureText`、`fillText`（节点、连线 tooltip、面板）。  
典型位置：`render-nodes.js:60`, `render-links.js:43`, `render-background-groups.js:100`
- 图像合成：`drawImage`（背景层合成到前景）。  
位置：`src/lgraphcanvas/modules/render-frame.js:103`
- 图案与渐变：`createPattern`、`createLinearGradient`。  
位置：`render-background-groups.js:317`, `render-nodes.js:594`

## 5. 冻结方法集合（IRenderContext2DCompat）

冻结方法：`save/restore/setTransform/translate/scale/rotate/beginPath/closePath/moveTo/lineTo/bezierCurveTo/arc/rect/roundRect/clip/fill/stroke/clearRect/fillRect/strokeRect/drawImage/createPattern/createLinearGradient/fillText/measureText`。  
冻结属性：`canvas/font/textAlign/fillStyle/strokeStyle/lineWidth/lineJoin/globalAlpha/shadow*/imageSmoothingEnabled/mozImageSmoothingEnabled`。  
可选扩展：`start/start2D/finish/finish2D`。

