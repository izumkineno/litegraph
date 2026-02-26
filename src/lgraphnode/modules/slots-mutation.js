let LiteGraph = null;

export function setSlotsMutationMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const slotsMutationMethods = {
setSize(size) {
        this.size = size;
        this.onResize?.(this.size);
    },

addInput(name, type, extra_info) {
        return this.addSlot(name, type, extra_info, true);
    },

addOutput(name, type, extra_info) {
        return this.addSlot(name, type, extra_info, false);
    },

addSlot(name, type, extra_info, isInput) {
        const slot = isInput ?
            { name, type, link: null, ...extra_info }:
            { name, type, links: null, ...extra_info };
        if (isInput) {
            this.inputs = this.inputs ?? [];
            this.inputs.push(slot);
            this.onInputAdded?.(slot);
            LiteGraph.registerNodeAndSlotType(this, type);
        } else {
            this.outputs = this.outputs ?? [];
            this.outputs.push(slot);
            this.onOutputAdded?.(slot);
            if (LiteGraph.auto_load_slot_types) {
                LiteGraph.registerNodeAndSlotType(this, type, true);
            }
        }

        this.setSize(this.computeSize());
        this.setDirtyCanvas(true, true);
        return slot;
    },

addInputs(array) {
        this.addSlots(array, true);
    },

addOutputs(array) {
        this.addSlots(array, false);
    },

addSlots(array, isInput) {
        if(typeof array === 'string')
            array = [array];

        array.forEach((info) => {
            const slot = isInput ? {
                name: info[0],
                type: info[1],
                link: null,
                ...(info[2] ?? {}),
            } : {
                name: info[0],
                type: info[1],
                links: null,
                ...(info[2] ?? {}),
            };

            if (isInput) {
                this.inputs = this.inputs ?? [];
                this.inputs.push(slot);
                this.onInputAdded?.(slot);
                LiteGraph.registerNodeAndSlotType(this, info[1]);
            } else {
                this.outputs = this.outputs ?? [];
                this.outputs.push(slot);
                this.onOutputAdded?.(slot);
                if (LiteGraph.auto_load_slot_types) {
                    LiteGraph.registerNodeAndSlotType(this, info[1], true);
                }
            }
        });

        this.setSize(this.computeSize());
        this.setDirtyCanvas?.(true, true);
    },

removeInput(slot) {
        this.disconnectInput(slot);
        const removedInput = this.inputs.splice(slot, 1)[0];

        this.inputs.slice(slot).filter((input) => !!input).forEach((input) => {
            const link = this.graph.links[input.link];
            link?.target_slot && link.target_slot--;
        });

        this.setSize(this.computeSize());
        this.onInputRemoved?.(slot, removedInput);
        this.setDirtyCanvas(true, true);
    },

removeOutput(slot) {
        this.disconnectOutput(slot);
        this.outputs = this.outputs.filter((_, index) => index !== slot);

        this.outputs.slice(slot).forEach((output) => {
            if (!output || !output.links) {
                return;
            }

            output.links.forEach((linkId) => {
                const link = this.graph.links[linkId];
                if (link) {
                    link.origin_slot -= 1;
                }
            });
        });

        this.setSize(this.computeSize());
        this.onOutputRemoved?.(slot);
        this.setDirtyCanvas(true, true);
    },

addConnection(name, type, pos, direction) {
        var o = {
            name: name,
            type: type,
            pos: pos,
            direction: direction,
            links: null,
        };
        this.connections.push(o);
        return o;
    },
};
