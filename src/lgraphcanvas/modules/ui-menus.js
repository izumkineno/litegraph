import { LiteGraph } from "../../litegraph.js";
import { LGraphCanvas } from "../../lgraphcanvas.js";
export function showLinkMenu(link, e) {
    var that = this;
    // LiteGraph.log?.(link);
    var node_left = that.graph.getNodeById( link.origin_id );
    var node_right = that.graph.getNodeById( link.target_id );
    var fromType = false;
    if (node_left && node_left.outputs && node_left.outputs[link.origin_slot]) fromType = node_left.outputs[link.origin_slot].type;
    var destType = false;
    if (node_right && node_right.outputs && node_right.outputs[link.target_slot]) destType = node_right.inputs[link.target_slot].type;

    var options = ["Add Node", null, "Delete"];
    var menu = new LiteGraph.ContextMenu(options, {
        event: e,
        title: link.data != null ? link.data.constructor.name : null,
        callback: inner_clicked,
    });

    function inner_clicked(v,options,e) {
        switch (v) {
            case "Add Node":
                LGraphCanvas.onMenuAdd(null, null, e, menu, function(node) {
                    LiteGraph.debug?.("node autoconnect");
                    if(!node.inputs || !node.inputs.length || !node.outputs || !node.outputs.length) {
                        return;
                    }
                    // leave the connection type checking inside connectByType
                    if (node_left.connectByType( link.origin_slot, node, fromType )) {
                        node.connectByType( link.target_slot, node_right, destType );
                        node.pos[0] -= node.size[0] * 0.5;
                    }
                });
                break;

            case "Delete":
                that.graph.removeLink(link.id);
                break;
            default:
                /* var nodeCreated = createDefaultNodeForSlot({   nodeFrom: node_left
                                                                ,slotFrom: link.origin_slot
                                                                ,nodeTo: node
                                                                ,slotTo: link.target_slot
                                                                ,e: e
                                                                ,nodeType: "AUTO"
                                                            });
                if(nodeCreated) LiteGraph.log?.("new node in beetween "+v+" created");*/
        }
    }

    return false;
}

