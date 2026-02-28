import { runLeaferLayerWithFallback } from "./leafer-layer-routing.ts";

export function drawConnectionsWithLeaferLayer(host: any, drawFallback: () => void): void {
    runLeaferLayerWithFallback({
        host,
        layer: "link",
        drawLeafer: drawFallback,
        drawFallback,
        errorMessage: "[LeaferLinkLayer] drawConnections failed, fallback to legacy links.",
    });
}

export function renderLinkWithLeaferLayer(host: any, drawFallback: () => void): void {
    runLeaferLayerWithFallback({
        host,
        layer: "link",
        drawLeafer: drawFallback,
        drawFallback,
        errorMessage: "[LeaferLinkLayer] renderLink failed, fallback to legacy path.",
    });
}

export function drawLinkTooltipWithLeaferLayer(host: any, drawFallback: () => void): void {
    runLeaferLayerWithFallback({
        host,
        layer: "link",
        drawLeafer: drawFallback,
        drawFallback,
        errorMessage: "[LeaferLinkLayer] drawLinkTooltip failed, fallback to legacy tooltip.",
    });
}
