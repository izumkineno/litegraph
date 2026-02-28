import { createLeaferModeRuntime } from "../forms/leafer/leafer-mode.ts";
import type { RenderModeRuntime } from "../forms/legacy/legacy-mode.ts";

/**
 * Hybrid is a Leafer form strategy:
 * - back layer: Leafer native
 * - front layer: legacy canvas-compatible pipeline
 */
export function createHybridModeRuntime(source = "hybrid-default"): RenderModeRuntime {
    return createLeaferModeRuntime("hybrid-back", source);
}
