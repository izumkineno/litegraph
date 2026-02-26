import { LiteGraph } from "../../litegraph.js";
import { LGraphCanvas } from "../../lgraphcanvas.js";
export function processUserInputDown(e) {

    if(this.pointer_is_down && e.isPrimary !== undefined && !e.isPrimary) {
        this.userInput_isNotPrimary = true;
        // DBG("pointerevents: userInput_isNotPrimary start");
    } else {
        this.userInput_isNotPrimary = false;
    }

    this.userInput_type = e.pointerType?e.pointerType:false;
    this.userInput_id = e.pointerId?e.pointerId:false;

    if (e.pointerType) {
        switch (e.pointerType) {
            case "mouse":
                break;
            case "pen":
                break;
            case "touch":
                break;
            default:
                LiteGraph.log?.("pointerType unknown " + ev.pointerType);
        }
    }

    if (e.button !== undefined) {
        this.userInput_button = e.button;
        // LiteGraph.debug?.("input button ",e.button);
        switch(e.button) {
            case -1: // no changes since last event
            case 0: // Left Mouse, Touch Contact, Pen contact
            case 1: // Middle Mouse
            case 2: // Right Mouse, Pen barrel button
            case 3: // X1 (back) Mouse
            case 4: // X2 (forward) Mouse
            case 5: // Pen eraser button
            default: // ?? move without touches
        }
    }
    if (e.buttons !== undefined) {
        this.userInput_button_s = e.buttons;
        // LiteGraph.debug?.("input button_S ",e.buttons);
    }

    this.userInput_touches = (e.changedTouches!==undefined && e.changedTouches.length!==undefined) ? e.changedTouches : false;
    if (this.userInput_touches && this.userInput_touches.length) {
        LiteGraph.debug?.("check multiTouches",e.changedTouches);
    }

    return this.processMouseDown(e);
}

