# Rust Server

- Entry: [`src/main.rs`](src/main.rs)
- Runtime: Rust (cargo)

Run:

```bash
cd server/rust
cargo run
```

Custom port:

PowerShell:

```powershell
$env:PORT=8001
cargo run
```

POSIX:

```bash
cd server/rust
PORT=8001 cargo run
```

Open:

- Editor home: `http://127.0.0.1:8000/editor/`
- Server nodes demo: `http://127.0.0.1:8000/editor/server_nodes_from_server.html`

## Server Nodes API (v1)

Provided endpoints:

1. Manifest API: `GET /api/v1/editor/server-nodes/manifest`
2. Node modules static route: `/api/v1/editor/server-nodes/modules/*`
3. Graph JSON static route: `/api/v1/editor/server-nodes/graphs/*`

### Manifest response envelope

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

### API error envelope

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

Legacy path `/api/editor/server-nodes/*` has been removed.

Files used by the demo:

- Manifest response and static routes: [`src/main.rs`](src/main.rs)
- Server node module: [`examples/nodes/server-demo-nodes.js`](examples/nodes/server-demo-nodes.js)
- Preset graph JSON: [`examples/graphs/server-demo.json`](examples/graphs/server-demo.json)
- Shared demo page: [`../shared/editor/server_nodes_from_server.html`](../shared/editor/server_nodes_from_server.html)
- Shared frontend loader: [`../shared/editor/js/server_nodes_from_server.js`](../shared/editor/js/server_nodes_from_server.js)
