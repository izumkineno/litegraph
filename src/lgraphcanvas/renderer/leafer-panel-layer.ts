import { runLeaferLayerWithFallback } from "./leafer-layer-routing.ts";

export function drawSubgraphPanelWithLeaferLayer(host: any, drawFallback: () => void): void {
    runLeaferLayerWithFallback({
        host,
        layer: "panel",
        drawLeafer: drawFallback,
        drawFallback,
        errorMessage: "[LeaferPanelLayer] drawSubgraphPanel failed, fallback to legacy panel.",
    });
}

export function renderInfoWithLeaferLayer(host: any, drawFallback: () => void): void {
    runLeaferLayerWithFallback({
        host,
        layer: "panel",
        drawLeafer: drawFallback,
        drawFallback,
        errorMessage: "[LeaferPanelLayer] renderInfo failed, fallback to legacy info panel.",
    });
}
