export function applyUiDefaults(liteGraph) {
    liteGraph.searchbox_extras = {};
    liteGraph.auto_sort_node_types = false;

    liteGraph.node_box_coloured_when_on = false;
    liteGraph.node_box_coloured_by_mode = false;

    liteGraph.dialog_close_on_mouse_leave = true;
    liteGraph.dialog_close_on_mouse_leave_delay = 500;

    liteGraph.search_hide_on_mouse_leave = true;
    liteGraph.search_filter_enabled = false;
    liteGraph.search_show_all_on_open = true;

    liteGraph.show_node_tooltip = false;
    liteGraph.show_node_tooltip_use_descr_property = false;

    liteGraph.showCanvasOptions = false;
    liteGraph.availableCanvasOptions = [
        "allow_addOutSlot_onExecuted",
        "free_resize",
        "highquality_render",
        "use_gradients",
        "pause_rendering",
        "clear_background",
        "read_only",
        "live_mode",
        "show_info",
        "allow_dragcanvas",
        "allow_dragnodes",
        "allow_interaction",
        "allow_searchbox",
        "move_destination_link_without_shift",
        "set_canvas_dirty_on_mouse_event",
        "always_render_background",
        "render_shadows",
        "render_canvas_border",
        "render_connections_shadows",
        "render_connections_border",
        "render_connection_arrows",
        "render_collapsed_slots",
        "render_execution_order",
        "render_title_colored",
        "render_link_tooltip",
    ];
}
