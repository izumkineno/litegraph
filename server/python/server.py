import json
import mimetypes
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent.parent
SHARED_DEMO_EDITOR_DIR = REPO_ROOT / "server" / "shared" / "editor"

API_VERSION = "v1"
API_PREFIX = f"/api/{API_VERSION}"
SERVER_NODES_PREFIX = f"{API_PREFIX}/editor/server-nodes"
SERVER_NODES_MANIFEST_PATH = f"{SERVER_NODES_PREFIX}/manifest"
SERVER_NODES_MODULES_PREFIX = f"{SERVER_NODES_PREFIX}/modules/"
SERVER_NODES_GRAPHS_PREFIX = f"{SERVER_NODES_PREFIX}/graphs/"
BACKEND = "python"
SERVER_NODES_MODULES_DIR = SCRIPT_DIR / "examples" / "nodes"
SERVER_NODES_GRAPHS_DIR = SCRIPT_DIR / "examples" / "graphs"

MANIFEST_DATA = {
    "version": 1,
    "backend": BACKEND,
    "displayName": "Python",
    "expectedNodeTypes": [
        "server_demo_py/counter",
        "server_demo_py/scale",
    ],
    "modules": [
        f"{SERVER_NODES_MODULES_PREFIX}server-demo-nodes.js",
    ],
    "graphUrl": f"{SERVER_NODES_GRAPHS_PREFIX}server-demo.json",
}

MANIFEST = {
    "data": MANIFEST_DATA,
    "meta": {
        "apiVersion": API_VERSION,
        "schema": "server-nodes-manifest",
        "backend": BACKEND,
    },
}

STATIC_MAPPINGS = (
    ("/src/", REPO_ROOT / "src", False),
    ("/build/", REPO_ROOT / "build", False),
    ("/editor/", REPO_ROOT / "editor", True),
    ("/", REPO_ROOT / "editor", True),
)


def _safe_file_path(base_dir: Path, relative_path: Path) -> Path | None:
    if relative_path.is_absolute():
        return None

    base_dir = base_dir.resolve()
    candidate = (base_dir / relative_path).resolve()
    try:
        candidate.relative_to(base_dir)
    except ValueError:
        return None

    return candidate


def _content_type_for(file_path: Path) -> str:
    if file_path.suffix == ".js":
        return "text/javascript; charset=utf-8"
    if file_path.suffix == ".json":
        return "application/json; charset=utf-8"
    content_type, _ = mimetypes.guess_type(file_path.as_posix())
    if not content_type:
        return "application/octet-stream"
    if content_type.startswith("text/"):
        return f"{content_type}; charset=utf-8"
    if content_type == "application/javascript":
        return "text/javascript; charset=utf-8"
    if content_type == "application/json":
        return "application/json; charset=utf-8"
    if file_path.suffix == ".svg":
        return "image/svg+xml; charset=utf-8"
    if content_type == "text/html":
        return "text/html; charset=utf-8"
    return content_type


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


def _resolve_api_file(base_dir: Path, relative_raw_path: str) -> tuple[Path | None, str | None]:
    if not relative_raw_path:
        return None, "not_found"
    if relative_raw_path.startswith("/") or "\\" in relative_raw_path:
        return None, "invalid_path"

    relative_path = Path(relative_raw_path)
    if relative_path.is_absolute() or ".." in relative_path.parts:
        return None, "invalid_path"

    file_path = _safe_file_path(base_dir, relative_path)
    if file_path is None:
        return None, "invalid_path"
    if not file_path.is_file():
        return None, "not_found"

    return file_path, None


class LiteGraphRequestHandler(BaseHTTPRequestHandler):
    server_version = "LiteGraphPythonServer/1.0"

    def do_GET(self) -> None:
        parsed = urlparse(self.path)
        request_path = unquote(parsed.path)

        if request_path == SERVER_NODES_MANIFEST_PATH:
            self._send_json(MANIFEST)
            return

        if request_path.startswith(SERVER_NODES_MODULES_PREFIX):
            relative_raw_path = request_path[len(SERVER_NODES_MODULES_PREFIX):]
            self._send_api_resource(
                request_path,
                SERVER_NODES_MODULES_DIR,
                relative_raw_path,
                "text/javascript; charset=utf-8",
            )
            return

        if request_path.startswith(SERVER_NODES_GRAPHS_PREFIX):
            relative_raw_path = request_path[len(SERVER_NODES_GRAPHS_PREFIX):]
            self._send_api_resource(
                request_path,
                SERVER_NODES_GRAPHS_DIR,
                relative_raw_path,
                "application/json; charset=utf-8",
            )
            return

        if request_path.startswith(API_PREFIX):
            self._send_api_error(
                status=404,
                code="NOT_FOUND",
                message="Requested API endpoint was not found",
                recovery="Check the API path and use /api/v1/editor/server-nodes/* endpoints.",
                request_path=request_path,
            )
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
            if file_path is None or not file_path.is_file():
                continue

            self._send_file(file_path)
            return

        self._send_not_found()

    def do_POST(self) -> None:
        self._handle_non_get()

    def do_PUT(self) -> None:
        self._handle_non_get()

    def do_PATCH(self) -> None:
        self._handle_non_get()

    def do_DELETE(self) -> None:
        self._handle_non_get()

    def do_OPTIONS(self) -> None:
        self._handle_non_get()

    def do_HEAD(self) -> None:
        self._handle_non_get()

    def _handle_non_get(self) -> None:
        request_path = unquote(urlparse(self.path).path)
        if request_path.startswith(API_PREFIX):
            self._send_api_error(
                status=405,
                code="METHOD_NOT_ALLOWED",
                message="Only GET is supported for this API",
                recovery="Use GET for API reads, or extend the backend for write operations.",
                request_path=request_path,
            )
            return
        self._send_not_found()

    def _send_json(self, payload: dict) -> None:
        body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_api_resource(
        self,
        request_path: str,
        base_dir: Path,
        relative_raw_path: str,
        content_type: str,
    ) -> None:
        file_path, error_kind = _resolve_api_file(base_dir, relative_raw_path)
        if error_kind == "invalid_path":
            self._send_api_error(
                status=400,
                code="INVALID_PATH",
                message="Requested file path is invalid",
                recovery="Use a relative file path within the allowed API resource directory.",
                request_path=request_path,
            )
            return
        if error_kind == "not_found" or file_path is None:
            self._send_api_error(
                status=404,
                code="NOT_FOUND",
                message="Requested file was not found",
                recovery="Check the manifest and ensure the requested file exists.",
                request_path=request_path,
            )
            return

        self._send_file(file_path, content_type=content_type)

    def _send_api_error(
        self,
        status: int,
        code: str,
        message: str,
        recovery: str,
        request_path: str,
    ) -> None:
        payload = {
            "error": {
                "code": code,
                "message": message,
                "recovery": recovery,
                "details": {
                    "path": request_path,
                },
            },
            "meta": {
                "apiVersion": API_VERSION,
                "backend": BACKEND,
            },
        }
        body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _send_file(self, file_path: Path, content_type: str | None = None) -> None:
        body = file_path.read_bytes()
        self.send_response(200)
        self.send_header("Content-Type", content_type or _content_type_for(file_path))
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
