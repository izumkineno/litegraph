import { applyRenderContextCompatAliases } from "./contracts.js";

class Canvas2DSurface {
    /**
     * @param {HTMLCanvasElement | null} canvas
     * @param {CanvasRenderingContext2D | null} context
     */
    constructor(canvas, context = null) {
        this.canvas = canvas;
        this._context = context;
    }

    /**
     * @returns {CanvasRenderingContext2D | null}
     */
    getContextCompat() {
        if (!this._context && this.canvas?.getContext) {
            this._context = this.canvas.getContext("2d");
        }
        return applyRenderContextCompatAliases(this._context);
    }

    /**
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        if (!this.canvas) {
            return;
        }
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

/**
 * Default renderer adapter that preserves existing Canvas2D behavior.
 */
export class Canvas2DRendererAdapter {
    constructor() {
        this.ownerDocument = null;
        this.frontSurface = null;
        this.backSurface = null;
    }

    /**
     * @param {{ canvas: HTMLCanvasElement, ownerDocument?: Document }} options
     * @returns {Canvas2DRendererAdapter}
     */
    init({ canvas, ownerDocument }) {
        this.ownerDocument = ownerDocument ?? canvas?.ownerDocument ?? null;
        this.frontSurface = new Canvas2DSurface(canvas);

        const backCanvas = this.ownerDocument?.createElement
            ? this.ownerDocument.createElement("canvas")
            : document.createElement("canvas");
        backCanvas.width = canvas.width;
        backCanvas.height = canvas.height;
        this.backSurface = new Canvas2DSurface(backCanvas);

        this.getFrontCtx();
        this.getBackCtx();
        return this;
    }

    destroy() {
        this.frontSurface = null;
        this.backSurface = null;
    }

    /**
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        this.frontSurface?.resize(width, height);
        this.backSurface?.resize(width, height);
    }

    /**
     * @param {"front" | "back"} layer
     */
    beginFrame(_layer) {
    }

    /**
     * @param {"front" | "back"} layer
     */
    endFrame(_layer) {
    }

    /**
     * @returns {CanvasRenderingContext2D | null}
     */
    getFrontCtx() {
        return this.frontSurface?.getContextCompat() ?? null;
    }

    /**
     * @returns {CanvasRenderingContext2D | null}
     */
    getBackCtx() {
        return this.backSurface?.getContextCompat() ?? null;
    }

    getFrontSurface() {
        return this.frontSurface;
    }

    getBackSurface() {
        return this.backSurface;
    }

    /**
     * @param {CanvasRenderingContext2D | null} targetCtx
     */
    blitBackToFront(targetCtx = this.getFrontCtx()) {
        const frontCanvas = this.frontSurface?.canvas;
        const backCanvas = this.backSurface?.canvas;
        if (!targetCtx || !frontCanvas || !backCanvas || backCanvas === frontCanvas) {
            return;
        }
        targetCtx.drawImage(backCanvas, 0, 0);
    }

    /**
     * Allows legacy WebGL mode to reuse the adapter holder with shared surfaces.
     * @param {{
     *  frontCanvas: HTMLCanvasElement,
     *  backCanvas: HTMLCanvasElement,
     *  frontContext: CanvasRenderingContext2D,
     *  backContext: CanvasRenderingContext2D
     * }} options
     */
    adoptExternalContexts({ frontCanvas, backCanvas, frontContext, backContext }) {
        this.frontSurface = new Canvas2DSurface(frontCanvas, frontContext);
        this.backSurface = new Canvas2DSurface(backCanvas, backContext);
        this.getFrontCtx();
        this.getBackCtx();
    }
}

export { Canvas2DRendererAdapter as Canvas2DAdapter };
