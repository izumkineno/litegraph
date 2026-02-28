/**
 * Browser smoke probe for full-leafer mode.
 *
 * Usage (paste in DevTools console on editor page):
 *   window.__litegraphFullLeaferProbe.run()
 */
(function bootstrapProbe(global) {
    const probe = {
        run() {
            const gc = global.graphcanvas || global.editor?.graphcanvas;
            if (!gc) {
                return { ok: false, reason: "graphcanvas not found" };
            }
            const stats = gc._leaferLayerStats || null;
            const runtime = gc._renderModeRuntime || null;
            const nodes = gc.graph?._nodes?.length || 0;
            const links = gc.graph?.links ? Object.keys(gc.graph.links).length : 0;
            return {
                ok: true,
                runtime,
                nodes,
                links,
                layerStats: stats,
                dirty: {
                    fg: Boolean(gc.dirty_canvas),
                    bg: Boolean(gc.dirty_bgcanvas),
                },
            };
        },
    };

    global.__litegraphFullLeaferProbe = probe;
})(globalThis);
