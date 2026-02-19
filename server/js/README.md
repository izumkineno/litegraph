# JS Server

- Entry: [`server.js`](server.js)
- Package config: [`package.json`](package.json)

Run:

```bash
cd server/js
npm install
npm start
```

Open:

- Editor home: `http://127.0.0.1:8000/editor/`
- Server nodes demo: `http://127.0.0.1:8000/editor/server_nodes_from_server.html`

## Server Nodes API (v1)

The server now includes a complete end-to-end example for loading custom nodes in the editor:

1. Manifest API: `GET /api/v1/editor/server-nodes/manifest`
2. Node modules static route: `/api/v1/editor/server-nodes/modules/*`
3. Graph JSON static route: `/api/v1/editor/server-nodes/graphs/*`

### Manifest response envelope

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

### API error envelope

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

Legacy path `/api/editor/server-nodes/*` has been removed.

Files used by the demo:

- Manifest response is generated in [`server.js`](server.js)
- Server node module: [`examples/nodes/server-demo-nodes.js`](examples/nodes/server-demo-nodes.js)
- Preset graph JSON: [`examples/graphs/server-demo.json`](examples/graphs/server-demo.json)
- Demo page: [`../shared/editor/server_nodes_from_server.html`](../shared/editor/server_nodes_from_server.html)
- Frontend loader: [`../shared/editor/js/server_nodes_from_server.js`](../shared/editor/js/server_nodes_from_server.js)
