import { LiteGraph } from "../../litegraph.js";
import { LGraphCanvas } from "../../lgraphcanvas.js";
export function blockClick() {
    this.block_click = true;
    this.last_mouseclick = 0;
}

export function processKey(e) {
    if (!this.graph) {
        return;
    }

    var block_default = false;
    // LiteGraph.log?.(e); //debug

    if (e.target.localName == "input") {
        return;
    }

    if (e.type == "keydown") {
        if (e.keyCode == 32) {
            // space
            this.dragging_canvas = true;
            block_default = true;
        }

        if (e.keyCode == 27) {
            // esc
            if(this.node_panel) this.node_panel.close();
            if(this.options_panel) this.options_panel.close();
            block_default = true;
        }

        // select all Control A
        if (e.keyCode == 65 && e.ctrlKey) {
            this.selectNodes();
            block_default = true;
        }

        if ((e.keyCode === 67) && (e.metaKey || e.ctrlKey) && !e.shiftKey) {
            // copy
            if (this.selected_nodes) {
                this.copyToClipboard();
                block_default = true;
            }
        }

        if ((e.keyCode === 86) && (e.metaKey || e.ctrlKey)) {
            // paste
            this.pasteFromClipboard(e.shiftKey);
        }

        // delete or backspace
        if (e.keyCode == 46 || (LiteGraph.backspace_delete && e.keyCode == 8)) {
            if (
                e.target.localName != "input" &&
                e.target.localName != "textarea"
            ) {
                this.deleteSelectedNodes();
                block_default = true;
            }
        }

        // collapse
        // ...

        // control Z, control Y, ctlrZ, ctlrY
        if (LiteGraph.actionHistory_enabled) {
            if (e.keyCode == 89 && e.ctrlKey || (e.keyCode == 90 && e.ctrlKey && e.shiftKey)) {
                // Y
                this.graph.actionHistoryForward();
            }else if (e.keyCode == 90 && e.ctrlKey) {
                // Z
                this.graph.actionHistoryBack();
            }
        }
        LiteGraph.debug?.("Canvas keydown "+e.keyCode); // debug keydown

        if (this.selected_nodes) {
            for (let i in this.selected_nodes) {
                this.selected_nodes[i].onKeyDown?.(e);
            }
        }
    } else if (e.type == "keyup") {
        if (e.keyCode == 32) {
            // space
            this.dragging_canvas = false;
        }

        if (this.selected_nodes) {
            for (let i in this.selected_nodes) {
                this.selected_nodes[i].onKeyUp?.(e);
            }
        }
    }

    this.graph.change();

    if (block_default) {
        e.preventDefault();
        e.stopImmediatePropagation();
        return false;
    }
}

export function processDrop(e) {
    e.preventDefault();
    this.adjustMouseEvent(e);
    var x = e.clientX;
    var y = e.clientY;
    var is_inside = !this.viewport || ( this.viewport && x >= this.viewport[0] && x < (this.viewport[0] + this.viewport[2]) && y >= this.viewport[1] && y < (this.viewport[1] + this.viewport[3]) );
    if(!is_inside) {
        return;
        // --- BREAK ---
    }

    x = e.localX;
    y = e.localY;
    var is_inside = !this.viewport || ( this.viewport && x >= this.viewport[0] && x < (this.viewport[0] + this.viewport[2]) && y >= this.viewport[1] && y < (this.viewport[1] + this.viewport[3]) );
    if(!is_inside) {
        return;
        // --- BREAK ---
    }

    var pos = [e.canvasX, e.canvasY];


    var node = this.graph ? this.graph.getNodeOnPos(pos[0], pos[1]) : null;

    if (!node) {
        var r = null;
        if (this.onDropItem) {
            r = this.onDropItem(event);
        }
        if (!r) {
            this.checkDropItem(e);
        }
        return;
    }

    if (node.onDropFile || node.onDropData) {
        var files = e.dataTransfer.files;
        if (files && files.length) {
            for (let i = 0; i < files.length; i++) {
                var file = e.dataTransfer.files[0];
                var filename = file.name;
                // LiteGraph.log?.(file);

                if (node.onDropFile) {
                    node.onDropFile(file);
                }

                if (node.onDropData) {
                    // prepare reader
                    var reader = new FileReader();
                    reader.onload = function(event) {
                        // LiteGraph.log?.(event.target);
                        var data = event.target.result;
                        node.onDropData(data, filename, file);
                    };

                    // read data
                    var type = file.type.split("/")[0];
                    if (type == "text" || type == "") {
                        reader.readAsText(file);
                    } else if (type == "image") {
                        reader.readAsDataURL(file);
                    } else {
                        reader.readAsArrayBuffer(file);
                    }
                }
            }
        }
    }

    if (node.onDropItem) {
        if (node.onDropItem(event)) {
            return true;
        }
    }

    if (this.onDropItem) {
        return this.onDropItem(event);
    }

    return false;
}

export function checkDropItem(e) {
    if (e.dataTransfer.files.length) {
        var file = e.dataTransfer.files[0];
        var ext = LGraphCanvas.getFileExtension(file.name).toLowerCase();
        var nodetype = LiteGraph.node_types_by_file_extension[ext];
        if (nodetype) {
            this.graph.beforeChange();
            var node = LiteGraph.createNode(nodetype.type);
            node.pos = [e.canvasX, e.canvasY];
            this.graph.add(node, false, {doProcessChange: false});
            node.onDropFile?.(file);
            this.graph.onGraphChanged({action: "fileDrop", doSave: true});
            this.graph.afterChange();
        }
    }
}
