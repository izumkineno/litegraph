let LiteGraph = null;

export function setNodeQueryMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const nodeQueryMethods = {
getNodeById(id) {
        if (id == null) {
            return null;
        }
        return this._nodes_by_id[id];
    },

findNodesByClass(classObject, result = []) {
        result = this._nodes.filter((node) => node.constructor === classObject);
        return result;
    },

findNodesByType(type, result = []) {
        const lowerCaseType = type.toLowerCase();
        result = this._nodes.filter((node) => node.type.toLowerCase() === lowerCaseType);
        return result;
    },

findNodeByTitle(title) {
        return this._nodes.find((node) => node.title === title) ?? null;
    },

findNodesByTitle(title) {
        return this._nodes.filter((node) => node.title === title);
    },

getNodeOnPos(x, y, nodes_list = this._nodes, margin = 0) {
        return nodes_list.reverse().find((node) => node.isPointInside(x, y, margin)) ?? null;
    },

getGroupOnPos(x, y) {
        return this._groups.find((group) => group.isPointInside(x, y, 2, true)) ?? null;
    },
};
