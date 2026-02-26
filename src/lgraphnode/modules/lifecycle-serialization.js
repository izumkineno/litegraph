let LiteGraph = null;

export function setLifecycleSerializationMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const lifecycleSerializationMethods = {
configure(info) {
        /*
        if(this.graph)
            this.graph.onGraphChanged({action: "nodeConfigure", doSave: false});
        */

        Object.entries(info).forEach(([key, value]) => {
            if (key === "properties") {
                for (var k in value) {
                    this.properties[k] = value[k];
                    this.onPropertyChanged?.(k, value[k]);
                }
                return;
            }

            if (value === null) {
                return;
            } else if (typeof value === "object") {
                if (this[key] && this[key].configure) {
                    this[key].configure(value);
                } else {
                    this[key] = LiteGraph.cloneObject(value, this[key]);
                }
            } else {
                this[key] = value;
            }
        });

        if (!info.title) {
            this.title = this.constructor.title;
        }

        this.inputs?.forEach((input, i) => {
            if(!input.link)
                return;
            const link_info = this.graph ? this.graph.links[input.link] : null;
            this.onConnectionsChange?.(LiteGraph.INPUT, i, true, link_info, input);
            this.onInputAdded?.(input);
        });

        this.outputs?.forEach((output, i) => {
            if (!output.links)
                return;
            output.links.forEach(() => {
                const link_info = this.graph; // ?.links[link] || null; // as per Atlasan
                this.onConnectionsChange?.(LiteGraph.OUTPUT, i, true, link_info, output);
            });
            this.onOutputAdded?.(output);
        });

        if (this.widgets) {
            this.widgets.forEach((w) => {
                if (!w) {
                    return;
                }
                if (w.options && w.options.property && this.properties[w.options.property] !== undefined) {
                    w.value = JSON.parse(JSON.stringify(this.properties[w.options.property]));
                }
            });

            info.widgets_values?.forEach((value, i) => {
                if (this.widgets[i]) {
                    this.widgets[i].value = value;
                }
            });
        }
        this.onConfigure?.(info);
        this.graph?.onGraphChanged({action: "nodeConfigure", doSave: false});
    },

serialize() {
        // create serialization object
        var o = {
            id: this.id,
            type: this.type,
            pos: this.pos,
            size: this.size,
            flags: LiteGraph.cloneObject(this.flags),
            order: this.order,
            mode: this.mode,
        };

        // special case for when there were errors
        if (this.constructor === LiteGraph.LGraphNode && this.last_serialization) {
            return this.last_serialization;
        }

        if (this.inputs) {
            o.inputs = LiteGraph.cloneObject(this.inputs);
        }

        if (this.outputs) {
            // clear outputs last data (because data in connections is never serialized but stored inside the outputs info)
            this.outputs.forEach((output) => {
                delete output._data;
            });
            o.outputs = LiteGraph.cloneObject(this.outputs);
        }

        if (this.title && this.title != this.constructor.title) {
            o.title = this.title;
        }

        if (this.properties) {
            o.properties = LiteGraph.cloneObject(this.properties);
        }

        if (this.widgets && this.serialize_widgets) {
            o.widgets_values = this.widgets.map((widget) => widget?.value ?? null);
        }

        o.type ??= this.constructor.type;

        if (this.color) {
            o.color = this.color;
        }
        if (this.bgcolor) {
            o.bgcolor = this.bgcolor;
        }
        if (this.boxcolor) {
            o.boxcolor = this.boxcolor;
        }
        if (this.shape) {
            o.shape = this.shape;
        }

        if (this.onSerialize?.(o)) {
            LiteGraph.warn?.("node onSerialize shouldnt return anything, data should be stored in the object pass in the first parameter");
        }
        return o;
    },

clone() {
        var node = LiteGraph.createNode(this.type);
        if (!node) {
            return null;
        }

        // we clone it because serialize returns shared containers
        var data = LiteGraph.cloneObject(this.serialize());

        // remove links
        data.inputs?.forEach((input) => {
            input.link = null;
        });

        data.outputs?.forEach((output) => {
            if(output.links)
                output.links.length = 0;
        });

        delete data["id"];

        if (LiteGraph.use_uuids) {
            data["id"] = LiteGraph.uuidv4()
        }

        // remove links
        node.configure(data);
        return node;
    },

toString() {
        return JSON.stringify(this.serialize());
    },

getTitle() {
        return this.title ?? this.constructor.title;
    },
};
