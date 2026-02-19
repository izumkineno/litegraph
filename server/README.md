# 服务端代码

- JS 服务端：[`js/`](js/)
- Python 服务端：[`python/`](python/)
- Rust 服务端：[`rust/`](rust/)
- 共享示例前端文件：[`shared/editor/`](shared/editor/)
- C# 服务端/参考代码：[`csharp/`](csharp/)

安装 JS 服务端依赖：

```bash
cd server/js
npm install
```

其它服务端示例：

- Python：[`python/README.md`](python/README.md)
- Rust：[`rust/README.md`](rust/README.md)

## 共享 Demo API 契约

三个后端都实现同一套接口：

- `GET /api/v1/editor/server-nodes/manifest`
- `GET /api/v1/editor/server-nodes/modules/*`
- `GET /api/v1/editor/server-nodes/graphs/*`
- 示例页面：`http://127.0.0.1:8000/editor/server_nodes_from_server.html`

`manifest` 使用 `{ data, meta }` 包装结构；`/api/v1/*` 的错误响应使用统一 JSON 错误包。

旧路径 `/api/editor/server-nodes/*` 已在 JS/Python/Rust 示例中移除。
