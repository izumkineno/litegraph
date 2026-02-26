export function applyCoreDefaults(liteGraph) {
    liteGraph.VERSION = "0.10.2";

    liteGraph.CANVAS_GRID_SIZE = 10;
    liteGraph.NODE_TITLE_HEIGHT = 30;
    liteGraph.NODE_TITLE_TEXT_Y = 20;
    liteGraph.NODE_SLOT_HEIGHT = 20;
    liteGraph.NODE_WIDGET_HEIGHT = 20;
    liteGraph.NODE_WIDTH = 140;
    liteGraph.NODE_MIN_WIDTH = 50;
    liteGraph.NODE_COLLAPSED_RADIUS = 10;
    liteGraph.NODE_COLLAPSED_WIDTH = 80;
    liteGraph.NODE_TITLE_COLOR = "#999";
    liteGraph.NODE_SELECTED_TITLE_COLOR = "#FFF";
    liteGraph.NODE_TEXT_SIZE = 14;
    liteGraph.NODE_TEXT_COLOR = "#AAA";
    liteGraph.NODE_SUBTEXT_SIZE = 12;
    liteGraph.NODE_DEFAULT_COLOR = "#333";
    liteGraph.NODE_DEFAULT_BGCOLOR = "#353535";
    liteGraph.NODE_DEFAULT_BOXCOLOR = "#666";
    liteGraph.NODE_DEFAULT_SHAPE = "box";
    liteGraph.NODE_BOX_OUTLINE_COLOR = "#FFF";
    liteGraph.DEFAULT_SHADOW_COLOR = "rgba(0,0,0,0.5)";
    liteGraph.DEFAULT_GROUP_FONT = 24;

    liteGraph.WIDGET_BGCOLOR = "#222";
    liteGraph.WIDGET_OUTLINE_COLOR = "#666";
    liteGraph.WIDGET_TEXT_COLOR = "#DDD";
    liteGraph.WIDGET_SECONDARY_TEXT_COLOR = "#999";

    liteGraph.LINK_COLOR = "#9A9";
    liteGraph.EVENT_LINK_COLOR = "#A86";
    liteGraph.CONNECTING_LINK_COLOR = "#AFA";

    liteGraph.MAX_NUMBER_OF_NODES = 1000;
    liteGraph.DEFAULT_POSITION = [100, 100];
    liteGraph.VALID_SHAPES = ["default", "box", "round", "card"];

    liteGraph.BOX_SHAPE = 1;
    liteGraph.ROUND_SHAPE = 2;
    liteGraph.CIRCLE_SHAPE = 3;
    liteGraph.CARD_SHAPE = 4;
    liteGraph.ARROW_SHAPE = 5;
    liteGraph.GRID_SHAPE = 6;

    liteGraph.INPUT = 1;
    liteGraph.OUTPUT = 2;

    liteGraph.EVENT = -1;
    liteGraph.ACTION = -1;

    liteGraph.NODE_MODES = ["Always", "On Event", "Never", "On Trigger", "On Request"];
    liteGraph.NODE_MODES_COLORS = ["#666","#422","#333","#224","#626"];
    liteGraph.ALWAYS = 0;
    liteGraph.ON_EVENT = 1;
    liteGraph.NEVER = 2;
    liteGraph.ON_TRIGGER = 3;
    liteGraph.ON_REQUEST = 4;

    liteGraph.UP = 1;
    liteGraph.DOWN = 2;
    liteGraph.LEFT = 3;
    liteGraph.RIGHT = 4;
    liteGraph.CENTER = 5;

    liteGraph.LINK_RENDER_MODES = ["Straight", "Linear", "Spline"];
    liteGraph.STRAIGHT_LINK = 0;
    liteGraph.LINEAR_LINK = 1;
    liteGraph.SPLINE_LINK = 2;

    liteGraph.NORMAL_TITLE = 0;
    liteGraph.NO_TITLE = 1;
    liteGraph.TRANSPARENT_TITLE = 2;
    liteGraph.AUTOHIDE_TITLE = 3;
    liteGraph.VERTICAL_LAYOUT = "vertical";

    liteGraph.proxy = null;
    liteGraph.node_images_path = "";

    liteGraph.catch_exceptions = true;
    liteGraph.throw_errors = true;
    liteGraph.allow_scripts = false;
    liteGraph.use_deferred_actions = true;
    liteGraph.registered_node_types = {};
    liteGraph.node_types_by_file_extension = {};
    liteGraph.Nodes = {};
    liteGraph.Globals = {};
}
