# Leafer 组件与 Legacy 对齐清单

本文档用于 `uiapi-components` 模式的逐项验收，目标是与 legacy 渲染达到高一致（>=90%）。

## 1. 节点层（Node）

- [ ] 壳体形状一致：`BOX / ROUND / CARD / CIRCLE`
  - legacy 参考：`src/lgraphcanvas/modules/render-nodes.js:714`
  - Leafer 对应：`src/lgraphcanvas/renderer/leafer-components/node-shell.js`
- [ ] 标题模式一致：`TRANSPARENT / NO_TITLE / AUTOHIDE`
  - legacy 参考：`src/lgraphcanvas/modules/render-nodes.js:735`
  - Leafer 对应：`src/lgraphcanvas/renderer/leafer-components/node-title.js`
- [ ] collapsed 节点宽度与首个有效槽位标识一致
  - legacy 参考：`src/lgraphcanvas/modules/render-nodes.js:251`
  - Leafer 对应：`src/lgraphcanvas/renderer/leafer-components/node-slots.js`
- [ ] tooltip 显示条件一致（仅 hover + 选中 + 单选）
  - legacy 参考：`src/lgraphcanvas/modules/render-nodes.js:651`
  - Leafer 对应：`src/lgraphcanvas/renderer/leafer-components/node-tooltip.js`

## 2. 插槽与连通性提示（Slots）

- [ ] 形状一致：`BOX / ARROW / GRID / CIRCLE`
- [ ] 输入/输出文本布局一致（含 horizontal）
- [ ] 拖线时不兼容槽位透明度降级（0.4）
- [ ] `render_collapsed_slots` 行为一致

## 3. Widgets

- [ ] 覆盖类型：`button/toggle/slider/number/combo/text|string/custom`
- [ ] `widget.last_y` 与 legacy 对齐（命中区域依赖）
- [ ] `custom` 保留 Canvas 回调层（兼容例外）
- [ ] disabled/active/marker/arrow 细节一致
  - legacy 参考：`src/lgraphcanvas/modules/render-nodes.js:1057`
  - Leafer 对应：`src/lgraphcanvas/renderer/leafer-components/widget-*.js`

## 4. 交互（保持 LiteGraph 原链路）

- [ ] 缩放/平移：`processMouseWheel`, `processMouseMove`
- [ ] 节点拖拽与框选
- [ ] 连线创建与高亮输入输出
- [ ] 右键菜单与命中流程不迁移到 Leafer 事件系统

## 5. 双基准视觉

- [ ] `leafer-classic-v1`（Classic）
- [ ] `leafer-pragmatic-v1`（Pragmatic Slate）
- [ ] token 切换仅影响视觉，不影响交互协议
