import { applyRenderContextCompatAliases } from "./contracts.js";
import { Canvas2DSurface, LeaferSurface } from "./surfaces.js";

/**
 * @typedef {{
 *  mode?: "hybrid-back" | "full-leafer",
 *  leaferRuntime?: any,
 *  enableLogs?: boolean,
 *  logPrefix?: string
 * }} LeaferUIRendererAdapterOptions
 */

function resolveLeaferRuntime(options) {
    return options?.leaferRuntime ?? globalThis.LeaferUI ?? null;
}

function ensureLeaferCanvasRuntime(runtime) {
    const LeaferCanvas = runtime?.LeaferCanvas;
    if (typeof LeaferCanvas !== "function") {
        throw new Error("LeaferUI runtime is not available. Provide options.leaferRuntime or set globalThis.LeaferUI.");
    }
    return LeaferCanvas;
}

function createCanvasElement(ownerDocument, fallbackCanvas) {
    if (ownerDocument?.createElement) {
        return ownerDocument.createElement("canvas");
    }
    if (typeof document !== "undefined" && document.createElement) {
        return document.createElement("canvas");
    }
    if (fallbackCanvas) {
        return fallbackCanvas;
    }
    throw new Error("Unable to create canvas element for Leafer surface.");
}

function createLeaferCanvas(LeaferCanvas, viewCanvas, width, height, hittable) {
    return new LeaferCanvas({
        view: viewCanvas,
        width,
        height,
        hittable,
    });
}

/**
 * Leafer-based renderer adapter.
 * Hybrid mode keeps front layer on Canvas2D and uses Leafer for back layer.
 */
export class LeaferUIRendererAdapter {
    /**
     * @param {LeaferUIRendererAdapterOptions} options
     */
    constructor(options = {}) {
        this.options = {
            mode: "hybrid-back",
            enableLogs: true,
            logPrefix: "[LiteGraph][LeaferAdapter]",
            ...options,
        };
        this.ownerDocument = null;
        this.mode = this.options.mode || "hybrid-back";
        this.frontSurface = null;
        this.backSurface = null;
        this._frontLeaferCanvas = null;
        this._backLeaferCanvas = null;
    }

    _log(level, message, meta) {
        if (!this.options?.enableLogs) {
            return;
        }
        const logger = console?.[level] || console?.log;
        if (!logger) {
            return;
        }
        const prefix = this.options?.logPrefix || "[LiteGraph][LeaferAdapter]";
        if (meta !== undefined) {
            logger(`${prefix} ${message}`, meta);
            return;
        }
        logger(`${prefix} ${message}`);
    }

    /**
     * @param {{ canvas: HTMLCanvasElement, ownerDocument?: Document }} options
     * @returns {LeaferUIRendererAdapter}
     */
    init({ canvas, ownerDocument }) {
        const runtimeSource = this.options?.leaferRuntime ? "options.leaferRuntime" : "globalThis.LeaferUI";
        this._log("info", "init start", {
            mode: this.options.mode || "hybrid-back",
            runtimeSource,
        });
        this.destroy();

        this.ownerDocument = ownerDocument ?? canvas?.ownerDocument ?? null;
        this.mode = this.options.mode || "hybrid-back";

        const runtime = resolveLeaferRuntime(this.options);
        const LeaferCanvas = ensureLeaferCanvasRuntime(runtime);
        const width = canvas.width;
        const height = canvas.height;

        if (this.mode === "full-leafer") {
            this._frontLeaferCanvas = createLeaferCanvas(LeaferCanvas, canvas, width, height, true);
            this.frontSurface = new LeaferSurface(this._frontLeaferCanvas);
            this._log("info", "front surface created with LeaferCanvas", {
                width,
                height,
            });
        } else {
            this.frontSurface = new Canvas2DSurface(canvas);
            this._log("info", "front surface created with Canvas2D (hybrid mode)", {
                width,
                height,
            });
        }

        const backCanvas = createCanvasElement(this.ownerDocument, canvas);
        backCanvas.width = width;
        backCanvas.height = height;
        this._backLeaferCanvas = createLeaferCanvas(LeaferCanvas, backCanvas, width, height, false);
        this.backSurface = new LeaferSurface(this._backLeaferCanvas);
        this._log("info", "back surface created with LeaferCanvas", {
            width,
            height,
        });

        this.getFrontCtx();
        this.getBackCtx();
        this._log("info", "init complete", {
            mode: this.mode,
            frontCanvasShared: this.frontSurface?.canvas === canvas,
            backCanvasShared: this.backSurface?.canvas === canvas,
        });
        return this;
    }

    destroy() {
        const hasFront = Boolean(this._frontLeaferCanvas);
        const hasBack = Boolean(this._backLeaferCanvas);
        this._frontLeaferCanvas?.destroy?.();
        this._backLeaferCanvas?.destroy?.();
        this._frontLeaferCanvas = null;
        this._backLeaferCanvas = null;
        this.frontSurface = null;
        this.backSurface = null;
        if (hasFront || hasBack) {
            this._log("info", "destroy complete", {
                destroyedFrontLeafer: hasFront,
                destroyedBackLeafer: hasBack,
            });
        }
    }

    /**
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        this.frontSurface?.resize(width, height);
        this.backSurface?.resize(width, height);
        this._log("info", "resize", {
            width,
            height,
            mode: this.mode,
        });
    }

    /**
     * @param {"front" | "back"} _layer
     */
    beginFrame(_layer) {
    }

    /**
     * @param {"front" | "back"} _layer
     */
    endFrame(_layer) {
    }

    /**
     * @param {"front" | "back"} layer
     * @returns {boolean}
     */
    isLayerNative(layer) {
        if (layer === "front") {
            return this.mode === "full-leafer";
        }
        return true;
    }

    /**
     * @param {"front" | "back"} _layer
     */
    syncLayer(_layer) {
        // Reserved for future explicit flush requirements in native layers.
    }

    getFrontCtx() {
        return applyRenderContextCompatAliases(this.frontSurface?.getContextCompat?.() ?? null);
    }

    getBackCtx() {
        return applyRenderContextCompatAliases(this.backSurface?.getContextCompat?.() ?? null);
    }

    getFrontSurface() {
        return this.frontSurface;
    }

    getBackSurface() {
        return this.backSurface;
    }

    /**
     * @param {any} targetCtx
     */
    blitBackToFront(targetCtx = this.getFrontCtx()) {
        const frontCanvas = this.frontSurface?.canvas;
        const backCanvas = this.backSurface?.canvas;
        if (!targetCtx || !frontCanvas || !backCanvas || backCanvas === frontCanvas) {
            return;
        }
        if (typeof targetCtx.drawImage === "function") {
            targetCtx.drawImage(backCanvas, 0, 0);
        }
    }

    /**
     * @param {{
     *  frontCanvas: HTMLCanvasElement,
     *  backCanvas: HTMLCanvasElement,
     *  frontContext: any,
     *  backContext: any
     * }} options
     */
    adoptExternalContexts({ frontCanvas, backCanvas, frontContext, backContext }) {
        this._log("warn", "adopting external contexts (legacy/webgl interoperability path)");
        this.destroy();
        this.mode = "external";
        this.frontSurface = new Canvas2DSurface(frontCanvas, frontContext);
        this.backSurface = new Canvas2DSurface(backCanvas, backContext);
        this.getFrontCtx();
        this.getBackCtx();
        this._log("info", "external contexts adopted", {
            sharedCanvas: frontCanvas === backCanvas,
        });
    }
}

export { LeaferUIRendererAdapter as LeaferAdapter };