export function createDefaultNodeForSlot(optPass = {}) { // addNodeMenu for connection
    var opts = Object.assign(
        {
            nodeFrom: null, // input
            slotFrom: null, // input
            nodeTo: null, // output
            slotTo: null, // output
            position: [],	// pass the event coords
            nodeType: null,	// choose a nodetype to add, AUTO to set at first good
            posAdd: [0,0],	// adjust x,y
            posSizeFix: [0,0], // alpha, adjust the position x,y based on the new node size w,h
        },
        optPass,
    );
    var that = this;

    var isFrom = opts.nodeFrom && opts.slotFrom!==null;
    var isTo = !isFrom && opts.nodeTo && opts.slotTo!==null;

    if (!isFrom && !isTo) {
        LiteGraph.warn?.("No data passed to createDefaultNodeForSlot "+opts.nodeFrom+" "+opts.slotFrom+" "+opts.nodeTo+" "+opts.slotTo);
        return false;
    }
    if (!opts.nodeType) {
        LiteGraph.warn?.("No type to createDefaultNodeForSlot");
        return false;
    }

    var nodeX = isFrom ? opts.nodeFrom : opts.nodeTo;
    var slotX = isFrom ? opts.slotFrom : opts.slotTo;

    var iSlotConn = false;
    switch (typeof slotX) {
        case "string":
            iSlotConn = isFrom ? nodeX.findOutputSlot(slotX,false) : nodeX.findInputSlot(slotX,false);
            slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
            break;
        case "object":
            // ok slotX
            iSlotConn = isFrom ? nodeX.findOutputSlot(slotX.name) : nodeX.findInputSlot(slotX.name);
            break;
        case "number":
            iSlotConn = slotX;
            slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
            break;
        default:
            // bad ?
            // iSlotConn = 0;
            LiteGraph.warn?.("Cant get slot information "+slotX);
            return false;
    }

    if (slotX===false || iSlotConn===false) {
        LiteGraph.warn?.("createDefaultNodeForSlot bad slotX "+slotX+" "+iSlotConn);
    }

    // check for defaults nodes for this slottype
    var fromSlotType = slotX.type==LiteGraph.EVENT?"_event_":slotX.type;
    var slotTypesDefault = isFrom ? LiteGraph.slot_types_default_out : LiteGraph.slot_types_default_in;
    if(slotTypesDefault && slotTypesDefault[fromSlotType]) {
        if (slotX.link !== null) {
            // is connected
        }else{
            // is not not connected
        }
        var nodeNewType = false;
        if(typeof slotTypesDefault[fromSlotType] == "object") {
            for(var typeX in slotTypesDefault[fromSlotType]) {
                if (opts.nodeType == slotTypesDefault[fromSlotType][typeX] || opts.nodeType == "AUTO") {
                    nodeNewType = slotTypesDefault[fromSlotType][typeX];
                    // LiteGraph.log?.("opts.nodeType == slotTypesDefault[fromSlotType][typeX] :: "+opts.nodeType);
                    break; // --------
                }
            }
        } else {
            if (opts.nodeType == slotTypesDefault[fromSlotType] || opts.nodeType == "AUTO")
                nodeNewType = slotTypesDefault[fromSlotType];
        }
        if (nodeNewType) {
            var nodeNewOpts = false;
            if (typeof nodeNewType == "object" && nodeNewType.node) {
                nodeNewOpts = nodeNewType;
                nodeNewType = nodeNewType.node;
            }

            // that.graph.beforeChange();

            var newNode = LiteGraph.createNode(nodeNewType);
            if(newNode) {
                // if is object pass options
                if (nodeNewOpts) {
                    if (nodeNewOpts.properties) {
                        for (const [key, value] of Object.entries(nodeNewOpts.properties)) {
                            newNode.addProperty(key, value);
                        }
                    }
                    if (nodeNewOpts.inputs) {
                        newNode.inputs = [];
                        Object.values(nodeNewOpts.inputs).forEach((value) => {
                            newNode.addOutput(value[0], value[1]);
                        });
                    }
                    if (nodeNewOpts.outputs) {
                        newNode.outputs = [];
                        Object.values(nodeNewOpts.outputs).forEach((value) => {
                            newNode.addOutput(value[0], value[1]);
                        });
                    }
                    if (nodeNewOpts.title) {
                        newNode.title = nodeNewOpts.title;
                    }
                    if (nodeNewOpts.json) {
                        newNode.configure(nodeNewOpts.json);
                    }

                }

                // add the node
                that.graph.add(newNode);
                newNode.pos = [
                    opts.position[0]+opts.posAdd[0]+(opts.posSizeFix[0]?opts.posSizeFix[0]*newNode.size[0]:0),
                    opts.position[1]+opts.posAdd[1]+(opts.posSizeFix[1]?opts.posSizeFix[1]*newNode.size[1]:0),
                ]; // that.last_click_position; //[e.canvasX+30, e.canvasX+5];*/

                // that.graph.afterChange();

                // connect the two!
                if (isFrom) {
                    opts.nodeFrom.connectByType( iSlotConn, newNode, fromSlotType );
                }else{
                    opts.nodeTo.connectByTypeOutput( iSlotConn, newNode, fromSlotType );
                }

                /* if connecting in between
                if (isFrom && isTo){
                    // no-op
                }
                */

                return true;

            }else{
                LiteGraph.warn?.("failed creating "+nodeNewType);
            }
        }
    }
    return false;
}

