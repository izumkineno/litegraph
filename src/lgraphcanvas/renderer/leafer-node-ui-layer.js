import { LiteGraph } from "../../litegraph.js";
import {
    getNodeComponent,
    getRenderStyleTokens,
    getWidgetComponent,
    hasRequiredNodeComponents,
} from "./leafer-components/registry.js";
import {
    canvasBaselineToTextTop,
    scaledFontSize,
    snapPixel,
    widgetTextTop,
} from "./leafer-components/text-layout.js";

function createCompatGroup(name = "Group") {
    return {
        __tag: name,
        children: [],
        add(...children) {
            this.children.push(...children.filter(Boolean));
        },
        clear() {
            this.children.length = 0;
        },
        remove(child) {
            const index = this.children.indexOf(child);
            if (index >= 0) {
                this.children.splice(index, 1);
            }
        },
        set(data) {
            Object.assign(this, data);
        },
    };
}

function clearChildren(group) {
    if (!group) {
        return;
    }
    if (typeof group.clear === "function") {
        group.clear();
        return;
    }
    if (typeof group.removeAll === "function") {
        group.removeAll();
        return;
    }
    if (Array.isArray(group.children)) {
        group.children.length = 0;
    }
}

function addChildren(parent, ...children) {
    if (!parent || !children.length) {
        return;
    }
    if (typeof parent.add === "function") {
        for (const child of children) {
            if (!child) {
                continue;
            }
            // Leafer add() handles one child at a time; passing multiple args drops trailing items.
            parent.add(child);
        }
        return;
    }
    if (Array.isArray(parent.children)) {
        parent.children.push(...children.filter(Boolean));
    }
}

function removeChild(parent, child) {
    if (!parent || !child) {
        return;
    }
    if (typeof parent.remove === "function") {
        parent.remove(child);
        return;
    }
    if (Array.isArray(parent.children)) {
        const index = parent.children.indexOf(child);
        if (index >= 0) {
            parent.children.splice(index, 1);
        }
    }
}

function setUiData(ui, data) {
    if (!ui || !data) {
        return;
    }
    if (typeof ui.set === "function") {
        ui.set(data);
        return;
    }
    Object.assign(ui, data);
}

function ensureRoundRectCompat(ctx) {
    if (!ctx || typeof ctx.roundRect === "function") {
        return;
    }
    if (typeof ctx.rect === "function") {
        ctx.roundRect = function roundRectFallback(x, y, width, height) {
            this.rect(x, y, width, height);
        };
        return;
    }
    ctx.roundRect = function roundRectNoop() {
    };
}

function sanitizeText(value) {
    if (value == null) {
        return "";
    }
    return String(value);
}

function getTitleText(node) {
    try {
        return sanitizeText(node.getTitle?.() ?? node.title ?? "");
    } catch (_error) {
        return sanitizeText(node.title ?? "");
    }
}

function getNodeTooltipText(node) {
    let text = node?.properties?.tooltip;
    if ((!text || text === "") && LiteGraph.show_node_tooltip_use_descr_property) {
        text = node?.constructor?.desc;
    }
    return sanitizeText(text).trim();
}

function hashWidgets(widgets = [], activeWidgetIndex = -1) {
    if (!widgets.length) {
        return `widgets:none:active:${activeWidgetIndex}`;
    }
    const base = widgets
        .map((widget) => [
            widget?.name ?? "",
            widget?.type ?? "",
            widget?.value ?? "",
            widget?.disabled ? 1 : 0,
            widget?.clicked ? 1 : 0,
            widget?.marker ?? "",
            widget?.label ?? "",
            widget?.y ?? "",
        ].join(":"))
        .join("|");
    return `${base}|active:${activeWidgetIndex}`;
}

function hashNodeSlots(node) {
    const hashSlots = (slots = []) => slots
        .map((slot) => [
            slot?.name ?? "",
            slot?.label ?? "",
            slot?.type ?? "",
            slot?.shape ?? "",
            slot?.dir ?? "",
            slot?.link ?? "",
            Array.isArray(slot?.links) ? slot.links.length : "",
        ].join(":"))
        .join("|");
    return `${hashSlots(node?.inputs)}||${hashSlots(node?.outputs)}`;
}

