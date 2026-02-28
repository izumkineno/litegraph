import type { RenderModeRuntime } from "../forms/legacy/legacy-mode.ts";

export function createDecoupledCompatModeRuntime(source = "decoupled-compat-default"): RenderModeRuntime {
    return {
        form: "leafer",
        strategy: "decoupled-compat",
        capabilities: {
            frontNative: true,
            backNative: true,
            forceLegacyNodeCtx: false,
            useCompatBridge: true,
        },
        fallbackPolicy: {
            nodeLevelLegacyFallback: true,
            markNodeErrorOnFailure: true,
        },
        source,
    };
}
