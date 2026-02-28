export interface RenderModeRuntime {
    form: "legacy" | "leafer";
    strategy: "legacy" | "hybrid-back" | "full-leafer" | "decoupled-compat";
    capabilities: {
        frontNative: boolean;
        backNative: boolean;
        forceLegacyNodeCtx: boolean;
        useCompatBridge: boolean;
    };
    fallbackPolicy: {
        nodeLevelLegacyFallback: boolean;
        markNodeErrorOnFailure: boolean;
    };
    source: string;
}

export function createLegacyModeRuntime(source = "legacy-default"): RenderModeRuntime {
    return {
        form: "legacy",
        strategy: "legacy",
        capabilities: {
            frontNative: false,
            backNative: false,
            forceLegacyNodeCtx: true,
            useCompatBridge: false,
        },
        fallbackPolicy: {
            nodeLevelLegacyFallback: true,
            markNodeErrorOnFailure: true,
        },
        source,
    };
}