function collectLegacyWidgetDraws(widgets = [], defaultWidth, defaultHeight, startY = 2) {
    const draws = [];
    let widgetY = startY;
    for (const widget of widgets) {
        const widgetHeight = widget.computeSize ? widget.computeSize(defaultWidth)[1] : defaultHeight;
        const currentY = widget.y != null ? widget.y : widgetY;
        widget.last_y = currentY;
        if (typeof widget.draw === "function") {
            const widgetWidth = widget.width || defaultWidth;
            draws.push((ctx, node) => {
                widget.draw(ctx, node, widgetWidth, currentY, widgetHeight);
            });
        }
        widgetY = currentY + widgetHeight + 4;
    }
    return draws;
}

function computeNodeWidgetsStartY(node, LiteGraph) {
    let widgetsY = 0;
    const nodePosY = Number(node?.pos?.[1] || 0);
    const slotPos = new Float32Array(2);

    if (Array.isArray(node?.inputs)) {
        for (let i = 0; i < node.inputs.length; i += 1) {
            const pos = node.getConnectionPos?.(true, i, slotPos) || [0, nodePosY];
            const y = Number(pos[1] || 0) - nodePosY + LiteGraph.NODE_SLOT_HEIGHT * 0.5;
            if (widgetsY < y) {
                widgetsY = y;
            }
        }
    }

    if (Array.isArray(node?.outputs)) {
        for (let i = 0; i < node.outputs.length; i += 1) {
            const pos = node.getConnectionPos?.(false, i, slotPos) || [0, nodePosY];
            const y = Number(pos[1] || 0) - nodePosY + LiteGraph.NODE_SLOT_HEIGHT * 0.5;
            if (widgetsY < y) {
                widgetsY = y;
            }
        }
    }

    if (node?.horizontal || node?.widgets_up) {
        widgetsY = 2;
    }
    if (node?.widgets_start_y != null) {
        widgetsY = node.widgets_start_y;
    }
    return widgetsY;
}

