# Server Code

- JS server: [`js/`](js/)
- Python server: [`python/`](python/)
- Rust server: [`rust/`](rust/)
- Shared demo frontend files: [`shared/editor/`](shared/editor/)
- C# server-side/reference code: [`csharp/`](csharp/)

Install JS server deps:

```bash
cd server/js
npm install
```

Other server demos:

- Python: [`python/README.md`](python/README.md)
- Rust: [`rust/README.md`](rust/README.md)

## Shared Demo API Contract

All three backends implement the same demo contract:

- `GET /api/v1/editor/server-nodes/manifest`
- `GET /api/v1/editor/server-nodes/modules/*`
- `GET /api/v1/editor/server-nodes/graphs/*`
- Demo page: `http://127.0.0.1:8000/editor/server_nodes_from_server.html`

Manifest now uses `{ data, meta }` envelope, and `/api/v1/*` errors use a shared JSON error envelope.

Legacy path `/api/editor/server-nodes/*` has been removed across JS/Python/Rust demos.
