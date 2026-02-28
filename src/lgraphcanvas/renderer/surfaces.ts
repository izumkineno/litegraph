import { applyRenderContextCompatAliases } from "./contracts.js";
import type { LeaferCanvasLike, RenderContextLike } from "./leafer-types.ts";

/** 中文说明：Canvas2DSurface 为迁移后的 TS 导出类，封装 Leafer 渲染相关能力。 */
export class Canvas2DSurface {
    canvas: HTMLCanvasElement | null;
    _context: RenderContextLike | null;

    /**
     * @param {HTMLCanvasElement | null} canvas
     * @param {CanvasRenderingContext2D | null} context
     */
    constructor(canvas: HTMLCanvasElement | null, context: RenderContextLike | null = null) {
        this.canvas = canvas;
        this._context = context;
    }

    /**
     * @returns {CanvasRenderingContext2D | null}
     */
    getContextCompat(): RenderContextLike | null {
        if (!this._context && this.canvas?.getContext) {
            this._context = this.canvas.getContext("2d") as RenderContextLike | null;
        }
        return applyRenderContextCompatAliases(this._context) as RenderContextLike | null;
    }

    /**
     * @param {number} width
     * @param {number} height
     */
    resize(width: number, height: number): void {
        if (!this.canvas) {
            return;
        }
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

/** 中文说明：LeaferSurface 为迁移后的 TS 导出类，封装 Leafer 渲染相关能力。 */
export class LeaferSurface {
    leaferCanvas: LeaferCanvasLike | null;
    canvas: HTMLCanvasElement | null;

    /**
     * @param {any} leaferCanvas
     */
    constructor(leaferCanvas: LeaferCanvasLike | null) {
        this.leaferCanvas = leaferCanvas;
        this.canvas = leaferCanvas?.view ?? null;
    }

    /**
     * @returns {any}
     */
    getContextCompat(): RenderContextLike | null {
        const ctx = this.leaferCanvas?.context ?? null;
        return applyRenderContextCompatAliases(ctx) as RenderContextLike | null;
    }

    /**
     * @param {number} width
     * @param {number} height
     */
    resize(width: number, height: number): void {
        if (!this.leaferCanvas) {
            return;
        }

        if (typeof this.leaferCanvas.resize === "function") {
            const nextSize: { width: number; height: number; pixelRatio?: number } = { width, height };
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