export function processMouseDown(e) {

    if( this.set_canvas_dirty_on_mouse_event )
        this.dirty_canvas = true;

    if (!this.graph) {
        return;
    }

    this.adjustMouseEvent(e);

    var ref_window = this.getCanvasWindow();
    LGraphCanvas.active_canvas = this;

    var x = e.clientX;
    var y = e.clientY;
    // LiteGraph.log?.(y,this.viewport);
    LiteGraph.log?.("pointerevents: processMouseDown pointerId:"+e.pointerId+" which:"+e.which+" isPrimary:"+e.isPrimary+" :: x y "+x+" "+y,"previousClick",this.last_mouseclick,"diffTimeClick",(this.last_mouseclick?LiteGraph.getTime()-this.last_mouseclick:"notlast"));

    this.ds.viewport = this.viewport;
    var is_inside = !this.viewport || ( this.viewport && x >= this.viewport[0] && x < (this.viewport[0] + this.viewport[2]) && y >= this.viewport[1] && y < (this.viewport[1] + this.viewport[3]) );

    // move mouse move event to the window in case it drags outside of the canvas
    if(!this.options.skip_events) {
        this.canvas.removeEventListener("pointermove", this._mousemove_callback);
        ref_window.document.addEventListener("pointermove", this._mousemove_callback,true); // catch for the entire window
        ref_window.document.addEventListener("pointerup", this._mouseup_callback,true);
    }

    if(!is_inside) {
        return;
    }

    var node = this.graph.getNodeOnPos( e.canvasX, e.canvasY, this.visible_nodes, 5 );
    var skip_action = false;
    var now = LiteGraph.getTime();
    var is_primary = (e.isPrimary === undefined || e.isPrimary);
    var is_double_click = (now - this.last_mouseclick < 300) && is_primary;
    this.mouse[0] = e.clientX;
    this.mouse[1] = e.clientY;
    this.graph_mouse[0] = e.canvasX;
    this.graph_mouse[1] = e.canvasY;
    this.last_click_position = [this.mouse[0],this.mouse[1]];

    if (this.pointer_is_down && is_primary ) {
        this.pointer_is_double = true;
        // LiteGraph.log?.("pointerevents: pointer_is_double start");
    }else{
        this.pointer_is_double = false;
    }
    this.pointer_is_down = true;
    this.canvas.focus();
    LiteGraph.ContextMenu.closeAll(ref_window);

    if (this.onMouse?.(e))
        return;

    // left button mouse / single finger
    if (e.which == 1 && !this.userInput_isNotPrimary) {
        if (e.ctrlKey) {
            this.dragging_rectangle = new Float32Array(4);
            this.dragging_rectangle[0] = e.canvasX;
            this.dragging_rectangle[1] = e.canvasY;
            this.dragging_rectangle[2] = 1;
            this.dragging_rectangle[3] = 1;
            skip_action = true;
        }

        // clone node ALT dragging
        if (LiteGraph.alt_drag_do_clone_nodes && e.altKey && node && this.allow_interaction && !skip_action && !this.read_only) {
            let original_node = node;
            let cloned = node.clone();
            if (cloned) {
                cloned.pos[0] += 5;
                cloned.pos[1] += 5;
                this.graph.add(cloned,false,{doCalcSize: false});
                node = cloned;

                if( LiteGraph.alt_shift_drag_connect_clone_with_input && e.shiftKey ) {
                    // process links
                    // DBG LiteGraph.debug?.("altCloned",original_node,node);
                    if (original_node.inputs && original_node.inputs.length) {
                        // DBG("cycle original inputs",original_node.inputs);
                        for (var j = 0; j < original_node.inputs.length; ++j) {
                            var input = original_node.inputs[j];
                            if (!input || input.link == null) {
                                // DBG LiteGraph.debug?.("not input link",input);
                                continue;
                            }
                            var ob_link = this.graph.links[input.link];
                            if (!ob_link) {
                                // DBG LiteGraph.warn?.("not graph link info",input);
                                continue;
                            }
                            if (ob_link.type === LiteGraph.EVENT) {
                                // DBG LiteGraph.debug?.("skip moving events, event links are not rewired on node move", input);
                                continue;
                            }
                            // DBG LiteGraph.debug?.("find link node",ob_link);
                            var source_node;
                            if (ob_link.origin_id) {
                                source_node = this.graph.getNodeById(ob_link.origin_id);
                            }
                            var target_node = node;
                            if( source_node && target_node ) {
                                // DBG LiteGraph.info?.("connect cloned node",ob_link.origin_slot, target_node, ob_link.target_slot);
                                source_node.connect(ob_link.origin_slot, target_node, ob_link.target_slot);
                            }
                        }
                    }
                }

                skip_action = true;
                if (!block_drag_node) {
                    if (this.allow_dragnodes) {
                        this.graph.beforeChange();
                        this.node_dragged = node;
                    }
                    if (!this.selected_nodes[node.id]) {
                        this.processNodeSelected(node, e);
                    }
                }
            }
        }

        var clicking_canvas_bg = false;

        // when clicked on top of a node
        // and it is not interactive
        if (node && (this.allow_interaction || node.flags.allow_interaction) && !skip_action && !this.read_only) {
            if (!this.live_mode && !node.flags.pinned) {
                this.bringToFront(node);
            } // if it wasn't selected?

            // not dragging mouse to connect two slots
            if ( this.allow_interaction && !this.connecting_node && !node.flags.collapsed && !this.live_mode ) {
                // Search for corner for resize
                if ( !skip_action &&
                    node.resizable !== false &&
                    LiteGraph.isInsideRectangle(
                        e.canvasX,
                        e.canvasY,
                        node.pos[0] + node.size[0] - 5,
                        node.pos[1] + node.size[1] - 5,
                        10,
                        10,
                    )
                ) {
                    this.graph.beforeChange();
                    this.resizing_node = node;
                    this.canvas.style.cursor = "se-resize";
                    skip_action = true;
                } else {
                    // search for outputs
                    if (node.outputs) {
                        for ( let i = 0, l = node.outputs.length; i < l; ++i ) {
                            let output = node.outputs[i];
                            let link_pos = node.getConnectionPos(false, i);
                            if (
                                LiteGraph.isInsideRectangle(
                                    e.canvasX,
                                    e.canvasY,
                                    link_pos[0] - 15,
                                    link_pos[1] - 10,
                                    30,
                                    20,
                                )
                            ) {
                                this.connecting_node = node;
                                this.connecting_output = output;
                                this.connecting_output.slot_index = i;
                                this.connecting_pos = node.getConnectionPos( false, i );
                                this.connecting_slot = i;

                                if (LiteGraph.shift_click_do_break_link_from) {
                                    if (e.shiftKey) {
                                        node.disconnectOutput(i);
                                    }
                                }

                                if (is_double_click) {
                                    node.onOutputDblClick?.(i, e);
                                } else {
                                    node.onOutputClick?.(i, e);
                                }

                                skip_action = true;
                                break;
                            }
                        }
                    }

                    // search for inputs
                    if (node.inputs) {
                        for ( let i = 0, l = node.inputs.length; i < l; ++i ) {
                            let input = node.inputs[i];
                            let link_pos = node.getConnectionPos(true, i);
                            if (
                                LiteGraph.isInsideRectangle(
                                    e.canvasX,
                                    e.canvasY,
                                    link_pos[0] - 15,
                                    link_pos[1] - 10,
                                    30,
                                    20,
                                )
                            ) {
                                if (is_double_click) {
                                    node.onInputDblClick?.(i, e);
                                } else {
                                    node.onInputClick?.(i, e);
                                }

                                if (input.link !== null) {
                                    var link_info = this.graph.links[
                                        input.link
                                    ]; // before disconnecting
                                    if (LiteGraph.click_do_break_link_to) {
                                        node.disconnectInput(i);
                                        this.dirty_bgcanvas = true;
                                        skip_action = true;
                                    }else{
                                        // do same action as has not node ?
                                    }

                                    if (
                                        // this.allow_reconnect_links ||
                                        // this.move_destination_link_without_shift ||
                                        e.shiftKey
                                    ) {
                                        if (!LiteGraph.click_do_break_link_to) {
                                            node.disconnectInput(i);
                                        }
                                        this.connecting_node = this.graph._nodes_by_id[
                                            link_info.origin_id
                                        ];
                                        this.connecting_slot =
                                            link_info.origin_slot;
                                        this.connecting_output = this.connecting_node.outputs[
                                            this.connecting_slot
                                        ];
                                        this.connecting_pos = this.connecting_node.getConnectionPos( false, this.connecting_slot );

                                        this.dirty_bgcanvas = true;
                                        skip_action = true;
                                    }


                                }else{
                                    // has not node
                                }

                                if (!skip_action) {
                                    // connect from in to out, from to to from
                                    this.connecting_node = node;
                                    this.connecting_input = input;
                                    this.connecting_input.slot_index = i;
                                    this.connecting_pos = node.getConnectionPos( true, i );
                                    this.connecting_slot = i;

                                    this.dirty_bgcanvas = true;
                                    skip_action = true;
                                }
                            }
                        }
                    }
                } // not resizing
            }

            // it wasn't clicked on the links boxes
            if (!skip_action) {
                var block_drag_node = false;
                var pos = [e.canvasX - node.pos[0], e.canvasY - node.pos[1]];

                // widgets
                var widget = this.processNodeWidgets( node, this.graph_mouse, e );
                if (widget) {
                    block_drag_node = true;
                    this.node_widget = [node, widget];
                }

                // double clicking
                if (this.allow_interaction && is_double_click && this.selected_nodes[node.id]) {
                    node.onDblClick?.( e, pos, this );
                    this.processNodeDblClicked(node);
                    block_drag_node = true;
                }

                // if do not capture mouse
                if ( node.onMouseDown && node.onMouseDown( e, pos, this ) ) {
                    block_drag_node = true;
                } else {
                    // open subgraph button
                    if(node.subgraph && !node.skip_subgraph_button) {
                        if ( !node.flags.collapsed && pos[0] > node.size[0] - LiteGraph.NODE_TITLE_HEIGHT && pos[1] < 0 ) {
                            setTimeout(() => {
                                this.openSubgraph(node.subgraph);
                            }, 10);
                        }
                    }

                    if (this.live_mode) {
                        clicking_canvas_bg = true;
                        block_drag_node = true;
                    }
                }

                if (!block_drag_node) {
                    if (this.allow_dragnodes) {
                        this.graph.beforeChange();
                        this.node_dragged = node;
                    }
                    this.processNodeSelected(node, e);
                } else { // double-click
                    /**
                     * Don't call the function if the block is already selected.
                     * Otherwise, it could cause the block to be unselected while its panel is open.
                     */
                    if (!node.is_selected)
                        this.processNodeSelected(node, e);
                }

                this.dirty_canvas = true;
            }
        } else { // clicked outside of nodes
            if (!skip_action) {
                // search for link connector
                if(!this.read_only) {
                    for (let i = 0; i < this.visible_links.length; ++i) {
                        var link = this.visible_links[i];
                        var center = link._pos;
                        if (
                            !center ||
                            e.canvasX < center[0] - 4 ||
                            e.canvasX > center[0] + 4 ||
                            e.canvasY < center[1] - 4 ||
                            e.canvasY > center[1] + 4
                        ) {
                            continue;
                        }
                        // link clicked
                        this.showLinkMenu(link, e);
                        this.over_link_center = null; // clear tooltip
                        break;
                    }
                }

                this.selected_group = this.graph.getGroupOnPos( e.canvasX, e.canvasY );
                this.selected_group_resizing = false;
                if (this.selected_group && !this.read_only ) {
                    if (e.ctrlKey) {
                        this.dragging_rectangle = null;
                    }

                    var dist = LiteGraph.distance( [e.canvasX, e.canvasY], [ this.selected_group.pos[0] + this.selected_group.size[0], this.selected_group.pos[1] + this.selected_group.size[1] ] );
                    if (dist * this.ds.scale < 10) {
                        this.selected_group_resizing = true;
                    } else {
                        this.selected_group.recomputeInsideNodes();
                    }
                }

                if (is_double_click && !this.read_only && this.allow_searchbox) {
                    this.showSearchBox(e);
                    e.preventDefault();
                    e.stopPropagation();
                }

                LiteGraph.debug?.("DEBUG canvas click is_double_click,this.allow_searchbox",is_double_click,this.allow_searchbox);
                clicking_canvas_bg = true;
            }
        }

        if (!skip_action && clicking_canvas_bg && this.allow_dragcanvas) {
            // LiteGraph.log?.("pointerevents: dragging_canvas start");
            this.dragging_canvas = true;
        }

    } else if (e.which == 2) {
        // middle button

        if (LiteGraph.middle_click_slot_add_default_node) {
            if (node && this.allow_interaction && !skip_action && !this.read_only) {
                // not dragging mouse to connect two slots
                if (
                    !this.connecting_node &&
                    !node.flags.collapsed &&
                    !this.live_mode
                ) {
                    var mClikSlot = false;
                    var mClikSlot_index = false;
                    var mClikSlot_isOut = false;
                    // search for outputs
                    if (node.outputs) {
                        for ( let i = 0, l = node.outputs.length; i < l; ++i ) {
                            var output = node.outputs[i];
                            let link_pos = node.getConnectionPos(false, i);
                            if (LiteGraph.isInsideRectangle(e.canvasX,e.canvasY,link_pos[0] - 15,link_pos[1] - 10,30,20)) {
                                mClikSlot = output;
                                mClikSlot_index = i;
                                mClikSlot_isOut = true;
                                break;
                            }
                        }
                    }

                    // search for inputs
                    if (node.inputs) {
                        for ( let i = 0, l = node.inputs.length; i < l; ++i ) {
                            var input = node.inputs[i];
                            let link_pos = node.getConnectionPos(true, i);
                            if (LiteGraph.isInsideRectangle(e.canvasX,e.canvasY,link_pos[0] - 15,link_pos[1] - 10,30,20)) {
                                mClikSlot = input;
                                mClikSlot_index = i;
                                mClikSlot_isOut = false;
                                break;
                            }
                        }
                    }
                    // LiteGraph.log?.("middleClickSlots? "+mClikSlot+" & "+(mClikSlot_index!==false));
                    if (mClikSlot && mClikSlot_index!==false) {

                        var alphaPosY = 0.5-((mClikSlot_index+1)/((mClikSlot_isOut?node.outputs.length:node.inputs.length)));
                        var node_bounding = node.getBounding();
                        // estimate a position: this is a bad semi-bad-working mess .. REFACTOR with a correct autoplacement that knows about the others slots and nodes
                        var posRef = [
                            (!mClikSlot_isOut?node_bounding[0]:node_bounding[0]+node_bounding[2]),// + node_bounding[0]/this.canvas.width*150
                            e.canvasY-80,// + node_bounding[0]/this.canvas.width*66 // vertical "derive"
                        ];
                        this.createDefaultNodeForSlot({
                            nodeFrom: !mClikSlot_isOut?null:node,
                            slotFrom: !mClikSlot_isOut?null:mClikSlot_index,
                            nodeTo: !mClikSlot_isOut?node:null,
                            slotTo: !mClikSlot_isOut?mClikSlot_index:null,
                            position: posRef, // ,e: e
                            nodeType: "AUTO", // nodeNewType
                            posAdd: [!mClikSlot_isOut?-30:30, -alphaPosY*130], // -alphaPosY*30]
                            posSizeFix: [!mClikSlot_isOut?-1:0, 0], // -alphaPosY*2*/
                        });

                    }
                }
            }
        } else if (!skip_action && this.allow_dragcanvas) {
            // LiteGraph.log?.("pointerevents: dragging_canvas start from middle button");
            this.dragging_canvas = true;
        }


    } else if (e.which == 3 || (LiteGraph.two_fingers_opens_menu && this.userInput_isNotPrimary)) {

        // right button
        if (this.allow_interaction && !skip_action && !this.read_only) {

            // is it hover a node ?
            if (node) {
                if(Object.keys(this.selected_nodes).length
                    && (this.selected_nodes[node.id] || e.shiftKey || e.ctrlKey || e.metaKey)
                ) {
                    // is multiselected or using shift to include the now node
                    if (!this.selected_nodes[node.id]) this.selectNodes([node],true); // add this if not present
                }else{
                    // update selection
                    this.selectNodes([node]);
                }
            }

            // show menu on this node
            this.processContextMenu(node, e);
        }

    }

    // if(this.node_selected != prev_selected)
    //	this.onNodeSelectionChange(this.node_selected);

    this.last_mouse[0] = e.clientX;
    this.last_mouse[1] = e.clientY;
    this.last_mouseclick = LiteGraph.getTime();
    this.last_mouse_dragging = true;

    /*
if( (this.dirty_canvas || this.dirty_bgcanvas) && this.rendering_timer_id == null)
    this.draw();
*/

    this.graph.change();

    // this is to ensure to defocus(blur) if a text input element is on focus
    if (
        !ref_window.document.activeElement ||
        (ref_window.document.activeElement.nodeName.toLowerCase() !=
            "input" &&
            ref_window.document.activeElement.nodeName.toLowerCase() !=
                "textarea")
    ) {
        e.preventDefault();
    }
    e.stopPropagation();
    this.onMouseDown?.(e);
    return false;
}

