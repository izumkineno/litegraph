import type { RenderModeRuntime } from "../legacy/legacy-mode.ts";

export function createLeaferModeRuntime(
    strategy: "full-leafer" | "hybrid-back" = "full-leafer",
    source = "leafer-default",
): RenderModeRuntime {
    return {
        form: "leafer",
        strategy,
        capabilities: {
            frontNative: strategy === "full-leafer",
            backNative: true,
            forceLegacyNodeCtx: strategy === "hybrid-back",
            useCompatBridge: false,
        },
        fallbackPolicy: {
            nodeLevelLegacyFallback: true,
            markNodeErrorOnFailure: true,
        },
        source,
    };
}
