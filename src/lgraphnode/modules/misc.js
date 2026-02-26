let LiteGraph = null;

export function setMiscMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const miscMethods = {
alignToGrid() {
        this.pos[0] =
            LiteGraph.CANVAS_GRID_SIZE *
            Math.round(this.pos[0] / LiteGraph.CANVAS_GRID_SIZE);
        this.pos[1] =
            LiteGraph.CANVAS_GRID_SIZE *
            Math.round(this.pos[1] / LiteGraph.CANVAS_GRID_SIZE);
    },
};
