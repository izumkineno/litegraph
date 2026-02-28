import { createLeaferModeRuntime } from "./forms/leafer/leafer-mode.ts";
import { createLegacyModeRuntime } from "./forms/legacy/legacy-mode.ts";
import { createHybridModeRuntime } from "./hybrid/hybrid-mode.ts";
import { createDecoupledCompatModeRuntime } from "./compat/compat-mode.ts";

type RenderForm = "legacy" | "leafer";
type RenderStrategy = "legacy" | "hybrid-back" | "full-leafer" | "decoupled-compat";

function normalizeRenderForm(value: unknown): RenderForm | null {
    if (value === "legacy" || value === "leafer") {
        return value;
    }
    return null;
}

function normalizeRenderStrategy(value: unknown): RenderStrategy | null {
    if (value === "legacy" || value === "hybrid-back" || value === "full-leafer" || value === "decoupled-compat") {
        return value;
    }
    return null;
}

function resolveFromLegacyFields(host: any): { form: RenderForm; strategy: RenderStrategy; source: string } {
    const adapterMode = host?.options?.rendererAdapter?.options?.mode
        || host?.rendererAdapter?.options?.mode
        || null;
    if (adapterMode === "hybrid-back") {
        return { form: "leafer", strategy: "hybrid-back", source: "legacy:adapter-mode" };
    }
    if (adapterMode === "full-leafer") {
        return { form: "leafer", strategy: "full-leafer", source: "legacy:adapter-mode" };
    }

    const styleEngine = host?.options?.renderStyleEngine ?? host?.renderStyleEngine ?? "legacy";
    const styleProfile = host?.options?.renderStyleProfile ?? host?.renderStyleProfile ?? "legacy";
    if (styleEngine === "leafer-components" || String(styleProfile).startsWith("leafer-")) {
        return { form: "leafer", strategy: "full-leafer", source: "legacy:style" };
    }
    return { form: "legacy", strategy: "legacy", source: "legacy:default" };
}

export function resolveRenderMode(host: any) {
    const requestedForm = normalizeRenderForm(host?.options?.renderForm ?? host?.renderForm);
    const requestedStrategy = normalizeRenderStrategy(host?.options?.renderStrategy ?? host?.renderStrategy);

    let form: RenderForm;
    let strategy: RenderStrategy;
    let source = "new-fields";

    if (requestedForm || requestedStrategy) {
        form = requestedForm ?? (requestedStrategy === "legacy" ? "legacy" : "leafer");
        strategy = requestedStrategy ?? (form === "legacy" ? "legacy" : "full-leafer");
    } else {
        const legacy = resolveFromLegacyFields(host);
        form = legacy.form;
        strategy = legacy.strategy;
        source = legacy.source;
    }

    if (form === "legacy" || strategy === "legacy") {
        return createLegacyModeRuntime(source);
    }
    if (strategy === "hybrid-back") {
        return createHybridModeRuntime(source);
    }
    if (strategy === "decoupled-compat") {
        return createDecoupledCompatModeRuntime(source);
    }
    return createLeaferModeRuntime("full-leafer", source);
}
