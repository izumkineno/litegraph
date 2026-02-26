let LiteGraph = null;

export function setSlotTypesMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const slotTypesMethods = {
registerNodeAndSlotType(type, slot_type, out = false) {
        const base_class =
            type.constructor === String &&
            this.registered_node_types[type] !== "anonymous"
                ? this.registered_node_types[type]
                : type;

        const class_type = base_class.constructor.type;

        let allTypes = [];
        if (typeof slot_type === "string") {
            allTypes = slot_type.split(",");
        } else if (slot_type == this.EVENT || slot_type == this.ACTION) {
            allTypes = ["_event_"];
        } else {
            allTypes = ["*"];
        }

        for (let i = 0; i < allTypes.length; ++i) {
            let slotType = allTypes[i];
            if (slotType === "") {
                slotType = "*";
            }
            const registerTo = out
                ? "registered_slot_out_types"
                : "registered_slot_in_types";
            if (this[registerTo][slotType] === undefined) {
                this[registerTo][slotType] = { nodes: [] };
            }
            if (!this[registerTo][slotType].nodes.includes(class_type)) {
                this[registerTo][slotType].nodes.push(class_type);
            }

            // check if is a new type
            if (!out) {
                if (!this.slot_types_in.includes(slotType.toLowerCase())) {
                    this.slot_types_in.push(slotType.toLowerCase());
                    this.slot_types_in.sort();
                }
            } else {
                if (!this.slot_types_out.includes(slotType.toLowerCase())) {
                    this.slot_types_out.push(slotType.toLowerCase());
                    this.slot_types_out.sort();
                }
            }
        }
    },

registerSearchboxExtra(node_type, description, data) {
        this.searchbox_extras[description.toLowerCase()] = {
            type: node_type,
            desc: description,
            data: data,
        };
    },
};