export function showConnectionMenu(optPass = {}) { // addNodeMenu for connection

    var opts = Object.assign({
        nodeFrom: null, // input
        slotFrom: null, // input
        nodeTo: null, // output
        slotTo: null, // output
        e: null,
    },optPass);

    var that = this;
    var isFrom = opts.nodeFrom && opts.slotFrom;
    var isTo = !isFrom && opts.nodeTo && opts.slotTo;

    if (!isFrom && !isTo) {
        LiteGraph.warn?.("No data passed to showConnectionMenu");
        return false;
    }

    var nodeX = isFrom ? opts.nodeFrom : opts.nodeTo;
    var slotX = isFrom ? opts.slotFrom : opts.slotTo;

    var iSlotConn = false;
    switch (typeof slotX) {
        case "string":
            iSlotConn = isFrom ? nodeX.findOutputSlot(slotX,false) : nodeX.findInputSlot(slotX,false);
            slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
            break;
        case "object":
            // ok slotX
            iSlotConn = isFrom ? nodeX.findOutputSlot(slotX.name) : nodeX.findInputSlot(slotX.name);
            break;
        case "number":
            iSlotConn = slotX;
            slotX = isFrom ? nodeX.outputs[slotX] : nodeX.inputs[slotX];
            break;
        default:
            // bad ?
            // iSlotConn = 0;
            LiteGraph.warn?.("Cant get slot information "+slotX);
            return false;
    }

    var options = ["Add Node",null];

    if (that.allow_searchbox) {
        options.push("Search");
        options.push(null);
    }

    // get defaults nodes for this slottype
    const fromSlotType = slotX.type === LiteGraph.EVENT ? "_event_" : slotX.type;
    const slotTypesDefault = isFrom ? LiteGraph.slot_types_default_out : LiteGraph.slot_types_default_in;

    if (slotTypesDefault && slotTypesDefault[fromSlotType]) {
        const slotType = slotTypesDefault[fromSlotType];

        if (Array.isArray(slotType) || typeof slotType === "object") {
            Object.values(slotType).forEach((typeX) => {
                options.push(typeX);
            });
        } else {
            options.push(slotType);
        }
    }

    // build menu
    var menu = new LiteGraph.ContextMenu(options, {
        event: opts.e,
        title: (slotX && slotX.name!="" ? (slotX.name + (fromSlotType?" | ":"")) : "")+(slotX && fromSlotType ? fromSlotType : ""),
        callback: (v, options, e) => {
            const cases = {
                "Add Node": () => {
                    LGraphCanvas.onMenuAdd(null, null, e, menu, (node) => {
                        isFrom ? opts.nodeFrom.connectByType(iSlotConn, node, fromSlotType) : opts.nodeTo.connectByTypeOutput(iSlotConn, node, fromSlotType);
                    });
                },
                "Search": () => {
                    isFrom ? that.showSearchBox(e, {node_from: opts.nodeFrom, slot_from: slotX, type_filter_in: fromSlotType}) : that.showSearchBox(e, {node_to: opts.nodeTo, slot_from: slotX, type_filter_out: fromSlotType});
                },
                "default": () => {
                    that.createDefaultNodeForSlot(Object.assign(opts, {position: [opts.e.canvasX, opts.e.canvasY], nodeType: v}));
                },
            };

            // Execute the corresponding function based on the value of v
            (cases[v] || cases["default"])();
        },
    });

    return false;
}

export function getCanvasMenuOptions() {
    var options = null;
    if (this.getMenuOptions) {
        options = this.getMenuOptions();
    } else {
        options = [
            {
                content: "Add Node",
                has_submenu: true,
                callback: LGraphCanvas.onMenuAdd,
            },
            { content: "Add Group", callback: LGraphCanvas.onGroupAdd },
            // { content: "Arrange", callback: that.graph.arrange },
            // {content:"Collapse All", callback: LGraphCanvas.onMenuCollapseAll }
        ];
        if (LiteGraph.showCanvasOptions) {
            options.push({ content: "Options", callback: this.showShowGraphOptionsPanel });
        }

        if (Object.keys(this.selected_nodes).length > 1) {
            options.push({
                content: "Align",
                has_submenu: true,
                callback: LGraphCanvas.onGroupAlign,
            })
        }

        if (this._graph_stack && this._graph_stack.length > 0) {
            options.push(null, {
                content: "Close subgraph",
                callback: this.closeSubgraph.bind(this),
            });
        }
    }

    if (this.getExtraMenuOptions) {
        var extra = this.getExtraMenuOptions(this, options);
        if (extra) {
            options = options.concat(extra);
        }
    }

    return options;
}

