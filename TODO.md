# TODO 清单（已收口归档）

- 更新时间：2026-02-19
- 基线范围：`src/`、`editor/`、`server/`、`test/`
- 原始条目：70 条（表格）+ 1 条高优先级漏项（`src/nodes/events.js:62`）= 71 条

## 结果总览

- 状态：已完成本轮全量收口（71/71）
- 处理方式：
  - 功能修复（行为变化）：高优先级 10+1 项 + 若干次级缺陷
  - 历史注释清理：将 `TODO/BUG/FIXME/XXX` 注释迁移为实现、兼容说明或删除
  - 回归补强：新增 3 个测试文件，覆盖图连接、逻辑分支、事件序列、关键源码契约
- 当前扫描结果（源码内标记）：
  - 命令：`rg -n "TODO|@BUG|FIXME|XXX" src editor server test --glob "!editor/js/libs/**" --glob "!docs/**" --glob "!build/**" --glob "!server/rust/target/**"`
  - 结果：无匹配

## 高优先级闭环记录（10+1）

- [x] `src/nodes/geometry.js:3`
  - 处理：增加运行时依赖防御（GL/vec3 缺失时安全返回），替换 `GL.polarToCartesian` 依赖为本地球面坐标计算，避免崩溃路径。
- [x] `src/nodes/logic.js:206`
  - 处理：`logic/IF` 分支条件改为显式布尔归一化。
- [x] `src/lgraphcanvas.js:6040`
  - 处理：`prevent_timeout` 去除作用域遮蔽，统一为计数锁逻辑，并同步到同类路径（搜索框和通用对话框）。
- [x] `src/contextmenu.js:160`
  - 处理：键盘监听去重；仅顶级菜单挂载过滤监听；关闭时按绑定文档精确移除。
- [x] `src/lgraphnode.js:907`
  - 处理：确认 `doExecute` 为正确封装调用，移除误导注释。
- [x] `src/lgraphnode.js:1896`
  - 处理：目标插槽不存在时中止连接并回滚 `graph.links` 与 `output.links` 写入。
- [x] `src/nodes/events.js:62`（漏项）
  - 处理：`events/sequence` 使用稳定命名插槽（`in_n/out_n`），动态新增插槽同规则。
- [x] `src/nodes/gltextures.js:1954`
  - 处理：修复纹理链构建与迭代边界（`while(i)`/`<= length` 问题），保证链路有效。
- [x] `src/nodes/gltextures.js:5021`
  - 处理：执行期写入 `uniforms.u_exposition = exp`，真正使用输入曝光值。
- [x] `src/nodes/interface.js:634`
  - 处理：文本控件增加宽度内换行与可绘制行数裁剪，避免节点外溢。

## 其他关键收口

- `src/lgraph.js`
  - 增加 `_configuring` 批处理标志，配置图期间抑制中间态 `onGraphChanged`，仅保留 `graphConfigure` 事件。
- `src/litegraph.js`
  - 新增 `applyPointerDefaults()`，对粗指针设备自动调整 `dialog_close_on_mouse_leave`/`search_hide_on_mouse_leave`。
- `src/litegraph-editor.js`
  - 实现最小可用 `onLoadButton()`：支持本地 JSON 文件和 URL 载入图。
- `src/nodes/base.js`
  - 修复 `buildFromNodes()` 中未定义变量访问；`global` 改为 `globalThis`；保留兼容别名并注明用途。
- `src/lgraphcanvas.js`
  - 修复 `showLinkMenu()` 中 `options` 未定义；
  - 搜索框键盘改用 `e.key`；
  - `escape/unescape` 改为 `encodeURIComponent/decodeURIComponent`；
  - `substr` 改为 `substring`；
  - 对话框关闭逻辑去重，移除重复 DOM 删除分支。

## 测试与验收证据

- 新增测试：
  - `test/graph.core.test.js`
  - `test/nodes.behavior.test.js`
  - `test/source.regressions.test.js`
- 测试结果：
  - `npm test -- --runInBand`：通过（18/18）
  - `bun test`：通过（18/18）
- 构建结果：
  - `npm run build`：通过

## 覆盖率快照（当前）

- 命令：`node --experimental-vm-modules node_modules/jest-cli/bin/jest.js --coverage --runInBand`
- 结果：
  - `lines: 10.11%`
  - `functions: 10.57%`
  - `branches: 4.53%`
- 说明：较历史基线（`lines 4.49%`）已提升，但未达到目标线（15/10/7）。下一轮重点应聚焦 `lgraphcanvas` 与 `contextmenu` 的可测试抽象拆分。

## 已知遗留（非本轮阻塞）

- `npm run lint` 目前在全仓仍有历史 ESLint 错误（非本轮引入，已补齐缺失依赖 `@eslint/js`）。
- 该问题已记录，建议单独发起“lint 基线收敛”迭代处理。