function getFallbackCanvas(ownerDocument, width, height) {
    const canvas = ownerDocument?.createElement?.("canvas")
        ?? (typeof document !== "undefined" ? document.createElement("canvas") : null);
    if (!canvas) {
        return null;
    }
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

export class LeaferNodeUiLayer {
    constructor() {
        this.runtime = null;
        this.ownerDocument = null;
        this.enableLogs = false;
        this._bridgeCanvas = null;
        this._leafer = null;
        this._rootGroup = null;
        this._nodeViews = new Map();
        this._visibleNodeKeys = new Set();
        this._active = false;
        this._nodeRenderMode = "uiapi-parity";
        this._renderStyleProfile = "legacy";
        this._parityContext = null;
    }

    _log(message, meta) {
        if (!this.enableLogs) {
            return;
        }
        if (meta !== undefined) {
            console.info("[LiteGraph][LeaferNodeUI]", message, meta);
            return;
        }
        console.info("[LiteGraph][LeaferNodeUI]", message);
    }

    _createUi(name, data = {}) {
        const Ctor = this.runtime?.[name];
        if (typeof Ctor === "function") {
            return new Ctor(data);
        }
        const compat = createCompatGroup(name);
        Object.assign(compat, data);
        return compat;
    }

    _createLeaferSurface(width, height) {
        const bridgeCanvas = getFallbackCanvas(this.ownerDocument, width, height);
        if (!bridgeCanvas) {
            throw new Error("Failed to create Leafer node bridge canvas.");
        }

        const LeaferCtor = this.runtime?.Leafer || this.runtime?.App;
        if (typeof LeaferCtor !== "function") {
            throw new Error("Leafer runtime missing Leafer/App constructor for node UI mode.");
        }

        const leafer = new LeaferCtor({
            view: bridgeCanvas,
            width,
            height,
            hittable: false,
        });
        const rootGroup = this._createUi("Group", {
            x: 0,
            y: 0,
            hittable: false,
        });
        addChildren(leafer, rootGroup);

        this._bridgeCanvas = bridgeCanvas;
        this._leafer = leafer;
        this._rootGroup = rootGroup;
    }

    init({ runtime, ownerDocument, width, height, enableLogs = false }) {
        this.destroy();
        this.runtime = runtime;
        this.ownerDocument = ownerDocument ?? null;
        this.enableLogs = Boolean(enableLogs);
        this._createLeaferSurface(width, height);
        this._log("init", { width, height });
        return this;
    }

    destroy() {
        this._active = false;
        this._visibleNodeKeys.clear();
        this._nodeViews.clear();
        this._parityContext = null;
        this._rootGroup = null;
        this._leafer?.destroy?.();
        this._leafer = null;
        this._bridgeCanvas = null;
    }

    resize(width, height) {
        if (!this._bridgeCanvas) {
            return;
        }
        this._bridgeCanvas.width = width;
        this._bridgeCanvas.height = height;
        if (typeof this._leafer?.resize === "function") {
            try {
                this._leafer.resize({ width, height });
            } catch (_error) {
                this._leafer.resize(width, height);
            }
        }
        this._log("resize", { width, height });
    }

    beginFrame({ nodeRenderMode = "uiapi-parity", renderStyleProfile = "legacy" } = {}) {
        this._nodeRenderMode = nodeRenderMode;
        this._renderStyleProfile = renderStyleProfile || "legacy";
        this._active = true;
        this._visibleNodeKeys.clear();
        if ((nodeRenderMode === "uiapi-parity" || nodeRenderMode === "uiapi-components") && this._bridgeCanvas) {
            if (!this._parityContext) {
                this._parityContext = this._bridgeCanvas.getContext("2d");
            }
            if (this._parityContext && nodeRenderMode === "uiapi-parity") {
                this._parityContext.setTransform?.(1, 0, 0, 1, 0, 0);
                this._parityContext.clearRect?.(0, 0, this._bridgeCanvas.width, this._bridgeCanvas.height);
            }
        }
    }

    endFrame() {
        if (!this._active) {
            return;
        }
        if (this._nodeRenderMode === "uiapi-parity") {
            this._active = false;
            return;
        }
        for (const [key, view] of this._nodeViews.entries()) {
            if (!this._visibleNodeKeys.has(key)) {
                removeChild(this._rootGroup, view.group);
                this._nodeViews.delete(key);
            }
        }
        this._active = false;
    }

    renderTo(targetCtx) {
        if (!this._bridgeCanvas || !targetCtx || typeof targetCtx.drawImage !== "function") {
            return;
        }
        if (this._nodeRenderMode !== "uiapi-parity") {
            this._leafer?.forceRender?.(undefined, true);
        }
        targetCtx.drawImage(this._bridgeCanvas, 0, 0);
    }

    drawLegacyNode(node, host, drawLegacyWithCtx) {
        if (this._nodeRenderMode !== "uiapi-parity" || typeof drawLegacyWithCtx !== "function") {
            return;
        }
        const ctx = this._parityContext || this._bridgeCanvas?.getContext?.("2d");
        if (!ctx || !node || !host) {
            return;
        }
        this._parityContext = ctx;

        const scale = host?.ds?.scale || 1;
        const offset = host?.ds?.offset || [0, 0];
        const nodeX = node?.pos?.[0] || 0;
        const nodeY = node?.pos?.[1] || 0;
        ctx.save?.();
        ctx.scale?.(scale, scale);
        ctx.translate?.(nodeX + offset[0], nodeY + offset[1]);
        drawLegacyWithCtx(ctx);
        ctx.restore?.();
    }

    _getNodeKey(node) {
        return node?.id ?? node;
    }

    _createCallbackCanvas(width, height, y) {
        const canvasLayer = this._createUi("Canvas", {
            x: 0,
            y,
            width,
            height,
            hittable: false,
        });
        return canvasLayer;
    }

    _ensureCallbackLayer(view, type, enabled, width, height, titleHeightScaled) {
        const key = type === "bg" ? "callbackBgCanvas" : "callbackFgCanvas";
        if (!enabled) {
            if (view[key]) {
                removeChild(view.group, view[key]);
            }
            view[key] = null;
            return null;
        }

        if (!view[key]) {
            view[key] = this._createCallbackCanvas(width, height, -titleHeightScaled);
            if (type === "bg") {
                addChildren(view.group, view[key], view.bodyGroup, view.titleGroup, view.slotsGroup, view.widgetsGroup, view.tooltipGroup);
            } else {
                addChildren(view.group, view[key]);
            }
        } else {
            setUiData(view[key], {
                y: -titleHeightScaled,
                width,
                height,
            });
        }
        return view[key];
    }

    _runCallbackLayer(canvasLayer, callback, scope, args, scale, titleHeight) {
        if (!canvasLayer || typeof callback !== "function") {
            return undefined;
        }
        const ctx = canvasLayer.context;
        if (!ctx) {
            return undefined;
        }
        ensureRoundRectCompat(ctx);

        const width = canvasLayer.width ?? ctx.canvas?.width ?? 0;
        const height = canvasLayer.height ?? ctx.canvas?.height ?? 0;
        ctx.save?.();
        ctx.setTransform?.(1, 0, 0, 1, 0, 0);
        ctx.clearRect?.(0, 0, width, height);
        ctx.scale?.(scale, scale);
        ctx.translate?.(0, titleHeight);
        const result = callback.apply(scope ?? null, args);
        ctx.restore?.();
        canvasLayer.paint?.();
        return result;
    }

    _computeHashes(node, host) {
        const size = node?.size || [0, 0];
        const title = getTitleText(node);
        const tooltip = getNodeTooltipText(node);
        const lowQuality = Boolean(host?.lowQualityRenderingRequired?.(0.5));
        const renderText = !Boolean(host?.lowQualityRenderingRequired?.(0.6));
        const activeWidget = host?.node_widget?.[0] === node ? host?.node_widget?.[1] : null;
        const activeWidgetIndex = activeWidget && Array.isArray(node?.widgets)
            ? node.widgets.indexOf(activeWidget)
            : -1;
        return {
            styleHash: [
                node?.color || node?.constructor?.color || LiteGraph.NODE_DEFAULT_COLOR,
                node?.bgcolor || node?.constructor?.bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR,
                node?.boxcolor || "",
                node?.mode ?? "",
                node?.execute_triggered ?? 0,
                node?.action_triggered ?? 0,
                node?.is_selected ? 1 : 0,
                node?.mouseOver ? 1 : 0,
                lowQuality ? 1 : 0,
                renderText ? 1 : 0,
                host?.connecting_output?.type ?? "",
                host?.connecting_input?.type ?? "",
            ].join("|"),
            layoutHash: [
                node?.pos?.[0] || 0,
                node?.pos?.[1] || 0,
                size[0],
                size[1],
                host?.ds?.scale || 1,
                host?.ds?.offset?.[0] || 0,
                host?.ds?.offset?.[1] || 0,
                node?.flags?.collapsed ? 1 : 0,
                node?.horizontal ? 1 : 0,
                title,
                host?.renderStyleProfile || "legacy",
            ].join("|"),
            slotHash: hashNodeSlots(node),
            widgetHash: hashWidgets(node?.widgets || [], activeWidgetIndex),
            tooltipHash: `${tooltip}|${node?.mouseOver ? 1 : 0}|${node?.is_selected ? 1 : 0}`,
            title,
            tooltip,
        };
    }

    _getOrCreateView(key) {
        let view = this._nodeViews.get(key);
        if (view) {
            return view;
        }

        const group = this._createUi("Group", { x: 0, y: 0, hittable: false });
        const bodyGroup = this._createUi("Group", { hittable: false });
        const titleGroup = this._createUi("Group", { hittable: false });
        const slotsGroup = this._createUi("Group", { hittable: false });
        const widgetsGroup = this._createUi("Group", { hittable: false });
        const tooltipGroup = this._createUi("Group", { hittable: false });

        addChildren(group, bodyGroup, titleGroup, slotsGroup, widgetsGroup, tooltipGroup);
        addChildren(this._rootGroup, group);

        view = {
            group,
            bodyGroup,
            titleGroup,
            slotsGroup,
            widgetsGroup,
            tooltipGroup,
            callbackBgCanvas: null,
            callbackFgCanvas: null,
            styleHash: "",
            layoutHash: "",
            widgetHash: "",
            tooltipHash: "",
            slotHash: "",
            hasLegacyWidgetDraw: false,
            legacyWidgetDrawFns: [],
        };
        this._nodeViews.set(key, view);
        return view;
    }

    _syncViewStackOrder(view) {
        if (!this._rootGroup || !view?.group) {
            return;
        }
        // Keep visual stacking aligned with render traversal order.
        // remove+add guarantees the child is at the end (topmost) for current frame order.
        removeChild(this._rootGroup, view.group);
        addChildren(this._rootGroup, view.group);
    }

    _isComponentMode(host) {
        if (this._nodeRenderMode !== "uiapi-components") {
            return false;
        }
        if (!hasRequiredNodeComponents()) {
            return false;
        }
        if (host?.renderStyleEngine !== "leafer-components") {
            return false;
        }
        return host?.renderStyleProfile === "leafer-pragmatic-v1"
            || host?.renderStyleProfile === "leafer-classic-v1";
    }

    _updateNodeVisuals(node, host, view, hashes) {
        const scale = host?.ds?.scale || 1;
        const offset = host?.ds?.offset || [0, 0];
        const titleHeight = LiteGraph.NODE_TITLE_HEIGHT;
        const size = node?.size || [0, 0];
        const shape = node?._shape || node?.constructor?.shape || LiteGraph.ROUND_SHAPE;
        const titleMode = node?.constructor?.title_mode;
        const lowQuality = Boolean(host?.lowQualityRenderingRequired?.(0.5));
        const renderText = !Boolean(host?.lowQualityRenderingRequired?.(0.6));
        let renderTitle = !(
            titleMode === LiteGraph.TRANSPARENT_TITLE
            || titleMode === LiteGraph.NO_TITLE
        );
        if (titleMode === LiteGraph.AUTOHIDE_TITLE) {
            renderTitle = Boolean(node?.mouseOver);
        }
        const showCollapsed = Boolean(node?.flags?.collapsed);
        if (showCollapsed) {
            const estimatedTextWidth = (hashes.title || "").length * (LiteGraph.NODE_TEXT_SIZE || 14) * 0.6;
            node._collapsed_width = Math.min(size[0], estimatedTextWidth + LiteGraph.NODE_TITLE_HEIGHT * 2);
        }
        const collapsedWidth = showCollapsed
            ? Math.max(1, node?._collapsed_width || size[0])
            : Math.max(1, size[0]);
        const width = Math.max(1, collapsedWidth * scale);
        const height = Math.max(1, size[1] * scale);
        const titleHeightScaled = titleHeight * scale;
        const x = (node?.pos?.[0] + offset[0]) * scale;
        const y = (node?.pos?.[1] + offset[1]) * scale;
        const widgetsStartY = computeNodeWidgetsStartY(node, LiteGraph);

        setUiData(view.group, { x, y });

        let legacyWidgetDrawFns = null;
        let nodeComponents = null;
        let componentEnv = null;
        if (this._isComponentMode(host)) {
            nodeComponents = {
                shell: getNodeComponent("node-shell"),
                title: getNodeComponent("node-title"),
                slots: getNodeComponent("node-slots"),
                tooltip: getNodeComponent("node-tooltip"),
            };
            if (!nodeComponents.shell || !nodeComponents.title || !nodeComponents.slots || !nodeComponents.tooltip) {
                return false;
            }

            const nodeColor = node?.color || node?.constructor?.color || LiteGraph.NODE_DEFAULT_COLOR;
            const bgColor = node?.bgcolor || node?.constructor?.bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR;
            const tokens = getRenderStyleTokens(host?.renderStyleProfile || this._renderStyleProfile);
            componentEnv = {
                view,
                node,
                host,
                LiteGraph,
                createUi: this._createUi.bind(this),
                addChildren,
                clearChildren,
                setUiData,
                width,
                height,
                titleHeightScaled,
                scale,
                showCollapsed,
                renderTitle,
                shape,
                titleMode,
                lowQuality,
                renderText,
                selected: Boolean(node?.is_selected),
                mouseOver: Boolean(node?.mouseOver),
                title: hashes.title,
                tooltip: hashes.tooltip,
                nodeColor,
                bgColor,
                tokens,
            };

            if (
                hashes.styleHash !== view.styleHash
                || hashes.layoutHash !== view.layoutHash
                || hashes.slotHash !== view.slotHash
            ) {
                nodeComponents.shell(componentEnv);
                nodeComponents.title(componentEnv);
                nodeComponents.slots(componentEnv);
            }

            const widgetActive = host?.node_widget?.[0] === node;
            if (
                hashes.widgetHash !== view.widgetHash
                || hashes.layoutHash !== view.layoutHash
                || hashes.styleHash !== view.styleHash
                || showCollapsed
                || widgetActive
            ) {
                clearChildren(view.widgetsGroup);
                legacyWidgetDrawFns = [];
                if (!showCollapsed) {
                    const widgets = node?.widgets || [];
                    const widgetHeight = LiteGraph.NODE_WIDGET_HEIGHT;
                    let widgetY = widgetsStartY;
                    for (const widget of widgets) {
                        const currentY = widget.y != null ? widget.y : widgetY;
                        widget.last_y = currentY;
                        const widgetComponent = getWidgetComponent(widget);
                        if (!widgetComponent) {
                            return false;
                        }
                        const result = widgetComponent({
                            view,
                            node,
                            host,
                            widget,
                            y: currentY,
                            width: collapsedWidth,
                            scale,
                            widgetHeight,
                            tokens,
                            showText: renderText,
                            active: host?.node_widget?.[0] === node && host?.node_widget?.[1] === widget,
                            createUi: this._createUi.bind(this),
                            addChildren,
                        }) || { nextY: currentY + widgetHeight + 4 };
                        if (typeof result.legacyDraw === "function") {
                            legacyWidgetDrawFns.push(result.legacyDraw);
                        }
                        widgetY = result.nextY ?? (currentY + widgetHeight + 4);
                    }
                }
            }

            if (!showCollapsed && legacyWidgetDrawFns == null && view.hasLegacyWidgetDraw) {
                legacyWidgetDrawFns = collectLegacyWidgetDraws(
                    node?.widgets || [],
                    collapsedWidth,
                    LiteGraph.NODE_WIDGET_HEIGHT,
                    widgetsStartY,
                );
            }

            if (hashes.tooltipHash !== view.tooltipHash) {
                nodeComponents.tooltip(componentEnv);
            }
        } else {
            if (hashes.styleHash !== view.styleHash || hashes.layoutHash !== view.layoutHash) {
                clearChildren(view.bodyGroup);
                clearChildren(view.titleGroup);
                clearChildren(view.slotsGroup);

                const nodeColor = node?.color || node?.constructor?.color || LiteGraph.NODE_DEFAULT_COLOR;
                const bgColor = node?.bgcolor || node?.constructor?.bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR;
                const body = this._createUi("Rect", {
                    x: 0,
                    y: 0,
                    width,
                    height,
                    fill: bgColor,
                    stroke: nodeColor,
                    strokeWidth: Math.max(1, scale),
                    cornerRadius: (host?.round_radius || 8) * scale,
                    hittable: false,
                });
                addChildren(view.bodyGroup, body);

                if (!showCollapsed) {
                    const titleRect = this._createUi("Rect", {
                        x: 0,
                        y: -titleHeightScaled,
                        width,
                        height: titleHeightScaled,
                        fill: nodeColor,
                        cornerRadius: [host?.round_radius || 8, host?.round_radius || 8, 0, 0].map((value) => value * scale),
                        hittable: false,
                    });
                    const titleText = this._createUi("Text", {
                        x: snapPixel(titleHeightScaled),
                        y: snapPixel(canvasBaselineToTextTop((LiteGraph.NODE_TITLE_TEXT_Y * scale) - titleHeightScaled, scaledFontSize(14, scale))),
                        text: hashes.title,
                        fill: node?.is_selected ? LiteGraph.NODE_SELECTED_TITLE_COLOR : (node?.constructor?.title_text_color || host?.node_title_color || LiteGraph.NODE_TEXT_COLOR),
                        fontSize: scaledFontSize(14, scale),
                        hittable: false,
                    });
                    addChildren(view.titleGroup, titleRect, titleText);
                }

                const slotRadius = Math.max(3, 4 * scale);
                const slotSize = slotRadius * 2;
                const slotPos = new Float32Array(2);
                if (!showCollapsed && Array.isArray(node?.inputs)) {
                    for (let i = 0; i < node.inputs.length; i += 1) {
                        const pos = node.getConnectionPos?.(true, i, slotPos) || [node.pos[0], node.pos[1]];
                        const sx = (pos[0] - node.pos[0]) * scale;
                        const sy = (pos[1] - node.pos[1]) * scale;
                        const slotCircle = this._createUi("Ellipse", {
                            x: sx - slotRadius,
                            y: sy - slotRadius,
                            width: slotSize,
                            height: slotSize,
                            fill: node.inputs[i]?.color_on || host?.default_connection_color?.input_off || "#666",
                            hittable: false,
                        });
                        addChildren(view.slotsGroup, slotCircle);
                    }
                }
                if (!showCollapsed && Array.isArray(node?.outputs)) {
                    for (let i = 0; i < node.outputs.length; i += 1) {
                        const pos = node.getConnectionPos?.(false, i, slotPos) || [node.pos[0] + node.size[0], node.pos[1]];
                        const sx = (pos[0] - node.pos[0]) * scale;
                        const sy = (pos[1] - node.pos[1]) * scale;
                        const slotCircle = this._createUi("Ellipse", {
                            x: sx - slotRadius,
                            y: sy - slotRadius,
                            width: slotSize,
                            height: slotSize,
                            fill: node.outputs[i]?.color_on || host?.default_connection_color?.output_off || "#666",
                            hittable: false,
                        });
                        addChildren(view.slotsGroup, slotCircle);
                    }
                }
            }

            const widgetActive = host?.node_widget?.[0] === node;
            if (
                hashes.widgetHash !== view.widgetHash
                || hashes.layoutHash !== view.layoutHash
                || hashes.styleHash !== view.styleHash
                || widgetActive
            ) {
                clearChildren(view.widgetsGroup);
                const widgets = node?.widgets || [];
                const widgetHeight = LiteGraph.NODE_WIDGET_HEIGHT;
                let widgetY = widgetsStartY;
                for (const widget of widgets) {
                    const currentY = widget.y != null ? widget.y : widgetY;
                    widget.last_y = currentY;
                    const sy = currentY * scale;
                    const sh = widgetHeight * scale;
                    const widgetRect = this._createUi("Rect", {
                        x: 12 * scale,
                        y: sy,
                        width: Math.max(1, width - 24 * scale),
                        height: sh,
                        fill: LiteGraph.WIDGET_BGCOLOR || "#2A2A2A",
                        stroke: LiteGraph.WIDGET_OUTLINE_COLOR || "#555",
                        strokeWidth: Math.max(1, scale),
                        cornerRadius: Math.max(2, 4 * scale),
                        hittable: false,
                    });
                    const widgetText = this._createUi("Text", {
                        x: snapPixel(18 * scale),
                        y: snapPixel(widgetTextTop(sy, sh, scaledFontSize(12, scale))),
                        text: `${widget.label || widget.name || "widget"}: ${widget.value ?? ""}`,
                        fontSize: scaledFontSize(12, scale),
                        fill: LiteGraph.WIDGET_TEXT_COLOR || LiteGraph.NODE_TEXT_COLOR,
                        hittable: false,
                    });
                    addChildren(view.widgetsGroup, widgetRect, widgetText);
                    widgetY = currentY + widgetHeight + 4;
                }
            }

            if (hashes.tooltipHash !== view.tooltipHash) {
                clearChildren(view.tooltipGroup);
                const showTooltip = LiteGraph.show_node_tooltip
                    && Boolean(node?.mouseOver)
                    && Boolean(node?.is_selected)
                    && hashes.tooltip !== "";
                if (showTooltip) {
                    const tooltipWidth = Math.max(160 * scale, Math.min(width * 1.2, 320 * scale));
                    const tooltipHeight = 26 * scale;
                    const tooltipRect = this._createUi("Rect", {
                        x: (width - tooltipWidth) * 0.5,
                        y: -(titleHeightScaled + tooltipHeight + 8 * scale),
                        width: tooltipWidth,
                        height: tooltipHeight,
                        fill: "#454",
                        stroke: "#222",
                        strokeWidth: Math.max(1, scale),
                        cornerRadius: Math.max(3, 4 * scale),
                        hittable: false,
                    });
                    const tooltipText = this._createUi("Text", {
                        x: snapPixel(width * 0.5),
                        y: snapPixel(widgetTextTop(tooltipRect.y, tooltipHeight, scaledFontSize(12, scale))),
                        text: hashes.tooltip.slice(0, 120),
                        fill: "#CEC",
                        fontSize: scaledFontSize(12, scale),
                        textAlign: "center",
                        hittable: false,
                    });
                    addChildren(view.tooltipGroup, tooltipRect, tooltipText);
                }
            }
        }

        const hasBgCallback = typeof node?.onDrawBackground === "function";
        const hasFgCallbackBase = typeof node?.onDrawForeground === "function"
            || typeof node?.onDrawTitle === "function"
            || typeof node?.onDrawCollapsed === "function";
        const effectiveLegacyWidgetDrawFns = legacyWidgetDrawFns ?? view.legacyWidgetDrawFns ?? [];
        const effectiveHasLegacyDraw = !showCollapsed && effectiveLegacyWidgetDrawFns.length > 0;
        view.hasLegacyWidgetDraw = effectiveHasLegacyDraw;
        view.legacyWidgetDrawFns = effectiveLegacyWidgetDrawFns;

        const hasFgCallback = hasFgCallbackBase || effectiveHasLegacyDraw;
        const callbackCanvasWidth = Math.max(1, Math.ceil(width + 4));
        const callbackCanvasHeight = Math.max(1, Math.ceil(height + titleHeightScaled + 4));
        const bgLayer = this._ensureCallbackLayer(view, "bg", hasBgCallback, callbackCanvasWidth, callbackCanvasHeight, titleHeightScaled);
        const fgLayer = this._ensureCallbackLayer(view, "fg", hasFgCallback, callbackCanvasWidth, callbackCanvasHeight, titleHeightScaled);

        const collapsedConsumed = showCollapsed
            ? this._runCallbackLayer(fgLayer, node?.onDrawCollapsed, node, [fgLayer?.context, host], scale, titleHeight) === true
            : false;

        const slotHashBeforeBg = hashes.slotHash;
        this._runCallbackLayer(
            bgLayer,
            node?.onDrawBackground,
            node,
            [bgLayer?.context, host, host?.canvas, host?.graph_mouse],
            scale,
            titleHeight,
        );
        const slotHashAfterBg = hashNodeSlots(node);
        if (slotHashAfterBg !== slotHashBeforeBg) {
            hashes.slotHash = slotHashAfterBg;
            if (componentEnv && nodeComponents?.slots) {
                nodeComponents.slots(componentEnv);
            }
        }
        if (!collapsedConsumed) {
            this._runCallbackLayer(fgLayer, node?.onDrawTitle, node, [fgLayer?.context], scale, titleHeight);
            this._runCallbackLayer(fgLayer, node?.onDrawForeground, node, [fgLayer?.context, host, host?.canvas], scale, titleHeight);
        }

        if (effectiveHasLegacyDraw) {
            const fgCtx = fgLayer?.context;
            if (fgCtx) {
                ensureRoundRectCompat(fgCtx);
                fgCtx.save?.();
                fgCtx.scale?.(scale, scale);
                fgCtx.translate?.(0, titleHeight);
                for (const drawLegacy of effectiveLegacyWidgetDrawFns) {
                    drawLegacy(fgCtx, node);
                }
                fgCtx.restore?.();
                fgLayer.paint?.();
            }
        }

        if (collapsedConsumed) {
            clearChildren(view.bodyGroup);
            clearChildren(view.titleGroup);
            clearChildren(view.slotsGroup);
            clearChildren(view.widgetsGroup);
            clearChildren(view.tooltipGroup);
            view.hasLegacyWidgetDraw = false;
            view.legacyWidgetDrawFns = [];
        }

        view.styleHash = hashes.styleHash;
        view.layoutHash = hashes.layoutHash;
        view.slotHash = hashes.slotHash;
        view.widgetHash = hashes.widgetHash;
        view.tooltipHash = hashes.tooltipHash;
        return true;
    }

    upsertNode(node, host) {
        if (!this._rootGroup || !node || !host) {
            return false;
        }
        const key = this._getNodeKey(node);
        this._visibleNodeKeys.add(key);

        const view = this._getOrCreateView(key);
        this._syncViewStackOrder(view);
        const hashes = this._computeHashes(node, host);
        return this._updateNodeVisuals(node, host, view, hashes) !== false;
    }
}
