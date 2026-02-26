export function applyBehaviorDefaults(liteGraph) {
    liteGraph.shift_click_do_break_link_from = false;
    liteGraph.click_do_break_link_to = false;

    liteGraph.pointer_to_mouse_events = Object.freeze({
        pointerdown: "mousedown",
        pointermove: "mousemove",
        pointerup: "mouseup",
        pointercancel: "mouseup",
        pointerover: "mouseover",
        pointerout: "mouseout",
        pointerenter: "mouseenter",
        pointerleave: "mouseleave",
    });

    liteGraph.mouse_to_pointer_events = Object.freeze({
        mousedown: "pointerdown",
        mousemove: "pointermove",
        mouseup: "pointerup",
        mouseover: "pointerover",
        mouseout: "pointerout",
        mouseenter: "pointerenter",
        mouseleave: "pointerleave",
    });

    liteGraph.applyPointerDefaults();

    liteGraph.alt_drag_do_clone_nodes = false;
    liteGraph.alt_shift_drag_connect_clone_with_input = true;

    liteGraph.do_add_triggers_slots = false;

    liteGraph.allow_multi_output_for_events = true;

    liteGraph.middle_click_slot_add_default_node = false;

    liteGraph.release_link_on_empty_shows_menu = false;
    liteGraph.two_fingers_opens_menu = false;

    liteGraph.backspace_delete = true;

    liteGraph.ctrl_shift_v_paste_connect_unselected_outputs = false;

    liteGraph.actionHistory_enabled = false;
    liteGraph.actionHistoryMaxSave = 40;

    liteGraph.refreshAncestorsOnTriggers = false;
    liteGraph.refreshAncestorsOnActions = false;
    liteGraph.ensureUniqueExecutionAndActionCall = false;

    liteGraph.use_uuids = false;

    liteGraph.context_menu_filter_enabled = false;

    liteGraph.actionHistoryMaxSave = 40;

    liteGraph.canRemoveSlots = true;
    liteGraph.canRemoveSlots_onlyOptional = true;
    liteGraph.canRenameSlots = true;
    liteGraph.canRenameSlots_onlyOptional = true;

    liteGraph.ensureNodeSingleExecution = false;
    liteGraph.ensureNodeSingleAction = false;
    liteGraph.preventAncestorRecalculation = false;

    liteGraph.ensureUniqueExecutionAndActionCall = true;

    liteGraph.allowMultiOutputForEvents = false;

    liteGraph.log_methods = ["error", "warn", "info", "log", "debug"];
}
