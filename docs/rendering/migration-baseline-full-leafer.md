# Full-Leafer Migration Baseline

## Scope

This baseline freezes the runtime behavior before full layer migration for these modules:

- `src/lgraphcanvas/modules/render-background-groups.js`
- `src/lgraphcanvas/modules/render-links.js`
- `src/lgraphcanvas/modules/render-frame.ts` (overlay section)

## Runtime mode target

- Primary target: `renderForm=leafer`, `renderStrategy=full-leafer`
- Secondary compatibility: `legacy`, `hybrid-back`, `decoupled-compat`

## Layer routing baseline

- Back layer route: `leafer-back-layer.ts` (fallback to legacy draw function)
- Link layer route: `leafer-link-layer.ts` (fallback to legacy draw function)
- Overlay route: `leafer-overlay-layer.ts` (fallback to legacy draw function)
- Panel/HUD route: `leafer-panel-layer.ts` (fallback to legacy draw function)

## Acceptance demos

- Features
- Benchmark
- Subgraph
- MIDI Generation
- Widget Components Test
- Copy Paste

## Functional checks

1. Zoom/pan still updates links, groups, and overlays correctly.
2. Drag link preview and slot highlighting still work.
3. `Play/Step` updates dynamic widgets and plot/custom draw nodes.
4. Subgraph panel buttons still create graph input/output nodes.
5. No new console errors.

## Context7 API anchors

- `Group.add/remove/clear/addAt`
- `Canvas.context` + `paint()` after direct context drawing
- `forceRender(bounds?, sync?)` for synchronous refresh

## Runtime counters

`host._leaferLayerStats` is expected to exist when layer routes execute:

- `back.calls / fallbackCalls / totalMs / errors`
- `link.calls / fallbackCalls / totalMs / errors`
- `overlay.calls / fallbackCalls / totalMs / errors`
- `panel.calls / fallbackCalls / totalMs / errors`
