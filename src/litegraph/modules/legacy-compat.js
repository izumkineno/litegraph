let LiteGraph = null;

export function setLegacyCompatMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const legacyCompatMethods = {
closeAllContextMenus: () => {
        LiteGraph.warn('LiteGraph.closeAllContextMenus is deprecated in favor of LiteGraph.ContextMenu.closeAll()');
        LiteGraph.ContextMenu.closeAll();
    },
};
