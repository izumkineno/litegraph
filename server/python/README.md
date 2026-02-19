# Python Server

- Entry: [`server.py`](server.py)
- Runtime: Python 3.10+

Run:

```bash
cd server/python
python server.py
```

Custom port:

PowerShell:

```powershell
$env:PORT=8001
python server.py
```

POSIX:

```bash
cd server/python
PORT=8001 python server.py
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

### API error envelope

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

Legacy path `/api/editor/server-nodes/*` has been removed.

Files used by the demo:

- Manifest response and static routes: [`server.py`](server.py)
- Server node module: [`examples/nodes/server-demo-nodes.js`](examples/nodes/server-demo-nodes.js)
- Preset graph JSON: [`examples/graphs/server-demo.json`](examples/graphs/server-demo.json)
- Shared demo page: [`../shared/editor/server_nodes_from_server.html`](../shared/editor/server_nodes_from_server.html)
- Shared frontend loader: [`../shared/editor/js/server_nodes_from_server.js`](../shared/editor/js/server_nodes_from_server.js)
