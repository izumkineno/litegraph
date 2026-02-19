import json
import mimetypes
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
SHARED_DEMO_EDITOR_DIR = REPO_ROOT / "server" / "shared" / "editor"

MANIFEST = {
    "version": 1,
    "backend": "python",
    "displayName": "Python",
    "expectedNodeTypes": [
        "server_demo_py/counter",
        "server_demo_py/scale",
    ],
    "modules": [
        "/api/editor/server-nodes/modules/server-demo-nodes.js",
    ],
    "graphUrl": "/api/editor/server-nodes/graphs/server-demo.json",
}

STATIC_MAPPINGS = (
    ("/api/editor/server-nodes/modules/", SCRIPT_DIR / "examples" / "nodes", False),
    ("/api/editor/server-nodes/graphs/", SCRIPT_DIR / "examples" / "graphs", False),
    ("/css/", REPO_ROOT / "css", False),
    ("/src/", REPO_ROOT / "src", False),
    ("/build/", REPO_ROOT / "build", False),
    ("/external/", REPO_ROOT / "external", False),
    ("/editor/", REPO_ROOT / "editor", True),
    ("/", REPO_ROOT / "editor", True),
)


def _safe_file_path(base_dir: Path, relative_path: Path) -> Path | None:
    if relative_path.is_absolute() or ".." in relative_path.parts:
        return None

    base_dir = base_dir.resolve()
    candidate = (base_dir / relative_path).resolve()
    try:
        candidate.relative_to(base_dir)
    except ValueError:
        return None

    if not candidate.is_file():
        return None
    return candidate


def _content_type_for(file_path: Path) -> str:
    content_type, _ = mimetypes.guess_type(file_path.as_posix())
    if content_type:
        return content_type
    if file_path.suffix == ".js":
        return "text/javascript; charset=utf-8"
    if file_path.suffix == ".json":
        return "application/json; charset=utf-8"
    return "application/octet-stream"


def _relative_path_for(request_path: str, prefix: str, use_index: bool) -> Path | None:
    if prefix == "/":
        if request_path == "/":
            return Path("index.html")
        return Path(request_path.lstrip("/"))

    prefix_no_slash = prefix.rstrip("/")
    if request_path == prefix_no_slash and use_index:
        return Path("index.html")

    if not request_path.startswith(prefix):
        return None

    relative = request_path[len(prefix):]
    if relative == "" and use_index:
        return Path("index.html")
    return Path(relative)


class LiteGraphRequestHandler(BaseHTTPRequestHandler):
    server_version = "LiteGraphPythonServer/1.0"

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        request_path = unquote(parsed.path)

        if request_path == "/api/editor/server-nodes/manifest":
            self._send_json(MANIFEST)
            return
        if request_path == "/editor/server_nodes_from_server.html":
            self._send_file(SHARED_DEMO_EDITOR_DIR / "server_nodes_from_server.html")
            return
        if request_path == "/editor/js/server_nodes_from_server.js":
            self._send_file(SHARED_DEMO_EDITOR_DIR / "js" / "server_nodes_from_server.js")
            return

        for prefix, base_dir, use_index in STATIC_MAPPINGS:
            relative_path = _relative_path_for(request_path, prefix, use_index)
            if relative_path is None:
                continue

            file_path = _safe_file_path(base_dir, relative_path)
            if file_path is None:
                continue

            self._send_file(file_path)
            return

        self._send_not_found()

    def _send_json(self, payload: dict) -> None:
        body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, file_path: Path) -> None:
        body = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", _content_type_for(file_path))
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_not_found(self) -> None:
        body = b"Not Found"
        self.send_response(404)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def main() -> None:
    port = int(os.environ.get("PORT", "8000"))
    server = ThreadingHTTPServer(("127.0.0.1", port), LiteGraphRequestHandler)
    print(f"Example app listening on http://127.0.0.1:{port}")
    server.serve_forever()


if __name__ == "__main__":
    main()
