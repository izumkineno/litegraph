export type LeaferLayerName = "back" | "link" | "overlay" | "panel";

function nowMs(): number {
    return typeof performance !== "undefined" && typeof performance.now === "function"
        ? performance.now()
        : Date.now();
}

function getLayerFlags(host: any): Record<string, boolean> {
    return host?.leaferLayerFlags || host?.options?.leaferLayerFlags || {};
}

export function isFullLeaferMode(host: any): boolean {
    const runtimeMode = host?._renderModeRuntime;
    if (!runtimeMode) {
        return false;
    }
    if (runtimeMode.form !== "leafer" || runtimeMode.strategy !== "full-leafer") {
        return false;
    }
    return true;
}

export function shouldUseLeaferLayer(host: any, layer: LeaferLayerName): boolean {
    if (!isFullLeaferMode(host)) {
        return false;
    }
    const flags = getLayerFlags(host);
    if (flags[layer] === false) {
        return false;
    }
    if (layer === "back" || layer === "link") {
        return host?.rendererAdapter?.isLayerNative?.("back") === true;
    }
    if (layer === "overlay" || layer === "panel") {
        return host?.rendererAdapter?.isLayerNative?.("front") === true;
    }
    return true;
}

function getLayerStats(host: any): Record<string, any> {
    host._leaferLayerStats ||= {
        back: { calls: 0, fallbackCalls: 0, totalMs: 0, errors: 0 },
        link: { calls: 0, fallbackCalls: 0, totalMs: 0, errors: 0 },
        overlay: { calls: 0, fallbackCalls: 0, totalMs: 0, errors: 0 },
        panel: { calls: 0, fallbackCalls: 0, totalMs: 0, errors: 0 },
    };
    return host._leaferLayerStats;
}

export function runLeaferLayerWithFallback<T>(options: {
    host: any;
    layer: LeaferLayerName;
    drawLeafer?: () => T;
    drawFallback: () => T;
    errorMessage: string;
}): T {
    const {
        host,
        layer,
        drawLeafer,
        drawFallback,
        errorMessage,
    } = options;

    const stats = getLayerStats(host)[layer];
    const startedAt = nowMs();
    stats.calls += 1;

    const useLeafer = shouldUseLeaferLayer(host, layer);
    if (!useLeafer || typeof drawLeafer !== "function") {
        stats.fallbackCalls += 1;
        const value = drawFallback();
        stats.totalMs += nowMs() - startedAt;
        return value;
    }

    try {
        const value = drawLeafer();
        stats.totalMs += nowMs() - startedAt;
        return value;
    } catch (error) {
        stats.errors += 1;
        stats.fallbackCalls += 1;
        console.warn?.(errorMessage, error);
        const value = drawFallback();
        stats.totalMs += nowMs() - startedAt;
        return value;
    }
}
