# Python 服务端

- 入口：[`server.py`](server.py)
- 运行环境：Python 3.10+

运行：

```bash
cd server/python
python server.py
```

自定义端口：

PowerShell：

```powershell
$env:PORT=8001
python server.py
```

POSIX：

```bash
cd server/python
PORT=8001 python server.py
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
    "backend": "python",
    "displayName": "Python",
    "expectedNodeTypes": ["server_demo_py/counter", "server_demo_py/scale"],
    "modules": ["/api/v1/editor/server-nodes/modules/server-demo-nodes.js"],
    "graphUrl": "/api/v1/editor/server-nodes/graphs/server-demo.json"
  },
  "meta": {
    "apiVersion": "v1",
    "schema": "server-nodes-manifest",
    "backend": "python"
  }
}
```

### API 错误包

```json
{
  "error": {
    "code": "INVALID_PATH",
    "message": "Requested file path is invalid",
    "recovery": "Use a relative file path within the allowed API resource directory.",
    "details": {
      "path": "/api/v1/editor/server-nodes/modules/../x"
    }
  },
  "meta": {
    "apiVersion": "v1",
    "backend": "python"
  }
}
```

旧路径 `/api/editor/server-nodes/*` 已移除。

示例相关文件：

- Manifest 与静态路由实现：[`server.py`](server.py)
- 服务端节点模块：[`examples/nodes/server-demo-nodes.js`](examples/nodes/server-demo-nodes.js)
- 预置图 JSON：[`examples/graphs/server-demo.json`](examples/graphs/server-demo.json)
- 共享示例页面：[`../shared/editor/server_nodes_from_server.html`](../shared/editor/server_nodes_from_server.html)
- 共享前端加载器：[`../shared/editor/js/server_nodes_from_server.js`](../shared/editor/js/server_nodes_from_server.js)
