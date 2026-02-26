let LiteGraph = null;

export function setSlotsQueryMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const slotsQueryMethods = {
findInputSlot(name, returnObj) {
        if (!this.inputs) {
            return -1;
        }
        for (var i = 0, l = this.inputs.length; i < l; ++i) {
            if (name == this.inputs[i].name) {
                return !returnObj ? i : this.inputs[i];
            }
        }
        return -1;
    },

findOutputSlot(name, returnObj = false) {
        if (!this.outputs) {
            return -1;
        }
        for (var i = 0, l = this.outputs.length; i < l; ++i) {
            if (name == this.outputs[i].name) {
                return !returnObj ? i : this.outputs[i];
            }
        }
        return -1;
    },

findInputSlotFree(optsIn = {}) {
        var optsDef = {
            returnObj: false,
            typesNotAccepted: [],
        };
        var opts = Object.assign(optsDef,optsIn);
        if (!this.inputs) {
            return -1;
        }
        for (var i = 0, l = this.inputs.length; i < l; ++i) {
            if (this.inputs[i].link && this.inputs[i].link != null) {
                continue;
            }
            if (opts.typesNotAccepted && opts.typesNotAccepted.includes && opts.typesNotAccepted.includes(this.inputs[i].type)) {
                continue;
            }
            return !opts.returnObj ? i : this.inputs[i];
        }
        return -1;
    },

findOutputSlotFree(optsIn = {}) {
        var optsDef = {
            returnObj: false,
            typesNotAccepted: [],
        };
        var opts = Object.assign(optsDef,optsIn);
        if (!this.outputs) {
            return -1;
        }
        for (let i = 0, l = this.outputs.length; i < l; ++i) {
            if (this.outputs[i].links && this.outputs[i].links != null) {
                continue;
            }
            if (opts.typesNotAccepted && opts.typesNotAccepted.includes && opts.typesNotAccepted.includes(this.outputs[i].type)) {
                continue;
            }
            return !opts.returnObj ? i : this.outputs[i];
        }
        return -1;
    },

findInputSlotByType(type, returnObj, preferFreeSlot, doNotUseOccupied) {
        return this.findSlotByType(true, type, returnObj, preferFreeSlot, doNotUseOccupied);
    },

findOutputSlotByType(type, returnObj, preferFreeSlot, doNotUseOccupied) {
        return this.findSlotByType(false, type, returnObj, preferFreeSlot, doNotUseOccupied);
    },

findSlotByType(
        input = false,
        type,
        returnObj = false,
        preferFreeSlot = false,
        doNotUseOccupied = false,
    ) {
        var aSlots = input ? this.inputs : this.outputs;
        if (!aSlots) {
            return -1;
        }
        // !! empty string type is considered 0, * !!
        if (type == "" || type == "*") type = 0;
        for (let i = 0, l = aSlots.length; i < l; ++i) {
            let aSource = (type+"").toLowerCase().split(",");
            let aDest = aSlots[i].type=="0"||aSlots[i].type=="*"?"0":aSlots[i].type;
            aDest = (aDest+"").toLowerCase().split(",");
            for(let sI=0;sI<aSource.length;sI++) {
                for(let dI=0;dI<aDest.length;dI++) {
                    if (aSource[sI]=="_event_") aSource[sI] = LiteGraph.EVENT;
                    if (aDest[sI]=="_event_") aDest[sI] = LiteGraph.EVENT;
                    if (aSource[sI]=="*") aSource[sI] = 0;
                    if (aDest[sI]=="*") aDest[sI] = 0;
                    if (aSource[sI] == aDest[dI]) {
                        if (preferFreeSlot && aSlots[i].links && aSlots[i].links !== null) continue;
                        return !returnObj ? i : aSlots[i];
                    }
                }
            }
        }
        // if didnt find some, stop checking for free slots
        if (preferFreeSlot && !doNotUseOccupied) {
            for (let i = 0, l = aSlots.length; i < l; ++i) {
                let aSource = (type+"").toLowerCase().split(",");
                let aDest = aSlots[i].type=="0"||aSlots[i].type=="*"?"0":aSlots[i].type;
                aDest = (aDest+"").toLowerCase().split(",");
                for(let sI=0;sI<aSource.length;sI++) {
                    for(let dI=0;dI<aDest.length;dI++) {
                        if (aSource[sI]=="*") aSource[sI] = 0;
                        if (aDest[sI]=="*") aDest[sI] = 0;
                        if (aSource[sI] == aDest[dI]) {
                            return !returnObj ? i : aSlots[i];
                        }
                    }
                }
            }
        }
        return -1;
    },

getSlotInPosition(x, y) {
        // search for inputs
        var link_pos = new Float32Array(2);
        if (this.inputs) {
            for (let i = 0, l = this.inputs.length; i < l; ++i) {
                let input = this.inputs[i];
                this.getConnectionPos(true, i, link_pos);
                if (
                    LiteGraph.isInsideRectangle(
                        x,
                        y,
                        link_pos[0] - 10,
                        link_pos[1] - 5,
                        20,
                        10,
                    )
                ) {
                    return { input: input, slot: i, link_pos: link_pos };
                }
            }
        }

        if (this.outputs) {
            for (let i = 0, l = this.outputs.length; i < l; ++i) {
                let output = this.outputs[i];
                this.getConnectionPos(false, i, link_pos);
                if (
                    LiteGraph.isInsideRectangle(
                        x,
                        y,
                        link_pos[0] - 10,
                        link_pos[1] - 5,
                        20,
                        10,
                    )
                ) {
                    return { output: output, slot: i, link_pos: link_pos };
                }
            }
        }

        return null;
    },
};