export function processMouseMove(e) {
    if (this.autoresize) {
        this.resize();
    }

    if( this.set_canvas_dirty_on_mouse_event )
        this.dirty_canvas = true;

    if (!this.graph) {
        return;
    }

    LGraphCanvas.active_canvas = this;
    this.adjustMouseEvent(e);
    var mouse = [e.clientX, e.clientY];
    this.mouse[0] = mouse[0];
    this.mouse[1] = mouse[1];
    var delta = [
        mouse[0] - this.last_mouse[0],
        mouse[1] - this.last_mouse[1],
    ];
    this.last_mouse = mouse;
    this.graph_mouse[0] = e.canvasX;
    this.graph_mouse[1] = e.canvasY;

    // LiteGraph.log?.("pointerevents: processMouseMove "+e.pointerId+" "+e.isPrimary);

    if(this.block_click) {
        // LiteGraph.log?.("pointerevents: processMouseMove block_click");
        e.preventDefault();
        return false;
    }

    e.dragging = this.last_mouse_dragging;

    if (this.node_widget) {
        this.processNodeWidgets(
            this.node_widget[0],
            this.graph_mouse,
            e,
            this.node_widget[1],
        );
        this.dirty_canvas = true;
    }

    // get node over
    var node = this.graph.getNodeOnPos(e.canvasX,e.canvasY,this.visible_nodes);

    if (this.dragging_rectangle) {
        this.dragging_rectangle[2] = e.canvasX - this.dragging_rectangle[0];
        this.dragging_rectangle[3] = e.canvasY - this.dragging_rectangle[1];
        this.dirty_canvas = true;
    } else if (this.selected_group && !this.read_only) {
        // moving/resizing a group
        if (this.selected_group_resizing) {
            this.selected_group.size = [
                e.canvasX - this.selected_group.pos[0],
                e.canvasY - this.selected_group.pos[1],
            ];
        } else {
            var deltax = delta[0] / this.ds.scale;
            var deltay = delta[1] / this.ds.scale;
            this.selected_group.move(deltax, deltay, e.ctrlKey);
            if (this.selected_group._nodes.length) {
                this.dirty_canvas = true;
            }
        }
        this.dirty_bgcanvas = true;
    } else if (this.dragging_canvas) {
        // //LiteGraph.log?.("pointerevents: processMouseMove is dragging_canvas");
        this.ds.offset[0] += delta[0] / this.ds.scale;
        this.ds.offset[1] += delta[1] / this.ds.scale;
        this.dirty_canvas = true;
        this.dirty_bgcanvas = true;
    } else if ((this.allow_interaction || (node && node.flags.allow_interaction)) && !this.read_only) {
        if (this.connecting_node) {
            this.dirty_canvas = true;
        }

        // remove mouseover flag
        for (let i = 0, l = this.graph._nodes.length; i < l; ++i) {
            if (this.graph._nodes[i].mouseOver && node != this.graph._nodes[i] ) {
                // mouse leave
                this.graph._nodes[i].mouseOver = false;
                if (this.node_over && this.node_over.onMouseLeave) {
                    this.node_over.onMouseLeave(e);
                }
                this.node_over = null;
                this.dirty_canvas = true;
            }
        }

        // mouse over a node
        if (node) {

            if(node.redraw_on_mouse)
                this.dirty_canvas = true;

            // this.canvas.style.cursor = "move";
            if (!node.mouseOver) {
                // mouse enter
                node.mouseOver = true;
                this.node_over = node;
                this.dirty_canvas = true;
                node.onMouseEnter?.(e);
            }

            // in case the node wants to do something
            node.onMouseMove?.( e, [e.canvasX - node.pos[0], e.canvasY - node.pos[1]], this );

            // if dragging a link
            if (this.connecting_node) {
                let pos;
                if (this.connecting_output) {

                    pos = this._highlight_input || [0, 0]; // to store the output of isOverNodeInput

                    // on top of input
                    if (!this.isOverNodeBox(node, e.canvasX, e.canvasY)) {
                        // check if I have a slot below de mouse
                        let slot = this.isOverNodeInput( node, e.canvasX, e.canvasY, pos );
                        if (slot != -1 && node.inputs[slot]) {
                            let slot_type = node.inputs[slot].type;
                            if ( LiteGraph.isValidConnection( this.connecting_output.type, slot_type ) ) {
                                this._highlight_input = pos;
                                this._highlight_input_slot = node.inputs[slot];
                            }
                        } else {
                            this._highlight_input = null;
                            this._highlight_input_slot = null;
                        }
                    }

                }else if(this.connecting_input) {

                    pos = this._highlight_output || [0, 0]; // to store the output of isOverNodeOutput

                    // on top of output
                    if (this.isOverNodeBox(node, e.canvasX, e.canvasY)) {
                        // check if I have a slot below de mouse
                        let slot = this.isOverNodeOutput( node, e.canvasX, e.canvasY, pos );
                        if (slot != -1 && node.outputs[slot]) {
                            let slot_type = node.outputs[slot].type;
                            if ( LiteGraph.isValidConnection( this.connecting_input.type, slot_type ) ) {
                                this._highlight_output = pos;
                            }
                        } else {
                            this._highlight_output = null;
                        }
                    }
                }
            }

            // Search for corner
            if (this.canvas) {
                if (
                    LiteGraph.isInsideRectangle(
                        e.canvasX,
                        e.canvasY,
                        node.pos[0] + node.size[0] - 5,
                        node.pos[1] + node.size[1] - 5,
                        5,
                        5,
                    )
                ) {
                    this.canvas.style.cursor = "se-resize";
                } else {
                    this.canvas.style.cursor = "crosshair";
                }
            }
        } else { // not over a node

            // search for link connector
            var over_link = null;
            for (let i = 0; i < this.visible_links.length; ++i) {
                var link = this.visible_links[i];
                var center = link._pos;
                if (
                    !center ||
                    e.canvasX < center[0] - 4 ||
                    e.canvasX > center[0] + 4 ||
                    e.canvasY < center[1] - 4 ||
                    e.canvasY > center[1] + 4
                ) {
                    continue;
                }
                over_link = link;
                break;
            }
            if( over_link != this.over_link_center ) {
                this.over_link_center = over_link;
                this.dirty_canvas = true;
            }

            if (this.canvas) {
                this.canvas.style.cursor = "";
            }
        } // end

        // send event to node if capturing input (used with widgets that allow drag outside of the area of the node)
        if ( this.node_capturing_input && this.node_capturing_input != node && this.node_capturing_input.onMouseMove ) {
            this.node_capturing_input.onMouseMove(e,[e.canvasX - this.node_capturing_input.pos[0],e.canvasY - this.node_capturing_input.pos[1]], this);
        }

        // node being dragged
        if (this.node_dragged && !this.live_mode) {
            // LiteGraph.log?.("draggin!",this.selected_nodes);
            for (let i in this.selected_nodes) {
                let n = this.selected_nodes[i];
                n.pos[0] += delta[0] / this.ds.scale;
                n.pos[1] += delta[1] / this.ds.scale;
                if (!n.is_selected) this.processNodeSelected(n, e); /*
                    * Don't call the function if the block is already selected.
                    * Otherwise, it could cause the block to be unselected while dragging.
                    */
            }

            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
        }

        if (this.resizing_node && !this.live_mode) {
            // convert mouse to node space
            var desired_size = [ e.canvasX - this.resizing_node.pos[0], e.canvasY - this.resizing_node.pos[1] ];
            var min_size = this.resizing_node.computeSize();
            desired_size[0] = Math.max( min_size[0], desired_size[0] );
            desired_size[1] = Math.max( min_size[1], desired_size[1] );
            this.resizing_node.setSize( desired_size );

            this.canvas.style.cursor = "se-resize";
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
        }
    }

    e.preventDefault();
    return false;
}

