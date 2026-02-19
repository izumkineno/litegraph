var he = Object.defineProperty;
var te = (s) => {
  throw TypeError(s);
};
var ue = (s, t, r) => t in s ? he(s, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : s[t] = r;
var M = (s, t, r) => ue(s, typeof t != "symbol" ? t + "" : t, r), pe = (s, t, r) => t.has(s) || te("Cannot " + r);
var ie = (s, t, r) => t.has(s) ? te("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(s) : t.set(s, r);
var J = (s, t, r) => (pe(s, t, "access private method"), r);
class LLink {
  /**
   * Create a link object.
   * @param {string} id - The unique identifier of the link.
   * @param {string} type - The type of the link.
   * @param {string} origin_id - The identifier of the origin node.
   * @param {string} origin_slot - The slot of the origin node the link is connected to.
   * @param {string} target_id - The identifier of the target node.
   * @param {string} target_slot - The slot of the target node the link is connected to.
   */
  constructor(t, r, n, a, o, h) {
    this.id = t, this.type = r, this.origin_id = n, this.origin_slot = a, this.target_id = o, this.target_slot = h, this._data = null, this._pos = new Float32Array(2);
  }
  /**
   * Configure the link object with new data.
   * @param {Array|Object} o - An array or object containing link data to configure.
   */
  configure(t) {
    t.constructor === Array ? (this.id = t[0], this.origin_id = t[1], this.origin_slot = t[2], this.target_id = t[3], this.target_slot = t[4], this.type = t[5]) : (this.id = t.id, this.type = t.type, this.origin_id = t.origin_id, this.origin_slot = t.origin_slot, this.target_id = t.target_id, this.target_slot = t.target_slot);
  }
  /**
   * Serialize the link object to an array.
   * @returns {Array} An array containing the serialized link data.
   */
  serialize() {
    return [
      this.id,
      this.origin_id,
      this.origin_slot,
      this.target_id,
      this.target_slot,
      this.type
    ];
  }
}
const V = class V {
  /**
   * @constructor
   * @param {Object} o data from previous serialization [optional]} o
   */
  constructor(t) {
    var r;
    (r = LiteGraph.log) == null || r.call(LiteGraph, "Graph created"), this.list_of_graphcanvas = null, this.clear(), t && this.configure(t);
  }
  /**
   * Gets the supported types of the LGraph class, falling back to the default supported types if not defined for the instance.
   * @returns {Array} An array of supported types for the LGraph class.
   */
  getSupportedTypes() {
    var t;
    return (t = this.supported_types) != null ? t : V.supported_types;
  }
  /**
   * Removes all nodes from this graph
   * @method clear
   */
  clear() {
    var t;
    this.stop(), this.status = V.STATUS_STOPPED, this.last_node_id = 0, this.last_link_id = 0, this._version = -1, (t = this._nodes) == null || t.forEach((r) => {
      var n;
      (n = r.onRemoved) == null || n.call(r);
    }), this._nodes = [], this._nodes_by_id = {}, this._nodes_in_order = [], this._nodes_executable = null, this._groups = [], this.links = {}, this.iteration = 0, this.config = {}, this.configApplyDefaults(), this.vars = {}, this.extra = {}, this.globaltime = 0, this.runningtime = 0, this.fixedtime = 0, this.fixedtime_lapse = 0.01, this.elapsed_time = 0.01, this.last_update_time = 0, this.starttime = 0, this.catch_errors = !0, this.history = {
      actionHistory: [],
      actionHistoryVersions: [],
      actionHistoryPtr: 0
    }, this.nodes_executing = [], this.nodes_actioning = [], this.node_ancestorsCalculated = [], this.nodes_executedAction = [], this.inputs = {}, this.outputs = {}, this.change(), this.sendActionToCanvas("clear");
  }
  /**
  * Apply config values to LGraph config object
  * @method configApply
   * @param {object} opts options to merge
  */
  configApply(t) {
    this.config = Object.assign(this.config, t);
  }
  /**
  * Apply config values to LGraph config object
  * @method configApply
   * @param {object} opts options to merge
  */
  configApplyDefaults() {
    var t = LiteGraph.graphDefaultConfig;
    this.configApply(t);
  }
  /**
   * Attach Canvas to this graph
   * @method attachCanvas
   * @param {GraphCanvas} graph_canvas
   */
  attachCanvas(t) {
    var r;
    if (!t instanceof LiteGraph.LGraphCanvas)
      throw new Error("attachCanvas expects a LiteGraph.LGraphCanvas instance");
    t.graph && t.graph != this && t.graph.detachCanvas(t), t.graph = this, (r = this.list_of_graphcanvas) != null || (this.list_of_graphcanvas = []), this.list_of_graphcanvas.push(t);
  }
  /**
   * Detach Canvas from this graph
   * @method detachCanvas
   * @param {GraphCanvas} graph_canvas
   */
  detachCanvas(t) {
    if (this.list_of_graphcanvas) {
      var r = this.list_of_graphcanvas.indexOf(t);
      r != -1 && (t.graph = null, this.list_of_graphcanvas.splice(r, 1));
    }
  }
  /**
   * Starts running this graph every interval milliseconds.
   * @method start
   * @param {number} interval amount of milliseconds between executions, if 0 then it renders to the monitor refresh rate
   */
  start(t = 0) {
    var n;
    if (this.status === V.STATUS_RUNNING)
      return;
    this.status = V.STATUS_RUNNING, (n = this.onPlayEvent) == null || n.call(this), this.sendEventToAllNodes("onStart"), this.starttime = LiteGraph.getTime(), this.last_update_time = this.starttime;
    const r = () => {
      var a, o;
      this.execution_timer_id === -1 && (window.requestAnimationFrame(r), (a = this.onBeforeStep) == null || a.call(this), this.runStep(1, !this.catch_errors), (o = this.onAfterStep) == null || o.call(this));
    };
    t === 0 && typeof window == "object" && window.requestAnimationFrame ? (this.execution_timer_id = -1, r()) : this.execution_timer_id = setInterval(() => {
      var a, o;
      (a = this.onBeforeStep) == null || a.call(this), this.runStep(1, !this.catch_errors), (o = this.onAfterStep) == null || o.call(this);
    }, t);
  }
  /**
   * Stops the execution loop of the graph
   * @method stop execution
   */
  stop() {
    var t;
    this.status != V.STATUS_STOPPED && (this.status = V.STATUS_STOPPED, (t = this.onStopEvent) == null || t.call(this), this.execution_timer_id != null && (this.execution_timer_id != -1 && clearInterval(this.execution_timer_id), this.execution_timer_id = null), this.sendEventToAllNodes("onStop"));
  }
  /**
   * Run N steps (cycles) of the graph
   * @method runStep
   * @param {number} num number of steps to run, default is 1
   * @param {Boolean} do_not_catch_errors [optional] if you want to try/catch errors
   * @param {number} limit max number of nodes to execute (used to execute from start to a node)
   */
  runStep(t = 1, r, n) {
    var u, p, c, d, f, _;
    var a = LiteGraph.getTime();
    this.globaltime = 1e-3 * (a - this.starttime);
    var o = (u = this._nodes_executable) != null ? u : this._nodes;
    if (o) {
      if (n || (n = o.length), r) {
        for (let g = 0; g < t; g++)
          o.forEach((L) => {
            var b, m;
            LiteGraph.use_deferred_actions && ((b = L._waiting_actions) != null && b.length) && L.executePendingActions(), L.mode === LiteGraph.ALWAYS && ((m = L.doExecute) == null || m.call(L));
          }), this.fixedtime += this.fixedtime_lapse, (p = this.onExecuteStep) == null || p.call(this);
        (c = this.onAfterExecute) == null || c.call(this);
      } else
        try {
          for (let g = 0; g < t; g++)
            o.forEach((L) => {
              var b, m;
              LiteGraph.use_deferred_actions && ((b = L._waiting_actions) != null && b.length) && L.executePendingActions(), L.mode === LiteGraph.ALWAYS && ((m = L.doExecute) == null || m.call(L));
            }), this.fixedtime += this.fixedtime_lapse, (d = this.onExecuteStep) == null || d.call(this);
          (f = this.onAfterExecute) == null || f.call(this), this.errors_in_execution = !1;
        } catch (g) {
          if (this.errors_in_execution = !0, LiteGraph.throw_errors)
            throw g;
          (_ = LiteGraph.log) == null || _.call(LiteGraph, `Error during execution: ${g}`), this.stop();
        }
      var h = LiteGraph.getTime(), l = h - a;
      l == 0 && (l = 1), this.execution_time = 1e-3 * l, this.globaltime += 1e-3 * l, this.iteration += 1, this.elapsed_time = (h - this.last_update_time) * 1e-3, this.last_update_time = h, this.nodes_executing = [], this.nodes_actioning = [], this.node_ancestorsCalculated = [], this.nodes_executedAction = [];
    }
  }
  /**
   * Updates the graph execution order according to relevance of the nodes (nodes with only outputs have more relevance than
   * nodes with only inputs.
   * @method updateExecutionOrder
   */
  updateExecutionOrder() {
    this._nodes_in_order = this.computeExecutionOrder(!1), this._nodes_executable = [];
    for (var t = 0; t < this._nodes_in_order.length; ++t)
      this._nodes_in_order[t].onExecute && this._nodes_executable.push(this._nodes_in_order[t]);
  }
  /**
   * Computes the execution order of nodes in the flow graph based on their connections and levels.
   * @param {boolean} only_onExecute - Indicates whether to consider only nodes with an onExecute method.
   * @param {boolean} set_level - If true, assigns levels to the nodes based on their connections.
   * @returns {Array} An array of nodes in the calculated execution order.
   *
   * @TODO:This whole concept is a mistake.  Should call graph back from output nodes
   */
  computeExecutionOrder(t, r) {
    var _;
    var n = [], a = [], o = {}, h = {}, l = {};
    for (let g = 0, L = this._nodes.length; g < L; ++g) {
      let b = this._nodes[g];
      if (!(t && !b.onExecute)) {
        o[b.id] = b;
        var u = 0;
        if (b.inputs)
          for (var p = 0, c = b.inputs.length; p < c; p++)
            b.inputs[p] && b.inputs[p].link != null && (u += 1);
        u == 0 ? (a.push(b), r && (b._level = 1)) : (r && (b._level = 0), l[b.id] = u);
      }
    }
    for (; a.length != 0; ) {
      var d = a.shift();
      if (n.push(d), delete o[d.id], !!d.outputs)
        for (let g = 0; g < d.outputs.length; g++) {
          let L = d.outputs[g];
          if (!(L == null || L.links == null || L.links.length == 0))
            for (let b = 0; b < L.links.length; b++) {
              let m = L.links[b], T = this.links[m];
              if (!T || h[T.id])
                continue;
              let E = this.getNodeById(T.target_id);
              if (E == null) {
                h[T.id] = !0;
                continue;
              }
              r && (!E._level || E._level <= d._level) && (E._level = d._level + 1), h[T.id] = !0, l[E.id] -= 1, l[E.id] == 0 && a.push(E);
            }
        }
    }
    for (let g in o)
      n.push(o[g]);
    n.length != this._nodes.length && LiteGraph.debug && ((_ = LiteGraph.warn) == null || _.call(LiteGraph, "something went wrong, nodes missing"));
    var f = n.length;
    for (let g = 0; g < f; ++g)
      n[g].order = g;
    n = n.sort((g, L) => {
      let b = g.constructor.priority || g.priority || 0, m = L.constructor.priority || L.priority || 0;
      return b == m ? g.order - L.order : b - m;
    });
    for (let g = 0; g < f; ++g)
      n[g].order = g;
    return n;
  }
  /**
   * Returns all the nodes that could affect this one (ancestors) by crawling all the inputs recursively.
   * It doesn't include the node itself
   * @method getAncestors
   * @return {Array} an array with all the LiteGraph.LGraphNodes that affect this node, in order of execution
   */
  getAncestors(t, r = {}) {
    for (var n = {
      modesSkip: [],
      modesOnly: [],
      typesSkip: [],
      typesOnly: []
    }, a = Object.assign(n, r), o = [], h = [], l = [t], u = {}; l.length; ) {
      var p = l.shift();
      if (p && !u[p.id]) {
        if (u[p.id] = !0, p.id != t.id) {
          if (a.modesSkip && a.modesSkip.length && a.modesSkip.indexOf(p.mode) != -1 || a.modesOnly && a.modesOnly.length && a.modesOnly.indexOf(p.mode) == -1)
            continue;
          h.indexOf(p.id) == -1 && (o.push(p), h.push(p.id));
        }
        if (p.inputs)
          for (var c = 0; c < p.inputs.length; ++c) {
            var d = p.getInputNode(c);
            if (d) {
              var f = p.inputs[c].type;
              a.typesSkip && a.typesSkip.length && a.typesSkip.indexOf(f) != -1 || a.typesOnly && a.typesOnly.length && a.typesOnly.indexOf(d.mode) == -1 || h.indexOf(d.id) == -1 && (u[d.id] || l.push(d));
            }
          }
      }
    }
    return o.sort((_, g) => _.order - g.order), o;
  }
  /**
   * Positions every node in a more readable manner
   * @method arrange
   */
  arrange(t = 100, r) {
    var h;
    const n = this.computeExecutionOrder(!1, !0), a = [];
    for (let l = 0; l < n.length; ++l) {
      const u = n[l], p = u._level || 1;
      (h = a[p]) != null || (a[p] = []), a[p].push(u);
    }
    let o = t;
    for (let l = 0; l < a.length; ++l) {
      const u = a[l];
      if (!u)
        continue;
      let p = 100, c = t + LiteGraph.NODE_TITLE_HEIGHT;
      for (let d = 0; d < u.length; ++d) {
        const f = u[d];
        f.pos[0] = r == LiteGraph.VERTICAL_LAYOUT ? c : o, f.pos[1] = r == LiteGraph.VERTICAL_LAYOUT ? o : c;
        const _ = r == LiteGraph.VERTICAL_LAYOUT ? 1 : 0;
        f.size[_] > p && (p = f.size[_]);
        const g = r == LiteGraph.VERTICAL_LAYOUT ? 0 : 1;
        c += f.size[g] + t + LiteGraph.NODE_TITLE_HEIGHT;
      }
      o += p + t;
    }
    this.setDirtyCanvas(!0, !0);
  }
  /**
   * Returns the amount of time the graph has been running in milliseconds
   * @method getTime
   * @return {number} number of milliseconds the graph has been running
   */
  getTime() {
    return this.globaltime;
  }
  /**
   * Returns the amount of time accumulated using the fixedtime_lapse var. This is used in context where the time increments should be constant
   * @method getFixedTime
   * @return {number} number of milliseconds the graph has been running
   */
  getFixedTime() {
    return this.fixedtime;
  }
  /**
   * Returns the amount of time it took to compute the latest iteration. Take into account that this number could be not correct
   * if the nodes are using graphical actions
   * @method getElapsedTime
   * @return {number} number of milliseconds it took the last cycle
   */
  getElapsedTime() {
    return this.elapsed_time;
  }
  /**
   * Sends an event to all the nodes, useful to trigger stuff
   * @method sendEventToAllNodes
   * @param {String} eventname the name of the event (function to be called)
   * @param {Array} params parameters in array format
   */
  sendEventToAllNodes(t, r, n = LiteGraph.ALWAYS) {
    var a = this._nodes_in_order ? this._nodes_in_order : this._nodes;
    if (a)
      for (let o = 0, h = a.length; o < h; ++o) {
        const l = a[o];
        if (l.constructor === LiteGraph.Subgraph && t !== "onExecute") {
          l.mode == n && l.sendEventToAllNodes(t, r, n);
          continue;
        }
        !l[t] || l.mode !== n || (r === void 0 ? l[t]() : Array.isArray(r) ? l[t].apply(l, r) : l[t](r));
      }
  }
  /**
   * Sends an action with parameters to the connected GraphCanvas instances for processing.
   * @param {string} action - The action to be performed on the GraphCanvas instances.
   * @param {Array} params - An array of parameters to be passed to the action method.
   */
  sendActionToCanvas(t, r) {
    if (this.list_of_graphcanvas)
      for (const n of this.list_of_graphcanvas)
        n[t] && r && n[t](...r);
  }
  /**
   * Adds a new node instance to this graph
   * @method add
   * @param {LiteGraph.LGraphNode} node the instance of the node
   */
  add(t, r, n = {}) {
    var h, l, u;
    var a = {
      doProcessChange: !0,
      doCalcSize: !0
    }, o = Object.assign(a, n);
    if (t) {
      if (t.constructor === LiteGraph.LGraphGroup) {
        this._groups.push(t), this.setDirtyCanvas(!0), this.change(), t.graph = this, this.onGraphChanged({ action: "groupAdd", doSave: o.doProcessChange });
        return;
      }
      if (t.id != -1 && this._nodes_by_id[t.id] != null && ((h = LiteGraph.warn) == null || h.call(LiteGraph, "LiteGraph: there is already a node with this ID, changing it"), LiteGraph.use_uuids ? t.id = LiteGraph.uuidv4() : t.id = ++this.last_node_id), this._nodes.length >= LiteGraph.MAX_NUMBER_OF_NODES)
        throw new Error("LiteGraph: max number of nodes in a graph reached");
      return LiteGraph.use_uuids ? (t.id == null || t.id == -1) && (t.id = LiteGraph.uuidv4()) : t.id == null || t.id == -1 ? t.id = ++this.last_node_id : this.last_node_id < t.id && (this.last_node_id = t.id), t.graph = this, this.onGraphChanged({ action: "nodeAdd", doSave: o.doProcessChange }), this._nodes.push(t), this._nodes_by_id[t.id] = t, (l = t.onAdded) == null || l.call(t, this), this.config.align_to_grid && t.alignToGrid(), r || this.updateExecutionOrder(), (u = this.onNodeAdded) == null || u.call(this, t), o.doCalcSize && t.setSize(t.computeSize()), this.setDirtyCanvas(!0), this.change(), t;
    }
  }
  /**
   * Removes a node from the graph
   * @method remove
   * @param {LiteGraph.LGraphNode} node the instance of the node
   */
  remove(t) {
    var a, o;
    if (t.constructor === LiteGraph.LGraphGroup) {
      var r = this._groups.indexOf(t);
      r != -1 && this._groups.splice(r, 1), t.graph = null, this.onGraphChanged({ action: "groupRemove" }), this.setDirtyCanvas(!0, !0), this.change();
      return;
    }
    if (this._nodes_by_id[t.id] != null && !t.ignore_remove) {
      if (t.inputs)
        for (let h = 0; h < t.inputs.length; h++)
          t.inputs[h].link != null && t.disconnectInput(h, { doProcessChange: !1 });
      if (t.outputs)
        for (let h = 0; h < t.outputs.length; h++) {
          let l = t.outputs[h];
          l.links != null && l.links.length && t.disconnectOutput(h, !1, { doProcessChange: !1 });
        }
      if ((a = t.onRemoved) == null || a.call(t), t.graph = null, this.onGraphChanged({ action: "nodeRemove" }), this.list_of_graphcanvas)
        for (let h = 0; h < this.list_of_graphcanvas.length; ++h) {
          let l = this.list_of_graphcanvas[h];
          l.selected_nodes[t.id] && delete l.selected_nodes[t.id], l.node_dragged == t && (l.node_dragged = null);
        }
      var n = this._nodes.indexOf(t);
      n != -1 && this._nodes.splice(n, 1), delete this._nodes_by_id[t.id], (o = this.onNodeRemoved) == null || o.call(this, t), this.sendActionToCanvas("checkPanels"), this.setDirtyCanvas(!0, !0), this.change(), this.updateExecutionOrder();
    }
  }
  /**
   * Returns a node by its id.
   * @method getNodeById
   * @param {Number} id
   */
  getNodeById(t) {
    return t == null ? null : this._nodes_by_id[t];
  }
  /**
   * Returns a list of nodes that matches a class
   * @method findNodesByClass
   * @param {Class} classObject the class itself (not an string)
   * @return {Array} a list with all the nodes of this type
   */
  findNodesByClass(t, r = []) {
    return r = this._nodes.filter((n) => n.constructor === t), r;
  }
  /**
   * Returns a list of nodes that matches a type
   * @method findNodesByType
   * @param {String} type the name of the node type
   * @return {Array} a list with all the nodes of this type
   */
  findNodesByType(t, r = []) {
    const n = t.toLowerCase();
    return r = this._nodes.filter((a) => a.type.toLowerCase() === n), r;
  }
  /**
   * Returns the first node that matches a name in its title
   * @method findNodeByTitle
   * @param {String} name the name of the node to search
   * @return {Node} the node or null
   */
  findNodeByTitle(t) {
    var r;
    return (r = this._nodes.find((n) => n.title === t)) != null ? r : null;
  }
  /**
   * Returns a list of nodes that matches a name
   * @method findNodesByTitle
   * @param {String} name the name of the node to search
   * @return {Array} a list with all the nodes with this name
   */
  findNodesByTitle(t) {
    return this._nodes.filter((r) => r.title === t);
  }
  /**
   * Returns the top-most node in this position of the canvas
   * @method getNodeOnPos
   * @param {number} x the x coordinate in canvas space
   * @param {number} y the y coordinate in canvas space
   * @param {Array} nodes_list a list with all the nodes to search from, by default is all the nodes in the graph
   * @return {LiteGraph.LGraphNode} the node at this position or null
   */
  getNodeOnPos(t, r, n = this._nodes, a = 0) {
    var o;
    return (o = n.reverse().find((h) => h.isPointInside(t, r, a))) != null ? o : null;
  }
  /**
   * Returns the top-most group in that position
   * @method getGroupOnPos
   * @param {number} x the x coordinate in canvas space
   * @param {number} y the y coordinate in canvas space
   * @return {LiteGraph.LGraphGroup} the group or null
   */
  getGroupOnPos(t, r) {
    var n;
    return (n = this._groups.find((a) => a.isPointInside(t, r, 2, !0))) != null ? n : null;
  }
  /**
   * Checks that the node type matches the node type registered, used when replacing a nodetype by a newer version during execution
   * this replaces the ones using the old version with the new version
   * @method checkNodeTypes
   */
  checkNodeTypes() {
    var o;
    for (var t = 0; t < this._nodes.length; t++) {
      var r = this._nodes[t], n = LiteGraph.registered_node_types[r.type];
      if (r.constructor != n) {
        LiteGraph.debug && ((o = LiteGraph.log) == null || o.call(LiteGraph, `node being replaced by newer version: ${r.type}`));
        var a = LiteGraph.createNode(r.type);
        this._nodes[t] = a, a.configure(r.serialize()), a.graph = this, this._nodes_by_id[a.id] = a, r.inputs && (a.inputs = r.inputs.concat()), r.outputs && (a.outputs = r.outputs.concat());
      }
    }
    this.updateExecutionOrder();
  }
  /**
   * Executes an action on the GraphInput nodes based on the provided action name and parameters.
   * @param {string} action - The name of the action to be executed on the GraphInput nodes.
   * @param {any} param - The parameter to pass to the action method.
   * @param {object} options - Additional options for the action.
   */
  onAction(t, r, n) {
    this._input_nodes = this.findNodesByClass(
      LiteGraph.GraphInput,
      this._input_nodes
    );
    for (var a = 0; a < this._input_nodes.length; ++a) {
      var o = this._input_nodes[a];
      if (o.properties.name == t) {
        o.actionDo(t, r, n);
        break;
      }
    }
  }
  trigger(t, r) {
    var n;
    (n = this.onTrigger) == null || n.call(this, t, r);
  }
  /**
   * Tell this graph it has a global graph input of this type
   * @method addGlobalInput
   * @param {String} name
   * @param {String} type
   * @param {*} value [optional]
   */
  addInput(t, r, n) {
    var o, h;
    var a = this.inputs[t];
    a || (this.beforeChange(), this.inputs[t] = { name: t, type: r, value: n }, this.onGraphChanged({ action: "addInput" }), this.afterChange(), (o = this.onInputAdded) == null || o.call(this, t, r), (h = this.onInputsOutputsChange) == null || h.call(this));
  }
  /**
   * Assign a data to the global graph input
   * @method setGlobalInputData
   * @param {String} name
   * @param {*} data
   */
  setInputData(t, r) {
    var n = this.inputs[t];
    n && (n.value = r);
  }
  /**
   * Returns the current value of a global graph input
   * @method getInputData
   * @param {String} name
   * @return {*} the data
   */
  getInputData(t) {
    var r = this.inputs[t];
    return r ? r.value : null;
  }
  /**
   * Changes the name of a global graph input
   * @method renameInput
   * @param {String} old_name
   * @param {String} new_name
   */
  renameInput(t, r) {
    var n, a, o;
    if (r != t) {
      if (!this.inputs[t])
        return !1;
      if (this.inputs[r])
        return (n = LiteGraph.error) == null || n.call(LiteGraph, "there is already one input with that name"), !1;
      this.inputs[r] = this.inputs[t], delete this.inputs[t], this.onGraphChanged({ action: "renameInput" }), (a = this.onInputRenamed) == null || a.call(this, t, r), (o = this.onInputsOutputsChange) == null || o.call(this);
    }
  }
  /**
   * Changes the type of a global graph input
   * @method changeInputType
   * @param {String} name
   * @param {String} type
   */
  changeInputType(t, r) {
    var n;
    if (!this.inputs[t])
      return !1;
    this.inputs[t].type && String(this.inputs[t].type).toLowerCase() == String(r).toLowerCase() || (this.inputs[t].type = r, this.onGraphChanged({ action: "changeInputType" }), (n = this.onInputTypeChanged) == null || n.call(this, t, r));
  }
  /**
   * Removes a global graph input
   * @method removeInput
   * @param {String} name
   * @param {String} type
   */
  removeInput(t) {
    var r, n;
    return this.inputs[t] ? (delete this.inputs[t], this.onGraphChanged({ action: "graphRemoveInput" }), (r = this.onInputRemoved) == null || r.call(this, t), (n = this.onInputsOutputsChange) == null || n.call(this), !0) : !1;
  }
  /**
   * Creates a global graph output
   * @method addOutput
   * @param {String} name
   * @param {String} type
   * @param {*} value
   */
  addOutput(t, r, n) {
    var a, o;
    this.outputs[t] = { name: t, type: r, value: n }, this.onGraphChanged({ action: "addOutput" }), (a = this.onOutputAdded) == null || a.call(this, t, r), (o = this.onInputsOutputsChange) == null || o.call(this);
  }
  /**
   * Assign a data to the global output
   * @method setOutputData
   * @param {String} name
   * @param {String} value
   */
  setOutputData(t, r) {
    var n = this.outputs[t];
    n && (n.value = r);
  }
  /**
   * Returns the current value of a global graph output
   * @method getOutputData
   * @param {String} name
   * @return {*} the data
   */
  getOutputData(t) {
    var r = this.outputs[t];
    return r ? r.value : null;
  }
  /**
   * Renames a global graph output
   * @method renameOutput
   * @param {String} old_name
   * @param {String} new_name
   */
  renameOutput(t, r) {
    var n, a, o;
    if (!this.outputs[t])
      return !1;
    if (this.outputs[r])
      return (n = LiteGraph.error) == null || n.call(LiteGraph, "there is already one output with that name"), !1;
    this.outputs[r] = this.outputs[t], delete this.outputs[t], this._version++, (a = this.onOutputRenamed) == null || a.call(this, t, r), (o = this.onInputsOutputsChange) == null || o.call(this);
  }
  /**
   * Changes the type of a global graph output
   * @method changeOutputType
   * @param {String} name
   * @param {String} type
   */
  changeOutputType(t, r) {
    var n;
    if (!this.outputs[t])
      return !1;
    this.outputs[t].type && String(this.outputs[t].type).toLowerCase() == String(r).toLowerCase() || (this.outputs[t].type = r, this.onGraphChanged({ action: "changeOutputType" }), (n = this.onOutputTypeChanged) == null || n.call(this, t, r));
  }
  /**
   * Removes a global graph output
   * @method removeOutput
   * @param {String} name
   */
  removeOutput(t) {
    var r, n;
    return this.outputs[t] ? (delete this.outputs[t], this.onGraphChanged({ action: "removeOutput" }), (r = this.onOutputRemoved) == null || r.call(this, t), (n = this.onInputsOutputsChange) == null || n.call(this), !0) : !1;
  }
  /**
   * Triggers the 'onTrigger' method on nodes with a specific title by passing a value to them.
   * @param {string} name - The title of the nodes to trigger.
   * @param {any} value - The value to pass to the 'onTrigger' method of the nodes.
   */
  triggerInput(t, r) {
    for (var n = this.findNodesByTitle(t), a = 0; a < n.length; ++a)
      n[a].onTrigger(r);
  }
  /**
   * Sets a callback function on nodes with a specific title by invoking their 'setTrigger' method.
   * @param {string} name - The title of the nodes to set the callback function on.
   * @param {Function} func - The callback function to be set on the nodes.
   */
  setCallback(t, r) {
    for (var n = this.findNodesByTitle(t), a = 0; a < n.length; ++a)
      n[a].setTrigger(r);
  }
  /**
   * Executes actions before a change with the provided information detail.
   * Calls the 'onBeforeChange' function on the class instance and sends the action to connected GraphCanvas instances.
   * @param {object} info - The information detail about the change.
   */
  beforeChange(t) {
    var r;
    (r = this.onBeforeChange) == null || r.call(this, this, t), this.sendActionToCanvas("onBeforeChange", this);
  }
  /**
   * Executes actions after a change with the provided information detail.
   * Calls the 'onAfterChange' function on the class instance and sends the action to connected GraphCanvas instances.
   * @param {object} info - The information detail about the change.
   */
  afterChange(t) {
    var r;
    (r = this.onAfterChange) == null || r.call(this, this, t), this.sendActionToCanvas("onAfterChange", this);
  }
  /**
   * Handles changes in node connections and triggers related actions.
   * Updates the execution order, calls the 'onConnectionChange' function on the class instance and connected GraphCanvas instances, and increments the version.
   * @param {object} node - The node where the connection change occurred.
   * @param {object} link_info - Information about the changed connection.
   */
  connectionChange(t) {
    var r;
    this.updateExecutionOrder(), (r = this.onConnectionChange) == null || r.call(this, t), this.onGraphChanged({ action: "connectionChange", doSave: !1 }), this.sendActionToCanvas("onConnectionChange");
  }
  /**
   * returns if the graph is in live mode
   * @method isLive
   */
  isLive() {
    if (!this.list_of_graphcanvas)
      return !1;
    for (var t = 0; t < this.list_of_graphcanvas.length; ++t) {
      var r = this.list_of_graphcanvas[t];
      if (r.live_mode)
        return !0;
    }
    return !1;
  }
  /**
   * clears the triggered slot animation in all links (stop visual animation)
   * @method clearTriggeredSlots
   */
  clearTriggeredSlots() {
    for (var t in this.links) {
      var r = this.links[t];
      r && r._last_time && (r._last_time = 0);
    }
  }
  /**
   * Indicates a visual change in the graph (not the structure) and triggers related actions.
   * Logs a message if in debug mode, sends a 'setDirty' action with parameters to connected GraphCanvas instances, and calls the 'on_change' function on the class instance.
   * @method change
   */
  change() {
    var t, r;
    (t = LiteGraph.log) == null || t.call(LiteGraph, "Graph visually changed"), this.sendActionToCanvas("setDirty", [!0, !0]), (r = this.on_change) == null || r.call(this, this);
  }
  setDirtyCanvas(t, r) {
    this.sendActionToCanvas("setDirty", [t, r]);
  }
  /**
   * Destroys a link
   * @method removeLink
   * @param {Number} link_id
   */
  removeLink(t) {
    var r = this.links[t];
    if (r) {
      var n = this.getNodeById(r.target_id);
      n && (this.beforeChange(), n.disconnectInput(r.target_slot), this.afterChange());
    }
  }
  /**
   * Creates a Object containing all the info about this graph, it can be serialized
   * @method serialize
   * @return {Object} value of the node
   */
  serialize() {
    var p, c;
    const t = this._nodes.map((d) => d.serialize());
    var r = [];
    for (var n in this.links) {
      var a = this.links[n];
      if (!a.serialize) {
        (p = LiteGraph.warn) == null || p.call(LiteGraph, "weird LLink bug, link info is not a LLink but a regular object");
        var o = new LiteGraph.LLink();
        for (var h in a)
          o[h] = a[h];
        this.links[n] = o, a = o;
      }
      r.push(a.serialize());
    }
    const l = this._groups.map((d) => d.serialize());
    var u = {
      last_node_id: this.last_node_id,
      last_link_id: this.last_link_id,
      nodes: t,
      links: r,
      groups: l,
      config: this.config,
      extra: this.extra,
      version: LiteGraph.VERSION
    };
    return (c = this.onSerialize) == null || c.call(this, u), u;
  }
  /**
   * Configure a graph from a JSON string
   * @method configure
   * @param {String} str configure a graph from a JSON string
   * @param {Boolean} returns if there was any error parsing
   */
  configure(t, r) {
    var d, f, _, g, L;
    if (t) {
      r || this.clear();
      var n = t.nodes;
      if (t.links && t.links.constructor === Array) {
        for (var a = [], o = 0; o < t.links.length; ++o) {
          var h = t.links[o];
          if (!h) {
            (d = LiteGraph.warn) == null || d.call(LiteGraph, "serialized graph link data contains errors, skipping.");
            continue;
          }
          var l = new LiteGraph.LLink();
          l.configure(h), a[l.id] = l;
        }
        t.links = a;
      }
      for (let b in t)
        ["nodes", "groups"].includes(b) || (this[b] = t[b]);
      var u = !1;
      if (this._nodes = [], n) {
        for (let b = 0, m = n.length; b < m; ++b) {
          var p = n[b], c = LiteGraph.createNode(p.type, p.title);
          c || ((f = LiteGraph.log) == null || f.call(LiteGraph, `Node not found or has errors: ${p.type}`), c = new LiteGraph.LGraphNode(), c.last_serialization = p, c.has_errors = !0, u = !0), c.id = p.id, this.add(c, !0, { doProcessChange: !1 });
        }
        n.forEach((b) => {
          const m = this.getNodeById(b.id);
          m == null || m.configure(b);
        });
      }
      return this._groups.length = 0, t.groups && t.groups.forEach((b) => {
        const m = new LiteGraph.LGraphGroup();
        m.configure(b), this.add(m, !0, { doProcessChange: !1 });
      }), this.updateExecutionOrder(), this.extra = (_ = t.extra) != null ? _ : {}, (g = this.onConfigure) == null || g.call(this, t), t._version ? (L = LiteGraph.debug) == null || L.call(LiteGraph, "skip onGraphChanged when configure passing version too!") : this.onGraphChanged({ action: "graphConfigure", doSave: !1 }), this.setDirtyCanvas(!0, !0), u;
    }
  }
  /**
   * Loads graph data from a given URL or file and configures the graph accordingly.
   * @param {string | File | Blob} url - The URL or file to load the graph data from.
   * @param {Function} callback - An optional callback function to be executed after loading and configuring the graph.
   */
  load(t, r) {
    var n = this;
    if (t.constructor === File || t.constructor === Blob) {
      var a = new FileReader();
      a.addEventListener("load", (h) => {
        var l = JSON.parse(h.target.result);
        n.configure(l), r == null || r();
      }), a.readAsText(t);
      return;
    }
    var o = new XMLHttpRequest();
    o.open("GET", t, !0), o.send(null), o.onload = (h) => {
      var u;
      if (o.status !== 200) {
        (u = LiteGraph.error) == null || u.call(LiteGraph, "Error loading graph:", o.status, o.response);
        return;
      }
      var l = JSON.parse(o.response);
      n.configure(l), r == null || r();
    }, o.onerror = (h) => {
      var l;
      (l = LiteGraph.error) == null || l.call(LiteGraph, "Error loading graph:", h);
    };
  }
  /**
  * Meant to serve the history-saving mechanism
  * @method onGraphSaved
  * @param {object} optsIn options
  */
  onGraphSaved(t = {}) {
    var r = {};
    Object.assign(r, t), this.savedVersion = this._version;
  }
  /**
  * Meant to serve the history-saving mechanism
  * @method onGraphSaved
  * @param {object} optsIn options
  */
  onGraphLoaded(t = {}) {
    var r = {};
    Object.assign(r, t), this.savedVersion = this._version;
  }
  /**
  * Ment to be the history and prevent-exit mechanism, call to change _version
  * @method onGraphChanged
  * @param {object} optsIn options
  */
  onGraphChanged(t = {}) {
    var l, u, p, c, d, f;
    var r = {
      action: "",
      doSave: !0,
      // log action in graph.history
      doSaveGraph: !0
      // save
    }, n = Object.assign(r, t);
    if (this._version++, n.action ? (l = LiteGraph.debug) == null || l.call(LiteGraph, "Graph change", n.action) : (u = LiteGraph.debug) == null || u.call(LiteGraph, "Graph change, no action", n), n.doSave && LiteGraph.actionHistory_enabled) {
      (p = LiteGraph.debug) == null || p.call(LiteGraph, "onGraphChanged SAVE :: " + n.action);
      var a = { actionName: n.action };
      n.doSaveGraph && (a = Object.assign(
        a,
        { graphSave: this.serialize() }
        // this is a heavy method, but the alternative is way more complex: every action has to have its contrary
      ));
      for (var o = this.history; o.actionHistoryPtr < o.actionHistoryVersions.length - 1; )
        (c = LiteGraph.debug) == null || c.call(LiteGraph, "popping: gone back? " + (o.actionHistoryPtr + " < " + (o.actionHistoryVersions.length - 1))), o.actionHistoryVersions.pop();
      if (o.actionHistoryVersions.length >= LiteGraph.actionHistoryMaxSave) {
        var h = o.actionHistoryVersions.shift();
        (d = LiteGraph.debug) == null || d.call(LiteGraph, "maximum saves reached: " + o.actionHistoryVersions.length + ", remove older: " + h), o.actionHistory[h] = !1;
      }
      o.actionHistoryPtr = o.actionHistoryVersions.length, o.actionHistoryVersions.push(o.actionHistoryPtr), o.actionHistory[o.actionHistoryPtr] = a, (f = LiteGraph.debug) == null || f.call(LiteGraph, "history saved: " + o.actionHistoryPtr, a.actionName);
    }
  }
  /**
  * Go back in action history
  * @method actionHistoryBack
  * @param {object} optsIn options
  */
  actionHistoryBack(t = {}) {
    var a, o, h, l, u;
    var r = {};
    Object.assign(r, t);
    var n = this.history;
    return n.actionHistoryPtr != null && n.actionHistoryPtr >= 0 ? (n.actionHistoryPtr--, (a = LiteGraph.debug) == null || a.call(LiteGraph, "history step back: " + n.actionHistoryPtr), this.actionHistoryLoad({ iVersion: n.actionHistoryPtr }) ? ((h = LiteGraph.debug) == null || h.call(LiteGraph, "history loaded back: " + n.actionHistoryPtr), (l = LiteGraph.debug) == null || l.call(LiteGraph, this.history), !0) : ((o = LiteGraph.warn) == null || o.call(LiteGraph, "historyLoad failed, restore pointer? " + n.actionHistoryPtr), n.actionHistoryPtr++, !1)) : ((u = LiteGraph.debug) == null || u.call(LiteGraph, "history is already at older state"), !1);
  }
  /**
  * Go forward in action history
  * @method actionHistoryForward
  * @param {object} optsIn options
  */
  actionHistoryForward(t = {}) {
    var a, o, h, l;
    var r = {};
    Object.assign(r, t);
    var n = this.history;
    return n.actionHistoryPtr < n.actionHistoryVersions.length ? (n.actionHistoryPtr++, (a = LiteGraph.debug) == null || a.call(LiteGraph, "history step forward: " + n.actionHistoryPtr), this.actionHistoryLoad({ iVersion: n.actionHistoryPtr }) ? ((h = LiteGraph.debug) == null || h.call(LiteGraph, "history loaded forward: " + n.actionHistoryPtr), !0) : ((o = LiteGraph.warn) == null || o.call(LiteGraph, "historyLoad failed, restore pointer? " + n.actionHistoryPtr), n.actionHistoryPtr--, !1)) : ((l = LiteGraph.debug) == null || l.call(LiteGraph, "history is already at newer state"), !1);
  }
  /**
  * Load from action history
  * @method actionHistoryLoad
  * @param {object} optsIn options
  */
  actionHistoryLoad(t = {}) {
    var h;
    var r = {
      iVersion: !1,
      backStep: !1
    }, n = Object.assign(r, t), a = this.history;
    if (a.actionHistory[n.iVersion] && a.actionHistory[n.iVersion].graphSave) {
      var o = JSON.stringify(this.history);
      return this.configure(a.actionHistory[n.iVersion].graphSave), this.history = JSON.parse(o), (h = LiteGraph.debug) == null || h.call(LiteGraph, "history loaded: " + n.iVersion, a.actionHistory[n.iVersion].actionName), !0;
    } else
      return !1;
  }
};
// default supported types
M(V, "supported_types", ["number", "string", "boolean"]), M(V, "STATUS_STOPPED", 1), M(V, "STATUS_RUNNING", 2);
let LGraph = V;
class LGraphNode {
  constructor(t = "Unnamed") {
    this.title = t, this.size = [LiteGraph.NODE_WIDTH, 60], this.graph = null, this._pos = new Float32Array(10, 10), LiteGraph.use_uuids ? this.id = LiteGraph.uuidv4() : this.id = -1, this.type = null, this.inputs = [], this.outputs = [], this.connections = [], this.properties = {}, this.properties_info = [], this.flags = {};
  }
  set pos(t) {
    var r;
    !t || t.length < 2 || ((r = this._pos) != null || (this._pos = new Float32Array(10, 10)), this._pos[0] = t[0], this._pos[1] = t[1]);
  }
  get pos() {
    return this._pos;
  }
  /**
   * configure a node from an object containing the serialized info
   * @method configure
   */
  configure(t) {
    var r, n, a, o, h;
    Object.entries(t).forEach(([l, u]) => {
      var c;
      if (l === "properties") {
        for (var p in u)
          this.properties[p] = u[p], (c = this.onPropertyChanged) == null || c.call(this, p, u[p]);
        return;
      }
      u !== null && (typeof u == "object" ? this[l] && this[l].configure ? this[l].configure(u) : this[l] = LiteGraph.cloneObject(u, this[l]) : this[l] = u);
    }), t.title || (this.title = this.constructor.title), (r = this.inputs) == null || r.forEach((l, u) => {
      var c, d;
      if (!l.link)
        return;
      const p = this.graph ? this.graph.links[l.link] : null;
      (c = this.onConnectionsChange) == null || c.call(this, LiteGraph.INPUT, u, !0, p, l), (d = this.onInputAdded) == null || d.call(this, l);
    }), (n = this.outputs) == null || n.forEach((l, u) => {
      var p;
      l.links && (l.links.forEach(() => {
        var d;
        const c = this.graph;
        (d = this.onConnectionsChange) == null || d.call(this, LiteGraph.OUTPUT, u, !0, c, l);
      }), (p = this.onOutputAdded) == null || p.call(this, l));
    }), this.widgets && (this.widgets.forEach((l) => {
      l && l.options && l.options.property && this.properties[l.options.property] !== void 0 && (l.value = JSON.parse(JSON.stringify(this.properties[l.options.property])));
    }), (a = t.widgets_values) == null || a.forEach((l, u) => {
      this.widgets[u] && (this.widgets[u].value = l);
    })), (o = this.onConfigure) == null || o.call(this, t), (h = this.graph) == null || h.onGraphChanged({ action: "nodeConfigure", doSave: !1 });
  }
  /**
   * serialize the content
   * @method serialize
   */
  serialize() {
    var r, n, a;
    var t = {
      id: this.id,
      type: this.type,
      pos: this.pos,
      size: this.size,
      flags: LiteGraph.cloneObject(this.flags),
      order: this.order,
      mode: this.mode
    };
    return this.constructor === LGraphNode && this.last_serialization ? this.last_serialization : (this.inputs && (t.inputs = LiteGraph.cloneObject(this.inputs)), this.outputs && (this.outputs.forEach((o) => {
      delete o._data;
    }), t.outputs = LiteGraph.cloneObject(this.outputs)), this.title && this.title != this.constructor.title && (t.title = this.title), this.properties && (t.properties = LiteGraph.cloneObject(this.properties)), this.widgets && this.serialize_widgets && (t.widgets_values = this.widgets.map((o) => {
      var h;
      return (h = o == null ? void 0 : o.value) != null ? h : null;
    })), (r = t.type) != null || (t.type = this.constructor.type), this.color && (t.color = this.color), this.bgcolor && (t.bgcolor = this.bgcolor), this.boxcolor && (t.boxcolor = this.boxcolor), this.shape && (t.shape = this.shape), (n = this.onSerialize) != null && n.call(this, t) && ((a = LiteGraph.warn) == null || a.call(LiteGraph, "node onSerialize shouldnt return anything, data should be stored in the object pass in the first parameter")), t);
  }
  /* Creates a clone of this node */
  clone() {
    var n, a;
    var t = LiteGraph.createNode(this.type);
    if (!t)
      return null;
    var r = LiteGraph.cloneObject(this.serialize());
    return (n = r.inputs) == null || n.forEach((o) => {
      o.link = null;
    }), (a = r.outputs) == null || a.forEach((o) => {
      o.links && (o.links.length = 0);
    }), delete r.id, LiteGraph.use_uuids && (r.id = LiteGraph.uuidv4()), t.configure(r), t;
  }
  /**
   * serialize and stringify
   * @method toString
   */
  toString() {
    return JSON.stringify(this.serialize());
  }
  // LGraphNode.prototype.deserialize = function(info) {} //this cannot be done from within, must be done in LiteGraph
  /**
   * get the title string
   * @method getTitle
   */
  getTitle() {
    var t;
    return (t = this.title) != null ? t : this.constructor.title;
  }
  /**
   * sets the value of a property
   * @method setProperty
   * @param {String} name
   * @param {*} value
   */
  setProperty(t, r) {
    var o, h;
    if (this.properties || (this.properties = {}), r === this.properties[t])
      return;
    const n = this.properties[t];
    this.properties[t] = r, ((o = this.onPropertyChanged) == null ? void 0 : o.call(this, t, r, n)) === !1 && (this.properties[t] = n);
    const a = (h = this.widgets) == null ? void 0 : h.find((l) => {
      var u;
      return l && ((u = l.options) == null ? void 0 : u.property) === t;
    });
    a && (a.value = r);
  }
  // Execution *************************
  /**
   * sets the output data
   * @method setOutputData
   * @param {number} slot
   * @param {*} data
   */
  setOutputData(t, r) {
    var a;
    if (this.outputs) {
      if ((t == null ? void 0 : t.constructor) === String)
        t = this.findOutputSlot(t);
      else if (t == -1 || t >= this.outputs.length)
        return;
      var n = this.outputs[t];
      n && (n._data = r, (a = this.outputs[t].links) == null || a.forEach((o) => {
        const h = this.graph.links[o];
        h && (h.data = r);
      }));
    }
  }
  /**
   * sets the output data type, useful when you want to be able to overwrite the data type
   * @method setOutputDataType
   * @param {number} slot
   * @param {String} datatype
   */
  setOutputDataType(t, r) {
    var a, o;
    if (this.outputs && !(t == -1 || t >= this.outputs.length)) {
      var n = this.outputs[t];
      n && (n.type = r, (o = (a = this.outputs[t]) == null ? void 0 : a.links) == null || o.forEach((h) => {
        this.graph.links[h] && (this.graph.links[h].type = r);
      }));
    }
  }
  /**
   * Retrieves the input data (data traveling through the connection) from one slot
   * @method getInputData
   * @param {number} slot
   * @param {boolean} force_update if set to true it will force the connected node of this slot to output data into this link
   * @return {*} data or if it is not connected returns undefined
   */
  getInputData(t, r, n) {
    var p;
    if (this.inputs && !(t >= this.inputs.length || this.inputs[t].link == null)) {
      var a = this.inputs[t].link, o = this.graph.links[a];
      if (!o)
        return null;
      if (!r)
        return o.data;
      var h = this.graph.getNodeById(o.origin_id);
      if (!h)
        return o.data;
      if (n) {
        var l = this.id + "_getInputData_forced_" + Math.floor(Math.random() * 9999), u = { action: l, options: { action_call: l } };
        this.refreshAncestors(u);
      }
      return h.updateOutputData ? h.updateOutputData(o.origin_slot) : (p = h.doExecute) == null || p.call(h), o.data;
    }
  }
  /**
   * Retrieves the input data type (in case this supports multiple input types)
   * @method getInputDataType
   * @param {number} slot
   * @return {String} datatype in string format
   */
  getInputDataType(t) {
    if (!this.inputs || t >= this.inputs.length || this.inputs[t].link == null)
      return null;
    var r = this.inputs[t].link, n = this.graph.links[r];
    if (!n)
      return null;
    var a = this.graph.getNodeById(n.origin_id);
    if (!a)
      return n.type;
    var o = a.outputs[n.origin_slot];
    return o ? o.type : null;
  }
  /**
   * Retrieves the input data from one slot using its name instead of slot number
   * @method getInputDataByName
   * @param {String} slot_name
   * @param {boolean} force_update if set to true it will force the connected node of this slot to output data into this link
   * @return {*} data or if it is not connected returns null
   */
  getInputDataByName(t, r) {
    var n = this.findInputSlot(t);
    return n == -1 ? null : this.getInputData(n, r);
  }
  /**
   * tells you if there is a connection in one input slot
   * @method isInputConnected
   * @param {number} slot
   * @return {boolean}
   */
  isInputConnected(t) {
    return this.inputs ? t < this.inputs.length && this.inputs[t].link != null : !1;
  }
  /**
   * tells you info about an input connection (which node, type, etc)
   * @method getInputInfo
   * @param {number} slot
   * @return {Object} object or null { link: id, name: string, type: string or 0 }
   */
  getInputInfo(t) {
    return this.inputs && t < this.inputs.length ? this.inputs[t] : null;
  }
  /**
   * Returns the link info in the connection of an input slot
   * @method getInputLink
   * @param {number} slot
   * @return {LiteGraph.LLink} object or null
   */
  getInputLink(t) {
    if (!this.inputs)
      return null;
    if (t < this.inputs.length) {
      var r = this.inputs[t];
      return this.graph.links[r.link];
    }
    return null;
  }
  /**
   * returns the node connected in the input slot
   * @method getInputNode
   * @param {number} slot
   * @return {LGraphNode} node or null
   */
  getInputNode(t) {
    if (!this.inputs || t >= this.inputs.length)
      return null;
    var r = this.inputs[t];
    if (!r || r.link === null)
      return null;
    var n = this.graph.links[r.link];
    return n ? this.graph.getNodeById(n.origin_id) : null;
  }
  /**
   * returns the value of an input with this name, otherwise checks if there is a property with that name
   * @method getInputOrProperty
   * @param {string} name
   * @return {*} value
   */
  getInputOrProperty(t) {
    if (this.inputs)
      for (var r = 0, n = this.inputs.length; r < n; ++r) {
        var a = this.inputs[r];
        if (t == a.name && a.link != null) {
          var o = this.graph.links[a.link];
          if (o)
            return o.data;
        }
      }
    return this.properties ? this.properties[t] : null;
  }
  /**
   * tells you the last output data that went in that slot
   * @method getOutputData
   * @param {number} slot
   * @return {Object}  object or null
   */
  getOutputData(t) {
    if (!this.outputs || t >= this.outputs.length)
      return null;
    var r = this.outputs[t];
    return r._data;
  }
  /**
   * tells you info about an output connection (which node, type, etc)
   * @method getOutputInfo
   * @param {number} slot
   * @return {Object}  object or null { name: string, type: string, links: [ ids of links in number ] }
   */
  getOutputInfo(t) {
    return this.outputs && t < this.outputs.length ? this.outputs[t] : null;
  }
  /**
   * tells you if there is a connection in one output slot
   * @method isOutputConnected
   * @param {number} slot
   * @return {boolean}
   */
  isOutputConnected(t) {
    return this.outputs ? t < this.outputs.length && this.outputs[t].links && this.outputs[t].links.length : !1;
  }
  /**
   * tells you if there is any connection in the output slots
   * @method isAnyOutputConnected
   * @return {boolean}
   */
  isAnyOutputConnected() {
    return this.outputs ? this.outputs.some((t) => t.links && t.links.length) : !1;
  }
  /**
   * retrieves all the nodes connected to this output slot
   * @method getOutputNodes
   * @param {number} slot
   * @return {array}
   */
  getOutputNodes(t) {
    if (!this.outputs || t >= this.outputs.length)
      return null;
    const r = this.outputs[t];
    return !r.links || r.links.length === 0 ? null : r.links.map((n) => this.graph.links[n]).filter((n) => n).map((n) => this.graph.getNodeById(n.target_id)).filter((n) => n);
  }
  addOnTriggerInput() {
    var t = this.findInputSlot("onTrigger");
    return t == -1 ? (this.addInput("onTrigger", LiteGraph.EVENT, { removable: !0, nameLocked: !0 }), this.findInputSlot("onTrigger")) : t;
  }
  addOnExecutedOutput() {
    var t = this.findOutputSlot("onExecuted");
    return t == -1 ? (this.addOutput("onExecuted", LiteGraph.ACTION, { removable: !0, nameLocked: !0 }), this.findOutputSlot("onExecuted")) : t;
  }
  onAfterExecuteNode(t, r) {
    var a;
    var n = this.findOutputSlot("onExecuted");
    n != -1 && ((a = LiteGraph.debug) == null || a.call(LiteGraph, this.id + ":" + this.order + " triggering slot onAfterExecute", t, r), this.triggerSlot(n, t, null, r));
  }
  changeMode(t) {
    switch (t) {
      case LiteGraph.ON_TRIGGER:
        this.addOnTriggerInput(), this.addOnExecutedOutput();
        break;
      case LiteGraph.ON_EVENT:
        break;
      case LiteGraph.NEVER:
        break;
      case LiteGraph.ALWAYS:
        break;
      case LiteGraph.ON_REQUEST:
        break;
      default:
        return !1;
    }
    return this.mode = t, !0;
  }
  /**
   * Triggers the execution of actions that were deferred when the action was triggered
   * @method executePendingActions
   */
  executePendingActions() {
    !this._waiting_actions || !this._waiting_actions.length || (this._waiting_actions.forEach((t) => {
      this.onAction(t[0], t[1], t[2], t[3], t[4]);
    }), this._waiting_actions.length = 0);
  }
  /**
   * Triggers the node code execution, place a boolean/counter to mark the node as being executed
   * @method doExecute
   * @param {*} param
   * @param {*} options
   */
  doExecute(t, r = {}) {
    var n, a, o, h, l;
    if (this.onExecute) {
      if ((n = r.action_call) != null || (r.action_call = `${this.id}_exec_${Math.floor(Math.random() * 9999)}`), this.graph.nodes_executing && this.graph.nodes_executing[this.id]) {
        (a = LiteGraph.debug) == null || a.call(LiteGraph, "NODE already executing! Prevent! " + this.id + ":" + this.order);
        return;
      }
      if (LiteGraph.ensureNodeSingleExecution && this.exec_version && this.exec_version >= this.graph.iteration && this.exec_version !== void 0) {
        (o = LiteGraph.debug) == null || o.call(LiteGraph, "!! NODE already EXECUTED THIS STEP !! " + this.exec_version);
        return;
      }
      if (LiteGraph.ensureUniqueExecutionAndActionCall && this.graph.nodes_executedAction[this.id] && r && r.action_call && this.graph.nodes_executedAction[this.id] == r.action_call) {
        (h = LiteGraph.debug) == null || h.call(LiteGraph, "!! NODE already ACTION THIS STEP !! " + r.action_call);
        return;
      }
      this.graph.nodes_executing[this.id] = !0, this.onExecute(t, r), this.graph.nodes_executing[this.id] = !1, this.exec_version = this.graph.iteration, r && r.action_call && (this.action_call = r.action_call, this.graph.nodes_executedAction[this.id] = r.action_call);
    }
    this.execute_triggered = 2, (l = this.onAfterExecuteNode) == null || l.call(this, t, r);
  }
  /**
   * retrocompatibility :: old doExecute
   * @method doExecute
   * @param {*} param
   * @param {*} options
   */
  execute(t, r = {}) {
    return this.doExecute(t, r);
  }
  /**
   * Triggers an action, wrapped by logics to control execution flow
   * @method actionDo
   * @param {String} action name
   * @param {*} param
   */
  actionDo(t, r, n = {}, a) {
    var o, h, l, u;
    if (this.onAction) {
      if ((o = n.action_call) != null || (n.action_call = `${this.id}_${t || "action"}_${Math.floor(Math.random() * 9999)}`), LiteGraph.ensureNodeSingleAction && this.graph.nodes_actioning && this.graph.nodes_actioning[this.id] == n.action_call)
        return;
      if ((h = LiteGraph.debug) == null || h.call(LiteGraph, "CheckActioned ? " + this.id + ":" + this.order + " :: " + this.action_call), LiteGraph.ensureUniqueExecutionAndActionCall && this.graph.nodes_executedAction[this.id] && n && n.action_call && this.graph.nodes_executedAction[this.id] == n.action_call) {
        (l = LiteGraph.debug) == null || l.call(LiteGraph, "!! NODE already ACTION THIS STEP !! " + n.action_call), ç;
        return;
      }
      this.graph.nodes_actioning[this.id] = t || "actioning", this.onAction(t, r, n, a), this.graph.nodes_actioning[this.id] = !1, n && n.action_call && (this.action_call = n.action_call, this.graph.nodes_executedAction[this.id] = n.action_call);
    }
    this.action_triggered = 2, (u = this.onAfterExecuteNode) == null || u.call(this, r, n);
  }
  /**
   * Triggers an event in this node, this will trigger any output with the same name
   * @method trigger
   * @param {String} event name ( "on_play", ... ) if action is equivalent to false then the event is send to all
   * @param {*} param
   */
  trigger(t, r, n) {
    !this.outputs || this.outputs.length === 0 || (this.graph && (this.graph._last_trigger_time = LiteGraph.getTime()), this.outputs.forEach((a, o) => {
      a && a.type === LiteGraph.EVENT && (!t || a.name === t) && this.triggerSlot(o, r, null, n);
    }));
  }
  /**
   * Triggers a slot event in this node: cycle output slots and launch execute/action on connected nodes
   * @method triggerSlot
   * @param {Number} slot the index of the output slot
   * @param {*} param
   * @param {Number} link_id [optional] in case you want to trigger and specific output link in a slot
   */
  triggerSlot(t, r, n, a = {}) {
    var d, f, _, g;
    if (this.outputs) {
      if (t == null) {
        (d = LiteGraph.error) == null || d.call(LiteGraph, "triggerSlot", "slot must be a number");
        return;
      }
      t.constructor !== Number && ((f = LiteGraph.warn) == null || f.call(LiteGraph, "triggerSlot", "slot must be a number, use node.trigger('name') if you want to use a string"));
      var o = this.outputs[t];
      if (o) {
        var h = o.links;
        if (!(!h || !h.length) && !(this.graph && this.graph.ancestorsCall)) {
          this.graph && (this.graph._last_trigger_time = LiteGraph.getTime());
          for (var l = 0; l < h.length; ++l) {
            var u = h[l];
            if (!(n != null && n != u)) {
              var p = this.graph.links[h[l]];
              if (p) {
                p._last_time = LiteGraph.getTime();
                var c = this.graph.getNodeById(p.target_id);
                if (c) {
                  if (c.mode === LiteGraph.ON_TRIGGER)
                    a.action_call || (a.action_call = `${this.id}_trigg_${Math.floor(Math.random() * 9999)}`), LiteGraph.refreshAncestorsOnTriggers && c.refreshAncestors({ action: "trigger", param: r, options: a }), c.onExecute && c.doExecute(r, a);
                  else if (c.onAction) {
                    a.action_call || (a.action_call = `${this.id}_act_${Math.floor(Math.random() * 9999)}`);
                    let L = c.inputs[p.target_slot];
                    (_ = LiteGraph.debug) == null || _.call(LiteGraph, "triggerSlot", "will call onACTION: " + this.id + ":" + this.order + " :: " + L.name), LiteGraph.refreshAncestorsOnActions && c.refreshAncestors({ action: L.name, param: r, options: a }), LiteGraph.use_deferred_actions && c.onExecute ? ((g = c._waiting_actions) != null || (c._waiting_actions = []), c._waiting_actions.push([L.name, r, a, p.target_slot])) : c.actionDo(L.name, r, a, p.target_slot);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  /**
   * clears the trigger slot animation
   * @method clearTriggeredSlot
   * @param {Number} slot the index of the output slot
   * @param {Number} link_id [optional] in case you want to trigger and specific output link in a slot
   */
  clearTriggeredSlot(t, r) {
    !this.outputs || !this.outputs[t] || !this.outputs[t].links || this.outputs[t].links.forEach((n) => {
      if (r !== null && r !== n)
        return;
      const a = this.graph.links[n];
      a && (a._last_time = 0);
    });
  }
  /**
   * changes node size and triggers callback
   * @method setSize
   * @param {vec2} size
   */
  setSize(t) {
    var r;
    this.size = t, (r = this.onResize) == null || r.call(this, this.size);
  }
  /**
   * add a new property to this node
   * @method addProperty
   * @param {string} name
   * @param {*} default_value
   * @param {string} type string defining the output type ("vec3","number",...)
   * @param {Object} extra_info this can be used to have special properties of the property (like values, etc)
   */
  addProperty(t, r, n, a) {
    var h, l;
    const o = { name: t, type: n, default_value: r, ...a };
    return this.properties_info = (h = this.properties_info) != null ? h : [], this.properties_info.push(o), this.properties = (l = this.properties) != null ? l : {}, this.properties[t] = r, o;
  }
  /**
   * Add a new input or output slot to use in this node.
   * @param {string} name - Name of the slot.
   * @param {string} type - Type of the slot ("vec3", "number", etc). For a generic type, use "0".
   * @param {Object} extra_info - Additional information for the slot (e.g., label, color, position).
   * @param {boolean} isInput - Whether the slot being added is an input slot.
   * @returns {Object} The newly added slot (input or output).
   *
   * @NOTE: These methods are slightly different, and it would be optimal to keep them separate,
   * but our goal here is to refactor them so they *aren't* slightly different.
   */
  addInput(t, r, n) {
    return this.addSlot(t, r, n, !0);
  }
  addOutput(t, r, n) {
    return this.addSlot(t, r, n, !1);
  }
  addSlot(t, r, n, a) {
    var h, l, u, p;
    const o = a ? { name: t, type: r, link: null, ...n } : { name: t, type: r, links: null, ...n };
    return a ? (this.inputs = (h = this.inputs) != null ? h : [], this.inputs.push(o), (l = this.onInputAdded) == null || l.call(this, o), LiteGraph.registerNodeAndSlotType(this, r)) : (this.outputs = (u = this.outputs) != null ? u : [], this.outputs.push(o), (p = this.onOutputAdded) == null || p.call(this, o), LiteGraph.auto_load_slot_types && LiteGraph.registerNodeAndSlotType(this, r, !0)), this.setSize(this.computeSize()), this.setDirtyCanvas(!0, !0), o;
  }
  /**
   * Add multiple input or output slots to use in this node.
   * @param {Array} array - Array of triplets like [[name, type, extra_info], [...]].
   * @param {boolean} isInput - Whether the slots being added are input slots.
   *
   * @NOTE: These methods are slightly different, and it would be optimal to keep them separate,
   * but our goal here is to refactor them so they *aren't* slightly different.
   */
  addInputs(t) {
    this.addSlots(t, !0);
  }
  addOutputs(t) {
    this.addSlots(t, !1);
  }
  addSlots(t, r) {
    var n;
    typeof t == "string" && (t = [t]), t.forEach((a) => {
      var h, l, u, p, c, d;
      const o = r ? {
        name: a[0],
        type: a[1],
        link: null,
        ...(h = a[2]) != null ? h : {}
      } : {
        name: a[0],
        type: a[1],
        links: null,
        ...(l = a[2]) != null ? l : {}
      };
      r ? (this.inputs = (u = this.inputs) != null ? u : [], this.inputs.push(o), (p = this.onInputAdded) == null || p.call(this, o), LiteGraph.registerNodeAndSlotType(this, a[1])) : (this.outputs = (c = this.outputs) != null ? c : [], this.outputs.push(o), (d = this.onOutputAdded) == null || d.call(this, o), LiteGraph.auto_load_slot_types && LiteGraph.registerNodeAndSlotType(this, a[1], !0));
    }), this.setSize(this.computeSize()), (n = this.setDirtyCanvas) == null || n.call(this, !0, !0);
  }
  /**
   * remove an existing input slot
   * @method removeInput
   * @param {number} slot
   *
   * @NOTE: These two are different enough yet I can't even mash them together meaningfully.
   */
  removeInput(t) {
    var n;
    this.disconnectInput(t);
    const r = this.inputs.splice(t, 1)[0];
    this.inputs.slice(t).filter((a) => !!a).forEach((a) => {
      const o = this.graph.links[a.link];
      o != null && o.target_slot && o.target_slot--;
    }), this.setSize(this.computeSize()), (n = this.onInputRemoved) == null || n.call(this, t, r), this.setDirtyCanvas(!0, !0);
  }
  /**
   * remove an existing output slot
   * @method removeOutput
   * @param {number} slot
   */
  removeOutput(t) {
    var r;
    this.disconnectOutput(t), this.outputs = this.outputs.filter((n, a) => a !== t), this.outputs.slice(t).forEach((n) => {
      !n || !n.links || n.links.forEach((a) => {
        const o = this.graph.links[a];
        o && (o.origin_slot -= 1);
      });
    }), this.setSize(this.computeSize()), (r = this.onOutputRemoved) == null || r.call(this, t), this.setDirtyCanvas(!0, !0);
  }
  /**
   * Add a special connection to this node (used for special kinds of graphs)
   * @method addConnection
   * @param {string} name - The name of the connection
   * @param {string} type - String defining the input type ("vec3", "number", etc.)
   * @param {Float32[]} pos - Position of the connection inside the node as an array [x, y]
   * @param {string} direction - Specifies if it is an input or output connection
   */
  addConnection(t, r, n, a) {
    var o = {
      name: t,
      type: r,
      pos: n,
      direction: a,
      links: null
    };
    return this.connections.push(o), o;
  }
  /**
   * computes the minimum size of a node according to its inputs and output slots
   * @method computeSize
   * @param {vec2} minHeight
   * @return {vec2} the total size
   */
  computeSize(t) {
    if (this.constructor.size)
      return this.constructor.size.concat();
    var r = t || new Float32Array([0, 0]), n = LiteGraph.NODE_TEXT_SIZE;
    const a = (f) => f ? n * f.length * 0.6 : 0;
    var o = a(this.title), h = 0, l = 0;
    this.inputs && (h = this.inputs.reduce((f, _) => {
      const g = _.label || _.name || "", L = a(g);
      return Math.max(f, L);
    }, 0)), this.outputs && (l = this.outputs.reduce((f, _) => {
      const g = _.label || _.name || "", L = a(g);
      return Math.max(f, L);
    }, 0)), r[0] = Math.max(h + l + 10, o), r[0] = Math.max(r[0], LiteGraph.NODE_WIDTH), this.widgets && this.widgets.length && (r[0] = Math.max(r[0], LiteGraph.NODE_WIDTH * 1.5));
    const u = Math.max(
      this.inputs ? this.inputs.length : 1,
      this.outputs ? this.outputs.length : 1,
      1
    ) * LiteGraph.NODE_SLOT_HEIGHT;
    r[1] = u + (this.constructor.slot_start_y || 0);
    let p = 0;
    if (this.widgets && this.widgets.length) {
      for (var c = 0, d = this.widgets.length; c < d; ++c)
        this.widgets[c].computeSize ? p += this.widgets[c].computeSize(r[0])[1] + 4 : p += LiteGraph.NODE_WIDGET_HEIGHT + 4;
      p += 8;
    }
    return this.widgets_up ? r[1] = Math.max(r[1], p) : this.widgets_start_y != null ? r[1] = Math.max(r[1], p + this.widgets_start_y) : r[1] += p, this.constructor.min_height && r[1] < this.constructor.min_height && (r[1] = this.constructor.min_height), r[1] += 6, r;
  }
  /**
   * returns all the info available about a property of this node.
   *
   * @method getPropertyInfo
   * @param {String} property name of the property
   * @return {Object} the object with all the available info
  */
  getPropertyInfo(t) {
    var r = null;
    if (this.properties_info) {
      for (var n = 0; n < this.properties_info.length; ++n)
        if (this.properties_info[n].name == t) {
          r = this.properties_info[n];
          break;
        }
    }
    return this.constructor[`@${t}`] && (r = this.constructor[`@${t}`]), this.constructor.widgets_info && this.constructor.widgets_info[t] && (r = this.constructor.widgets_info[t]), !r && this.onGetPropertyInfo && (r = this.onGetPropertyInfo(t)), r || (r = {}), r.type || (r.type = typeof this.properties[t]), r.widget == "combo" && (r.type = "enum"), r;
  }
  /**
   * Defines a widget inside the node, it will be rendered on top of the node, you can control lots of properties
   *
   * @method addWidget
   * @param {String} type the widget type (could be "number","string","combo"
   * @param {String} name the text to show on the widget
   * @param {String} value the default value
   * @param {Function|String} callback function to call when it changes (optionally, it can be the name of the property to modify)
   * @param {Object} options the object that contains special properties of this widget
   * @return {Object} the created widget object
   */
  addWidget(t, r, n, a, o) {
    var l, u, p;
    (l = this.widgets) != null || (this.widgets = []), !o && a && a.constructor === Object && (o = a, a = null), o && o.constructor === String && (o = { property: o }), a && a.constructor === String && (o != null || (o = {}), o.property = a, a = null), a && a.constructor !== Function && ((u = LiteGraph.warn) == null || u.call(LiteGraph, "addWidget: callback must be a function"), a = null);
    var h = {
      type: t.toLowerCase(),
      name: r,
      value: n,
      callback: a,
      options: o || {}
    };
    if (h.options.y !== void 0 && (h.y = h.options.y), !a && !h.options.callback && !h.options.property && ((p = LiteGraph.warn) == null || p.call(LiteGraph, "LiteGraph addWidget(...) without a callback or property assigned")), t == "combo" && !h.options.values)
      throw Error("LiteGraph addWidget('combo',...) requires to pass values in options: { values:['red','blue'] }");
    return this.widgets.push(h), this.setSize(this.computeSize()), h;
  }
  addCustomWidget(t) {
    var r;
    return (r = this.widgets) != null || (this.widgets = []), this.widgets.push(t), t;
  }
  /**
   * Returns the bounding box of the object, used for rendering purposes
   * @method getBounding
   * @param {Float32[]} [out] - [Optional] A place to store the output to reduce garbage
   * @param {boolean} [compute_outer] - [Optional] Set to true to include the shadow and connection points in the bounding calculation
   * @return {Float32[]} The bounding box in the format of [topLeftCornerX, topLeftCornerY, width, height]
   */
  getBounding(t = new Float32Array(4), r) {
    const n = this.pos, a = this.flags.collapsed, o = this.size;
    let h = 0, l = 1, u = 0, p = 0;
    return r && (h = 4, l = 6 + h, u = 4, p = 5 + u), t[0] = n[0] - h, t[1] = n[1] - LiteGraph.NODE_TITLE_HEIGHT - u, t[2] = a ? (this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH) + l : o[0] + l, t[3] = a ? LiteGraph.NODE_TITLE_HEIGHT + p : o[1] + LiteGraph.NODE_TITLE_HEIGHT + p, this.onBounding && this.onBounding(t), t;
  }
  /**
   * checks if a point is inside the shape of a node
   * @method isPointInside
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  isPointInside(t, r, n = 0, a) {
    var o = this.graph && this.graph.isLive() ? 0 : LiteGraph.NODE_TITLE_HEIGHT;
    if (a && (o = 0), this.flags && this.flags.collapsed) {
      if (LiteGraph.isInsideRectangle(
        t,
        r,
        this.pos[0] - n,
        this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT - n,
        (this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH) + 2 * n,
        LiteGraph.NODE_TITLE_HEIGHT + 2 * n
      ))
        return !0;
    } else if (this.pos[0] - 4 - n < t && this.pos[0] + this.size[0] + 4 + n > t && this.pos[1] - o - n < r && this.pos[1] + this.size[1] + n > r)
      return !0;
    return !1;
  }
  /**
   * checks if a point is inside a node slot, and returns info about which slot
   * @method getSlotInPosition
   * @param {number} x
   * @param {number} y
   * @return {Object} if found the object contains { input|output: slot object, slot: number, link_pos: [x,y] }
   */
  getSlotInPosition(t, r) {
    var n = new Float32Array(2);
    if (this.inputs)
      for (let a = 0, o = this.inputs.length; a < o; ++a) {
        let h = this.inputs[a];
        if (this.getConnectionPos(!0, a, n), LiteGraph.isInsideRectangle(
          t,
          r,
          n[0] - 10,
          n[1] - 5,
          20,
          10
        ))
          return { input: h, slot: a, link_pos: n };
      }
    if (this.outputs)
      for (let a = 0, o = this.outputs.length; a < o; ++a) {
        let h = this.outputs[a];
        if (this.getConnectionPos(!1, a, n), LiteGraph.isInsideRectangle(
          t,
          r,
          n[0] - 10,
          n[1] - 5,
          20,
          10
        ))
          return { output: h, slot: a, link_pos: n };
      }
    return null;
  }
  /**
   * returns the input slot with a given name (used for dynamic slots), -1 if not found
   * @method findInputSlot
   * @param {string} name the name of the slot
   * @param {boolean} returnObj if the obj itself wanted
   * @return {number_or_object} the slot (-1 if not found)
   */
  findInputSlot(t, r) {
    if (!this.inputs)
      return -1;
    for (var n = 0, a = this.inputs.length; n < a; ++n)
      if (t == this.inputs[n].name)
        return r ? this.inputs[n] : n;
    return -1;
  }
  /**
   * returns the output slot with a given name (used for dynamic slots), -1 if not found
   * @method findOutputSlot
   * @param {string} name the name of the slot
   * @param {boolean} returnObj if the obj itself wanted
   * @return {number_or_object} the slot (-1 if not found)
   */
  findOutputSlot(t, r = !1) {
    if (!this.outputs)
      return -1;
    for (var n = 0, a = this.outputs.length; n < a; ++n)
      if (t == this.outputs[n].name)
        return r ? this.outputs[n] : n;
    return -1;
  }
  // TODO refactor: USE SINGLE findInput/findOutput functions! :: merge options
  /**
   * returns the first free input slot
   * @method findInputSlotFree
   * @param {object} options
   * @return {number_or_object} the slot (-1 if not found)
   */
  findInputSlotFree(t = {}) {
    var r = {
      returnObj: !1,
      typesNotAccepted: []
    }, n = Object.assign(r, t);
    if (!this.inputs)
      return -1;
    for (var a = 0, o = this.inputs.length; a < o; ++a)
      if (!(this.inputs[a].link && this.inputs[a].link != null) && !(n.typesNotAccepted && n.typesNotAccepted.includes && n.typesNotAccepted.includes(this.inputs[a].type)))
        return n.returnObj ? this.inputs[a] : a;
    return -1;
  }
  /**
   * returns the first output slot free
   * @method findOutputSlotFree
   * @param {object} options
   * @return {number_or_object} the slot (-1 if not found)
   */
  findOutputSlotFree(t = {}) {
    var r = {
      returnObj: !1,
      typesNotAccepted: []
    }, n = Object.assign(r, t);
    if (!this.outputs)
      return -1;
    for (let a = 0, o = this.outputs.length; a < o; ++a)
      if (!(this.outputs[a].links && this.outputs[a].links != null) && !(n.typesNotAccepted && n.typesNotAccepted.includes && n.typesNotAccepted.includes(this.outputs[a].type)))
        return n.returnObj ? this.outputs[a] : a;
    return -1;
  }
  /**
   * findSlotByType for INPUTS
   */
  findInputSlotByType(t, r, n, a) {
    return this.findSlotByType(!0, t, r, n, a);
  }
  /**
   * findSlotByType for OUTPUTS
   */
  findOutputSlotByType(t, r, n, a) {
    return this.findSlotByType(!1, t, r, n, a);
  }
  /**
   * returns the output (or input) slot with a given type, -1 if not found
   * @method findSlotByType
   * @param {boolean} input uise inputs instead of outputs
   * @param {string} type the type of the slot
   * @param {boolean} returnObj if the obj itself wanted
   * @param {boolean} preferFreeSlot if we want a free slot (if not found, will return the first of the type anyway)
   * @return {number_or_object} the slot (-1 if not found)
   */
  findSlotByType(t = !1, r, n = !1, a = !1, o = !1) {
    var h = t ? this.inputs : this.outputs;
    if (!h)
      return -1;
    (r == "" || r == "*") && (r = 0);
    for (let l = 0, u = h.length; l < u; ++l) {
      let p = (r + "").toLowerCase().split(","), c = h[l].type == "0" || h[l].type == "*" ? "0" : h[l].type;
      c = (c + "").toLowerCase().split(",");
      for (let d = 0; d < p.length; d++)
        for (let f = 0; f < c.length; f++)
          if (p[d] == "_event_" && (p[d] = LiteGraph.EVENT), c[d] == "_event_" && (c[d] = LiteGraph.EVENT), p[d] == "*" && (p[d] = 0), c[d] == "*" && (c[d] = 0), p[d] == c[f]) {
            if (a && h[l].links && h[l].links !== null) continue;
            return n ? h[l] : l;
          }
    }
    if (a && !o)
      for (let l = 0, u = h.length; l < u; ++l) {
        let p = (r + "").toLowerCase().split(","), c = h[l].type == "0" || h[l].type == "*" ? "0" : h[l].type;
        c = (c + "").toLowerCase().split(",");
        for (let d = 0; d < p.length; d++)
          for (let f = 0; f < c.length; f++)
            if (p[d] == "*" && (p[d] = 0), c[d] == "*" && (c[d] = 0), p[d] == c[f])
              return n ? h[l] : l;
      }
    return -1;
  }
  /**
   * connect this node output to the input of another node BY TYPE
   * @method connectByType
   * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
   * @param {LGraphNode} node the target node
   * @param {string} target_type the input slot type of the target node
   * @return {Object} the link_info is created, otherwise null
   */
  connectByType(t, r, n = "*", a = {}) {
    var u, p, c, d, f;
    var o = {
      createEventInCase: !0,
      firstFreeIfOutputGeneralInCase: !0,
      generalTypeInCase: !0
    }, h = Object.assign(o, a);
    r && r.constructor === Number && (r = this.graph.getNodeById(r));
    var l = r.findInputSlotByType(n, !1, !0);
    return l >= 0 && l !== null ? ((u = LiteGraph.debug) == null || u.call(LiteGraph, "CONNbyTYPE type " + n + " for " + l), this.connect(t, r, l)) : h.createEventInCase && n == LiteGraph.EVENT ? ((p = LiteGraph.debug) == null || p.call(LiteGraph, "connect WILL CREATE THE onTrigger " + n + " to " + r), this.connect(t, r, -1)) : h.generalTypeInCase && (l = r.findInputSlotByType(0, !1, !0, !0), (c = LiteGraph.debug) == null || c.call(LiteGraph, "connect TO a general type (*, 0), if not found the specific type ", n, " to ", r, "RES_SLOT:", l), l >= 0) ? this.connect(t, r, l) : h.firstFreeIfOutputGeneralInCase && (n == 0 || n == "*" || n == "") && (l = r.findInputSlotFree({ typesNotAccepted: [LiteGraph.EVENT] }), (d = LiteGraph.debug) == null || d.call(LiteGraph, "connect TO TheFirstFREE ", n, " to ", r, "RES_SLOT:", l), l >= 0) ? this.connect(t, r, l) : ((f = LiteGraph.debug) == null || f.call(LiteGraph, "no way to connect type: ", n, " to targetNODE ", r), null);
  }
  /**
   * connect this node input to the output of another node BY TYPE
   * @method connectByType
   * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
   * @param {LGraphNode} node the target node
   * @param {string} target_type the output slot type of the target node
   * @return {Object} the link_info is created, otherwise null
   */
  connectByTypeOutput(t, r, n = "*", a = {}) {
    var u, p, c;
    var o = {
      createEventInCase: !0,
      firstFreeIfInputGeneralInCase: !0,
      generalTypeInCase: !0
    }, h = Object.assign(o, a);
    r && r.constructor === Number && (r = this.graph.getNodeById(r));
    var l = r.findOutputSlotByType(n, !1, !0);
    return l >= 0 && l !== null ? ((u = LiteGraph.debug) == null || u.call(LiteGraph, "CONNbyTYPE OUT! type " + n + " for " + l), r.connect(l, this, t)) : h.generalTypeInCase && (l = r.findOutputSlotByType(0, !1, !0, !0), l >= 0) ? r.connect(l, this, t) : h.createEventInCase && n == LiteGraph.EVENT && LiteGraph.do_add_triggers_slots ? (l = r.addOnExecutedOutput(), r.connect(l, this, t)) : h.firstFreeIfInputGeneralInCase && (n == 0 || n == "*" || n == "" || n == "undefined") && (l = r.findOutputSlotFree({ typesNotAccepted: [LiteGraph.EVENT] }), l >= 0) ? r.connect(l, this, t) : ((p = LiteGraph.debug) == null || p.call(LiteGraph, "no way to connect byOUT type: ", n, " to sourceNODE ", r), (c = LiteGraph.log) == null || c.call(LiteGraph, "type OUT! " + n + " not found or not free?"), null);
  }
  /**
   * connect this node output to the input of another node
   * @method connect
   * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
   * @param {LGraphNode} node the target node
   * @param {number_or_string} target_slot the input slot of the target node (could be the number of the slot or the string with the name of the slot, or -1 to connect a trigger)
   * @return {Object} the link_info is created, otherwise null
   */
  connect(t, r, n = 0) {
    var p, c, d, f, _, g, L, b, m, T, E, k, D, P;
    if (!this.graph)
      return (p = LiteGraph.log) == null || p.call(LiteGraph, "Connect: Error, node doesn't belong to any graph. Nodes must be added first to a graph before connecting them."), null;
    if (t.constructor === String) {
      if (t = this.findOutputSlot(t), t == -1)
        return (c = LiteGraph.log) == null || c.call(LiteGraph, `Connect: Error, no slot of name ${t}`), null;
    } else if (!this.outputs || t >= this.outputs.length)
      return (d = LiteGraph.log) == null || d.call(LiteGraph, "Connect: Error, slot number not found"), null;
    if (r && r.constructor === Number && (r = this.graph.getNodeById(r)), !r)
      throw new Error("target node is null");
    if (r == this)
      return null;
    if (n.constructor === String) {
      if (n = r.findInputSlot(n), n == -1)
        return (f = LiteGraph.log) == null || f.call(LiteGraph, `Connect: Error, no slot of name ${n}`), null;
    } else if (n === LiteGraph.EVENT)
      if (LiteGraph.do_add_triggers_slots)
        r.changeMode(LiteGraph.ON_TRIGGER), n = r.findInputSlot("onTrigger");
      else
        return null;
    else if (!r.inputs || n >= r.inputs.length)
      return (_ = LiteGraph.log) == null || _.call(LiteGraph, "Connect: Error, slot number not found"), null;
    var a = !1, o = r.inputs[n], h = null, l = this.outputs[t];
    if (!this.outputs[t])
      return (g = LiteGraph.log) == null || g.call(LiteGraph, "Invalid slot passed: ", t, this.outputs), null;
    if (r.onBeforeConnectInput && (n = r.onBeforeConnectInput(r)), ((L = this.onConnectOutput) == null ? void 0 : L.call(this, t, o.type, o, r, n)) === !1)
      return null;
    if (n === !1 || n === null || !LiteGraph.isValidConnection(l.type, o.type))
      return this.setDirtyCanvas(!1, !0), a && this.graph.connectionChange(this, h), null;
    if ((b = LiteGraph.debug) == null || b.call(LiteGraph, "DBG targetSlot", n), ((m = r.onConnectInput) == null ? void 0 : m.call(r, n, l.type, l, this, t)) === !1 || ((T = this.onConnectOutput) == null ? void 0 : T.call(this, t, o.type, o, r, n)) === !1)
      return null;
    if (r.inputs[n] && r.inputs[n].link != null && (this.graph.beforeChange(), r.disconnectInput(n, { doProcessChange: !1 }), a = !0), (E = l.links) != null && E.length)
      switch (l.type) {
        case LiteGraph.EVENT:
          LiteGraph.allow_multi_output_for_events || (this.graph.beforeChange(), this.disconnectOutput(t, !1, { doProcessChange: !1 }), a = !0);
          break;
      }
    var u;
    return LiteGraph.use_uuids ? u = LiteGraph.uuidv4() : u = ++this.graph.last_link_id, h = new LiteGraph.LLink(
      u,
      o.type || l.type,
      this.id,
      t,
      r.id,
      n
    ), this.graph.links[h.id] = h, l.links == null && (l.links = []), l.links.push(h.id), typeof r.inputs[n] == "undefined" && ((k = LiteGraph.warn) == null || k.call(LiteGraph, "FIXME error, target_slot does not exists on target_node", r, n)), r.inputs[n].link = h.id, (D = this.onConnectionsChange) == null || D.call(
      this,
      LiteGraph.OUTPUT,
      t,
      !0,
      h,
      l
    ), (P = r.onConnectionsChange) == null || P.call(
      r,
      LiteGraph.INPUT,
      n,
      !0,
      h,
      o
    ), this.graph && this.graph.onNodeConnectionChange && (this.graph.onNodeConnectionChange(
      LiteGraph.INPUT,
      r,
      n,
      this,
      t
    ), this.graph.onNodeConnectionChange(
      LiteGraph.OUTPUT,
      this,
      t,
      r,
      n
    )), this.graph.onGraphChanged({ action: "connect" }), this.setDirtyCanvas(!1, !0), this.graph.afterChange(), this.graph.connectionChange(this, h), h;
  }
  /**
   * disconnect one output to an specific node
   * @method disconnectOutput
   * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
   * @param {LGraphNode} target_node the target node to which this slot is connected [Optional, if not target_node is specified all nodes will be disconnected]
   * @return {boolean} if it was disconnected successfully
   */
  disconnectOutput(t, r, n = {}) {
    var u, p, c, d, f, _;
    var a = { doProcessChange: !0 }, o = Object.assign(a, n);
    if (t.constructor === String) {
      if (t = this.findOutputSlot(t), t == -1)
        return (u = LiteGraph.log) == null || u.call(LiteGraph, `Connect: Error, no slot of name ${t}`), !1;
    } else if (!this.outputs || t >= this.outputs.length)
      return (p = LiteGraph.log) == null || p.call(LiteGraph, "Connect: Error, slot number not found"), !1;
    var h = this.outputs[t];
    if (!h || !h.links || h.links.length == 0)
      return !1;
    if (r) {
      if (r.constructor === Number && (r = this.graph.getNodeById(r)), !r)
        throw new Error("Target Node not found");
      for (let g = 0, L = h.links.length; g < L; g++) {
        let b = h.links[g], m = this.graph.links[b];
        if (m.target_id == r.id) {
          h.links.splice(g, 1);
          var l = r.inputs[m.target_slot];
          l.link = null, delete this.graph.links[b], (c = this.graph) == null || c.onGraphChanged({ action: "disconnectOutput", doSave: o.doProcessChange }), (d = r.onConnectionsChange) == null || d.call(
            r,
            LiteGraph.INPUT,
            m.target_slot,
            !1,
            m,
            l
          ), (f = this.onConnectionsChange) == null || f.call(
            this,
            LiteGraph.OUTPUT,
            t,
            !1,
            m,
            h
          ), this.graph && this.graph.onNodeConnectionChange && (this.graph.onNodeConnectionChange(
            LiteGraph.OUTPUT,
            this,
            t
          ), this.graph.onNodeConnectionChange(
            LiteGraph.OUTPUT,
            this,
            t
          ), this.graph.onNodeConnectionChange(
            LiteGraph.INPUT,
            r,
            m.target_slot
          ));
          break;
        }
      }
    } else {
      for (let g = 0, L = h.links.length; g < L; g++) {
        let b = h.links[g], m = this.graph.links[b];
        m && (r = this.graph.getNodeById(m.target_id), l = null, (_ = this.graph) == null || _.onGraphChanged({ action: "disconnectOutput", doSave: o.doProcessChange }), r && (l = r.inputs[m.target_slot], l.link = null, r.onConnectionsChange && r.onConnectionsChange(
          LiteGraph.INPUT,
          m.target_slot,
          !1,
          m,
          l
        ), this.graph && this.graph.onNodeConnectionChange && this.graph.onNodeConnectionChange(
          LiteGraph.INPUT,
          r,
          m.target_slot
        )), delete this.graph.links[b], this.onConnectionsChange && this.onConnectionsChange(
          LiteGraph.OUTPUT,
          t,
          !1,
          m,
          h
        ), this.graph && this.graph.onNodeConnectionChange && (this.graph.onNodeConnectionChange(
          LiteGraph.OUTPUT,
          this,
          t
        ), this.graph.onNodeConnectionChange(
          LiteGraph.INPUT,
          r,
          m.target_slot
        )));
      }
      h.links = null;
    }
    return this.setDirtyCanvas(!1, !0), this.graph.connectionChange(this), !0;
  }
  /**
   * disconnect one input
   * @method disconnectInput
   * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
   * @return {boolean} if it was disconnected successfully
   */
  disconnectInput(t, r = {}) {
    var f, _, g;
    var n = { doProcessChange: !0 }, a = Object.assign(n, r);
    if (t.constructor === String) {
      if (t = this.findInputSlot(t), t == -1)
        return (f = LiteGraph.log) == null || f.call(LiteGraph, `Connect: Error, no slot of name ${t}`), !1;
    } else if (!this.inputs || t >= this.inputs.length)
      return (_ = LiteGraph.log) == null || _.call(LiteGraph, "Connect: Error, slot number not found"), !1;
    var o = this.inputs[t];
    if (!o)
      return !1;
    var h = this.inputs[t].link;
    if (h != null) {
      this.inputs[t].link = null;
      var l = this.graph.links[h];
      if (l) {
        var u = this.graph.getNodeById(l.origin_id);
        if (!u)
          return !1;
        var p = u.outputs[l.origin_slot];
        if (!p || !p.links || p.links.length == 0)
          return !1;
        for (var c = 0, d = p.links.length; c < d; c++)
          if (p.links[c] == h) {
            p.links.splice(c, 1);
            break;
          }
        delete this.graph.links[h], (g = this.graph) == null || g.onGraphChanged({ action: "disconnectInput", doSave: a.doProcessChange }), this.onConnectionsChange && this.onConnectionsChange(
          LiteGraph.INPUT,
          t,
          !1,
          l,
          o
        ), u.onConnectionsChange && u.onConnectionsChange(
          LiteGraph.OUTPUT,
          c,
          !1,
          l,
          p
        ), this.graph && this.graph.onNodeConnectionChange && (this.graph.onNodeConnectionChange(
          LiteGraph.OUTPUT,
          u,
          c
        ), this.graph.onNodeConnectionChange(LiteGraph.INPUT, this, t));
      }
    }
    return this.setDirtyCanvas(!1, !0), this.graph && this.graph.connectionChange(this), !0;
  }
  /**
   * Returns the center of a connection point in canvas coordinates
   * @method getConnectionPos
   * @param {boolean} is_input - True if it is an input slot, false if it is an output slot
   * @param {number | string} slot - Could be the number of the slot or the string with the name of the slot
   * @param {vec2} [out] - [Optional] A place to store the output to reduce garbage
   * @return {Float32[]} The position as [x, y]
   */
  getConnectionPos(t, r, n = new Float32Array(2)) {
    var a = 0;
    t && this.inputs && (a = this.inputs.length), !t && this.outputs && (a = this.outputs.length);
    var o = LiteGraph.NODE_SLOT_HEIGHT * 0.5;
    if (this.flags.collapsed) {
      var h = this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH;
      return this.horizontal ? (n[0] = this.pos[0] + h * 0.5, t ? n[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT : n[1] = this.pos[1]) : (t ? n[0] = this.pos[0] : n[0] = this.pos[0] + h, n[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT * 0.5), n;
    }
    return t && r == -1 ? (n[0] = this.pos[0] + LiteGraph.NODE_TITLE_HEIGHT * 0.5, n[1] = this.pos[1] + LiteGraph.NODE_TITLE_HEIGHT * 0.5, n) : t && a > r && this.inputs[r].pos ? (n[0] = this.pos[0] + this.inputs[r].pos[0], n[1] = this.pos[1] + this.inputs[r].pos[1], n) : !t && a > r && this.outputs[r].pos ? (n[0] = this.pos[0] + this.outputs[r].pos[0], n[1] = this.pos[1] + this.outputs[r].pos[1], n) : this.horizontal ? (n[0] = this.pos[0] + (r + 0.5) * (this.size[0] / a), t ? n[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT : n[1] = this.pos[1] + this.size[1], n) : (t ? n[0] = this.pos[0] + o : n[0] = this.pos[0] + this.size[0] + 1 - o, n[1] = this.pos[1] + (r + 0.7) * LiteGraph.NODE_SLOT_HEIGHT + (this.constructor.slot_start_y || 0), n);
  }
  /* Force align to grid */
  alignToGrid() {
    this.pos[0] = LiteGraph.CANVAS_GRID_SIZE * Math.round(this.pos[0] / LiteGraph.CANVAS_GRID_SIZE), this.pos[1] = LiteGraph.CANVAS_GRID_SIZE * Math.round(this.pos[1] / LiteGraph.CANVAS_GRID_SIZE);
  }
  /* Console output */
  trace(t) {
    var r, n, a, o;
    this.console || (this.console = []), (n = (r = this.console).push) == null || n.call(r, t), this.console.length > LGraphNode.MAX_CONSOLE && ((o = (a = this.console).shift) == null || o.call(a)), this.graph.onNodeTrace && this.graph.onNodeTrace(this, t);
  }
  /* Forces to redraw or the main canvas (LGraphNode) or the bg canvas (links) */
  setDirtyCanvas(t, r) {
    this.graph && this.graph.sendActionToCanvas("setDirty", [
      t,
      r
    ]);
  }
  loadImage(t) {
    var r = new Image();
    r.src = LiteGraph.node_images_path + t, r.ready = !1;
    var n = this;
    return r.onload = function() {
      this.ready = !0, n.setDirtyCanvas(!0);
    }, r;
  }
  // safe LGraphNode action execution (not sure if safe)
  /*
      LGraphNode.prototype.executeAction = function(action)
      {
      if(action == "") return false;
  
      if( action.indexOf(";") != -1 || action.indexOf("}") != -1)
      {
          this.trace("Error: Action contains unsafe characters");
          return false;
      }
  
      var tokens = action.split("(");
      var func_name = tokens[0];
      if( typeof(this[func_name]) != "function")
      {
          this.trace("Error: Action not found on node: " + func_name);
          return false;
      }
  
      var code = action;
  
      try
      {
          var _foo = eval;
          eval = null;
          (new Function("with(this) { " + code + "}")).call(this);
          eval = _foo;
      }
      catch (err)
      {
          this.trace("Error executing action {" + action + "} :" + err);
          return false;
      }
  
      return true;
      }
      */
  /* Allows to get onMouseMove and onMouseUp events even if the mouse is out of focus */
  captureInput(t) {
    if (!(!this.graph || !this.graph.list_of_graphcanvas))
      for (var r = this.graph.list_of_graphcanvas, n = 0; n < r.length; ++n) {
        var a = r[n];
        !t && a.node_capturing_input != this || (a.node_capturing_input = t ? this : null);
      }
  }
  /**
   * Collapse the node to make it smaller on the canvas
   * @method collapse
   **/
  collapse(t) {
    this.graph.onGraphChanged({ action: "collapse" }), !(this.constructor.collapsable === !1 && !t) && (this.flags.collapsed ? this.flags.collapsed = !1 : this.flags.collapsed = !0, this.setDirtyCanvas(!0, !0));
  }
  /**
   * Forces the node to do not move or realign on Z
   * @method pin
   **/
  pin(t) {
    this.graph.onGraphChanged({ action: "pin" }), t === void 0 ? this.flags.pinned = !this.flags.pinned : this.flags.pinned = t;
  }
  localToScreen(t, r, n) {
    return [
      (t + this.pos[0]) * n.scale + n.offset[0],
      (r + this.pos[1]) * n.scale + n.offset[1]
    ];
  }
  refreshAncestors(t = {}) {
    var r = {
      action: "",
      param: null,
      options: null,
      passParam: !0
    }, n = Object.assign(r, t);
    if (this.inputs && !(LiteGraph.preventAncestorRecalculation && this.graph.node_ancestorsCalculated && this.graph.node_ancestorsCalculated[this.id])) {
      (!n.action || n.action == "") && (n.action = this.id + "_ancestors"), (!n.param || n.param == "") && (n.param = this.id + "_ancestors"), n.options || (n.options = {}), n.options = Object.assign({ action_call: n.action }, n.options), this.graph.ancestorsCall = !0;
      var a = {
        modesSkip: [LiteGraph.NEVER, LiteGraph.ON_EVENT, LiteGraph.ON_TRIGGER],
        modesOnly: [LiteGraph.ALWAYS, LiteGraph.ON_REQUEST],
        typesSkip: [LiteGraph.ACTION],
        typesOnly: []
      }, o = this.graph.getAncestors(this, a);
      for (iN in o)
        o[iN].doExecute(n.param, n.options), this.graph.node_ancestorsCalculated[o[iN].id] = !0;
      return this.graph.ancestorsCall = !1, this.graph.node_ancestorsCalculated[this.id] = !0, !0;
    }
  }
}
class LGraphGroup {
  /**
   * Constructor for the LGraphGroup class.
   * @param {string} [title="Group"] - The title of the group.
   */
  constructor(t = "Group") {
    M(this, "isPointInside", LiteGraph.LGraphNode.prototype.isPointInside);
    M(this, "setDirtyCanvas", LiteGraph.LGraphNode.prototype.setDirtyCanvas);
    var r, n;
    this.title = t, this.font_size = 24, this.color = (n = (r = LiteGraph.LGraphCanvas.node_colors.pale_blue) == null ? void 0 : r.groupcolor) != null ? n : "#AAA", this._bounding = new Float32Array([10, 10, 140, 80]), this._pos = this._bounding.subarray(0, 2), this._size = this._bounding.subarray(2, 4), this._nodes = [], this.graph = null;
  }
  set pos(t) {
    !t || t.length < 2 || (this._pos[0] = t[0], this._pos[1] = t[1]);
  }
  get pos() {
    return this._pos;
  }
  set size(t) {
    !t || t.length < 2 || (this._size[0] = Math.max(140, t[0]), this._size[1] = Math.max(80, t[1]));
  }
  get size() {
    return this._size;
  }
  /**
   * Updates the properties of the LGraphGroup instance based on the provided configuration object.
   * @param {Object} o - The configuration object with properties to update.
   * @param {string} o.title - The new title for the group.
   * @param {Float32Array} o.bounding - The new bounding box for the group.
   * @param {string} o.color - The new color for the group.
   * @param {number} o.font_size - The new font size for the group.
   */
  configure(t) {
    this.title = t.title, this._bounding.set(t.bounding), this.color = t.color, t.font_size && (this.font_size = t.font_size);
  }
  /**
   * Serializes the LGraphGroup instance into a plain JavaScript object.
   * @returns {Object} - The serialized representation of the LGraphGroup instance.
   * - title: string - The title of the group.
   * - bounding: Array<number> - The bounding box coordinates [x, y, width, height].
   * - color: string - The color of the group.
   * - font_size: number - The font size of the group.
   */
  serialize() {
    var t = this._bounding;
    return {
      title: this.title,
      bounding: t.map((r) => Math.round(r)),
      color: this.color,
      font_size: this.font_size
    };
  }
  /**
   * Moves the LGraphGroup instance by the specified deltas and optionally updates the positions of contained nodes.
   * @param {number} deltax - The amount to move the group along the x-axis.
   * @param {number} deltay - The amount to move the group along the y-axis.
   * @param {boolean} ignore_nodes - Flag to indicate whether to move contained nodes along with the group.
   */
  move(t, r, n) {
    var a, o;
    isNaN(t) && ((a = console.error) == null || a.call(console, "LGraphGroup.move() deltax NaN")), isNaN(r) && ((o = console.error) == null || o.call(console, "LGraphGroup.move() deltay NaN")), this._pos[0] += t, this._pos[1] += r, !n && this._nodes.forEach((h) => {
      h.pos[0] += t, h.pos[1] += r;
    });
  }
  /**
   * Recomputes and updates the list of nodes inside the LGraphGroup based on their bounding boxes.
   * This method checks for nodes that overlap with the group's bounding box and updates the internal nodes list accordingly.
   */
  recomputeInsideNodes() {
    this._nodes.length = 0;
    var t = this.graph._nodes, r = new Float32Array(4);
    this._nodes = t.filter((n) => (n.getBounding(r), LiteGraph.overlapBounding(this._bounding, r)));
  }
}
const _LGraphCanvas = class _LGraphCanvas {
  constructor(s, t, r) {
    /**
     * Called when a mouse wheel event has to be processed
     * @method processMouseWheel
     **/
    M(this, "processMouseWheel", (s) => {
      if (!(!this.graph || !this.allow_dragcanvas)) {
        var t = s.wheelDeltaY != null ? s.wheelDeltaY : s.detail * -60;
        this.adjustMouseEvent(s);
        var r = s.clientX, n = s.clientY, a = !this.viewport || this.viewport && r >= this.viewport[0] && r < this.viewport[0] + this.viewport[2] && n >= this.viewport[1] && n < this.viewport[1] + this.viewport[3];
        if (a) {
          var o = this.ds.scale;
          return o *= Math.pow(1.1, t * 0.01), this.ds.changeScale(o, [s.clientX, s.clientY]), this.graph.change(), s.preventDefault(), !1;
        }
      }
    });
    /**
     * process a key event
     * @method processKey
     **/
    M(this, "processKey", (s) => {
      var r, n, a, o, h;
      if (this.graph) {
        var t = !1;
        if (s.target.localName != "input") {
          if (s.type == "keydown") {
            if (s.keyCode == 32 && (this.dragging_canvas = !0, t = !0), s.keyCode == 27 && (this.node_panel && this.node_panel.close(), this.options_panel && this.options_panel.close(), t = !0), s.keyCode == 65 && s.ctrlKey && (this.selectNodes(), t = !0), s.keyCode === 67 && (s.metaKey || s.ctrlKey) && !s.shiftKey && this.selected_nodes && (this.copyToClipboard(), t = !0), s.keyCode === 86 && (s.metaKey || s.ctrlKey) && this.pasteFromClipboard(s.shiftKey), (s.keyCode == 46 || LiteGraph.backspace_delete && s.keyCode == 8) && s.target.localName != "input" && s.target.localName != "textarea" && (this.deleteSelectedNodes(), t = !0), LiteGraph.actionHistory_enabled && (s.keyCode == 89 && s.ctrlKey || s.keyCode == 90 && s.ctrlKey && s.shiftKey ? this.graph.actionHistoryForward() : s.keyCode == 90 && s.ctrlKey && this.graph.actionHistoryBack()), (r = LiteGraph.debug) == null || r.call(LiteGraph, "Canvas keydown " + s.keyCode), this.selected_nodes)
              for (let l in this.selected_nodes)
                (a = (n = this.selected_nodes[l]).onKeyDown) == null || a.call(n, s);
          } else if (s.type == "keyup" && (s.keyCode == 32 && (this.dragging_canvas = !1), this.selected_nodes))
            for (let l in this.selected_nodes)
              (h = (o = this.selected_nodes[l]).onKeyUp) == null || h.call(o, s);
          if (this.graph.change(), t)
            return s.preventDefault(), s.stopImmediatePropagation(), !1;
        }
      }
    });
    /**
     * process a item drop event on top the canvas
     * @method processDrop
     **/
    M(this, "processDrop", (s) => {
      s.preventDefault(), this.adjustMouseEvent(s);
      var t = s.clientX, r = s.clientY, n = !this.viewport || this.viewport && t >= this.viewport[0] && t < this.viewport[0] + this.viewport[2] && r >= this.viewport[1] && r < this.viewport[1] + this.viewport[3];
      if (n) {
        t = s.localX, r = s.localY;
        var n = !this.viewport || this.viewport && t >= this.viewport[0] && t < this.viewport[0] + this.viewport[2] && r >= this.viewport[1] && r < this.viewport[1] + this.viewport[3];
        if (n) {
          var a = [s.canvasX, s.canvasY], o = this.graph ? this.graph.getNodeOnPos(a[0], a[1]) : null;
          if (!o) {
            var h = null;
            this.onDropItem && (h = this.onDropItem(event)), h || this.checkDropItem(s);
            return;
          }
          if (o.onDropFile || o.onDropData) {
            var l = s.dataTransfer.files;
            if (l && l.length)
              for (let f = 0; f < l.length; f++) {
                var u = s.dataTransfer.files[0], p = u.name;
                if (o.onDropFile && o.onDropFile(u), o.onDropData) {
                  var c = new FileReader();
                  c.onload = function(_) {
                    var g = _.target.result;
                    o.onDropData(g, p, u);
                  };
                  var d = u.type.split("/")[0];
                  d == "text" || d == "" ? c.readAsText(u) : d == "image" ? c.readAsDataURL(u) : c.readAsArrayBuffer(u);
                }
              }
          }
          return o.onDropItem && o.onDropItem(event) ? !0 : this.onDropItem ? this.onDropItem(event) : !1;
        }
      }
    });
    r != null || (r = {
      skip_render: !1,
      autoresize: !1,
      clip_all_nodes: !1
    }), this.options = r, this.background_image = _LGraphCanvas.DEFAULT_BACKGROUND_IMAGE, s && s.constructor === String && (s = document.querySelector(s)), this.ds = new LiteGraph.DragAndScale(), this.zoom_modify_alpha = !0, this.title_text_font = `${LiteGraph.NODE_TEXT_SIZE}px Arial`, this.inner_text_font = `normal ${LiteGraph.NODE_SUBTEXT_SIZE}px Arial`, this.node_title_color = LiteGraph.NODE_TITLE_COLOR, this.default_link_color = LiteGraph.LINK_COLOR, this.default_connection_color = {
      input_off: "#778",
      input_on: "#7F7",
      // "#BBD"
      output_off: "#778",
      output_on: "#7F7"
      // "#BBD"
    }, this.default_connection_color_byType = {}, this.default_connection_color_byTypeOff = {}, this.drag_mode = !1, this.dragging_rectangle = null, this.filter = null, this.highquality_render = !0, this.use_gradients = !1, this.editor_alpha = 1, this.pause_rendering = !1, this.clear_background = !0, this.clear_background_color = "#222", this.read_only = !1, this.live_mode = !1, this.show_info = !0, this.allow_dragcanvas = !0, this.allow_dragnodes = !0, this.allow_interaction = !0, this.multi_select = !1, this.allow_searchbox = !0, this.move_destination_link_without_shift = !1, this.align_to_grid = !1, this.drag_mode = !1, this.dragging_rectangle = null, this.filter = null, this.set_canvas_dirty_on_mouse_event = !0, this.always_render_background = !1, this.render_shadows = !0, this.render_canvas_border = !0, this.render_connections_shadows = !1, this.render_connections_border = !0, this.render_curved_connections = !0, this.render_connection_arrows = !1, this.render_collapsed_slots = !0, this.render_execution_order = !1, this.render_title_colored = !0, this.render_link_tooltip = !0, this.free_resize = !0, this.links_render_mode = LiteGraph.SPLINE_LINK, this.autoresize = r.autoresize, this.skip_render = r.skip_render, this.clip_all_nodes = r.clip_all_nodes, this.free_resize = r.free_resize, this.mouse = [0, 0], this.graph_mouse = [0, 0], this.canvas_mouse = this.graph_mouse, this.onSearchBox = null, this.onSearchBoxSelection = null, this.onMouse = null, this.onDrawBackground = null, this.onDrawForeground = null, this.onDrawOverlay = null, this.onDrawLinkTooltip = null, this.onNodeMoved = null, this.onSelectionChange = null, this.onConnectingChange = null, this.onBeforeChange = null, this.onAfterChange = null, this.connections_width = 3, this.round_radius = 8, this.current_node = null, this.node_widget = null, this.over_link_center = null, this.last_mouse_position = [0, 0], this.visible_area = this.ds.visible_area, this.visible_links = [], this.viewport = r.viewport || null, this.low_quality_rendering_threshold = 5, t == null || t.attachCanvas(this), this.setCanvas(s, r.skip_events), this.clear(), !this.skip_render && !r.skip_render && this.startRendering();
  }
  /**
   * clears all the data inside
   *
   * @method clear
   */
  clear() {
    var s;
    this.frame = 0, this.last_draw_time = 0, this.render_time = 0, this.fps = 0, this.low_quality_rendering_counter = 0, this.dragging_rectangle = null, this.selected_nodes = {}, this.selected_group = null, this.visible_nodes = [], this.node_dragged = null, this.node_over = null, this.node_capturing_input = null, this.connecting_node = null, this.highlighted_links = {}, this.dragging_canvas = !1, this.dirty_canvas = !0, this.dirty_bgcanvas = !0, this.dirty_area = null, this.node_in_panel = null, this.node_widget = null, this.last_mouse = [0, 0], this.last_mouseclick = 0, this.pointer_is_down = !1, this.pointer_is_double = !1, this.visible_area.set([0, 0, 0, 0]), (s = this.onClear) == null || s.call(this);
  }
  /**
   * assigns a graph, you can reassign graphs to the same canvas
   *
   * @method setGraph
   * @param {LGraph} graph
   */
  setGraph(s, t) {
    var r;
    if (this.graph != s) {
      if (t || this.clear(), !s) {
        (r = this.graph) == null || r.detachCanvas(this);
        return;
      }
      s.attachCanvas(this), this._graph_stack && (this._graph_stack = null), this.setDirty(!0, !0);
    }
  }
  /**
   * returns the top level graph (in case there are subgraphs open on the canvas)
   *
   * @method getTopGraph
   * @return {LGraph} graph
   */
  getTopGraph() {
    return this._graph_stack.length ? this._graph_stack[0] : this.graph;
  }
  /**
   * opens a graph contained inside a node in the current graph
   *
   * @method openSubgraph
   * @param {LGraph} graph
   */
  openSubgraph(s) {
    if (!s)
      throw new Error("graph cannot be null");
    if (this.graph == s)
      throw new Error("graph cannot be the same");
    this.clear(), this.graph && (this._graph_stack || (this._graph_stack = []), this._graph_stack.push(this.graph)), s.attachCanvas(this), this.checkPanels(), this.setDirty(!0, !0);
  }
  /**
   * closes a subgraph contained inside a node
   *
   * @method closeSubgraph
   * @param {LGraph} assigns a graph
   */
  closeSubgraph() {
    if (!(!this._graph_stack || this._graph_stack.length == 0)) {
      var s = this.graph._subgraph_node, t = this._graph_stack.pop();
      this.selected_nodes = {}, this.highlighted_links = {}, t.attachCanvas(this), this.setDirty(!0, !0), s && (this.centerOnNode(s), this.selectNodes([s])), this.ds.offset = [0, 0], this.ds.scale = 1;
    }
  }
  /**
   * returns the visually active graph (in case there are more in the stack)
   * @method getCurrentGraph
   * @return {LGraph} the active graph
   */
  getCurrentGraph() {
    return this.graph;
  }
  /**
   * assigns a canvas
   *
   * @method setCanvas
   * @param {Canvas} assigns a canvas (also accepts the ID of the element (not a selector)
   */
  setCanvas(s, t) {
    var n;
    if (s && s.constructor === String && (s = document.getElementById(s), !s))
      throw new Error("Error creating LiteGraph canvas: Canvas not found");
    if (s !== this.canvas && (!s && this.canvas && (t || this.unbindEvents()), this.canvas = s, this.ds.element = s, !!s)) {
      if (s.className += " lgraphcanvas", s.data = this, s.tabindex = "1", this.bgcanvas = document.createElement("canvas"), this.bgcanvas.width = this.canvas.width, this.bgcanvas.height = this.canvas.height, s.getContext == null)
        throw s.localName != "canvas" ? new Error("Element supplied for LGraphCanvas must be a <canvas> element, you passed a " + s.localName) : new Error("This browser doesn't support Canvas");
      var r = this.ctx = s.getContext("2d");
      r == null && (s.webgl_enabled || (n = LiteGraph.info) == null || n.call(LiteGraph, "This canvas seems to be WebGL, enabling WebGL renderer"), this.enableWebGL()), t || this.bindEvents();
    }
  }
  // used in some events to capture them
  _doNothing(s) {
    return s.preventDefault(), !1;
  }
  _doReturnTrue(s) {
    return s.preventDefault(), !0;
  }
  /**
   * binds mouse, keyboard, touch and drag events to the canvas
   * @method bindEvents
   **/
  bindEvents() {
    var n;
    if (this._events_binded) {
      (n = LiteGraph.warn) == null || n.call(LiteGraph, "LGraphCanvas: events already binded");
      return;
    }
    this._events_binded = !0;
    var s = this.canvas, t = this.getCanvasWindow(), r = t.document;
    this._mousedown_callback = this.processMouseDown.bind(this), this._mousemove_callback = this.processMouseMove.bind(this), this._mouseup_callback = this.processMouseUp.bind(this), s.addEventListener("pointerdown", this._mousedown_callback, !0), s.addEventListener("pointermove", this._mousemove_callback), s.addEventListener("pointerup", this._mouseup_callback, !0), s.addEventListener("contextmenu", this._doNothing), s.addEventListener("wheel", this.processMouseWheel), s.addEventListener("keydown", this.processKey), r.addEventListener("keyup", this.processKey), s.addEventListener("dragover", this._doNothing, !1), s.addEventListener("dragend", this._doNothing, !1), s.addEventListener("drop", this.processDrop), s.addEventListener("dragenter", this._doReturnTrue, !1);
  }
  /**
   * unbinds mouse events from the canvas
   * @method unbindEvents
   **/
  unbindEvents() {
    var n;
    if (!this._events_binded) {
      (n = LiteGraph.warn) == null || n.call(LiteGraph, "LGraphCanvas: no events binded");
      return;
    }
    this._events_binded = !1;
    var s = this.canvas, t = this.getCanvasWindow(), r = t.document;
    s.removeEventListener("pointerdown", this._mousedown_callback), s.removeEventListener("pointermove", this._mousemove_callback), s.removeEventListener("pointerup", this._mouseup_callback), s.removeEventListener("contextmenu", this._doNothing), s.removeEventListener("wheel", this.processMouseWheel), s.removeEventListener("keydown", this.processKey), r.removeEventListener("keyup", this.processKey), s.removeEventListener("dragover", this._doNothing, !1), s.removeEventListener("dragend", this._doNothing, !1), s.removeEventListener("drop", this.processDrop), s.removeEventListener("dragenter", this._doReturnTrue), this._mousedown_callback = null;
  }
  static getFileExtension(s) {
    const r = new URL(s).pathname, n = r.lastIndexOf(".");
    return n === -1 ? "" : r.slice(n + 1).toLowerCase();
  }
  /**
   * this function allows to render the canvas using WebGL instead of Canvas2D
   * this is useful if you plant to render 3D objects inside your nodes, it uses litegl.js for webgl and canvas2DtoWebGL to emulate the Canvas2D calls in webGL
   * @method enableWebGL
   **/
  enableWebGL() {
    if (typeof GL == "undefined")
      throw new Error("litegl.js must be included to use a WebGL canvas");
    if (typeof enableWebGLCanvas == "undefined")
      throw new Error("webglCanvas.js must be included to use this feature");
    this.gl = this.ctx = enableWebGLCanvas(this.canvas), this.ctx.webgl = !0, this.bgcanvas = this.canvas, this.bgctx = this.gl, this.canvas.webgl_enabled = !0;
  }
  /**
   * marks as dirty the canvas, this way it will be rendered again
   *
   * @class LGraphCanvas
   * @method setDirty
   * @param {bool} fgcanvas if the foreground canvas is dirty (the one containing the nodes)
   * @param {bool} bgcanvas if the background canvas is dirty (the one containing the wires)
   */
  setDirty(s, t) {
    s && (this.dirty_canvas = !0), t && (this.dirty_bgcanvas = !0);
  }
  /**
   * Used to attach the canvas in a popup
   *
   * @method getCanvasWindow
   * @return {window} returns the window where the canvas is attached (the DOM root node)
   */
  getCanvasWindow() {
    var t;
    if (!this.canvas)
      return window;
    var s = this.canvas.ownerDocument;
    return (t = s.defaultView) != null ? t : s.parentWindow;
  }
  /**
   * starts rendering the content of the canvas when needed
   *
   * @method startRendering
   */
  startRendering() {
    if (this.is_rendering)
      return;
    this.is_rendering = !0, s.call(this);
    function s() {
      this.pause_rendering || this.draw();
      var t = this.getCanvasWindow();
      this.is_rendering && t.requestAnimationFrame(s.bind(this));
    }
  }
  /**
   * stops rendering the content of the canvas (to save resources)
   *
   * @method stopRendering
   */
  stopRendering() {
    this.is_rendering = !1;
  }
  /* LiteGraphCanvas input */
  // used to block future mouse events (because of im gui)
  blockClick() {
    this.block_click = !0, this.last_mouseclick = 0;
  }
  processUserInputDown(s) {
    var t, r;
    if (this.pointer_is_down && s.isPrimary !== void 0 && !s.isPrimary ? this.userInput_isNotPrimary = !0 : this.userInput_isNotPrimary = !1, this.userInput_type = s.pointerType ? s.pointerType : !1, this.userInput_id = s.pointerId ? s.pointerId : !1, s.pointerType)
      switch (s.pointerType) {
        case "mouse":
          break;
        case "pen":
          break;
        case "touch":
          break;
        default:
          (t = LiteGraph.log) == null || t.call(LiteGraph, "pointerType unknown " + ev.pointerType);
      }
    if (s.button !== void 0)
      switch (this.userInput_button = s.button, s.button) {
      }
    return s.buttons !== void 0 && (this.userInput_button_s = s.buttons), this.userInput_touches = s.changedTouches !== void 0 && s.changedTouches.length !== void 0 ? s.changedTouches : !1, this.userInput_touches && this.userInput_touches.length && ((r = LiteGraph.debug) == null || r.call(LiteGraph, "check multiTouches", s.changedTouches)), this.processMouseDown(s);
  }
  processMouseDown(s) {
    var K, q, $, B, z, F, R, j, Q;
    if (this.set_canvas_dirty_on_mouse_event && (this.dirty_canvas = !0), !!this.graph) {
      this.adjustMouseEvent(s);
      var t = this.getCanvasWindow();
      _LGraphCanvas.active_canvas = this;
      var r = s.clientX, n = s.clientY;
      (K = LiteGraph.log) == null || K.call(LiteGraph, "pointerevents: processMouseDown pointerId:" + s.pointerId + " which:" + s.which + " isPrimary:" + s.isPrimary + " :: x y " + r + " " + n, "previousClick", this.last_mouseclick, "diffTimeClick", this.last_mouseclick ? LiteGraph.getTime() - this.last_mouseclick : "notlast"), this.ds.viewport = this.viewport;
      var a = !this.viewport || this.viewport && r >= this.viewport[0] && r < this.viewport[0] + this.viewport[2] && n >= this.viewport[1] && n < this.viewport[1] + this.viewport[3];
      if (this.options.skip_events || (this.canvas.removeEventListener("pointermove", this._mousemove_callback), t.document.addEventListener("pointermove", this._mousemove_callback, !0), t.document.addEventListener("pointerup", this._mouseup_callback, !0)), !!a) {
        var o = this.graph.getNodeOnPos(s.canvasX, s.canvasY, this.visible_nodes, 5), h = !1, l = LiteGraph.getTime(), u = s.isPrimary === void 0 || s.isPrimary, p = l - this.last_mouseclick < 300 && u;
        if (this.mouse[0] = s.clientX, this.mouse[1] = s.clientY, this.graph_mouse[0] = s.canvasX, this.graph_mouse[1] = s.canvasY, this.last_click_position = [this.mouse[0], this.mouse[1]], this.pointer_is_down && u ? this.pointer_is_double = !0 : this.pointer_is_double = !1, this.pointer_is_down = !0, this.canvas.focus(), LiteGraph.ContextMenu.closeAll(t), !((q = this.onMouse) != null && q.call(this, s))) {
          if (s.which == 1 && !this.userInput_isNotPrimary) {
            if (s.ctrlKey && (this.dragging_rectangle = new Float32Array(4), this.dragging_rectangle[0] = s.canvasX, this.dragging_rectangle[1] = s.canvasY, this.dragging_rectangle[2] = 1, this.dragging_rectangle[3] = 1, h = !0), LiteGraph.alt_drag_do_clone_nodes && s.altKey && o && this.allow_interaction && !h && !this.read_only) {
              let I = o, U = o.clone();
              if (U) {
                if (U.pos[0] += 5, U.pos[1] += 5, this.graph.add(U, !1, { doCalcSize: !1 }), o = U, LiteGraph.alt_shift_drag_connect_clone_with_input && s.shiftKey && I.inputs && I.inputs.length)
                  for (var c = 0; c < I.inputs.length; ++c) {
                    var d = I.inputs[c];
                    if (!(!d || d.link == null)) {
                      var f = this.graph.links[d.link];
                      if (f && f.type !== LiteGraph.EVENT) {
                        var _;
                        f.origin_id && (_ = this.graph.getNodeById(f.origin_id));
                        var g = o;
                        _ && g && _.connect(f.origin_slot, g, f.target_slot);
                      }
                    }
                  }
                h = !0, m || (this.allow_dragnodes && (this.graph.beforeChange(), this.node_dragged = o), this.selected_nodes[o.id] || this.processNodeSelected(o, s));
              }
            }
            var L = !1;
            if (o && (this.allow_interaction || o.flags.allow_interaction) && !h && !this.read_only) {
              if (!this.live_mode && !o.flags.pinned && this.bringToFront(o), this.allow_interaction && !this.connecting_node && !o.flags.collapsed && !this.live_mode)
                if (!h && o.resizable !== !1 && LiteGraph.isInsideRectangle(
                  s.canvasX,
                  s.canvasY,
                  o.pos[0] + o.size[0] - 5,
                  o.pos[1] + o.size[1] - 5,
                  10,
                  10
                ))
                  this.graph.beforeChange(), this.resizing_node = o, this.canvas.style.cursor = "se-resize", h = !0;
                else {
                  if (o.outputs)
                    for (let I = 0, U = o.outputs.length; I < U; ++I) {
                      let Y = o.outputs[I], H = o.getConnectionPos(!1, I);
                      if (LiteGraph.isInsideRectangle(
                        s.canvasX,
                        s.canvasY,
                        H[0] - 15,
                        H[1] - 10,
                        30,
                        20
                      )) {
                        this.connecting_node = o, this.connecting_output = Y, this.connecting_output.slot_index = I, this.connecting_pos = o.getConnectionPos(!1, I), this.connecting_slot = I, LiteGraph.shift_click_do_break_link_from && s.shiftKey && o.disconnectOutput(I), p ? ($ = o.onOutputDblClick) == null || $.call(o, I, s) : (B = o.onOutputClick) == null || B.call(o, I, s), h = !0;
                        break;
                      }
                    }
                  if (o.inputs)
                    for (let I = 0, U = o.inputs.length; I < U; ++I) {
                      let Y = o.inputs[I], H = o.getConnectionPos(!0, I);
                      if (LiteGraph.isInsideRectangle(
                        s.canvasX,
                        s.canvasY,
                        H[0] - 15,
                        H[1] - 10,
                        30,
                        20
                      )) {
                        if (p ? (z = o.onInputDblClick) == null || z.call(o, I, s) : (F = o.onInputClick) == null || F.call(o, I, s), Y.link !== null) {
                          var b = this.graph.links[Y.link];
                          LiteGraph.click_do_break_link_to && (o.disconnectInput(I), this.dirty_bgcanvas = !0, h = !0), // this.allow_reconnect_links ||
                          // this.move_destination_link_without_shift ||
                          s.shiftKey && (LiteGraph.click_do_break_link_to || o.disconnectInput(I), this.connecting_node = this.graph._nodes_by_id[b.origin_id], this.connecting_slot = b.origin_slot, this.connecting_output = this.connecting_node.outputs[this.connecting_slot], this.connecting_pos = this.connecting_node.getConnectionPos(!1, this.connecting_slot), this.dirty_bgcanvas = !0, h = !0);
                        }
                        h || (this.connecting_node = o, this.connecting_input = Y, this.connecting_input.slot_index = I, this.connecting_pos = o.getConnectionPos(!0, I), this.connecting_slot = I, this.dirty_bgcanvas = !0, h = !0);
                      }
                    }
                }
              if (!h) {
                var m = !1, T = [s.canvasX - o.pos[0], s.canvasY - o.pos[1]], E = this.processNodeWidgets(o, this.graph_mouse, s);
                E && (m = !0, this.node_widget = [o, E]), this.allow_interaction && p && this.selected_nodes[o.id] && ((R = o.onDblClick) == null || R.call(o, s, T, this), this.processNodeDblClicked(o), m = !0), o.onMouseDown && o.onMouseDown(s, T, this) ? m = !0 : (o.subgraph && !o.skip_subgraph_button && !o.flags.collapsed && T[0] > o.size[0] - LiteGraph.NODE_TITLE_HEIGHT && T[1] < 0 && setTimeout(() => {
                  this.openSubgraph(o.subgraph);
                }, 10), this.live_mode && (L = !0, m = !0)), m ? o.is_selected || this.processNodeSelected(o, s) : (this.allow_dragnodes && (this.graph.beforeChange(), this.node_dragged = o), this.processNodeSelected(o, s)), this.dirty_canvas = !0;
              }
            } else if (!h) {
              if (!this.read_only)
                for (let I = 0; I < this.visible_links.length; ++I) {
                  var k = this.visible_links[I], D = k._pos;
                  if (!(!D || s.canvasX < D[0] - 4 || s.canvasX > D[0] + 4 || s.canvasY < D[1] - 4 || s.canvasY > D[1] + 4)) {
                    this.showLinkMenu(k, s), this.over_link_center = null;
                    break;
                  }
                }
              if (this.selected_group = this.graph.getGroupOnPos(s.canvasX, s.canvasY), this.selected_group_resizing = !1, this.selected_group && !this.read_only) {
                s.ctrlKey && (this.dragging_rectangle = null);
                var P = LiteGraph.distance([s.canvasX, s.canvasY], [this.selected_group.pos[0] + this.selected_group.size[0], this.selected_group.pos[1] + this.selected_group.size[1]]);
                P * this.ds.scale < 10 ? this.selected_group_resizing = !0 : this.selected_group.recomputeInsideNodes();
              }
              p && !this.read_only && this.allow_searchbox && (this.showSearchBox(s), s.preventDefault(), s.stopPropagation()), (j = LiteGraph.debug) == null || j.call(LiteGraph, "DEBUG canvas click is_double_click,this.allow_searchbox", p, this.allow_searchbox), L = !0;
            }
            !h && L && this.allow_dragcanvas && (this.dragging_canvas = !0);
          } else if (s.which == 2)
            if (LiteGraph.middle_click_slot_add_default_node) {
              if (o && this.allow_interaction && !h && !this.read_only && !this.connecting_node && !o.flags.collapsed && !this.live_mode) {
                var A = !1, C = !1, O = !1;
                if (o.outputs)
                  for (let I = 0, U = o.outputs.length; I < U; ++I) {
                    var S = o.outputs[I];
                    let Y = o.getConnectionPos(!1, I);
                    if (LiteGraph.isInsideRectangle(s.canvasX, s.canvasY, Y[0] - 15, Y[1] - 10, 30, 20)) {
                      A = S, C = I, O = !0;
                      break;
                    }
                  }
                if (o.inputs)
                  for (let I = 0, U = o.inputs.length; I < U; ++I) {
                    var d = o.inputs[I];
                    let H = o.getConnectionPos(!0, I);
                    if (LiteGraph.isInsideRectangle(s.canvasX, s.canvasY, H[0] - 15, H[1] - 10, 30, 20)) {
                      A = d, C = I, O = !1;
                      break;
                    }
                  }
                if (A && C !== !1) {
                  var G = 0.5 - (C + 1) / (O ? o.outputs.length : o.inputs.length), N = o.getBounding(), X = [
                    O ? N[0] + N[2] : N[0],
                    // + node_bounding[0]/this.canvas.width*150
                    s.canvasY - 80
                    // + node_bounding[0]/this.canvas.width*66 // vertical "derive"
                  ];
                  this.createDefaultNodeForSlot({
                    nodeFrom: O ? o : null,
                    slotFrom: O ? C : null,
                    nodeTo: O ? null : o,
                    slotTo: O ? null : C,
                    position: X,
                    // ,e: e
                    nodeType: "AUTO",
                    // nodeNewType
                    posAdd: [O ? 30 : -30, -G * 130],
                    // -alphaPosY*30]
                    posSizeFix: [O ? 0 : -1, 0]
                    // -alphaPosY*2*/
                  });
                }
              }
            } else !h && this.allow_dragcanvas && (this.dragging_canvas = !0);
          else (s.which == 3 || LiteGraph.two_fingers_opens_menu && this.userInput_isNotPrimary) && this.allow_interaction && !h && !this.read_only && (o && (Object.keys(this.selected_nodes).length && (this.selected_nodes[o.id] || s.shiftKey || s.ctrlKey || s.metaKey) ? this.selected_nodes[o.id] || this.selectNodes([o], !0) : this.selectNodes([o])), this.processContextMenu(o, s));
          return this.last_mouse[0] = s.clientX, this.last_mouse[1] = s.clientY, this.last_mouseclick = LiteGraph.getTime(), this.last_mouse_dragging = !0, this.graph.change(), (!t.document.activeElement || t.document.activeElement.nodeName.toLowerCase() != "input" && t.document.activeElement.nodeName.toLowerCase() != "textarea") && s.preventDefault(), s.stopPropagation(), (Q = this.onMouseDown) == null || Q.call(this, s), !1;
        }
      }
    }
  }
  /**
   * Called when a mouse move event has to be processed
   * @method processMouseMove
   **/
  processMouseMove(s) {
    var d, f;
    if (this.autoresize && this.resize(), this.set_canvas_dirty_on_mouse_event && (this.dirty_canvas = !0), !!this.graph) {
      _LGraphCanvas.active_canvas = this, this.adjustMouseEvent(s);
      var t = [s.clientX, s.clientY];
      this.mouse[0] = t[0], this.mouse[1] = t[1];
      var r = [
        t[0] - this.last_mouse[0],
        t[1] - this.last_mouse[1]
      ];
      if (this.last_mouse = t, this.graph_mouse[0] = s.canvasX, this.graph_mouse[1] = s.canvasY, this.block_click)
        return s.preventDefault(), !1;
      s.dragging = this.last_mouse_dragging, this.node_widget && (this.processNodeWidgets(
        this.node_widget[0],
        this.graph_mouse,
        s,
        this.node_widget[1]
      ), this.dirty_canvas = !0);
      var n = this.graph.getNodeOnPos(s.canvasX, s.canvasY, this.visible_nodes);
      if (this.dragging_rectangle)
        this.dragging_rectangle[2] = s.canvasX - this.dragging_rectangle[0], this.dragging_rectangle[3] = s.canvasY - this.dragging_rectangle[1], this.dirty_canvas = !0;
      else if (this.selected_group && !this.read_only) {
        if (this.selected_group_resizing)
          this.selected_group.size = [
            s.canvasX - this.selected_group.pos[0],
            s.canvasY - this.selected_group.pos[1]
          ];
        else {
          var a = r[0] / this.ds.scale, o = r[1] / this.ds.scale;
          this.selected_group.move(a, o, s.ctrlKey), this.selected_group._nodes.length && (this.dirty_canvas = !0);
        }
        this.dirty_bgcanvas = !0;
      } else if (this.dragging_canvas)
        this.ds.offset[0] += r[0] / this.ds.scale, this.ds.offset[1] += r[1] / this.ds.scale, this.dirty_canvas = !0, this.dirty_bgcanvas = !0;
      else if ((this.allow_interaction || n && n.flags.allow_interaction) && !this.read_only) {
        this.connecting_node && (this.dirty_canvas = !0);
        for (let _ = 0, g = this.graph._nodes.length; _ < g; ++_)
          this.graph._nodes[_].mouseOver && n != this.graph._nodes[_] && (this.graph._nodes[_].mouseOver = !1, this.node_over && this.node_over.onMouseLeave && this.node_over.onMouseLeave(s), this.node_over = null, this.dirty_canvas = !0);
        if (n) {
          if (n.redraw_on_mouse && (this.dirty_canvas = !0), n.mouseOver || (n.mouseOver = !0, this.node_over = n, this.dirty_canvas = !0, (d = n.onMouseEnter) == null || d.call(n, s)), (f = n.onMouseMove) == null || f.call(n, s, [s.canvasX - n.pos[0], s.canvasY - n.pos[1]], this), this.connecting_node) {
            let _;
            if (this.connecting_output) {
              if (_ = this._highlight_input || [0, 0], !this.isOverNodeBox(n, s.canvasX, s.canvasY)) {
                let g = this.isOverNodeInput(n, s.canvasX, s.canvasY, _);
                if (g != -1 && n.inputs[g]) {
                  let L = n.inputs[g].type;
                  LiteGraph.isValidConnection(this.connecting_output.type, L) && (this._highlight_input = _, this._highlight_input_slot = n.inputs[g]);
                } else
                  this._highlight_input = null, this._highlight_input_slot = null;
              }
            } else if (this.connecting_input && (_ = this._highlight_output || [0, 0], this.isOverNodeBox(n, s.canvasX, s.canvasY))) {
              let g = this.isOverNodeOutput(n, s.canvasX, s.canvasY, _);
              if (g != -1 && n.outputs[g]) {
                let L = n.outputs[g].type;
                LiteGraph.isValidConnection(this.connecting_input.type, L) && (this._highlight_output = _);
              } else
                this._highlight_output = null;
            }
          }
          this.canvas && (LiteGraph.isInsideRectangle(
            s.canvasX,
            s.canvasY,
            n.pos[0] + n.size[0] - 5,
            n.pos[1] + n.size[1] - 5,
            5,
            5
          ) ? this.canvas.style.cursor = "se-resize" : this.canvas.style.cursor = "crosshair");
        } else {
          var h = null;
          for (let _ = 0; _ < this.visible_links.length; ++_) {
            var l = this.visible_links[_], u = l._pos;
            if (!(!u || s.canvasX < u[0] - 4 || s.canvasX > u[0] + 4 || s.canvasY < u[1] - 4 || s.canvasY > u[1] + 4)) {
              h = l;
              break;
            }
          }
          h != this.over_link_center && (this.over_link_center = h, this.dirty_canvas = !0), this.canvas && (this.canvas.style.cursor = "");
        }
        if (this.node_capturing_input && this.node_capturing_input != n && this.node_capturing_input.onMouseMove && this.node_capturing_input.onMouseMove(s, [s.canvasX - this.node_capturing_input.pos[0], s.canvasY - this.node_capturing_input.pos[1]], this), this.node_dragged && !this.live_mode) {
          for (let _ in this.selected_nodes) {
            let g = this.selected_nodes[_];
            g.pos[0] += r[0] / this.ds.scale, g.pos[1] += r[1] / this.ds.scale, g.is_selected || this.processNodeSelected(g, s);
          }
          this.dirty_canvas = !0, this.dirty_bgcanvas = !0;
        }
        if (this.resizing_node && !this.live_mode) {
          var p = [s.canvasX - this.resizing_node.pos[0], s.canvasY - this.resizing_node.pos[1]], c = this.resizing_node.computeSize();
          p[0] = Math.max(c[0], p[0]), p[1] = Math.max(c[1], p[1]), this.resizing_node.setSize(p), this.canvas.style.cursor = "se-resize", this.dirty_canvas = !0, this.dirty_bgcanvas = !0;
        }
      }
      return s.preventDefault(), !1;
    }
  }
  /**
   * Called when a mouse up event has to be processed
   * @method processMouseUp
   **/
  processMouseUp(s) {
    var T;
    var t = s.isPrimary === void 0 || s.isPrimary;
    if (!t)
      return !1;
    if (this.set_canvas_dirty_on_mouse_event && (this.dirty_canvas = !0), !!this.graph) {
      var r = this.getCanvasWindow(), n = r.document;
      _LGraphCanvas.active_canvas = this, this.options.skip_events || (n.removeEventListener("pointermove", this._mousemove_callback, !0), this.canvas.addEventListener("pointermove", this._mousemove_callback, !0), n.removeEventListener("pointerup", this._mouseup_callback, !0)), this.adjustMouseEvent(s);
      var a = LiteGraph.getTime();
      if (s.click_time = a - this.last_mouseclick, this.last_mouse_dragging = !1, this.last_click_position = null, this.block_click && (this.block_click = !1), s.which == 1) {
        if (this.node_widget && this.processNodeWidgets(this.node_widget[0], this.graph_mouse, s), this.node_widget = null, this.selected_group) {
          var o = this.selected_group.pos[0] - Math.round(this.selected_group.pos[0]), h = this.selected_group.pos[1] - Math.round(this.selected_group.pos[1]);
          this.selected_group.move(o, h, s.ctrlKey), this.selected_group.pos[0] = Math.round(this.selected_group.pos[0]), this.selected_group.pos[1] = Math.round(this.selected_group.pos[1]), this.selected_group._nodes.length && (this.dirty_canvas = !0), this.selected_group = null;
        }
        this.selected_group_resizing = !1;
        var l = this.graph.getNodeOnPos(
          s.canvasX,
          s.canvasY,
          this.visible_nodes
        );
        if (this.dragging_rectangle) {
          if (this.graph) {
            var u = this.graph._nodes, p = new Float32Array(4), c = Math.abs(this.dragging_rectangle[2]), d = Math.abs(this.dragging_rectangle[3]), f = this.dragging_rectangle[2] < 0 ? this.dragging_rectangle[0] - c : this.dragging_rectangle[0], _ = this.dragging_rectangle[3] < 0 ? this.dragging_rectangle[1] - d : this.dragging_rectangle[1];
            if (this.dragging_rectangle[0] = f, this.dragging_rectangle[1] = _, this.dragging_rectangle[2] = c, this.dragging_rectangle[3] = d, !l || c > 10 && d > 10) {
              var g = [];
              for (let E = 0; E < u.length; ++E) {
                var L = u[E];
                L.getBounding(p), LiteGraph.overlapBounding(
                  this.dragging_rectangle,
                  p
                ) && g.push(L);
              }
              g.length && this.selectNodes(g, s.shiftKey);
            } else
              this.selectNodes([l], s.shiftKey || s.ctrlKey);
          }
          this.dragging_rectangle = null;
        } else if (this.connecting_node) {
          this.dirty_canvas = !0, this.dirty_bgcanvas = !0;
          var b = this.connecting_output || this.connecting_input, m = b.type;
          if (l = this.graph.getNodeOnPos(
            s.canvasX,
            s.canvasY,
            this.visible_nodes
          ), l) {
            let E;
            this.connecting_output ? (E = this.isOverNodeInput(
              l,
              s.canvasX,
              s.canvasY
            ), E != -1 ? this.connecting_node.connect(this.connecting_slot, l, E) : this.connecting_node.connectByType(this.connecting_slot, l, m)) : this.connecting_input && (E = this.isOverNodeOutput(
              l,
              s.canvasX,
              s.canvasY
            ), E != -1 ? l.connect(E, this.connecting_node, this.connecting_slot) : this.connecting_node.connectByTypeOutput(this.connecting_slot, l, m));
          } else
            LiteGraph.release_link_on_empty_shows_menu && (s.shiftKey && this.allow_searchbox ? this.connecting_output ? this.showSearchBox(s, { node_from: this.connecting_node, slot_from: this.connecting_output, type_filter_in: this.connecting_output.type }) : this.connecting_input && this.showSearchBox(s, { node_to: this.connecting_node, slot_from: this.connecting_input, type_filter_out: this.connecting_input.type }) : this.connecting_output ? this.showConnectionMenu({ nodeFrom: this.connecting_node, slotFrom: this.connecting_output, e: s }) : this.connecting_input && this.showConnectionMenu({ nodeTo: this.connecting_node, slotTo: this.connecting_input, e: s }));
          this.connecting_output = null, this.connecting_input = null, this.connecting_pos = null, this.connecting_node = null, this.connecting_slot = -1;
        } else this.resizing_node ? (this.dirty_canvas = !0, this.dirty_bgcanvas = !0, this.graph.afterChange(this.resizing_node), this.resizing_node = null) : this.node_dragged ? (l = this.node_dragged, l && s.click_time < 300 && LiteGraph.isInsideRectangle(s.canvasX, s.canvasY, l.pos[0], l.pos[1] - LiteGraph.NODE_TITLE_HEIGHT, LiteGraph.NODE_TITLE_HEIGHT, LiteGraph.NODE_TITLE_HEIGHT) && l.collapse(), this.dirty_canvas = !0, this.dirty_bgcanvas = !0, this.node_dragged.pos[0] = Math.round(this.node_dragged.pos[0]), this.node_dragged.pos[1] = Math.round(this.node_dragged.pos[1]), (this.graph.config.align_to_grid || this.align_to_grid) && this.node_dragged.alignToGrid(), (T = this.onNodeMoved) == null || T.call(this, this.node_dragged), this.graph.onGraphChanged({ action: "nodeDrag", doSave: !0 }), this.graph.afterChange(this.node_dragged), this.node_dragged = null) : (l = this.graph.getNodeOnPos(
          s.canvasX,
          s.canvasY,
          this.visible_nodes
        ), !l && s.click_time < 300 && this.deselectAllNodes(), this.dirty_canvas = !0, this.dragging_canvas = !1, this.node_over && this.node_over.onMouseUp && this.node_over.onMouseUp(s, [s.canvasX - this.node_over.pos[0], s.canvasY - this.node_over.pos[1]], this), this.node_capturing_input && this.node_capturing_input.onMouseUp && this.node_capturing_input.onMouseUp(s, [
          s.canvasX - this.node_capturing_input.pos[0],
          s.canvasY - this.node_capturing_input.pos[1]
        ]));
      } else s.which == 2 ? (this.dirty_canvas = !0, this.dragging_canvas = !1) : s.which == 3 && (this.dirty_canvas = !0, this.dragging_canvas = !1);
      return t && (this.pointer_is_down = !1, this.pointer_is_double = !1), this.graph.change(), s.stopPropagation(), s.preventDefault(), !1;
    }
  }
  /**
   * returns true if a position (in graph space) is on top of a node little corner box
   * @method isOverNodeBox
   **/
  isOverNodeBox(s, t, r) {
    var n = LiteGraph.NODE_TITLE_HEIGHT;
    return !!LiteGraph.isInsideRectangle(
      t,
      r,
      s.pos[0] + 2,
      s.pos[1] + 2 - n,
      n - 4,
      n - 4
    );
  }
  /**
   * returns the INDEX if a position (in graph space) is on top of a node input slot
   * @method isOverNodeInput
   **/
  isOverNodeInput(s, t, r, n) {
    if (s.inputs)
      for (let h = 0, l = s.inputs.length; h < l; ++h) {
        var a = s.getConnectionPos(!0, h), o = !1;
        if (s.horizontal ? o = LiteGraph.isInsideRectangle(
          t,
          r,
          a[0] - 5,
          a[1] - 10,
          10,
          20
        ) : o = LiteGraph.isInsideRectangle(
          t,
          r,
          a[0] - 10,
          a[1] - 5,
          40,
          10
        ), o)
          return n && (n[0] = a[0], n[1] = a[1]), h;
      }
    return -1;
  }
  /**
   * returns the INDEX if a position (in graph space) is on top of a node output slot
   * @method isOverNodeOuput
   **/
  isOverNodeOutput(s, t, r, n) {
    if (s.outputs)
      for (let h = 0, l = s.outputs.length; h < l; ++h) {
        var a = s.getConnectionPos(!1, h), o = !1;
        if (s.horizontal ? o = LiteGraph.isInsideRectangle(
          t,
          r,
          a[0] - 5,
          a[1] - 10,
          10,
          20
        ) : o = LiteGraph.isInsideRectangle(
          t,
          r,
          a[0] - 10,
          a[1] - 5,
          40,
          10
        ), o)
          return n && (n[0] = a[0], n[1] = a[1]), h;
      }
    return -1;
  }
  copyToClipboard() {
    var u;
    var s = {
      nodes: [],
      links: []
    }, t = 0, r = [];
    for (let p in this.selected_nodes) {
      let c = this.selected_nodes[p];
      c.clonable !== !1 && (c._relative_id = t, r.push(c), t += 1);
    }
    for (let p = 0; p < r.length; ++p) {
      let c = r[p];
      if (c.clonable !== !1) {
        var n = c.clone();
        if (!n) {
          (u = LiteGraph.warn) == null || u.call(LiteGraph, "node type not found: " + c.type);
          continue;
        }
        if (s.nodes.push(n.serialize()), c.inputs && c.inputs.length)
          for (var a = 0; a < c.inputs.length; ++a) {
            var o = c.inputs[a];
            if (!(!o || o.link == null)) {
              var h = this.graph.links[o.link];
              if (h) {
                var l = this.graph.getNodeById(h.origin_id);
                l && s.links.push([
                  l._relative_id,
                  h.origin_slot,
                  // j,
                  c._relative_id,
                  h.target_slot,
                  l.id
                ]);
              }
            }
          }
      }
    }
    localStorage.setItem(
      "litegrapheditor_clipboard",
      JSON.stringify(s)
    );
  }
  pasteFromClipboard(s = !1) {
    var _;
    if (!(!LiteGraph.ctrl_shift_v_paste_connect_unselected_outputs && s)) {
      var t = localStorage.getItem("litegrapheditor_clipboard");
      if (t) {
        this.graph.beforeChange();
        var r = JSON.parse(t), n = !1, a = !1;
        for (let g = 0; g < r.nodes.length; ++g)
          n ? (n[0] > r.nodes[g].pos[0] && (n[0] = r.nodes[g].pos[0], a[0] = g), n[1] > r.nodes[g].pos[1] && (n[1] = r.nodes[g].pos[1], a[1] = g)) : (n = [r.nodes[g].pos[0], r.nodes[g].pos[1]], a = [g, g]);
        var o = [];
        for (let g = 0; g < r.nodes.length; ++g) {
          var h = r.nodes[g], l = LiteGraph.createNode(h.type);
          l && (l.configure(h), l.pos[0] += this.graph_mouse[0] - n[0], l.pos[1] += this.graph_mouse[1] - n[1], this.graph.add(l, { doProcessChange: !1 }), o.push(l));
        }
        for (let g = 0; g < r.links.length; ++g) {
          var u = r.links[g], p = void 0, c = u[0];
          if (c != null)
            p = o[c];
          else if (LiteGraph.ctrl_shift_v_paste_connect_unselected_outputs && s) {
            var d = u[4];
            d && (p = this.graph.getNodeById(d));
          }
          var f = o[u[2]];
          p && f ? p.connect(u[1], f, u[3]) : (_ = LiteGraph.warn) == null || _.call(LiteGraph, "Warning, nodes missing on pasting");
        }
        this.selectNodes(o), this.graph.onGraphChanged({ action: "paste", doSave: !0 }), this.graph.afterChange();
      }
    }
  }
  // called if the graph doesn't have a default drop item behaviour
  checkDropItem(s) {
    var o;
    if (s.dataTransfer.files.length) {
      var t = s.dataTransfer.files[0], r = _LGraphCanvas.getFileExtension(t.name).toLowerCase(), n = LiteGraph.node_types_by_file_extension[r];
      if (n) {
        this.graph.beforeChange();
        var a = LiteGraph.createNode(n.type);
        a.pos = [s.canvasX, s.canvasY], this.graph.add(a, !1, { doProcessChange: !1 }), (o = a.onDropFile) == null || o.call(a, t), this.graph.onGraphChanged({ action: "fileDrop", doSave: !0 }), this.graph.afterChange();
      }
    }
  }
  processNodeDblClicked(s) {
    var t;
    this.onShowNodePanel ? this.onShowNodePanel(s) : this.showShowNodePanel(s), (t = this.onNodeDblClicked) == null || t.call(this, s), this.setDirty(!0);
  }
  processNodeSelected(s, t) {
    var r;
    this.selectNode(s, t && (t.shiftKey || t.ctrlKey || this.multi_select)), (r = this.onNodeSelected) == null || r.call(this, s);
  }
  /**
   * selects a given node (or adds it to the current selection)
   * @method selectNode
   **/
  selectNode(s, t) {
    s == null ? this.deselectAllNodes() : this.selectNodes([s], t);
  }
  /**
   * selects several nodes (or adds them to the current selection)
   * @method selectNodes
   **/
  selectNodes(s, t) {
    var r;
    t || this.deselectAllNodes(), s = s || this.graph._nodes, typeof s == "string" && (s = [s]), Object.values(s).forEach((n) => {
      var a, o, h;
      if (n.is_selected) {
        this.deselectNode(n);
        return;
      }
      n.is_selected = !0, this.selected_nodes[n.id] = n, (a = n.onSelected) == null || a.call(n), (o = n.inputs) == null || o.forEach((l) => {
        this.highlighted_links[l.link] = !0;
      }), (h = n.outputs) == null || h.forEach((l) => {
        var u;
        (u = l.links) == null || u.forEach((p) => {
          this.highlighted_links[p] = !0;
        });
      });
    }), (r = this.onSelectionChange) == null || r.call(this, this.selected_nodes), this.setDirty(!0);
  }
  /**
   * removes a node from the current selection
   * @method deselectNode
   **/
  deselectNode(s) {
    var t, r, n, a;
    s.is_selected && ((t = s.onDeselected) == null || t.call(s), s.is_selected = !1, (r = this.onNodeDeselected) == null || r.call(this, s), (n = s.inputs) == null || n.forEach((o) => {
      var h;
      (h = this.highlighted_links) == null || delete h[o.link];
    }), (a = s.outputs) == null || a.forEach((o) => {
      var h;
      (h = o.links) == null || h.forEach((l) => {
        var u;
        return (u = this.highlighted_links) == null ? !0 : delete u[l];
      });
    }));
  }
  /**
   * removes all nodes from the current selection
   * @method deselectAllNodes
   **/
  deselectAllNodes() {
    var s, t;
    this.graph && ((s = this.graph._nodes) == null || s.forEach((r) => {
      var n, a;
      r.is_selected && ((n = r.onDeselected) == null || n.call(r), r.is_selected = !1, (a = this.onNodeDeselected) == null || a.call(this, r));
    }), this.selected_nodes = {}, this.current_node = null, this.highlighted_links = {}, (t = this.onSelectionChange) == null || t.call(this, this.selected_nodes), this.setDirty(!0));
  }
  /**
   * deletes all nodes in the current selection from the graph
   * @method deleteSelectedNodes
   **/
  deleteSelectedNodes() {
    this.graph.beforeChange();
    for (let o in this.selected_nodes) {
      var s = this.selected_nodes[o];
      if (!s.block_delete) {
        if (s.inputs && s.inputs.length && s.outputs && s.outputs.length && LiteGraph.isValidConnection(s.inputs[0].type, s.outputs[0].type) && s.inputs[0].link && s.outputs[0].links && s.outputs[0].links.length) {
          var t = s.graph.links[s.inputs[0].link], r = s.graph.links[s.outputs[0].links[0]], n = s.getInputNode(0), a = s.getOutputNodes(0)[0];
          n && a && n.connect(t.origin_slot, a, r.target_slot);
        }
        this.graph.remove(s), this.onNodeDeselected && this.onNodeDeselected(s);
      }
    }
    this.selected_nodes = {}, this.current_node = null, this.highlighted_links = {}, this.setDirty(!0), this.graph.afterChange();
  }
  /**
   * centers the camera on a given node
   * @method centerOnNode
   **/
  centerOnNode(s) {
    this.ds.offset[0] = -s.pos[0] - s.size[0] * 0.5 + this.canvas.width * 0.5 / this.ds.scale, this.ds.offset[1] = -s.pos[1] - s.size[1] * 0.5 + this.canvas.height * 0.5 / this.ds.scale, this.setDirty(!0, !0);
  }
  /**
   * adds some useful properties to a mouse event, like the position in graph coordinates
   * @method adjustMouseEvent
   **/
  adjustMouseEvent(s) {
    var t = 0, r = 0;
    if (this.canvas) {
      var n = this.canvas.getBoundingClientRect();
      t = s.clientX - n.left, r = s.clientY - n.top;
    } else
      t = s.clientX, r = s.clientY;
    this.last_mouse_position[0] = t, this.last_mouse_position[1] = r, s.canvasX = t / this.ds.scale - this.ds.offset[0], s.canvasY = r / this.ds.scale - this.ds.offset[1];
  }
  /**
   * changes the zoom level of the graph (default is 1), you can pass also a place used to pivot the zoom
   * @method setZoom
   **/
  setZoom(s, t) {
    this.ds.changeScale(s, t), this.dirty_canvas = !0, this.dirty_bgcanvas = !0;
  }
  /**
   * converts a coordinate from graph coordinates to canvas2D coordinates
   * @method convertOffsetToCanvas
   **/
  convertOffsetToCanvas(s, t) {
    return this.ds.convertOffsetToCanvas(s, t);
  }
  /**
   * converts a coordinate from Canvas2D coordinates to graph space
   * @method convertCanvasToOffset
   **/
  convertCanvasToOffset(s, t) {
    return this.ds.convertCanvasToOffset(s, t);
  }
  // converts event coordinates from canvas2D to graph coordinates
  convertEventToCanvasOffset(s) {
    var t = this.canvas.getBoundingClientRect();
    return this.convertCanvasToOffset([
      s.clientX - t.left,
      s.clientY - t.top
    ]);
  }
  /**
   * brings a node to front (above all other nodes)
   * @method bringToFront
   **/
  bringToFront(s) {
    var t = this.graph._nodes.indexOf(s);
    t != -1 && (this.graph._nodes.splice(t, 1), this.graph._nodes.push(s));
  }
  /**
   * sends a node to the back (below all other nodes)
   * @method sendToBack
   **/
  sendToBack(s) {
    var t = this.graph._nodes.indexOf(s);
    t != -1 && (this.graph._nodes.splice(t, 1), this.graph._nodes.unshift(s));
  }
  /**
   * checks which nodes are visible (inside the camera area)
   * @method computeVisibleNodes
   **/
  computeVisibleNodes(s, t) {
    var r = t || [];
    r.length = 0, s = s || this.graph._nodes;
    for (var n = 0, a = s.length; n < a; ++n) {
      var o = s[n];
      this.live_mode && !o.onDrawBackground && !o.onDrawForeground || LiteGraph.overlapBounding(this.visible_area, o.getBounding(temp, !0)) && r.push(o);
    }
    return r;
  }
  /**
   * renders the whole canvas content, by rendering in two separated canvas, one containing the background grid and the connections, and one containing the nodes)
   * @method draw
   **/
  draw(s, t) {
    if (!(!this.canvas || this.canvas.width == 0 || this.canvas.height == 0)) {
      var r = LiteGraph.getTime();
      this.render_time = (r - this.last_draw_time) * 1e-3, this.last_draw_time = r, this.graph && this.ds.computeVisibleArea(this.viewport), (this.dirty_bgcanvas || t || this.always_render_background || this.graph && this.graph._last_trigger_time && r - this.graph._last_trigger_time < 1e3) && this.drawBackCanvas();
      var n = this.dirty_canvas || s;
      if (n && this.drawFrontCanvas(), this.fps = this.render_time ? 1 / this.render_time : 0, this.frame += 1, this.ds.scale < 0.7) {
        if (n) {
          var a = this.low_quality_rendering_threshold;
          const o = 45;
          this.fps < o ? (this.low_quality_rendering_counter += o / this.fps, this.low_quality_rendering_counter = Math.min(this.low_quality_rendering_counter, 2 * a)) : (this.low_quality_rendering_counter -= this.fps / o * 0.01, this.low_quality_rendering_counter = Math.max(this.low_quality_rendering_counter, 0));
        }
      } else
        this.low_quality_rendering_counter = 0;
    }
  }
  /**
   * draws the front canvas (the one containing all the nodes)
   * @method drawFrontCanvas
   **/
  drawFrontCanvas() {
    var c, d, f, _, g;
    this.dirty_canvas = !1, this.ctx || (this.ctx = this.bgcanvas.getContext("2d"));
    var s = this.ctx;
    if (s) {
      var t = this.canvas;
      s.start2D && !this.viewport && (s.start2D(), s.restore(), s.setTransform(1, 0, 0, 1, 0, 0));
      var r = this.viewport || this.dirty_area;
      if (r && (s.save(), s.beginPath(), s.rect(r[0], r[1], r[2], r[3]), s.clip()), this.clear_background && (r ? s.clearRect(r[0], r[1], r[2], r[3]) : s.clearRect(0, 0, t.width, t.height)), this.bgcanvas == this.canvas ? this.drawBackCanvas() : s.drawImage(this.bgcanvas, 0, 0), (c = this.onRender) == null || c.call(this, t, s), this.show_info && this.renderInfo(s, r ? r[0] : 0, r ? r[1] : 0), this.graph) {
        s.save(), this.ds.toCanvasContext(s);
        var n = this.computeVisibleNodes(
          null,
          this.visible_nodes
        );
        for (let L = 0; L < n.length; ++L) {
          let b = n[L];
          s.save(), s.translate(b.pos[0], b.pos[1]), this.drawNode(b, s), s.restore();
        }
        if (this.render_execution_order && this.drawExecutionOrder(s), this.graph.config.links_ontop && (this.live_mode || this.drawConnections(s)), this.connecting_pos != null) {
          s.lineWidth = this.connections_width;
          var a = null, o = this.connecting_output || this.connecting_input, h = o.type, l = o.dir;
          l == null && (this.connecting_output ? l = this.connecting_node.horizontal ? LiteGraph.DOWN : LiteGraph.RIGHT : l = this.connecting_node.horizontal ? LiteGraph.UP : LiteGraph.LEFT);
          var u = o.shape;
          switch (h) {
            case LiteGraph.EVENT:
            case LiteGraph.ACTION:
              a = LiteGraph.EVENT_LINK_COLOR;
              break;
            default:
              a = LiteGraph.CONNECTING_LINK_COLOR;
          }
          if (this.renderLink(
            s,
            this.connecting_pos,
            [this.graph_mouse[0], this.graph_mouse[1]],
            null,
            !1,
            null,
            a,
            l,
            LiteGraph.CENTER
          ), s.beginPath(), h === LiteGraph.EVENT || h === LiteGraph.ACTION || u === LiteGraph.BOX_SHAPE ? (s.rect(
            this.connecting_pos[0] - 6 + 0.5,
            this.connecting_pos[1] - 5 + 0.5,
            14,
            10
          ), s.fill(), s.beginPath(), s.rect(
            this.graph_mouse[0] - 6 + 0.5,
            this.graph_mouse[1] - 5 + 0.5,
            14,
            10
          )) : u === LiteGraph.ARROW_SHAPE ? (s.moveTo(this.connecting_pos[0] + 8, this.connecting_pos[1] + 0.5), s.lineTo(this.connecting_pos[0] - 4, this.connecting_pos[1] + 6 + 0.5), s.lineTo(this.connecting_pos[0] - 4, this.connecting_pos[1] - 6 + 0.5), s.closePath()) : (s.arc(
            this.connecting_pos[0],
            this.connecting_pos[1],
            4,
            0,
            Math.PI * 2
          ), s.fill(), s.beginPath(), s.arc(
            this.graph_mouse[0],
            this.graph_mouse[1],
            4,
            0,
            Math.PI * 2
          )), s.fill(), s.fillStyle = "#ffcc00", this._highlight_input) {
            s.beginPath();
            var p = this._highlight_input_slot.shape;
            p === LiteGraph.ARROW_SHAPE ? (s.moveTo(this._highlight_input[0] + 8, this._highlight_input[1] + 0.5), s.lineTo(this._highlight_input[0] - 4, this._highlight_input[1] + 6 + 0.5), s.lineTo(this._highlight_input[0] - 4, this._highlight_input[1] - 6 + 0.5), s.closePath()) : s.arc(
              this._highlight_input[0],
              this._highlight_input[1],
              6,
              0,
              Math.PI * 2
            ), s.fill();
          }
          this._highlight_output && (s.beginPath(), p === LiteGraph.ARROW_SHAPE ? (s.moveTo(this._highlight_output[0] + 8, this._highlight_output[1] + 0.5), s.lineTo(this._highlight_output[0] - 4, this._highlight_output[1] + 6 + 0.5), s.lineTo(this._highlight_output[0] - 4, this._highlight_output[1] - 6 + 0.5), s.closePath()) : s.arc(
            this._highlight_output[0],
            this._highlight_output[1],
            6,
            0,
            Math.PI * 2
          ), s.fill());
        }
        this.dragging_rectangle && (s.strokeStyle = "#FFF", s.strokeRect(
          this.dragging_rectangle[0],
          this.dragging_rectangle[1],
          this.dragging_rectangle[2],
          this.dragging_rectangle[3]
        )), this.over_link_center && this.render_link_tooltip ? this.drawLinkTooltip(s, this.over_link_center) : (d = this.onDrawLinkTooltip) == null || d.call(this, s, null), (f = this.onDrawForeground) == null || f.call(this, s, this.visible_rect), s.restore();
      }
      this._graph_stack && this._graph_stack.length && this.drawSubgraphPanel(s), (_ = this.onDrawOverlay) == null || _.call(this, s), r && s.restore(), (g = s.finish2D) == null || g.call(s);
    }
  }
  /**
   * draws the panel in the corner that shows subgraph properties
   * @method drawSubgraphPanel
   **/
  drawSubgraphPanel(s) {
    var n;
    var t = this.graph;
    if (t) {
      var r = t._subgraph_node;
      if (!r) {
        (n = LiteGraph.warn) == null || n.call(LiteGraph, "subgraph without subnode");
        return;
      }
      this.drawSubgraphPanelLeft(t, r, s), this.drawSubgraphPanelRight(t, r, s);
    }
  }
  drawSubgraphPanelLeft(s, t, r) {
    var d;
    var n = t.inputs ? t.inputs.length : 0, a = 200, o = Math.floor(LiteGraph.NODE_SLOT_HEIGHT * 1.6);
    if (r.fillStyle = "#111", r.globalAlpha = 0.8, r.beginPath(), r.roundRect(10, 10, a, (n + 1) * o + 50, [8]), r.fill(), r.globalAlpha = 1, r.fillStyle = "#888", r.font = "14px Arial", r.textAlign = "left", r.fillText("Graph Inputs", 20, 34), this.drawButton(a - 20, 20, 20, 20, "X", "#151515")) {
      this.closeSubgraph();
      return;
    }
    var h = 50;
    if (r.font = "14px Arial", t.inputs)
      for (var l = 0; l < t.inputs.length; ++l) {
        var u = t.inputs[l];
        if (!u.not_subgraph_input) {
          if (this.drawButton(20, h + 2, a - 20, o - 2)) {
            var p = t.constructor.input_node_type || "graph/input";
            this.graph.beforeChange();
            var c = LiteGraph.createNode(p);
            c ? (s.add(c, !1, { doProcessChange: !1 }), this.block_click = !1, this.last_click_position = null, this.selectNodes([c]), this.node_dragged = c, this.dragging_canvas = !1, c.setProperty("name", u.name), c.setProperty("type", u.type), this.node_dragged.pos[0] = this.graph_mouse[0] - 5, this.node_dragged.pos[1] = this.graph_mouse[1] - 5, this.graph.afterChange()) : (d = LiteGraph.error) == null || d.call(LiteGraph, "graph input node not found:", p);
          }
          r.fillStyle = "#9C9", r.beginPath(), r.arc(a - 16, h + o * 0.5, 5, 0, 2 * Math.PI), r.fill(), r.fillStyle = "#AAA", r.fillText(u.name, 30, h + o * 0.75), r.fillStyle = "#777", r.fillText(u.type, 130, h + o * 0.75), h += o;
        }
      }
    this.drawButton(20, h + 2, a - 20, o - 2, "+", "#151515", "#222") && this.showSubgraphPropertiesDialog(t);
  }
  drawSubgraphPanelRight(s, t, r) {
    var g;
    var n = t.outputs ? t.outputs.length : 0, a = this.bgcanvas.width, o = 200, h = Math.floor(LiteGraph.NODE_SLOT_HEIGHT * 1.6);
    r.fillStyle = "#111", r.globalAlpha = 0.8, r.beginPath(), r.roundRect(a - o - 10, 10, o, (n + 1) * h + 50, [8]), r.fill(), r.globalAlpha = 1, r.fillStyle = "#888", r.font = "14px Arial", r.textAlign = "left";
    const l = "Graph Outputs";
    var u = r.measureText(l).width;
    if (r.fillText(l, a - u - 20, 34), this.drawButton(a - o, 20, 20, 20, "X", "#151515")) {
      this.closeSubgraph();
      return;
    }
    var p = 50;
    if (r.font = "14px Arial", t.outputs)
      for (var c = 0; c < t.outputs.length; ++c) {
        var d = t.outputs[c];
        if (!d.not_subgraph_input) {
          if (this.drawButton(a - o, p + 2, o - 20, h - 2)) {
            var f = t.constructor.output_node_type || "graph/output";
            this.graph.beforeChange();
            var _ = LiteGraph.createNode(f);
            _ ? (s.add(_, !1, { doProcessChange: !1 }), this.block_click = !1, this.last_click_position = null, this.selectNodes([_]), this.node_dragged = _, this.dragging_canvas = !1, _.setProperty("name", d.name), _.setProperty("type", d.type), this.node_dragged.pos[0] = this.graph_mouse[0] - 5, this.node_dragged.pos[1] = this.graph_mouse[1] - 5, this.graph.afterChange()) : (g = LiteGraph.error) == null || g.call(LiteGraph, "graph input node not found:", f);
          }
          r.fillStyle = "#9C9", r.beginPath(), r.arc(a - o + 16, p + h * 0.5, 5, 0, 2 * Math.PI), r.fill(), r.fillStyle = "#AAA", r.fillText(d.name, a - o + 30, p + h * 0.75), r.fillStyle = "#777", r.fillText(d.type, a - o + 130, p + h * 0.75), p += h;
        }
      }
    this.drawButton(a - o, p + 2, o - 20, h - 2, "+", "#151515", "#222") && this.showSubgraphPropertiesDialogRight(t);
  }
  // Draws a button into the canvas overlay and computes if it was clicked using the immediate gui paradigm
  drawButton(s, t, r, n, a, o, h, l) {
    var u = this.ctx;
    o = o || LiteGraph.NODE_DEFAULT_COLOR, h = h || "#555", l = l || LiteGraph.NODE_TEXT_COLOR;
    var p = this.ds.convertOffsetToCanvas(this.graph_mouse), c = LiteGraph.isInsideRectangle(p[0], p[1], s, t, r, n);
    if (p = this.last_click_position ? [this.last_click_position[0], this.last_click_position[1]] : null, p) {
      var d = this.canvas.getBoundingClientRect();
      p[0] -= d.left, p[1] -= d.top;
    }
    var f = p && LiteGraph.isInsideRectangle(p[0], p[1], s, t, r, n);
    u.fillStyle = c ? h : o, f && (u.fillStyle = "#AAA"), u.beginPath(), u.roundRect(s, t, r, n, [4]), u.fill(), a != null && a.constructor == String && (u.fillStyle = l, u.textAlign = "center", u.font = (n * 0.65 | 0) + "px Arial", u.fillText(a, s + r * 0.5, t + n * 0.75), u.textAlign = "left");
    var _ = f && !this.block_click;
    return f && this.blockClick(), _;
  }
  isAreaClicked(s, t, r, n, a) {
    var o = this.last_click_position, h = o && LiteGraph.isInsideRectangle(o[0], o[1], s, t, r, n), l = h && !this.block_click;
    return h && a && this.blockClick(), l;
  }
  /**
   * draws some useful stats in the corner of the canvas
   * @method renderInfo
   **/
  renderInfo(s, t, r) {
    t = t || 10, r = r || this.canvas.height - 80, s.save(), s.translate(t, r), s.font = "10px Arial", s.fillStyle = "#888", s.textAlign = "left", this.graph ? (s.fillText("T: " + this.graph.globaltime.toFixed(2) + "s", 5, 13 * 1), s.fillText("I: " + this.graph.iteration, 5, 13 * 2), s.fillText("N: " + this.graph._nodes.length + " [" + this.visible_nodes.length + "]", 5, 13 * 3), s.fillText("V: " + this.graph._version, 5, 13 * 4), s.fillText("FPS:" + this.fps.toFixed(2), 5, 13 * 5)) : s.fillText("No graph selected", 5, 13 * 1), s.restore();
  }
  /**
   * draws the back canvas (the one containing the background and the connections)
   * @method drawBackCanvas
   **/
  drawBackCanvas() {
    var l, u, p;
    var s = this.bgcanvas;
    this.bgctx || (this.bgctx = this.bgcanvas.getContext("2d"));
    var t = this.bgctx;
    t.start && t.start();
    var r = this.viewport || [0, 0, t.canvas.width, t.canvas.height];
    if (this.clear_background && t.clearRect(r[0], r[1], r[2], r[3]), this._graph_stack && this._graph_stack.length) {
      t.save();
      var n = this.graph._subgraph_node;
      t.strokeStyle = n.bgcolor, t.lineWidth = 10, t.strokeRect(1, 1, s.width - 2, s.height - 2), t.lineWidth = 1, t.font = "40px Arial", t.textAlign = "center", t.fillStyle = n.bgcolor || "#AAA";
      let c = "";
      this._graph_stack.slice(1).forEach((d, f) => {
        c += `${d._subgraph_node.getTitle()} ${f < this._graph_stack.length - 2 ? ">> " : ""}`;
      }), t.fillText(
        c + n.getTitle(),
        s.width * 0.5,
        40
      ), t.restore();
    }
    var a = !1;
    if (this.onRenderBackground && (a = this.onRenderBackground(s, t)), this.viewport || (t.restore(), t.setTransform(1, 0, 0, 1, 0, 0)), this.visible_links.length = 0, this.graph) {
      if (t.save(), this.ds.toCanvasContext(t), this.ds.scale < 1.5 && !a && this.clear_background_color && (t.fillStyle = this.clear_background_color, t.fillRect(
        this.visible_area[0],
        this.visible_area[1],
        this.visible_area[2],
        this.visible_area[3]
      )), this.background_image && this.ds.scale > 0.5 && !a) {
        if (this.zoom_modify_alpha ? t.globalAlpha = (1 - 0.5 / this.ds.scale) * this.editor_alpha : t.globalAlpha = this.editor_alpha, t.imageSmoothingEnabled = t.imageSmoothingEnabled = !1, !this._bg_img || this._bg_img.name != this.background_image) {
          this._bg_img = new Image(), this._bg_img.name = this.background_image, this._bg_img.src = this.background_image;
          var o = this;
          this._bg_img.onload = function() {
            o.draw(!0, !0);
          };
        }
        var h = null;
        this._pattern == null && this._bg_img.width > 0 ? (h = t.createPattern(this._bg_img, "repeat"), this._pattern_img = this._bg_img, this._pattern = h) : h = this._pattern, h && (t.fillStyle = h, t.fillRect(
          this.visible_area[0],
          this.visible_area[1],
          this.visible_area[2],
          this.visible_area[3]
        ), t.fillStyle = "transparent"), t.globalAlpha = 1, t.imageSmoothingEnabled = t.imageSmoothingEnabled = !0;
      }
      this.graph._groups.length && !this.live_mode && this.drawGroups(s, t), (l = this.onDrawBackground) == null || l.call(this, t, this.visible_area), this.onBackgroundRender && ((u = LiteGraph.error) == null || u.call(LiteGraph, "WARNING! onBackgroundRender deprecated, now is named onDrawBackground "), this.onBackgroundRender = null), this.render_canvas_border && (t.strokeStyle = "#235", t.strokeRect(0, 0, s.width, s.height)), this.render_connections_shadows ? (t.shadowColor = "#000", t.shadowOffsetX = 0, t.shadowOffsetY = 0, t.shadowBlur = 6) : t.shadowColor = "rgba(0,0,0,0)", this.live_mode || this.drawConnections(t), t.shadowColor = "rgba(0,0,0,0)", t.restore();
    }
    (p = t.finish) == null || p.call(t), this.dirty_bgcanvas = !1, this.dirty_canvas = !0;
  }
  /**
   * draws the given node inside the canvas
   * @method drawNode
   **/
  drawNode(s, t) {
    var k, D, P;
    this.current_node = s;
    var r = s.color || s.constructor.color || LiteGraph.NODE_DEFAULT_COLOR, n = s.bgcolor || s.constructor.bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR, a = this.ds.scale < 0.6;
    if (this.live_mode) {
      s.flags.collapsed || (t.shadowColor = "transparent", (k = s.onDrawForeground) == null || k.call(s, t, this, this.canvas));
      return;
    }
    var o = this.editor_alpha;
    if (t.globalAlpha = o, this.render_shadows && !a ? (t.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR, t.shadowOffsetX = 2 * this.ds.scale, t.shadowOffsetY = 2 * this.ds.scale, t.shadowBlur = 3 * this.ds.scale) : t.shadowColor = "transparent", !(s.flags.collapsed && ((D = s.onDrawCollapsed) != null && D.call(s, t, this)))) {
      var h = s._shape || LiteGraph.BOX_SHAPE, l = temp_vec2;
      temp_vec2.set(s.size);
      var u = s.horizontal;
      if (s.flags.collapsed) {
        t.font = this.inner_text_font;
        var p = s.getTitle ? s.getTitle() : s.title;
        p != null && (s._collapsed_width = Math.min(
          s.size[0],
          t.measureText(p).width + LiteGraph.NODE_TITLE_HEIGHT * 2
        ), l[0] = s._collapsed_width, l[1] = 0);
      }
      (s.clip_area || this.clip_all_nodes) && (t.save(), t.beginPath(), h == LiteGraph.BOX_SHAPE ? t.rect(0, 0, l[0], l[1]) : h == LiteGraph.ROUND_SHAPE ? t.roundRect(0, 0, l[0], l[1], [10]) : h == LiteGraph.CIRCLE_SHAPE && t.arc(
        l[0] * 0.5,
        l[1] * 0.5,
        l[0] * 0.5,
        0,
        Math.PI * 2
      ), t.clip()), s.has_errors && (n = "red"), this.drawNodeShape(
        s,
        t,
        l,
        r,
        n,
        s.is_selected,
        s.mouseOver
      ), t.shadowColor = "transparent", (P = s.onDrawForeground) == null || P.call(s, t, this, this.canvas), LiteGraph.show_node_tooltip && s.mouseOver && s.is_selected && (!this.selected_nodes || Object.keys(this.selected_nodes).length <= 1) && this.drawNodeTooltip(t, s), t.textAlign = u ? "center" : "left", t.font = this.inner_text_font;
      var c = !this.lowQualityRenderingRequired(0.6), d = this.connecting_output, f = this.connecting_input;
      t.lineWidth = 1;
      var _ = 0, g = new Float32Array(2), L;
      if (s.flags.collapsed) {
        if (this.render_collapsed_slots) {
          var m = null, T = null;
          if (s.inputs)
            for (let A = 0; A < s.inputs.length; A++) {
              var E = s.inputs[A];
              if (E.link != null) {
                m = E;
                break;
              }
            }
          if (s.outputs)
            for (let A = 0; A < s.outputs.length; A++) {
              var E = s.outputs[A];
              !E.links || !E.links.length || (T = E);
            }
          if (m) {
            let A = 0, C = LiteGraph.NODE_TITLE_HEIGHT * -0.5;
            u && (A = s._collapsed_width * 0.5, C = -LiteGraph.NODE_TITLE_HEIGHT), t.fillStyle = "#686", t.beginPath(), E.type === LiteGraph.EVENT || E.type === LiteGraph.ACTION || E.shape === LiteGraph.BOX_SHAPE ? t.rect(A - 7 + 0.5, C - 4, 14, 8) : E.shape === LiteGraph.ARROW_SHAPE ? (t.moveTo(A + 8, C), t.lineTo(A + -4, C - 4), t.lineTo(A + -4, C + 4), t.closePath()) : t.arc(A, C, 4, 0, Math.PI * 2), t.fill();
          }
          if (T) {
            let A = s._collapsed_width, C = LiteGraph.NODE_TITLE_HEIGHT * -0.5;
            u && (A = s._collapsed_width * 0.5, C = 0), t.fillStyle = "#686", t.strokeStyle = "black", t.beginPath(), E.type === LiteGraph.EVENT || E.type === LiteGraph.ACTION || E.shape === LiteGraph.BOX_SHAPE ? t.rect(A - 7 + 0.5, C - 4, 14, 8) : E.shape === LiteGraph.ARROW_SHAPE ? (t.moveTo(A + 6, C), t.lineTo(A - 6, C - 4), t.lineTo(A - 6, C + 4), t.closePath()) : t.arc(A, C, 4, 0, Math.PI * 2), t.fill();
          }
        }
      } else {
        if (s.inputs)
          for (let A = 0; A < s.inputs.length; A++) {
            let C = s.inputs[A], O = C.type, S = C.shape;
            t.globalAlpha = o, this.connecting_output && !LiteGraph.isValidConnection(C.type, d.type) && (t.globalAlpha = 0.4 * o), t.fillStyle = C.link != null ? C.color_on || this.default_connection_color_byType[O] || this.default_connection_color.input_on : C.color_off || this.default_connection_color_byTypeOff[O] || this.default_connection_color_byType[O] || this.default_connection_color.input_off;
            let G = s.getConnectionPos(!0, A, g);
            if (G[0] -= s.pos[0], G[1] -= s.pos[1], _ < G[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5 && (_ = G[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5), t.beginPath(), O == "array" ? S = LiteGraph.GRID_SHAPE : C.name == "onTrigger" || C.name == "onExecuted" ? S = LiteGraph.ARROW_SHAPE : (O === LiteGraph.EVENT || O === LiteGraph.ACTION) && (S = LiteGraph.BOX_SHAPE), L = !0, S === LiteGraph.BOX_SHAPE ? u ? t.rect(
              G[0] - 5 + 0.5,
              G[1] - 8 + 0.5,
              10,
              14
            ) : t.rect(
              G[0] - 6 + 0.5,
              G[1] - 5 + 0.5,
              14,
              10
            ) : S === LiteGraph.ARROW_SHAPE ? (t.moveTo(G[0] + 8, G[1] + 0.5), t.lineTo(G[0] - 4, G[1] + 6 + 0.5), t.lineTo(G[0] - 4, G[1] - 6 + 0.5), t.closePath()) : S === LiteGraph.GRID_SHAPE ? (t.rect(G[0] - 4, G[1] - 4, 2, 2), t.rect(G[0] - 1, G[1] - 4, 2, 2), t.rect(G[0] + 2, G[1] - 4, 2, 2), t.rect(G[0] - 4, G[1] - 1, 2, 2), t.rect(G[0] - 1, G[1] - 1, 2, 2), t.rect(G[0] + 2, G[1] - 1, 2, 2), t.rect(G[0] - 4, G[1] + 2, 2, 2), t.rect(G[0] - 1, G[1] + 2, 2, 2), t.rect(G[0] + 2, G[1] + 2, 2, 2), L = !1) : a ? t.rect(G[0] - 4, G[1] - 4, 8, 8) : t.arc(G[0], G[1], 4, 0, Math.PI * 2), t.fill(), c && !(C.name == "onTrigger" || C.name == "onExecuted")) {
              let N = C.label != null ? C.label : C.name;
              N && (t.fillStyle = LiteGraph.NODE_TEXT_COLOR, u || C.dir == LiteGraph.UP ? t.fillText(N, G[0], G[1] - 10) : t.fillText(N, G[0] + 10, G[1] + 5));
            }
          }
        if (t.textAlign = u ? "center" : "right", t.strokeStyle = "black", s.outputs)
          for (let A = 0; A < s.outputs.length; A++) {
            let C = s.outputs[A], O = C.type, S = C.shape;
            this.connecting_input && !LiteGraph.isValidConnection(O, f.type) && (t.globalAlpha = 0.4 * o);
            let G = s.getConnectionPos(!1, A, g);
            if (G[0] -= s.pos[0], G[1] -= s.pos[1], _ < G[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5 && (_ = G[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5), t.fillStyle = C.links && C.links.length ? C.color_on || this.default_connection_color_byType[O] || this.default_connection_color.output_on : C.color_off || this.default_connection_color_byTypeOff[O] || this.default_connection_color_byType[O] || this.default_connection_color.output_off, t.beginPath(), O == "array" ? S = LiteGraph.GRID_SHAPE : C.name == "onTrigger" || C.name == "onExecuted" ? S = LiteGraph.ARROW_SHAPE : (O === LiteGraph.EVENT || O === LiteGraph.ACTION) && (S = LiteGraph.BOX_SHAPE), L = !0, S === LiteGraph.BOX_SHAPE ? u ? t.rect(
              G[0] - 5 + 0.5,
              G[1] - 8 + 0.5,
              10,
              14
            ) : t.rect(
              G[0] - 6 + 0.5,
              G[1] - 5 + 0.5,
              14,
              10
            ) : S === LiteGraph.ARROW_SHAPE ? (t.moveTo(G[0] + 8, G[1] + 0.5), t.lineTo(G[0] - 4, G[1] + 6 + 0.5), t.lineTo(G[0] - 4, G[1] - 6 + 0.5), t.closePath()) : S === LiteGraph.GRID_SHAPE ? (t.rect(G[0] - 4, G[1] - 4, 2, 2), t.rect(G[0] - 1, G[1] - 4, 2, 2), t.rect(G[0] + 2, G[1] - 4, 2, 2), t.rect(G[0] - 4, G[1] - 1, 2, 2), t.rect(G[0] - 1, G[1] - 1, 2, 2), t.rect(G[0] + 2, G[1] - 1, 2, 2), t.rect(G[0] - 4, G[1] + 2, 2, 2), t.rect(G[0] - 1, G[1] + 2, 2, 2), t.rect(G[0] + 2, G[1] + 2, 2, 2), L = !1) : a ? t.rect(G[0] - 4, G[1] - 4, 8, 8) : t.arc(G[0], G[1], 4, 0, Math.PI * 2), t.fill(), !a && L && t.stroke(), c && !(C.name == "onTrigger" || C.name == "onExecuted")) {
              let N = C.label != null ? C.label : C.name;
              N && (t.fillStyle = LiteGraph.NODE_TEXT_COLOR, u || C.dir == LiteGraph.DOWN ? t.fillText(N, G[0], G[1] - 8) : t.fillText(N, G[0] - 10, G[1] + 5));
            }
          }
        if (t.textAlign = "left", t.globalAlpha = 1, s.widgets) {
          var b = _;
          (u || s.widgets_up) && (b = 2), s.widgets_start_y != null && (b = s.widgets_start_y), this.drawNodeWidgets(
            s,
            b,
            t,
            this.node_widget && this.node_widget[0] == s ? this.node_widget[1] : null
          );
        }
      }
      (s.clip_area || this.clip_all_nodes) && t.restore(), t.globalAlpha = 1;
    }
  }
  drawNodeTooltip(s, t) {
    var u;
    if (!t || !s) {
      (u = LiteGraph.warn) == null || u.call(LiteGraph, "drawNodeTooltip: invalid node or ctx", t, s);
      return;
    }
    var r = t.properties.tooltip != null ? t.properties.tooltip : "";
    if ((!r || r == "") && LiteGraph.show_node_tooltip_use_descr_property && t.constructor.desc && (r = t.constructor.desc), r = (r + "").trim(), !(!r || r == "")) {
      var n = [0, -LiteGraph.NODE_TITLE_HEIGHT], a = t.flags.collapsed ? [LiteGraph.NODE_COLLAPSED_WIDTH, LiteGraph.NODE_TITLE_HEIGHT] : t.size;
      s.font = "14px Courier New", s.measureText(r);
      var o = Math.max(t.size[0], 160) + 20, h = t.ttip_oTMultiRet ? t.ttip_oTMultiRet.height + 15 : 21;
      s.globalAlpha = 0.7 * this.editor_alpha, s.shadowColor = t.ttip_oTMultiRet ? "black" : "transparent", s.shadowOffsetX = 2, s.shadowOffsetY = 2, s.shadowBlur = 3, s.fillStyle = t.ttip_oTMultiRet ? "#454" : "transparent", s.beginPath(), s.roundRect(n[0] - o * 0.5 + a[0] / 2, n[1] - 15 - h, o, h, [3]), s.moveTo(n[0] - 10 + a[0] / 2, n[1] - 15), s.lineTo(n[0] + 10 + a[0] / 2, n[1] - 15), s.lineTo(n[0] + a[0] / 2, n[1] - 5), s.fill(), s.shadowColor = "transparent", s.textAlign = "center", s.fillStyle = t.ttip_oTMultiRet ? "#CEC" : "transparent", s.globalAlpha = this.editor_alpha;
      var l = LiteGraph.canvasFillTextMultiline(s, r, n[0] + a[0] / 2, n[1] - h, o, 14);
      t.ttip_oTMultiRet = l, s.closePath();
    }
  }
  // used by this.over_link_center
  drawLinkTooltip(s, t) {
    var u;
    var r = t._pos;
    if (s.fillStyle = "black", s.beginPath(), s.arc(r[0], r[1], 3, 0, Math.PI * 2), s.fill(), t.data != null && !((u = this.onDrawLinkTooltip) != null && u.call(this, s, t, this))) {
      var n = t.data, a = null;
      if (n.constructor === Number ? a = n.toFixed(2) : n.constructor === String ? a = '"' + n + '"' : n.constructor === Boolean ? a = String(n) : n.toToolTip ? a = n.toToolTip() : a = "[" + n.constructor.name + "]", a != null) {
        a = a.substr(0, 30), s.font = "14px Courier New";
        var o = s.measureText(a), h = o.width + 20, l = 24;
        s.shadowColor = "black", s.shadowOffsetX = 2, s.shadowOffsetY = 2, s.shadowBlur = 3, s.fillStyle = "#454", s.beginPath(), s.roundRect(r[0] - h * 0.5, r[1] - 15 - l, h, l, [3]), s.moveTo(r[0] - 10, r[1] - 15), s.lineTo(r[0] + 10, r[1] - 15), s.lineTo(r[0], r[1] - 5), s.fill(), s.shadowColor = "transparent", s.textAlign = "center", s.fillStyle = "#CEC", s.fillText(a, r[0], r[1] - 15 - l * 0.3);
      }
    }
  }
  drawNodeShape(s, t, r, n, a, o, h) {
    var D;
    t.strokeStyle = n, t.fillStyle = a;
    var l = LiteGraph.NODE_TITLE_HEIGHT, u = this.lowQualityRenderingRequired(0.5), p = s._shape || s.constructor.shape || LiteGraph.ROUND_SHAPE, c = s.constructor.title_mode, d = !0;
    c == LiteGraph.TRANSPARENT_TITLE || c == LiteGraph.NO_TITLE ? d = !1 : c == LiteGraph.AUTOHIDE_TITLE && h && (d = !0);
    var f = tmp_area;
    f[0] = 0, f[1] = d ? -l : 0, f[2] = r[0] + 1, f[3] = d ? r[1] + l : r[1];
    var _ = t.globalAlpha;
    if (t.beginPath(), p == LiteGraph.BOX_SHAPE || u ? t.fillRect(f[0], f[1], f[2], f[3]) : p == LiteGraph.ROUND_SHAPE || p == LiteGraph.CARD_SHAPE ? t.roundRect(
      f[0],
      f[1],
      f[2],
      f[3],
      p == LiteGraph.CARD_SHAPE ? [this.round_radius, this.round_radius, 0, 0] : [this.round_radius]
    ) : p == LiteGraph.CIRCLE_SHAPE && t.arc(
      r[0] * 0.5,
      r[1] * 0.5,
      r[0] * 0.5,
      0,
      Math.PI * 2
    ), t.fill(), !s.flags.collapsed && d && (t.shadowColor = "transparent", t.fillStyle = "rgba(0,0,0,0.2)", t.fillRect(0, -1, f[2], 2)), t.shadowColor = "transparent", (D = s.onDrawBackground) == null || D.call(s, t, this, this.canvas, this.graph_mouse), d || c == LiteGraph.TRANSPARENT_TITLE) {
      if (s.onDrawTitleBar)
        s.onDrawTitleBar(t, l, r, this.ds.scale, n);
      else if (c != LiteGraph.TRANSPARENT_TITLE && (s.constructor.title_color || this.render_title_colored)) {
        var g = s.constructor.title_color || n;
        if (s.flags.collapsed && (t.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR), this.use_gradients) {
          var L = _LGraphCanvas.gradients[g];
          L || (L = _LGraphCanvas.gradients[g] = t.createLinearGradient(0, 0, 400, 0), L.addColorStop(0, g), L.addColorStop(1, "#000")), t.fillStyle = L;
        } else
          t.fillStyle = g;
        t.beginPath(), p == LiteGraph.BOX_SHAPE || u ? t.rect(0, -l, r[0] + 1, l) : (p == LiteGraph.ROUND_SHAPE || p == LiteGraph.CARD_SHAPE) && t.roundRect(
          0,
          -l,
          r[0] + 1,
          l,
          s.flags.collapsed ? [this.round_radius] : [this.round_radius, this.round_radius, 0, 0]
        ), t.fill(), t.shadowColor = "transparent";
      }
      let P = !1;
      LiteGraph.node_box_coloured_by_mode && LiteGraph.NODE_MODES_COLORS[s.mode] && (P = LiteGraph.NODE_MODES_COLORS[s.mode]), LiteGraph.node_box_coloured_when_on && (P = s.action_triggered ? "#FFF" : s.execute_triggered ? "#AAA" : P);
      var b = 10;
      if (s.onDrawTitleBox ? s.onDrawTitleBox(t, l, r, this.ds.scale) : p == LiteGraph.ROUND_SHAPE || p == LiteGraph.CIRCLE_SHAPE || p == LiteGraph.CARD_SHAPE ? (u && (t.fillStyle = "black", t.beginPath(), t.arc(
        l * 0.5,
        l * -0.5,
        b * 0.5 + 1,
        0,
        Math.PI * 2
      ), t.fill()), t.fillStyle = s.boxcolor || P || LiteGraph.NODE_DEFAULT_BOXCOLOR, u ? t.fillRect(l * 0.5 - b * 0.5, l * -0.5 - b * 0.5, b, b) : (t.beginPath(), t.arc(
        l * 0.5,
        l * -0.5,
        b * 0.5,
        0,
        Math.PI * 2
      ), t.fill())) : (u && (t.fillStyle = "black", t.fillRect(
        (l - b) * 0.5 - 1,
        (l + b) * -0.5 - 1,
        b + 2,
        b + 2
      )), t.fillStyle = s.boxcolor || P || LiteGraph.NODE_DEFAULT_BOXCOLOR, t.fillRect(
        (l - b) * 0.5,
        (l + b) * -0.5,
        b,
        b
      )), t.globalAlpha = _, s.onDrawTitleText && s.onDrawTitleText(
        t,
        l,
        r,
        this.ds.scale,
        this.title_text_font,
        o
      ), !u) {
        t.font = this.title_text_font;
        var m = String(s.getTitle());
        m && (o ? t.fillStyle = LiteGraph.NODE_SELECTED_TITLE_COLOR : t.fillStyle = s.constructor.title_text_color || this.node_title_color, s.flags.collapsed ? (t.textAlign = "left", t.fillText(
          m.substr(0, 20),
          // avoid urls too long //@TODO: Replace with substring
          l,
          // + measure.width * 0.5,
          LiteGraph.NODE_TITLE_TEXT_Y - l
        ), t.textAlign = "left") : (t.textAlign = "left", t.fillText(
          m,
          l,
          LiteGraph.NODE_TITLE_TEXT_Y - l
        )));
      }
      if (!s.flags.collapsed && s.subgraph && !s.skip_subgraph_button) {
        var T = LiteGraph.NODE_TITLE_HEIGHT, E = s.size[0] - T, k = LiteGraph.isInsideRectangle(this.graph_mouse[0] - s.pos[0], this.graph_mouse[1] - s.pos[1], E + 2, -T + 2, T - 4, T - 4);
        t.fillStyle = k ? "#888" : "#555", p == LiteGraph.BOX_SHAPE || u ? t.fillRect(E + 2, -T + 2, T - 4, T - 4) : (t.beginPath(), t.roundRect(E + 2, -T + 2, T - 4, T - 4, [4]), t.fill()), t.fillStyle = "#333", t.beginPath(), t.moveTo(E + T * 0.2, -T * 0.6), t.lineTo(E + T * 0.8, -T * 0.6), t.lineTo(E + T * 0.5, -T * 0.3), t.fill();
      }
      s.onDrawTitle && s.onDrawTitle(t);
    }
    o && (s.onBounding && s.onBounding(f), c == LiteGraph.TRANSPARENT_TITLE && (f[1] -= l, f[3] += l), t.lineWidth = 1, t.globalAlpha = 0.8, t.beginPath(), p == LiteGraph.BOX_SHAPE ? t.rect(
      -6 + f[0],
      -6 + f[1],
      12 + f[2],
      12 + f[3]
    ) : p == LiteGraph.ROUND_SHAPE || p == LiteGraph.CARD_SHAPE && s.flags.collapsed ? t.roundRect(
      -6 + f[0],
      -6 + f[1],
      12 + f[2],
      12 + f[3],
      [this.round_radius * 2]
    ) : p == LiteGraph.CARD_SHAPE ? t.roundRect(
      -6 + f[0],
      -6 + f[1],
      12 + f[2],
      12 + f[3],
      [this.round_radius * 2, 2, this.round_radius * 2, 2]
    ) : p == LiteGraph.CIRCLE_SHAPE && t.arc(
      r[0] * 0.5,
      r[1] * 0.5,
      r[0] * 0.5 + 6,
      0,
      Math.PI * 2
    ), t.strokeStyle = LiteGraph.NODE_BOX_OUTLINE_COLOR, t.stroke(), t.strokeStyle = n, t.globalAlpha = 1), s.execute_triggered > 0 && s.execute_triggered--, s.action_triggered > 0 && s.action_triggered--;
  }
  /**
   * draws every connection visible in the canvas
   * OPTIMIZE THIS: pre-catch connections position instead of recomputing them every time
   * @method drawConnections
   **/
  drawConnections(s) {
    var t = LiteGraph.getTime(), r = this.visible_area;
    margin_area[0] = r[0] - 20, margin_area[1] = r[1] - 20, margin_area[2] = r[2] + 40, margin_area[3] = r[3] + 40, s.lineWidth = this.connections_width, s.fillStyle = "#AAA", s.strokeStyle = "#AAA", s.globalAlpha = this.editor_alpha;
    for (var n = this.graph._nodes, a = 0, o = n.length; a < o; ++a) {
      var h = n[a];
      if (!(!h.inputs || !h.inputs.length))
        for (let k = 0; k < h.inputs.length; ++k) {
          var l = h.inputs[k];
          if (!(!l || l.link == null)) {
            var u = l.link, p = this.graph.links[u];
            if (p) {
              var c = this.graph.getNodeById(p.origin_id);
              if (c != null) {
                var d = p.origin_slot, f = null;
                d == -1 ? f = [
                  c.pos[0] + 10,
                  c.pos[1] + 10
                ] : f = c.getConnectionPos(
                  !1,
                  d,
                  tempA
                );
                var _ = h.getConnectionPos(!0, k, tempB);
                if (link_bounding[0] = f[0], link_bounding[1] = f[1], link_bounding[2] = _[0] - f[0], link_bounding[3] = _[1] - f[1], link_bounding[2] < 0 && (link_bounding[0] += link_bounding[2], link_bounding[2] = Math.abs(link_bounding[2])), link_bounding[3] < 0 && (link_bounding[1] += link_bounding[3], link_bounding[3] = Math.abs(link_bounding[3])), !!LiteGraph.overlapBounding(link_bounding, margin_area)) {
                  var g = c.outputs[d], L = h.inputs[k];
                  if (!(!g || !L)) {
                    var b = g.dir || (c.horizontal ? LiteGraph.DOWN : LiteGraph.RIGHT), m = L.dir || (h.horizontal ? LiteGraph.UP : LiteGraph.LEFT);
                    if (this.renderLink(
                      s,
                      f,
                      _,
                      p,
                      !1,
                      0,
                      null,
                      b,
                      m
                    ), p && p._last_time && t - p._last_time < 1e3) {
                      var T = 2 - (t - p._last_time) * 2e-3, E = s.globalAlpha;
                      s.globalAlpha = E * T, this.renderLink(
                        s,
                        f,
                        _,
                        p,
                        !0,
                        T,
                        "white",
                        b,
                        m
                      ), s.globalAlpha = E;
                    }
                  }
                }
              }
            }
          }
        }
    }
    s.globalAlpha = 1;
  }
  /**
   * draws a link between two points
   * @method renderLink
   * @param {vec2} a start pos
   * @param {vec2} b end pos
   * @param {Object} link the link object with all the link info
   * @param {boolean} skip_border ignore the shadow of the link
   * @param {boolean} flow show flow animation (for events)
   * @param {string} color the color for the link
   * @param {number} start_dir the direction enum
   * @param {number} end_dir the direction enum
   * @param {number} num_sublines number of sublines (useful to represent vec3 or rgb)
   **/
  renderLink(s, t, r, n, a, o, h, l, u, p) {
    n && this.visible_links.push(n), !h && n && (h = n.color || _LGraphCanvas.link_type_colors[n.type]), h || (h = this.default_link_color), n != null && this.highlighted_links[n.id] && (h = "#FFF"), l = l || LiteGraph.RIGHT, u = u || LiteGraph.LEFT;
    var c = LiteGraph.distance(t, r);
    this.render_connections_border && this.ds.scale > 0.6 && (s.lineWidth = this.connections_width + 4), s.lineJoin = "round", p = p || 1, p > 1 && (s.lineWidth = 0.5), s.beginPath();
    for (let O = 0; O < p; O += 1) {
      var d = (O - (p - 1) * 0.5) * 5;
      if (this.links_render_mode == LiteGraph.SPLINE_LINK) {
        s.moveTo(t[0], t[1] + d);
        let S = 0, G = 0, N = 0, X = 0;
        switch (l) {
          case LiteGraph.LEFT:
            S = c * -0.25;
            break;
          case LiteGraph.RIGHT:
            S = c * 0.25;
            break;
          case LiteGraph.UP:
            G = c * -0.25;
            break;
          case LiteGraph.DOWN:
            G = c * 0.25;
            break;
        }
        switch (u) {
          case LiteGraph.LEFT:
            N = c * -0.25;
            break;
          case LiteGraph.RIGHT:
            N = c * 0.25;
            break;
          case LiteGraph.UP:
            X = c * -0.25;
            break;
          case LiteGraph.DOWN:
            X = c * 0.25;
            break;
        }
        s.bezierCurveTo(
          t[0] + S,
          t[1] + G + d,
          r[0] + N,
          r[1] + X + d,
          r[0],
          r[1] + d
        );
      } else if (this.links_render_mode == LiteGraph.LINEAR_LINK) {
        s.moveTo(t[0], t[1] + d);
        let S = 0, G = 0, N = 0, X = 0;
        switch (l) {
          case LiteGraph.LEFT:
            S = -1;
            break;
          case LiteGraph.RIGHT:
            S = 1;
            break;
          case LiteGraph.UP:
            G = -1;
            break;
          case LiteGraph.DOWN:
            G = 1;
            break;
        }
        switch (u) {
          case LiteGraph.LEFT:
            N = -1;
            break;
          case LiteGraph.RIGHT:
            N = 1;
            break;
          case LiteGraph.UP:
            X = -1;
            break;
          case LiteGraph.DOWN:
            X = 1;
            break;
        }
        var f = 15;
        s.lineTo(
          t[0] + S * f,
          t[1] + G * f + d
        ), s.lineTo(
          r[0] + N * f,
          r[1] + X * f + d
        ), s.lineTo(r[0], r[1] + d);
      } else if (this.links_render_mode == LiteGraph.STRAIGHT_LINK) {
        s.moveTo(t[0], t[1]);
        var _ = t[0], g = t[1], L = r[0], b = r[1];
        l == LiteGraph.RIGHT ? _ += 10 : g += 10, u == LiteGraph.LEFT ? L -= 10 : b -= 10, s.lineTo(_, g), s.lineTo((_ + L) * 0.5, g), s.lineTo((_ + L) * 0.5, b), s.lineTo(L, b), s.lineTo(r[0], r[1]);
      } else
        return;
    }
    this.render_connections_border && this.ds.scale > 0.6 && !a && (s.strokeStyle = "rgba(0,0,0,0.5)", s.stroke()), s.lineWidth = this.connections_width, s.fillStyle = s.strokeStyle = h, s.stroke();
    var m = this.computeConnectionPoint(t, r, 0.5, l, u);
    if (n && n._pos && (n._pos[0] = m[0], n._pos[1] = m[1]), this.ds.scale >= 0.6 && this.highquality_render && u != LiteGraph.CENTER) {
      if (this.render_connection_arrows) {
        var T = this.computeConnectionPoint(
          t,
          r,
          0.25,
          l,
          u
        ), E = this.computeConnectionPoint(
          t,
          r,
          0.26,
          l,
          u
        ), k = this.computeConnectionPoint(
          t,
          r,
          0.75,
          l,
          u
        ), D = this.computeConnectionPoint(
          t,
          r,
          0.76,
          l,
          u
        ), P = 0, A = 0;
        this.render_curved_connections ? (P = -Math.atan2(E[0] - T[0], E[1] - T[1]), A = -Math.atan2(D[0] - k[0], D[1] - k[1])) : A = P = r[1] > t[1] ? 0 : Math.PI, s.save(), s.translate(T[0], T[1]), s.rotate(P), s.beginPath(), s.moveTo(-5, -3), s.lineTo(0, 7), s.lineTo(5, -3), s.fill(), s.restore(), s.save(), s.translate(k[0], k[1]), s.rotate(A), s.beginPath(), s.moveTo(-5, -3), s.lineTo(0, 7), s.lineTo(5, -3), s.fill(), s.restore();
      }
      s.beginPath(), s.arc(m[0], m[1], 5, 0, Math.PI * 2), s.fill();
    }
    if (o) {
      s.fillStyle = h;
      for (let O = 0; O < 5; ++O) {
        var C = (LiteGraph.getTime() * 1e-3 + O * 0.2) % 1;
        m = this.computeConnectionPoint(
          t,
          r,
          C,
          l,
          u
        ), s.beginPath(), s.arc(m[0], m[1], 5, 0, 2 * Math.PI), s.fill();
      }
    }
  }
  // returns the link center point based on curvature
  computeConnectionPoint(s, t, r, n, a) {
    n = n || LiteGraph.RIGHT, a = a || LiteGraph.LEFT;
    var o = LiteGraph.distance(s, t), h = s, l = [s[0], s[1]], u = [t[0], t[1]], p = t;
    switch (n) {
      case LiteGraph.LEFT:
        l[0] += o * -0.25;
        break;
      case LiteGraph.RIGHT:
        l[0] += o * 0.25;
        break;
      case LiteGraph.UP:
        l[1] += o * -0.25;
        break;
      case LiteGraph.DOWN:
        l[1] += o * 0.25;
        break;
    }
    switch (a) {
      case LiteGraph.LEFT:
        u[0] += o * -0.25;
        break;
      case LiteGraph.RIGHT:
        u[0] += o * 0.25;
        break;
      case LiteGraph.UP:
        u[1] += o * -0.25;
        break;
      case LiteGraph.DOWN:
        u[1] += o * 0.25;
        break;
    }
    var c = (1 - r) * (1 - r) * (1 - r), d = 3 * ((1 - r) * (1 - r)) * r, f = 3 * (1 - r) * (r * r), _ = r * r * r, g = c * h[0] + d * l[0] + f * u[0] + _ * p[0], L = c * h[1] + d * l[1] + f * u[1] + _ * p[1];
    return [g, L];
  }
  drawExecutionOrder(s) {
    s.shadowColor = "transparent", s.globalAlpha = 0.25, s.textAlign = "center", s.strokeStyle = "white", s.globalAlpha = 0.75;
    var t = this.visible_nodes;
    for (let n = 0; n < t.length; ++n) {
      var r = t[n];
      s.fillStyle = "black", s.fillRect(
        r.pos[0] - LiteGraph.NODE_TITLE_HEIGHT,
        r.pos[1] - LiteGraph.NODE_TITLE_HEIGHT,
        LiteGraph.NODE_TITLE_HEIGHT,
        LiteGraph.NODE_TITLE_HEIGHT
      ), r.order == 0 && s.strokeRect(
        r.pos[0] - LiteGraph.NODE_TITLE_HEIGHT + 0.5,
        r.pos[1] - LiteGraph.NODE_TITLE_HEIGHT + 0.5,
        LiteGraph.NODE_TITLE_HEIGHT,
        LiteGraph.NODE_TITLE_HEIGHT
      ), s.fillStyle = "#FFF", s.fillText(
        r.order,
        r.pos[0] + LiteGraph.NODE_TITLE_HEIGHT * -0.5,
        r.pos[1] - 6
      );
    }
    s.globalAlpha = 1;
  }
  /**
   * draws the widgets stored inside a node
   * @method drawNodeWidgets
   **/
  drawNodeWidgets(s, t, r, n) {
    if (!s.widgets || !s.widgets.length)
      return 0;
    var a = s.size[0], o = s.widgets;
    t += 2;
    var h = LiteGraph.NODE_WIDGET_HEIGHT, l = !this.lowQualityRenderingRequired(0.5);
    r.save(), r.globalAlpha = this.editor_alpha;
    var u = LiteGraph.WIDGET_OUTLINE_COLOR, p = LiteGraph.WIDGET_BGCOLOR, c = LiteGraph.WIDGET_TEXT_COLOR, d = LiteGraph.WIDGET_SECONDARY_TEXT_COLOR, f = 15;
    for (let D = 0; D < o.length; ++D) {
      var _ = o[D], g = t;
      _.y && (g = _.y), _.last_y = g, r.strokeStyle = u, r.fillStyle = "#222", r.textAlign = "left", _.disabled && (r.globalAlpha *= 0.5);
      var L = _.width || a;
      switch (_.type) {
        case "button":
          _.clicked && (r.fillStyle = "#AAA", _.clicked = !1, this.dirty_canvas = !0), r.fillRect(f, g, L - f * 2, h), l && !_.disabled && r.strokeRect(f, g, L - f * 2, h), l && (r.textAlign = "center", r.fillStyle = c, r.fillText(_.label || _.name, L * 0.5, g + h * 0.7));
          break;
        case "toggle":
          if (r.textAlign = "left", r.strokeStyle = u, r.fillStyle = p, r.beginPath(), l ? r.roundRect(f, g, L - f * 2, h, [h * 0.5]) : r.rect(f, g, L - f * 2, h), r.fill(), l && !_.disabled && r.stroke(), r.fillStyle = _.value ? "#89A" : "#333", r.beginPath(), r.arc(L - f * 2, g + h * 0.5, h * 0.36, 0, Math.PI * 2), r.fill(), l) {
            r.fillStyle = d;
            const P = _.label || _.name;
            P != null && r.fillText(P, f * 2, g + h * 0.7), r.fillStyle = _.value ? c : d, r.textAlign = "right", r.fillText(
              _.value ? _.options.on || "true" : _.options.off || "false",
              L - 40,
              g + h * 0.7
            );
          }
          break;
        case "slider":
          r.fillStyle = p, r.fillRect(f, g, L - f * 2, h);
          var b = _.options.max - _.options.min, m = (_.value - _.options.min) / b;
          if (m < 0 && (m = 0), m > 1 && (m = 1), r.fillStyle = _.options.hasOwnProperty("slider_color") ? _.options.slider_color : n == _ ? "#89A" : "#678", r.fillRect(f, g, m * (L - f * 2), h), l && !_.disabled && r.strokeRect(f, g, L - f * 2, h), _.marker) {
            var T = (_.marker - _.options.min) / b;
            T < 0 && (T = 0), T > 1 && (T = 1), r.fillStyle = _.options.hasOwnProperty("marker_color") ? _.options.marker_color : "#AA9", r.fillRect(f + T * (L - f * 2), g, 2, h);
          }
          l && (r.textAlign = "center", r.fillStyle = c, r.fillText(
            _.label || _.name + "  " + Number(_.value).toFixed(_.options.precision != null ? _.options.precision : 3),
            L * 0.5,
            g + h * 0.7
          ));
          break;
        case "number":
        case "combo":
          if (r.textAlign = "left", r.strokeStyle = u, r.fillStyle = p, r.beginPath(), l ? r.roundRect(f, g, L - f * 2, h, [h * 0.5]) : r.rect(f, g, L - f * 2, h), r.fill(), l)
            if (_.disabled || r.stroke(), r.fillStyle = c, _.disabled || (r.beginPath(), r.moveTo(f + 16, g + 5), r.lineTo(f + 6, g + h * 0.5), r.lineTo(f + 16, g + h - 5), r.fill(), r.beginPath(), r.moveTo(L - f - 16, g + 5), r.lineTo(L - f - 6, g + h * 0.5), r.lineTo(L - f - 16, g + h - 5), r.fill()), r.fillStyle = d, r.fillText(_.label || _.name, f * 2 + 5, g + h * 0.7), r.fillStyle = c, r.textAlign = "right", _.type == "number")
              r.fillText(
                Number(_.value).toFixed(_.options.precision !== void 0 ? _.options.precision : 3),
                L - f * 2 - 20,
                g + h * 0.7
              );
            else {
              var E = _.value;
              if (_.options.values) {
                var k = _.options.values;
                k.constructor === Function && (k = k()), k && k.constructor !== Array && (E = k[_.value]);
              }
              r.fillText(
                E,
                L - f * 2 - 20,
                g + h * 0.7
              );
            }
          break;
        case "string":
        case "text":
          if (r.textAlign = "left", r.strokeStyle = u, r.fillStyle = p, r.beginPath(), l ? r.roundRect(f, g, L - f * 2, h, [h * 0.5]) : r.rect(f, g, L - f * 2, h), r.fill(), l) {
            _.disabled || r.stroke(), r.save(), r.beginPath(), r.rect(f, g, L - f * 2, h), r.clip(), r.fillStyle = d;
            const P = _.label || _.name;
            P != null && r.fillText(P, f * 2, g + h * 0.7), r.fillStyle = c, r.textAlign = "right", r.fillText(String(_.value).substr(0, 30), L - f * 2, g + h * 0.7), r.restore();
          }
          break;
        default:
          _.draw && _.draw(r, s, L, g, h);
          break;
      }
      t += (_.computeSize ? _.computeSize(L)[1] : h) + 4, r.globalAlpha = this.editor_alpha;
    }
    r.restore(), r.textAlign = "left";
  }
  /**
   * process an event on widgets
   * @method processNodeWidgets
   **/
  processNodeWidgets(node, pos, event, active_widget) {
    if (!node.widgets || !node.widgets.length || !this.allow_interaction && !node.flags.allow_interaction)
      return null;
    var x = pos[0] - node.pos[0], y = pos[1] - node.pos[1], width = node.size[0], deltaX = event.deltaX || event.deltax || 0, that = this, ref_window = this.getCanvasWindow();
    for (let i = 0; i < node.widgets.length; ++i) {
      var w = node.widgets[i];
      if (!(!w || w.disabled)) {
        var widget_height = w.computeSize ? w.computeSize(width)[1] : LiteGraph.NODE_WIDGET_HEIGHT, widget_width = w.width || width;
        if (!(w != active_widget && (x < 6 || x > widget_width - 12 || y < w.last_y || y > w.last_y + widget_height || w.last_y === void 0))) {
          var old_value = w.value;
          switch (w.type) {
            case "button":
              event.type === "pointerdown" && (w.callback && setTimeout(function() {
                w.callback(w, that, node, pos, event);
              }, 20), w.clicked = !0, this.dirty_canvas = !0);
              break;
            case "slider":
              var nvalue = LiteGraph.clamp((x - 15) / (widget_width - 30), 0, 1);
              if (w.options.read_only) break;
              w.value = w.options.min + (w.options.max - w.options.min) * nvalue, old_value != w.value && setTimeout(function() {
                inner_value_change(w, w.value, old_value);
              }, 20), this.dirty_canvas = !0;
              break;
            case "number":
            case "combo":
            case "enum":
              if (event.type == "pointermove" && w.type == "number")
                deltaX && (w.value += deltaX * 0.1 * (w.options.step || 1)), w.options.min != null && w.value < w.options.min && (w.value = w.options.min), w.options.max != null && w.value > w.options.max && (w.value = w.options.max);
              else if (event.type == "pointerdown") {
                var values = w.options.values;
                values && values.constructor === Function && (values = w.options.values(w, node));
                var values_list = null;
                w.type != "number" && (values_list = values.constructor === Array ? values : Object.keys(values));
                let s = x < 40 ? -1 : x > widget_width - 40 ? 1 : 0;
                if (w.type == "number")
                  w.value += s * 0.1 * (w.options.step || 1), w.options.min != null && w.value < w.options.min && (w.value = w.options.min), w.options.max != null && w.value > w.options.max && (w.value = w.options.max);
                else if (s) {
                  var index = -1;
                  this.last_mouseclick = 0, values.constructor === Object ? index = values_list.indexOf(String(w.value)) + s : index = values_list.indexOf(w.value) + s, index >= values_list.length && (index = values_list.length - 1), index < 0 && (index = 0), values.constructor === Array ? w.value = values[index] : w.value = index;
                } else {
                  let t = function(r) {
                    return values != values_list && (r = text_values.indexOf(r)), this.value = r, inner_value_change(this, r, old_value), that.dirty_canvas = !0, !1;
                  };
                  var text_values = values != values_list ? Object.values(values) : values;
                  new LiteGraph.ContextMenu(
                    text_values,
                    {
                      scale: Math.max(1, this.ds.scale),
                      event,
                      className: "dark",
                      callback: t.bind(w)
                    },
                    ref_window
                  );
                }
              } else if (event.type == "pointerup" && w.type == "number") {
                let delta = x < 40 ? -1 : x > widget_width - 40 ? 1 : 0;
                event.click_time < 200 && delta == 0 && this.prompt(
                  "Value",
                  w.value,
                  function(v) {
                    var s;
                    if (/^[0-9+\-*/()\s]+|\d+\.\d+$/.test(v))
                      try {
                        v = eval(v);
                      } catch (t) {
                        (s = LiteGraph.warn) == null || s.call(LiteGraph, t);
                      }
                    this.value = Number(v), inner_value_change(this, this.value, old_value);
                  }.bind(w),
                  event
                );
              }
              old_value != w.value && setTimeout(
                function() {
                  inner_value_change(this, this.value, old_value);
                }.bind(w),
                20
              ), this.dirty_canvas = !0;
              break;
            case "toggle":
              event.type == "pointerdown" && (w.value = !w.value, setTimeout(function() {
                inner_value_change(w, w.value);
              }, 20));
              break;
            case "string":
            case "text":
              event.type == "pointerdown" && this.prompt(
                "Value",
                w.value,
                function(s) {
                  inner_value_change(this, s);
                }.bind(w),
                event,
                w.options ? w.options.multiline : !1
              );
              break;
            default:
              w.mouse && (this.dirty_canvas = w.mouse(event, [x, y], node));
              break;
          }
          return w;
        }
      }
    }
    function inner_value_change(s, t, r) {
      var n;
      (n = LiteGraph.debug) == null || n.call(LiteGraph, "inner_value_change for processNodeWidgets", s, t), r != w.value && (node.onWidgetChanged && node.onWidgetChanged(w.name, w.value, r, w), node.graph.onGraphChanged({ action: "widgetChanged", doSave: !0 })), s.type == "number" && (t = Number(t)), s.value = t, s.options && s.options.property && node.properties[s.options.property] !== void 0 && node.setProperty(s.options.property, t), s.callback && s.callback(s.value, that, node, pos, event);
    }
    return null;
  }
  /**
   * draws every group area in the background
   * @method drawGroups
   **/
  drawGroups(s, t) {
    if (this.graph) {
      var r = this.graph._groups;
      t.save(), t.globalAlpha = 0.5 * this.editor_alpha;
      for (let l = 0; l < r.length; ++l) {
        var n = r[l];
        if (LiteGraph.overlapBounding(this.visible_area, n._bounding)) {
          t.fillStyle = n.color || "#335", t.strokeStyle = n.color || "#335";
          var a = n._pos, o = n._size;
          t.globalAlpha = 0.25 * this.editor_alpha, t.beginPath(), t.rect(a[0] + 0.5, a[1] + 0.5, o[0], o[1]), t.fill(), t.globalAlpha = this.editor_alpha, t.stroke(), t.beginPath(), t.moveTo(a[0] + o[0], a[1] + o[1]), t.lineTo(a[0] + o[0] - 10, a[1] + o[1]), t.lineTo(a[0] + o[0], a[1] + o[1] - 10), t.fill();
          var h = n.font_size || LiteGraph.DEFAULT_GROUP_FONT_SIZE;
          t.font = h + "px Arial", t.textAlign = "left", t.fillText(n.title, a[0] + 4, a[1] + h);
        }
      }
      t.restore();
    }
  }
  adjustNodesSize() {
    var s = this.graph._nodes;
    for (let t = 0; t < s.length; ++t)
      s[t].size = s[t].computeSize();
    this.setDirty(!0, !0);
  }
  /**
   * resizes the canvas to a given size, if no size is passed, then it tries to fill the parentNode
   * @method resize
   **/
  resize(s, t) {
    if (!s && !t) {
      var r = this.canvas.parentNode;
      s = r.offsetWidth, t = r.offsetHeight;
    }
    this.canvas.width == s && this.canvas.height == t || (this.canvas.width = s, this.canvas.height = t, this.bgcanvas.width = this.canvas.width, this.bgcanvas.height = this.canvas.height, this.setDirty(!0, !0));
  }
  /**
   * switches to live mode (node shapes are not rendered, only the content)
   * this feature was designed when graphs where meant to create user interfaces
   * @method switchLiveMode
   **/
  switchLiveMode(s) {
    if (!s) {
      this.live_mode = !this.live_mode, this.dirty_canvas = !0, this.dirty_bgcanvas = !0;
      return;
    }
    var t = this, r = this.live_mode ? 1.1 : 0.9;
    this.live_mode && (this.live_mode = !1, this.editor_alpha = 0.1);
    var n = setInterval(function() {
      t.editor_alpha *= r, t.dirty_canvas = !0, t.dirty_bgcanvas = !0, r < 1 && t.editor_alpha < 0.01 && (clearInterval(n), r < 1 && (t.live_mode = !0)), r > 1 && t.editor_alpha > 0.99 && (clearInterval(n), t.editor_alpha = 1);
    }, 1);
  }
  /* @TODO: Validate this is never called
  onNodeSelectionChange() {
      return; // disabled
  }
  */
  /* this is an implementation for touch not in production and not ready
      */
  /* LGraphCanvas.prototype.touchHandler = function(event) {
          //alert("foo");
          var touches = event.changedTouches,
              first = touches[0],
              type = "";
  
          switch (event.type) {
              case "touchstart":
                  type = "pointerdown";
                  break;
              case "touchmove":
                  type = "pointermove";
                  break;
              case "touchend":
                  type = "pointerup";
                  break;
              default:
                  return;
          }
  
          //initMouseEvent(type, canBubble, cancelable, view, clickCount,
          //           screenX, screenY, clientX, clientY, ctrlKey,
          //           altKey, shiftKey, metaKey, button, relatedTarget);
  
          // this is eventually a Dom object, get the LGraphCanvas back
          if(typeof this.getCanvasWindow == "undefined"){
              var window = this.lgraphcanvas.getCanvasWindow();
          }else{
              var window = this.getCanvasWindow();
          }
  
          var document = window.document;
  
          var simulatedEvent = document.createEvent("MouseEvent");
          simulatedEvent.initMouseEvent(
              type,
              true,
              true,
              window,
              1,
              first.screenX,
              first.screenY,
              first.clientX,
              first.clientY,
              false,
              false,
              false,
              false,
              0, //left
              null
          );
          first.target.dispatchEvent(simulatedEvent);
          event.preventDefault();
      };*/
  /* CONTEXT MENU ********************/
  static onGroupAdd(s, t, r) {
    var n = _LGraphCanvas.active_canvas, a = new LiteGraph.LGraphGroup();
    a.pos = n.convertEventToCanvasOffset(r), n.graph.add(a);
  }
  /**
   * Determines the furthest nodes in each direction
   * @param nodes {LGraphNode[]} the nodes to from which boundary nodes will be extracted
   * @return {{left: LGraphNode, top: LGraphNode, right: LGraphNode, bottom: LGraphNode}}
   */
  static getBoundaryNodes(s) {
    let t = null, r = null, n = null, a = null;
    for (const o in s) {
      const h = s[o], [l, u] = h.pos, [p, c] = h.size;
      (t === null || u < t.pos[1]) && (t = h), (r === null || l + p > r.pos[0] + r.size[0]) && (r = h), (n === null || u + c > n.pos[1] + n.size[1]) && (n = h), (a === null || l < a.pos[0]) && (a = h);
    }
    return {
      top: t,
      right: r,
      bottom: n,
      left: a
    };
  }
  /**
   * Determines the furthest nodes in each direction for the currently selected nodes
   * @return {{left: LGraphNode, top: LGraphNode, right: LGraphNode, bottom: LGraphNode}}
   */
  boundaryNodesForSelection() {
    return _LGraphCanvas.getBoundaryNodes(Object.values(this.selected_nodes));
  }
  /**
   *
   * @param {LGraphNode[]} nodes a list of nodes
   * @param {"top"|"bottom"|"left"|"right"} direction Direction to align the nodes
   * @param {LGraphNode?} align_to Node to align to (if null, align to the furthest node in the given direction)
   */
  static alignNodes(s, t, r) {
    if (!s)
      return;
    const n = _LGraphCanvas.active_canvas;
    let a = [];
    r === void 0 ? a = _LGraphCanvas.getBoundaryNodes(s) : a = {
      top: r,
      right: r,
      bottom: r,
      left: r
    };
    for (const [o, h] of Object.entries(n.selected_nodes))
      switch (t) {
        case "right":
          h.pos[0] = a.right.pos[0] + a.right.size[0] - h.size[0];
          break;
        case "left":
          h.pos[0] = a.left.pos[0];
          break;
        case "top":
          h.pos[1] = a.top.pos[1];
          break;
        case "bottom":
          h.pos[1] = a.bottom.pos[1] + a.bottom.size[1] - h.size[1];
          break;
      }
    n.dirty_canvas = !0, n.dirty_bgcanvas = !0;
  }
  static onNodeAlign(s, t, r, n, a) {
    new LiteGraph.ContextMenu(["Top", "Bottom", "Left", "Right"], {
      event: r,
      callback: o,
      parentMenu: n
    });
    function o(h) {
      _LGraphCanvas.alignNodes(_LGraphCanvas.active_canvas.selected_nodes, h.toLowerCase(), a);
    }
  }
  static onGroupAlign(s, t, r, n) {
    new LiteGraph.ContextMenu(["Top", "Bottom", "Left", "Right"], {
      event: r,
      callback: a,
      parentMenu: n
    });
    function a(o) {
      _LGraphCanvas.alignNodes(_LGraphCanvas.active_canvas.selected_nodes, o.toLowerCase());
    }
  }
  static onMenuAdd(s, t, r, n, a) {
    var o = _LGraphCanvas.active_canvas, h = o.getCanvasWindow(), l = o.graph;
    if (!l)
      return;
    function u(p, c) {
      var d = LiteGraph.getNodeTypesCategories(o.filter || l.filter).filter(function(g) {
        return g.startsWith(p);
      }), f = [];
      d.map(function(g) {
        if (g) {
          var L = new RegExp("^(" + p + ")"), b = g.replace(L, "").split("/")[0], m = p === "" ? b + "/" : p + b + "/", T = b;
          T.indexOf("::") != -1 && (T = T.split("::")[1]);
          var E = f.findIndex(function(k) {
            return k.value === m;
          });
          E === -1 && f.push({
            value: m,
            content: T,
            has_submenu: !0,
            callback: function(k, D, P, A) {
              u(k.value, A);
            }
          });
        }
      });
      var _ = LiteGraph.getNodeTypesInCategory(p.slice(0, -1), o.filter || l.filter);
      _.map(function(g) {
        if (!g.skip_list) {
          var L = {
            value: g.type,
            content: g.title,
            has_submenu: !1,
            callback: function(b, m, T, E) {
              var k = E.getFirstEvent();
              o.graph.beforeChange();
              var D = LiteGraph.createNode(b.value);
              D && (D.pos = o.convertEventToCanvasOffset(k), o.graph.add(D)), a && a(D), o.graph.afterChange();
            }
          };
          f.push(L);
        }
      }), new LiteGraph.ContextMenu(f, { event: r, parentMenu: c }, h);
    }
    return u("", n), !1;
  }
  static onMenuCollapseAll() {
  }
  static onMenuNodeEdit() {
  }
  static showMenuNodeOptionalInputs(s, t, r, n, a) {
    var g;
    if (!a)
      return;
    var o = this, h = _LGraphCanvas.active_canvas, l = h.getCanvasWindow();
    t = a.optional_inputs, a.onGetInputs && (t = a.onGetInputs());
    var u = [];
    if (t)
      for (let L = 0; L < t.length; L++) {
        var p = t[L];
        if (!p) {
          u.push(null);
          continue;
        }
        var c = p[0];
        p[2] || (p[2] = {}), p[2].label && (c = p[2].label), p[2].removable = !0;
        var d = { content: c, value: p };
        p[1] == LiteGraph.ACTION && (d.className = "event"), u.push(d);
      }
    if (a.onMenuNodeInputs) {
      var f = a.onMenuNodeInputs(u);
      f && (u = f);
    }
    if (LiteGraph.do_add_triggers_slots && a.findInputSlot("onTrigger") == -1 && u.push({ content: "On Trigger", value: ["onTrigger", LiteGraph.EVENT, { nameLocked: !0, removable: !0 }], className: "event" }), !u.length) {
      LiteGraph.debug && ((g = LiteGraph.log) == null || g.call(LiteGraph, "no input entries"));
      return;
    }
    new LiteGraph.ContextMenu(
      u,
      {
        event: r,
        callback: _,
        parentMenu: n,
        node: a
      },
      l
    );
    function _(L, b, m) {
      var E;
      if (a && (L.callback && L.callback.call(o, a, L, b, m), L.value)) {
        a.graph.beforeChange();
        var T = {};
        L.value[2] && (T = Object.assign(T, L.value[2])), a.addInput(L.value[0], L.value[1], T), (E = a.onNodeInputAdd) == null || E.call(a, L.value), a.setDirtyCanvas(!0, !0), a.graph.afterChange();
      }
    }
    return !1;
  }
  static showMenuNodeOptionalOutputs(s, t, r, n, a) {
    if (!a)
      return;
    var o = this, h = _LGraphCanvas.active_canvas, l = h.getCanvasWindow();
    t = a.optional_outputs, a.onGetOutputs && (t = a.onGetOutputs());
    var u = [];
    if (t)
      for (let g = 0; g < t.length; g++) {
        var p = t[g];
        if (!p) {
          u.push(null);
          continue;
        }
        if (!(a.flags && a.flags.skip_repeated_outputs && a.findOutputSlot(p[0]) != -1)) {
          var c = p[0];
          p[2] || (p[2] = {}), p[2].label && (c = p[2].label), p[2].removable = !0;
          var d = { content: c, value: p };
          p[1] == LiteGraph.EVENT && (d.className = "event"), u.push(d);
        }
      }
    if (this.onMenuNodeOutputs && (u = this.onMenuNodeOutputs(u)), LiteGraph.do_add_triggers_slots && a.findOutputSlot("onExecuted") == -1 && u.push({
      content: "On Executed",
      value: [
        "onExecuted",
        LiteGraph.EVENT,
        {
          nameLocked: !0,
          removable: !0
        }
      ],
      className: "event"
    }), a.onMenuNodeOutputs) {
      var f = a.onMenuNodeOutputs(u);
      f && (u = f);
    }
    if (!u.length)
      return;
    new LiteGraph.ContextMenu(
      u,
      {
        event: r,
        callback: _,
        parentMenu: n,
        node: a
      },
      l
    );
    function _(g, L, b) {
      var k;
      if (a && (g.callback && g.callback.call(o, a, g, L, b), !!g.value)) {
        var m = g.value[1];
        if (m && (m.constructor === Object || m.constructor === Array)) {
          var T = [];
          for (let D in m)
            T.push({ content: D, value: m[D] });
          return new LiteGraph.ContextMenu(T, {
            event: L,
            callback: _,
            parentMenu: n,
            node: a
          }), !1;
        } else {
          a.graph.beforeChange();
          var E = {};
          g.value[2] && (E = Object.assign(E, g.value[2])), a.addOutput(g.value[0], g.value[1], E), (k = a.onNodeOutputAdd) == null || k.call(a, g.value), a.setDirtyCanvas(!0, !0), a.graph.afterChange();
        }
      }
    }
    return !1;
  }
  static onShowMenuNodeProperties(s, t, r, n, a) {
    if (!a || !a.properties)
      return;
    var o = _LGraphCanvas.active_canvas, h = o.getCanvasWindow(), l = [];
    for (let c in a.properties) {
      s = a.properties[c] !== void 0 ? a.properties[c] : " ", typeof s == "object" && (s = JSON.stringify(s));
      var u = a.getPropertyInfo(c);
      (u.type == "enum" || u.type == "combo") && (s = _LGraphCanvas.getPropertyPrintableValue(s, u.values)), s = _LGraphCanvas.decodeHTML(s), l.push({
        content: "<span class='property_name'>" + (u.label ? u.label : c) + "</span><span class='property_value'>" + s + "</span>",
        value: c
      });
    }
    if (!l.length)
      return;
    new LiteGraph.ContextMenu(
      l,
      {
        event: r,
        callback: p,
        parentMenu: n,
        allow_html: !0,
        node: a
      },
      h
    );
    function p(c) {
      if (a) {
        var d = this.getBoundingClientRect();
        o.showEditPropertyValue(a, c.value, { position: [d.left, d.top] });
      }
    }
    return !1;
  }
  static decodeHTML(s) {
    var t = document.createElement("div");
    return t.innerText = s, t.innerHTML;
  }
  static onMenuResizeNode(s, t, r, n, a) {
    if (!a)
      return;
    const o = (l) => {
      l.size = l.computeSize(), l.onResize && l.onResize(l.size);
    };
    var h = _LGraphCanvas.active_canvas;
    if (!h.selected_nodes || Object.keys(h.selected_nodes).length <= 1)
      o(a);
    else
      for (let l in h.selected_nodes)
        o(h.selected_nodes[l]);
    a.setDirtyCanvas(!0, !0);
  }
  showLinkMenu(s, t) {
    var r = this, n = r.graph.getNodeById(s.origin_id), a = r.graph.getNodeById(s.target_id), o = !1;
    n && n.outputs && n.outputs[s.origin_slot] && (o = n.outputs[s.origin_slot].type);
    var h = !1;
    a && a.outputs && a.outputs[s.target_slot] && (h = a.inputs[s.target_slot].type);
    var l = new LiteGraph.ContextMenu(options, {
      event: t,
      title: s.data != null ? s.data.constructor.name : null,
      callback: u
    });
    function u(p, c, d) {
      switch (p) {
        case "Add Node":
          _LGraphCanvas.onMenuAdd(null, null, d, l, function(f) {
            var _;
            (_ = LiteGraph.debug) == null || _.call(LiteGraph, "node autoconnect"), !(!f.inputs || !f.inputs.length || !f.outputs || !f.outputs.length) && n.connectByType(s.origin_slot, f, o) && (f.connectByType(s.target_slot, a, h), f.pos[0] -= f.size[0] * 0.5);
          });
          break;
        case "Delete":
          r.graph.removeLink(s.id);
          break;
      }
    }
    return !1;
  }
  createDefaultNodeForSlot(s = {}) {
    var g, L, b, m, T;
    var t = Object.assign(
      {
        nodeFrom: null,
        // input
        slotFrom: null,
        // input
        nodeTo: null,
        // output
        slotTo: null,
        // output
        position: [],
        // pass the event coords
        nodeType: null,
        // choose a nodetype to add, AUTO to set at first good
        posAdd: [0, 0],
        // adjust x,y
        posSizeFix: [0, 0]
        // alpha, adjust the position x,y based on the new node size w,h
      },
      s
    ), r = this, n = t.nodeFrom && t.slotFrom !== null, a = !n && t.nodeTo && t.slotTo !== null;
    if (!n && !a)
      return (g = LiteGraph.warn) == null || g.call(LiteGraph, "No data passed to createDefaultNodeForSlot " + t.nodeFrom + " " + t.slotFrom + " " + t.nodeTo + " " + t.slotTo), !1;
    if (!t.nodeType)
      return (L = LiteGraph.warn) == null || L.call(LiteGraph, "No type to createDefaultNodeForSlot"), !1;
    var o = n ? t.nodeFrom : t.nodeTo, h = n ? t.slotFrom : t.slotTo, l = !1;
    switch (typeof h) {
      case "string":
        l = n ? o.findOutputSlot(h, !1) : o.findInputSlot(h, !1), h = n ? o.outputs[h] : o.inputs[h];
        break;
      case "object":
        l = n ? o.findOutputSlot(h.name) : o.findInputSlot(h.name);
        break;
      case "number":
        l = h, h = n ? o.outputs[h] : o.inputs[h];
        break;
      default:
        return (b = LiteGraph.warn) == null || b.call(LiteGraph, "Cant get slot information " + h), !1;
    }
    (h === !1 || l === !1) && ((m = LiteGraph.warn) == null || m.call(LiteGraph, "createDefaultNodeForSlot bad slotX " + h + " " + l));
    var u = h.type == LiteGraph.EVENT ? "_event_" : h.type, p = n ? LiteGraph.slot_types_default_out : LiteGraph.slot_types_default_in;
    if (p && p[u]) {
      h.link;
      var c = !1;
      if (typeof p[u] == "object") {
        for (var d in p[u])
          if (t.nodeType == p[u][d] || t.nodeType == "AUTO") {
            c = p[u][d];
            break;
          }
      } else
        (t.nodeType == p[u] || t.nodeType == "AUTO") && (c = p[u]);
      if (c) {
        var f = !1;
        typeof c == "object" && c.node && (f = c, c = c.node);
        var _ = LiteGraph.createNode(c);
        if (_) {
          if (f) {
            if (f.properties)
              for (const [E, k] of Object.entries(f.properties))
                _.addProperty(E, k);
            f.inputs && (_.inputs = [], Object.values(f.inputs).forEach((E) => {
              _.addOutput(E[0], E[1]);
            })), f.outputs && (_.outputs = [], Object.values(f.outputs).forEach((E) => {
              _.addOutput(E[0], E[1]);
            })), f.title && (_.title = f.title), f.json && _.configure(f.json);
          }
          return r.graph.add(_), _.pos = [
            t.position[0] + t.posAdd[0] + (t.posSizeFix[0] ? t.posSizeFix[0] * _.size[0] : 0),
            t.position[1] + t.posAdd[1] + (t.posSizeFix[1] ? t.posSizeFix[1] * _.size[1] : 0)
          ], n ? t.nodeFrom.connectByType(l, _, u) : t.nodeTo.connectByTypeOutput(l, _, u), !0;
        } else
          (T = LiteGraph.warn) == null || T.call(LiteGraph, "failed creating " + c);
      }
    }
    return !1;
  }
  showConnectionMenu(s = {}) {
    var f, _;
    var t = Object.assign({
      nodeFrom: null,
      // input
      slotFrom: null,
      // input
      nodeTo: null,
      // output
      slotTo: null,
      // output
      e: null
    }, s), r = this, n = t.nodeFrom && t.slotFrom, a = !n && t.nodeTo && t.slotTo;
    if (!n && !a)
      return (f = LiteGraph.warn) == null || f.call(LiteGraph, "No data passed to showConnectionMenu"), !1;
    var o = n ? t.nodeFrom : t.nodeTo, h = n ? t.slotFrom : t.slotTo, l = !1;
    switch (typeof h) {
      case "string":
        l = n ? o.findOutputSlot(h, !1) : o.findInputSlot(h, !1), h = n ? o.outputs[h] : o.inputs[h];
        break;
      case "object":
        l = n ? o.findOutputSlot(h.name) : o.findInputSlot(h.name);
        break;
      case "number":
        l = h, h = n ? o.outputs[h] : o.inputs[h];
        break;
      default:
        return (_ = LiteGraph.warn) == null || _.call(LiteGraph, "Cant get slot information " + h), !1;
    }
    var u = ["Add Node", null];
    r.allow_searchbox && (u.push("Search"), u.push(null));
    const p = h.type === LiteGraph.EVENT ? "_event_" : h.type, c = n ? LiteGraph.slot_types_default_out : LiteGraph.slot_types_default_in;
    if (c && c[p]) {
      const g = c[p];
      Array.isArray(g) || typeof g == "object" ? Object.values(g).forEach((L) => {
        u.push(L);
      }) : u.push(g);
    }
    var d = new LiteGraph.ContextMenu(u, {
      event: t.e,
      title: (h && h.name != "" ? h.name + (p ? " | " : "") : "") + (h && p ? p : ""),
      callback: (g, L, b) => {
        const m = {
          "Add Node": () => {
            _LGraphCanvas.onMenuAdd(null, null, b, d, (T) => {
              n ? t.nodeFrom.connectByType(l, T, p) : t.nodeTo.connectByTypeOutput(l, T, p);
            });
          },
          Search: () => {
            n ? r.showSearchBox(b, { node_from: t.nodeFrom, slot_from: h, type_filter_in: p }) : r.showSearchBox(b, { node_to: t.nodeTo, slot_from: h, type_filter_out: p });
          },
          default: () => {
            r.createDefaultNodeForSlot(Object.assign(t, { position: [t.e.canvasX, t.e.canvasY], nodeType: g }));
          }
        };
        (m[g] || m.default)();
      }
    });
    return !1;
  }
  // TODO refactor :: this is used fot title but not for properties!
  static onShowPropertyEditor(s, t, r, n, a) {
    var o = s.property || "title", h = a[o], l = document.createElement("div");
    l.is_modified = !1, l.className = "graphdialog", l.innerHTML = "<span class='name'></span><input autofocus type='text' class='value'/><button>OK</button>", l.close = () => {
      var E;
      (E = l.parentNode) == null || E.removeChild(l);
    };
    var u = l.querySelector(".name");
    u.innerText = o;
    var p = l.querySelector(".value");
    const c = () => {
      p && T(p.value);
    };
    p && (p.value = h, p.addEventListener("blur", function(E) {
      this.focus();
    }), p.addEventListener("keydown", function(E) {
      if (l.is_modified = !0, E.keyCode == 27)
        l.close();
      else if (E.keyCode == 13)
        c();
      else if (E.keyCode != 13 && E.target.localName != "textarea")
        return;
      E.preventDefault(), E.stopPropagation();
    }));
    var d = _LGraphCanvas.active_canvas, f = d.canvas, _ = f.getBoundingClientRect(), g = -20, L = -20;
    _ && (g -= _.left, L -= _.top), event ? (l.style.left = event.clientX + g + "px", l.style.top = event.clientY + L + "px") : (l.style.left = f.width * 0.5 + g + "px", l.style.top = f.height * 0.5 + L + "px");
    var b = l.querySelector("button");
    b.addEventListener("click", c), f.parentNode.appendChild(l), p && p.focus();
    let m = null;
    l.addEventListener("pointerleave", (E) => {
      LiteGraph.dialog_close_on_mouse_leave && !l.is_modified && (m = setTimeout(l.close, LiteGraph.dialog_close_on_mouse_leave_delay));
    }), l.addEventListener("pointerenter", (E) => {
      LiteGraph.dialog_close_on_mouse_leave && m && clearTimeout(m);
    });
    const T = (E) => {
      var k;
      switch (s.type) {
        case "Number":
          E = Number(E);
          break;
        case "Boolean":
          E = !!E;
          break;
      }
      a[o] = E, (k = l.parentNode) == null || k.removeChild(l), a.setDirtyCanvas(!0, !0);
    };
  }
  // refactor: there are different dialogs, some uses createDialog some dont
  // prompt v2
  prompt(s = "", t, r, n, a) {
    var m;
    var o = document.createElement("div");
    o.is_modified = !1, o.className = "graphdialog rounded", a ? o.innerHTML = "<span class='name'></span> <textarea autofocus class='value'></textarea><button class='rounded'>OK</button>" : o.innerHTML = "<span class='name'></span> <input autofocus type='text' class='value'/><button class='rounded'>OK</button>", o.close = () => {
      var T;
      this.prompt_box = null, (T = o.parentNode) == null || T.removeChild(o);
    };
    var h = _LGraphCanvas.active_canvas, l = h.canvas;
    l.parentNode.appendChild(o), this.ds.scale > 1 && (o.style.transform = `scale(${this.ds.scale})`);
    var u = null;
    o.addEventListener("pointerleave", (T) => {
      LiteGraph.dialog_close_on_mouse_leave && !o.is_modified && LiteGraph.dialog_close_on_mouse_leave && (u = setTimeout(o.close, LiteGraph.dialog_close_on_mouse_leave_delay));
    }), o.addEventListener("pointerenter", (T) => {
      LiteGraph.dialog_close_on_mouse_leave && u && clearTimeout(u);
    });
    const p = o.querySelectorAll("select");
    p && p.forEach((T) => {
      T.addEventListener("click", (E) => {
      }), T.addEventListener("blur", (E) => {
      }), T.addEventListener("change", (E) => {
      });
    }), (m = this.prompt_box) == null || m.close(), this.prompt_box = o;
    var c = o.querySelector(".name");
    c.innerText = s;
    var d = o.querySelector(".value");
    d.value = t;
    const f = d;
    f.addEventListener("keydown", (T) => {
      var E;
      switch (o.is_modified = !0, T.keyCode) {
        case 27:
          o.close();
          break;
        case 13:
          T.target.localName !== "textarea" && typeof r == "function" && (r(f.value), this.setDirty(!0)), (E = LiteGraph.debug) == null || E.call(LiteGraph, "prompt v2 ENTER", f.value, T.target.localName, r), o.close();
          break;
        default:
          return;
      }
      T.preventDefault(), T.stopPropagation();
    }), o.querySelector("button").addEventListener("click", (T) => {
      var E;
      typeof r == "function" && (r(f.value), this.setDirty(!0)), (E = LiteGraph.debug) == null || E.call(LiteGraph, "prompt v2 OK", f.value, r), o.close();
    });
    var g = l.getBoundingClientRect(), L = -20, b = -20;
    return g && (L -= g.left, b -= g.top), n ? (o.style.left = n.clientX + L + "px", o.style.top = n.clientY + b + "px") : (o.style.left = l.width * 0.5 + L + "px", o.style.top = l.height * 0.5 + b + "px"), setTimeout(function() {
      f.focus();
    }, 10), o;
  }
  showSearchBox(s, t) {
    var r = {
      slot_from: null,
      node_from: null,
      node_to: null,
      do_type_filter: LiteGraph.search_filter_enabled,
      // TODO check for registered_slot_[in/out]_types not empty // this will be checked for functionality enabled : filter on slot type, in and out
      type_filter_in: !1,
      // these are default: pass to set initially set values
      type_filter_out: !1,
      show_general_if_none_on_typefilter: !0,
      show_general_after_typefiltered: !0,
      hide_on_mouse_leave: LiteGraph.search_hide_on_mouse_leave,
      show_all_if_empty: !0,
      show_all_on_open: LiteGraph.search_show_all_on_open
    };
    t = Object.assign(r, t || {});
    var n = this, a = _LGraphCanvas.active_canvas, o = a.canvas, h = o.ownerDocument || document, l = document.createElement("div");
    if (l.className = "litegraph litesearchbox graphdialog rounded", l.innerHTML = "<span class='name'>Search</span> <input autofocus type='text' class='value rounded'/>", t.do_type_filter && (l.innerHTML += "<select class='slot_in_type_filter'><option value=''></option></select>", l.innerHTML += "<select class='slot_out_type_filter'><option value=''></option></select>"), t.show_close_button && (l.innerHTML += "<button class='close_searchbox close'>X</button>"), l.innerHTML += "<div class='helper'></div>", h.fullscreenElement ? h.fullscreenElement.appendChild(l) : (h.body.appendChild(l), h.body.style.overflow = "hidden"), t.do_type_filter)
      var u = l.querySelector(".slot_in_type_filter"), p = l.querySelector(".slot_out_type_filter");
    if (l.close = function() {
      n.search_box = null, this.blur(), o.focus(), h.body.style.overflow = "", setTimeout(function() {
        n.canvas.focus();
      }, 20), l.parentNode && l.parentNode.removeChild(l);
    }, this.ds.scale > 1 && (l.style.transform = `scale(${this.ds.scale})`), t.hide_on_mouse_leave) {
      var c = !1, d = null;
      l.addEventListener("pointerenter", function(C) {
        d && (clearTimeout(d), d = null);
      }), l.addEventListener("pointerleave", function(C) {
        c || (d = setTimeout(function() {
          l.close();
        }, 500));
      }), t.do_type_filter && (u.addEventListener("click", function(C) {
        c++;
      }), u.addEventListener("blur", function(C) {
        c = 0;
      }), u.addEventListener("change", function(C) {
        c = -1;
      }), p.addEventListener("click", function(C) {
        c++;
      }), p.addEventListener("blur", function(C) {
        c = 0;
      }), p.addEventListener("change", function(C) {
        c = -1;
      }));
    }
    n.search_box && n.search_box.close(), n.search_box = l;
    var f = l.querySelector(".helper"), _ = null, g = null, L = null, b = l.querySelector("input");
    if (b && (b.addEventListener("blur", function(C) {
      n.search_box && this.focus();
    }), b.addEventListener("keydown", function(C) {
      if (C.keyCode == 38)
        P(!1);
      else if (C.keyCode == 40)
        P(!0);
      else if (C.keyCode == 27)
        l.close();
      else if (C.keyCode == 13)
        A(), L ? D(L.innerHTML) : _ ? D(_) : l.close();
      else {
        g && clearInterval(g), g = setTimeout(A, 250);
        return;
      }
      return C.preventDefault(), C.stopPropagation(), C.stopImmediatePropagation(), !0;
    })), t.do_type_filter) {
      if (u) {
        let C = LiteGraph.slot_types_in, O = C.length;
        (t.type_filter_in == LiteGraph.EVENT || t.type_filter_in == LiteGraph.ACTION) && (t.type_filter_in = "_event_");
        for (let S = 0; S < O; S++) {
          let G = document.createElement("option");
          G.value = C[S], G.innerHTML = C[S], u.appendChild(G), t.type_filter_in !== !1 && (t.type_filter_in + "").toLowerCase() == (C[S] + "").toLowerCase() && (G.selected = !0);
        }
        u.addEventListener("change", function() {
          A();
        });
      }
      if (p) {
        let C = LiteGraph.slot_types_out, O = C.length;
        (t.type_filter_out == LiteGraph.EVENT || t.type_filter_out == LiteGraph.ACTION) && (t.type_filter_out = "_event_");
        for (let S = 0; S < O; S++) {
          let G = document.createElement("option");
          G.value = C[S], G.innerHTML = C[S], p.appendChild(G), t.type_filter_out !== !1 && (t.type_filter_out + "").toLowerCase() == (C[S] + "").toLowerCase() && (G.selected = !0);
        }
        p.addEventListener("change", function() {
          A();
        });
      }
    }
    if (t.show_close_button) {
      var m = l.querySelector(".close");
      m.addEventListener("click", l.close);
    }
    var T = o.getBoundingClientRect(), E = (s ? s.clientX : T.left + T.width * 0.5) - 80, k = (s ? s.clientY : T.top + T.height * 0.5) - 20;
    T.width - E < 470 && (E = T.width - 470), T.height - k < 220 && (k = T.height - 220), E < T.left + 20 && (E = T.left + 20), k < T.top + 20 && (k = T.top + 20), l.style.left = E + "px", l.style.top = k + "px", b.focus(), t.show_all_on_open && A();
    function D(C) {
      if (C)
        if (n.onSearchBoxSelection)
          n.onSearchBoxSelection(C, s, a);
        else {
          var O = LiteGraph.searchbox_extras[C.toLowerCase()];
          O && (C = O.type), a.graph.beforeChange();
          var S = LiteGraph.createNode(C);
          if (S && (S.pos = a.convertEventToCanvasOffset(s), a.graph.add(S, !1, { doProcessChange: !1 })), O && O.data) {
            if (O.data.properties)
              for (let N in O.data.properties)
                S.addProperty(N, O.data.properties[N]);
            if (O.data.inputs) {
              S.inputs = [];
              for (let N in O.data.inputs)
                S.addOutput(
                  O.data.inputs[N][0],
                  O.data.inputs[N][1]
                );
            }
            if (O.data.outputs) {
              S.outputs = [];
              for (let N in O.data.outputs)
                S.addOutput(
                  O.data.outputs[N][0],
                  O.data.outputs[N][1]
                );
            }
            O.data.title && (S.title = O.data.title), O.data.json && S.configure(O.data.json);
          }
          let G;
          if (t.node_from) {
            switch (G = !1, typeof t.slot_from) {
              case "string":
                G = t.node_from.findOutputSlot(t.slot_from);
                break;
              case "object":
                t.slot_from.name ? G = t.node_from.findOutputSlot(t.slot_from.name) : G = -1, G == -1 && typeof t.slot_from.slot_index != "undefined" && (G = t.slot_from.slot_index);
                break;
              case "number":
                G = t.slot_from;
                break;
              default:
                G = 0;
            }
            typeof t.node_from.outputs[G] != "undefined" && G !== !1 && G > -1 && t.node_from.connectByType(G, S, t.node_from.outputs[G].type);
          }
          if (t.node_to) {
            switch (G = !1, typeof t.slot_from) {
              case "string":
                G = t.node_to.findInputSlot(t.slot_from);
                break;
              case "object":
                t.slot_from.name ? G = t.node_to.findInputSlot(t.slot_from.name) : G = -1, G == -1 && typeof t.slot_from.slot_index != "undefined" && (G = t.slot_from.slot_index);
                break;
              case "number":
                G = t.slot_from;
                break;
              default:
                G = 0;
            }
            typeof t.node_to.inputs[G] != "undefined" && G !== !1 && G > -1 && t.node_to.connectByTypeOutput(G, S, t.node_to.inputs[G].type);
          }
          a.graph.afterChange();
        }
      l.close();
    }
    function P(C) {
      var O = L;
      L && L.classList.remove("selected"), L ? (L = C ? L.nextSibling : L.previousSibling, L || (L = O)) : L = C ? f.childNodes[0] : f.childNodes[f.childNodes.length], L && (L.classList.add("selected"), L.scrollIntoView({ block: "end", behavior: "smooth" }));
    }
    function A() {
      g = null;
      var C = b.value;
      if (_ = null, f.innerHTML = "", !C && !t.show_all_if_empty)
        return;
      if (n.onSearchBox) {
        var O = n.onSearchBox(f, C, a);
        if (O)
          for (let B = 0; B < O.length; ++B)
            $(O[B]);
      } else {
        let F = function(R, j = {}) {
          var Q = {
            skipFilter: !1,
            inTypeOverride: !1,
            outTypeOverride: !1
          }, I = Object.assign(Q, j), U = LiteGraph.registered_node_types[R];
          if (G && U.filter != G || (!t.show_all_if_empty || C) && R.toLowerCase().indexOf(C) === -1)
            return !1;
          if (t.do_type_filter && !I.skipFilter) {
            var Y = R;
            let ee;
            var H = B.value;
            if (I.inTypeOverride !== !1 && (H = I.inTypeOverride), B && H && LiteGraph.registered_slot_in_types[H] && LiteGraph.registered_slot_in_types[H].nodes && (ee = LiteGraph.registered_slot_in_types[H].nodes.includes(Y), ee === !1) || (H = z.value, I.outTypeOverride !== !1 && (H = I.outTypeOverride), z && H && LiteGraph.registered_slot_out_types[H] && LiteGraph.registered_slot_out_types[H].nodes && (ee = LiteGraph.registered_slot_out_types[H].nodes.includes(Y), ee === !1)))
              return !1;
          }
          return !0;
        };
        var S = 0;
        C = C.toLowerCase();
        var G = a.filter || a.graph.filter;
        let B, z;
        t.do_type_filter && n.search_box ? (B = n.search_box.querySelector(".slot_in_type_filter"), z = n.search_box.querySelector(".slot_out_type_filter")) : (B = !1, z = !1);
        for (let R in LiteGraph.searchbox_extras) {
          var N = LiteGraph.searchbox_extras[R];
          if (!((!t.show_all_if_empty || C) && N.desc.toLowerCase().indexOf(C) === -1)) {
            var X = LiteGraph.registered_node_types[N.type];
            if (!(X && X.filter != G) && F(N.type) && ($(N.desc, "searchbox_extra"), _LGraphCanvas.search_limit !== -1 && S++ > _LGraphCanvas.search_limit))
              break;
          }
        }
        var K = null;
        if (Array.prototype.filter)
          K = Object.keys(LiteGraph.registered_node_types).filter(F);
        else {
          K = [];
          for (let R in LiteGraph.registered_node_types)
            F(R) && K.push(R);
        }
        for (let R = 0; R < K.length && ($(K[R]), !(_LGraphCanvas.search_limit !== -1 && S++ > _LGraphCanvas.search_limit)); R++)
          ;
        if (t.show_general_after_typefiltered && (B.value || z.value)) {
          var q = [];
          for (let R in LiteGraph.registered_node_types)
            F(R, { inTypeOverride: B && B.value ? "*" : !1, outTypeOverride: z && z.value ? "*" : !1 }) && q.push(R);
          for (let R = 0; R < q.length && ($(q[R], "generic_type"), !(_LGraphCanvas.search_limit !== -1 && S++ > _LGraphCanvas.search_limit)); R++)
            ;
        }
        if ((B.value || z.value) && f.childNodes.length == 0 && t.show_general_if_none_on_typefilter) {
          var q = [];
          for (let j in LiteGraph.registered_node_types)
            F(j, { skipFilter: !0 }) && q.push(j);
          for (let j = 0; j < q.length && ($(q[j], "not_in_filter"), !(_LGraphCanvas.search_limit !== -1 && S++ > _LGraphCanvas.search_limit)); j++)
            ;
        }
      }
      function $(B, z) {
        var F = document.createElement("div");
        _ || (_ = B), F.innerText = B, F.dataset.type = escape(B), F.className = "litegraph lite-search-item", z && (F.className += " " + z), F.addEventListener("click", function(R) {
          D(unescape(this.dataset.type));
        }), f.appendChild(F);
      }
    }
    return l;
  }
  showEditPropertyValue(s, t, r) {
    var f, _, g, L, b;
    if (!s || s.properties[t] === void 0)
      return;
    r = r || {};
    var n = s.getPropertyInfo(t), a = n.type;
    let o;
    if (a == "string" || a == "number" || a == "array" || a == "object")
      o = "<input autofocus type='text' class='value'/>";
    else if ((a == "enum" || a == "combo") && n.values) {
      (f = LiteGraph.debug) == null || f.call(LiteGraph, "CREATING showEditPropertyValue ENUM COMBO", u, a, l), o = "<select autofocus type='text' class='value'>";
      for (let m in n.values) {
        var h = m;
        n.values.constructor === Array && (h = n.values[m]), o += "<option value='" + h + "' " + (h == s.properties[t] ? "selected" : "") + ">" + n.values[m] + "</option>";
      }
      o += "</select>";
    } else if (a == "boolean" || a == "toggle")
      o = "<input autofocus type='checkbox' class='value' " + (s.properties[t] ? "checked" : "") + "/>";
    else {
      (_ = LiteGraph.warn) == null || _.call(LiteGraph, "unknown type: " + a);
      return;
    }
    var l = this.createDialog(
      "<span class='name'>" + (n.label ? n.label : t) + "</span>" + o + "<button>OK</button>",
      r
    ), u = !1;
    (a == "enum" || a == "combo") && n.values ? ((g = LiteGraph.debug) == null || g.call(LiteGraph, "showEditPropertyValue ENUM COMBO", u, a, l), u = l.querySelector("select"), u.addEventListener("change", function(m) {
      var T;
      l.modified(), (T = LiteGraph.debug) == null || T.call(LiteGraph, "Enum change", u, n, m.target), d(m.target.value);
    })) : a == "boolean" || a == "toggle" ? ((L = LiteGraph.debug) == null || L.call(LiteGraph, "showEditPropertyValue TOGGLE", u, a, l), u = l.querySelector("input"), u && u.addEventListener("click", function(m) {
      l.modified(), d(!!u.checked);
    })) : (u = l.querySelector("input"), (b = LiteGraph.debug) == null || b.call(LiteGraph, "showEditPropertyValue", u, a, l), u && (u.addEventListener("blur", function(m) {
      this.focus();
    }), h = s.properties[t] !== void 0 ? s.properties[t] : "", a !== "string" && (h = JSON.stringify(h)), u.value = h, u.addEventListener("keydown", function(m) {
      if (m.keyCode == 27)
        l.close();
      else if (m.keyCode == 13)
        c();
      else if (m.keyCode != 13) {
        l.modified();
        return;
      }
      m.preventDefault(), m.stopPropagation();
    }))), u && u.focus();
    var p = l.querySelector("button");
    p.addEventListener("click", c);
    function c() {
      d(u.value);
    }
    function d(m) {
      var T;
      n && n.values && n.values.constructor === Object && n.values[m] != null && (m = n.values[m]), typeof s.properties[t] == "number" && (m = Number(m)), (a == "array" || a == "object") && (m = JSON.parse(m)), s.properties[t] = m, (T = s.graph) == null || T.onGraphChanged({ action: "propertyChanged", doSave: !0 }), s.onPropertyChanged && s.onPropertyChanged(t, m), r.onclose && r.onclose(), l.close(), s.setDirtyCanvas(!0, !0);
    }
    return l;
  }
  // TODO refactor, theer are different dialog, some uses createDialog, some dont
  createDialog(s, t) {
    var r = { checkForInput: !1, closeOnLeave: !0, closeOnLeave_checkModified: !0 };
    t = Object.assign(r, t || {});
    var n = document.createElement("div");
    n.className = "graphdialog", n.innerHTML = s, n.is_modified = !1;
    var a = this.canvas.getBoundingClientRect(), o = -20, h = -20;
    if (a && (o -= a.left, h -= a.top), t.position ? (o += t.position[0], h += t.position[1]) : t.event ? (o += t.event.clientX, h += t.event.clientY) : (o += this.canvas.width * 0.5, h += this.canvas.height * 0.5), n.style.left = o + "px", n.style.top = h + "px", this.canvas.parentNode.appendChild(n), t.checkForInput) {
      var l = [], u = !1;
      l = n.querySelectorAll("input"), l && l.forEach(function(f) {
        f.addEventListener("keydown", function(_) {
          if (n.modified(), _.keyCode == 27)
            n.close();
          else if (_.keyCode != 13)
            return;
          _.preventDefault(), _.stopPropagation();
        }), u || f.focus();
      });
    }
    n.modified = function() {
      n.is_modified = !0;
    }, n.close = function() {
      n.parentNode && n.parentNode.removeChild(n);
    };
    var p = null, c = !1;
    n.addEventListener("pointerleave", function(f) {
      c || (t.closeOnLeave || LiteGraph.dialog_close_on_mouse_leave) && !n.is_modified && LiteGraph.dialog_close_on_mouse_leave && (p = setTimeout(n.close, LiteGraph.dialog_close_on_mouse_leave_delay));
    }), n.addEventListener("pointerenter", function(f) {
      (t.closeOnLeave || LiteGraph.dialog_close_on_mouse_leave) && p && clearTimeout(p);
    });
    var d = n.querySelectorAll("select");
    return d && d.forEach(function(f) {
      f.addEventListener("click", function(_) {
        c++;
      }), f.addEventListener("blur", function(_) {
        c = 0;
      }), f.addEventListener("change", function(_) {
        c = -1;
      });
    }), n;
  }
  createPanel(s, t) {
    t = t || {};
    var r = t.window || window, n = document.createElement("div");
    if (n.className = "litegraph dialog", n.innerHTML = "<div class='dialog-header'><span class='dialog-title'></span></div><div class='dialog-content'></div><div style='display:none;' class='dialog-alt-content'></div><div class='dialog-footer'></div>", n.header = n.querySelector(".dialog-header"), t.width && (n.style.width = t.width + (t.width.constructor === Number ? "px" : "")), t.height && (n.style.height = t.height + (t.height.constructor === Number ? "px" : "")), t.closable) {
      var a = document.createElement("span");
      a.innerHTML = "&#10005;", a.classList.add("close"), a.addEventListener("click", function() {
        n.close();
      }), n.header.appendChild(a);
    }
    return n.title_element = n.querySelector(".dialog-title"), n.title_element.innerText = s, n.content = n.querySelector(".dialog-content"), n.alt_content = n.querySelector(".dialog-alt-content"), n.footer = n.querySelector(".dialog-footer"), n.close = function() {
      n.onClose && typeof n.onClose == "function" && n.onClose(), n.parentNode && n.parentNode.removeChild(n), this.parentNode && this.parentNode.removeChild(this);
    }, n.toggleAltContent = function(o) {
      let h, l;
      typeof o != "undefined" ? (h = o ? "block" : "none", l = o ? "none" : "block") : (h = n.alt_content.style.display != "block" ? "block" : "none", l = n.alt_content.style.display != "block" ? "none" : "block"), n.alt_content.style.display = h, n.content.style.display = l;
    }, n.toggleFooterVisibility = function(o) {
      let h;
      typeof o != "undefined" ? h = o ? "block" : "none" : h = n.footer.style.display != "block" ? "block" : "none", n.footer.style.display = h;
    }, n.clear = function() {
      this.content.innerHTML = "";
    }, n.addHTML = function(o, h, l) {
      var u = document.createElement("div");
      return h && (u.className = h), u.innerHTML = o, l ? n.footer.appendChild(u) : n.content.appendChild(u), u;
    }, n.addButton = function(o, h, l) {
      var u = document.createElement("button");
      return u.innerText = o, u.options = l, u.classList.add("btn"), u.addEventListener("click", h), n.footer.appendChild(u), u;
    }, n.addSeparator = function() {
      var o = document.createElement("div");
      o.className = "separator", n.content.appendChild(o);
    }, n.addWidget = function(o, h, l, u, p) {
      var g, L;
      u = u || {};
      var c = String(l);
      o = o.toLowerCase(), o == "number" && (c = l.toFixed(3));
      var d = document.createElement("div");
      d.className = "property", d.innerHTML = "<span class='property_name'></span><span class='property_value'></span>", d.querySelector(".property_name").innerText = u.label || h;
      var f = d.querySelector(".property_value");
      f.innerText = c, d.dataset.property = h, d.dataset.type = u.type || o, d.options = u, d.value = l, (g = LiteGraph.debug) == null || g.call(LiteGraph, "addWidget", o, l, f, u), o == "code" ? d.addEventListener("click", function(b) {
        n.inner_showCodePad(this.dataset.property);
      }) : o == "boolean" ? (d.classList.add("boolean"), l && d.classList.add("bool-on"), d.addEventListener("click", function() {
        var b = this.dataset.property;
        this.value = !this.value, this.classList.toggle("bool-on"), this.querySelector(".property_value").innerText = this.value ? "true" : "false", _(b, this.value);
      })) : o == "string" || o == "number" ? (f.setAttribute("contenteditable", !0), f.addEventListener("keydown", function(b) {
        b.code == "Enter" && (o != "string" || !b.shiftKey) && (b.preventDefault(), this.blur());
      }), f.addEventListener("blur", function() {
        var b = this.innerText, m = this.parentNode.dataset.property, T = this.parentNode.dataset.type;
        T == "number" && (b = Number(b)), _(m, b);
      })) : (o == "enum" || o == "combo") && (c = _LGraphCanvas.getPropertyPrintableValue(l, u.values), f.innerText = c, (L = LiteGraph.debug) == null || L.call(LiteGraph, "addWidget ENUM COMBO", o, c, f, u), f.addEventListener("click", function(b) {
        var m = u.values || [], T = this.parentNode.dataset.property, E = this;
        new LiteGraph.ContextMenu(
          m,
          {
            event: b,
            className: "dark",
            callback: k
          },
          r
        );
        function k(D) {
          return E.innerText = D, _(T, D), !1;
        }
      })), n.content.appendChild(d);
      function _(b, m) {
        var T;
        (T = LiteGraph.debug) == null || T.call(LiteGraph, "widgetInnerChange", b, m, u), u.callback && u.callback(b, m, u), p && p(b, m, u);
      }
      return d;
    }, n.onOpen && typeof n.onOpen == "function" && n.onOpen(), n;
  }
  static getPropertyPrintableValue(s, t) {
    if (!t || t.constructor === Array)
      return String(s);
    if (t.constructor === Object) {
      var r = "";
      for (var n in t)
        if (t[n] == s) {
          r = n;
          break;
        }
      return String(s) + " (" + r + ")";
    }
  }
  closePanels() {
    var s = document.querySelector("#node-panel");
    s && s.close(), s = document.querySelector("#option-panel"), s && s.close();
  }
  showShowGraphOptionsPanel(s, t) {
    var o, h, l, u;
    let r;
    if (this.constructor && this.constructor.name == "HTMLDivElement") {
      if (!((h = (o = t == null ? void 0 : t.event) == null ? void 0 : o.target) != null && h.lgraphcanvas)) {
        (l = LiteGraph.warn) == null || l.call(LiteGraph, "References not found to add optionPanel", s, t), LiteGraph.debug && ((u = LiteGraph.debug) == null || u.call(LiteGraph, "!obEv || !obEv.event || !obEv.event.target || !obEv.event.target.lgraphcanvas", t, t.event, t.event.target, t.event.target.lgraphcanvas));
        return;
      }
      r = t.event.target.lgraphcanvas;
    } else
      r = this;
    r.closePanels();
    var n = r.getCanvasWindow();
    panel = r.createPanel("Options", {
      closable: !0,
      window: n,
      onOpen: function() {
        r.OPTIONPANEL_IS_OPEN = !0;
      },
      onClose: function() {
        r.OPTIONPANEL_IS_OPEN = !1, r.options_panel = null;
      }
    }), r.options_panel = panel, panel.id = "option-panel", panel.classList.add("settings");
    function a() {
      panel.content.innerHTML = "";
      const p = (_, g, L) => {
        switch (_) {
          default:
            L && L.key && (_ = L.key), L.values && (g = Object.values(L.values).indexOf(g)), r[_] = g;
            break;
        }
      };
      var c = LiteGraph.availableCanvasOptions;
      c.sort();
      for (var d in c) {
        var f = c[d];
        panel.addWidget("boolean", f, r[f], { key: f, on: "True", off: "False" }, p);
      }
      panel.addWidget("combo", "Render mode", LiteGraph.LINK_RENDER_MODES[r.links_render_mode], { key: "links_render_mode", values: LiteGraph.LINK_RENDER_MODES }, p), panel.addSeparator(), panel.footer.innerHTML = "";
    }
    a(), r.canvas.parentNode.appendChild(panel);
  }
  showShowNodePanel(s) {
    this.SELECTED_NODE = s, this.closePanels();
    var t = this.getCanvasWindow(), r = this, n = this.createPanel(s.title || "", {
      closable: !0,
      window: t,
      onOpen: function() {
        r.NODEPANEL_IS_OPEN = !0;
      },
      onClose: function() {
        r.NODEPANEL_IS_OPEN = !1, r.node_panel = null;
      }
    });
    r.node_panel = n, n.id = "node-panel", n.node = s, n.classList.add("settings");
    function a() {
      n.content.innerHTML = "", n.addHTML("<span class='node_type'>" + s.type + "</span><span class='node_desc'>" + (s.constructor.desc || "") + "</span><span class='separator'></span>"), n.addHTML("<h3>Properties</h3>");
      const o = (c, d) => {
        var _, g;
        switch (r.graph.beforeChange(s), c) {
          case "Title":
            s.title = d;
            break;
          case "Mode":
            var f = Object.values(LiteGraph.NODE_MODES).indexOf(d);
            f >= 0 && LiteGraph.NODE_MODES[f] ? s.changeMode(f) : (_ = LiteGraph.warn) == null || _.call(LiteGraph, "unexpected mode: " + d);
            break;
          case "Color":
            _LGraphCanvas.node_colors[d] ? (s.color = _LGraphCanvas.node_colors[d].color, s.bgcolor = _LGraphCanvas.node_colors[d].bgcolor) : (g = LiteGraph.warn) == null || g.call(LiteGraph, "unexpected color: " + d);
            break;
          default:
            s.setProperty(c, d);
            break;
        }
        r.graph.afterChange(), r.dirty_canvas = !0;
      };
      n.addWidget("string", "Title", s.title, {}, o), n.addWidget("combo", "Mode", LiteGraph.NODE_MODES[s.mode], { values: LiteGraph.NODE_MODES }, o);
      var h = "";
      s.color !== void 0 && (h = Object.keys(_LGraphCanvas.node_colors).filter(function(c) {
        return _LGraphCanvas.node_colors[c].color == s.color;
      })), n.addWidget("combo", "Color", h, { values: Object.keys(_LGraphCanvas.node_colors) }, o);
      for (var l in s.properties) {
        var u = s.properties[l], p = s.getPropertyInfo(l);
        s.onAddPropertyToPanel && s.onAddPropertyToPanel(l, n, u, p, o) || n.addWidget(p.widget || p.type, l, u, p, o);
      }
      n.addSeparator(), s.onShowCustomPanelInfo && s.onShowCustomPanelInfo(n), n.footer.innerHTML = "", n.addButton("Delete", function() {
        s.block_delete || (s.graph.remove(s), n.close());
      }).classList.add("delete");
    }
    n.inner_showCodePad = function(o) {
      n.classList.remove("settings"), n.classList.add("centered"), n.alt_content.innerHTML = "<textarea class='code'></textarea>";
      var h = n.alt_content.querySelector("textarea"), l = () => {
        n.toggleAltContent(!1), n.toggleFooterVisibility(!0), h.parentNode.removeChild(h), n.classList.add("settings"), n.classList.remove("centered"), a();
      };
      h.value = s.properties[o], h.addEventListener("keydown", function(c) {
        c.code == "Enter" && c.ctrlKey && (s.setProperty(o, h.value), l());
      }), n.toggleAltContent(!0), n.toggleFooterVisibility(!1), h.style.height = "calc(100% - 40px)";
      var u = n.addButton("Assign", function() {
        s.setProperty(o, h.value), l();
      });
      n.alt_content.appendChild(u);
      var p = n.addButton("Close", l);
      p.style.float = "right", n.alt_content.appendChild(p);
    }, a(), this.canvas.parentNode.appendChild(n);
  }
  showSubgraphPropertiesDialog(s) {
    var h;
    (h = LiteGraph.log) == null || h.call(LiteGraph, "showing subgraph properties dialog");
    var t = this.canvas.parentNode.querySelector(".subgraph_dialog");
    t && t.close();
    var r = this.createPanel("Subgraph Inputs", { closable: !0, width: 500 });
    r.node = s, r.classList.add("subgraph_dialog");
    function n() {
      if (r.clear(), s.inputs)
        for (let c = 0; c < s.inputs.length; ++c) {
          var l = s.inputs[c];
          if (!l.not_subgraph_input) {
            var u = "<button>&#10005;</button> <span class='bullet_icon'></span><span class='name'></span><span class='type'></span>", p = r.addHTML(u, "subgraph_property");
            p.dataset.name = l.name, p.dataset.slot = c, p.querySelector(".name").innerText = l.name, p.querySelector(".type").innerText = l.type, p.querySelector("button").addEventListener("click", function(d) {
              s.removeInput(Number(this.parentNode.dataset.slot)), n();
            });
          }
        }
    }
    var a = " + <span class='label'>Name</span><input class='name'/><span class='label'>Type</span><input class='type'></input><button>+</button>", o = r.addHTML(a, "subgraph_property extra", !0);
    return o.querySelector("button").addEventListener("click", function(l) {
      var u = this.parentNode, p = u.querySelector(".name").value, c = u.querySelector(".type").value;
      !p || s.findInputSlot(p) != -1 || (s.addInput(p, c), u.querySelector(".name").value = "", u.querySelector(".type").value = "", n());
    }), n(), this.canvas.parentNode.appendChild(r), r;
  }
  showSubgraphPropertiesDialogRight(s) {
    var t = this.canvas.parentNode.querySelector(".subgraph_dialog");
    t && t.close();
    var r = this.createPanel("Subgraph Outputs", { closable: !0, width: 500 });
    r.node = s, r.classList.add("subgraph_dialog");
    function n() {
      if (r.clear(), s.outputs)
        for (let c = 0; c < s.outputs.length; ++c) {
          var l = s.outputs[c];
          if (!l.not_subgraph_output) {
            var u = "<button>&#10005;</button> <span class='bullet_icon'></span><span class='name'></span><span class='type'></span>", p = r.addHTML(u, "subgraph_property");
            p.dataset.name = l.name, p.dataset.slot = c, p.querySelector(".name").innerText = l.name, p.querySelector(".type").innerText = l.type, p.querySelector("button").addEventListener("click", function(d) {
              s.removeOutput(Number(this.parentNode.dataset.slot)), n();
            });
          }
        }
    }
    var a = " + <span class='label'>Name</span><input class='name'/><span class='label'>Type</span><input class='type'></input><button>+</button>", o = r.addHTML(a, "subgraph_property extra", !0);
    o.querySelector(".name").addEventListener("keydown", function(l) {
      e.keyCode == 13 && h.apply(this);
    }), o.querySelector("button").addEventListener("click", function(l) {
      h.apply(this);
    });
    function h() {
      var l = this.parentNode, u = l.querySelector(".name").value, p = l.querySelector(".type").value;
      !u || s.findOutputSlot(u) != -1 || (s.addOutput(u, p), l.querySelector(".name").value = "", l.querySelector(".type").value = "", n());
    }
    return n(), this.canvas.parentNode.appendChild(r), r;
  }
  checkPanels() {
    if (this.canvas) {
      var s = this.canvas.parentNode.querySelectorAll(".litegraph.dialog");
      for (let r = 0; r < s.length; ++r) {
        var t = s[r];
        t.node && (!t.node.graph || t.graph != this.graph) && t.close();
      }
    }
  }
  static onMenuNodeCollapse(s, t, r, n, a) {
    a.graph.beforeChange(
      /* ?*/
    );
    var o = function(l) {
      l.collapse();
    }, h = _LGraphCanvas.active_canvas;
    if (!h.selected_nodes || Object.keys(h.selected_nodes).length <= 1)
      o(a);
    else
      for (let l in h.selected_nodes)
        o(h.selected_nodes[l]);
    a.graph.afterChange(
      /* ?*/
    );
  }
  static onMenuNodePin(s, t, r, n, a) {
    a.pin();
  }
  static onMenuNodeMode(s, t, r, n, a) {
    new LiteGraph.ContextMenu(
      LiteGraph.NODE_MODES,
      { event: r, callback: o, parentMenu: n, node: a }
    );
    function o(h) {
      if (!a)
        return;
      var l = Object.values(LiteGraph.NODE_MODES).indexOf(h);
      const u = (c) => {
        var d;
        l >= 0 && LiteGraph.NODE_MODES[l] ? c.changeMode(l) : ((d = LiteGraph.warn) == null || d.call(LiteGraph, "unexpected mode: " + h), c.changeMode(LiteGraph.ALWAYS));
      };
      var p = _LGraphCanvas.active_canvas;
      if (!p.selected_nodes || Object.keys(p.selected_nodes).length <= 1)
        u(a);
      else
        for (let c in p.selected_nodes)
          u(p.selected_nodes[c]);
    }
    return !1;
  }
  static onMenuNodeColors(s, t, r, n, a) {
    if (!a)
      throw new Error("no node for color");
    var o = [];
    o.push({
      value: null,
      content: "<span style='display: block; padding-left: 4px;'>No color</span>"
    });
    for (let l in _LGraphCanvas.node_colors) {
      let u = _LGraphCanvas.node_colors[l];
      s = {
        value: l,
        content: "<span style='display: block; color: #999; padding-left: 4px; border-left: 8px solid " + u.color + "; background-color:" + u.bgcolor + "'>" + l + "</span>"
      }, o.push(s);
    }
    new LiteGraph.ContextMenu(o, {
      event: r,
      callback: h,
      parentMenu: n,
      node: a
    });
    function h(l) {
      if (!a)
        return;
      let u = l.value ? _LGraphCanvas.node_colors[l.value] : null;
      const p = (d) => {
        u ? d.constructor === LiteGraph.LGraphGroup ? d.color = u.groupcolor : (d.color = u.color, d.bgcolor = u.bgcolor) : (delete d.color, delete d.bgcolor);
      };
      var c = _LGraphCanvas.active_canvas;
      if (!c.selected_nodes || Object.keys(c.selected_nodes).length <= 1)
        p(a);
      else
        for (let d in c.selected_nodes)
          p(c.selected_nodes[d]);
      a.setDirtyCanvas(!0, !0);
    }
    return !1;
  }
  static onMenuNodeShapes(s, t, r, n, a) {
    if (!a)
      throw new Error("no node passed");
    new LiteGraph.ContextMenu(LiteGraph.VALID_SHAPES, {
      event: r,
      callback: o,
      parentMenu: n,
      node: a
    });
    function o(h) {
      if (!a)
        return;
      a.graph.beforeChange(
        /* ?*/
      );
      const l = (p) => {
        p.shape = h;
      };
      var u = _LGraphCanvas.active_canvas;
      if (!u.selected_nodes || Object.keys(u.selected_nodes).length <= 1)
        l(a);
      else
        for (let p in u.selected_nodes)
          l(u.selected_nodes[p]);
      a.graph.afterChange(
        /* ?*/
      ), a.setDirtyCanvas(!0);
    }
    return !1;
  }
  static onMenuNodeRemove(s, t, r, n, a) {
    if (!a)
      throw new Error("no node passed");
    var o = a.graph;
    o.beforeChange();
    const h = (u) => {
      u.removable !== !1 && o.remove(u);
    };
    var l = _LGraphCanvas.active_canvas;
    if (!l.selected_nodes || Object.keys(l.selected_nodes).length <= 1)
      h(a);
    else
      for (let u in l.selected_nodes)
        h(l.selected_nodes[u]);
    o.afterChange(), a.setDirtyCanvas(!0, !0);
  }
  static onMenuNodeToSubgraph(s, t, r, n, a) {
    var o = a.graph, h = _LGraphCanvas.active_canvas;
    if (h) {
      var l = Object.values(h.selected_nodes || {});
      l.length || (l = [a]);
      var u = LiteGraph.createNode("graph/subgraph");
      u.pos = a.pos.concat(), o.add(u), u.buildFromNodes(l), h.deselectAllNodes(), a.setDirtyCanvas(!0, !0);
    }
  }
  static onMenuNodeClone(s, t, r, n, a) {
    a.graph.beforeChange();
    var o = {};
    const h = (u) => {
      if (u.clonable !== !1) {
        var p = u.clone();
        p && (p.pos = [u.pos[0] + 5, u.pos[1] + 5], u.graph.add(p), o[p.id] = p);
      }
    };
    var l = _LGraphCanvas.active_canvas;
    if (!l.selected_nodes || Object.keys(l.selected_nodes).length <= 1)
      h(a);
    else
      for (let u in l.selected_nodes)
        h(l.selected_nodes[u]);
    Object.keys(o).length && l.selectNodes(o), a.graph.afterChange(), a.setDirtyCanvas(!0, !0);
  }
  getCanvasMenuOptions() {
    var s = null;
    if (this.getMenuOptions ? s = this.getMenuOptions() : (s = [
      {
        content: "Add Node",
        has_submenu: !0,
        callback: _LGraphCanvas.onMenuAdd
      },
      { content: "Add Group", callback: _LGraphCanvas.onGroupAdd }
      // { content: "Arrange", callback: that.graph.arrange },
      // {content:"Collapse All", callback: LGraphCanvas.onMenuCollapseAll }
    ], LiteGraph.showCanvasOptions && s.push({ content: "Options", callback: this.showShowGraphOptionsPanel }), Object.keys(this.selected_nodes).length > 1 && s.push({
      content: "Align",
      has_submenu: !0,
      callback: _LGraphCanvas.onGroupAlign
    }), this._graph_stack && this._graph_stack.length > 0 && s.push(null, {
      content: "Close subgraph",
      callback: this.closeSubgraph.bind(this)
    })), this.getExtraMenuOptions) {
      var t = this.getExtraMenuOptions(this, s);
      t && (s = s.concat(t));
    }
    return s;
  }
  // called by processContextMenu to extract the menu list
  getNodeMenuOptions(s) {
    var t = null;
    if (s.getMenuOptions ? t = s.getMenuOptions(this) : (t = [
      {
        content: "Inputs",
        has_submenu: !0,
        disabled: !0,
        callback: _LGraphCanvas.showMenuNodeOptionalInputs
      },
      {
        content: "Outputs",
        has_submenu: !0,
        disabled: !0,
        callback: _LGraphCanvas.showMenuNodeOptionalOutputs
      },
      null,
      {
        content: "Properties",
        has_submenu: !0,
        callback: _LGraphCanvas.onShowMenuNodeProperties
      },
      null,
      {
        content: "Title",
        callback: _LGraphCanvas.onShowPropertyEditor
      },
      {
        content: "Mode",
        has_submenu: !0,
        callback: _LGraphCanvas.onMenuNodeMode
      }
    ], s.resizable !== !1 && t.push({
      content: "Resize",
      callback: _LGraphCanvas.onMenuResizeNode
    }), t.push(
      {
        content: "Collapse",
        callback: _LGraphCanvas.onMenuNodeCollapse
      },
      { content: "Pin", callback: _LGraphCanvas.onMenuNodePin },
      {
        content: "Colors",
        has_submenu: !0,
        callback: _LGraphCanvas.onMenuNodeColors
      },
      {
        content: "Shapes",
        has_submenu: !0,
        callback: _LGraphCanvas.onMenuNodeShapes
      },
      null
    )), s.onGetInputs) {
      var r = s.onGetInputs();
      r && r.length && (t[0].disabled = !1);
    }
    if (s.onGetOutputs) {
      var n = s.onGetOutputs();
      n && n.length && (t[1].disabled = !1);
    }
    if (LiteGraph.do_add_triggers_slots && (t[1].disabled = !1), s.getExtraMenuOptions) {
      var a = s.getExtraMenuOptions(this, t);
      a && (a.push(null), t = a.concat(t));
    }
    return s.clonable !== !1 && t.push({
      content: "Clone",
      callback: _LGraphCanvas.onMenuNodeClone
    }), Object.keys(this.selected_nodes).length > 1 && t.push({
      content: "Align Selected To",
      has_submenu: !0,
      callback: _LGraphCanvas.onNodeAlign
    }), t.push(null, {
      content: "Remove",
      disabled: !(s.removable !== !1 && !s.block_delete),
      callback: _LGraphCanvas.onMenuNodeRemove
    }), s.graph && s.graph.onGetNodeMenuOptions && s.graph.onGetNodeMenuOptions(t, s), t;
  }
  getGroupMenuOptions() {
    var s = [
      { content: "Title", callback: _LGraphCanvas.onShowPropertyEditor },
      {
        content: "Color",
        has_submenu: !0,
        callback: _LGraphCanvas.onMenuNodeColors
      },
      {
        content: "Font size",
        property: "font_size",
        type: "Number",
        callback: _LGraphCanvas.onShowPropertyEditor
      },
      null,
      { content: "Remove", callback: _LGraphCanvas.onMenuNodeRemove }
    ];
    return s;
  }
  processContextMenu(s, t) {
    var f, _, g;
    var r = this, n = _LGraphCanvas.active_canvas, a = n.getCanvasWindow(), o = null, h = {
      event: t,
      callback: d,
      extra: s
    };
    s && (h.title = s.type);
    var l = null;
    if (s && (l = s.getSlotInPosition(t.canvasX, t.canvasY), _LGraphCanvas.active_node = s), l) {
      if (o = [], s.getSlotMenuOptions)
        o = s.getSlotMenuOptions(l);
      else {
        ((_ = (f = l == null ? void 0 : l.output) == null ? void 0 : f.links) != null && _.length || (g = l.input) != null && g.link) && o.push({ content: "Disconnect Links", slot: l });
        var u = l.input || l.output;
        u.removable && LiteGraph.canRemoveSlots && o.push(u.locked ? "Cannot remove" : { content: "Remove Slot", slot: l }), !u.nameLocked && LiteGraph.canRenameSlots && o.push({ content: "Rename Slot", slot: l });
      }
      var p = l.input || l.output;
      h.title = p.type || "*", p.type == LiteGraph.ACTION ? h.title = "Action" : p.type == LiteGraph.EVENT && (h.title = "Event");
    } else if (s)
      o = this.getNodeMenuOptions(s);
    else {
      o = this.getCanvasMenuOptions();
      var c = this.graph.getGroupOnPos(
        t.canvasX,
        t.canvasY
      );
      c && o.push(null, {
        content: "Edit Group",
        has_submenu: !0,
        submenu: {
          title: "Group",
          extra: c,
          options: this.getGroupMenuOptions(c)
        }
      });
    }
    if (!o)
      return;
    new LiteGraph.ContextMenu(o, h, a);
    function d(L, b) {
      if (!L)
        return;
      let m;
      if (L.content == "Remove Slot") {
        m = L.slot, s.graph.beforeChange(), m.input ? s.removeInput(m.slot) : m.output && s.removeOutput(m.slot), s.graph.afterChange();
        return;
      } else if (L.content == "Disconnect Links") {
        m = L.slot, s.graph.beforeChange(), m.output ? s.disconnectOutput(m.slot) : m.input && s.disconnectInput(m.slot), s.graph.afterChange();
        return;
      } else if (L.content == "Rename Slot") {
        m = L.slot;
        var T = m.input ? s.getInputInfo(m.slot) : s.getOutputInfo(m.slot), E = r.createDialog(
          "<span class='name'>Name</span><input autofocus type='text'/><button>OK</button>",
          b
        ), k = E.querySelector("input");
        k && T && (k.value = T.label || "");
        var D = function() {
          s.graph.beforeChange(), k.value && (T && (T.label = k.value), r.setDirty(!0)), E.close(), s.graph.afterChange();
        };
        E.querySelector("button").addEventListener("click", D), k.addEventListener("keydown", function(P) {
          if (E.is_modified = !0, P.keyCode == 27)
            E.close();
          else if (P.keyCode == 13)
            D();
          else if (P.keyCode != 13 && P.target.localName != "textarea")
            return;
          P.preventDefault(), P.stopPropagation();
        }), k.focus();
      }
    }
  }
  /**
   * returns ture if low qualty rendering requered at requested scale
   * */
  lowQualityRenderingRequired(s) {
    return this.ds.scale < s ? this.low_quality_rendering_counter > this.low_quality_rendering_threshold : !1;
  }
};
M(_LGraphCanvas, "DEFAULT_BACKGROUND_IMAGE", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNrs1rEKwjAUhlETUkj3vP9rdmr1Ysammk2w5wdxuLgcMHyptfawuZX4pJSWZTnfnu/lnIe/jNNxHHGNn//HNbbv+4dr6V+11uF527arU7+u63qfa/bnmh8sWLBgwYJlqRf8MEptXPBXJXa37BSl3ixYsGDBMliwFLyCV/DeLIMFCxYsWLBMwSt4Be/NggXLYMGCBUvBK3iNruC9WbBgwYJlsGApeAWv4L1ZBgsWLFiwYJmCV/AK3psFC5bBggULloJX8BpdwXuzYMGCBctgwVLwCl7Be7MMFixYsGDBsu8FH1FaSmExVfAxBa/gvVmwYMGCZbBg/W4vAQYA5tRF9QYlv/QAAAAASUVORK5CYII="), M(_LGraphCanvas, "link_type_colors", {
  "-1": "#A86",
  number: "#AAA",
  node: "#DCA",
  string: "#77F",
  boolean: "#F77"
}), M(_LGraphCanvas, "gradients", {}), // cache of gradients
M(_LGraphCanvas, "search_limit", -1), M(_LGraphCanvas, "node_colors", {
  red: { color: "#322", bgcolor: "#533", groupcolor: "#A88" },
  brown: { color: "#332922", bgcolor: "#593930", groupcolor: "#b06634" },
  green: { color: "#232", bgcolor: "#353", groupcolor: "#8A8" },
  blue: { color: "#223", bgcolor: "#335", groupcolor: "#88A" },
  pale_blue: { color: "#2a363b", bgcolor: "#3f5159", groupcolor: "#3f789e" },
  cyan: { color: "#233", bgcolor: "#355", groupcolor: "#8AA" },
  purple: { color: "#323", bgcolor: "#535", groupcolor: "#a1309b" },
  yellow: { color: "#432", bgcolor: "#653", groupcolor: "#b58b2a" },
  black: { color: "#222", bgcolor: "#000", groupcolor: "#444" }
});
let LGraphCanvas = _LGraphCanvas;
var temp = new Float32Array(4), temp_vec2 = new Float32Array(2), tmp_area = new Float32Array(4), margin_area = new Float32Array(4), link_bounding = new Float32Array(4), tempA = new Float32Array(2), tempB = new Float32Array(2);
class DragAndScale {
  /**
   * Creates an instance of DragAndScale.
   * @param {HTMLElement} element - The HTML element to apply scale and offset transformations.
   * @param {boolean} skip_events - Flag indicating whether to skip binding mouse and wheel events.
   *
   * Rendering:
   * toCanvasContext() is HTMLCanvas, and onredraw is probably also.  The rest is all HTML+CSS+JS
   */
  constructor(t, r) {
    M(this, "onMouseDown", (t) => {
      if (!this.enabled)
        return;
      const n = this.element.getBoundingClientRect();
      var a = t.clientX - n.left, o = t.clientY - n.top;
      t.canvasx = a, t.canvasy = o, t.dragging = this.dragging;
      var h = !this.viewport || this.viewport && a >= this.viewport[0] && a < this.viewport[0] + this.viewport[2] && o >= this.viewport[1] && o < this.viewport[1] + this.viewport[3];
      h && (this.dragging = !0, this.abortController = new AbortController(), document.addEventListener("pointermove", this.onMouseMove, { signal: this.abortController.signal }), document.addEventListener("pointerup", this.onMouseUp, { signal: this.abortController.signal })), this.last_mouse[0] = a, this.last_mouse[1] = o;
    });
    M(this, "onMouseMove", (t) => {
      if (!this.enabled)
        return;
      const n = this.element.getBoundingClientRect();
      var a = t.clientX - n.left, o = t.clientY - n.top;
      t.canvasx = a, t.canvasy = o, t.dragging = this.dragging;
      var h = a - this.last_mouse[0], l = o - this.last_mouse[1];
      this.dragging && this.mouseDrag(h, l), this.last_mouse[0] = a, this.last_mouse[1] = o;
    });
    M(this, "onMouseUp", (t) => {
      var r;
      this.dragging = !1, (r = this.abortController) == null || r.abort();
    });
    M(this, "onWheel", (t) => {
      t.wheel = -t.deltaY, t.delta = t.wheelDelta ? t.wheelDelta / 40 : t.deltaY ? -t.deltaY / 3 : 0, this.changeDeltaScale(1 + t.delta * 0.05);
    });
    this.offset = new Float32Array([0, 0]), this.scale = 1, this.max_scale = 10, this.min_scale = 0.1, this.onredraw = null, this.enabled = !0, this.last_mouse = [0, 0], this.element = null, this.visible_area = new Float32Array(4), t && (this.element = t, r || this.bindEvents(t));
  }
  /**
   * Binds mouse and wheel events to the specified HTML element.
   *
   * @param {HTMLElement} element - The HTML element to bind the events to.
   */
  bindEvents(t) {
    this.last_mouse = new Float32Array(2), t.addEventListener("pointerdown", this.onMouseDown), t.addEventListener("wheel", this.onWheel);
  }
  /**
   * Computes the visible area of the DragAndScale element based on the viewport.
   *
   * If the element is not set, the visible area will be reset to zero.
   *
   * @param {Array<number>} [viewport] - The viewport configuration to calculate the visible area.
   */
  computeVisibleArea(t) {
    if (!this.element) {
      this.visible_area.set([0, 0, 0, 0]);
      return;
    }
    let r = this.element.width, n = this.element.height, a = -this.offset[0], o = -this.offset[1];
    if (t) {
      a += t[0] / this.scale, o += t[1] / this.scale;
      const [u, p] = t.slice(2);
      r = u, n = p;
    }
    const h = a + r / this.scale, l = o + n / this.scale;
    this.visible_area.set([a, o, h - a, l - o]);
  }
  /**
   * Applies the scale and offset transformations to the given 2D canvas rendering context.
   *
   * @param {CanvasRenderingContext2D} ctx - The 2D canvas rendering context to apply transformations to.
   */
  toCanvasContext(t) {
    t.scale(this.scale, this.scale), t.translate(this.offset[0], this.offset[1]);
  }
  /**
   * Converts a position from DragAndScale offset coordinates to canvas coordinates.
   *
   * @param {Array<number>} pos - The position in DragAndScale offset coordinates to convert.
   * @returns {Array<number>} The converted position in canvas coordinates.
   */
  convertOffsetToCanvas(t) {
    return [
      (t[0] + this.offset[0]) * this.scale,
      (t[1] + this.offset[1]) * this.scale
    ];
  }
  /**
   * Converts a position from canvas coordinates to DragAndScale offset coordinates.
   *
   * @param {Array<number>} pos - The position in canvas coordinates to convert.
   * @param {Array<number>} [out=[0, 0]] - The output array to store the converted position in DragAndScale offset coordinates.
   * @returns {Array<number>} The converted position in DragAndScale offset coordinates.
   */
  convertCanvasToOffset(t, r = [0, 0]) {
    return r[0] = t[0] / this.scale - this.offset[0], r[1] = t[1] / this.scale - this.offset[1], r;
  }
  mouseDrag(t, r) {
    var n;
    this.offset[0] += t / this.scale, this.offset[1] += r / this.scale, (n = this.onredraw) == null || n.call(this, this);
  }
  /**
   * Changes the scale of the DragAndScale element to the specified value around the zooming center.
   *
   * @param {number} value - The new scale value to set, clamped between min_scale and max_scale.
   * @param {Array<number>} zooming_center - The center point for zooming, defaulting to the middle of the element.
   */
  changeScale(t, r) {
    var l;
    if (t = LiteGraph.clamp(t, this.min_scale, this.max_scale), t == this.scale || !this.element)
      return;
    const n = this.element.getBoundingClientRect();
    if (n) {
      r = r || [
        n.width * 0.5,
        n.height * 0.5
      ];
      var a = this.convertCanvasToOffset(r);
      this.scale = t, Math.abs(this.scale - 1) < 0.01 && (this.scale = 1);
      var o = this.convertCanvasToOffset(r), h = [
        o[0] - a[0],
        o[1] - a[1]
      ];
      this.offset[0] += h[0], this.offset[1] += h[1], (l = this.onredraw) == null || l.call(this, this);
    }
  }
  /**
   * Changes the scale of the DragAndScale element by a delta value relative to the current scale.
   *
   * @param {number} value - The delta value by which to scale the element.
   * @param {Array<number>} zooming_center - The center point for zooming the element.
   */
  changeDeltaScale(t, r) {
    this.changeScale(this.scale * t, r);
  }
  reset() {
    this.scale = 1, this.offset[0] = 0, this.offset[1] = 0;
  }
}
var W, se, re, ne, ae, oe, le;
const Z = class Z {
  /**
  * @constructor
  * @param {Array<Object>} values (allows object { title: "Nice text", callback: function ... })
  * @param {Object} options [optional] Some options:\
  * - title: title to show on top of the menu
  * - callback: function to call when an option is clicked, it receives the item information
  * - ignore_item_callbacks: ignores the callback inside the item, it just calls the options.callback
  * - event: you can pass a MouseEvent, this way the ContextMenu appears in that position
  *
  *   Rendering notes: This is only relevant to rendered graphs, and is rendered using HTML+CSS+JS.
  */
  constructor(t, r = {}) {
    ie(this, W);
    var n;
    this.options = r, (n = r.scroll_speed) != null || (r.scroll_speed = 0.1), this.menu_elements = [], J(this, W, ne).call(this), J(this, W, ae).call(this), J(this, W, se).call(this), J(this, W, re).call(this), this.setTitle(this.options.title), this.addItems(t), J(this, W, oe).call(this), J(this, W, le).call(this);
  }
  /**
   * Creates a title element if it doesn't have one.
   * Sets the title of the menu.
   * @param {string} title - The title to be set.
   */
  setTitle(t) {
    var n;
    if (!t)
      return;
    (n = this.titleElement) != null || (this.titleElement = document.createElement("div"));
    const r = this.titleElement;
    r.className = "litemenu-title", r.innerHTML = t, this.root.parentElement || this.root.appendChild(r);
  }
  /**
   * Adds a set of values to the menu.
   * @param {Array<string|object>} values - An array of values to be added.
   */
  addItems(t) {
    for (let r = 0; r < t.length; r++) {
      let n = t[r];
      typeof n != "string" && (n = n && n.content !== void 0 ? String(n.content) : String(n));
      let a = t[r];
      this.menu_elements.push(this.addItem(n, a, this.options));
    }
  }
  /**
   * Adds an item to the menu.
   * @param {string} name - The name of the item.
   * @param {object | null} value - The value associated with the item.
   * @param {object} [options={}] - Additional options for the item.
   * @returns {HTMLElement} - The created HTML element representing the added item.
   */
  addItem(t, r, n = {}) {
    var u;
    const a = document.createElement("div");
    a.className = "litemenu-entry submenu";
    let o = !1;
    r === null ? a.classList.add("separator") : (a.innerHTML = (u = r == null ? void 0 : r.title) != null ? u : t, a.value = r, r && (r.disabled && (o = !0, a.classList.add("disabled")), (r.submenu || r.has_submenu) && a.classList.add("has_submenu")), typeof r == "function" ? (a.dataset.value = t, a.onclick_callback = r) : a.dataset.value = r, r.className && (a.className += " " + r.className)), this.root.appendChild(a), o || a.addEventListener("click", l), !o && n.autoopen && a.addEventListener("pointerenter", (p) => {
      const c = this.value;
      !c || !c.has_submenu || l.call(this, p);
    });
    var h = this;
    function l(p) {
      var f, _, g, L, b;
      const c = this.value;
      let d = !0;
      if ((f = LiteGraph.debug) == null || f.call(LiteGraph, "ContextMenu handleMenuItemClick", c, n, d, this.current_submenu, this), (_ = h.current_submenu) == null || _.close(p), n.callback && ((g = LiteGraph.debug) == null || g.call(LiteGraph, "ContextMenu handleMenuItemClick callback", this, c, n, p, h, n.node), n.callback.call(this, c, n, p, h, n.node) === !0 && (d = !1)), c && (c.callback && !n.ignore_item_callbacks && c.disabled !== !0 && ((L = LiteGraph.debug) == null || L.call(LiteGraph, "ContextMenu using value callback and !ignore_item_callbacks", this, c, n, p, h, n.node), c.callback.call(this, c, n, p, h, n.extra) === !0 && (d = !1)), c.submenu)) {
        if ((b = LiteGraph.debug) == null || b.call(LiteGraph, "ContextMenu SUBMENU", this, c, c.submenu.options, e, h, n), !c.submenu.options)
          throw new Error("ContextMenu submenu needs options");
        new h.constructor(c.submenu.options, {
          callback: c.submenu.callback,
          event: p,
          parentMenu: h,
          ignore_item_callbacks: c.submenu.ignore_item_callbacks,
          title: c.submenu.title,
          extra: c.submenu.extra,
          autoopen: n.autoopen
        }), d = !1;
      }
      d && !h.lock && h.close();
    }
    return a;
  }
  /**
   * Closes this menu.
   * @param {Event} [e] - The event that triggered the close action.
   * @param {boolean} [ignore_parent_menu=false] - Whether to ignore the parent menu when closing.
   */
  close(t, r) {
    var n;
    if (this.root.f_textfilter) {
      let a = document;
      a.removeEventListener("keydown", this.root.f_textfilter, !0), a.removeEventListener("keydown", this.root.f_textfilter, !1), t && t.target && (a = t.target.ownerDocument), a || (a = document), a.removeEventListener("keydown", this.root.f_textfilter, !0), a.removeEventListener("keydown", this.root.f_textfilter, !1);
    }
    this.parentMenu && !r && (this.parentMenu.lock = !1, this.parentMenu.current_submenu = null, t === void 0 ? this.parentMenu.close() : t && !Z.isCursorOverElement(t, this.parentMenu.root) && Z.trigger(this.parentMenu.root, "pointerleave", t)), (n = this.current_submenu) == null || n.close(t, !0), this.root.closing_timer && clearTimeout(this.root.closing_timer), this.root.parentNode && this.root.parentNode.removeChild(this.root);
  }
  /**
   * Triggers an event on the specified element with the given event name and parameters.
   * @param {HTMLElement} element - The element on which to trigger the event.
   * @param {string} event_name - The name of the event to trigger.
   * @param {Object} params - Additional parameters to include in the event.
   * @param {HTMLElement} origin - The origin of the event <currently not supported as CustomEvent can't have a target!>
   * @returns {CustomEvent} - The created CustomEvent instance.
   * @BUG: Probable bug related to params, origin not being configured/populated correctly
   */
  static trigger(t, r, n, a) {
    const o = new CustomEvent(r, {
      bubbles: !0,
      cancelable: !0,
      detail: n
    });
    return Object.defineProperty(o, "target", { value: a }), t.dispatchEvent ? t.dispatchEvent(o) : t.__events && t.__events.dispatchEvent(o), o;
  }
  // returns the top most menu
  getTopMenu() {
    var t, r;
    return (r = (t = this.options.parentMenu) == null ? void 0 : t.getTopMenu()) != null ? r : this;
  }
  getFirstEvent() {
    var t, r;
    return (r = (t = this.options.parentMenu) == null ? void 0 : t.getFirstEvent()) != null ? r : this.options.event;
  }
  static isCursorOverElement(t, r) {
    return LiteGraph.isInsideRectangle(t.clientX, t.clientY, r.left, r.top, r.width, r.height);
  }
};
W = new WeakSet(), se = function() {
  const t = this.root = document.createElement("div");
  return this.options.className && (t.className = this.options.className), t.classList.add("litegraph", "litecontextmenu", "litemenubar-panel"), t.style.minWidth = "80px", t.style.minHeight = "10px", t;
}, re = function() {
  const t = this.root;
  t.style.pointerEvents = "none", setTimeout(() => {
    t.style.pointerEvents = "auto";
  }, 100), t.addEventListener("pointerup", (r) => (r.preventDefault(), !0)), t.addEventListener("contextmenu", (r) => (r.button != 2 || r.preventDefault(), !1)), t.addEventListener("pointerdown", (r) => {
    if (r.button == 2)
      return this.close(), r.preventDefault(), !0;
  }), t.addEventListener("wheel", (r) => {
    var n = parseInt(t.style.top);
    return t.style.top = (n + r.deltaY * this.options.scroll_speed).toFixed() + "px", r.preventDefault(), !0;
  }), t.addEventListener("pointerenter", (r) => {
    t.closing_timer && clearTimeout(t.closing_timer);
  });
}, ne = function() {
  var r;
  const t = this.options.parentMenu;
  if (t) {
    if (t.constructor !== this.constructor) {
      (r = LiteGraph.error) == null || r.call(LiteGraph, "parentMenu must be of class ContextMenu, ignoring it"), this.options.parentMenu = null;
      return;
    }
    this.parentMenu = t, this.parentMenu.lock = !0, this.parentMenu.current_submenu = this;
  }
}, ae = function() {
  var r;
  if (!this.options.event)
    return;
  const t = this.options.event.constructor.name;
  t !== "MouseEvent" && t !== "CustomEvent" && t !== "PointerEvent" && ((r = LiteGraph.error) == null || r.call(LiteGraph, `Event passed to ContextMenu is not of type MouseEvent or CustomEvent. Ignoring it. (${t})`), this.options.event = null);
}, oe = function() {
  var o, h, l, u;
  const t = (h = (o = this.options.event) == null ? void 0 : o.target.ownerDocument) != null ? h : document, r = (l = t.fullscreenElement) != null ? l : t.body, n = this.root, a = this;
  LiteGraph.context_menu_filter_enabled && (t ? (n.f_textfilter && (t.removeEventListener("keydown", n.f_textfilter, !1), t.removeEventListener("keydown", n.f_textfilter, !0), n.f_textfilter = !1), n.f_textfilter = function(p) {
    var D, P, A, C, O, S, G;
    if (a.current_submenu) {
      (D = LiteGraph.debug) == null || D.call(LiteGraph, "Prevent filtering on ParentMenu", a);
      return;
    }
    if (a.allOptions || (a.allOptions = a.menu_elements, a.selectedOption = !1), a.currentOptions || (a.currentOptions = a.allOptions), a.filteringText || (a.filteringText = ""), p.key) {
      var c = !1;
      switch (p.key) {
        case "Backspace":
          a.filteringText.length && (a.filteringText = a.filteringText.substring(0, a.filteringText.length - 1), c = !0);
          break;
        case "Escape":
          n.f_textfilter && (t.removeEventListener("keydown", n.f_textfilter, !1), t.removeEventListener("keydown", n.f_textfilter, !0), n.f_textfilter = !1), a.close();
          break;
        case "ArrowDown":
          do
            a.selectedOption = a.selectedOption !== !1 ? Math.min(Math.max(a.selectedOption + 1, 0), a.allOptions.length - 1) : 0;
          while (a.allOptions[a.selectedOption] && a.allOptions[a.selectedOption].hidden && a.selectedOption < a.allOptions.length - 1);
          a.allOptions[a.selectedOption] && a.allOptions[a.selectedOption].hidden && (a.selectedOption = a.currentOptions[a.currentOptions.length - 1].menu_index), c = !0;
          break;
        case "ArrowUp":
          do
            a.selectedOption = a.selectedOption !== !1 ? Math.min(Math.max(a.selectedOption - 1, 0), a.allOptions.length - 1) : 0;
          while (a.allOptions[a.selectedOption] && a.allOptions[a.selectedOption].hidden && a.selectedOption > 0);
          a.allOptions[a.selectedOption] && a.allOptions[a.selectedOption].hidden && (a.currentOptions && a.currentOptions.length ? a.selectedOption = a.currentOptions[0].menu_index : a.selectedOption = !1), c = !0;
          break;
        case "ArrowLeft":
          break;
        case "ArrowRight":
        case "Enter":
          if (a.selectedOption !== !1)
            a.allOptions[a.selectedOption] ? ((P = LiteGraph.debug) == null || P.call(LiteGraph, "ContextElement simCLICK", a.allOptions[iO]), a.allOptions[a.selectedOption].do_click && a.allOptions[a.selectedOption].do_click(a.options.event, d)) : ((A = LiteGraph.debug) == null || A.call(LiteGraph, "ContextElement selection wrong", a.selectedOption), a.selectedOption = a.selectedOption !== !1 ? Math.min(Math.max(a.selectedOption, 0), a.allOptions.length - 1) : 0);
          else if (a.filteringText.length) {
            for (let N in a.allOptions)
              if (a.allOptions[N].style.display !== "none" && !(a.allOptions[N].classList + "").includes("separator") && a.allOptions[N].textContent !== "Search") {
                (C = LiteGraph.debug) == null || C.call(LiteGraph, "ContextElement simCLICK", a.allOptions[N]), n.f_textfilter && t && (t.removeEventListener("keydown", n.f_textfilter, !1), t.removeEventListener("keydown", n.f_textfilter, !0), (O = LiteGraph.debug) == null || O.call(LiteGraph, "Cleaned ParentContextMenu listener", t, a));
                var d = !1;
                a.allOptions[N].do_click(p, d);
                break;
              }
          }
          c = !0;
          break;
        default:
          (S = LiteGraph.debug) == null || S.call(LiteGraph, "ContextMenu filter: keyEvent", p.keyCode, p.key), String.fromCharCode(p.key).match(/(\w|\s)/g);
          break;
      }
      !c && p.key.length == 1 && (a.filteringText += p.key, a.parentMenu);
    }
    if (a.filteringText && a.filteringText !== "") {
      var f = [];
      a.currentOptions = [];
      for (let N in a.allOptions) {
        var _ = a.allOptions[N].textContent, g = _.toLocaleLowerCase().includes(a.filteringText.toLocaleLowerCase()), L = _.toLocaleLowerCase().startsWith(a.filteringText.toLocaleLowerCase()), b = _.split("/"), m = !1;
        m = b.length > 1 && b[b.length - 1].toLocaleLowerCase().startsWith(a.filteringText.toLocaleLowerCase()) || b.length == 1 && L;
        var T = (a.allOptions[N].classList + "").includes("separator") || _ === "Search";
        a.allOptions[N].menu_index = N, g && !T ? (f.push(a.allOptions[N]), a.allOptions[N].style.display = "block", a.allOptions[N].hidden = !1, a.currentOptions.push(a.allOptions[N]), a.allOptions[N].filtered_index = a.currentOptions.length - 1) : (a.allOptions[N].hidden = !0, a.allOptions[N].style.display = "none", a.allOptions[N].filtered_index = !1), m ? a.allOptions[N].style.fontWeight = "bold" : L && (a.allOptions[N].style.fontStyle = "italic");
      }
      a.selectedOption = a.selectedOption !== !1 ? Math.min(Math.max(a.selectedOption, 0), a.allOptions.length - 1) : 0, a.allOptions[a.selectedOption] && a.allOptions[a.selectedOption].hidden && a.currentOptions.length && (a.selectedOption = a.currentOptions[0].menu_index);
    } else {
      f = a.allOptions, a.currentOptions = a.allOptions;
      for (let N in a.allOptions)
        a.allOptions[N].style.display = "block", a.allOptions[N].style.fontStyle = "inherit", a.allOptions[N].style.fontWeight = "inherit", a.allOptions[N].hidden = !1, a.allOptions[N].filtered_index = !1, a.allOptions[N].menu_index = N;
    }
    var E = a.selectedOption !== !1;
    if (E) {
      (G = LiteGraph.debug) == null || G.call(LiteGraph, "ContextMenu selection: ", a.selectedOption);
      for (let N in a.allOptions) {
        var k = a.selectedOption + "" == N + "";
        k ? a.allOptions[N].classList.add("selected") : a.allOptions[N].classList.remove("selected");
      }
    }
    document.body.getBoundingClientRect(), n.getBoundingClientRect(), n.style.top = a.top_original + "px";
  }, t.addEventListener(
    "keydown",
    n.f_textfilter,
    !0
  )) : (u = LiteGraph.warn) == null || u.call(LiteGraph, "NO root document to add context menu and event", t, options)), r.appendChild(this.root);
}, le = function() {
  var o;
  const t = this.options, r = this.root;
  let n = t.left || 0, a = t.top || 0;
  if (this.top_original = a, t.event) {
    if (n = t.event.clientX - 10, a = t.event.clientY - 10, t.title && (a -= 20), this.top_original = a, t.parentMenu) {
      const u = t.parentMenu.root.getBoundingClientRect();
      n = u.left + u.width;
    }
    const h = document.body.getBoundingClientRect(), l = r.getBoundingClientRect();
    h.height === 0 && ((o = LiteGraph.error) == null || o.call(LiteGraph, "document.body height is 0. That is dangerous, set html,body { height: 100%; }")), h.width && n > h.width - l.width - 10 && (n = h.width - l.width - 10), h.height && a > h.height - l.height - 10 && (a = h.height - l.height - 10);
  }
  r.style.left = `${n}px`, r.style.top = `${a}px`, t.scale && (r.style.transform = `scale(${t.scale})`);
}, /**
 * Closes all open ContextMenus in the specified window.
 * @param {Window} [ref_window=window] - The window object to search for open menus.
 */
M(Z, "closeAll", (t = window) => {
  const r = t.document.querySelectorAll(".litecontextmenu");
  r.length && r.forEach((n) => {
    var a;
    n.close ? n.close() : (a = n.parentNode) == null || a.removeChild(n);
  });
});
let ContextMenu = Z;
var LiteGraph = new class {
  constructor() {
    M(this, "extendClass", (s, t) => {
      for (let r in t)
        s.hasOwnProperty(r) || (s[r] = t[r]);
      if (t.prototype)
        for (let r in t.prototype)
          t.prototype.hasOwnProperty(r) && (s.prototype.hasOwnProperty(r) || (t.prototype.__lookupGetter__(r) ? s.prototype.__defineGetter__(
            r,
            t.prototype.__lookupGetter__(r)
          ) : s.prototype[r] = t.prototype[r], t.prototype.__lookupSetter__(r) && s.prototype.__defineSetter__(
            r,
            t.prototype.__lookupSetter__(r)
          )));
    });
    // used to create nodes from wrapping functions
    M(this, "getParameterNames", (s) => (s + "").replace(/[/][/].*$/gm, "").replace(/\s+/g, "").replace(/[/][*][^/*]*[*][/]/g, "").split("){", 1)[0].replace(/^[^(]*[(]/, "").replace(/=[^,]+/g, "").split(",").filter(Boolean));
    M(this, "clamp", (s, t, r) => t > s ? t : r < s ? r : s);
    // @BUG: Re-add these
    M(this, "pointerAddListener", () => {
      var s;
      (s = console.error) == null || s.call(console, "Removed and being re-integrated sorta");
    });
    M(this, "pointerRemoveListener", () => {
      var s;
      (s = console.error) == null || s.call(console, "Removed and being re-integrated sorta");
    });
    M(this, "closeAllContextMenus", () => {
      LiteGraph.warn("LiteGraph.closeAllContextMenus is deprecated in favor of ContextMenu.closeAll()"), ContextMenu.closeAll();
    });
    this.VERSION = "0.10.2", this.LLink = LLink, this.LGraph = LGraph, this.LGraphNode = LGraphNode, this.LGraphGroup = LGraphGroup, this.LGraphCanvas = LGraphCanvas, this.DragAndScale = DragAndScale, this.ContextMenu = ContextMenu, this.CANVAS_GRID_SIZE = 10, this.NODE_TITLE_HEIGHT = 30, this.NODE_TITLE_TEXT_Y = 20, this.NODE_SLOT_HEIGHT = 20, this.NODE_WIDGET_HEIGHT = 20, this.NODE_WIDTH = 140, this.NODE_MIN_WIDTH = 50, this.NODE_COLLAPSED_RADIUS = 10, this.NODE_COLLAPSED_WIDTH = 80, this.NODE_TITLE_COLOR = "#999", this.NODE_SELECTED_TITLE_COLOR = "#FFF", this.NODE_TEXT_SIZE = 14, this.NODE_TEXT_COLOR = "#AAA", this.NODE_SUBTEXT_SIZE = 12, this.NODE_DEFAULT_COLOR = "#333", this.NODE_DEFAULT_BGCOLOR = "#353535", this.NODE_DEFAULT_BOXCOLOR = "#666", this.NODE_DEFAULT_SHAPE = "box", this.NODE_BOX_OUTLINE_COLOR = "#FFF", this.DEFAULT_SHADOW_COLOR = "rgba(0,0,0,0.5)", this.DEFAULT_GROUP_FONT = 24, this.WIDGET_BGCOLOR = "#222", this.WIDGET_OUTLINE_COLOR = "#666", this.WIDGET_TEXT_COLOR = "#DDD", this.WIDGET_SECONDARY_TEXT_COLOR = "#999", this.LINK_COLOR = "#9A9", this.EVENT_LINK_COLOR = "#A86", this.CONNECTING_LINK_COLOR = "#AFA", this.MAX_NUMBER_OF_NODES = 1e3, this.DEFAULT_POSITION = [100, 100], this.VALID_SHAPES = ["default", "box", "round", "card"], this.BOX_SHAPE = 1, this.ROUND_SHAPE = 2, this.CIRCLE_SHAPE = 3, this.CARD_SHAPE = 4, this.ARROW_SHAPE = 5, this.GRID_SHAPE = 6, this.INPUT = 1, this.OUTPUT = 2, this.EVENT = -1, this.ACTION = -1, this.NODE_MODES = ["Always", "On Event", "Never", "On Trigger", "On Request"], this.NODE_MODES_COLORS = ["#666", "#422", "#333", "#224", "#626"], this.ALWAYS = 0, this.ON_EVENT = 1, this.NEVER = 2, this.ON_TRIGGER = 3, this.ON_REQUEST = 4, this.UP = 1, this.DOWN = 2, this.LEFT = 3, this.RIGHT = 4, this.CENTER = 5, this.LINK_RENDER_MODES = ["Straight", "Linear", "Spline"], this.STRAIGHT_LINK = 0, this.LINEAR_LINK = 1, this.SPLINE_LINK = 2, this.NORMAL_TITLE = 0, this.NO_TITLE = 1, this.TRANSPARENT_TITLE = 2, this.AUTOHIDE_TITLE = 3, this.VERTICAL_LAYOUT = "vertical", this.proxy = null, this.node_images_path = "", this.catch_exceptions = !0, this.throw_errors = !0, this.allow_scripts = !1, this.use_deferred_actions = !0, this.registered_node_types = {}, this.node_types_by_file_extension = {}, this.Nodes = {}, this.Globals = {}, this.searchbox_extras = {}, this.auto_sort_node_types = !1, this.node_box_coloured_when_on = !1, this.node_box_coloured_by_mode = !1, this.dialog_close_on_mouse_leave = !0, this.dialog_close_on_mouse_leave_delay = 500, this.shift_click_do_break_link_from = !1, this.click_do_break_link_to = !1, this.search_hide_on_mouse_leave = !0, this.search_filter_enabled = !1, this.search_show_all_on_open = !0, this.show_node_tooltip = !1, this.show_node_tooltip_use_descr_property = !1, this.auto_load_slot_types = !1, this.registered_slot_in_types = {}, this.registered_slot_out_types = {}, this.slot_types_in = [], this.slot_types_out = [], this.slot_types_default_in = [], this.slot_types_default_out = [], this.graphDefaultConfig = {
      align_to_grid: !0,
      links_ontop: !1
    }, this.alt_drag_do_clone_nodes = !1, this.alt_shift_drag_connect_clone_with_input = !0, this.do_add_triggers_slots = !1, this.allow_multi_output_for_events = !0, this.middle_click_slot_add_default_node = !1, this.release_link_on_empty_shows_menu = !1, this.two_fingers_opens_menu = !1, this.backspace_delete = !0, this.ctrl_shift_v_paste_connect_unselected_outputs = !1, this.actionHistory_enabled = !1, this.actionHistoryMaxSave = 40, this.refreshAncestorsOnTriggers = !1, this.refreshAncestorsOnActions = !1, this.ensureUniqueExecutionAndActionCall = !1, this.use_uuids = !1, this.context_menu_filter_enabled = !1, this.showCanvasOptions = !1, this.availableCanvasOptions = [
      "allow_addOutSlot_onExecuted",
      "free_resize",
      "highquality_render",
      "use_gradients",
      // set to true to render titlebar with gradients
      "pause_rendering",
      "clear_background",
      "read_only",
      // if set to true users cannot modify the graph
      // "render_only_selected", // not implemented
      "live_mode",
      "show_info",
      "allow_dragcanvas",
      "allow_dragnodes",
      "allow_interaction",
      // allow to control widgets, buttons, collapse, etc
      "allow_searchbox",
      "move_destination_link_without_shift",
      // rename: old allow_reconnect_links //allows to change a connection, no need to hold shift
      "set_canvas_dirty_on_mouse_event",
      // forces to redraw the canvas if the mouse does anything
      "always_render_background",
      "render_shadows",
      "render_canvas_border",
      "render_connections_shadows",
      // too much cpu
      "render_connections_border",
      // ,"render_curved_connections", // always on, or specific fixed graph
      "render_connection_arrows",
      "render_collapsed_slots",
      "render_execution_order",
      "render_title_colored",
      "render_link_tooltip"
    ], this.actionHistoryMaxSave = 40, this.canRemoveSlots = !0, this.canRemoveSlots_onlyOptional = !0, this.canRenameSlots = !0, this.canRenameSlots_onlyOptional = !0, this.ensureNodeSingleExecution = !1, this.ensureNodeSingleAction = !1, this.preventAncestorRecalculation = !1, this.ensureUniqueExecutionAndActionCall = !0, this.allowMultiOutputForEvents = !1, this.log_methods = ["error", "warn", "info", "log", "debug"], this.logging_set_level(2);
  }
  // get and set debug (log)level
  // from -1 (none), 0 (error), .. to 4 (debug) based on console methods 'error', 'warn', 'info', 'log', 'debug'
  logging_set_level(s) {
    this.debug_level = Number(s);
  }
  // entrypoint to debug log
  logging(s) {
    if (s > this.debug_level)
      return;
    function t(n) {
      let a = [];
      for (let o = 1; o < n.length; o++)
        typeof n[o] != "undefined" && a.push(n[o]);
      return a;
    }
    let r = "debug";
    if (s >= 0 && s <= 4 && (r = ["error", "warn", "info", "log", "debug"][s]), typeof console[r] != "function")
      throw console.warn("[LG-log] invalid console method", r, t(arguments)), new RangeError();
    console[r]("[LG]", ...t(arguments));
  }
  error() {
    this.logging(0, ...arguments);
  }
  warn() {
    this.logging(1, ...arguments);
  }
  info() {
    this.logging(2, ...arguments);
  }
  log() {
    this.logging(3, ...arguments);
  }
  debug() {
    this.logging(4, ...arguments);
  }
  /**
   * Register a node class so it can be listed when the user wants to create a new one
   * @method registerNodeType
   * @param {String} type name of the node and path
   * @param {Class} base_class class containing the structure of a node
   */
  registerNodeType(s, t) {
    var u, p, c, d, f, _, g;
    if (!t.prototype)
      throw new Error("Cannot register a simple object, it must be a class with a prototype");
    t.type = s, (u = this.debug) == null || u.call(this, "registerNodeType", "start", s);
    const r = t.name, n = s.lastIndexOf("/");
    t.category = s.substring(0, n), t.title || (t.title = r);
    const a = Object.getOwnPropertyDescriptors(LGraphNode.prototype);
    Object.keys(a).forEach((L) => {
      t.prototype.hasOwnProperty(L) || Object.defineProperty(t.prototype, L, a[L]);
    });
    const o = this.registered_node_types[s];
    if (o && ((p = this.debug) == null || p.call(this, "registerNodeType", "replacing node type", s, o)), !Object.prototype.hasOwnProperty.call(t.prototype, "shape") && (Object.defineProperty(t.prototype, "shape", {
      set: function(L) {
        switch (L) {
          case "default":
            delete this._shape;
            break;
          case "box":
            this._shape = LiteGraph.BOX_SHAPE;
            break;
          case "round":
            this._shape = LiteGraph.ROUND_SHAPE;
            break;
          case "circle":
            this._shape = LiteGraph.CIRCLE_SHAPE;
            break;
          case "card":
            this._shape = LiteGraph.CARD_SHAPE;
            break;
          default:
            this._shape = L;
        }
      },
      get: function() {
        return this._shape;
      },
      enumerable: !0,
      configurable: !0
    }), t.supported_extensions))
      for (let L in t.supported_extensions) {
        const b = t.supported_extensions[L];
        b && b.constructor === String && (this.node_types_by_file_extension[b.toLowerCase()] = t);
      }
    if (this.registered_node_types[s] = t, t.constructor.name && (this.Nodes[r] = t), (c = LiteGraph.onNodeTypeRegistered) == null || c.call(LiteGraph, s, t), o && ((d = LiteGraph.onNodeTypeReplaced) == null || d.call(LiteGraph, s, t, o)), t.prototype.onPropertyChange && LiteGraph.warn("LiteGraph node class " + s + " has onPropertyChange method, it must be called onPropertyChanged with d at the end"), t.supported_extensions)
      for (var h = 0; h < t.supported_extensions.length; h++) {
        var l = t.supported_extensions[h];
        l && l.constructor === String && (this.node_types_by_file_extension[l.toLowerCase()] = t);
      }
    (f = this.debug) == null || f.call(this, "registerNodeType", "type registered", s), this.auto_load_slot_types && ((_ = this.debug) == null || _.call(this, "registerNodeType", "do auto_load_slot_types", s)), new t((g = t.title) != null ? g : "tmpnode");
  }
  /**
   * removes a node type from the system
   * @method unregisterNodeType
   * @param {String|Object} type name of the node or the node constructor itself
   */
  unregisterNodeType(s) {
    const t = s.constructor === String ? this.registered_node_types[s] : s;
    if (!t)
      throw new Error("node type not found: " + s);
    delete this.registered_node_types[t.type], t.constructor.name && delete this.Nodes[t.constructor.name];
  }
  /**
  * Save a slot type and his node
  * @method registerSlotType
  * @param {String|Object} type name of the node or the node constructor itself
  * @param {String} slot_type name of the slot type (variable type), eg. string, number, array, boolean, ..
  */
  registerNodeAndSlotType(s, t, r = !1) {
    const a = (s.constructor === String && this.registered_node_types[s] !== "anonymous" ? this.registered_node_types[s] : s).constructor.type;
    let o = [];
    typeof t == "string" ? o = t.split(",") : t == this.EVENT || t == this.ACTION ? o = ["_event_"] : o = ["*"];
    for (let h = 0; h < o.length; ++h) {
      let l = o[h];
      l === "" && (l = "*");
      const u = r ? "registered_slot_out_types" : "registered_slot_in_types";
      this[u][l] === void 0 && (this[u][l] = { nodes: [] }), this[u][l].nodes.includes(a) || this[u][l].nodes.push(a), r ? this.slot_types_out.includes(l.toLowerCase()) || (this.slot_types_out.push(l.toLowerCase()), this.slot_types_out.sort()) : this.slot_types_in.includes(l.toLowerCase()) || (this.slot_types_in.push(l.toLowerCase()), this.slot_types_in.sort());
    }
  }
  /**
   * Create a new nodetype by passing an object with some properties
   * like onCreate, inputs:Array, outputs:Array, properties, onExecute
   * @method buildNodeClassFromObject
   * @param {String} name node name with namespace (p.e.: 'math/sum')
   * @param {Object} object methods expected onCreate, inputs, outputs, properties, onExecute
   */
  buildNodeClassFromObject(s, t) {
    var r = "";
    if (t.inputs)
      for (let a = 0; a < t.inputs.length; ++a) {
        let o = t.inputs[a][0], h = t.inputs[a][1];
        h && h.constructor === String && (h = '"' + h + '"'), r += "this.addInput('" + o + "'," + h + `);
`;
      }
    if (t.outputs)
      for (let a = 0; a < t.outputs.length; ++a) {
        let o = t.outputs[a][0], h = t.outputs[a][1];
        h && h.constructor === String && (h = '"' + h + '"'), r += "this.addOutput('" + o + "'," + h + `);
`;
      }
    if (t.properties)
      for (let a in t.properties) {
        let o = t.properties[a];
        o && o.constructor === String && (o = '"' + o + '"'), r += "this.addProperty('" + a + "'," + o + `);
`;
      }
    r += "if(this.onCreate)this.onCreate()";
    var n = Function(r);
    for (let a in t)
      a != "inputs" && a != "outputs" && a != "properties" && (n.prototype[a] = t[a]);
    return n.title = t.title || s.split("/").pop(), n.desc = t.desc || "Generated from object", this.registerNodeType(s, n), n;
  }
  /**
   * Create a new nodetype by passing a function, it wraps it with a proper class and generates inputs according to the parameters of the function.
   * Useful to wrap simple methods that do not require properties, and that only process some input to generate an output.
   * @method wrapFunctionAsNode
   * @param {String} name node name with namespace (p.e.: 'math/sum')
   * @param {Function} func
   * @param {Array} param_types [optional] an array containing the type of every parameter, otherwise parameters will accept any type
   * @param {String} return_type [optional] string with the return type, otherwise it will be generic
   * @param {Object} properties [optional] properties to be configurable
   */
  wrapFunctionAsNode(s, t, r, n, a) {
    const o = LiteGraph.getParameterNames(t), h = o.map((c, d) => {
      const f = r != null && r[d] ? `'${r[d]}'` : "0";
      return `this.addInput('${c}', ${f});`;
    }).join(`
`), l = n ? `'${n}'` : 0, u = a ? `this.properties = ${JSON.stringify(a)};` : "", p = new Function(`
            ${h}
            this.addOutput('out', ${l});
            ${u}
        `);
    return p.title = s.split("/").pop(), p.desc = `Generated from ${t.name}`, p.prototype.onExecute = function() {
      const c = o.map((f, _) => this.getInputData(_)), d = t.apply(this, c);
      this.setOutputData(0, d);
    }, this.registerNodeType(s, p), p;
  }
  /**
   * Removes all previously registered node's types
   */
  clearRegisteredTypes() {
    this.registered_node_types = {}, this.node_types_by_file_extension = {}, this.Nodes = {}, this.searchbox_extras = {};
  }
  /**
   * Adds this method to all nodetypes, existing and to be created
   * (You can add it to LGraphNode.prototype but then existing node types wont have it)
   * @method addNodeMethod
   * @param {Function} func
   */
  addNodeMethod(s, t) {
    LGraphNode.prototype[s] = t;
    for (var r in this.registered_node_types) {
      var n = this.registered_node_types[r];
      n.prototype[s] && (n.prototype["_" + s] = n.prototype[s]), n.prototype[s] = t;
    }
  }
  /**
   * Create a node of a given type with a name. The node is not attached to any graph yet.
   * @method createNode
   * @param {String} type full name of the node class. p.e. "math/sin"
   * @param {String} name a name to distinguish from other nodes
   * @param {Object} options to set options
   */
  createNode(s, t, r = {}) {
    var o, h, l, u, p, c, d, f, _, g, L, b;
    const n = (o = this.registered_node_types[s]) != null ? o : null;
    if (!n)
      return (h = this.log) == null || h.call(this, `GraphNode type "${s}" not registered.`), null;
    t = (l = t != null ? t : n.title) != null ? l : s;
    let a = null;
    if (LiteGraph.catch_exceptions)
      try {
        a = new n(t);
      } catch (m) {
        return (u = this.error) == null || u.call(this, m), null;
      }
    else
      a = new n(t);
    return a.type = s, (p = a.title) != null || (a.title = t), (c = a.properties) != null || (a.properties = {}), (d = a.properties_info) != null || (a.properties_info = []), (f = a.flags) != null || (a.flags = {}), (_ = a.size) != null || (a.size = a.computeSize()), (g = a.pos) != null || (a.pos = LiteGraph.DEFAULT_POSITION.concat()), (L = a.mode) != null || (a.mode = LiteGraph.ALWAYS), Object.assign(a, r), (b = a.onNodeCreated) == null || b.call(a), a;
  }
  /**
   * Returns a registered node type with a given name
   * @method getNodeType
   * @param {String} type full name of the node class. p.e. "math/sin"
   * @return {Class} the node class
   */
  getNodeType(s) {
    return this.registered_node_types[s];
  }
  /**
   * Returns a list of node types matching one category
   * @method getNodeType
   * @param {String} category category name
   * @return {Array} array with all the node classes
   */
  getNodeTypesInCategory(s, t) {
    const r = Object.values(this.registered_node_types).filter((n) => n.filter !== t ? !1 : s === "" ? n.category === null : n.category === s);
    return this.auto_sort_node_types && r.sort((n, a) => n.title.localeCompare(a.title)), r;
  }
  /**
   * Returns a list with all the node type categories
   * @method getNodeTypesCategories
   * @param {String} filter only nodes with ctor.filter equal can be shown
   * @return {Array} array with all the names of the categories
   */
  getNodeTypesCategories(s) {
    const t = { "": 1 };
    Object.values(this.registered_node_types).forEach((n) => {
      n.category && !n.skip_list && n.filter === s && (t[n.category] = 1);
    });
    const r = Object.keys(t);
    return this.auto_sort_node_types ? r.sort() : r;
  }
  // debug purposes: reloads all the js scripts that matches a wildcard
  reloadNodes(s) {
    var h, l, u;
    var t = document.getElementsByTagName("script"), r = [];
    for (let p = 0; p < t.length; p++)
      r.push(t[p]);
    var n = document.getElementsByTagName("head")[0];
    s = document.location.href + s;
    for (let p = 0; p < r.length; p++) {
      var a = r[p].src;
      if (!(!a || a.substr(0, s.length) != s))
        try {
          (h = this.log) == null || h.call(this, "Reloading: " + a);
          var o = document.createElement("script");
          o.type = "text/javascript", o.src = a, n.appendChild(o), n.removeChild(r[p]);
        } catch (c) {
          if (LiteGraph.throw_errors)
            throw c;
          (l = this.log) == null || l.call(this, "Error while reloading " + a);
        }
    }
    (u = this.log) == null || u.call(this, "Nodes reloaded");
  }
  // separated just to improve if it doesn't work
  cloneObject(s, t) {
    if (s == null)
      return null;
    const r = JSON.parse(JSON.stringify(s));
    if (!t)
      return r;
    for (const n in r)
      Object.prototype.hasOwnProperty.call(r, n) && (t[n] = r[n]);
    return t;
  }
  /*
      * https://gist.github.com/jed/982883?permalink_comment_id=852670#gistcomment-852670
      */
  uuidv4() {
    return ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, (s) => (s ^ Math.random() * 16 >> s / 4).toString(16));
  }
  /**
   * Returns if the types of two slots are compatible (taking into account wildcards, etc)
   * @method isValidConnection
   * @param {String} type_a
   * @param {String} type_b
   * @return {Boolean} true if they can be connected
   */
  isValidConnection(s, t) {
    if ((s === "" || s === "*") && (s = 0), (t === "" || t === "*") && (t = 0), !s || !t || s === t || s === LiteGraph.EVENT && t === LiteGraph.ACTION)
      return !0;
    if (s = String(s).toLowerCase(), t = String(t).toLowerCase(), !s.includes(",") && !t.includes(","))
      return s === t;
    const r = s.split(","), n = t.split(",");
    for (const a of r)
      for (const o of n)
        if (this.isValidConnection(a, o))
          return !0;
    return !1;
  }
  /**
   * Register a string in the search box so when the user types it it will recommend this node
   * @method registerSearchboxExtra
   * @param {String} node_type the node recommended
   * @param {String} description text to show next to it
   * @param {Object} data it could contain info of how the node should be configured
   * @return {Boolean} true if they can be connected
   */
  registerSearchboxExtra(s, t, r) {
    this.searchbox_extras[t.toLowerCase()] = {
      type: s,
      desc: t,
      data: r
    };
  }
  /**
   * Wrapper to load files (from url using fetch or from file using FileReader)
   * @method fetchFile
   * @param {String|File|Blob} url the url of the file (or the file itself)
   * @param {String} type an string to know how to fetch it: "text","arraybuffer","json","blob"
   * @param {Function} on_complete callback(data)
   * @param {Function} on_error in case of an error
   * @return {FileReader|Promise} returns the object used to
   */
  fetchFile(s, t, r, n) {
    if (!s)
      return null;
    if (t = t || "text", s.constructor === String)
      return s.substr(0, 4) == "http" && LiteGraph.proxy && (s = LiteGraph.proxy + s.substr(s.indexOf(":") + 3)), fetch(s).then((o) => {
        if (!o.ok)
          throw new Error("File not found");
        if (t == "arraybuffer")
          return o.arrayBuffer();
        if (t == "text" || t == "string")
          return o.text();
        if (t == "json")
          return o.json();
        if (t == "blob")
          return o.blob();
      }).then((o) => {
        r && r(o);
      }).catch((o) => {
        var h;
        (h = this.error) == null || h.call(this, "error fetching file:", s), n && n(o);
      });
    if (s.constructor === File || s.constructor === Blob) {
      var a = new FileReader();
      if (a.onload = (o) => {
        var h = o.target.result;
        t == "json" && (h = JSON.parse(h)), r && r(h);
      }, t == "arraybuffer")
        return a.readAsArrayBuffer(s);
      if (t == "text" || t == "json")
        return a.readAsText(s);
      if (t == "blob")
        return a.readAsBinaryString(s);
    }
    return null;
  }
  // @TODO These weren't even directly bound, so could be used as free functions
  compareObjects(s, t) {
    const r = Object.keys(s);
    return r.length !== Object.keys(t).length ? !1 : r.every((n) => s[n] === t[n]);
  }
  distance(s, t) {
    const [r, n] = s, [a, o] = t;
    return Math.sqrt((a - r) ** 2 + (o - n) ** 2);
  }
  colorToString(s) {
    return "rgba(" + Math.round(s[0] * 255).toFixed() + "," + Math.round(s[1] * 255).toFixed() + "," + Math.round(s[2] * 255).toFixed() + "," + (s.length == 4 ? s[3].toFixed(2) : "1.0") + ")";
  }
  canvasFillTextMultiline(s, t, r, n, a, o) {
    var h = (t + "").trim().split(" "), l = "", u = { lines: [], maxW: 0, height: 0 };
    if (h.length > 1)
      for (var p = 0; p < h.length; p++) {
        var c = l + h[p] + " ", d = s.measureText(c), f = d.width;
        f > a && p > 0 ? (s.fillText(l, r, n + o * u.lines.length), l = h[p] + " ", u.max = f, u.lines.push(l)) : l = c;
      }
    else
      l = h[0];
    return s.fillText(l, r, n + o * u.lines.length), u.lines.push(l), u.height = o * u.lines.length || o, u;
  }
  isInsideRectangle(s, t, r, n, a, o) {
    return s > r && s < r + a && t > n && t < n + o;
  }
  // [minx,miny,maxx,maxy]
  growBounding(s, t, r) {
    t < s[0] ? s[0] = t : t > s[2] && (s[2] = t), r < s[1] ? s[1] = r : r > s[3] && (s[3] = r);
  }
  // point inside bounding box
  isInsideBounding(s, t) {
    return s[0] >= t[0][0] && s[1] >= t[0][1] && s[0] <= t[1][0] && s[1] <= t[1][1];
  }
  // bounding overlap, format: [ startx, starty, width, height ]
  overlapBounding(s, t) {
    const r = s[0] + s[2], n = s[1] + s[3], a = t[0] + t[2], o = t[1] + t[3];
    return !(s[0] > a || s[1] > o || r < t[0] || n < t[1]);
  }
  // Convert a hex value to its decimal value - the inputted hex must be in the
  //	format of a hex triplet - the kind we use for HTML colours. The function
  //	will return an array with three values.
  hex2num(s) {
    s.charAt(0) == "#" && (s = s.slice(1)), s = s.toUpperCase();
    for (var t = "0123456789ABCDEF", r = new Array(3), n = 0, a, o, h = 0; h < 6; h += 2)
      a = t.indexOf(s.charAt(h)), o = t.indexOf(s.charAt(h + 1)), r[n] = a * 16 + o, n++;
    return r;
  }
  // Give a array with three values as the argument and the function will return
  //	the corresponding hex triplet.
  num2hex(s) {
    for (var t = "0123456789ABCDEF", r = "#", n, a, o = 0; o < 3; o++)
      n = s[o] / 16, a = s[o] % 16, r += t.charAt(n) + t.charAt(a);
    return r;
  }
  set pointerevents_method(s) {
    var t;
    (t = console.error) == null || t.call(console, "Removed and being re-integrated sorta");
  }
  get pointerevents_method() {
    var s;
    (s = console.error) == null || s.call(console, "Removed and being re-integrated sorta");
  }
}();
typeof performance != "undefined" ? LiteGraph.getTime = performance.now.bind(performance) : typeof Date != "undefined" && Date.now ? LiteGraph.getTime = Date.now.bind(Date) : typeof process != "undefined" ? LiteGraph.getTime = () => {
  var s = process.hrtime();
  return s[0] * 1e-3 + s[1] * 1e-6;
} : LiteGraph.getTime = function() {
  return (/* @__PURE__ */ new Date()).getTime();
};
typeof window != "undefined" && !window.requestAnimationFrame && (window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || ((s) => {
  window.setTimeout(s, 1e3 / 60);
}));
export {
  ContextMenu,
  DragAndScale,
  LGraph,
  LGraphCanvas,
  LGraphGroup,
  LGraphNode,
  LLink,
  LiteGraph
};
