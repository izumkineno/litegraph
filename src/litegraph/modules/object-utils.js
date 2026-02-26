let LiteGraph = null;

export function setObjectUtilsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const objectUtilsMethods = {
cloneObject(obj, target) {
        if (obj == null) {
            return null;
        }

        const clonedObj = JSON.parse(JSON.stringify(obj));

        if (!target) {
            return clonedObj;
        }
        for (const key in clonedObj) {
            if (Object.prototype.hasOwnProperty.call(clonedObj, key)) {
                target[key] = clonedObj[key];
            }
        }
        return target;
    },

uuidv4() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g,(a) => (a^Math.random()*16>>a/4).toString(16));
    },

compareObjects(a, b) {
        const aKeys = Object.keys(a);

        if (aKeys.length !== Object.keys(b).length) {
            return false;
        }

        return aKeys.every((key) => a[key] === b[key]);
    },
};
