import { LiteGraph } from "../../litegraph.js";
import { LGraphCanvas } from "../../lgraphcanvas.js";
export function prompt(title = "", value, callback, event, multiline) {

    var dialog = document.createElement("div");
    dialog.is_modified = false;
    dialog.className = "graphdialog rounded";
    if(multiline)
        dialog.innerHTML = "<span class='name'></span> <textarea autofocus class='value'></textarea><button class='rounded'>OK</button>";
    else
        dialog.innerHTML = "<span class='name'></span> <input autofocus type='text' class='value'/><button class='rounded'>OK</button>";

    dialog.close = () => {
        this.prompt_box = null;
        dialog.parentNode?.removeChild(dialog);
    };

    var graphcanvas = LGraphCanvas.active_canvas;
    var canvas = graphcanvas.canvas;
    canvas.parentNode.appendChild(dialog);

    if (this.ds.scale > 1) {
        dialog.style.transform = `scale(${this.ds.scale})`;
    }

    var dialogCloseTimer = null;
    var prevent_timeout = 0;
    dialog.addEventListener("pointerleave", (_event) => {
        if (prevent_timeout > 0) return;
        if (LiteGraph.dialog_close_on_mouse_leave && !dialog.is_modified && LiteGraph.dialog_close_on_mouse_leave) {
            dialogCloseTimer = setTimeout(dialog.close, LiteGraph.dialog_close_on_mouse_leave_delay);
        }
    });

    dialog.addEventListener("pointerenter", (_event) => {
        if (LiteGraph.dialog_close_on_mouse_leave && dialogCloseTimer) {
            clearTimeout(dialogCloseTimer);
        }
    });

    const selInDia = dialog.querySelectorAll("select");
    if (selInDia) {
        prevent_timeout = 0;
        selInDia.forEach((selIn) => {
            selIn.addEventListener("pointerdown", (_event) => {
                prevent_timeout++;
            });
            selIn.addEventListener("focus", (_event) => {
                prevent_timeout++;
            });
            selIn.addEventListener("blur", (_event) => {
                prevent_timeout = Math.max(0, prevent_timeout - 1);
            });
            selIn.addEventListener("change", (_event) => {
                prevent_timeout = 0;
            });
        });
    }

    this.prompt_box?.close();
    this.prompt_box = dialog;

    var name_element = dialog.querySelector(".name");
    name_element.innerText = title;
    var value_element = dialog.querySelector(".value");
    value_element.value = value;

    const input = value_element;
    input.addEventListener("keydown", (e) => {
        dialog.is_modified = true;

        switch (e.key) {
            case "Escape":
                dialog.close();
                break;
            case "Enter":
                if (e.target.localName !== "textarea" && typeof(callback)=="function") {
                    callback(input.value);
                    this.setDirty(true); // CHECK should probably call graphChanged instead
                }
                LiteGraph.debug?.("prompt v2 ENTER",input.value,e.target.localName,callback);
                dialog.close();
                break;
            default:
                return; // Ignore other key codes
        }

        e.preventDefault();
        e.stopPropagation();
    });

    const button = dialog.querySelector("button");
    button.addEventListener("click", (_event) => {
        if (typeof(callback)=="function") {
            callback(input.value);
            this.setDirty(true); // CHECK should probably call graphChanged instead
        }
        LiteGraph.debug?.("prompt v2 OK",input.value,callback);
        dialog.close();
    });

    var rect = canvas.getBoundingClientRect();
    var offsetx = -20;
    var offsety = -20;
    if (rect) {
        offsetx -= rect.left;
        offsety -= rect.top;
    }

    if (event) {
        dialog.style.left = event.clientX + offsetx + "px";
        dialog.style.top = event.clientY + offsety + "px";
    } else {
        dialog.style.left = canvas.width * 0.5 + offsetx + "px";
        dialog.style.top = canvas.height * 0.5 + offsety + "px";
    }

    setTimeout(function() {
        input.focus();
    }, 10);

    return dialog;
}

