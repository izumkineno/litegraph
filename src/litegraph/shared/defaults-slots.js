export function applySlotsDefaults(liteGraph) {
    liteGraph.auto_load_slot_types = false;

    liteGraph.registered_slot_in_types = {};
    liteGraph.registered_slot_out_types = {};
    liteGraph.slot_types_in = [];
    liteGraph.slot_types_out = [];
    liteGraph.slot_types_default_in = [];
    liteGraph.slot_types_default_out = [];

    liteGraph.graphDefaultConfig = {
        align_to_grid: true,
        links_ontop: false,
    };
}
