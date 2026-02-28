export type NodeRenderMode = "legacy-ctx" | "uiapi-parity" | "uiapi-components";

export type RenderStyleProfileLike = "legacy" | "leafer-classic-v1" | "leafer-pragmatic-v1";

export interface RenderStyleTokensLike {
    radius: number;
    borderWidth: number;
    titleFontSize: number;
    bodyFontSize: number;
    smallFontSize: number;
    titleTextColor: string;
    titleBg: string;
    bodyBg: string;
    bodyBorder: string;
    slotInputColor: string;
    slotOutputColor: string;
    slotLabelColor: string;
    tooltipBg: string;
    tooltipBorder: string;
    tooltipText: string;
    widgetBg: string;
    widgetBorder: string;
    widgetText: string;
    widgetSecondaryText: string;
    widgetAccent: string;
    widgetAccentAlt: string;
    widgetDanger: string;
    widgetWarning: string;
    widgetSuccess: string;
}

export type RenderContextLike = CanvasRenderingContext2D & {
    start?: () => void;
    finish?: () => void;
    start2D?: () => void;
    finish2D?: () => void;
    mozImageSmoothingEnabled?: boolean;
};

export interface LeaferUiLike {
    children?: LeaferUiLike[];
    context?: RenderContextLike | null;
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    opacity?: number;
    add?: (...children: LeaferUiLike[]) => void;
    clear?: () => void;
    remove?: (child: LeaferUiLike) => void;
    set?: (data: Record<string, unknown>) => void;
    paint?: () => void;
    destroy?: () => void;
    forceRender?: (bounds?: unknown, sync?: boolean) => void;
    resize?: (size: { width: number; height: number; pixelRatio?: number } | number, height?: number) => void;
    [key: string]: unknown;
}

export interface LeaferCanvasLike {
    view?: HTMLCanvasElement | null;
    context?: RenderContextLike | null;
    pixelRatio?: number;
    resize?: (size: { width: number; height: number; pixelRatio?: number } | number, height?: number) => void;
    destroy?: () => void;
    [key: string]: unknown;
}

export interface LeaferRuntimeLike {
    LeaferCanvas?: new (options: {
        view: HTMLCanvasElement;
        width: number;
        height: number;
        hittable: boolean;
    }) => LeaferCanvasLike;
    Leafer?: new (options: {
        view: HTMLCanvasElement;
        width: number;
        height: number;
        hittable: boolean;
    }) => LeaferUiLike;
    App?: new (options: {
        view: HTMLCanvasElement;
        width: number;
        height: number;
        hittable: boolean;
    }) => LeaferUiLike;
    [key: string]: unknown;
}

export type LeaferUiFactory = (name: string, data?: Record<string, unknown>) => LeaferUiLike;

export type AddChildrenFn = (parent: LeaferUiLike, ...children: Array<LeaferUiLike | null | undefined>) => void;
export type ClearChildrenFn = (group: LeaferUiLike | null | undefined) => void;
export type SetUiDataFn = (ui: LeaferUiLike | null | undefined, data: Record<string, unknown>) => void;

export interface LeaferWidgetLike {
    type?: string;
    name?: string;
    label?: string;
    value?: unknown;
    y?: number;
    width?: number;
    disabled?: boolean;
    clicked?: boolean;
    marker?: boolean;
    options?: Record<string, any>;
    draw?: (ctx: RenderContextLike, node: LeaferNodeLike, width: number, posY: number, height: number) => void;
    computeSize?: (width: number) => [number, number];
    last_y?: number;
    [key: string]: unknown;
}

export interface LeaferNodeLike {
    id?: number | string;
    pos?: [number, number];
    size?: [number, number];
    title?: string;
    color?: string;
    bgcolor?: string;
    boxcolor?: string;
    mode?: number | string;
    flags?: {
        collapsed?: boolean;
        [key: string]: unknown;
    };
    horizontal?: boolean;
    widgets_up?: boolean;
    widgets_start_y?: number;
    widgets?: LeaferWidgetLike[];
    inputs?: Array<any>;
    outputs?: Array<any>;
    constructor?: Record<string, any>;
    is_selected?: boolean;
    mouseOver?: boolean;
    has_errors?: boolean;
    execute_triggered?: number;
    action_triggered?: number;
    _shape?: number;
    _collapsed_width?: number;
    getTitle?: () => string;
    getConnectionPos?: (isInput: boolean, slot: number, out?: Float32Array) => [number, number] | Float32Array;
    onDrawBackground?: (...args: unknown[]) => unknown;
    onDrawForeground?: (...args: unknown[]) => unknown;
    onDrawTitle?: (...args: unknown[]) => unknown;
    onDrawCollapsed?: (...args: unknown[]) => unknown;
    [key: string]: unknown;
}

