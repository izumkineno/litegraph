use axum::{routing::{get, get_service}, Json, Router};
use serde_json::{json, Value};
use std::{env, net::SocketAddr, path::PathBuf};
use tower_http::services::{ServeDir, ServeFile};

fn repo_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join("..")
}

async fn server_nodes_manifest() -> Json<Value> {
    Json(json!({
        "version": 1,
        "backend": "rust",
        "displayName": "Rust",
        "expectedNodeTypes": ["server_demo_rs/counter", "server_demo_rs/scale"],
        "modules": ["/api/editor/server-nodes/modules/server-demo-nodes.js"],
        "graphUrl": "/api/editor/server-nodes/graphs/server-demo.json"
    }))
}

#[tokio::main]
async fn main() {
    let rust_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"));
    let root = repo_root();
    let shared_demo_editor_dir = root.join("server").join("shared").join("editor");

    let app = Router::new()
        .route("/api/editor/server-nodes/manifest", get(server_nodes_manifest))
        .route_service(
            "/editor/server_nodes_from_server.html",
            get_service(ServeFile::new(shared_demo_editor_dir.join("server_nodes_from_server.html"))),
        )
        .route_service(
            "/editor/js/server_nodes_from_server.js",
            get_service(ServeFile::new(shared_demo_editor_dir.join("js").join("server_nodes_from_server.js"))),
        )
        .nest_service(
            "/api/editor/server-nodes/modules",
            ServeDir::new(rust_dir.join("examples").join("nodes")),
        )
        .nest_service(
            "/api/editor/server-nodes/graphs",
            ServeDir::new(rust_dir.join("examples").join("graphs")),
        )
        .nest_service("/css", ServeDir::new(root.join("css")))
        .nest_service("/src", ServeDir::new(root.join("src")))
        .nest_service("/build", ServeDir::new(root.join("build")))
        .nest_service("/external", ServeDir::new(root.join("external")))
        .nest_service("/editor", ServeDir::new(root.join("editor")))
        .fallback_service(ServeDir::new(root.join("editor")).append_index_html_on_directories(true));

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