export function getNodeMenuOptions(node) {
    var options = null;

    if (node.getMenuOptions) {
        options = node.getMenuOptions(this);
    } else {
        options = [
            {
                content: "Inputs",
                has_submenu: true,
                disabled: true,
                callback: LGraphCanvas.showMenuNodeOptionalInputs,
            },
            {
                content: "Outputs",
                has_submenu: true,
                disabled: true,
                callback: LGraphCanvas.showMenuNodeOptionalOutputs,
            },
            null,
            {
                content: "Properties",
                has_submenu: true,
                callback: LGraphCanvas.onShowMenuNodeProperties,
            },
            null,
            {
                content: "Title",
                callback: LGraphCanvas.onShowPropertyEditor,
            },
            {
                content: "Mode",
                has_submenu: true,
                callback: LGraphCanvas.onMenuNodeMode,
            }];
        if(node.resizable !== false) {
            options.push({
                content: "Resize",
                callback: LGraphCanvas.onMenuResizeNode,
            });
        }
        options.push(
            {
                content: "Collapse",
                callback: LGraphCanvas.onMenuNodeCollapse,
            },
            { content: "Pin", callback: LGraphCanvas.onMenuNodePin },
            {
                content: "Colors",
                has_submenu: true,
                callback: LGraphCanvas.onMenuNodeColors,
            },
            {
                content: "Shapes",
                has_submenu: true,
                callback: LGraphCanvas.onMenuNodeShapes,
            },
            null,
        );
    }

    if (node.onGetInputs) {
        var inputs = node.onGetInputs();
        if (inputs && inputs.length) {
            options[0].disabled = false;
        }
    }

    if (node.onGetOutputs) {
        var outputs = node.onGetOutputs();
        if (outputs && outputs.length) {
            options[1].disabled = false;
        }
    }

    if (LiteGraph.do_add_triggers_slots)
        options[1].disabled = false;

    if (node.getExtraMenuOptions) {
        var extra = node.getExtraMenuOptions(this, options);
        if (extra) {
            extra.push(null);
            options = extra.concat(options);
        }
    }

    if (node.clonable !== false) {
        options.push({
            content: "Clone",
            callback: LGraphCanvas.onMenuNodeClone,
        });
    }
    if (Object.keys(this.selected_nodes).length > 1) {
        options.push({
            content: "Align Selected To",
            has_submenu: true,
            callback: LGraphCanvas.onNodeAlign,
        })
    }

    options.push(null, {
        content: "Remove",
        disabled: !(node.removable !== false && !node.block_delete ),
        callback: LGraphCanvas.onMenuNodeRemove,
    });

    if (node.graph && node.graph.onGetNodeMenuOptions) {
        node.graph.onGetNodeMenuOptions(options, node);
    }

    return options;
}

export function getGroupMenuOptions() {
    var o = [
        { content: "Title", callback: LGraphCanvas.onShowPropertyEditor },
        {
            content: "Color",
            has_submenu: true,
            callback: LGraphCanvas.onMenuNodeColors,
        },
        {
            content: "Font size",
            property: "font_size",
            type: "Number",
            callback: LGraphCanvas.onShowPropertyEditor,
        },
        null,
        { content: "Remove", callback: LGraphCanvas.onMenuNodeRemove },
    ];

    return o;
}