export function showSearchBox(event, options) {
    // proposed defaults
    var def_options = {
        slot_from: null,
        node_from: null,
        node_to: null,
        do_type_filter: LiteGraph.search_filter_enabled &&
            (
                Object.keys(LiteGraph.registered_slot_in_types || {}).length > 0 ||
                Object.keys(LiteGraph.registered_slot_out_types || {}).length > 0
            ),
        type_filter_in: false, // these are default: pass to set initially set values
        type_filter_out: false,
        show_general_if_none_on_typefilter: true,
        show_general_after_typefiltered: true,
        hide_on_mouse_leave: LiteGraph.search_hide_on_mouse_leave,
        show_all_if_empty: true,
        show_all_on_open: LiteGraph.search_show_all_on_open,
    };
    options = Object.assign(def_options, options || {});

    // LiteGraph.log?.(options);

    var that = this;
    var graphcanvas = LGraphCanvas.active_canvas;
    var canvas = graphcanvas.canvas;
    var root_document = canvas.ownerDocument || document;

    var dialog = document.createElement("div");
    dialog.className = "litegraph litesearchbox graphdialog rounded";
    dialog.innerHTML = "<span class='name'>Search</span> <input autofocus type='text' class='value rounded'/>";
    if (options.do_type_filter) {
        dialog.innerHTML += "<select class='slot_in_type_filter'><option value=''></option></select>";
        dialog.innerHTML += "<select class='slot_out_type_filter'><option value=''></option></select>";
    }
    if(options.show_close_button) {
        dialog.innerHTML += "<button class='close_searchbox close'>X</button>";
    }
    dialog.innerHTML += "<div class='helper'></div>";

    if( root_document.fullscreenElement )
        root_document.fullscreenElement.appendChild(dialog);
    else {
        root_document.body.appendChild(dialog);
        root_document.body.style.overflow = "hidden";
    }
    // dialog element has been appended

    if (options.do_type_filter) {
        var selIn = dialog.querySelector(".slot_in_type_filter");
        var selOut = dialog.querySelector(".slot_out_type_filter");
    }

    dialog.close = function() {
        that.search_box = null;
        this.blur();
        canvas.focus();
        root_document.body.style.overflow = "";

        setTimeout(function() {
            that.canvas.focus();
        }, 20); // important, if canvas loses focus keys wont be captured
        if (dialog.parentNode) {
            dialog.parentNode.removeChild(dialog);
        }
    };

    if (this.ds.scale > 1) {
        dialog.style.transform = `scale(${this.ds.scale})`;
    }

    // hide on mouse leave
    if(options.hide_on_mouse_leave) {
        var prevent_timeout = 0;
        var timeout_close = null;
        dialog.addEventListener("pointerenter", function(_event) {
            if (timeout_close) {
                clearTimeout(timeout_close);
                timeout_close = null;
            }
        });
        dialog.addEventListener("pointerleave", function(_event) {
            if (prevent_timeout > 0) {
                return;
            }
            timeout_close = setTimeout(function() {
                dialog.close();
            }, 500);
        });
        // if filtering, check focus changed to comboboxes and prevent closing
        if (options.do_type_filter) {
            const attachTimeoutGuard = function(selectElement) {
                if (!selectElement) {
                    return;
                }
                selectElement.addEventListener("pointerdown", function(_event) {
                    prevent_timeout++;
                });
                selectElement.addEventListener("focus", function(_event) {
                    prevent_timeout++;
                });
                selectElement.addEventListener("blur", function(_event) {
                    prevent_timeout = Math.max(0, prevent_timeout - 1);
                });
                selectElement.addEventListener("change", function(_event) {
                    prevent_timeout = 0;
                });
            };
            attachTimeoutGuard(selIn);
            attachTimeoutGuard(selOut);
        }
    }

    if (that.search_box) {
        that.search_box.close();
    }
    that.search_box = dialog;

    var helper = dialog.querySelector(".helper");

    var first = null;
    var timeout = null;
    var selected = null;

    var input = dialog.querySelector("input");
    if (input) {
        input.addEventListener("blur", function(_event) {
            if(that.search_box)
                this.focus();
        });
        input.addEventListener("keydown", function(e) {
            if (e.key === "ArrowUp") {
                // UP
                changeSelection(false);
            } else if (e.key === "ArrowDown") {
                // DOWN
                changeSelection(true);
            } else if (e.key === "Escape") {
                // ESC
                dialog.close();
            } else if (e.key === "Enter") {
                refreshHelper();
                if (selected) {
                    select(selected.innerHTML);
                } else if (first) {
                    select(first);
                } else {
                    dialog.close();
                }
            } else {
                if (timeout) {
                    clearInterval(timeout);
                }
                timeout = setTimeout(refreshHelper, 250);
                return;
            }
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return true;
        });
    }

    // if should filter on type, load and fill selected and choose elements if passed
    if (options.do_type_filter) {
        if (selIn) {
            let aSlots = LiteGraph.slot_types_in;
            let nSlots = aSlots.length; // this for object :: Object.keys(aSlots).length;

            if (options.type_filter_in == LiteGraph.EVENT || options.type_filter_in == LiteGraph.ACTION)
                options.type_filter_in = "_event_";
            /* this will filter on * .. but better do it manually in case
            else if(options.type_filter_in === "" || options.type_filter_in === 0)
                options.type_filter_in = "*";*/

            for (let iK=0; iK<nSlots; iK++) {
                let opt = document.createElement('option');
                opt.value = aSlots[iK];
                opt.innerHTML = aSlots[iK];
                selIn.appendChild(opt);
                if(options.type_filter_in !==false && (options.type_filter_in+"").toLowerCase() == (aSlots[iK]+"").toLowerCase()) {
                    // selIn.selectedIndex ..
                    opt.selected = true;
                    // LiteGraph.log?.("comparing IN "+options.type_filter_in+" :: "+aSlots[iK]);
                }else{
                    // LiteGraph.log?.("comparing OUT "+options.type_filter_in+" :: "+aSlots[iK]);
                }
            }
            selIn.addEventListener("change",function() {
                refreshHelper();
            });
        }
        if (selOut) {
            let aSlots = LiteGraph.slot_types_out;
            let nSlots = aSlots.length; // this for object :: Object.keys(aSlots).length;

            if (options.type_filter_out == LiteGraph.EVENT || options.type_filter_out == LiteGraph.ACTION)
                options.type_filter_out = "_event_";
            /* this will filter on * .. but better do it manually in case
            else if(options.type_filter_out === "" || options.type_filter_out === 0)
                options.type_filter_out = "*";*/

            for (let iK = 0; iK < nSlots; iK++) {
                let opt = document.createElement('option');
                opt.value = aSlots[iK];
                opt.innerHTML = aSlots[iK];
                selOut.appendChild(opt);
                if(options.type_filter_out !==false && (options.type_filter_out+"").toLowerCase() == (aSlots[iK]+"").toLowerCase()) {
                    // selOut.selectedIndex ..
                    opt.selected = true;
                }
            }
            selOut.addEventListener("change",function() {
                refreshHelper();
            });
        }
    }

    if(options.show_close_button) {
        var button = dialog.querySelector(".close");
        button.addEventListener("click", dialog.close);
    }

    // compute best position
    var rect = canvas.getBoundingClientRect();

    var left = ( event ? event.clientX : (rect.left + rect.width * 0.5) ) - 80;
    var top = ( event ? event.clientY : (rect.top + rect.height * 0.5) ) - 20;

    if (rect.width - left < 470) left = rect.width - 470;
    if (rect.height - top < 220) top = rect.height - 220;
    if (left < rect.left + 20) left = rect.left + 20;
    if (top < rect.top + 20) top = rect.top + 20;

    dialog.style.left = left + "px";
    dialog.style.top = top + "px";

    /*
    var offsetx = -20;
    var offsety = -20;
    if (rect) {
        offsetx -= rect.left;
        offsety -= rect.top;
    }

    if (event) {
        dialog.style.left = event.clientX + offsetx + "px";
        dialog.style.top = event.clientY + offsety + "px";
    } else {
        dialog.style.left = canvas.width * 0.5 + offsetx + "px";
        dialog.style.top = canvas.height * 0.5 + offsety + "px";
    }
    canvas.parentNode.appendChild(dialog);
    */

    input.focus();
    if (options.show_all_on_open) refreshHelper();

    function select(name) {
        if (name) {
            if (that.onSearchBoxSelection) {
                that.onSearchBoxSelection(name, event, graphcanvas);
            } else {
                var extra = LiteGraph.searchbox_extras[name.toLowerCase()];
                if (extra) {
                    name = extra.type;
                }

                graphcanvas.graph.beforeChange();
                var node = LiteGraph.createNode(name);
                if (node) {
                    node.pos = graphcanvas.convertEventToCanvasOffset(event);
                    graphcanvas.graph.add(node, false, {doProcessChange: false});
                }

                if (extra && extra.data) {
                    if (extra.data.properties) {
                        for (let i in extra.data.properties) {
                            node.addProperty( i, extra.data.properties[i] );
                        }
                    }
                    if (extra.data.inputs) {
                        node.inputs = [];
                        for (let i in extra.data.inputs) {
                            node.addOutput(
                                extra.data.inputs[i][0],
                                extra.data.inputs[i][1],
                            );
                        }
                    }
                    if (extra.data.outputs) {
                        node.outputs = [];
                        for (let i in extra.data.outputs) {
                            node.addOutput(
                                extra.data.outputs[i][0],
                                extra.data.outputs[i][1],
                            );
                        }
                    }
                    if (extra.data.title) {
                        node.title = extra.data.title;
                    }
                    if (extra.data.json) {
                        node.configure(extra.data.json);
                    }

                }

                let iS;

                // join node after inserting
                if (options.node_from) {
                    iS = false;
                    switch (typeof options.slot_from) {
                        case "string":
                            iS = options.node_from.findOutputSlot(options.slot_from);
                            break;
                        case "object":
                            if (options.slot_from.name) {
                                iS = options.node_from.findOutputSlot(options.slot_from.name);
                            }else{
                                iS = -1;
                            }
                            if (iS==-1 && typeof options.slot_from.slot_index !== "undefined") iS = options.slot_from.slot_index;
                            break;
                        case "number":
                            iS = options.slot_from;
                            break;
                        default:
                            iS = 0; // try with first if no name set
                    }
                    if (typeof options.node_from.outputs[iS] !== "undefined") {
                        if (iS!==false && iS>-1) {
                            options.node_from.connectByType( iS, node, options.node_from.outputs[iS].type );
                        }
                    }else{
                        // LiteGraph.warn?.("cant find slot " + options.slot_from);
                    }
                }
                if (options.node_to) {
                    iS = false;
                    switch (typeof options.slot_from) {
                        case "string":
                            iS = options.node_to.findInputSlot(options.slot_from);
                            break;
                        case "object":
                            if (options.slot_from.name) {
                                iS = options.node_to.findInputSlot(options.slot_from.name);
                            }else{
                                iS = -1;
                            }
                            if (iS==-1 && typeof options.slot_from.slot_index !== "undefined") iS = options.slot_from.slot_index;
                            break;
                        case "number":
                            iS = options.slot_from;
                            break;
                        default:
                            iS = 0; // try with first if no name set
                    }
                    if (typeof options.node_to.inputs[iS] !== "undefined") {
                        if (iS!==false && iS>-1) {
                            // try connection
                            options.node_to.connectByTypeOutput(iS,node,options.node_to.inputs[iS].type);
                        }
                    }else{
                        // LiteGraph.warn?.("cant find slot_nodeTO " + options.slot_from);
                    }
                }

                graphcanvas.graph.afterChange();
            }
        }

        dialog.close();
    }

    function changeSelection(forward) {
        var prev = selected;
        if (selected) {
            selected.classList.remove("selected");
        }
        if (!selected) {
            selected = forward
                ? helper.childNodes[0]
                : helper.childNodes[helper.childNodes.length];
        } else {
            selected = forward
                ? selected.nextSibling
                : selected.previousSibling;
            if (!selected) {
                selected = prev;
            }
        }
        if (!selected) {
            return;
        }
        selected.classList.add("selected");
        selected.scrollIntoView({block: "end", behavior: "smooth"});
    }

    function refreshHelper() {
        timeout = null;
        var str = input.value;
        first = null;
        helper.innerHTML = "";
        if (!str && !options.show_all_if_empty) {
            return;
        }

        if (that.onSearchBox) {
            var list = that.onSearchBox(helper, str, graphcanvas);
            if (list) {
                for (let i = 0; i < list.length; ++i) {
                    addResult(list[i]);
                }
            }
        } else {
            var c = 0;
            str = str.toLowerCase();
            var filter = graphcanvas.filter || graphcanvas.graph.filter;

            let sIn, sOut;

            // filter by type preprocess
            if(options.do_type_filter && that.search_box) {
                sIn = that.search_box.querySelector(".slot_in_type_filter");
                sOut = that.search_box.querySelector(".slot_out_type_filter");
            }else{
                sIn = false;
                sOut = false;
            }

            // extras
            for (let i in LiteGraph.searchbox_extras) {
                var extra = LiteGraph.searchbox_extras[i];
                if ((!options.show_all_if_empty || str) && extra.desc.toLowerCase().indexOf(str) === -1) {
                    continue;
                }
                var ctor = LiteGraph.registered_node_types[extra.type];
                if( ctor && ctor.filter != filter )
                    continue;
                if( ! inner_test_filter(extra.type) )
                    continue;
                addResult( extra.desc, "searchbox_extra" );
                if ( LGraphCanvas.search_limit !== -1 && c++ > LGraphCanvas.search_limit ) {
                    break;
                }
            }

            var filtered = null;
            if (Array.prototype.filter) { // filter supported
                let keys = Object.keys( LiteGraph.registered_node_types ); // types
                filtered = keys.filter( inner_test_filter );
            } else {
                filtered = [];
                for (let i in LiteGraph.registered_node_types) {
                    if( inner_test_filter(i) )
                        filtered.push(i);
                }
            }

            for (let i = 0; i < filtered.length; i++) {
                addResult(filtered[i]);
                if ( LGraphCanvas.search_limit !== -1 && c++ > LGraphCanvas.search_limit ) {
                    break;
                }
            }

            // add general type if filtering
            if (options.show_general_after_typefiltered
                && (sIn.value || sOut.value)
            ) {
                var filtered_extra = [];
                for (let i in LiteGraph.registered_node_types) {
                    if( inner_test_filter(i, {inTypeOverride: sIn&&sIn.value?"*":false, outTypeOverride: sOut&&sOut.value?"*":false}) )
                        filtered_extra.push(i);
                }
                for (let i = 0; i < filtered_extra.length; i++) {
                    addResult(filtered_extra[i], "generic_type");
                    if ( LGraphCanvas.search_limit !== -1 && c++ > LGraphCanvas.search_limit ) {
                        break;
                    }
                }
            }

            // check il filtering gave no results
            if ((sIn.value || sOut.value) &&
                ( (helper.childNodes.length == 0 && options.show_general_if_none_on_typefilter) )
            ) {
                var filtered_extra = [];
                for (let i in LiteGraph.registered_node_types) {
                    if( inner_test_filter(i, {skipFilter: true}) )
                        filtered_extra.push(i);
                }
                for (let i = 0; i < filtered_extra.length; i++) {
                    addResult(filtered_extra[i], "not_in_filter");
                    if ( LGraphCanvas.search_limit !== -1 && c++ > LGraphCanvas.search_limit ) {
                        break;
                    }
                }
            }

            function inner_test_filter(type, optsIn = {}) {
                var optsDef = {
                    skipFilter: false,
                    inTypeOverride: false,
                    outTypeOverride: false,
                };
                var opts = Object.assign(optsDef,optsIn);
                var ctor = LiteGraph.registered_node_types[type];
                if(filter && ctor.filter != filter )
                    return false;
                if ((!options.show_all_if_empty || str) && type.toLowerCase().indexOf(str) === -1)
                    return false;

                // filter by slot IN, OUT types
                if(options.do_type_filter && !opts.skipFilter) {
                    var sType = type;
                    let doesInc;

                    var sV = sIn.value;
                    if (opts.inTypeOverride!==false) sV = opts.inTypeOverride;
                    // if (sV.toLowerCase() == "_event_") sV = LiteGraph.EVENT; // -1

                    if(sIn && sV) {
                        // LiteGraph.log?.("will check filter against "+sV);
                        if (LiteGraph.registered_slot_in_types[sV] && LiteGraph.registered_slot_in_types[sV].nodes) { // type is stored
                            // LiteGraph.debug?.("check "+sType+" in "+LiteGraph.registered_slot_in_types[sV].nodes);
                            doesInc = LiteGraph.registered_slot_in_types[sV].nodes.includes(sType);
                            if (doesInc!==false) {
                                // LiteGraph.log?.(sType+" HAS "+sV);
                            }else{
                                /* LiteGraph.debug?.(LiteGraph.registered_slot_in_types[sV]);
                                LiteGraph.log?.(+" DONT includes "+type);*/
                                return false;
                            }
                        }
                    }

                    sV = sOut.value;
                    if (opts.outTypeOverride!==false) {
                        sV = opts.outTypeOverride;
                    }
                    // if (sV.toLowerCase() == "_event_") sV = LiteGraph.EVENT; // -1

                    if(sOut && sV) {
                        // LiteGraph.log?.("search will check filter against "+sV);
                        if (LiteGraph.registered_slot_out_types[sV] && LiteGraph.registered_slot_out_types[sV].nodes) { // type is stored
                            // LiteGraph.debug?.("check "+sType+" in "+LiteGraph.registered_slot_out_types[sV].nodes);
                            doesInc = LiteGraph.registered_slot_out_types[sV].nodes.includes(sType);
                            if (doesInc!==false) {
                                // LiteGraph.log?.(sType+" HAS "+sV);
                            }else{
                                /* LiteGraph.debug?.(LiteGraph.registered_slot_out_types[sV]);
                                LiteGraph.log?.(+" DONT includes "+type);*/
                                return false;
                            }
                        }
                    }
                }
                return true;
            }
        }

        function addResult(type, className) {
            var help = document.createElement("div");
            if (!first) {
                first = type;
            }
            help.innerText = type;
            help.dataset["type"] = encodeURIComponent(type);
            help.className = "litegraph lite-search-item";
            if (className) {
                help.className += " " + className;
            }
            help.addEventListener("click", function(_event) {
                select(decodeURIComponent(this.dataset["type"]));
            });
            helper.appendChild(help);
        }
    }

    return dialog;
}

