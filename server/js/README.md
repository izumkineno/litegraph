# JS 服务端

- 入口：[`server.js`](server.js)
- 包配置：[`package.json`](package.json)

运行：

```bash
cd server/js
npm install
npm start
```

访问：

- 编辑器首页：`http://127.0.0.1:8000/editor/`
- 服务端节点示例：`http://127.0.0.1:8000/editor/server_nodes_from_server.html`

## Server Nodes API（v1）

该服务端包含一个完整闭环示例：编辑器从服务端加载自定义节点。

1. Manifest 接口：`GET /api/v1/editor/server-nodes/manifest`
2. 节点模块静态路由：`/api/v1/editor/server-nodes/modules/*`
3. 图 JSON 静态路由：`/api/v1/editor/server-nodes/graphs/*`

### Manifest 响应包

```json
{
  "data": {
    "version": 1,
    "backend": "js",
    "displayName": "JavaScript",
    "expectedNodeTypes": ["server_demo/counter", "server_demo/scale"],
    "modules": ["/api/v1/editor/server-nodes/modules/server-demo-nodes.js"],
    "graphUrl": "/api/v1/editor/server-nodes/graphs/server-demo.json"
  },
  "meta": {
    "apiVersion": "v1",
    "schema": "server-nodes-manifest",
    "backend": "js"
  }
}
```

### API 错误包

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Requested API endpoint was not found",
    "recovery": "Check the API path and use /api/v1/editor/server-nodes/* endpoints.",
    "details": {
      "path": "/api/v1/editor/server-nodes/unknown"
    }
  },
  "meta": {
    "apiVersion": "v1",
    "backend": "js"
  }
}
```

旧路径 `/api/editor/server-nodes/*` 已移除。

示例相关文件：

- Manifest 响应生成位置：[`server.js`](server.js)
- 服务端节点模块：[`examples/nodes/server-demo-nodes.js`](examples/nodes/server-demo-nodes.js)
- 预置图 JSON：[`examples/graphs/server-demo.json`](examples/graphs/server-demo.json)
- 示例页面：[`../shared/editor/server_nodes_from_server.html`](../shared/editor/server_nodes_from_server.html)
- 前端加载器：[`../shared/editor/js/server_nodes_from_server.js`](../shared/editor/js/server_nodes_from_server.js)
