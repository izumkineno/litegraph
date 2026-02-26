export function initializeGraphState(graph) {
    graph.last_node_id = 0;
    graph.last_link_id = 0;
    graph._version = -1;

    graph._nodes = [];
    graph._nodes_by_id = {};
    graph._nodes_in_order = [];
    graph._nodes_executable = null;

    graph._groups = [];
    graph.links = {};

    graph.iteration = 0;
    graph.config = {};
    graph.vars = {};
    graph.extra = {};

    graph.globaltime = 0;
    graph.runningtime = 0;
    graph.fixedtime = 0;
    graph.fixedtime_lapse = 0.01;
    graph.elapsed_time = 0.01;
    graph.last_update_time = 0;
    graph.starttime = 0;

    graph.catch_errors = true;

    graph.history = {
        actionHistory: [],
        actionHistoryVersions: [],
        actionHistoryPtr: 0,
    };

    graph.nodes_executing = [];
    graph.nodes_actioning = [];
    graph.node_ancestorsCalculated = [];
    graph.nodes_executedAction = [];
    graph._configuring = false;

    graph.inputs = {};
    graph.outputs = {};
}
