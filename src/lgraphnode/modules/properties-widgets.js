let LiteGraph = null;

export function setPropertiesWidgetsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const propertiesWidgetsMethods = {
setProperty(name, value) {
        this.properties ||= {};

        // Check if the new value is the same as the current value
        if (value === this.properties[name]) {
            return;
        }

        const prevValue = this.properties[name];
        this.properties[name] = value;

        // Call onPropertyChanged and revert the change if needed
        if (this.onPropertyChanged?.(name, value, prevValue) === false) {
            this.properties[name] = prevValue;
        }

        // Update the widget value associated with the property name
        const widgetToUpdate = this.widgets?.find((widget) => widget && widget.options?.property === name);

        if (widgetToUpdate) {
            widgetToUpdate.value = value;
        }
    },

addProperty(name, default_value, type, extra_info) {
        const o = { name, type, default_value, ...extra_info };
        this.properties_info = this.properties_info ?? [];
        this.properties_info.push(o);

        this.properties = this.properties ?? {};
        this.properties[name] = default_value;

        return o;
    },

getPropertyInfo(property) {
        var info = null;

        // there are several ways to define info about a property
        // legacy mode
        if (this.properties_info) {
            for (var i = 0; i < this.properties_info.length; ++i) {
                if (this.properties_info[i].name == property) {
                    info = this.properties_info[i];
                    break;
                }
            }
        }
        // litescene mode using the constructor
        if(this.constructor[`@${property}`])
            info = this.constructor[`@${property}`];

        if(this.constructor.widgets_info && this.constructor.widgets_info[property])
            info = this.constructor.widgets_info[property];

        // litescene mode using the constructor
        if (!info && this.onGetPropertyInfo) {
            info = this.onGetPropertyInfo(property);
        }

        if (!info)
            info = {};
        if(!info.type)
            info.type = typeof this.properties[property];
        if(info.widget == "combo")
            info.type = "enum";

        return info;
    },

addWidget(type, name, value, callback, options) {
        this.widgets ??= [];

        if(!options && callback && callback.constructor === Object) {
            options = callback;
            callback = null;
        }

        if(options && options.constructor === String) // options can be the property name
            options = { property: options };

        if(callback && callback.constructor === String) { // callback can be the property name
            options ??= {};
            options.property = callback;
            callback = null;
        }

        if(callback && callback.constructor !== Function) {
            LiteGraph.warn?.("addWidget: callback must be a function");
            callback = null;
        }

        var w = {
            type: type.toLowerCase(),
            name: name,
            value: value,
            callback: callback,
            options: options || {},
        };

        if (w.options.y !== undefined) {
            w.y = w.options.y;
        }

        if (!callback && !w.options.callback && !w.options.property) {
            LiteGraph.warn?.("LiteGraph addWidget(...) without a callback or property assigned");
        }
        if (type == "combo" && !w.options.values) {
            throw Error("LiteGraph addWidget('combo',...) requires to pass values in options: { values:['red','blue'] }");
        }
        this.widgets.push(w);
        this.setSize( this.computeSize() );
        return w;
    },

addCustomWidget(custom_widget) {
        this.widgets ??= [];
        this.widgets.push(custom_widget);
        return custom_widget;
    },
};
