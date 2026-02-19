# litegraph.js

一个在浏览器中运行的节点图编辑与执行库，交互体验接近 Blueprint。
适用于流程编排、可视化逻辑编辑、节点式工具界面等场景。

## 原仓库

- 原始仓库地址：`https://github.com/daniel-lewis-ab/litegraph.js`
- 本仓库基于原项目进行持续维护与扩展。

## 项目特性

- Canvas2D 渲染，支持缩放、平移、大图编辑
- 内置编辑器（搜索、快捷键、多选、右键菜单）
- 节点系统可扩展，支持自定义节点与子图
- 支持 Live 模式与多种内置节点类型
- 可在浏览器与 Node.js 环境运行（部分节点仅浏览器可用）
- 提供 TypeScript 类型定义

## 快速开始

### 1. 安装依赖

```bash
bun install
```

### 2. 构建

```bash
bun run build
```

### 3. 启动本地编辑器服务

```bash
bun run server
```

启动后访问：`http://127.0.0.1:8000/editor/`

## 直接使用构建产物

可直接使用以下文件：

- `build/litegraph.js`
- `build/resources/css/litegraph.css`

## 最小示例

```html
<html>
<head>
  <link rel="stylesheet" type="text/css" href="litegraph.css">
  <script type="module" src="litegraph.js"></script>
</head>
<body style="width:100%;height:100%">
  <canvas id="mycanvas" width="1024" height="720" style="border:1px solid"></canvas>
  <script>
    var graph = new LGraph();
    var canvas = new LGraphCanvas("#mycanvas", graph);

    var nodeConst = LiteGraph.createNode("basic/const");
    nodeConst.pos = [200, 200];
    graph.add(nodeConst);
    nodeConst.setValue(4.5);

    var nodeWatch = LiteGraph.createNode("basic/watch");
    nodeWatch.pos = [700, 200];
    graph.add(nodeWatch);

    nodeConst.connect(0, nodeWatch, 0);
    graph.start();
  </script>
</body>
</html>
```

## 自定义节点示例

```javascript
function MyAddNode() {
  this.addInput("A", "number");
  this.addInput("B", "number");
  this.addOutput("A+B", "number");
}

MyAddNode.title = "Sum";

MyAddNode.prototype.onExecute = function () {
  var A = this.getInputData(0) ?? 0;
  var B = this.getInputData(1) ?? 0;
  this.setOutputData(0, A + B);
};

LiteGraph.registerNodeType("basic/sum", MyAddNode);
```

## 服务端动态节点 Demo（JS / Python / Rust）

统一入口页面：

- `server/shared/editor/server_nodes_from_server.html`

统一 API（v1）：

- `GET /api/v1/editor/server-nodes/manifest`
- `GET /api/v1/editor/server-nodes/modules/*`
- `GET /api/v1/editor/server-nodes/graphs/*`

说明：

- `manifest` 使用 `{ data, meta }` 包装
- `/api/v1/*` 统一返回 JSON 错误包
- 旧路径 `/api/editor/server-nodes/*` 已移除

详细说明见：

- `server/README.md`
- `server/js/README.md`
- `server/python/README.md`
- `server/rust/README.md`

## 常用命令

```bash
bun run docs
bun run build
bun run test
bun run lint
bun run server
```

## 文档索引

- API 指南：`docs/guide.md`
- JSDoc 页面：`docs/index.html`
- 变更日志：`docs/project/CHANGELOG.md`
- 路线图：`docs/project/ROADMAP.md`
- 设计系统：`design-system/litegraph/MASTER.md`
- 构建脚本：`scripts/build-vite.mjs`

## 相关项目（原版生态）

- [ComfyUI](https://github.com/comfyanonymous/ComfyUI)
- [webglstudio.org](http://webglstudio.org)

## 反馈与许可证

- License：`MIT`
