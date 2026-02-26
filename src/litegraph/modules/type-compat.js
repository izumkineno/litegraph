let LiteGraph = null;

export function setTypeCompatMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const typeCompatMethods = {
isValidConnection(type_a, type_b) {
        if (type_a === "" || type_a === "*") type_a = 0;
        if (type_b === "" || type_b === "*") type_b = 0;

        if (!type_a || !type_b || type_a === type_b || (type_a === LiteGraph.EVENT && type_b === LiteGraph.ACTION)) {
            return true;
        }

        type_a = String(type_a).toLowerCase();
        type_b = String(type_b).toLowerCase();

        if (!type_a.includes(",") && !type_b.includes(",")) {
            return type_a === type_b;
        }

        const supported_types_a = type_a.split(",");
        const supported_types_b = type_b.split(",");

        for (const supported_type_a of supported_types_a) {
            for (const supported_type_b of supported_types_b) {
                if (this.isValidConnection(supported_type_a, supported_type_b)) {
                    return true;
                }
            }
        }

        return false;
    },
};