export function processMouseUp(e) {

    var is_primary = ( e.isPrimary === undefined || e.isPrimary );

    // early exit for extra pointer
    if(!is_primary) {
        /* e.stopPropagation();
        e.preventDefault();*/
        // LiteGraph.log?.("pointerevents: processMouseUp pointerN_stop "+e.pointerId+" "+e.isPrimary);
        return false;
    }

    // LiteGraph.log?.("pointerevents: processMouseUp "+e.pointerId+" "+e.isPrimary+" :: "+e.clientX+" "+e.clientY);

    if( this.set_canvas_dirty_on_mouse_event )
        this.dirty_canvas = true;

    if (!this.graph)
        return;

    var window = this.getCanvasWindow();
    var document = window.document;
    LGraphCanvas.active_canvas = this;

    // restore the mousemove event back to the canvas
    if(!this.options.skip_events) {
        // LiteGraph.log?.("pointerevents: processMouseUp adjustEventListener");
        document.removeEventListener("pointermove", this._mousemove_callback,true);
        this.canvas.addEventListener("pointermove", this._mousemove_callback,true);
        document.removeEventListener("pointerup", this._mouseup_callback,true);
    }

    this.adjustMouseEvent(e);
    var now = LiteGraph.getTime();
    e.click_time = now - this.last_mouseclick;
    this.last_mouse_dragging = false;
    this.last_click_position = null;

    if(this.block_click) {
        // LiteGraph.log?.("pointerevents: processMouseUp block_clicks");
        this.block_click = false; // used to avoid sending twice a click in a immediate button
    }

    // LiteGraph.log?.("pointerevents: processMouseUp which: "+e.which);

    if (e.which == 1) {

        if( this.node_widget ) {
            this.processNodeWidgets( this.node_widget[0], this.graph_mouse, e );
        }

        // left button
        this.node_widget = null;

        if (this.selected_group) {
            var diffx =
                this.selected_group.pos[0] -
                Math.round(this.selected_group.pos[0]);
            var diffy =
                this.selected_group.pos[1] -
                Math.round(this.selected_group.pos[1]);
            this.selected_group.move(diffx, diffy, e.ctrlKey);
            this.selected_group.pos[0] = Math.round(this.selected_group.pos[0]);
            this.selected_group.pos[1] = Math.round(this.selected_group.pos[1]);
            if (this.selected_group._nodes.length) {
                this.dirty_canvas = true;
            }
            this.selected_group = null;
        }
        this.selected_group_resizing = false;

        var node = this.graph.getNodeOnPos(
            e.canvasX,
            e.canvasY,
            this.visible_nodes,
        );

        if (this.dragging_rectangle) {
            if (this.graph) {
                var nodes = this.graph._nodes;
                var node_bounding = new Float32Array(4);

                // compute bounding and flip if left to right
                var w = Math.abs(this.dragging_rectangle[2]);
                var h = Math.abs(this.dragging_rectangle[3]);
                var startx =
                    this.dragging_rectangle[2] < 0
                        ? this.dragging_rectangle[0] - w
                        : this.dragging_rectangle[0];
                var starty =
                    this.dragging_rectangle[3] < 0
                        ? this.dragging_rectangle[1] - h
                        : this.dragging_rectangle[1];
                this.dragging_rectangle[0] = startx;
                this.dragging_rectangle[1] = starty;
                this.dragging_rectangle[2] = w;
                this.dragging_rectangle[3] = h;

                // test dragging rect size, if minimun simulate a click
                if (!node || (w > 10 && h > 10 )) {
                    // test against all nodes (not visible because the rectangle maybe start outside
                    var to_select = [];
                    for (let i = 0; i < nodes.length; ++i) {
                        var nodeX = nodes[i];
                        nodeX.getBounding(node_bounding);
                        if (
                            !LiteGraph.overlapBounding(
                                this.dragging_rectangle,
                                node_bounding,
                            )
                        ) {
                            continue;
                        } // out of the visible area
                        to_select.push(nodeX);
                    }
                    if (to_select.length) {
                        this.selectNodes(to_select,e.shiftKey); // add to selection with shift
                    }
                }else{
                    // will select of update selection
                    this.selectNodes([node],e.shiftKey||e.ctrlKey); // add to selection add to selection with ctrlKey or shiftKey
                }

            }
            this.dragging_rectangle = null;
        } else if (this.connecting_node) {
            // dragging a connection
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;

            var connInOrOut = this.connecting_output || this.connecting_input;
            var connType = connInOrOut.type;

            node = this.graph.getNodeOnPos(
                e.canvasX,
                e.canvasY,
                this.visible_nodes,
            );

            // node below mouse
            if (node) {

                // slot below mouse? connect
                let slot;
                if (this.connecting_output) {

                    slot = this.isOverNodeInput(
                        node,
                        e.canvasX,
                        e.canvasY,
                    );
                    if (slot != -1) {
                        this.connecting_node.connect(this.connecting_slot, node, slot);
                    } else {
                        // not on top of an input
                        // look for a good slot
                        this.connecting_node.connectByType(this.connecting_slot,node,connType);
                    }

                }else if (this.connecting_input) {

                    slot = this.isOverNodeOutput(
                        node,
                        e.canvasX,
                        e.canvasY,
                    );

                    if (slot != -1) {
                        node.connect(slot, this.connecting_node, this.connecting_slot); // this is inverted has output-input nature like
                    } else {
                        // not on top of an input
                        // look for a good slot
                        this.connecting_node.connectByTypeOutput(this.connecting_slot,node,connType);
                    }

                }
                // }
            }else{
                // add menu when releasing link in empty space
                if (LiteGraph.release_link_on_empty_shows_menu) {
                    if (e.shiftKey && this.allow_searchbox) {
                        if(this.connecting_output) {
                            this.showSearchBox(e,{node_from: this.connecting_node, slot_from: this.connecting_output, type_filter_in: this.connecting_output.type});
                        }else if(this.connecting_input) {
                            this.showSearchBox(e,{node_to: this.connecting_node, slot_from: this.connecting_input, type_filter_out: this.connecting_input.type});
                        }
                    }else{
                        if(this.connecting_output) {
                            this.showConnectionMenu({nodeFrom: this.connecting_node, slotFrom: this.connecting_output, e: e});
                        }else if(this.connecting_input) {
                            this.showConnectionMenu({nodeTo: this.connecting_node, slotTo: this.connecting_input, e: e});
                        }
                    }
                }
            }

            this.connecting_output = null;
            this.connecting_input = null;
            this.connecting_pos = null;
            this.connecting_node = null;
            this.connecting_slot = -1;
        } else if (this.resizing_node) { // not dragging connection
            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
            this.graph.afterChange(this.resizing_node);
            this.resizing_node = null;
        } else if (this.node_dragged) {
            // node being dragged?
            node = this.node_dragged;
            if (
                node &&
                e.click_time < 300 &&
                LiteGraph.isInsideRectangle( e.canvasX, e.canvasY, node.pos[0], node.pos[1] - LiteGraph.NODE_TITLE_HEIGHT, LiteGraph.NODE_TITLE_HEIGHT, LiteGraph.NODE_TITLE_HEIGHT )
            ) {
                node.collapse();
            }

            this.dirty_canvas = true;
            this.dirty_bgcanvas = true;
            this.node_dragged.pos[0] = Math.round(this.node_dragged.pos[0]);
            this.node_dragged.pos[1] = Math.round(this.node_dragged.pos[1]);
            if (this.graph.config.align_to_grid || this.align_to_grid ) {
                this.node_dragged.alignToGrid();
            }
            this.onNodeMoved?.( this.node_dragged );
            this.graph.onGraphChanged({action: "nodeDrag", doSave: true});
            this.graph.afterChange(this.node_dragged);
            this.node_dragged = null;
        } else { // no node being dragged
            // get node over
            node = this.graph.getNodeOnPos(
                e.canvasX,
                e.canvasY,
                this.visible_nodes,
            );

            if (!node && e.click_time < 300) {
                this.deselectAllNodes();
            }

            this.dirty_canvas = true;
            this.dragging_canvas = false;

            if (this.node_over && this.node_over.onMouseUp) {
                this.node_over.onMouseUp( e, [ e.canvasX - this.node_over.pos[0], e.canvasY - this.node_over.pos[1] ], this );
            }
            if (
                this.node_capturing_input &&
                this.node_capturing_input.onMouseUp
            ) {
                this.node_capturing_input.onMouseUp(e, [
                    e.canvasX - this.node_capturing_input.pos[0],
                    e.canvasY - this.node_capturing_input.pos[1],
                ]);
            }
        }
    } else if (e.which == 2) {
        // middle button
        // trace("middle");
        this.dirty_canvas = true;
        this.dragging_canvas = false;
    } else if (e.which == 3) {
        // right button
        // trace("right");
        this.dirty_canvas = true;
        this.dragging_canvas = false;
    }

    /*
    if((this.dirty_canvas || this.dirty_bgcanvas) && this.rendering_timer_id == null)
        this.draw();
    */

    if (is_primary) {
        this.pointer_is_down = false;
        this.pointer_is_double = false;
    }

    this.graph.change();

    // LiteGraph.log?.("pointerevents: processMouseUp stopPropagation");
    e.stopPropagation();
    e.preventDefault();
    return false;
}

export function processMouseWheel(e) {
    if (!this.graph || !this.allow_dragcanvas) {
        return;
    }

    var delta = e.wheelDeltaY != null ? e.wheelDeltaY : e.detail * -60;

    this.adjustMouseEvent(e);

    var x = e.clientX;
    var y = e.clientY;
    var is_inside = !this.viewport || ( this.viewport && x >= this.viewport[0] && x < (this.viewport[0] + this.viewport[2]) && y >= this.viewport[1] && y < (this.viewport[1] + this.viewport[3]) );
    if(!is_inside)
        return;

    var scale = this.ds.scale;

    scale *= Math.pow(1.1, delta * 0.01);

    // this.setZoom( scale, [ e.clientX, e.clientY ] );
    this.ds.changeScale(scale, [e.clientX, e.clientY]);

    this.graph.change();

    e.preventDefault();
    return false; // prevent default
}
