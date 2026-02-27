import { applyRenderContextCompatAliases } from "./contracts.js";

export class Canvas2DSurface {
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

export class LeaferSurface {
    /**
     * @param {any} leaferCanvas
     */
    constructor(leaferCanvas) {
        this.leaferCanvas = leaferCanvas;
        this.canvas = leaferCanvas?.view ?? null;
    }

    /**
     * @returns {any}
     */
    getContextCompat() {
        const ctx = this.leaferCanvas?.context ?? null;
        return applyRenderContextCompatAliases(ctx);
    }

    /**
     * @param {number} width
     * @param {number} height
     */
    resize(width, height) {
        if (!this.leaferCanvas) {
            return;
        }

        if (typeof this.leaferCanvas.resize === "function") {
            const nextSize = { width, height };
            if (typeof this.leaferCanvas.pixelRatio === "number") {
                nextSize.pixelRatio = this.leaferCanvas.pixelRatio;
            }
            this.leaferCanvas.resize(nextSize);
        } else if (this.canvas) {
            this.canvas.width = width;
            this.canvas.height = height;
        }

        this.canvas = this.leaferCanvas?.view ?? this.canvas;
    }
}
