use axum::{
    extract::{Path, State},
    http::{header, HeaderValue, Method, StatusCode},
    response::{IntoResponse, Response},
    routing::{any, get_service},
    Json, Router,
};
use serde::Serialize;
use std::{
    env,
    io::ErrorKind,
    net::SocketAddr,
    path::{Component, Path as FsPath, PathBuf},
};
use tower_http::services::{ServeDir, ServeFile};

const API_VERSION: &str = "v1";
const API_PREFIX: &str = "/api/v1";
const SERVER_NODES_PREFIX: &str = "/api/v1/editor/server-nodes";
const SERVER_NODES_MODULES_PREFIX: &str = "/api/v1/editor/server-nodes/modules";
const SERVER_NODES_GRAPHS_PREFIX: &str = "/api/v1/editor/server-nodes/graphs";
const BACKEND: &str = "rust";

#[derive(Clone)]
struct AppState {
    modules_dir: PathBuf,
    graphs_dir: PathBuf,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ResponseMeta {
    api_version: &'static str,
    #[serde(skip_serializing_if = "Option::is_none")]
    schema: Option<&'static str>,
    backend: &'static str,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct ServerNodesManifestData {
    version: u8,
    backend: &'static str,
    display_name: &'static str,
    expected_node_types: Vec<&'static str>,
    modules: Vec<&'static str>,
    graph_url: &'static str,
}

#[derive(Serialize)]
struct ManifestEnvelope {
    data: ServerNodesManifestData,
    meta: ResponseMeta,
}

#[derive(Serialize)]
struct ApiErrorDetails {
    path: String,
}

#[derive(Serialize)]
struct ApiErrorPayload {
    code: &'static str,
    message: &'static str,
    recovery: &'static str,
    details: ApiErrorDetails,
}

#[derive(Serialize)]
struct ApiErrorEnvelope {
    error: ApiErrorPayload,
    meta: ResponseMeta,
}

enum ApiFileError {
    InvalidPath,
    NotFound,
    Internal,
}

fn repo_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join("..")
}

fn api_meta(schema: Option<&'static str>) -> ResponseMeta {
    ResponseMeta {
        api_version: API_VERSION,
        schema,
        backend: BACKEND,
    }
}

fn api_error_response(
    status: StatusCode,
    code: &'static str,
    message: &'static str,
    recovery: &'static str,
    request_path: impl Into<String>,
) -> Response {
    let body = ApiErrorEnvelope {
        error: ApiErrorPayload {
            code,
            message,
            recovery,
            details: ApiErrorDetails {
                path: request_path.into(),
            },
        },
        meta: api_meta(None),
    };

    let mut response = (status, Json(body)).into_response();
    response.headers_mut().insert(
        header::CONTENT_TYPE,
        HeaderValue::from_static("application/json; charset=utf-8"),
    );
    response
}

fn resolve_api_file(base_dir: &FsPath, relative_path: &str) -> Result<PathBuf, ApiFileError> {
    if relative_path.is_empty() || relative_path.ends_with('/') {
        return Err(ApiFileError::NotFound);
    }
    if relative_path.starts_with('/') || relative_path.contains('\\') {
        return Err(ApiFileError::InvalidPath);
    }

    let requested_path = PathBuf::from(relative_path);
    if requested_path
        .components()
        .any(|component| matches!(component, Component::ParentDir | Component::RootDir | Component::Prefix(_)))
    {
        return Err(ApiFileError::InvalidPath);
    }

    let canonical_base_dir = base_dir.canonicalize().map_err(|_| ApiFileError::Internal)?;
    let candidate_path = base_dir.join(requested_path);
    let canonical_candidate_path = match candidate_path.canonicalize() {
        Ok(path) => path,
        Err(error) if error.kind() == ErrorKind::NotFound => return Err(ApiFileError::NotFound),
        Err(_) => return Err(ApiFileError::Internal),
    };

    if !canonical_candidate_path.starts_with(&canonical_base_dir) {
        return Err(ApiFileError::InvalidPath);
    }

    if !canonical_candidate_path.is_file() {
        return Err(ApiFileError::NotFound);
    }

    Ok(canonical_candidate_path)
}

async fn serve_api_file(
    base_dir: &FsPath,
    relative_path: String,
    request_path: String,
    content_type: &'static str,
) -> Response {
    let file_path = match resolve_api_file(base_dir, &relative_path) {
        Ok(path) => path,
        Err(ApiFileError::InvalidPath) => {
            return api_error_response(
                StatusCode::BAD_REQUEST,
                "INVALID_PATH",
                "Requested file path is invalid",
                "Use a relative file path within the allowed API resource directory.",
                request_path,
            );
        }
        Err(ApiFileError::NotFound) => {
            return api_error_response(
                StatusCode::NOT_FOUND,
                "NOT_FOUND",
                "Requested file was not found",
                "Check the manifest and ensure the requested file exists.",
                request_path,
            );
        }
        Err(ApiFileError::Internal) => {
            return api_error_response(
                StatusCode::INTERNAL_SERVER_ERROR,
                "INTERNAL_ERROR",
                "Failed to access requested file",
                "Retry the request and check server logs if the issue persists.",
                request_path,
            );
        }
    };

    match tokio::fs::read(file_path).await {
        Ok(content) => (
            StatusCode::OK,
            [(header::CONTENT_TYPE, content_type)],
            content,
        )
            .into_response(),
        Err(_) => api_error_response(
            StatusCode::INTERNAL_SERVER_ERROR,
            "INTERNAL_ERROR",
            "Failed to read requested file",
            "Retry the request and check server logs if the issue persists.",
            request_path,
        ),
    }
}

