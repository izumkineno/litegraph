export function shouldUseNodeLevelLegacyFallback(host: any): boolean {
    return host?._renderModeRuntime?.fallbackPolicy?.nodeLevelLegacyFallback !== false;
}

export function shouldMarkNodeErrorOnFallbackFailure(host: any): boolean {
    return host?._renderModeRuntime?.fallbackPolicy?.markNodeErrorOnFailure !== false;
}

export function markNodeRenderError(node: any, error: unknown): void {
    if (!node) {
        return;
    }
    const message = error instanceof Error ? error.message : String(error || "unknown render error");
    node.has_errors = true;
    node._render_error = message;
    node._render_error_internal = true;
}

export function clearNodeRenderError(node: any): void {
    if (!node || !node._render_error_internal) {
        return;
    }
    delete node._render_error;
    delete node._render_error_internal;
    if (node.has_errors) {
        node.has_errors = false;
    }
}
