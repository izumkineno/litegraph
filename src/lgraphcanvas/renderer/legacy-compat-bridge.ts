import type { CallbackLayerCtx, LeaferHostLike, LeaferNodeLike, RenderContextLike } from "./leafer-types.ts";

function ensureRoundRectCompat(ctx: RenderContextLike | null | undefined): void {
    if (!ctx || typeof ctx.roundRect === "function") {
        return;
    }
    if (typeof ctx.rect === "function") {
        ctx.roundRect = function roundRectFallback(x, y, width, height) {
            this.rect(x, y, width, height);
        };
        return;
    }
    ctx.roundRect = function roundRectNoop() {
    };
}

interface LegacyCallbackEntry {
    fn?: ((...args: unknown[]) => unknown) | null;
    scope?: unknown;
    args?: unknown[];
}

export function runNodeLegacyCallbacks(options: {
    canvasLayer: CallbackLayerCtx | null | undefined;
    scale: number;
    titleHeight: number;
    translateX?: number;
    translateY?: number;
    callbacks: LegacyCallbackEntry[];
}): unknown[] {
    const canvasLayer = options.canvasLayer;
    const ctx = canvasLayer?.context;
    if (!ctx || !Array.isArray(options.callbacks) || options.callbacks.length === 0) {
        return [];
    }

    ensureRoundRectCompat(ctx);
    const width = canvasLayer?.width ?? ctx.canvas?.width ?? 0;
    const height = canvasLayer?.height ?? ctx.canvas?.height ?? 0;

    ctx.save?.();
    ctx.setTransform?.(1, 0, 0, 1, 0, 0);
    ctx.clearRect?.(0, 0, width, height);
    const translateX = Number.isFinite(options.translateX) ? Number(options.translateX) : 0;
    const translateY = Number.isFinite(options.translateY) ? Number(options.translateY) : options.titleHeight;
    ctx.scale?.(options.scale, options.scale);
    ctx.translate?.(translateX, translateY);

    const results: unknown[] = [];
    for (const entry of options.callbacks) {
        if (typeof entry?.fn !== "function") {
            continue;
        }
        results.push(entry.fn.apply(entry.scope ?? null, entry.args ?? []));
    }
    ctx.restore?.();
    canvasLayer?.paint?.();
    return results;
}

export function runWidgetLegacyDraws(options: {
    canvasLayer: CallbackLayerCtx | null | undefined;
    drawFns: Array<(ctx: RenderContextLike, node: LeaferNodeLike) => void>;
    node: LeaferNodeLike;
    scale: number;
    titleHeight: number;
    translateX?: number;
    translateY?: number;
}): void {
    const canvasLayer = options.canvasLayer;
    const ctx = canvasLayer?.context;
    if (!ctx || !options.drawFns?.length) {
        return;
    }

    ensureRoundRectCompat(ctx);
    ctx.save?.();
    const translateX = Number.isFinite(options.translateX) ? Number(options.translateX) : 0;
    const translateY = Number.isFinite(options.translateY) ? Number(options.translateY) : options.titleHeight;
    ctx.scale?.(options.scale, options.scale);
    ctx.translate?.(translateX, translateY);
    for (const drawFn of options.drawFns) {
        drawFn(ctx, options.node);
    }
    ctx.restore?.();
    canvasLayer?.paint?.();
}

export function runNodeLegacyFallback(options: {
    ctx: RenderContextLike | null | undefined;
    node: LeaferNodeLike;
    host: LeaferHostLike;
    drawLegacyWithCtx: (ctx: RenderContextLike) => void;
}): void {
    const ctx = options.ctx;
    if (!ctx || typeof options.drawLegacyWithCtx !== "function") {
        return;
    }

    ensureRoundRectCompat(ctx);
    const scale = options.host?.ds?.scale || 1;
    const offset = options.host?.ds?.offset || [0, 0];
    const nodeX = options.node?.pos?.[0] || 0;
    const nodeY = options.node?.pos?.[1] || 0;
    ctx.save?.();
    ctx.scale?.(scale, scale);
    ctx.translate?.(nodeX + offset[0], nodeY + offset[1]);
    options.drawLegacyWithCtx(ctx);
    ctx.restore?.();
}
