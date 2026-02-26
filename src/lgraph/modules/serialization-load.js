let LiteGraph = null;

export function setSerializationLoadMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const serializationLoadMethods = {
serialize() {
        const nodesInfo = this._nodes.map((node) => node.serialize());

        // pack link info into a non-verbose format
        var links = [];
        for (var i in this.links) {
            // links is an OBJECT
            var link = this.links[i];
            if (!link.serialize) {
                // weird bug I havent solved yet
                LiteGraph.warn?.("weird LLink bug, link info is not a LLink but a regular object");
                var link2 = new LiteGraph.LLink();
                for (var j in link) {
                    link2[j] = link[j];
                }
                this.links[i] = link2;
                link = link2;
            }

            links.push(link.serialize());
        }

        const groupsInfo = this._groups.map((group) => group.serialize());

        var data = {
            last_node_id: this.last_node_id,
            last_link_id: this.last_link_id,
            nodes: nodesInfo,
            links: links,
            groups: groupsInfo,
            config: this.config,
            extra: this.extra,
            version: LiteGraph.VERSION,
        };
        this.onSerialize?.(data);
        return data;
    },

configure(data, keep_old) {
        if (!data) {
            return;
        }

        if (!keep_old) {
            this.clear();
        }

        var nodes = data.nodes;

        // decode links info (they are very verbose)
        if (data.links && data.links.constructor === Array) {
            var links = [];
            for (var i = 0; i < data.links.length; ++i) {
                var link_data = data.links[i];
                if (!link_data) {
                    LiteGraph.warn?.("serialized graph link data contains errors, skipping.");
                    continue;
                }
                var link = new LiteGraph.LLink();
                link.configure(link_data);
                links[link.id] = link;
            }
            data.links = links;
        }

        // copy all stored fields
        for (let i in data) {
            if (["nodes", "groups"].includes(i)) continue; // Accepts "nodes" and "groups"
            this[i] = data[i];
        }

        var error = false;
        this._configuring = true;
        try {
            // create nodes
            this._nodes = [];
            if (nodes) {
                for (let i = 0, l = nodes.length; i < l; ++i) {
                    var n_info = nodes[i]; // stored info
                    var node = LiteGraph.createNode(n_info.type, n_info.title);
                    if (!node) {
                        LiteGraph.log?.(`Node not found or has errors: ${n_info.type}`);

                        // in case of error we create a replacement node to avoid losing info
                        node = new LiteGraph.LGraphNode();
                        node.last_serialization = n_info;
                        node.has_errors = true;
                        error = true;
                    }

                    node.id = n_info.id; // id it or it will create a new id
                    this.add(node, true, {doProcessChange: false}); // add before configure, otherwise configure cannot create links
                }

                // configure nodes afterwards so they can reach each other
                nodes.forEach((n_info) => {
                    const node = this.getNodeById(n_info.id);
                    node?.configure(n_info);
                });
            }

            // groups
            this._groups.length = 0;
            if (data.groups) {
                data.groups.forEach((groupData) => {
                    const group = new LiteGraph.LGraphGroup();
                    group.configure(groupData);
                    this.add(group, true, {doProcessChange: false});
                });
            }
        } finally {
            this._configuring = false;
        }

        this.updateExecutionOrder();
        this.extra = data.extra ?? {};
        this.onConfigure?.(data);

        if (!data._version) {
            this.onGraphChanged({action: "graphConfigure", doSave: false});
        } else {
            LiteGraph.debug?.("skip onGraphChanged when configure passing version too!");
        }
        this.setDirtyCanvas(true, true);
        return error;
    },

load(url, callback) {
        var that = this;

        // from file
        if(url.constructor === File || url.constructor === Blob) {
            var reader = new FileReader();
            reader.addEventListener('load', (event) => {
                var data = JSON.parse(event.target.result);
                that.configure(data);
                callback?.();
            });
            reader.readAsText(url);
            return;
        }

        // is a string, then an URL
        var req = new XMLHttpRequest();
        req.open("GET", url, true);
        req.send(null);
        req.onload = (_event) => {
            if (req.status !== 200) {
                LiteGraph.error?.("Error loading graph:", req.status, req.response);
                return;
            }
            var data = JSON.parse( req.response );
            that.configure(data);
            callback?.();
        };
        req.onerror = (err) => {
            LiteGraph.error?.("Error loading graph:", err);
        };
    },
};
