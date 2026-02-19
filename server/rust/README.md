# Rust 服务端

- 入口：[`src/main.rs`](src/main.rs)
- 运行环境：Rust（cargo）

运行：

```bash
cd server/rust
cargo run
```

自定义端口：

PowerShell：

```powershell
$env:PORT=8001
cargo run
```

POSIX：

```bash
cd server/rust
PORT=8001 cargo run
```

访问：

- 编辑器首页：`http://127.0.0.1:8000/editor/`
- 服务端节点示例：`http://127.0.0.1:8000/editor/server_nodes_from_server.html`

## Server Nodes API（v1）

提供以下接口：

1. Manifest 接口：`GET /api/v1/editor/server-nodes/manifest`
2. 节点模块静态路由：`/api/v1/editor/server-nodes/modules/*`
3. 图 JSON 静态路由：`/api/v1/editor/server-nodes/graphs/*`

### Manifest 响应包

```json
{
  "data": {
    "version": 1,
    "backend": "rust",
    "displayName": "Rust",
    "expectedNodeTypes": ["server_demo_rs/counter", "server_demo_rs/scale"],
    "modules": ["/api/v1/editor/server-nodes/modules/server-demo-nodes.js"],
    "graphUrl": "/api/v1/editor/server-nodes/graphs/server-demo.json"
  },
  "meta": {
    "apiVersion": "v1",
    "schema": "server-nodes-manifest",
    "backend": "rust"
  }
}
```

### API 错误包

```json
{
  "error": {
    "code": "METHOD_NOT_ALLOWED",
    "message": "Only GET is supported for this API",
    "recovery": "Use GET for API reads, or extend the backend for write operations.",
    "details": {
      "path": "/api/v1/editor/server-nodes/manifest"
    }
  },
  "meta": {
    "apiVersion": "v1",
    "backend": "rust"
  }
}
```

旧路径 `/api/editor/server-nodes/*` 已移除。

示例相关文件：

- Manifest 与静态路由实现：[`src/main.rs`](src/main.rs)
- 服务端节点模块：[`examples/nodes/server-demo-nodes.js`](examples/nodes/server-demo-nodes.js)
- 预置图 JSON：[`examples/graphs/server-demo.json`](examples/graphs/server-demo.json)
- 共享示例页面：[`../shared/editor/server_nodes_from_server.html`](../shared/editor/server_nodes_from_server.html)
- 共享前端加载器：[`../shared/editor/js/server_nodes_from_server.js`](../shared/editor/js/server_nodes_from_server.js)