export interface LeaferHostLike {
    ds?: {
        scale: number;
        offset: [number, number];
    };
    round_radius?: number;
    node_title_color?: string;
    connecting_output?: { type?: unknown } | null;
    connecting_input?: { type?: unknown } | null;
    default_connection_color?: Record<string, string>;
    default_connection_color_byType?: Record<string, any>;
    default_connection_color_byTypeOff?: Record<string, any>;
    renderStyleProfile?: RenderStyleProfileLike;
    renderStyleEngine?: "legacy" | "leafer-components" | string;
    node_widget?: [LeaferNodeLike, LeaferWidgetLike] | null;
    canvas?: HTMLCanvasElement | null;
    graph_mouse?: [number, number] | null;
    render_collapsed_slots?: boolean;
    render_title_colored?: boolean;
    connections_width?: number;
    lowQualityRenderingRequired?: (threshold: number) => boolean;
    [key: string]: unknown;
}

export interface LiteGraphLike {
    ROUND_SHAPE: number;
    BOX_SHAPE: number;
    CIRCLE_SHAPE: number;
    CARD_SHAPE: number;
    ARROW_SHAPE: number;
    GRID_SHAPE: number;
    EVENT: number;
    ACTION: number;
    UP: number;
    DOWN: number;
    NODE_SLOT_HEIGHT: number;
    NODE_WIDGET_HEIGHT: number;
    NODE_TITLE_HEIGHT: number;
    NODE_TITLE_TEXT_Y: number;
    NODE_TEXT_SIZE: number;
    NODE_TEXT_COLOR: string;
    NODE_DEFAULT_COLOR: string;
    NODE_DEFAULT_BGCOLOR: string;
    NODE_DEFAULT_BOXCOLOR: string;
    NODE_BOX_OUTLINE_COLOR?: string;
    NODE_SELECTED_TITLE_COLOR?: string;
    TRANSPARENT_TITLE: number;
    NO_TITLE: number;
    AUTOHIDE_TITLE: number;
    show_node_tooltip: boolean;
    show_node_tooltip_use_descr_property: boolean;
    node_box_coloured_by_mode?: boolean;
    node_box_coloured_when_on?: boolean;
    NODE_MODES_COLORS?: Record<string | number, string>;
    WIDGET_BGCOLOR?: string;
    WIDGET_OUTLINE_COLOR?: string;
    WIDGET_TEXT_COLOR?: string;
    isValidConnection?: (a: unknown, b: unknown) => boolean;
    [key: string]: unknown;
}

export interface CallbackLayerCtx {
    context: RenderContextLike | null | undefined;
    width?: number;
    height?: number;
    paint?: () => void;
    [key: string]: unknown;
}

export interface NodeViewRef {
    group: LeaferUiLike;
    bodyGroup: LeaferUiLike;
    titleGroup: LeaferUiLike;
    slotsGroup: LeaferUiLike;
    widgetsGroup: LeaferUiLike;
    tooltipGroup: LeaferUiLike;
    callbackBgCanvas: (LeaferUiLike & CallbackLayerCtx) | null;
    callbackFgCanvas: (LeaferUiLike & CallbackLayerCtx) | null;
    styleHash: string;
    layoutHash: string;
    widgetHash: string;
    tooltipHash: string;
    slotHash: string;
    hasLegacyWidgetDraw: boolean;
    legacyWidgetDrawFns: Array<(ctx: RenderContextLike, node: LeaferNodeLike) => void>;
}

export interface LeaferNodeComponentEnv {
    view: NodeViewRef;
    node: LeaferNodeLike;
    host: LeaferHostLike;
    LiteGraph: LiteGraphLike;
    createUi: LeaferUiFactory;
    addChildren: AddChildrenFn;
    clearChildren: ClearChildrenFn;
    setUiData?: SetUiDataFn;
    width: number;
    height: number;
    titleHeightScaled: number;
    scale: number;
    showCollapsed: boolean;
    renderTitle: boolean;
    shape: number;
    titleMode: number;
    lowQuality: boolean;
    renderText: boolean;
    selected: boolean;
    mouseOver: boolean;
    title: string;
    tooltip: string;
    nodeColor: string;
    bgColor: string;
    tokens: RenderStyleTokensLike;
    [key: string]: unknown;
}

export interface LeaferWidgetRenderResult {
    nextY?: number;
    legacyDraw?: (ctx: RenderContextLike, node: LeaferNodeLike) => void;
}

export interface LeaferWidgetComponentEnv {
    view: NodeViewRef;
    node: LeaferNodeLike;
    host: LeaferHostLike;
    widget: LeaferWidgetLike;
    y: number;
    width: number;
    scale: number;
    widgetHeight: number;
    tokens: RenderStyleTokensLike;
    showText: boolean;
    active: boolean;
    createUi: LeaferUiFactory;
    addChildren: AddChildrenFn;
    [key: string]: unknown;
}

export type LeaferNodeComponent = (env: LeaferNodeComponentEnv) => void;
export type LeaferWidgetComponent = (env: LeaferWidgetComponentEnv) => LeaferWidgetRenderResult | void;