export function processContextMenu(node, event) {
    var that = this;
    var canvas = LGraphCanvas.active_canvas;
    var ref_window = canvas.getCanvasWindow();

    var menu_info = null;
    var options = {
        event: event,
        callback: inner_option_clicked,
        extra: node,
    };

    if(node)
        options.title = node.type;

    // check if mouse is in input
    var slot = null;
    if (node) {
        slot = node.getSlotInPosition(event.canvasX, event.canvasY);
        LGraphCanvas.active_node = node;
    }

    if (slot) {
        // on slot
        menu_info = [];
        if (node.getSlotMenuOptions) {
            menu_info = node.getSlotMenuOptions(slot);
        } else {
            if (slot?.output?.links?.length || slot.input?.link) {
                menu_info.push({ content: "Disconnect Links", slot: slot });
            }
            var _slot = slot.input || slot.output;
            if (_slot.removable && LiteGraph.canRemoveSlots) {
                menu_info.push(_slot.locked
                    ? "Cannot remove"
                    : { content: "Remove Slot", slot: slot });
            }
            if (!_slot.nameLocked && LiteGraph.canRenameSlots) {
                menu_info.push({ content: "Rename Slot", slot: slot });
            }

        }
        var slotOb = slot.input || slot.output;
        options.title = slotOb.type || "*";
        if (slotOb.type == LiteGraph.ACTION) {
            options.title = "Action";
        } else if (slotOb.type == LiteGraph.EVENT) {
            options.title = "Event";
        }
    } else {
        if (node) {
            // on node
            menu_info = this.getNodeMenuOptions(node);
        } else {
            menu_info = this.getCanvasMenuOptions();
            var group = this.graph.getGroupOnPos(
                event.canvasX,
                event.canvasY,
            );
            if (group) {
                // on group
                menu_info.push(null, {
                    content: "Edit Group",
                    has_submenu: true,
                    submenu: {
                        title: "Group",
                        extra: group,
                        options: this.getGroupMenuOptions(group),
                    },
                });
            }
        }
    }

    // show menu
    if (!menu_info) {
        return;
    }

    new LiteGraph.ContextMenu(menu_info, options, ref_window);

    function inner_option_clicked(v, options) {
        if (!v) {
            return;
        }
        let info;

        if (v.content == "Remove Slot") {
            info = v.slot;
            node.graph.beforeChange();
            if (info.input) {
                node.removeInput(info.slot);
            } else if (info.output) {
                node.removeOutput(info.slot);
            }
            node.graph.afterChange();
            return;
        } else if (v.content == "Disconnect Links") {
            info = v.slot;
            node.graph.beforeChange();
            if (info.output) {
                node.disconnectOutput(info.slot);
            } else if (info.input) {
                node.disconnectInput(info.slot);
            }
            node.graph.afterChange();
            return;
        } else if (v.content == "Rename Slot") {
            info = v.slot;
            var slot_info = info.input
                ? node.getInputInfo(info.slot)
                : node.getOutputInfo(info.slot);
            var dialog = that.createDialog(
                "<span class='name'>Name</span><input autofocus type='text'/><button>OK</button>",
                options,
            );
            var input = dialog.querySelector("input");
            if (input && slot_info) {
                input.value = slot_info.label || "";
            }
            var inner = function() {
                node.graph.beforeChange();
                if (input.value) {
                    if (slot_info) {
                        slot_info.label = input.value;
                    }
                    that.setDirty(true);
                }
                dialog.close();
                node.graph.afterChange();
            }
            dialog.querySelector("button").addEventListener("click", inner);
            input.addEventListener("keydown", function(e) {
                dialog.is_modified = true;
                if (e.keyCode == 27) {
                    // ESC
                    dialog.close();
                } else if (e.keyCode == 13) {
                    inner(); // save
                } else if (e.keyCode != 13 && e.target.localName != "textarea") {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
            });
            input.focus();
        }
        // if(v.callback)
        //	return v.callback.call(that, node, options, e, menu, that, event );
    }
}
