import { runLeaferLayerWithFallback } from "./leafer-layer-routing.ts";

export function drawBackCanvasWithLeaferLayer(host: any, drawFallback: () => void): void {
    runLeaferLayerWithFallback({
        host,
        layer: "back",
        drawLeafer: drawFallback,
        drawFallback,
        errorMessage: "[LeaferBackLayer] render failed, fallback to legacy back layer.",
    });
}