export function showEditPropertyValue(node, property, options) {
    if (!node || node.properties[property] === undefined) {
        return;
    }

    options = options || {};

    var info = node.getPropertyInfo(property);
    var type = info.type;

    let input_html;

    if (type == "string" || type == "number" || type == "array" || type == "object") {
        input_html = "<input autofocus type='text' class='value'/>";
    } else if ( (type == "enum" || type == "combo") && info.values) {
        LiteGraph.debug?.("CREATING showEditPropertyValue ENUM COMBO",input,type,dialog);
        input_html = "<select autofocus type='text' class='value'>";
        for (let i in info.values) {
            var v = i;
            if( info.values.constructor === Array )
                v = info.values[i];

            input_html +=
                "<option value='" +
                v +
                "' " +
                (v == node.properties[property] ? "selected" : "") +
                ">" +
                info.values[i] +
                "</option>";
        }
        input_html += "</select>";
    } else if (type == "boolean" || type == "toggle") {
        input_html =
            "<input autofocus type='checkbox' class='value' " +
            (node.properties[property] ? "checked" : "") +
            "/>";
    } else {
        LiteGraph.warn?.("unknown type: " + type);
        return;
    }

    var dialog = this.createDialog(
        "<span class='name'>" +
            (info.label ? info.label : property) +
            "</span>" +
            input_html +
            "<button>OK</button>",
        options,
    );

    var input = false;
    if ((type == "enum" || type == "combo") && info.values) {
        LiteGraph.debug?.("showEditPropertyValue ENUM COMBO",input,type,dialog);
        input = dialog.querySelector("select");
        input.addEventListener("change", function(e) {
            dialog.modified();
            LiteGraph.debug?.("Enum change",input,info,e.target);
            setValue(e.target.value);
            // var index = e.target.value;
            // setValue( e.options[e.selectedIndex].value );
        });
    } else if (type == "boolean" || type == "toggle") {
        LiteGraph.debug?.("showEditPropertyValue TOGGLE",input,type,dialog);
        input = dialog.querySelector("input");
        if (input) {
            input.addEventListener("click", function(_event) {
                dialog.modified();
                setValue(!!input.checked);
            });
        }
    } else {
        input = dialog.querySelector("input");
        LiteGraph.debug?.("showEditPropertyValue",input,type,dialog);
        if (input) {
            input.addEventListener("blur", function(_event) {
                this.focus();
            });

            v = node.properties[property] !== undefined ? node.properties[property] : "";
            if (type !== 'string') {
                v = JSON.stringify(v);
            }

            input.value = v;
            input.addEventListener("keydown", function(e) {
                if (e.keyCode == 27) {
                    // ESC
                    dialog.close();
                } else if (e.keyCode == 13) {
                    // ENTER
                    inner(); // save
                } else if (e.keyCode != 13) {
                    dialog.modified();
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
            });
        }
    }
    if (input) input.focus();

    var button = dialog.querySelector("button");
    button.addEventListener("click", inner);

    function inner() {
        setValue(input.value);
    }

    function setValue(value) {

        if(info && info.values && info.values.constructor === Object && info.values[value] != undefined )
            value = info.values[value];

        if (typeof node.properties[property] == "number") {
            value = Number(value);
        }
        if (type == "array" || type == "object") {
            value = JSON.parse(value);
        }
        node.properties[property] = value;
        node.graph?.onGraphChanged({action: "propertyChanged", doSave: true});
        if (node.onPropertyChanged) {
            node.onPropertyChanged(property, value);
        }
        if(options.onclose)
            options.onclose();
        dialog.close();
        node.setDirtyCanvas(true, true);
    }

    return dialog;
}

export function createDialog(html, options) {
    var def_options = { checkForInput: false, closeOnLeave: true, closeOnLeave_checkModified: true };
    options = Object.assign(def_options, options || {});

    var dialog = document.createElement("div");
    dialog.className = "graphdialog";
    dialog.innerHTML = html;
    dialog.is_modified = false;

    var rect = this.canvas.getBoundingClientRect();
    var offsetx = -20;
    var offsety = -20;
    if (rect) {
        offsetx -= rect.left;
        offsety -= rect.top;
    }

    if (options.position) {
        offsetx += options.position[0];
        offsety += options.position[1];
    } else if (options.event) {
        offsetx += options.event.clientX;
        offsety += options.event.clientY;
    } else { // centered
        offsetx += this.canvas.width * 0.5;
        offsety += this.canvas.height * 0.5;
    }

    dialog.style.left = offsetx + "px";
    dialog.style.top = offsety + "px";

    this.canvas.parentNode.appendChild(dialog);

    // check for input and use default behaviour: save on enter, close on esc
    if (options.checkForInput) {
        var aI = [];
        var focused = false;
        aI = dialog.querySelectorAll("input");
        if (aI) {
            aI.forEach(function(iX) {
                iX.addEventListener("keydown",function(e) {
                    dialog.modified();
                    if (e.keyCode == 27) {
                        dialog.close();
                    } else if (e.keyCode != 13) {
                        return;
                    }
                    // set value ?
                    e.preventDefault();
                    e.stopPropagation();
                });
                if (!focused) iX.focus();
            });
        }
    }

    dialog.modified = function() {
        dialog.is_modified = true;
    }
    dialog.close = function() {
        if (dialog.parentNode) {
            dialog.parentNode.removeChild(dialog);
        }
    };

    var dialogCloseTimer = null;
    var prevent_timeout = 0;
    dialog.addEventListener("pointerleave", function(_event) {
        if (prevent_timeout > 0)
            return;
        if(options.closeOnLeave || LiteGraph.dialog_close_on_mouse_leave)
            if (!dialog.is_modified && LiteGraph.dialog_close_on_mouse_leave)
                dialogCloseTimer = setTimeout(dialog.close, LiteGraph.dialog_close_on_mouse_leave_delay); // dialog.close();
    });
    dialog.addEventListener("pointerenter", function(_event) {
        if(options.closeOnLeave || LiteGraph.dialog_close_on_mouse_leave)
            if(dialogCloseTimer) clearTimeout(dialogCloseTimer);
    });
    var selInDia = dialog.querySelectorAll("select");
    if (selInDia) {
        // if filtering, check focus changed to comboboxes and prevent closing
        selInDia.forEach(function(selIn) {
            selIn.addEventListener("pointerdown", function(_event) {
                prevent_timeout++;
            });
            selIn.addEventListener("focus", function(_event) {
                prevent_timeout++;
            });
            selIn.addEventListener("blur", function(_event) {
                prevent_timeout = Math.max(0, prevent_timeout - 1);
            });
            selIn.addEventListener("change", function(_event) {
                prevent_timeout = 0;
            });
        });
    }

    return dialog;
}

export function createPanel(title, options) {
    options = options || {};

    var ref_window = options.window || window;
    var root = document.createElement("div");
    root.className = "litegraph dialog";
    root.innerHTML = "<div class='dialog-header'><span class='dialog-title'></span></div><div class='dialog-content'></div><div style='display:none;' class='dialog-alt-content'></div><div class='dialog-footer'></div>";
    root.header = root.querySelector(".dialog-header");

    if(options.width)
        root.style.width = options.width + (options.width.constructor === Number ? "px" : "");
    if(options.height)
        root.style.height = options.height + (options.height.constructor === Number ? "px" : "");
    if(options.closable) {
        var close = document.createElement("span");
        close.innerHTML = "&#10005;";
        close.classList.add("close");
        close.addEventListener("click",function() {
            root.close();
        });
        root.header.appendChild(close);
    }
    root.title_element = root.querySelector(".dialog-title");
    root.title_element.innerText = title;
    root.content = root.querySelector(".dialog-content");
    root.alt_content = root.querySelector(".dialog-alt-content");
    root.footer = root.querySelector(".dialog-footer");

    root.close = function() {
        if (root.onClose && typeof root.onClose == "function") {
            root.onClose();
        }
        if (root.parentNode) {
            root.parentNode.removeChild(root);
        }
    }

    // function to swap panel content
    root.toggleAltContent = function(force) {
        let vTo, vAlt;
        if (typeof force != "undefined") {
            vTo = force ? "block" : "none";
            vAlt = force ? "none" : "block";
        }else{
            vTo = root.alt_content.style.display != "block" ? "block" : "none";
            vAlt = root.alt_content.style.display != "block" ? "none" : "block";
        }
        root.alt_content.style.display = vTo;
        root.content.style.display = vAlt;
    }

    root.toggleFooterVisibility = function(force) {
        let vTo;
        if (typeof force != "undefined") {
            vTo = force ? "block" : "none";
        }else{
            vTo = root.footer.style.display != "block" ? "block" : "none";
        }
        root.footer.style.display = vTo;
    }

    root.clear = function() {
        this.content.innerHTML = "";
    }

    root.addHTML = function(code, classname, on_footer) {
        var elem = document.createElement("div");
        if(classname)
            elem.className = classname;
        elem.innerHTML = code;
        if(on_footer)
            root.footer.appendChild(elem);
        else
            root.content.appendChild(elem);
        return elem;
    }

    root.addButton = function( name, callback, options ) {
        var elem = document.createElement("button");
        elem.innerText = name;
        elem.options = options;
        elem.classList.add("btn");
        elem.addEventListener("click",callback);
        root.footer.appendChild(elem);
        return elem;
    }

    root.addSeparator = function() {
        var elem = document.createElement("div");
        elem.className = "separator";
        root.content.appendChild(elem);
    }

    root.addWidget = function( type, name, value, options, callback ) {
        options = options || {};
        var str_value = String(value);
        type = type.toLowerCase();
        if(type == "number")
            str_value = value.toFixed(3);

        var elem = document.createElement("div");
        elem.className = "property";
        elem.innerHTML = "<span class='property_name'></span><span class='property_value'></span>";
        elem.querySelector(".property_name").innerText = options.label || name;
        var value_element = elem.querySelector(".property_value");
        value_element.innerText = str_value;
        elem.dataset["property"] = name;
        elem.dataset["type"] = options.type || type;
        elem.options = options;
        elem.value = value;

        LiteGraph.debug?.("addWidget",type,value,value_element,options);

        if(type == "code") {
            elem.addEventListener("click", function(_event) {
                root.inner_showCodePad( this.dataset["property"] );
            });
        } else if (type == "boolean") {
            elem.classList.add("boolean");
            if(value)
                elem.classList.add("bool-on");
            elem.addEventListener("click", function() {
                // var v = node.properties[this.dataset["property"]];
                // node.setProperty(this.dataset["property"],!v); this.innerText = v ? "true" : "false";
                var propname = this.dataset["property"];
                this.value = !this.value;
                this.classList.toggle("bool-on");
                this.querySelector(".property_value").innerText = this.value ? "true" : "false";
                innerChange(propname, this.value );
            });
        } else if (type == "string" || type == "number") {
            value_element.setAttribute("contenteditable",true);
            value_element.addEventListener("keydown", function(e) {
                if(e.code == "Enter" && (type != "string" || !e.shiftKey)) { // allow for multiline
                    e.preventDefault();
                    this.blur();
                }
            });
            value_element.addEventListener("blur", function() {
                var v = this.innerText;
                var propname = this.parentNode.dataset["property"];
                var proptype = this.parentNode.dataset["type"];
                if( proptype == "number")
                    v = Number(v);
                innerChange(propname, v);
            });
        } else if (type == "enum" || type == "combo") {
            str_value = LGraphCanvas.getPropertyPrintableValue( value, options.values );
            value_element.innerText = str_value;

            LiteGraph.debug?.("addWidget ENUM COMBO",type,str_value,value_element,options);

            value_element.addEventListener("click", function(event) {
                var values = options.values || [];
                var propname = this.parentNode.dataset["property"];
                var elem_that = this;
                new LiteGraph.ContextMenu(
                    values,{
                        event: event,
                        className: "dark",
                        callback: inner_clicked,
                    },
                    ref_window,
                );
                function inner_clicked(v) {
                    // node.setProperty(propname,v);
                    // graphcanvas.dirty_canvas = true;
                    elem_that.innerText = v;
                    innerChange(propname,v);
                    return false;
                }
            });
        }

        root.content.appendChild(elem);

        function innerChange(name, value) {
            LiteGraph.debug?.("widgetInnerChange",name,value,options);
            // that.dirty_canvas = true;
            if(options.callback)
                options.callback(name,value,options);
            if(callback)
                callback(name,value,options);
        }

        return elem;
    }

    if (root.onOpen && typeof root.onOpen == "function") root.onOpen();

    return root;
}

export function closePanels() {
    var panel = document.querySelector("#node-panel");
    if(panel)
        panel.close();
    panel = document.querySelector("#option-panel");
    if(panel)
        panel.close();
}

export function showShowGraphOptionsPanel(refOpts, obEv) {
    let graphcanvas;
    if(this.constructor && this.constructor.name == "HTMLDivElement") {
        // assume coming from the menu event click
        if (! obEv?.event?.target?.lgraphcanvas) {
            LiteGraph.warn?.("References not found to add optionPanel",refOpts, obEv); // need a ref to canvas obj
            if (LiteGraph.debug)
                LiteGraph.debug?.("!obEv || !obEv.event || !obEv.event.target || !obEv.event.target.lgraphcanvas",obEv,obEv.event,obEv.event.target,obEv.event.target.lgraphcanvas);
            return;
        }
        graphcanvas = obEv.event.target.lgraphcanvas;
    }else{
        // assume called internally
        graphcanvas = this;
    }
    graphcanvas.closePanels();
    var ref_window = graphcanvas.getCanvasWindow();
    panel = graphcanvas.createPanel("Options",{
        closable: true,
        window: ref_window,
        onOpen: function() {
            graphcanvas.OPTIONPANEL_IS_OPEN = true;
        },
        onClose: function() {
            graphcanvas.OPTIONPANEL_IS_OPEN = false;
            graphcanvas.options_panel = null;
        },
    });
    graphcanvas.options_panel = panel;
    panel.id = "option-panel";
    panel.classList.add("settings");

    function inner_refresh() {

        panel.content.innerHTML = ""; // clear

        const fUpdate = (name, value, options) => {
            switch(name) {
                /* case "Render mode":
                    // Case ""..
                    if (options.values && options.key){
                        var kV = Object.values(options.values).indexOf(value);
                        if (kV>=0 && options.values[kV]){
                            LiteGraph.debug?.("update graph options: "+options.key+": "+kV);
                            graphcanvas[options.key] = kV;
                            //LiteGraph.debug?.(graphcanvas);
                            break;
                        }
                    }
                    LiteGraph.warn?.("unexpected options");
                    LiteGraph.debug?.(options);
                    break;*/
                default:
                    // LiteGraph.debug?.("want to update graph options: "+name+": "+value);
                    if (options && options.key) {
                        name = options.key;
                    }
                    if (options.values) {
                        value = Object.values(options.values).indexOf(value);
                    }
                    // LiteGraph.debug?.("update graph option: "+name+": "+value);
                    graphcanvas[name] = value;
                    break;
            }
        };

        // panel.addWidget( "string", "Graph name", "", {}, fUpdate); // implement

        var aProps = LiteGraph.availableCanvasOptions;
        aProps.sort();
        for(var pI in aProps) {
            var pX = aProps[pI];
            panel.addWidget( "boolean", pX, graphcanvas[pX], {key: pX, on: "True", off: "False"}, fUpdate);
        }

        panel.addWidget( "combo", "Render mode", LiteGraph.LINK_RENDER_MODES[graphcanvas.links_render_mode], {key: "links_render_mode", values: LiteGraph.LINK_RENDER_MODES}, fUpdate);

        panel.addSeparator();

        panel.footer.innerHTML = ""; // clear

    }
    inner_refresh();

    graphcanvas.canvas.parentNode.appendChild( panel );
}

export function showShowNodePanel(node) {
    this.SELECTED_NODE = node;
    this.closePanels();
    var ref_window = this.getCanvasWindow();

    var graphcanvas = this;
    var panel = this.createPanel(node.title || "",{
        closable: true,
        window: ref_window,
        onOpen: function() {
            graphcanvas.NODEPANEL_IS_OPEN = true;
        },
        onClose: function() {
            graphcanvas.NODEPANEL_IS_OPEN = false;
            graphcanvas.node_panel = null;
        },
    });
    graphcanvas.node_panel = panel;
    panel.id = "node-panel";
    panel.node = node;
    panel.classList.add("settings");

    function inner_refresh() {
        panel.content.innerHTML = ""; // clear
        panel.addHTML("<span class='node_type'>"+node.type+"</span>"+
            "<span class='node_desc'>"+(node.constructor.desc || "")+"</span>"+
            "<span class='separator'></span>");

        panel.addHTML("<h3>Properties</h3>");

        const fUpdate = (name,value) => {
            graphcanvas.graph.beforeChange(node);
            switch(name) {
                case "Title":
                    node.title = value;
                    break;
                case "Mode":
                    var kV = Object.values(LiteGraph.NODE_MODES).indexOf(value);
                    if (kV>=0 && LiteGraph.NODE_MODES[kV]) {
                        node.changeMode(kV);
                    }else{
                        LiteGraph.warn?.("unexpected mode: "+value);
                    }
                    break;
                case "Color":
                    if (LGraphCanvas.node_colors[value]) {
                        node.color = LGraphCanvas.node_colors[value].color;
                        node.bgcolor = LGraphCanvas.node_colors[value].bgcolor;
                    }else{
                        LiteGraph.warn?.("unexpected color: "+value);
                    }
                    break;
                default:
                    node.setProperty(name,value);
                    break;
            }
            graphcanvas.graph.afterChange();
            graphcanvas.dirty_canvas = true;
        };

        panel.addWidget( "string", "Title", node.title, {}, fUpdate);

        panel.addWidget( "combo", "Mode", LiteGraph.NODE_MODES[node.mode], {values: LiteGraph.NODE_MODES}, fUpdate);

        var nodeCol = "";
        if (node.color !== undefined) {
            nodeCol = Object.keys(LGraphCanvas.node_colors).filter(function(nK) {
                return LGraphCanvas.node_colors[nK].color == node.color;
            });
        }

        panel.addWidget( "combo", "Color", nodeCol, {values: Object.keys(LGraphCanvas.node_colors)}, fUpdate);

        for(var pName in node.properties) {
            var value = node.properties[pName];
            var info = node.getPropertyInfo(pName);
            // in case the user wants control over the side panel widget
            if( node.onAddPropertyToPanel && node.onAddPropertyToPanel(pName, panel, value, info, fUpdate) ) {
                continue;
            }
            panel.addWidget( info.widget || info.type, pName, value, info, fUpdate);
        }

        panel.addSeparator();

        if(node.onShowCustomPanelInfo)
            node.onShowCustomPanelInfo(panel);

        panel.footer.innerHTML = ""; // clear
        panel.addButton("Delete",function() {
            if(node.block_delete)
                return;
            node.graph.remove(node);
            panel.close();
        }).classList.add("delete");
    }

    panel.inner_showCodePad = function( propname ) {
        panel.classList.remove("settings");
        panel.classList.add("centered");


        /* if(window.CodeFlask) //disabled for now
        {
            panel.content.innerHTML = "<div class='code'></div>";
            var flask = new CodeFlask( "div.code", { language: 'js' });
            flask.updateCode(node.properties[propname]);
            flask.onUpdate( function(code) {
                node.setProperty(propname, code);
            });
        }
        else
        {*/
        panel.alt_content.innerHTML = "<textarea class='code'></textarea>";
        var textarea = panel.alt_content.querySelector("textarea");
        var fDoneWith = () => {
            panel.toggleAltContent(false); // if(node_prop_div) node_prop_div.style.display = "block"; // panel.close();
            panel.toggleFooterVisibility(true);
            textarea.parentNode.removeChild(textarea);
            panel.classList.add("settings");
            panel.classList.remove("centered");
            inner_refresh();
        }
        textarea.value = node.properties[propname];
        textarea.addEventListener("keydown", function(e) {
            if(e.code == "Enter" && e.ctrlKey ) {
                node.setProperty(propname, textarea.value);
                fDoneWith();
            }
        });
        panel.toggleAltContent(true);
        panel.toggleFooterVisibility(false);
        textarea.style.height = "calc(100% - 40px)";
        /* }*/
        var assign = panel.addButton( "Assign", function() {
            node.setProperty(propname, textarea.value);
            fDoneWith();
        });
        panel.alt_content.appendChild(assign); // panel.content.appendChild(assign);
        var button = panel.addButton( "Close", fDoneWith);
        button.style.float = "right";
        panel.alt_content.appendChild(button); // panel.content.appendChild(button);
    }

    inner_refresh();

    this.canvas.parentNode.appendChild( panel );
}

export function showSubgraphPropertiesDialog(node) {
    LiteGraph.log?.("showing subgraph properties dialog");

    var old_panel = this.canvas.parentNode.querySelector(".subgraph_dialog");
    if(old_panel)
        old_panel.close();

    var panel = this.createPanel("Subgraph Inputs",{closable: true, width: 500});
    panel.node = node;
    panel.classList.add("subgraph_dialog");

    function inner_refresh() {
        panel.clear();

        // show currents
        if(node.inputs)
            for(let i = 0; i < node.inputs.length; ++i) {
                var input = node.inputs[i];
                if(input.not_subgraph_input)
                    continue;
                var html = "<button>&#10005;</button> <span class='bullet_icon'></span><span class='name'></span><span class='type'></span>";
                var elem = panel.addHTML(html,"subgraph_property");
                elem.dataset["name"] = input.name;
                elem.dataset["slot"] = i;
                elem.querySelector(".name").innerText = input.name;
                elem.querySelector(".type").innerText = input.type;
                elem.querySelector("button").addEventListener("click",function(_event) {
                    node.removeInput( Number( this.parentNode.dataset["slot"] ) );
                    inner_refresh();
                });
            }
    }

    // add extra
    var html = " + <span class='label'>Name</span><input class='name'/><span class='label'>Type</span><input class='type'></input><button>+</button>";
    var elem = panel.addHTML(html,"subgraph_property extra", true);
    elem.querySelector("button").addEventListener("click", function(_event) {
        var elem = this.parentNode;
        var name = elem.querySelector(".name").value;
        var type = elem.querySelector(".type").value;
        if(!name || node.findInputSlot(name) != -1)
            return;
        node.addInput(name,type);
        elem.querySelector(".name").value = "";
        elem.querySelector(".type").value = "";
        inner_refresh();
    });

    inner_refresh();
    this.canvas.parentNode.appendChild(panel);
    return panel;
}

export function showSubgraphPropertiesDialogRight(node) {

    // LiteGraph.log?.("showing subgraph properties dialog");

    // old_panel if old_panel is exist close it
    var old_panel = this.canvas.parentNode.querySelector(".subgraph_dialog");
    if (old_panel)
        old_panel.close();
    // new panel
    var panel = this.createPanel("Subgraph Outputs", { closable: true, width: 500 });
    panel.node = node;
    panel.classList.add("subgraph_dialog");

    function inner_refresh() {
        panel.clear();
        // show currents
        if (node.outputs)
            for (let i = 0; i < node.outputs.length; ++i) {
                var input = node.outputs[i];
                if (input.not_subgraph_output)
                    continue;
                var html = "<button>&#10005;</button> <span class='bullet_icon'></span><span class='name'></span><span class='type'></span>";
                var elem = panel.addHTML(html, "subgraph_property");
                elem.dataset["name"] = input.name;
                elem.dataset["slot"] = i;
                elem.querySelector(".name").innerText = input.name;
                elem.querySelector(".type").innerText = input.type;
                elem.querySelector("button").addEventListener("click", function (_event) {
                    node.removeOutput(Number(this.parentNode.dataset["slot"]));
                    inner_refresh();
                });
            }
    }

    // add extra
    var html = " + <span class='label'>Name</span><input class='name'/><span class='label'>Type</span><input class='type'></input><button>+</button>";
    var elem = panel.addHTML(html, "subgraph_property extra", true);
    elem.querySelector(".name").addEventListener("keydown", function (_event) {
        if (e.keyCode == 13) {
            addOutput.apply(this)
        }
    })
    elem.querySelector("button").addEventListener("click", function (_event) {
        addOutput.apply(this)
    });
    function addOutput() {
        var elem = this.parentNode;
        var name = elem.querySelector(".name").value;
        var type = elem.querySelector(".type").value;
        if (!name || node.findOutputSlot(name) != -1)
            return;
        node.addOutput(name, type);
        elem.querySelector(".name").value = "";
        elem.querySelector(".type").value = "";
        inner_refresh();
    }

    inner_refresh();
    this.canvas.parentNode.appendChild(panel);
    return panel;
}

export function checkPanels() {
    if(!this.canvas)
        return;
    var panels = this.canvas.parentNode.querySelectorAll(".litegraph.dialog");
    for(let i = 0; i < panels.length; ++i) {
        var panel = panels[i];
        if( !panel.node )
            continue;
        if( !panel.node.graph || panel.graph != this.graph )
            panel.close();
    }
}
