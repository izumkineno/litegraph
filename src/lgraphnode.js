import { LiteGraph } from "./litegraph.js";
import { installLGraphNodeDelegates } from "./lgraphnode/install-delegates.js";

/*
title: string
pos: [x,y]
size: [x,y]

input|output: every connection
    +  { name:string, type:string, pos: [x,y]=Optional, direction: "input"|"output", links: Array });

general properties:
    + clip_area: if you render outside the node, it will be clipped
    + unsafe_execution: not allowed for safe execution
    + skip_repeated_outputs: when adding new outputs, it wont show if there is one already connected
    + resizable: if set to false it wont be resizable with the mouse
    + horizontal: slots are distributed horizontally
    + widgets_start_y: widgets start at y distance from the top of the node

flags object:
    + collapsed: if it is collapsed

supported callbacks:
    + onAdded: when added to graph (warning: this is called BEFORE the node is configured when loading)
    + onRemoved: when removed from graph
    + onStart:	when the graph starts playing
    + onStop:	when the graph stops playing
    + onDrawForeground: render the inside widgets inside the node
    + onDrawBackground: render the background area inside the node (only in edit mode)
    + onMouseDown
    + onMouseMove
    + onMouseUp
    + onMouseEnter
    + onMouseLeave
    + onExecute: execute the node
    + onPropertyChanged: when a property is changed in the panel (return true to skip default behaviour)
    + onGetInputs: returns an array of possible inputs
    + onGetOutputs: returns an array of possible outputs
    + onBounding: in case this node has a bigger bounding than the node itself (the callback receives the bounding as [x,y,w,h])
    + onDblClick: double clicked in the node
    + onInputDblClick: input slot double clicked (can be used to automatically create a node connected)
    + onOutputDblClick: output slot double clicked (can be used to automatically create a node connected)
    + onConfigure: called after the node has been configured
    + onSerialize: to add extra info when serializing (the callback receives the object that should be filled with the data)
    + onSelected
    + onDeselected
    + onDropItem : DOM item dropped over the node
    + onDropFile : file dropped over the node
    + onConnectInput : if returns false the incoming connection will be canceled
    + onConnectionsChange : a connection changed (new one or removed) (LiteGraph.INPUT or LiteGraph.OUTPUT, slot, true if connected, link_info, input_info )
    + onAction: action slot triggered
    + getExtraMenuOptions: to add option to context menu
*/

/**
 * Base Class for all the node type classes
 * @class LGraphNode
 * @param {String} name a name for the node
 */

export class LGraphNode {

    constructor(title = "Unnamed") {

        this.title = title;
        this.size = [LiteGraph.NODE_WIDTH, 60];
        this.graph = null;

        this._pos = new Float32Array(10, 10);

        if (LiteGraph.use_uuids) {
            this.id = LiteGraph.uuidv4();
        } else {
            this.id = -1; // not know till not added
        }
        this.type = null;

        // inputs available: array of inputs
        this.inputs = [];
        this.outputs = [];
        this.connections = [];

        // local data
        this.properties = {}; // for the values
        this.properties_info = []; // for the info

        this.flags = {};
    }

    set pos(v) {
        if (!v || v.length < 2) {
            return;
        }
        this._pos ??= new Float32Array(10, 10);
        this._pos[0] = v[0];
        this._pos[1] = v[1];
    }

    get pos() {
        return this._pos;
    }
}

export function setupLGraphNodeDelegates(liteGraph = LiteGraph) {
    installLGraphNodeDelegates(LGraphNode, liteGraph);
}
