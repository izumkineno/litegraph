export const RENDER_CONTEXT_COMPAT_METHODS = Object.freeze([
    "save",
    "restore",
    "setTransform",
    "translate",
    "scale",
    "rotate",
    "beginPath",
    "closePath",
    "moveTo",
    "lineTo",
    "bezierCurveTo",
    "arc",
    "rect",
    "roundRect",
    "clip",
    "fill",
    "stroke",
    "clearRect",
    "fillRect",
    "strokeRect",
    "drawImage",
    "createPattern",
    "createLinearGradient",
    "fillText",
    "measureText",
]);

export const RENDER_CONTEXT_COMPAT_PROPERTIES = Object.freeze([
    "canvas",
    "font",
    "textAlign",
    "fillStyle",
    "strokeStyle",
    "lineWidth",
    "lineJoin",
    "globalAlpha",
    "shadowColor",
    "shadowOffsetX",
    "shadowOffsetY",
    "shadowBlur",
    "imageSmoothingEnabled",
    "globalCompositeOperation",
]);

/**
 * @typedef {CanvasRenderingContext2D & {
 *  start?: () => void,
 *  finish?: () => void,
 *  start2D?: () => void,
 *  finish2D?: () => void,
 *  mozImageSmoothingEnabled?: boolean
 * }} IRenderContext2DCompat
 */

/**
 * @typedef {{
 *  canvas: HTMLCanvasElement,
 *  getContextCompat: () => IRenderContext2DCompat | null,
 *  resize: (width: number, height: number) => void
 * }} IRenderSurface
 */

/**
 * @typedef {{
 *  init: (options: { canvas: HTMLCanvasElement, ownerDocument?: Document }) => any,
 *  destroy?: () => void,
 *  resize: (width: number, height: number) => void,
 *  beginFrame?: (layer: "front" | "back") => void,
 *  endFrame?: (layer: "front" | "back") => void,
 *  isLayerNative?: (layer: "front" | "back") => boolean,
 *  syncLayer?: (layer: "front" | "back") => void,
 *  getFrontCtx: () => IRenderContext2DCompat | null,
 *  getBackCtx: () => IRenderContext2DCompat | null,
 *  getFrontSurface: () => IRenderSurface | null,
 *  getBackSurface: () => IRenderSurface | null,
 *  blitBackToFront?: (targetCtx?: IRenderContext2DCompat | null) => void,
 *  adoptExternalContexts?: (options: {
 *      frontCanvas: HTMLCanvasElement,
 *      backCanvas: HTMLCanvasElement,
 *      frontContext: IRenderContext2DCompat,
 *      backContext: IRenderContext2DCompat
 *  }) => void
 * }} IRenderEngineAdapter
 */

/**
 * Adds optional compatibility aliases without changing the context behavior.
 * @param {CanvasRenderingContext2D | object | null | undefined} ctx
 * @returns {any}
 */
export function applyRenderContextCompatAliases(ctx) {
    if (!ctx || typeof ctx !== "object") {
        return ctx;
    }

    const hasImageSmoothing = "imageSmoothingEnabled" in ctx;
    const hasMozSmoothing = "mozImageSmoothingEnabled" in ctx;
    if (hasImageSmoothing && !hasMozSmoothing) {
        Object.defineProperty(ctx, "mozImageSmoothingEnabled", {
            enumerable: false,
            configurable: true,
            get() {
                return ctx.imageSmoothingEnabled;
            },
            set(value) {
                ctx.imageSmoothingEnabled = value;
            },
        });
    }
    return ctx;
}

/**
 * Verifies that a rendering context satisfies the frozen Canvas2D compatibility baseline.
 * @param {CanvasRenderingContext2D | object | null | undefined} ctx
 * @returns {{ ok: boolean, missingMethods: string[], missingProperties: string[] }}
 */
export function validateRenderContext2DCompat(ctx) {
    if (!ctx || typeof ctx !== "object") {
        return {
            ok: false,
            missingMethods: [...RENDER_CONTEXT_COMPAT_METHODS],
            missingProperties: [...RENDER_CONTEXT_COMPAT_PROPERTIES],
        };
    }

    const missingMethods = RENDER_CONTEXT_COMPAT_METHODS.filter((name) => typeof ctx[name] !== "function");
    const missingProperties = RENDER_CONTEXT_COMPAT_PROPERTIES.filter((name) => !(name in ctx));
    return {
        ok: missingMethods.length === 0 && missingProperties.length === 0,
        missingMethods,
        missingProperties,
    };
}
