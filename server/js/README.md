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

## Server Nodes Example

The server now includes a complete end-to-end example for loading custom nodes in the editor:

1. Manifest API: `GET /api/editor/server-nodes/manifest`
2. Node modules static route: `/api/editor/server-nodes/modules/*`
3. Graph JSON static route: `/api/editor/server-nodes/graphs/*`

Files used by the demo:

- Manifest response is generated in [`server.js`](server.js)
- Server node module: [`examples/nodes/server-demo-nodes.js`](examples/nodes/server-demo-nodes.js)
- Preset graph JSON: [`examples/graphs/server-demo.json`](examples/graphs/server-demo.json)
- Demo page: [`../../editor/server_nodes_from_server.html`](../../editor/server_nodes_from_server.html)
- Frontend loader: [`../../editor/js/server_nodes_from_server.js`](../../editor/js/server_nodes_from_server.js)
