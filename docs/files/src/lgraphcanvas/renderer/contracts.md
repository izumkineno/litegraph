# 文件文档：`src/lgraphcanvas/renderer/contracts.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/renderer`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/renderer` 的职责为：模块化源码目录，承载同一子域下的实现。
> 规模：包含 8 个文件，导出 14 项（AUTO 4 项），耦合强度 8。
> 关键耦合：出边 `src/lgraphcanvas/renderer/leafer-components`(2)、`src`(1)；入边 `src`(3)、`src/lgraphcanvas/modules`(2)。
> 主要导出：`applyRenderContextCompatAliases`、`Canvas2DAdapter`、`Canvas2DRendererAdapter`、`Canvas2DSurface`、`LeaferAdapter`、`LeaferNodeUiLayer`。
> 代表文件：`canvas2d-adapter.js`、`contracts.js`、`leafer-node-ui-layer.js`。

- 导出项数量：4
- AUTO 说明数量：2

## 1. `RENDER_CONTEXT_COMPAT_METHODS`

- 类型：`variable`
- 位置：`src/lgraphcanvas/renderer/contracts.js:1-27` (`#L1`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `RENDER_CONTEXT_COMPAT_METHODS`（const），定义于 `src/lgraphcanvas/renderer/contracts.js`。

- 代码片段（L1-L20）：
```js
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
```

> 片段已按最大行数裁剪。

## 2. `RENDER_CONTEXT_COMPAT_PROPERTIES`

- 类型：`variable`
- 位置：`src/lgraphcanvas/renderer/contracts.js:29-43` (`#L29`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出变量 `RENDER_CONTEXT_COMPAT_PROPERTIES`（const），定义于 `src/lgraphcanvas/renderer/contracts.js`。

- 代码片段（L29-L43）：
```js
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
]);
```

## 3. `applyRenderContextCompatAliases`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/contracts.js:91-111` (`#L91`)
- 说明来源：源码注释
- 说明：
> Adds optional compatibility aliases without changing the context behavior.
> @param {CanvasRenderingContext2D | object | null | undefined} ctx
> @returns {any}

- 代码片段（L91-L110）：
```js
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
```

> 片段已按最大行数裁剪。

## 4. `validateRenderContext2DCompat`

- 类型：`function`
- 位置：`src/lgraphcanvas/renderer/contracts.js:118-134` (`#L118`)
- 说明来源：源码注释
- 说明：
> Verifies that a rendering context satisfies the frozen Canvas2D compatibility baseline.
> @param {CanvasRenderingContext2D | object | null | undefined} ctx
> @returns {{ ok: boolean, missingMethods: string[], missingProperties: string[] }}

- 代码片段（L118-L134）：
```js
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
```