fn build_manifest_envelope() -> ManifestEnvelope {
    ManifestEnvelope {
        data: ServerNodesManifestData {
            version: 1,
            backend: BACKEND,
            display_name: "Rust",
            expected_node_types: vec!["server_demo_rs/counter", "server_demo_rs/scale"],
            modules: vec!["/api/v1/editor/server-nodes/modules/server-demo-nodes.js"],
            graph_url: "/api/v1/editor/server-nodes/graphs/server-demo.json",
        },
        meta: api_meta(Some("server-nodes-manifest")),
    }
}

async fn server_nodes_manifest(method: Method) -> Response {
    if method != Method::GET {
        return api_error_response(
            StatusCode::METHOD_NOT_ALLOWED,
            "METHOD_NOT_ALLOWED",
            "Only GET is supported for this API",
            "Use GET for API reads, or extend the backend for write operations.",
            format!("{SERVER_NODES_PREFIX}/manifest"),
        );
    }

    let mut response = (StatusCode::OK, Json(build_manifest_envelope())).into_response();
    response.headers_mut().insert(
        header::CONTENT_TYPE,
        HeaderValue::from_static("application/json; charset=utf-8"),
    );
    response
}

async fn server_nodes_modules(
    method: Method,
    Path(path): Path<String>,
    State(state): State<AppState>,
) -> Response {
    let request_path = format!("{SERVER_NODES_MODULES_PREFIX}/{path}");
    if method != Method::GET {
        return api_error_response(
            StatusCode::METHOD_NOT_ALLOWED,
            "METHOD_NOT_ALLOWED",
            "Only GET is supported for this API",
            "Use GET for API reads, or extend the backend for write operations.",
            request_path,
        );
    }

    serve_api_file(
        &state.modules_dir,
        path,
        request_path,
        "text/javascript; charset=utf-8",
    )
        .await
}

async fn server_nodes_graphs(
    method: Method,
    Path(path): Path<String>,
    State(state): State<AppState>,
) -> Response {
    let request_path = format!("{SERVER_NODES_GRAPHS_PREFIX}/{path}");
    if method != Method::GET {
        return api_error_response(
            StatusCode::METHOD_NOT_ALLOWED,
            "METHOD_NOT_ALLOWED",
            "Only GET is supported for this API",
            "Use GET for API reads, or extend the backend for write operations.",
            request_path,
        );
    }

    serve_api_file(
        &state.graphs_dir,
        path,
        request_path,
        "application/json; charset=utf-8",
    )
        .await
}

async fn api_v1_root_fallback(method: Method) -> Response {
    api_v1_fallback(method, Path(String::new())).await
}

async fn api_v1_fallback(method: Method, Path(path): Path<String>) -> Response {
    let request_path = if path.is_empty() {
        API_PREFIX.to_string()
    } else {
        format!("{API_PREFIX}/{path}")
    };

    if method != Method::GET {
        return api_error_response(
            StatusCode::METHOD_NOT_ALLOWED,
            "METHOD_NOT_ALLOWED",
            "Only GET is supported for this API",
            "Use GET for API reads, or extend the backend for write operations.",
            request_path,
        );
    }

    api_error_response(
        StatusCode::NOT_FOUND,
        "NOT_FOUND",
        "Requested API endpoint was not found",
        "Check the API path and use /api/v1/editor/server-nodes/* endpoints.",
        request_path,
    )
}

#[tokio::main]
async fn main() {
    let rust_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let root = repo_root();
    let shared_demo_editor_dir = root.join("server").join("shared").join("editor");
    let app_state = AppState {
        modules_dir: rust_dir.join("examples").join("nodes"),
        graphs_dir: rust_dir.join("examples").join("graphs"),
    };

    let app = Router::new()
        .route(
            &format!("{SERVER_NODES_PREFIX}/manifest"),
            any(server_nodes_manifest),
        )
        .route(
            &format!("{SERVER_NODES_MODULES_PREFIX}/*path"),
            any(server_nodes_modules),
        )
        .route(
            &format!("{SERVER_NODES_GRAPHS_PREFIX}/*path"),
            any(server_nodes_graphs),
        )
        .route("/api/v1", any(api_v1_root_fallback))
        .route("/api/v1/*path", any(api_v1_fallback))
        .route_service(
            "/editor/server_nodes_from_server.html",
            get_service(ServeFile::new(shared_demo_editor_dir.join("server_nodes_from_server.html"))),
        )
        .route_service(
            "/editor/js/server_nodes_from_server.js",
            get_service(ServeFile::new(shared_demo_editor_dir.join("js").join("server_nodes_from_server.js"))),
        )
        .nest_service("/css", ServeDir::new(root.join("css")))
        .nest_service("/src", ServeDir::new(root.join("src")))
        .nest_service("/build", ServeDir::new(root.join("build")))
        .nest_service("/external", ServeDir::new(root.join("external")))
        .nest_service("/editor", ServeDir::new(root.join("editor")))
        .fallback_service(ServeDir::new(root.join("editor")).append_index_html_on_directories(true))
        .with_state(app_state);

    let port = env::var("PORT")
        .ok()
        .and_then(|value| value.parse::<u16>().ok())
        .unwrap_or(8000);

    let addr = SocketAddr::from(([127, 0, 0, 1], port));
    let listener = tokio::net::TcpListener::bind(addr)
        .await
        .expect("failed to bind TCP listener");

    println!("Example app listening on http://127.0.0.1:{port}");
    axum::serve(listener, app).await.expect("server failed");
}
