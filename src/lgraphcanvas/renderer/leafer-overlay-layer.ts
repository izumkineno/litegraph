import { runLeaferLayerWithFallback } from "./leafer-layer-routing.ts";

export function drawFrontOverlayWithLeaferLayer(host: any, drawFallback: () => void): void {
    runLeaferLayerWithFallback({
        host,
        layer: "overlay",
        drawLeafer: drawFallback,
        drawFallback,
        errorMessage: "[LeaferOverlayLayer] render failed, fallback to legacy overlay.",
    });
}
