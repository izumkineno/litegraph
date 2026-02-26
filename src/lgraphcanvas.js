import { LiteGraph } from "./litegraph.js";
import { createLGraphCanvasControllers } from "./lgraphcanvas/controllers/index.js";
import { installLGraphCanvasDelegates } from "./lgraphcanvas/install-delegates.js";
import { applyLGraphCanvasStatics } from "./lgraphcanvas/modules/static-actions.js";

export class LGraphCanvas {
    constructor(canvas, graph, options) {
        options ??= {
            skip_render: false,
            autoresize: false,
            clip_all_nodes: false,
        };
        this.options = options;

        // if(graph === undefined)
        //	throw new Error("No graph assigned");
        this.background_image = LGraphCanvas.DEFAULT_BACKGROUND_IMAGE;

        if (canvas && canvas.constructor === String) {
            canvas = document.querySelector(canvas);
        }

        this.ds = new LiteGraph.DragAndScale();
        this.zoom_modify_alpha = true; // otherwise it generates ugly patterns when scaling down too much

        this.title_text_font = `${LiteGraph.NODE_TEXT_SIZE}px Arial`;
        this.inner_text_font = `normal ${LiteGraph.NODE_SUBTEXT_SIZE}px Arial`;
        this.node_title_color = LiteGraph.NODE_TITLE_COLOR;
        this.default_link_color = LiteGraph.LINK_COLOR;
        this.default_connection_color = {
            input_off: "#778",
            input_on: "#7F7", // "#BBD"
            output_off: "#778",
            output_on: "#7F7", // "#BBD"
        };
        this.default_connection_color_byType = {}; /* number: "#7F7", string: "#77F", boolean: "#F77",*/
        this.default_connection_color_byTypeOff = {}; /* number: "#474", string: "#447", boolean: "#744",*/
        this.drag_mode = false; // never used ?
        this.dragging_rectangle = null;

        this.filter = null; // allows to filter to only accept some type of nodes in a graph

        this.highquality_render = true;
        this.use_gradients = false; // set to true to render titlebar with gradients
        this.editor_alpha = 1; // used for transition
        this.pause_rendering = false;
        this.clear_background = true;
        this.clear_background_color = "#222";

        this.read_only = false; // if set to true users cannot modify the graph
        // this.render_only_selected = true;
        this.live_mode = false;
        this.show_info = true;
        this.allow_dragcanvas = true;
        this.allow_dragnodes = true;
        this.allow_interaction = true; // allow to control widgets, buttons, collapse, etc
        this.multi_select = false; // allow selecting multi nodes without pressing extra keys
        this.allow_searchbox = true;
        // this.allow_reconnect_links = true;
        this.move_destination_link_without_shift = false;
        this.align_to_grid = false; // snap to grid

        this.drag_mode = false;
        this.dragging_rectangle = null;

        this.filter = null; // allows to filter to only accept some type of nodes in a graph

        this.set_canvas_dirty_on_mouse_event = true; // forces to redraw the canvas if the mouse does anything
        this.always_render_background = false;
        this.render_shadows = true;
        this.render_canvas_border = true;
        this.render_connections_shadows = false; // too much cpu
        this.render_connections_border = true;
        this.render_curved_connections = true;
        this.render_connection_arrows = false;
        this.render_collapsed_slots = true;
        this.render_execution_order = false;
        this.render_title_colored = true;
        this.render_link_tooltip = true;

        this.free_resize = true;

        this.links_render_mode = LiteGraph.SPLINE_LINK;

        // Options are still mirrored on the instance for backward compatibility.
        this.autoresize = options.autoresize;
        this.skip_render = options.skip_render;
        this.clip_all_nodes = options.clip_all_nodes;
        this.free_resize = options.free_resize;

        this.mouse = [0, 0]; // mouse in canvas coordinates, where 0,0 is the top-left corner of the blue rectangle
        this.graph_mouse = [0, 0]; // mouse in graph coordinates, where 0,0 is the top-left corner of the blue rectangle
        this.canvas_mouse = this.graph_mouse; // LEGACY: REMOVE THIS, USE GRAPH_MOUSE INSTEAD

        // to personalize the search box
        this.onSearchBox = null;
        this.onSearchBoxSelection = null;

        // callbacks
        this.onMouse = null;
        this.onDrawBackground = null; // to render background objects (behind nodes and connections) in the canvas affected by transform
        this.onDrawForeground = null; // to render foreground objects (above nodes and connections) in the canvas affected by transform
        this.onDrawOverlay = null; // to render foreground objects not affected by transform (for GUIs)
        this.onDrawLinkTooltip = null; // called when rendering a tooltip
        this.onNodeMoved = null; // called after moving a node
        this.onSelectionChange = null; // called if the selection changes
        this.onConnectingChange = null; // called before any link changes
        this.onBeforeChange = null; // called before modifying the graph
        this.onAfterChange = null; // called after modifying the graph

        this.connections_width = 3;
        this.round_radius = 8;

        this.current_node = null;
        this.node_widget = null; // used for widgets
        this.over_link_center = null;
        this.last_mouse_position = [0, 0];
        this.visible_area = this.ds.visible_area;
        this.visible_links = [];

        this.viewport = options.viewport || null; // to constraint render area to a portion of the canvas
        this.low_quality_rendering_threshold = 5; // amount of slow fps to switch to low quality rendering

        this.controllers = createLGraphCanvasControllers(this);
        this.processMouseWheel = this.processMouseWheel.bind(this);
        this.processKey = this.processKey.bind(this);
        this.processDrop = this.processDrop.bind(this);
        // link canvas and graph
        graph?.attachCanvas(this);
        this.setCanvas(canvas,options.skip_events);
        this.clear();

        if (!this.skip_render && !options.skip_render) {
            this.startRendering();
        }
    }
}

installLGraphCanvasDelegates(LGraphCanvas);
applyLGraphCanvasStatics(LGraphCanvas);
