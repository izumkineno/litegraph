var mt = Object.defineProperty;
var pt = (r) => {
  throw TypeError(r);
};
var yt = (r, t, s) => t in r ? mt(r, t, { enumerable: !0, configurable: !0, writable: !0, value: s }) : r[t] = s;
var b = (r, t, s) => yt(r, typeof t != "symbol" ? t + "" : t, s), Lt = (r, t, s) => t.has(r) || pt("Cannot " + s);
var ct = (r, t, s) => t.has(r) ? pt("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(r) : t.set(r, s);
var st = (r, t, s) => (Lt(r, t, "access private method"), s);
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
  constructor(t, s, a, n, o, l) {
    this.id = t, this.type = s, this.origin_id = a, this.origin_slot = n, this.target_id = o, this.target_slot = l, this._data = null, this._pos = new Float32Array(2);
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
const J = class J {
  /**
   * @constructor
   * @param {Object} o data from previous serialization [optional]} o
   */
  constructor(t) {
    var s;
    (s = LiteGraph.log) == null || s.call(LiteGraph, "Graph created"), this.list_of_graphcanvas = null, this.clear(), t && this.configure(t);
  }
  /**
   * Gets the supported types of the LGraph class, falling back to the default supported types if not defined for the instance.
   * @returns {Array} An array of supported types for the LGraph class.
   */
  getSupportedTypes() {
    var t;
    return (t = this.supported_types) != null ? t : J.supported_types;
  }
  /**
   * Removes all nodes from this graph
   * @method clear
   */
  clear() {
    var t;
    this.stop(), this.status = J.STATUS_STOPPED, this.last_node_id = 0, this.last_link_id = 0, this._version = -1, (t = this._nodes) == null || t.forEach((s) => {
      var a;
      (a = s.onRemoved) == null || a.call(s);
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
    var s;
    if (!t instanceof LiteGraph.LGraphCanvas)
      throw new Error("attachCanvas expects a LiteGraph.LGraphCanvas instance");
    t.graph && t.graph != this && t.graph.detachCanvas(t), t.graph = this, (s = this.list_of_graphcanvas) != null || (this.list_of_graphcanvas = []), this.list_of_graphcanvas.push(t);
  }
  /**
   * Detach Canvas from this graph
   * @method detachCanvas
   * @param {GraphCanvas} graph_canvas
   */
  detachCanvas(t) {
    if (this.list_of_graphcanvas) {
      var s = this.list_of_graphcanvas.indexOf(t);
      s != -1 && (t.graph = null, this.list_of_graphcanvas.splice(s, 1));
    }
  }
  /**
   * Starts running this graph every interval milliseconds.
   * @method start
   * @param {number} interval amount of milliseconds between executions, if 0 then it renders to the monitor refresh rate
   */
  start(t = 0) {
    var a;
    if (this.status === J.STATUS_RUNNING)
      return;
    this.status = J.STATUS_RUNNING, (a = this.onPlayEvent) == null || a.call(this), this.sendEventToAllNodes("onStart"), this.starttime = LiteGraph.getTime(), this.last_update_time = this.starttime;
    const s = () => {
      var n, o;
      this.execution_timer_id === -1 && (window.requestAnimationFrame(s), (n = this.onBeforeStep) == null || n.call(this), this.runStep(1, !this.catch_errors), (o = this.onAfterStep) == null || o.call(this));
    };
    t === 0 && typeof window == "object" && window.requestAnimationFrame ? (this.execution_timer_id = -1, s()) : this.execution_timer_id = setInterval(() => {
      var n, o;
      (n = this.onBeforeStep) == null || n.call(this), this.runStep(1, !this.catch_errors), (o = this.onAfterStep) == null || o.call(this);
    }, t);
  }
  /**
   * Stops the execution loop of the graph
   * @method stop execution
   */
  stop() {
    var t;
    this.status != J.STATUS_STOPPED && (this.status = J.STATUS_STOPPED, (t = this.onStopEvent) == null || t.call(this), this.execution_timer_id != null && (this.execution_timer_id != -1 && clearInterval(this.execution_timer_id), this.execution_timer_id = null), this.sendEventToAllNodes("onStop"));
  }
  /**
   * Run N steps (cycles) of the graph
   * @method runStep
   * @param {number} num number of steps to run, default is 1
   * @param {Boolean} do_not_catch_errors [optional] if you want to try/catch errors
   * @param {number} limit max number of nodes to execute (used to execute from start to a node)
   */
  runStep(t = 1, s, a) {
    var u, p, c, f, d, _;
    var n = LiteGraph.getTime();
    this.globaltime = 1e-3 * (n - this.starttime);
    var o = (u = this._nodes_executable) != null ? u : this._nodes;
    if (o) {
      if (a || (a = o.length), s) {
        for (let g = 0; g < t; g++)
          o.forEach((m) => {
            var G, L;
            LiteGraph.use_deferred_actions && ((G = m._waiting_actions) != null && G.length) && m.executePendingActions(), m.mode === LiteGraph.ALWAYS && ((L = m.doExecute) == null || L.call(m));
          }), this.fixedtime += this.fixedtime_lapse, (p = this.onExecuteStep) == null || p.call(this);
        (c = this.onAfterExecute) == null || c.call(this);
      } else
        try {
          for (let g = 0; g < t; g++)
            o.forEach((m) => {
              var G, L;
              LiteGraph.use_deferred_actions && ((G = m._waiting_actions) != null && G.length) && m.executePendingActions(), m.mode === LiteGraph.ALWAYS && ((L = m.doExecute) == null || L.call(m));
            }), this.fixedtime += this.fixedtime_lapse, (f = this.onExecuteStep) == null || f.call(this);
          (d = this.onAfterExecute) == null || d.call(this), this.errors_in_execution = !1;
        } catch (g) {
          if (this.errors_in_execution = !0, LiteGraph.throw_errors)
            throw g;
          (_ = LiteGraph.log) == null || _.call(LiteGraph, `Error during execution: ${g}`), this.stop();
        }
      var l = LiteGraph.getTime(), h = l - n;
      h == 0 && (h = 1), this.execution_time = 1e-3 * h, this.globaltime += 1e-3 * h, this.iteration += 1, this.elapsed_time = (l - this.last_update_time) * 1e-3, this.last_update_time = l, this.nodes_executing = [], this.nodes_actioning = [], this.node_ancestorsCalculated = [], this.nodes_executedAction = [];
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
  computeExecutionOrder(t, s) {
    var _;
    var a = [], n = [], o = {}, l = {}, h = {};
    for (let g = 0, m = this._nodes.length; g < m; ++g) {
      let G = this._nodes[g];
      if (!(t && !G.onExecute)) {
        o[G.id] = G;
        var u = 0;
        if (G.inputs)
          for (var p = 0, c = G.inputs.length; p < c; p++)
            G.inputs[p] && G.inputs[p].link != null && (u += 1);
        u == 0 ? (n.push(G), s && (G._level = 1)) : (s && (G._level = 0), h[G.id] = u);
      }
    }
    for (; n.length != 0; ) {
      var f = n.shift();
      if (a.push(f), delete o[f.id], !!f.outputs)
        for (let g = 0; g < f.outputs.length; g++) {
          let m = f.outputs[g];
          if (!(m == null || m.links == null || m.links.length == 0))
            for (let G = 0; G < m.links.length; G++) {
              let L = m.links[G], T = this.links[L];
              if (!T || l[T.id])
                continue;
              let E = this.getNodeById(T.target_id);
              if (E == null) {
                l[T.id] = !0;
                continue;
              }
              s && (!E._level || E._level <= f._level) && (E._level = f._level + 1), l[T.id] = !0, h[E.id] -= 1, h[E.id] == 0 && n.push(E);
            }
        }
    }
    for (let g in o)
      a.push(o[g]);
    a.length != this._nodes.length && LiteGraph.debug && ((_ = LiteGraph.warn) == null || _.call(LiteGraph, "something went wrong, nodes missing"));
    var d = a.length;
    for (let g = 0; g < d; ++g)
      a[g].order = g;
    a = a.sort((g, m) => {
      let G = g.constructor.priority || g.priority || 0, L = m.constructor.priority || m.priority || 0;
      return G == L ? g.order - m.order : G - L;
    });
    for (let g = 0; g < d; ++g)
      a[g].order = g;
    return a;
  }
  /**
   * Returns all the nodes that could affect this one (ancestors) by crawling all the inputs recursively.
   * It doesn't include the node itself
   * @method getAncestors
   * @return {Array} an array with all the LiteGraph.LGraphNodes that affect this node, in order of execution
   */
  getAncestors(t, s = {}) {
    for (var a = {
      modesSkip: [],
      modesOnly: [],
      typesSkip: [],
      typesOnly: []
    }, n = Object.assign(a, s), o = [], l = [], h = [t], u = {}; h.length; ) {
      var p = h.shift();
      if (p && !u[p.id]) {
        if (u[p.id] = !0, p.id != t.id) {
          if (n.modesSkip && n.modesSkip.length && n.modesSkip.indexOf(p.mode) != -1 || n.modesOnly && n.modesOnly.length && n.modesOnly.indexOf(p.mode) == -1)
            continue;
          l.indexOf(p.id) == -1 && (o.push(p), l.push(p.id));
        }
        if (p.inputs)
          for (var c = 0; c < p.inputs.length; ++c) {
            var f = p.getInputNode(c);
            if (f) {
              var d = p.inputs[c].type;
              n.typesSkip && n.typesSkip.length && n.typesSkip.indexOf(d) != -1 || n.typesOnly && n.typesOnly.length && n.typesOnly.indexOf(f.mode) == -1 || l.indexOf(f.id) == -1 && (u[f.id] || h.push(f));
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
  arrange(t = 100, s) {
    var l;
    const a = this.computeExecutionOrder(!1, !0), n = [];
    for (let h = 0; h < a.length; ++h) {
      const u = a[h], p = u._level || 1;
      (l = n[p]) != null || (n[p] = []), n[p].push(u);
    }
    let o = t;
    for (let h = 0; h < n.length; ++h) {
      const u = n[h];
      if (!u)
        continue;
      let p = 100, c = t + LiteGraph.NODE_TITLE_HEIGHT;
      for (let f = 0; f < u.length; ++f) {
        const d = u[f];
        d.pos[0] = s == LiteGraph.VERTICAL_LAYOUT ? c : o, d.pos[1] = s == LiteGraph.VERTICAL_LAYOUT ? o : c;
        const _ = s == LiteGraph.VERTICAL_LAYOUT ? 1 : 0;
        d.size[_] > p && (p = d.size[_]);
        const g = s == LiteGraph.VERTICAL_LAYOUT ? 0 : 1;
        c += d.size[g] + t + LiteGraph.NODE_TITLE_HEIGHT;
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
  sendEventToAllNodes(t, s, a = LiteGraph.ALWAYS) {
    var n = this._nodes_in_order ? this._nodes_in_order : this._nodes;
    if (n)
      for (let o = 0, l = n.length; o < l; ++o) {
        const h = n[o];
        if (h.constructor === LiteGraph.Subgraph && t !== "onExecute") {
          h.mode == a && h.sendEventToAllNodes(t, s, a);
          continue;
        }
        !h[t] || h.mode !== a || (s === void 0 ? h[t]() : Array.isArray(s) ? h[t].apply(h, s) : h[t](s));
      }
  }
  /**
   * Sends an action with parameters to the connected GraphCanvas instances for processing.
   * @param {string} action - The action to be performed on the GraphCanvas instances.
   * @param {Array} params - An array of parameters to be passed to the action method.
   */
  sendActionToCanvas(t, s) {
    if (this.list_of_graphcanvas)
      for (const a of this.list_of_graphcanvas)
        a[t] && s && a[t](...s);
  }
  /**
   * Adds a new node instance to this graph
   * @method add
   * @param {LiteGraph.LGraphNode} node the instance of the node
   */
  add(t, s, a = {}) {
    var l, h, u;
    var n = {
      doProcessChange: !0,
      doCalcSize: !0
    }, o = Object.assign(n, a);
    if (t) {
      if (t.constructor === LiteGraph.LGraphGroup) {
        this._groups.push(t), this.setDirtyCanvas(!0), this.change(), t.graph = this, this.onGraphChanged({ action: "groupAdd", doSave: o.doProcessChange });
        return;
      }
      if (t.id != -1 && this._nodes_by_id[t.id] != null && ((l = LiteGraph.warn) == null || l.call(LiteGraph, "LiteGraph: there is already a node with this ID, changing it"), LiteGraph.use_uuids ? t.id = LiteGraph.uuidv4() : t.id = ++this.last_node_id), this._nodes.length >= LiteGraph.MAX_NUMBER_OF_NODES)
        throw new Error("LiteGraph: max number of nodes in a graph reached");
      return LiteGraph.use_uuids ? (t.id == null || t.id == -1) && (t.id = LiteGraph.uuidv4()) : t.id == null || t.id == -1 ? t.id = ++this.last_node_id : this.last_node_id < t.id && (this.last_node_id = t.id), t.graph = this, this.onGraphChanged({ action: "nodeAdd", doSave: o.doProcessChange }), this._nodes.push(t), this._nodes_by_id[t.id] = t, (h = t.onAdded) == null || h.call(t, this), this.config.align_to_grid && t.alignToGrid(), s || this.updateExecutionOrder(), (u = this.onNodeAdded) == null || u.call(this, t), o.doCalcSize && t.setSize(t.computeSize()), this.setDirtyCanvas(!0), this.change(), t;
    }
  }
  /**
   * Removes a node from the graph
   * @method remove
   * @param {LiteGraph.LGraphNode} node the instance of the node
   */
  remove(t) {
    var n, o;
    if (t.constructor === LiteGraph.LGraphGroup) {
      var s = this._groups.indexOf(t);
      s != -1 && this._groups.splice(s, 1), t.graph = null, this.onGraphChanged({ action: "groupRemove" }), this.setDirtyCanvas(!0, !0), this.change();
      return;
    }
    if (this._nodes_by_id[t.id] != null && !t.ignore_remove) {
      if (t.inputs)
        for (let l = 0; l < t.inputs.length; l++)
          t.inputs[l].link != null && t.disconnectInput(l, { doProcessChange: !1 });
      if (t.outputs)
        for (let l = 0; l < t.outputs.length; l++) {
          let h = t.outputs[l];
          h.links != null && h.links.length && t.disconnectOutput(l, !1, { doProcessChange: !1 });
        }
      if ((n = t.onRemoved) == null || n.call(t), t.graph = null, this.onGraphChanged({ action: "nodeRemove" }), this.list_of_graphcanvas)
        for (let l = 0; l < this.list_of_graphcanvas.length; ++l) {
          let h = this.list_of_graphcanvas[l];
          h.selected_nodes[t.id] && delete h.selected_nodes[t.id], h.node_dragged == t && (h.node_dragged = null);
        }
      var a = this._nodes.indexOf(t);
      a != -1 && this._nodes.splice(a, 1), delete this._nodes_by_id[t.id], (o = this.onNodeRemoved) == null || o.call(this, t), this.sendActionToCanvas("checkPanels"), this.setDirtyCanvas(!0, !0), this.change(), this.updateExecutionOrder();
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
  findNodesByClass(t, s = []) {
    return s = this._nodes.filter((a) => a.constructor === t), s;
  }
  /**
   * Returns a list of nodes that matches a type
   * @method findNodesByType
   * @param {String} type the name of the node type
   * @return {Array} a list with all the nodes of this type
   */
  findNodesByType(t, s = []) {
    const a = t.toLowerCase();
    return s = this._nodes.filter((n) => n.type.toLowerCase() === a), s;
  }
  /**
   * Returns the first node that matches a name in its title
   * @method findNodeByTitle
   * @param {String} name the name of the node to search
   * @return {Node} the node or null
   */
  findNodeByTitle(t) {
    var s;
    return (s = this._nodes.find((a) => a.title === t)) != null ? s : null;
  }
  /**
   * Returns a list of nodes that matches a name
   * @method findNodesByTitle
   * @param {String} name the name of the node to search
   * @return {Array} a list with all the nodes with this name
   */
  findNodesByTitle(t) {
    return this._nodes.filter((s) => s.title === t);
  }
  /**
   * Returns the top-most node in this position of the canvas
   * @method getNodeOnPos
   * @param {number} x the x coordinate in canvas space
   * @param {number} y the y coordinate in canvas space
   * @param {Array} nodes_list a list with all the nodes to search from, by default is all the nodes in the graph
   * @return {LiteGraph.LGraphNode} the node at this position or null
   */
  getNodeOnPos(t, s, a = this._nodes, n = 0) {
    var o;
    return (o = a.reverse().find((l) => l.isPointInside(t, s, n))) != null ? o : null;
  }
  /**
   * Returns the top-most group in that position
   * @method getGroupOnPos
   * @param {number} x the x coordinate in canvas space
   * @param {number} y the y coordinate in canvas space
   * @return {LiteGraph.LGraphGroup} the group or null
   */
  getGroupOnPos(t, s) {
    var a;
    return (a = this._groups.find((n) => n.isPointInside(t, s, 2, !0))) != null ? a : null;
  }
  /**
   * Checks that the node type matches the node type registered, used when replacing a nodetype by a newer version during execution
   * this replaces the ones using the old version with the new version
   * @method checkNodeTypes
   */
  checkNodeTypes() {
    var o;
    for (var t = 0; t < this._nodes.length; t++) {
      var s = this._nodes[t], a = LiteGraph.registered_node_types[s.type];
      if (s.constructor != a) {
        LiteGraph.debug && ((o = LiteGraph.log) == null || o.call(LiteGraph, `node being replaced by newer version: ${s.type}`));
        var n = LiteGraph.createNode(s.type);
        this._nodes[t] = n, n.configure(s.serialize()), n.graph = this, this._nodes_by_id[n.id] = n, s.inputs && (n.inputs = s.inputs.concat()), s.outputs && (n.outputs = s.outputs.concat());
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
  onAction(t, s, a) {
    this._input_nodes = this.findNodesByClass(
      LiteGraph.GraphInput,
      this._input_nodes
    );
    for (var n = 0; n < this._input_nodes.length; ++n) {
      var o = this._input_nodes[n];
      if (o.properties.name == t) {
        o.actionDo(t, s, a);
        break;
      }
    }
  }
  trigger(t, s) {
    var a;
    (a = this.onTrigger) == null || a.call(this, t, s);
  }
  /**
   * Tell this graph it has a global graph input of this type
   * @method addGlobalInput
   * @param {String} name
   * @param {String} type
   * @param {*} value [optional]
   */
  addInput(t, s, a) {
    var o, l;
    var n = this.inputs[t];
    n || (this.beforeChange(), this.inputs[t] = { name: t, type: s, value: a }, this.onGraphChanged({ action: "addInput" }), this.afterChange(), (o = this.onInputAdded) == null || o.call(this, t, s), (l = this.onInputsOutputsChange) == null || l.call(this));
  }
  /**
   * Assign a data to the global graph input
   * @method setGlobalInputData
   * @param {String} name
   * @param {*} data
   */
  setInputData(t, s) {
    var a = this.inputs[t];
    a && (a.value = s);
  }
  /**
   * Returns the current value of a global graph input
   * @method getInputData
   * @param {String} name
   * @return {*} the data
   */
  getInputData(t) {
    var s = this.inputs[t];
    return s ? s.value : null;
  }
  /**
   * Changes the name of a global graph input
   * @method renameInput
   * @param {String} old_name
   * @param {String} new_name
   */
  renameInput(t, s) {
    var a, n, o;
    if (s != t) {
      if (!this.inputs[t])
        return !1;
      if (this.inputs[s])
        return (a = LiteGraph.error) == null || a.call(LiteGraph, "there is already one input with that name"), !1;
      this.inputs[s] = this.inputs[t], delete this.inputs[t], this.onGraphChanged({ action: "renameInput" }), (n = this.onInputRenamed) == null || n.call(this, t, s), (o = this.onInputsOutputsChange) == null || o.call(this);
    }
  }
  /**
   * Changes the type of a global graph input
   * @method changeInputType
   * @param {String} name
   * @param {String} type
   */
  changeInputType(t, s) {
    var a;
    if (!this.inputs[t])
      return !1;
    this.inputs[t].type && String(this.inputs[t].type).toLowerCase() == String(s).toLowerCase() || (this.inputs[t].type = s, this.onGraphChanged({ action: "changeInputType" }), (a = this.onInputTypeChanged) == null || a.call(this, t, s));
  }
  /**
   * Removes a global graph input
   * @method removeInput
   * @param {String} name
   * @param {String} type
   */
  removeInput(t) {
    var s, a;
    return this.inputs[t] ? (delete this.inputs[t], this.onGraphChanged({ action: "graphRemoveInput" }), (s = this.onInputRemoved) == null || s.call(this, t), (a = this.onInputsOutputsChange) == null || a.call(this), !0) : !1;
  }
  /**
   * Creates a global graph output
   * @method addOutput
   * @param {String} name
   * @param {String} type
   * @param {*} value
   */
  addOutput(t, s, a) {
    var n, o;
    this.outputs[t] = { name: t, type: s, value: a }, this.onGraphChanged({ action: "addOutput" }), (n = this.onOutputAdded) == null || n.call(this, t, s), (o = this.onInputsOutputsChange) == null || o.call(this);
  }
  /**
   * Assign a data to the global output
   * @method setOutputData
   * @param {String} name
   * @param {String} value
   */
  setOutputData(t, s) {
    var a = this.outputs[t];
    a && (a.value = s);
  }
  /**
   * Returns the current value of a global graph output
   * @method getOutputData
   * @param {String} name
   * @return {*} the data
   */
  getOutputData(t) {
    var s = this.outputs[t];
    return s ? s.value : null;
  }
  /**
   * Renames a global graph output
   * @method renameOutput
   * @param {String} old_name
   * @param {String} new_name
   */
  renameOutput(t, s) {
    var a, n, o;
    if (!this.outputs[t])
      return !1;
    if (this.outputs[s])
      return (a = LiteGraph.error) == null || a.call(LiteGraph, "there is already one output with that name"), !1;
    this.outputs[s] = this.outputs[t], delete this.outputs[t], this._version++, (n = this.onOutputRenamed) == null || n.call(this, t, s), (o = this.onInputsOutputsChange) == null || o.call(this);
  }
  /**
   * Changes the type of a global graph output
   * @method changeOutputType
   * @param {String} name
   * @param {String} type
   */
  changeOutputType(t, s) {
    var a;
    if (!this.outputs[t])
      return !1;
    this.outputs[t].type && String(this.outputs[t].type).toLowerCase() == String(s).toLowerCase() || (this.outputs[t].type = s, this.onGraphChanged({ action: "changeOutputType" }), (a = this.onOutputTypeChanged) == null || a.call(this, t, s));
  }
  /**
   * Removes a global graph output
   * @method removeOutput
   * @param {String} name
   */
  removeOutput(t) {
    var s, a;
    return this.outputs[t] ? (delete this.outputs[t], this.onGraphChanged({ action: "removeOutput" }), (s = this.onOutputRemoved) == null || s.call(this, t), (a = this.onInputsOutputsChange) == null || a.call(this), !0) : !1;
  }
  /**
   * Triggers the 'onTrigger' method on nodes with a specific title by passing a value to them.
   * @param {string} name - The title of the nodes to trigger.
   * @param {any} value - The value to pass to the 'onTrigger' method of the nodes.
   */
  triggerInput(t, s) {
    for (var a = this.findNodesByTitle(t), n = 0; n < a.length; ++n)
      a[n].onTrigger(s);
  }
  /**
   * Sets a callback function on nodes with a specific title by invoking their 'setTrigger' method.
   * @param {string} name - The title of the nodes to set the callback function on.
   * @param {Function} func - The callback function to be set on the nodes.
   */
  setCallback(t, s) {
    for (var a = this.findNodesByTitle(t), n = 0; n < a.length; ++n)
      a[n].setTrigger(s);
  }
  /**
   * Executes actions before a change with the provided information detail.
   * Calls the 'onBeforeChange' function on the class instance and sends the action to connected GraphCanvas instances.
   * @param {object} info - The information detail about the change.
   */
  beforeChange(t) {
    var s;
    (s = this.onBeforeChange) == null || s.call(this, this, t), this.sendActionToCanvas("onBeforeChange", this);
  }
  /**
   * Executes actions after a change with the provided information detail.
   * Calls the 'onAfterChange' function on the class instance and sends the action to connected GraphCanvas instances.
   * @param {object} info - The information detail about the change.
   */
  afterChange(t) {
    var s;
    (s = this.onAfterChange) == null || s.call(this, this, t), this.sendActionToCanvas("onAfterChange", this);
  }
  /**
   * Handles changes in node connections and triggers related actions.
   * Updates the execution order, calls the 'onConnectionChange' function on the class instance and connected GraphCanvas instances, and increments the version.
   * @param {object} node - The node where the connection change occurred.
   * @param {object} link_info - Information about the changed connection.
   */
  connectionChange(t) {
    var s;
    this.updateExecutionOrder(), (s = this.onConnectionChange) == null || s.call(this, t), this.onGraphChanged({ action: "connectionChange", doSave: !1 }), this.sendActionToCanvas("onConnectionChange");
  }
  /**
   * returns if the graph is in live mode
   * @method isLive
   */
  isLive() {
    if (!this.list_of_graphcanvas)
      return !1;
    for (var t = 0; t < this.list_of_graphcanvas.length; ++t) {
      var s = this.list_of_graphcanvas[t];
      if (s.live_mode)
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
      var s = this.links[t];
      s && s._last_time && (s._last_time = 0);
    }
  }
  /**
   * Indicates a visual change in the graph (not the structure) and triggers related actions.
   * Logs a message if in debug mode, sends a 'setDirty' action with parameters to connected GraphCanvas instances, and calls the 'on_change' function on the class instance.
   * @method change
   */
  change() {
    var t, s;
    (t = LiteGraph.log) == null || t.call(LiteGraph, "Graph visually changed"), this.sendActionToCanvas("setDirty", [!0, !0]), (s = this.on_change) == null || s.call(this, this);
  }
  setDirtyCanvas(t, s) {
    this.sendActionToCanvas("setDirty", [t, s]);
  }
  /**
   * Destroys a link
   * @method removeLink
   * @param {Number} link_id
   */
  removeLink(t) {
    var s = this.links[t];
    if (s) {
      var a = this.getNodeById(s.target_id);
      a && (this.beforeChange(), a.disconnectInput(s.target_slot), this.afterChange());
    }
  }
  /**
   * Creates a Object containing all the info about this graph, it can be serialized
   * @method serialize
   * @return {Object} value of the node
   */
  serialize() {
    var p, c;
    const t = this._nodes.map((f) => f.serialize());
    var s = [];
    for (var a in this.links) {
      var n = this.links[a];
      if (!n.serialize) {
        (p = LiteGraph.warn) == null || p.call(LiteGraph, "weird LLink bug, link info is not a LLink but a regular object");
        var o = new LiteGraph.LLink();
        for (var l in n)
          o[l] = n[l];
        this.links[a] = o, n = o;
      }
      s.push(n.serialize());
    }
    const h = this._groups.map((f) => f.serialize());
    var u = {
      last_node_id: this.last_node_id,
      last_link_id: this.last_link_id,
      nodes: t,
      links: s,
      groups: h,
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
  configure(t, s) {
    var f, d, _, g, m;
    if (t) {
      s || this.clear();
      var a = t.nodes;
      if (t.links && t.links.constructor === Array) {
        for (var n = [], o = 0; o < t.links.length; ++o) {
          var l = t.links[o];
          if (!l) {
            (f = LiteGraph.warn) == null || f.call(LiteGraph, "serialized graph link data contains errors, skipping.");
            continue;
          }
          var h = new LiteGraph.LLink();
          h.configure(l), n[h.id] = h;
        }
        t.links = n;
      }
      for (let G in t)
        ["nodes", "groups"].includes(G) || (this[G] = t[G]);
      var u = !1;
      if (this._nodes = [], a) {
        for (let G = 0, L = a.length; G < L; ++G) {
          var p = a[G], c = LiteGraph.createNode(p.type, p.title);
          c || ((d = LiteGraph.log) == null || d.call(LiteGraph, `Node not found or has errors: ${p.type}`), c = new LiteGraph.LGraphNode(), c.last_serialization = p, c.has_errors = !0, u = !0), c.id = p.id, this.add(c, !0, { doProcessChange: !1 });
        }
        a.forEach((G) => {
          const L = this.getNodeById(G.id);
          L == null || L.configure(G);
        });
      }
      return this._groups.length = 0, t.groups && t.groups.forEach((G) => {
        const L = new LiteGraph.LGraphGroup();
        L.configure(G), this.add(L, !0, { doProcessChange: !1 });
      }), this.updateExecutionOrder(), this.extra = (_ = t.extra) != null ? _ : {}, (g = this.onConfigure) == null || g.call(this, t), t._version ? (m = LiteGraph.debug) == null || m.call(LiteGraph, "skip onGraphChanged when configure passing version too!") : this.onGraphChanged({ action: "graphConfigure", doSave: !1 }), this.setDirtyCanvas(!0, !0), u;
    }
  }
  /**
   * Loads graph data from a given URL or file and configures the graph accordingly.
   * @param {string | File | Blob} url - The URL or file to load the graph data from.
   * @param {Function} callback - An optional callback function to be executed after loading and configuring the graph.
   */
  load(t, s) {
    var a = this;
    if (t.constructor === File || t.constructor === Blob) {
      var n = new FileReader();
      n.addEventListener("load", (l) => {
        var h = JSON.parse(l.target.result);
        a.configure(h), s == null || s();
      }), n.readAsText(t);
      return;
    }
    var o = new XMLHttpRequest();
    o.open("GET", t, !0), o.send(null), o.onload = (l) => {
      var u;
      if (o.status !== 200) {
        (u = LiteGraph.error) == null || u.call(LiteGraph, "Error loading graph:", o.status, o.response);
        return;
      }
      var h = JSON.parse(o.response);
      a.configure(h), s == null || s();
    }, o.onerror = (l) => {
      var h;
      (h = LiteGraph.error) == null || h.call(LiteGraph, "Error loading graph:", l);
    };
  }
  /**
  * Meant to serve the history-saving mechanism
  * @method onGraphSaved
  * @param {object} optsIn options
  */
  onGraphSaved(t = {}) {
    var s = {};
    Object.assign(s, t), this.savedVersion = this._version;
  }
  /**
  * Meant to serve the history-saving mechanism
  * @method onGraphSaved
  * @param {object} optsIn options
  */
  onGraphLoaded(t = {}) {
    var s = {};
    Object.assign(s, t), this.savedVersion = this._version;
  }
  /**
  * Ment to be the history and prevent-exit mechanism, call to change _version
  * @method onGraphChanged
  * @param {object} optsIn options
  */
  onGraphChanged(t = {}) {
    var h, u, p, c, f, d;
    var s = {
      action: "",
      doSave: !0,
      // log action in graph.history
      doSaveGraph: !0
      // save
    }, a = Object.assign(s, t);
    if (this._version++, a.action ? (h = LiteGraph.debug) == null || h.call(LiteGraph, "Graph change", a.action) : (u = LiteGraph.debug) == null || u.call(LiteGraph, "Graph change, no action", a), a.doSave && LiteGraph.actionHistory_enabled) {
      (p = LiteGraph.debug) == null || p.call(LiteGraph, "onGraphChanged SAVE :: " + a.action);
      var n = { actionName: a.action };
      a.doSaveGraph && (n = Object.assign(
        n,
        { graphSave: this.serialize() }
        // this is a heavy method, but the alternative is way more complex: every action has to have its contrary
      ));
      for (var o = this.history; o.actionHistoryPtr < o.actionHistoryVersions.length - 1; )
        (c = LiteGraph.debug) == null || c.call(LiteGraph, "popping: gone back? " + (o.actionHistoryPtr + " < " + (o.actionHistoryVersions.length - 1))), o.actionHistoryVersions.pop();
      if (o.actionHistoryVersions.length >= LiteGraph.actionHistoryMaxSave) {
        var l = o.actionHistoryVersions.shift();
        (f = LiteGraph.debug) == null || f.call(LiteGraph, "maximum saves reached: " + o.actionHistoryVersions.length + ", remove older: " + l), o.actionHistory[l] = !1;
      }
      o.actionHistoryPtr = o.actionHistoryVersions.length, o.actionHistoryVersions.push(o.actionHistoryPtr), o.actionHistory[o.actionHistoryPtr] = n, (d = LiteGraph.debug) == null || d.call(LiteGraph, "history saved: " + o.actionHistoryPtr, n.actionName);
    }
  }
  /**
  * Go back in action history
  * @method actionHistoryBack
  * @param {object} optsIn options
  */
  actionHistoryBack(t = {}) {
    var n, o, l, h, u;
    var s = {};
    Object.assign(s, t);
    var a = this.history;
    return a.actionHistoryPtr != null && a.actionHistoryPtr >= 0 ? (a.actionHistoryPtr--, (n = LiteGraph.debug) == null || n.call(LiteGraph, "history step back: " + a.actionHistoryPtr), this.actionHistoryLoad({ iVersion: a.actionHistoryPtr }) ? ((l = LiteGraph.debug) == null || l.call(LiteGraph, "history loaded back: " + a.actionHistoryPtr), (h = LiteGraph.debug) == null || h.call(LiteGraph, this.history), !0) : ((o = LiteGraph.warn) == null || o.call(LiteGraph, "historyLoad failed, restore pointer? " + a.actionHistoryPtr), a.actionHistoryPtr++, !1)) : ((u = LiteGraph.debug) == null || u.call(LiteGraph, "history is already at older state"), !1);
  }
  /**
  * Go forward in action history
  * @method actionHistoryForward
  * @param {object} optsIn options
  */
  actionHistoryForward(t = {}) {
    var n, o, l, h;
    var s = {};
    Object.assign(s, t);
    var a = this.history;
    return a.actionHistoryPtr < a.actionHistoryVersions.length ? (a.actionHistoryPtr++, (n = LiteGraph.debug) == null || n.call(LiteGraph, "history step forward: " + a.actionHistoryPtr), this.actionHistoryLoad({ iVersion: a.actionHistoryPtr }) ? ((l = LiteGraph.debug) == null || l.call(LiteGraph, "history loaded forward: " + a.actionHistoryPtr), !0) : ((o = LiteGraph.warn) == null || o.call(LiteGraph, "historyLoad failed, restore pointer? " + a.actionHistoryPtr), a.actionHistoryPtr--, !1)) : ((h = LiteGraph.debug) == null || h.call(LiteGraph, "history is already at newer state"), !1);
  }
  /**
  * Load from action history
  * @method actionHistoryLoad
  * @param {object} optsIn options
  */
  actionHistoryLoad(t = {}) {
    var l;
    var s = {
      iVersion: !1,
      backStep: !1
    }, a = Object.assign(s, t), n = this.history;
    if (n.actionHistory[a.iVersion] && n.actionHistory[a.iVersion].graphSave) {
      var o = JSON.stringify(this.history);
      return this.configure(n.actionHistory[a.iVersion].graphSave), this.history = JSON.parse(o), (l = LiteGraph.debug) == null || l.call(LiteGraph, "history loaded: " + a.iVersion, n.actionHistory[a.iVersion].actionName), !0;
    } else
      return !1;
  }
};
// default supported types
b(J, "supported_types", ["number", "string", "boolean"]), b(J, "STATUS_STOPPED", 1), b(J, "STATUS_RUNNING", 2);
let LGraph = J;
class LGraphNode {
  constructor(t = "Unnamed") {
    this.title = t, this.size = [LiteGraph.NODE_WIDTH, 60], this.graph = null, this._pos = new Float32Array(10, 10), LiteGraph.use_uuids ? this.id = LiteGraph.uuidv4() : this.id = -1, this.type = null, this.inputs = [], this.outputs = [], this.connections = [], this.properties = {}, this.properties_info = [], this.flags = {};
  }
  set pos(t) {
    var s;
    !t || t.length < 2 || ((s = this._pos) != null || (this._pos = new Float32Array(10, 10)), this._pos[0] = t[0], this._pos[1] = t[1]);
  }
  get pos() {
    return this._pos;
  }
  /**
   * configure a node from an object containing the serialized info
   * @method configure
   */
  configure(t) {
    var s, a, n, o, l;
    Object.entries(t).forEach(([h, u]) => {
      var c;
      if (h === "properties") {
        for (var p in u)
          this.properties[p] = u[p], (c = this.onPropertyChanged) == null || c.call(this, p, u[p]);
        return;
      }
      u !== null && (typeof u == "object" ? this[h] && this[h].configure ? this[h].configure(u) : this[h] = LiteGraph.cloneObject(u, this[h]) : this[h] = u);
    }), t.title || (this.title = this.constructor.title), (s = this.inputs) == null || s.forEach((h, u) => {
      var c, f;
      if (!h.link)
        return;
      const p = this.graph ? this.graph.links[h.link] : null;
      (c = this.onConnectionsChange) == null || c.call(this, LiteGraph.INPUT, u, !0, p, h), (f = this.onInputAdded) == null || f.call(this, h);
    }), (a = this.outputs) == null || a.forEach((h, u) => {
      var p;
      h.links && (h.links.forEach(() => {
        var f;
        const c = this.graph;
        (f = this.onConnectionsChange) == null || f.call(this, LiteGraph.OUTPUT, u, !0, c, h);
      }), (p = this.onOutputAdded) == null || p.call(this, h));
    }), this.widgets && (this.widgets.forEach((h) => {
      h && h.options && h.options.property && this.properties[h.options.property] !== void 0 && (h.value = JSON.parse(JSON.stringify(this.properties[h.options.property])));
    }), (n = t.widgets_values) == null || n.forEach((h, u) => {
      this.widgets[u] && (this.widgets[u].value = h);
    })), (o = this.onConfigure) == null || o.call(this, t), (l = this.graph) == null || l.onGraphChanged({ action: "nodeConfigure", doSave: !1 });
  }
  /**
   * serialize the content
   * @method serialize
   */
  serialize() {
    var s, a, n;
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
      var l;
      return (l = o == null ? void 0 : o.value) != null ? l : null;
    })), (s = t.type) != null || (t.type = this.constructor.type), this.color && (t.color = this.color), this.bgcolor && (t.bgcolor = this.bgcolor), this.boxcolor && (t.boxcolor = this.boxcolor), this.shape && (t.shape = this.shape), (a = this.onSerialize) != null && a.call(this, t) && ((n = LiteGraph.warn) == null || n.call(LiteGraph, "node onSerialize shouldnt return anything, data should be stored in the object pass in the first parameter")), t);
  }
  /* Creates a clone of this node */
  clone() {
    var a, n;
    var t = LiteGraph.createNode(this.type);
    if (!t)
      return null;
    var s = LiteGraph.cloneObject(this.serialize());
    return (a = s.inputs) == null || a.forEach((o) => {
      o.link = null;
    }), (n = s.outputs) == null || n.forEach((o) => {
      o.links && (o.links.length = 0);
    }), delete s.id, LiteGraph.use_uuids && (s.id = LiteGraph.uuidv4()), t.configure(s), t;
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
  setProperty(t, s) {
    var o, l;
    if (this.properties || (this.properties = {}), s === this.properties[t])
      return;
    const a = this.properties[t];
    this.properties[t] = s, ((o = this.onPropertyChanged) == null ? void 0 : o.call(this, t, s, a)) === !1 && (this.properties[t] = a);
    const n = (l = this.widgets) == null ? void 0 : l.find((h) => {
      var u;
      return h && ((u = h.options) == null ? void 0 : u.property) === t;
    });
    n && (n.value = s);
  }
  // Execution *************************
  /**
   * sets the output data
   * @method setOutputData
   * @param {number} slot
   * @param {*} data
   */
  setOutputData(t, s) {
    var n;
    if (this.outputs) {
      if ((t == null ? void 0 : t.constructor) === String)
        t = this.findOutputSlot(t);
      else if (t == -1 || t >= this.outputs.length)
        return;
      var a = this.outputs[t];
      a && (a._data = s, (n = this.outputs[t].links) == null || n.forEach((o) => {
        const l = this.graph.links[o];
        l && (l.data = s);
      }));
    }
  }
  /**
   * sets the output data type, useful when you want to be able to overwrite the data type
   * @method setOutputDataType
   * @param {number} slot
   * @param {String} datatype
   */
  setOutputDataType(t, s) {
    var n, o;
    if (this.outputs && !(t == -1 || t >= this.outputs.length)) {
      var a = this.outputs[t];
      a && (a.type = s, (o = (n = this.outputs[t]) == null ? void 0 : n.links) == null || o.forEach((l) => {
        this.graph.links[l] && (this.graph.links[l].type = s);
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
  getInputData(t, s, a) {
    var p;
    if (this.inputs && !(t >= this.inputs.length || this.inputs[t].link == null)) {
      var n = this.inputs[t].link, o = this.graph.links[n];
      if (!o)
        return null;
      if (!s)
        return o.data;
      var l = this.graph.getNodeById(o.origin_id);
      if (!l)
        return o.data;
      if (a) {
        var h = this.id + "_getInputData_forced_" + Math.floor(Math.random() * 9999), u = { action: h, options: { action_call: h } };
        this.refreshAncestors(u);
      }
      return l.updateOutputData ? l.updateOutputData(o.origin_slot) : (p = l.doExecute) == null || p.call(l), o.data;
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
    var s = this.inputs[t].link, a = this.graph.links[s];
    if (!a)
      return null;
    var n = this.graph.getNodeById(a.origin_id);
    if (!n)
      return a.type;
    var o = n.outputs[a.origin_slot];
    return o ? o.type : null;
  }
  /**
   * Retrieves the input data from one slot using its name instead of slot number
   * @method getInputDataByName
   * @param {String} slot_name
   * @param {boolean} force_update if set to true it will force the connected node of this slot to output data into this link
   * @return {*} data or if it is not connected returns null
   */
  getInputDataByName(t, s) {
    var a = this.findInputSlot(t);
    return a == -1 ? null : this.getInputData(a, s);
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
      var s = this.inputs[t];
      return this.graph.links[s.link];
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
    var s = this.inputs[t];
    if (!s || s.link === null)
      return null;
    var a = this.graph.links[s.link];
    return a ? this.graph.getNodeById(a.origin_id) : null;
  }
  /**
   * returns the value of an input with this name, otherwise checks if there is a property with that name
   * @method getInputOrProperty
   * @param {string} name
   * @return {*} value
   */
  getInputOrProperty(t) {
    if (this.inputs)
      for (var s = 0, a = this.inputs.length; s < a; ++s) {
        var n = this.inputs[s];
        if (t == n.name && n.link != null) {
          var o = this.graph.links[n.link];
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
    var s = this.outputs[t];
    return s._data;
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
    const s = this.outputs[t];
    return !s.links || s.links.length === 0 ? null : s.links.map((a) => this.graph.links[a]).filter((a) => a).map((a) => this.graph.getNodeById(a.target_id)).filter((a) => a);
  }
  addOnTriggerInput() {
    var t = this.findInputSlot("onTrigger");
    return t == -1 ? (this.addInput("onTrigger", LiteGraph.EVENT, { removable: !0, nameLocked: !0 }), this.findInputSlot("onTrigger")) : t;
  }
  addOnExecutedOutput() {
    var t = this.findOutputSlot("onExecuted");
    return t == -1 ? (this.addOutput("onExecuted", LiteGraph.ACTION, { removable: !0, nameLocked: !0 }), this.findOutputSlot("onExecuted")) : t;
  }
  onAfterExecuteNode(t, s) {
    var n;
    var a = this.findOutputSlot("onExecuted");
    a != -1 && ((n = LiteGraph.debug) == null || n.call(LiteGraph, this.id + ":" + this.order + " triggering slot onAfterExecute", t, s), this.triggerSlot(a, t, null, s));
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
  doExecute(t, s = {}) {
    var a, n, o, l, h;
    if (this.onExecute) {
      if ((a = s.action_call) != null || (s.action_call = `${this.id}_exec_${Math.floor(Math.random() * 9999)}`), this.graph.nodes_executing && this.graph.nodes_executing[this.id]) {
        (n = LiteGraph.debug) == null || n.call(LiteGraph, "NODE already executing! Prevent! " + this.id + ":" + this.order);
        return;
      }
      if (LiteGraph.ensureNodeSingleExecution && this.exec_version && this.exec_version >= this.graph.iteration && this.exec_version !== void 0) {
        (o = LiteGraph.debug) == null || o.call(LiteGraph, "!! NODE already EXECUTED THIS STEP !! " + this.exec_version);
        return;
      }
      if (LiteGraph.ensureUniqueExecutionAndActionCall && this.graph.nodes_executedAction[this.id] && s && s.action_call && this.graph.nodes_executedAction[this.id] == s.action_call) {
        (l = LiteGraph.debug) == null || l.call(LiteGraph, "!! NODE already ACTION THIS STEP !! " + s.action_call);
        return;
      }
      this.graph.nodes_executing[this.id] = !0, this.onExecute(t, s), this.graph.nodes_executing[this.id] = !1, this.exec_version = this.graph.iteration, s && s.action_call && (this.action_call = s.action_call, this.graph.nodes_executedAction[this.id] = s.action_call);
    }
    this.execute_triggered = 2, (h = this.onAfterExecuteNode) == null || h.call(this, t, s);
  }
  /**
   * retrocompatibility :: old doExecute
   * @method doExecute
   * @param {*} param
   * @param {*} options
   */
  execute(t, s = {}) {
    return this.doExecute(t, s);
  }
  /**
   * Triggers an action, wrapped by logics to control execution flow
   * @method actionDo
   * @param {String} action name
   * @param {*} param
   */
  actionDo(t, s, a = {}, n) {
    var o, l, h, u;
    if (this.onAction) {
      if ((o = a.action_call) != null || (a.action_call = `${this.id}_${t || "action"}_${Math.floor(Math.random() * 9999)}`), LiteGraph.ensureNodeSingleAction && this.graph.nodes_actioning && this.graph.nodes_actioning[this.id] == a.action_call)
        return;
      if ((l = LiteGraph.debug) == null || l.call(LiteGraph, "CheckActioned ? " + this.id + ":" + this.order + " :: " + this.action_call), LiteGraph.ensureUniqueExecutionAndActionCall && this.graph.nodes_executedAction[this.id] && a && a.action_call && this.graph.nodes_executedAction[this.id] == a.action_call) {
        (h = LiteGraph.debug) == null || h.call(LiteGraph, "!! NODE already ACTION THIS STEP !! " + a.action_call), ç;
        return;
      }
      this.graph.nodes_actioning[this.id] = t || "actioning", this.onAction(t, s, a, n), this.graph.nodes_actioning[this.id] = !1, a && a.action_call && (this.action_call = a.action_call, this.graph.nodes_executedAction[this.id] = a.action_call);
    }
    this.action_triggered = 2, (u = this.onAfterExecuteNode) == null || u.call(this, s, a);
  }
  /**
   * Triggers an event in this node, this will trigger any output with the same name
   * @method trigger
   * @param {String} event name ( "on_play", ... ) if action is equivalent to false then the event is send to all
   * @param {*} param
   */
  trigger(t, s, a) {
    !this.outputs || this.outputs.length === 0 || (this.graph && (this.graph._last_trigger_time = LiteGraph.getTime()), this.outputs.forEach((n, o) => {
      n && n.type === LiteGraph.EVENT && (!t || n.name === t) && this.triggerSlot(o, s, null, a);
    }));
  }
  /**
   * Triggers a slot event in this node: cycle output slots and launch execute/action on connected nodes
   * @method triggerSlot
   * @param {Number} slot the index of the output slot
   * @param {*} param
   * @param {Number} link_id [optional] in case you want to trigger and specific output link in a slot
   */
  triggerSlot(t, s, a, n = {}) {
    var f, d, _, g;
    if (this.outputs) {
      if (t == null) {
        (f = LiteGraph.error) == null || f.call(LiteGraph, "triggerSlot", "slot must be a number");
        return;
      }
      t.constructor !== Number && ((d = LiteGraph.warn) == null || d.call(LiteGraph, "triggerSlot", "slot must be a number, use node.trigger('name') if you want to use a string"));
      var o = this.outputs[t];
      if (o) {
        var l = o.links;
        if (!(!l || !l.length) && !(this.graph && this.graph.ancestorsCall)) {
          this.graph && (this.graph._last_trigger_time = LiteGraph.getTime());
          for (var h = 0; h < l.length; ++h) {
            var u = l[h];
            if (!(a != null && a != u)) {
              var p = this.graph.links[l[h]];
              if (p) {
                p._last_time = LiteGraph.getTime();
                var c = this.graph.getNodeById(p.target_id);
                if (c) {
                  if (c.mode === LiteGraph.ON_TRIGGER)
                    n.action_call || (n.action_call = `${this.id}_trigg_${Math.floor(Math.random() * 9999)}`), LiteGraph.refreshAncestorsOnTriggers && c.refreshAncestors({ action: "trigger", param: s, options: n }), c.onExecute && c.doExecute(s, n);
                  else if (c.onAction) {
                    n.action_call || (n.action_call = `${this.id}_act_${Math.floor(Math.random() * 9999)}`);
                    let m = c.inputs[p.target_slot];
                    (_ = LiteGraph.debug) == null || _.call(LiteGraph, "triggerSlot", "will call onACTION: " + this.id + ":" + this.order + " :: " + m.name), LiteGraph.refreshAncestorsOnActions && c.refreshAncestors({ action: m.name, param: s, options: n }), LiteGraph.use_deferred_actions && c.onExecute ? ((g = c._waiting_actions) != null || (c._waiting_actions = []), c._waiting_actions.push([m.name, s, n, p.target_slot])) : c.actionDo(m.name, s, n, p.target_slot);
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
  clearTriggeredSlot(t, s) {
    !this.outputs || !this.outputs[t] || !this.outputs[t].links || this.outputs[t].links.forEach((a) => {
      if (s !== null && s !== a)
        return;
      const n = this.graph.links[a];
      n && (n._last_time = 0);
    });
  }
  /**
   * changes node size and triggers callback
   * @method setSize
   * @param {vec2} size
   */
  setSize(t) {
    var s;
    this.size = t, (s = this.onResize) == null || s.call(this, this.size);
  }
  /**
   * add a new property to this node
   * @method addProperty
   * @param {string} name
   * @param {*} default_value
   * @param {string} type string defining the output type ("vec3","number",...)
   * @param {Object} extra_info this can be used to have special properties of the property (like values, etc)
   */
  addProperty(t, s, a, n) {
    var l, h;
    const o = { name: t, type: a, default_value: s, ...n };
    return this.properties_info = (l = this.properties_info) != null ? l : [], this.properties_info.push(o), this.properties = (h = this.properties) != null ? h : {}, this.properties[t] = s, o;
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
  addInput(t, s, a) {
    return this.addSlot(t, s, a, !0);
  }
  addOutput(t, s, a) {
    return this.addSlot(t, s, a, !1);
  }
  addSlot(t, s, a, n) {
    var l, h, u, p;
    const o = n ? { name: t, type: s, link: null, ...a } : { name: t, type: s, links: null, ...a };
    return n ? (this.inputs = (l = this.inputs) != null ? l : [], this.inputs.push(o), (h = this.onInputAdded) == null || h.call(this, o), LiteGraph.registerNodeAndSlotType(this, s)) : (this.outputs = (u = this.outputs) != null ? u : [], this.outputs.push(o), (p = this.onOutputAdded) == null || p.call(this, o), LiteGraph.auto_load_slot_types && LiteGraph.registerNodeAndSlotType(this, s, !0)), this.setSize(this.computeSize()), this.setDirtyCanvas(!0, !0), o;
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
  addSlots(t, s) {
    var a;
    typeof t == "string" && (t = [t]), t.forEach((n) => {
      var l, h, u, p, c, f;
      const o = s ? {
        name: n[0],
        type: n[1],
        link: null,
        ...(l = n[2]) != null ? l : {}
      } : {
        name: n[0],
        type: n[1],
        links: null,
        ...(h = n[2]) != null ? h : {}
      };
      s ? (this.inputs = (u = this.inputs) != null ? u : [], this.inputs.push(o), (p = this.onInputAdded) == null || p.call(this, o), LiteGraph.registerNodeAndSlotType(this, n[1])) : (this.outputs = (c = this.outputs) != null ? c : [], this.outputs.push(o), (f = this.onOutputAdded) == null || f.call(this, o), LiteGraph.auto_load_slot_types && LiteGraph.registerNodeAndSlotType(this, n[1], !0));
    }), this.setSize(this.computeSize()), (a = this.setDirtyCanvas) == null || a.call(this, !0, !0);
  }
  /**
   * remove an existing input slot
   * @method removeInput
   * @param {number} slot
   *
   * @NOTE: These two are different enough yet I can't even mash them together meaningfully.
   */
  removeInput(t) {
    var a;
    this.disconnectInput(t);
    const s = this.inputs.splice(t, 1)[0];
    this.inputs.slice(t).filter((n) => !!n).forEach((n) => {
      const o = this.graph.links[n.link];
      o != null && o.target_slot && o.target_slot--;
    }), this.setSize(this.computeSize()), (a = this.onInputRemoved) == null || a.call(this, t, s), this.setDirtyCanvas(!0, !0);
  }
  /**
   * remove an existing output slot
   * @method removeOutput
   * @param {number} slot
   */
  removeOutput(t) {
    var s;
    this.disconnectOutput(t), this.outputs = this.outputs.filter((a, n) => n !== t), this.outputs.slice(t).forEach((a) => {
      !a || !a.links || a.links.forEach((n) => {
        const o = this.graph.links[n];
        o && (o.origin_slot -= 1);
      });
    }), this.setSize(this.computeSize()), (s = this.onOutputRemoved) == null || s.call(this, t), this.setDirtyCanvas(!0, !0);
  }
  /**
   * Add a special connection to this node (used for special kinds of graphs)
   * @method addConnection
   * @param {string} name - The name of the connection
   * @param {string} type - String defining the input type ("vec3", "number", etc.)
   * @param {Float32[]} pos - Position of the connection inside the node as an array [x, y]
   * @param {string} direction - Specifies if it is an input or output connection
   */
  addConnection(t, s, a, n) {
    var o = {
      name: t,
      type: s,
      pos: a,
      direction: n,
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
    var s = t || new Float32Array([0, 0]), a = LiteGraph.NODE_TEXT_SIZE;
    const n = (d) => d ? a * d.length * 0.6 : 0;
    var o = n(this.title), l = 0, h = 0;
    this.inputs && (l = this.inputs.reduce((d, _) => {
      const g = _.label || _.name || "", m = n(g);
      return Math.max(d, m);
    }, 0)), this.outputs && (h = this.outputs.reduce((d, _) => {
      const g = _.label || _.name || "", m = n(g);
      return Math.max(d, m);
    }, 0)), s[0] = Math.max(l + h + 10, o), s[0] = Math.max(s[0], LiteGraph.NODE_WIDTH), this.widgets && this.widgets.length && (s[0] = Math.max(s[0], LiteGraph.NODE_WIDTH * 1.5));
    const u = Math.max(
      this.inputs ? this.inputs.length : 1,
      this.outputs ? this.outputs.length : 1,
      1
    ) * LiteGraph.NODE_SLOT_HEIGHT;
    s[1] = u + (this.constructor.slot_start_y || 0);
    let p = 0;
    if (this.widgets && this.widgets.length) {
      for (var c = 0, f = this.widgets.length; c < f; ++c)
        this.widgets[c].computeSize ? p += this.widgets[c].computeSize(s[0])[1] + 4 : p += LiteGraph.NODE_WIDGET_HEIGHT + 4;
      p += 8;
    }
    return this.widgets_up ? s[1] = Math.max(s[1], p) : this.widgets_start_y != null ? s[1] = Math.max(s[1], p + this.widgets_start_y) : s[1] += p, this.constructor.min_height && s[1] < this.constructor.min_height && (s[1] = this.constructor.min_height), s[1] += 6, s;
  }
  /**
   * returns all the info available about a property of this node.
   *
   * @method getPropertyInfo
   * @param {String} property name of the property
   * @return {Object} the object with all the available info
  */
  getPropertyInfo(t) {
    var s = null;
    if (this.properties_info) {
      for (var a = 0; a < this.properties_info.length; ++a)
        if (this.properties_info[a].name == t) {
          s = this.properties_info[a];
          break;
        }
    }
    return this.constructor[`@${t}`] && (s = this.constructor[`@${t}`]), this.constructor.widgets_info && this.constructor.widgets_info[t] && (s = this.constructor.widgets_info[t]), !s && this.onGetPropertyInfo && (s = this.onGetPropertyInfo(t)), s || (s = {}), s.type || (s.type = typeof this.properties[t]), s.widget == "combo" && (s.type = "enum"), s;
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
  addWidget(t, s, a, n, o) {
    var h, u, p;
    (h = this.widgets) != null || (this.widgets = []), !o && n && n.constructor === Object && (o = n, n = null), o && o.constructor === String && (o = { property: o }), n && n.constructor === String && (o != null || (o = {}), o.property = n, n = null), n && n.constructor !== Function && ((u = LiteGraph.warn) == null || u.call(LiteGraph, "addWidget: callback must be a function"), n = null);
    var l = {
      type: t.toLowerCase(),
      name: s,
      value: a,
      callback: n,
      options: o || {}
    };
    if (l.options.y !== void 0 && (l.y = l.options.y), !n && !l.options.callback && !l.options.property && ((p = LiteGraph.warn) == null || p.call(LiteGraph, "LiteGraph addWidget(...) without a callback or property assigned")), t == "combo" && !l.options.values)
      throw Error("LiteGraph addWidget('combo',...) requires to pass values in options: { values:['red','blue'] }");
    return this.widgets.push(l), this.setSize(this.computeSize()), l;
  }
  addCustomWidget(t) {
    var s;
    return (s = this.widgets) != null || (this.widgets = []), this.widgets.push(t), t;
  }
  /**
   * Returns the bounding box of the object, used for rendering purposes
   * @method getBounding
   * @param {Float32[]} [out] - [Optional] A place to store the output to reduce garbage
   * @param {boolean} [compute_outer] - [Optional] Set to true to include the shadow and connection points in the bounding calculation
   * @return {Float32[]} The bounding box in the format of [topLeftCornerX, topLeftCornerY, width, height]
   */
  getBounding(t = new Float32Array(4), s) {
    const a = this.pos, n = this.flags.collapsed, o = this.size;
    let l = 0, h = 1, u = 0, p = 0;
    return s && (l = 4, h = 6 + l, u = 4, p = 5 + u), t[0] = a[0] - l, t[1] = a[1] - LiteGraph.NODE_TITLE_HEIGHT - u, t[2] = n ? (this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH) + h : o[0] + h, t[3] = n ? LiteGraph.NODE_TITLE_HEIGHT + p : o[1] + LiteGraph.NODE_TITLE_HEIGHT + p, this.onBounding && this.onBounding(t), t;
  }
  /**
   * checks if a point is inside the shape of a node
   * @method isPointInside
   * @param {number} x
   * @param {number} y
   * @return {boolean}
   */
  isPointInside(t, s, a = 0, n) {
    var o = this.graph && this.graph.isLive() ? 0 : LiteGraph.NODE_TITLE_HEIGHT;
    if (n && (o = 0), this.flags && this.flags.collapsed) {
      if (LiteGraph.isInsideRectangle(
        t,
        s,
        this.pos[0] - a,
        this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT - a,
        (this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH) + 2 * a,
        LiteGraph.NODE_TITLE_HEIGHT + 2 * a
      ))
        return !0;
    } else if (this.pos[0] - 4 - a < t && this.pos[0] + this.size[0] + 4 + a > t && this.pos[1] - o - a < s && this.pos[1] + this.size[1] + a > s)
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
  getSlotInPosition(t, s) {
    var a = new Float32Array(2);
    if (this.inputs)
      for (let n = 0, o = this.inputs.length; n < o; ++n) {
        let l = this.inputs[n];
        if (this.getConnectionPos(!0, n, a), LiteGraph.isInsideRectangle(
          t,
          s,
          a[0] - 10,
          a[1] - 5,
          20,
          10
        ))
          return { input: l, slot: n, link_pos: a };
      }
    if (this.outputs)
      for (let n = 0, o = this.outputs.length; n < o; ++n) {
        let l = this.outputs[n];
        if (this.getConnectionPos(!1, n, a), LiteGraph.isInsideRectangle(
          t,
          s,
          a[0] - 10,
          a[1] - 5,
          20,
          10
        ))
          return { output: l, slot: n, link_pos: a };
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
  findInputSlot(t, s) {
    if (!this.inputs)
      return -1;
    for (var a = 0, n = this.inputs.length; a < n; ++a)
      if (t == this.inputs[a].name)
        return s ? this.inputs[a] : a;
    return -1;
  }
  /**
   * returns the output slot with a given name (used for dynamic slots), -1 if not found
   * @method findOutputSlot
   * @param {string} name the name of the slot
   * @param {boolean} returnObj if the obj itself wanted
   * @return {number_or_object} the slot (-1 if not found)
   */
  findOutputSlot(t, s = !1) {
    if (!this.outputs)
      return -1;
    for (var a = 0, n = this.outputs.length; a < n; ++a)
      if (t == this.outputs[a].name)
        return s ? this.outputs[a] : a;
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
    var s = {
      returnObj: !1,
      typesNotAccepted: []
    }, a = Object.assign(s, t);
    if (!this.inputs)
      return -1;
    for (var n = 0, o = this.inputs.length; n < o; ++n)
      if (!(this.inputs[n].link && this.inputs[n].link != null) && !(a.typesNotAccepted && a.typesNotAccepted.includes && a.typesNotAccepted.includes(this.inputs[n].type)))
        return a.returnObj ? this.inputs[n] : n;
    return -1;
  }
  /**
   * returns the first output slot free
   * @method findOutputSlotFree
   * @param {object} options
   * @return {number_or_object} the slot (-1 if not found)
   */
  findOutputSlotFree(t = {}) {
    var s = {
      returnObj: !1,
      typesNotAccepted: []
    }, a = Object.assign(s, t);
    if (!this.outputs)
      return -1;
    for (let n = 0, o = this.outputs.length; n < o; ++n)
      if (!(this.outputs[n].links && this.outputs[n].links != null) && !(a.typesNotAccepted && a.typesNotAccepted.includes && a.typesNotAccepted.includes(this.outputs[n].type)))
        return a.returnObj ? this.outputs[n] : n;
    return -1;
  }
  /**
   * findSlotByType for INPUTS
   */
  findInputSlotByType(t, s, a, n) {
    return this.findSlotByType(!0, t, s, a, n);
  }
  /**
   * findSlotByType for OUTPUTS
   */
  findOutputSlotByType(t, s, a, n) {
    return this.findSlotByType(!1, t, s, a, n);
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
  findSlotByType(t = !1, s, a = !1, n = !1, o = !1) {
    var l = t ? this.inputs : this.outputs;
    if (!l)
      return -1;
    (s == "" || s == "*") && (s = 0);
    for (let h = 0, u = l.length; h < u; ++h) {
      let p = (s + "").toLowerCase().split(","), c = l[h].type == "0" || l[h].type == "*" ? "0" : l[h].type;
      c = (c + "").toLowerCase().split(",");
      for (let f = 0; f < p.length; f++)
        for (let d = 0; d < c.length; d++)
          if (p[f] == "_event_" && (p[f] = LiteGraph.EVENT), c[f] == "_event_" && (c[f] = LiteGraph.EVENT), p[f] == "*" && (p[f] = 0), c[f] == "*" && (c[f] = 0), p[f] == c[d]) {
            if (n && l[h].links && l[h].links !== null) continue;
            return a ? l[h] : h;
          }
    }
    if (n && !o)
      for (let h = 0, u = l.length; h < u; ++h) {
        let p = (s + "").toLowerCase().split(","), c = l[h].type == "0" || l[h].type == "*" ? "0" : l[h].type;
        c = (c + "").toLowerCase().split(",");
        for (let f = 0; f < p.length; f++)
          for (let d = 0; d < c.length; d++)
            if (p[f] == "*" && (p[f] = 0), c[f] == "*" && (c[f] = 0), p[f] == c[d])
              return a ? l[h] : h;
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
  connectByType(t, s, a = "*", n = {}) {
    var u, p, c, f, d;
    var o = {
      createEventInCase: !0,
      firstFreeIfOutputGeneralInCase: !0,
      generalTypeInCase: !0
    }, l = Object.assign(o, n);
    s && s.constructor === Number && (s = this.graph.getNodeById(s));
    var h = s.findInputSlotByType(a, !1, !0);
    return h >= 0 && h !== null ? ((u = LiteGraph.debug) == null || u.call(LiteGraph, "CONNbyTYPE type " + a + " for " + h), this.connect(t, s, h)) : l.createEventInCase && a == LiteGraph.EVENT ? ((p = LiteGraph.debug) == null || p.call(LiteGraph, "connect WILL CREATE THE onTrigger " + a + " to " + s), this.connect(t, s, -1)) : l.generalTypeInCase && (h = s.findInputSlotByType(0, !1, !0, !0), (c = LiteGraph.debug) == null || c.call(LiteGraph, "connect TO a general type (*, 0), if not found the specific type ", a, " to ", s, "RES_SLOT:", h), h >= 0) ? this.connect(t, s, h) : l.firstFreeIfOutputGeneralInCase && (a == 0 || a == "*" || a == "") && (h = s.findInputSlotFree({ typesNotAccepted: [LiteGraph.EVENT] }), (f = LiteGraph.debug) == null || f.call(LiteGraph, "connect TO TheFirstFREE ", a, " to ", s, "RES_SLOT:", h), h >= 0) ? this.connect(t, s, h) : ((d = LiteGraph.debug) == null || d.call(LiteGraph, "no way to connect type: ", a, " to targetNODE ", s), null);
  }
  /**
   * connect this node input to the output of another node BY TYPE
   * @method connectByType
   * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
   * @param {LGraphNode} node the target node
   * @param {string} target_type the output slot type of the target node
   * @return {Object} the link_info is created, otherwise null
   */
  connectByTypeOutput(t, s, a = "*", n = {}) {
    var u, p, c;
    var o = {
      createEventInCase: !0,
      firstFreeIfInputGeneralInCase: !0,
      generalTypeInCase: !0
    }, l = Object.assign(o, n);
    s && s.constructor === Number && (s = this.graph.getNodeById(s));
    var h = s.findOutputSlotByType(a, !1, !0);
    return h >= 0 && h !== null ? ((u = LiteGraph.debug) == null || u.call(LiteGraph, "CONNbyTYPE OUT! type " + a + " for " + h), s.connect(h, this, t)) : l.generalTypeInCase && (h = s.findOutputSlotByType(0, !1, !0, !0), h >= 0) ? s.connect(h, this, t) : l.createEventInCase && a == LiteGraph.EVENT && LiteGraph.do_add_triggers_slots ? (h = s.addOnExecutedOutput(), s.connect(h, this, t)) : l.firstFreeIfInputGeneralInCase && (a == 0 || a == "*" || a == "" || a == "undefined") && (h = s.findOutputSlotFree({ typesNotAccepted: [LiteGraph.EVENT] }), h >= 0) ? s.connect(h, this, t) : ((p = LiteGraph.debug) == null || p.call(LiteGraph, "no way to connect byOUT type: ", a, " to sourceNODE ", s), (c = LiteGraph.log) == null || c.call(LiteGraph, "type OUT! " + a + " not found or not free?"), null);
  }
  /**
   * connect this node output to the input of another node
   * @method connect
   * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
   * @param {LGraphNode} node the target node
   * @param {number_or_string} target_slot the input slot of the target node (could be the number of the slot or the string with the name of the slot, or -1 to connect a trigger)
   * @return {Object} the link_info is created, otherwise null
   */
  connect(t, s, a = 0) {
    var p, c, f, d, _, g, m, G, L, T, E, S, M, R;
    if (!this.graph)
      return (p = LiteGraph.log) == null || p.call(LiteGraph, "Connect: Error, node doesn't belong to any graph. Nodes must be added first to a graph before connecting them."), null;
    if (t.constructor === String) {
      if (t = this.findOutputSlot(t), t == -1)
        return (c = LiteGraph.log) == null || c.call(LiteGraph, `Connect: Error, no slot of name ${t}`), null;
    } else if (!this.outputs || t >= this.outputs.length)
      return (f = LiteGraph.log) == null || f.call(LiteGraph, "Connect: Error, slot number not found"), null;
    if (s && s.constructor === Number && (s = this.graph.getNodeById(s)), !s)
      throw new Error("target node is null");
    if (s == this)
      return null;
    if (a.constructor === String) {
      if (a = s.findInputSlot(a), a == -1)
        return (d = LiteGraph.log) == null || d.call(LiteGraph, `Connect: Error, no slot of name ${a}`), null;
    } else if (a === LiteGraph.EVENT)
      if (LiteGraph.do_add_triggers_slots)
        s.changeMode(LiteGraph.ON_TRIGGER), a = s.findInputSlot("onTrigger");
      else
        return null;
    else if (!s.inputs || a >= s.inputs.length)
      return (_ = LiteGraph.log) == null || _.call(LiteGraph, "Connect: Error, slot number not found"), null;
    var n = !1, o = s.inputs[a], l = null, h = this.outputs[t];
    if (!this.outputs[t])
      return (g = LiteGraph.log) == null || g.call(LiteGraph, "Invalid slot passed: ", t, this.outputs), null;
    if (s.onBeforeConnectInput && (a = s.onBeforeConnectInput(s)), ((m = this.onConnectOutput) == null ? void 0 : m.call(this, t, o.type, o, s, a)) === !1)
      return null;
    if (a === !1 || a === null || !LiteGraph.isValidConnection(h.type, o.type))
      return this.setDirtyCanvas(!1, !0), n && this.graph.connectionChange(this, l), null;
    if ((G = LiteGraph.debug) == null || G.call(LiteGraph, "DBG targetSlot", a), ((L = s.onConnectInput) == null ? void 0 : L.call(s, a, h.type, h, this, t)) === !1 || ((T = this.onConnectOutput) == null ? void 0 : T.call(this, t, o.type, o, s, a)) === !1)
      return null;
    s.inputs[a] && s.inputs[a].link != null && (this.graph.beforeChange(), s.disconnectInput(a, { doProcessChange: !1 }), n = !0), (E = h.links) != null && E.length && h.type === LiteGraph.EVENT && (LiteGraph.allow_multi_output_for_events || (this.graph.beforeChange(), this.disconnectOutput(t, !1, { doProcessChange: !1 }), n = !0));
    var u;
    return LiteGraph.use_uuids ? u = LiteGraph.uuidv4() : u = ++this.graph.last_link_id, l = new LiteGraph.LLink(
      u,
      o.type || h.type,
      this.id,
      t,
      s.id,
      a
    ), this.graph.links[l.id] = l, h.links == null && (h.links = []), h.links.push(l.id), typeof s.inputs[a] == "undefined" && ((S = LiteGraph.warn) == null || S.call(LiteGraph, "FIXME error, target_slot does not exists on target_node", s, a)), s.inputs[a].link = l.id, (M = this.onConnectionsChange) == null || M.call(
      this,
      LiteGraph.OUTPUT,
      t,
      !0,
      l,
      h
    ), (R = s.onConnectionsChange) == null || R.call(
      s,
      LiteGraph.INPUT,
      a,
      !0,
      l,
      o
    ), this.graph && this.graph.onNodeConnectionChange && (this.graph.onNodeConnectionChange(
      LiteGraph.INPUT,
      s,
      a,
      this,
      t
    ), this.graph.onNodeConnectionChange(
      LiteGraph.OUTPUT,
      this,
      t,
      s,
      a
    )), this.graph.onGraphChanged({ action: "connect" }), this.setDirtyCanvas(!1, !0), this.graph.afterChange(), this.graph.connectionChange(this, l), l;
  }
  /**
   * disconnect one output to an specific node
   * @method disconnectOutput
   * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
   * @param {LGraphNode} target_node the target node to which this slot is connected [Optional, if not target_node is specified all nodes will be disconnected]
   * @return {boolean} if it was disconnected successfully
   */
  disconnectOutput(t, s, a = {}) {
    var u, p, c, f, d, _;
    var n = { doProcessChange: !0 }, o = Object.assign(n, a);
    if (t.constructor === String) {
      if (t = this.findOutputSlot(t), t == -1)
        return (u = LiteGraph.log) == null || u.call(LiteGraph, `Connect: Error, no slot of name ${t}`), !1;
    } else if (!this.outputs || t >= this.outputs.length)
      return (p = LiteGraph.log) == null || p.call(LiteGraph, "Connect: Error, slot number not found"), !1;
    var l = this.outputs[t];
    if (!l || !l.links || l.links.length == 0)
      return !1;
    if (s) {
      if (s.constructor === Number && (s = this.graph.getNodeById(s)), !s)
        throw new Error("Target Node not found");
      for (let g = 0, m = l.links.length; g < m; g++) {
        let G = l.links[g], L = this.graph.links[G];
        if (L.target_id == s.id) {
          l.links.splice(g, 1);
          var h = s.inputs[L.target_slot];
          h.link = null, delete this.graph.links[G], (c = this.graph) == null || c.onGraphChanged({ action: "disconnectOutput", doSave: o.doProcessChange }), (f = s.onConnectionsChange) == null || f.call(
            s,
            LiteGraph.INPUT,
            L.target_slot,
            !1,
            L,
            h
          ), (d = this.onConnectionsChange) == null || d.call(
            this,
            LiteGraph.OUTPUT,
            t,
            !1,
            L,
            l
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
            s,
            L.target_slot
          ));
          break;
        }
      }
    } else {
      for (let g = 0, m = l.links.length; g < m; g++) {
        let G = l.links[g], L = this.graph.links[G];
        L && (s = this.graph.getNodeById(L.target_id), h = null, (_ = this.graph) == null || _.onGraphChanged({ action: "disconnectOutput", doSave: o.doProcessChange }), s && (h = s.inputs[L.target_slot], h.link = null, s.onConnectionsChange && s.onConnectionsChange(
          LiteGraph.INPUT,
          L.target_slot,
          !1,
          L,
          h
        ), this.graph && this.graph.onNodeConnectionChange && this.graph.onNodeConnectionChange(
          LiteGraph.INPUT,
          s,
          L.target_slot
        )), delete this.graph.links[G], this.onConnectionsChange && this.onConnectionsChange(
          LiteGraph.OUTPUT,
          t,
          !1,
          L,
          l
        ), this.graph && this.graph.onNodeConnectionChange && (this.graph.onNodeConnectionChange(
          LiteGraph.OUTPUT,
          this,
          t
        ), this.graph.onNodeConnectionChange(
          LiteGraph.INPUT,
          s,
          L.target_slot
        )));
      }
      l.links = null;
    }
    return this.setDirtyCanvas(!1, !0), this.graph.connectionChange(this), !0;
  }
  /**
   * disconnect one input
   * @method disconnectInput
   * @param {number_or_string} slot (could be the number of the slot or the string with the name of the slot)
   * @return {boolean} if it was disconnected successfully
   */
  disconnectInput(t, s = {}) {
    var d, _, g;
    var a = { doProcessChange: !0 }, n = Object.assign(a, s);
    if (t.constructor === String) {
      if (t = this.findInputSlot(t), t == -1)
        return (d = LiteGraph.log) == null || d.call(LiteGraph, `Connect: Error, no slot of name ${t}`), !1;
    } else if (!this.inputs || t >= this.inputs.length)
      return (_ = LiteGraph.log) == null || _.call(LiteGraph, "Connect: Error, slot number not found"), !1;
    var o = this.inputs[t];
    if (!o)
      return !1;
    var l = this.inputs[t].link;
    if (l != null) {
      this.inputs[t].link = null;
      var h = this.graph.links[l];
      if (h) {
        var u = this.graph.getNodeById(h.origin_id);
        if (!u)
          return !1;
        var p = u.outputs[h.origin_slot];
        if (!p || !p.links || p.links.length == 0)
          return !1;
        for (var c = 0, f = p.links.length; c < f; c++)
          if (p.links[c] == l) {
            p.links.splice(c, 1);
            break;
          }
        delete this.graph.links[l], (g = this.graph) == null || g.onGraphChanged({ action: "disconnectInput", doSave: n.doProcessChange }), this.onConnectionsChange && this.onConnectionsChange(
          LiteGraph.INPUT,
          t,
          !1,
          h,
          o
        ), u.onConnectionsChange && u.onConnectionsChange(
          LiteGraph.OUTPUT,
          c,
          !1,
          h,
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
  getConnectionPos(t, s, a = new Float32Array(2)) {
    var n = 0;
    t && this.inputs && (n = this.inputs.length), !t && this.outputs && (n = this.outputs.length);
    var o = LiteGraph.NODE_SLOT_HEIGHT * 0.5;
    if (this.flags.collapsed) {
      var l = this._collapsed_width || LiteGraph.NODE_COLLAPSED_WIDTH;
      return this.horizontal ? (a[0] = this.pos[0] + l * 0.5, t ? a[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT : a[1] = this.pos[1]) : (t ? a[0] = this.pos[0] : a[0] = this.pos[0] + l, a[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT * 0.5), a;
    }
    return t && s == -1 ? (a[0] = this.pos[0] + LiteGraph.NODE_TITLE_HEIGHT * 0.5, a[1] = this.pos[1] + LiteGraph.NODE_TITLE_HEIGHT * 0.5, a) : t && n > s && this.inputs[s].pos ? (a[0] = this.pos[0] + this.inputs[s].pos[0], a[1] = this.pos[1] + this.inputs[s].pos[1], a) : !t && n > s && this.outputs[s].pos ? (a[0] = this.pos[0] + this.outputs[s].pos[0], a[1] = this.pos[1] + this.outputs[s].pos[1], a) : this.horizontal ? (a[0] = this.pos[0] + (s + 0.5) * (this.size[0] / n), t ? a[1] = this.pos[1] - LiteGraph.NODE_TITLE_HEIGHT : a[1] = this.pos[1] + this.size[1], a) : (t ? a[0] = this.pos[0] + o : a[0] = this.pos[0] + this.size[0] + 1 - o, a[1] = this.pos[1] + (s + 0.7) * LiteGraph.NODE_SLOT_HEIGHT + (this.constructor.slot_start_y || 0), a);
  }
  /* Force align to grid */
  alignToGrid() {
    this.pos[0] = LiteGraph.CANVAS_GRID_SIZE * Math.round(this.pos[0] / LiteGraph.CANVAS_GRID_SIZE), this.pos[1] = LiteGraph.CANVAS_GRID_SIZE * Math.round(this.pos[1] / LiteGraph.CANVAS_GRID_SIZE);
  }
  /* Console output */
  trace(t) {
    var s, a, n, o;
    this.console || (this.console = []), (a = (s = this.console).push) == null || a.call(s, t), this.console.length > LGraphNode.MAX_CONSOLE && ((o = (n = this.console).shift) == null || o.call(n)), this.graph.onNodeTrace && this.graph.onNodeTrace(this, t);
  }
  /* Forces to redraw or the main canvas (LGraphNode) or the bg canvas (links) */
  setDirtyCanvas(t, s) {
    this.graph && this.graph.sendActionToCanvas("setDirty", [
      t,
      s
    ]);
  }
  loadImage(t) {
    var s = new Image();
    s.src = LiteGraph.node_images_path + t, s.ready = !1;
    var a = this;
    return s.onload = function() {
      this.ready = !0, a.setDirtyCanvas(!0);
    }, s;
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
      for (var s = this.graph.list_of_graphcanvas, a = 0; a < s.length; ++a) {
        var n = s[a];
        !t && n.node_capturing_input != this || (n.node_capturing_input = t ? this : null);
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
  localToScreen(t, s, a) {
    return [
      (t + this.pos[0]) * a.scale + a.offset[0],
      (s + this.pos[1]) * a.scale + a.offset[1]
    ];
  }
  refreshAncestors(t = {}) {
    var s = {
      action: "",
      param: null,
      options: null,
      passParam: !0
    }, a = Object.assign(s, t);
    if (this.inputs && !(LiteGraph.preventAncestorRecalculation && this.graph.node_ancestorsCalculated && this.graph.node_ancestorsCalculated[this.id])) {
      (!a.action || a.action == "") && (a.action = this.id + "_ancestors"), (!a.param || a.param == "") && (a.param = this.id + "_ancestors"), a.options || (a.options = {}), a.options = Object.assign({ action_call: a.action }, a.options), this.graph.ancestorsCall = !0;
      var n = {
        modesSkip: [LiteGraph.NEVER, LiteGraph.ON_EVENT, LiteGraph.ON_TRIGGER],
        modesOnly: [LiteGraph.ALWAYS, LiteGraph.ON_REQUEST],
        typesSkip: [LiteGraph.ACTION],
        typesOnly: []
      }, o = this.graph.getAncestors(this, n);
      for (iN in o)
        o[iN].doExecute(a.param, a.options), this.graph.node_ancestorsCalculated[o[iN].id] = !0;
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
    b(this, "isPointInside", LiteGraph.LGraphNode.prototype.isPointInside);
    b(this, "setDirtyCanvas", LiteGraph.LGraphNode.prototype.setDirtyCanvas);
    var s, a;
    this.title = t, this.font_size = 24, this.color = (a = (s = LiteGraph.LGraphCanvas.node_colors.pale_blue) == null ? void 0 : s.groupcolor) != null ? a : "#AAA", this._bounding = new Float32Array([10, 10, 140, 80]), this._pos = this._bounding.subarray(0, 2), this._size = this._bounding.subarray(2, 4), this._nodes = [], this.graph = null;
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
      bounding: t.map((s) => Math.round(s)),
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
  move(t, s, a) {
    var n, o;
    isNaN(t) && ((n = console.error) == null || n.call(console, "LGraphGroup.move() deltax NaN")), isNaN(s) && ((o = console.error) == null || o.call(console, "LGraphGroup.move() deltay NaN")), this._pos[0] += t, this._pos[1] += s, !a && this._nodes.forEach((l) => {
      l.pos[0] += t, l.pos[1] += s;
    });
  }
  /**
   * Recomputes and updates the list of nodes inside the LGraphGroup based on their bounding boxes.
   * This method checks for nodes that overlap with the group's bounding box and updates the internal nodes list accordingly.
   */
  recomputeInsideNodes() {
    this._nodes.length = 0;
    var t = this.graph._nodes, s = new Float32Array(4);
    this._nodes = t.filter((a) => (a.getBounding(s), LiteGraph.overlapBounding(this._bounding, s)));
  }
}
const _LGraphCanvas = class _LGraphCanvas {
  constructor(r, t, s) {
    /**
     * Called when a mouse wheel event has to be processed
     * @method processMouseWheel
     **/
    b(this, "processMouseWheel", (r) => {
      if (!(!this.graph || !this.allow_dragcanvas)) {
        var t = r.wheelDeltaY != null ? r.wheelDeltaY : r.detail * -60;
        this.adjustMouseEvent(r);
        var s = r.clientX, a = r.clientY, n = !this.viewport || this.viewport && s >= this.viewport[0] && s < this.viewport[0] + this.viewport[2] && a >= this.viewport[1] && a < this.viewport[1] + this.viewport[3];
        if (n) {
          var o = this.ds.scale;
          return o *= Math.pow(1.1, t * 0.01), this.ds.changeScale(o, [r.clientX, r.clientY]), this.graph.change(), r.preventDefault(), !1;
        }
      }
    });
    /**
     * process a key event
     * @method processKey
     **/
    b(this, "processKey", (r) => {
      var s, a, n, o, l;
      if (this.graph) {
        var t = !1;
        if (r.target.localName != "input") {
          if (r.type == "keydown") {
            if (r.keyCode == 32 && (this.dragging_canvas = !0, t = !0), r.keyCode == 27 && (this.node_panel && this.node_panel.close(), this.options_panel && this.options_panel.close(), t = !0), r.keyCode == 65 && r.ctrlKey && (this.selectNodes(), t = !0), r.keyCode === 67 && (r.metaKey || r.ctrlKey) && !r.shiftKey && this.selected_nodes && (this.copyToClipboard(), t = !0), r.keyCode === 86 && (r.metaKey || r.ctrlKey) && this.pasteFromClipboard(r.shiftKey), (r.keyCode == 46 || LiteGraph.backspace_delete && r.keyCode == 8) && r.target.localName != "input" && r.target.localName != "textarea" && (this.deleteSelectedNodes(), t = !0), LiteGraph.actionHistory_enabled && (r.keyCode == 89 && r.ctrlKey || r.keyCode == 90 && r.ctrlKey && r.shiftKey ? this.graph.actionHistoryForward() : r.keyCode == 90 && r.ctrlKey && this.graph.actionHistoryBack()), (s = LiteGraph.debug) == null || s.call(LiteGraph, "Canvas keydown " + r.keyCode), this.selected_nodes)
              for (let h in this.selected_nodes)
                (n = (a = this.selected_nodes[h]).onKeyDown) == null || n.call(a, r);
          } else if (r.type == "keyup" && (r.keyCode == 32 && (this.dragging_canvas = !1), this.selected_nodes))
            for (let h in this.selected_nodes)
              (l = (o = this.selected_nodes[h]).onKeyUp) == null || l.call(o, r);
          if (this.graph.change(), t)
            return r.preventDefault(), r.stopImmediatePropagation(), !1;
        }
      }
    });
    /**
     * process a item drop event on top the canvas
     * @method processDrop
     **/
    b(this, "processDrop", (r) => {
      r.preventDefault(), this.adjustMouseEvent(r);
      var t = r.clientX, s = r.clientY, a = !this.viewport || this.viewport && t >= this.viewport[0] && t < this.viewport[0] + this.viewport[2] && s >= this.viewport[1] && s < this.viewport[1] + this.viewport[3];
      if (a) {
        t = r.localX, s = r.localY;
        var a = !this.viewport || this.viewport && t >= this.viewport[0] && t < this.viewport[0] + this.viewport[2] && s >= this.viewport[1] && s < this.viewport[1] + this.viewport[3];
        if (a) {
          var n = [r.canvasX, r.canvasY], o = this.graph ? this.graph.getNodeOnPos(n[0], n[1]) : null;
          if (!o) {
            var l = null;
            this.onDropItem && (l = this.onDropItem(event)), l || this.checkDropItem(r);
            return;
          }
          if (o.onDropFile || o.onDropData) {
            var h = r.dataTransfer.files;
            if (h && h.length)
              for (let d = 0; d < h.length; d++) {
                var u = r.dataTransfer.files[0], p = u.name;
                if (o.onDropFile && o.onDropFile(u), o.onDropData) {
                  var c = new FileReader();
                  c.onload = function(_) {
                    var g = _.target.result;
                    o.onDropData(g, p, u);
                  };
                  var f = u.type.split("/")[0];
                  f == "text" || f == "" ? c.readAsText(u) : f == "image" ? c.readAsDataURL(u) : c.readAsArrayBuffer(u);
                }
              }
          }
          return o.onDropItem && o.onDropItem(event) ? !0 : this.onDropItem ? this.onDropItem(event) : !1;
        }
      }
    });
    s != null || (s = {
      skip_render: !1,
      autoresize: !1,
      clip_all_nodes: !1
    }), this.options = s, this.background_image = _LGraphCanvas.DEFAULT_BACKGROUND_IMAGE, r && r.constructor === String && (r = document.querySelector(r)), this.ds = new LiteGraph.DragAndScale(), this.zoom_modify_alpha = !0, this.title_text_font = `${LiteGraph.NODE_TEXT_SIZE}px Arial`, this.inner_text_font = `normal ${LiteGraph.NODE_SUBTEXT_SIZE}px Arial`, this.node_title_color = LiteGraph.NODE_TITLE_COLOR, this.default_link_color = LiteGraph.LINK_COLOR, this.default_connection_color = {
      input_off: "#778",
      input_on: "#7F7",
      // "#BBD"
      output_off: "#778",
      output_on: "#7F7"
      // "#BBD"
    }, this.default_connection_color_byType = {}, this.default_connection_color_byTypeOff = {}, this.drag_mode = !1, this.dragging_rectangle = null, this.filter = null, this.highquality_render = !0, this.use_gradients = !1, this.editor_alpha = 1, this.pause_rendering = !1, this.clear_background = !0, this.clear_background_color = "#222", this.read_only = !1, this.live_mode = !1, this.show_info = !0, this.allow_dragcanvas = !0, this.allow_dragnodes = !0, this.allow_interaction = !0, this.multi_select = !1, this.allow_searchbox = !0, this.move_destination_link_without_shift = !1, this.align_to_grid = !1, this.drag_mode = !1, this.dragging_rectangle = null, this.filter = null, this.set_canvas_dirty_on_mouse_event = !0, this.always_render_background = !1, this.render_shadows = !0, this.render_canvas_border = !0, this.render_connections_shadows = !1, this.render_connections_border = !0, this.render_curved_connections = !0, this.render_connection_arrows = !1, this.render_collapsed_slots = !0, this.render_execution_order = !1, this.render_title_colored = !0, this.render_link_tooltip = !0, this.free_resize = !0, this.links_render_mode = LiteGraph.SPLINE_LINK, this.autoresize = s.autoresize, this.skip_render = s.skip_render, this.clip_all_nodes = s.clip_all_nodes, this.free_resize = s.free_resize, this.mouse = [0, 0], this.graph_mouse = [0, 0], this.canvas_mouse = this.graph_mouse, this.onSearchBox = null, this.onSearchBoxSelection = null, this.onMouse = null, this.onDrawBackground = null, this.onDrawForeground = null, this.onDrawOverlay = null, this.onDrawLinkTooltip = null, this.onNodeMoved = null, this.onSelectionChange = null, this.onConnectingChange = null, this.onBeforeChange = null, this.onAfterChange = null, this.connections_width = 3, this.round_radius = 8, this.current_node = null, this.node_widget = null, this.over_link_center = null, this.last_mouse_position = [0, 0], this.visible_area = this.ds.visible_area, this.visible_links = [], this.viewport = s.viewport || null, this.low_quality_rendering_threshold = 5, t == null || t.attachCanvas(this), this.setCanvas(r, s.skip_events), this.clear(), !this.skip_render && !s.skip_render && this.startRendering();
  }
  /**
   * clears all the data inside
   *
   * @method clear
   */
  clear() {
    var r;
    this.frame = 0, this.last_draw_time = 0, this.render_time = 0, this.fps = 0, this.low_quality_rendering_counter = 0, this.dragging_rectangle = null, this.selected_nodes = {}, this.selected_group = null, this.visible_nodes = [], this.node_dragged = null, this.node_over = null, this.node_capturing_input = null, this.connecting_node = null, this.highlighted_links = {}, this.dragging_canvas = !1, this.dirty_canvas = !0, this.dirty_bgcanvas = !0, this.dirty_area = null, this.node_in_panel = null, this.node_widget = null, this.last_mouse = [0, 0], this.last_mouseclick = 0, this.pointer_is_down = !1, this.pointer_is_double = !1, this.visible_area.set([0, 0, 0, 0]), (r = this.onClear) == null || r.call(this);
  }
  /**
   * assigns a graph, you can reassign graphs to the same canvas
   *
   * @method setGraph
   * @param {LGraph} graph
   */
  setGraph(r, t) {
    var s;
    if (this.graph != r) {
      if (t || this.clear(), !r) {
        (s = this.graph) == null || s.detachCanvas(this);
        return;
      }
      r.attachCanvas(this), this._graph_stack && (this._graph_stack = null), this.setDirty(!0, !0);
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
  openSubgraph(r) {
    if (!r)
      throw new Error("graph cannot be null");
    if (this.graph == r)
      throw new Error("graph cannot be the same");
    this.clear(), this.graph && (this._graph_stack || (this._graph_stack = []), this._graph_stack.push(this.graph)), r.attachCanvas(this), this.checkPanels(), this.setDirty(!0, !0);
  }
  /**
   * closes a subgraph contained inside a node
   *
   * @method closeSubgraph
   * @param {LGraph} assigns a graph
   */
  closeSubgraph() {
    if (!(!this._graph_stack || this._graph_stack.length == 0)) {
      var r = this.graph._subgraph_node, t = this._graph_stack.pop();
      this.selected_nodes = {}, this.highlighted_links = {}, t.attachCanvas(this), this.setDirty(!0, !0), r && (this.centerOnNode(r), this.selectNodes([r])), this.ds.offset = [0, 0], this.ds.scale = 1;
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
  setCanvas(r, t) {
    var a;
    if (r && r.constructor === String && (r = document.getElementById(r), !r))
      throw new Error("Error creating LiteGraph canvas: Canvas not found");
    if (r !== this.canvas && (!r && this.canvas && (t || this.unbindEvents()), this.canvas = r, this.ds.element = r, !!r)) {
      if (r.className += " lgraphcanvas", r.data = this, r.tabindex = "1", this.bgcanvas = document.createElement("canvas"), this.bgcanvas.width = this.canvas.width, this.bgcanvas.height = this.canvas.height, r.getContext == null)
        throw r.localName != "canvas" ? new Error("Element supplied for LGraphCanvas must be a <canvas> element, you passed a " + r.localName) : new Error("This browser doesn't support Canvas");
      var s = this.ctx = r.getContext("2d");
      s == null && (r.webgl_enabled || (a = LiteGraph.info) == null || a.call(LiteGraph, "This canvas seems to be WebGL, enabling WebGL renderer"), this.enableWebGL()), t || this.bindEvents();
    }
  }
  // used in some events to capture them
  _doNothing(r) {
    return r.preventDefault(), !1;
  }
  _doReturnTrue(r) {
    return r.preventDefault(), !0;
  }
  /**
   * binds mouse, keyboard, touch and drag events to the canvas
   * @method bindEvents
   **/
  bindEvents() {
    var a;
    if (this._events_binded) {
      (a = LiteGraph.warn) == null || a.call(LiteGraph, "LGraphCanvas: events already binded");
      return;
    }
    this._events_binded = !0;
    var r = this.canvas, t = this.getCanvasWindow(), s = t.document;
    this._mousedown_callback = this.processMouseDown.bind(this), this._mousemove_callback = this.processMouseMove.bind(this), this._mouseup_callback = this.processMouseUp.bind(this), r.addEventListener("pointerdown", this._mousedown_callback, !0), r.addEventListener("pointermove", this._mousemove_callback), r.addEventListener("pointerup", this._mouseup_callback, !0), r.addEventListener("contextmenu", this._doNothing), r.addEventListener("wheel", this.processMouseWheel), r.addEventListener("keydown", this.processKey), s.addEventListener("keyup", this.processKey), r.addEventListener("dragover", this._doNothing, !1), r.addEventListener("dragend", this._doNothing, !1), r.addEventListener("drop", this.processDrop), r.addEventListener("dragenter", this._doReturnTrue, !1);
  }
  /**
   * unbinds mouse events from the canvas
   * @method unbindEvents
   **/
  unbindEvents() {
    var a;
    if (!this._events_binded) {
      (a = LiteGraph.warn) == null || a.call(LiteGraph, "LGraphCanvas: no events binded");
      return;
    }
    this._events_binded = !1;
    var r = this.canvas, t = this.getCanvasWindow(), s = t.document;
    r.removeEventListener("pointerdown", this._mousedown_callback), r.removeEventListener("pointermove", this._mousemove_callback), r.removeEventListener("pointerup", this._mouseup_callback), r.removeEventListener("contextmenu", this._doNothing), r.removeEventListener("wheel", this.processMouseWheel), r.removeEventListener("keydown", this.processKey), s.removeEventListener("keyup", this.processKey), r.removeEventListener("dragover", this._doNothing, !1), r.removeEventListener("dragend", this._doNothing, !1), r.removeEventListener("drop", this.processDrop), r.removeEventListener("dragenter", this._doReturnTrue), this._mousedown_callback = null;
  }
  static getFileExtension(r) {
    const s = new URL(r).pathname, a = s.lastIndexOf(".");
    return a === -1 ? "" : s.slice(a + 1).toLowerCase();
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
  setDirty(r, t) {
    r && (this.dirty_canvas = !0), t && (this.dirty_bgcanvas = !0);
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
    var r = this.canvas.ownerDocument;
    return (t = r.defaultView) != null ? t : r.parentWindow;
  }
  /**
   * starts rendering the content of the canvas when needed
   *
   * @method startRendering
   */
  startRendering() {
    if (this.is_rendering)
      return;
    this.is_rendering = !0, r.call(this);
    function r() {
      this.pause_rendering || this.draw();
      var t = this.getCanvasWindow();
      this.is_rendering && t.requestAnimationFrame(r.bind(this));
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
  processUserInputDown(r) {
    var t, s;
    if (this.pointer_is_down && r.isPrimary !== void 0 && !r.isPrimary ? this.userInput_isNotPrimary = !0 : this.userInput_isNotPrimary = !1, this.userInput_type = r.pointerType ? r.pointerType : !1, this.userInput_id = r.pointerId ? r.pointerId : !1, r.pointerType)
      switch (r.pointerType) {
        case "mouse":
          break;
        case "pen":
          break;
        case "touch":
          break;
        default:
          (t = LiteGraph.log) == null || t.call(LiteGraph, "pointerType unknown " + ev.pointerType);
      }
    return r.button !== void 0 && (this.userInput_button = r.button, r.button), r.buttons !== void 0 && (this.userInput_button_s = r.buttons), this.userInput_touches = r.changedTouches !== void 0 && r.changedTouches.length !== void 0 ? r.changedTouches : !1, this.userInput_touches && this.userInput_touches.length && ((s = LiteGraph.debug) == null || s.call(LiteGraph, "check multiTouches", r.changedTouches)), this.processMouseDown(r);
  }
  processMouseDown(r) {
    var et, Z, it, z, U, V, B, K, lt;
    if (this.set_canvas_dirty_on_mouse_event && (this.dirty_canvas = !0), !!this.graph) {
      this.adjustMouseEvent(r);
      var t = this.getCanvasWindow();
      _LGraphCanvas.active_canvas = this;
      var s = r.clientX, a = r.clientY;
      (et = LiteGraph.log) == null || et.call(LiteGraph, "pointerevents: processMouseDown pointerId:" + r.pointerId + " which:" + r.which + " isPrimary:" + r.isPrimary + " :: x y " + s + " " + a, "previousClick", this.last_mouseclick, "diffTimeClick", this.last_mouseclick ? LiteGraph.getTime() - this.last_mouseclick : "notlast"), this.ds.viewport = this.viewport;
      var n = !this.viewport || this.viewport && s >= this.viewport[0] && s < this.viewport[0] + this.viewport[2] && a >= this.viewport[1] && a < this.viewport[1] + this.viewport[3];
      if (this.options.skip_events || (this.canvas.removeEventListener("pointermove", this._mousemove_callback), t.document.addEventListener("pointermove", this._mousemove_callback, !0), t.document.addEventListener("pointerup", this._mouseup_callback, !0)), !!n) {
        var o = this.graph.getNodeOnPos(r.canvasX, r.canvasY, this.visible_nodes, 5), l = !1, h = LiteGraph.getTime(), u = r.isPrimary === void 0 || r.isPrimary, p = h - this.last_mouseclick < 300 && u;
        if (this.mouse[0] = r.clientX, this.mouse[1] = r.clientY, this.graph_mouse[0] = r.canvasX, this.graph_mouse[1] = r.canvasY, this.last_click_position = [this.mouse[0], this.mouse[1]], this.pointer_is_down && u ? this.pointer_is_double = !0 : this.pointer_is_double = !1, this.pointer_is_down = !0, this.canvas.focus(), LiteGraph.ContextMenu.closeAll(t), !((Z = this.onMouse) != null && Z.call(this, r))) {
          if (r.which == 1 && !this.userInput_isNotPrimary) {
            if (r.ctrlKey && (this.dragging_rectangle = new Float32Array(4), this.dragging_rectangle[0] = r.canvasX, this.dragging_rectangle[1] = r.canvasY, this.dragging_rectangle[2] = 1, this.dragging_rectangle[3] = 1, l = !0), LiteGraph.alt_drag_do_clone_nodes && r.altKey && o && this.allow_interaction && !l && !this.read_only) {
              let P = o, W = o.clone();
              if (W) {
                if (W.pos[0] += 5, W.pos[1] += 5, this.graph.add(W, !1, { doCalcSize: !1 }), o = W, LiteGraph.alt_shift_drag_connect_clone_with_input && r.shiftKey && P.inputs && P.inputs.length)
                  for (var c = 0; c < P.inputs.length; ++c) {
                    var f = P.inputs[c];
                    if (!(!f || f.link == null)) {
                      var d = this.graph.links[f.link];
                      if (d && d.type !== LiteGraph.EVENT) {
                        var _;
                        d.origin_id && (_ = this.graph.getNodeById(d.origin_id));
                        var g = o;
                        _ && g && _.connect(d.origin_slot, g, d.target_slot);
                      }
                    }
                  }
                l = !0, L || (this.allow_dragnodes && (this.graph.beforeChange(), this.node_dragged = o), this.selected_nodes[o.id] || this.processNodeSelected(o, r));
              }
            }
            var m = !1;
            if (o && (this.allow_interaction || o.flags.allow_interaction) && !l && !this.read_only) {
              if (!this.live_mode && !o.flags.pinned && this.bringToFront(o), this.allow_interaction && !this.connecting_node && !o.flags.collapsed && !this.live_mode)
                if (!l && o.resizable !== !1 && LiteGraph.isInsideRectangle(
                  r.canvasX,
                  r.canvasY,
                  o.pos[0] + o.size[0] - 5,
                  o.pos[1] + o.size[1] - 5,
                  10,
                  10
                ))
                  this.graph.beforeChange(), this.resizing_node = o, this.canvas.style.cursor = "se-resize", l = !0;
                else {
                  if (o.outputs)
                    for (let P = 0, W = o.outputs.length; P < W; ++P) {
                      let $ = o.outputs[P], F = o.getConnectionPos(!1, P);
                      if (LiteGraph.isInsideRectangle(
                        r.canvasX,
                        r.canvasY,
                        F[0] - 15,
                        F[1] - 10,
                        30,
                        20
                      )) {
                        this.connecting_node = o, this.connecting_output = $, this.connecting_output.slot_index = P, this.connecting_pos = o.getConnectionPos(!1, P), this.connecting_slot = P, LiteGraph.shift_click_do_break_link_from && r.shiftKey && o.disconnectOutput(P), p ? (it = o.onOutputDblClick) == null || it.call(o, P, r) : (z = o.onOutputClick) == null || z.call(o, P, r), l = !0;
                        break;
                      }
                    }
                  if (o.inputs)
                    for (let P = 0, W = o.inputs.length; P < W; ++P) {
                      let $ = o.inputs[P], F = o.getConnectionPos(!0, P);
                      if (LiteGraph.isInsideRectangle(
                        r.canvasX,
                        r.canvasY,
                        F[0] - 15,
                        F[1] - 10,
                        30,
                        20
                      )) {
                        if (p ? (U = o.onInputDblClick) == null || U.call(o, P, r) : (V = o.onInputClick) == null || V.call(o, P, r), $.link !== null) {
                          var G = this.graph.links[$.link];
                          LiteGraph.click_do_break_link_to && (o.disconnectInput(P), this.dirty_bgcanvas = !0, l = !0), // this.allow_reconnect_links ||
                          // this.move_destination_link_without_shift ||
                          r.shiftKey && (LiteGraph.click_do_break_link_to || o.disconnectInput(P), this.connecting_node = this.graph._nodes_by_id[G.origin_id], this.connecting_slot = G.origin_slot, this.connecting_output = this.connecting_node.outputs[this.connecting_slot], this.connecting_pos = this.connecting_node.getConnectionPos(!1, this.connecting_slot), this.dirty_bgcanvas = !0, l = !0);
                        }
                        l || (this.connecting_node = o, this.connecting_input = $, this.connecting_input.slot_index = P, this.connecting_pos = o.getConnectionPos(!0, P), this.connecting_slot = P, this.dirty_bgcanvas = !0, l = !0);
                      }
                    }
                }
              if (!l) {
                var L = !1, T = [r.canvasX - o.pos[0], r.canvasY - o.pos[1]], E = this.processNodeWidgets(o, this.graph_mouse, r);
                E && (L = !0, this.node_widget = [o, E]), this.allow_interaction && p && this.selected_nodes[o.id] && ((B = o.onDblClick) == null || B.call(o, r, T, this), this.processNodeDblClicked(o), L = !0), o.onMouseDown && o.onMouseDown(r, T, this) ? L = !0 : (o.subgraph && !o.skip_subgraph_button && !o.flags.collapsed && T[0] > o.size[0] - LiteGraph.NODE_TITLE_HEIGHT && T[1] < 0 && setTimeout(() => {
                  this.openSubgraph(o.subgraph);
                }, 10), this.live_mode && (m = !0, L = !0)), L ? o.is_selected || this.processNodeSelected(o, r) : (this.allow_dragnodes && (this.graph.beforeChange(), this.node_dragged = o), this.processNodeSelected(o, r)), this.dirty_canvas = !0;
              }
            } else if (!l) {
              if (!this.read_only)
                for (let P = 0; P < this.visible_links.length; ++P) {
                  var S = this.visible_links[P], M = S._pos;
                  if (!(!M || r.canvasX < M[0] - 4 || r.canvasX > M[0] + 4 || r.canvasY < M[1] - 4 || r.canvasY > M[1] + 4)) {
                    this.showLinkMenu(S, r), this.over_link_center = null;
                    break;
                  }
                }
              if (this.selected_group = this.graph.getGroupOnPos(r.canvasX, r.canvasY), this.selected_group_resizing = !1, this.selected_group && !this.read_only) {
                r.ctrlKey && (this.dragging_rectangle = null);
                var R = LiteGraph.distance([r.canvasX, r.canvasY], [this.selected_group.pos[0] + this.selected_group.size[0], this.selected_group.pos[1] + this.selected_group.size[1]]);
                R * this.ds.scale < 10 ? this.selected_group_resizing = !0 : this.selected_group.recomputeInsideNodes();
              }
              p && !this.read_only && this.allow_searchbox && (this.showSearchBox(r), r.preventDefault(), r.stopPropagation()), (K = LiteGraph.debug) == null || K.call(LiteGraph, "DEBUG canvas click is_double_click,this.allow_searchbox", p, this.allow_searchbox), m = !0;
            }
            !l && m && this.allow_dragcanvas && (this.dragging_canvas = !0);
          } else if (r.which == 2)
            if (LiteGraph.middle_click_slot_add_default_node) {
              if (o && this.allow_interaction && !l && !this.read_only && !this.connecting_node && !o.flags.collapsed && !this.live_mode) {
                var D = !1, C = !1, N = !1;
                if (o.outputs)
                  for (let P = 0, W = o.outputs.length; P < W; ++P) {
                    var A = o.outputs[P];
                    let $ = o.getConnectionPos(!1, P);
                    if (LiteGraph.isInsideRectangle(r.canvasX, r.canvasY, $[0] - 15, $[1] - 10, 30, 20)) {
                      D = A, C = P, N = !0;
                      break;
                    }
                  }
                if (o.inputs)
                  for (let P = 0, W = o.inputs.length; P < W; ++P) {
                    var f = o.inputs[P];
                    let F = o.getConnectionPos(!0, P);
                    if (LiteGraph.isInsideRectangle(r.canvasX, r.canvasY, F[0] - 15, F[1] - 10, 30, 20)) {
                      D = f, C = P, N = !1;
                      break;
                    }
                  }
                if (D && C !== !1) {
                  var O = 0.5 - (C + 1) / (N ? o.outputs.length : o.inputs.length), I = o.getBounding(), q = [
                    N ? I[0] + I[2] : I[0],
                    // + node_bounding[0]/this.canvas.width*150
                    r.canvasY - 80
                    // + node_bounding[0]/this.canvas.width*66 // vertical "derive"
                  ];
                  this.createDefaultNodeForSlot({
                    nodeFrom: N ? o : null,
                    slotFrom: N ? C : null,
                    nodeTo: N ? null : o,
                    slotTo: N ? null : C,
                    position: q,
                    // ,e: e
                    nodeType: "AUTO",
                    // nodeNewType
                    posAdd: [N ? 30 : -30, -O * 130],
                    // -alphaPosY*30]
                    posSizeFix: [N ? 0 : -1, 0]
                    // -alphaPosY*2*/
                  });
                }
              }
            } else !l && this.allow_dragcanvas && (this.dragging_canvas = !0);
          else (r.which == 3 || LiteGraph.two_fingers_opens_menu && this.userInput_isNotPrimary) && this.allow_interaction && !l && !this.read_only && (o && (Object.keys(this.selected_nodes).length && (this.selected_nodes[o.id] || r.shiftKey || r.ctrlKey || r.metaKey) ? this.selected_nodes[o.id] || this.selectNodes([o], !0) : this.selectNodes([o])), this.processContextMenu(o, r));
          return this.last_mouse[0] = r.clientX, this.last_mouse[1] = r.clientY, this.last_mouseclick = LiteGraph.getTime(), this.last_mouse_dragging = !0, this.graph.change(), (!t.document.activeElement || t.document.activeElement.nodeName.toLowerCase() != "input" && t.document.activeElement.nodeName.toLowerCase() != "textarea") && r.preventDefault(), r.stopPropagation(), (lt = this.onMouseDown) == null || lt.call(this, r), !1;
        }
      }
    }
  }
  /**
   * Called when a mouse move event has to be processed
   * @method processMouseMove
   **/
  processMouseMove(r) {
    var f, d;
    if (this.autoresize && this.resize(), this.set_canvas_dirty_on_mouse_event && (this.dirty_canvas = !0), !!this.graph) {
      _LGraphCanvas.active_canvas = this, this.adjustMouseEvent(r);
      var t = [r.clientX, r.clientY];
      this.mouse[0] = t[0], this.mouse[1] = t[1];
      var s = [
        t[0] - this.last_mouse[0],
        t[1] - this.last_mouse[1]
      ];
      if (this.last_mouse = t, this.graph_mouse[0] = r.canvasX, this.graph_mouse[1] = r.canvasY, this.block_click)
        return r.preventDefault(), !1;
      r.dragging = this.last_mouse_dragging, this.node_widget && (this.processNodeWidgets(
        this.node_widget[0],
        this.graph_mouse,
        r,
        this.node_widget[1]
      ), this.dirty_canvas = !0);
      var a = this.graph.getNodeOnPos(r.canvasX, r.canvasY, this.visible_nodes);
      if (this.dragging_rectangle)
        this.dragging_rectangle[2] = r.canvasX - this.dragging_rectangle[0], this.dragging_rectangle[3] = r.canvasY - this.dragging_rectangle[1], this.dirty_canvas = !0;
      else if (this.selected_group && !this.read_only) {
        if (this.selected_group_resizing)
          this.selected_group.size = [
            r.canvasX - this.selected_group.pos[0],
            r.canvasY - this.selected_group.pos[1]
          ];
        else {
          var n = s[0] / this.ds.scale, o = s[1] / this.ds.scale;
          this.selected_group.move(n, o, r.ctrlKey), this.selected_group._nodes.length && (this.dirty_canvas = !0);
        }
        this.dirty_bgcanvas = !0;
      } else if (this.dragging_canvas)
        this.ds.offset[0] += s[0] / this.ds.scale, this.ds.offset[1] += s[1] / this.ds.scale, this.dirty_canvas = !0, this.dirty_bgcanvas = !0;
      else if ((this.allow_interaction || a && a.flags.allow_interaction) && !this.read_only) {
        this.connecting_node && (this.dirty_canvas = !0);
        for (let _ = 0, g = this.graph._nodes.length; _ < g; ++_)
          this.graph._nodes[_].mouseOver && a != this.graph._nodes[_] && (this.graph._nodes[_].mouseOver = !1, this.node_over && this.node_over.onMouseLeave && this.node_over.onMouseLeave(r), this.node_over = null, this.dirty_canvas = !0);
        if (a) {
          if (a.redraw_on_mouse && (this.dirty_canvas = !0), a.mouseOver || (a.mouseOver = !0, this.node_over = a, this.dirty_canvas = !0, (f = a.onMouseEnter) == null || f.call(a, r)), (d = a.onMouseMove) == null || d.call(a, r, [r.canvasX - a.pos[0], r.canvasY - a.pos[1]], this), this.connecting_node) {
            let _;
            if (this.connecting_output) {
              if (_ = this._highlight_input || [0, 0], !this.isOverNodeBox(a, r.canvasX, r.canvasY)) {
                let g = this.isOverNodeInput(a, r.canvasX, r.canvasY, _);
                if (g != -1 && a.inputs[g]) {
                  let m = a.inputs[g].type;
                  LiteGraph.isValidConnection(this.connecting_output.type, m) && (this._highlight_input = _, this._highlight_input_slot = a.inputs[g]);
                } else
                  this._highlight_input = null, this._highlight_input_slot = null;
              }
            } else if (this.connecting_input && (_ = this._highlight_output || [0, 0], this.isOverNodeBox(a, r.canvasX, r.canvasY))) {
              let g = this.isOverNodeOutput(a, r.canvasX, r.canvasY, _);
              if (g != -1 && a.outputs[g]) {
                let m = a.outputs[g].type;
                LiteGraph.isValidConnection(this.connecting_input.type, m) && (this._highlight_output = _);
              } else
                this._highlight_output = null;
            }
          }
          this.canvas && (LiteGraph.isInsideRectangle(
            r.canvasX,
            r.canvasY,
            a.pos[0] + a.size[0] - 5,
            a.pos[1] + a.size[1] - 5,
            5,
            5
          ) ? this.canvas.style.cursor = "se-resize" : this.canvas.style.cursor = "crosshair");
        } else {
          var l = null;
          for (let _ = 0; _ < this.visible_links.length; ++_) {
            var h = this.visible_links[_], u = h._pos;
            if (!(!u || r.canvasX < u[0] - 4 || r.canvasX > u[0] + 4 || r.canvasY < u[1] - 4 || r.canvasY > u[1] + 4)) {
              l = h;
              break;
            }
          }
          l != this.over_link_center && (this.over_link_center = l, this.dirty_canvas = !0), this.canvas && (this.canvas.style.cursor = "");
        }
        if (this.node_capturing_input && this.node_capturing_input != a && this.node_capturing_input.onMouseMove && this.node_capturing_input.onMouseMove(r, [r.canvasX - this.node_capturing_input.pos[0], r.canvasY - this.node_capturing_input.pos[1]], this), this.node_dragged && !this.live_mode) {
          for (let _ in this.selected_nodes) {
            let g = this.selected_nodes[_];
            g.pos[0] += s[0] / this.ds.scale, g.pos[1] += s[1] / this.ds.scale, g.is_selected || this.processNodeSelected(g, r);
          }
          this.dirty_canvas = !0, this.dirty_bgcanvas = !0;
        }
        if (this.resizing_node && !this.live_mode) {
          var p = [r.canvasX - this.resizing_node.pos[0], r.canvasY - this.resizing_node.pos[1]], c = this.resizing_node.computeSize();
          p[0] = Math.max(c[0], p[0]), p[1] = Math.max(c[1], p[1]), this.resizing_node.setSize(p), this.canvas.style.cursor = "se-resize", this.dirty_canvas = !0, this.dirty_bgcanvas = !0;
        }
      }
      return r.preventDefault(), !1;
    }
  }
  /**
   * Called when a mouse up event has to be processed
   * @method processMouseUp
   **/
  processMouseUp(r) {
    var T;
    var t = r.isPrimary === void 0 || r.isPrimary;
    if (!t)
      return !1;
    if (this.set_canvas_dirty_on_mouse_event && (this.dirty_canvas = !0), !!this.graph) {
      var s = this.getCanvasWindow(), a = s.document;
      _LGraphCanvas.active_canvas = this, this.options.skip_events || (a.removeEventListener("pointermove", this._mousemove_callback, !0), this.canvas.addEventListener("pointermove", this._mousemove_callback, !0), a.removeEventListener("pointerup", this._mouseup_callback, !0)), this.adjustMouseEvent(r);
      var n = LiteGraph.getTime();
      if (r.click_time = n - this.last_mouseclick, this.last_mouse_dragging = !1, this.last_click_position = null, this.block_click && (this.block_click = !1), r.which == 1) {
        if (this.node_widget && this.processNodeWidgets(this.node_widget[0], this.graph_mouse, r), this.node_widget = null, this.selected_group) {
          var o = this.selected_group.pos[0] - Math.round(this.selected_group.pos[0]), l = this.selected_group.pos[1] - Math.round(this.selected_group.pos[1]);
          this.selected_group.move(o, l, r.ctrlKey), this.selected_group.pos[0] = Math.round(this.selected_group.pos[0]), this.selected_group.pos[1] = Math.round(this.selected_group.pos[1]), this.selected_group._nodes.length && (this.dirty_canvas = !0), this.selected_group = null;
        }
        this.selected_group_resizing = !1;
        var h = this.graph.getNodeOnPos(
          r.canvasX,
          r.canvasY,
          this.visible_nodes
        );
        if (this.dragging_rectangle) {
          if (this.graph) {
            var u = this.graph._nodes, p = new Float32Array(4), c = Math.abs(this.dragging_rectangle[2]), f = Math.abs(this.dragging_rectangle[3]), d = this.dragging_rectangle[2] < 0 ? this.dragging_rectangle[0] - c : this.dragging_rectangle[0], _ = this.dragging_rectangle[3] < 0 ? this.dragging_rectangle[1] - f : this.dragging_rectangle[1];
            if (this.dragging_rectangle[0] = d, this.dragging_rectangle[1] = _, this.dragging_rectangle[2] = c, this.dragging_rectangle[3] = f, !h || c > 10 && f > 10) {
              var g = [];
              for (let E = 0; E < u.length; ++E) {
                var m = u[E];
                m.getBounding(p), LiteGraph.overlapBounding(
                  this.dragging_rectangle,
                  p
                ) && g.push(m);
              }
              g.length && this.selectNodes(g, r.shiftKey);
            } else
              this.selectNodes([h], r.shiftKey || r.ctrlKey);
          }
          this.dragging_rectangle = null;
        } else if (this.connecting_node) {
          this.dirty_canvas = !0, this.dirty_bgcanvas = !0;
          var G = this.connecting_output || this.connecting_input, L = G.type;
          if (h = this.graph.getNodeOnPos(
            r.canvasX,
            r.canvasY,
            this.visible_nodes
          ), h) {
            let E;
            this.connecting_output ? (E = this.isOverNodeInput(
              h,
              r.canvasX,
              r.canvasY
            ), E != -1 ? this.connecting_node.connect(this.connecting_slot, h, E) : this.connecting_node.connectByType(this.connecting_slot, h, L)) : this.connecting_input && (E = this.isOverNodeOutput(
              h,
              r.canvasX,
              r.canvasY
            ), E != -1 ? h.connect(E, this.connecting_node, this.connecting_slot) : this.connecting_node.connectByTypeOutput(this.connecting_slot, h, L));
          } else
            LiteGraph.release_link_on_empty_shows_menu && (r.shiftKey && this.allow_searchbox ? this.connecting_output ? this.showSearchBox(r, { node_from: this.connecting_node, slot_from: this.connecting_output, type_filter_in: this.connecting_output.type }) : this.connecting_input && this.showSearchBox(r, { node_to: this.connecting_node, slot_from: this.connecting_input, type_filter_out: this.connecting_input.type }) : this.connecting_output ? this.showConnectionMenu({ nodeFrom: this.connecting_node, slotFrom: this.connecting_output, e: r }) : this.connecting_input && this.showConnectionMenu({ nodeTo: this.connecting_node, slotTo: this.connecting_input, e: r }));
          this.connecting_output = null, this.connecting_input = null, this.connecting_pos = null, this.connecting_node = null, this.connecting_slot = -1;
        } else this.resizing_node ? (this.dirty_canvas = !0, this.dirty_bgcanvas = !0, this.graph.afterChange(this.resizing_node), this.resizing_node = null) : this.node_dragged ? (h = this.node_dragged, h && r.click_time < 300 && LiteGraph.isInsideRectangle(r.canvasX, r.canvasY, h.pos[0], h.pos[1] - LiteGraph.NODE_TITLE_HEIGHT, LiteGraph.NODE_TITLE_HEIGHT, LiteGraph.NODE_TITLE_HEIGHT) && h.collapse(), this.dirty_canvas = !0, this.dirty_bgcanvas = !0, this.node_dragged.pos[0] = Math.round(this.node_dragged.pos[0]), this.node_dragged.pos[1] = Math.round(this.node_dragged.pos[1]), (this.graph.config.align_to_grid || this.align_to_grid) && this.node_dragged.alignToGrid(), (T = this.onNodeMoved) == null || T.call(this, this.node_dragged), this.graph.onGraphChanged({ action: "nodeDrag", doSave: !0 }), this.graph.afterChange(this.node_dragged), this.node_dragged = null) : (h = this.graph.getNodeOnPos(
          r.canvasX,
          r.canvasY,
          this.visible_nodes
        ), !h && r.click_time < 300 && this.deselectAllNodes(), this.dirty_canvas = !0, this.dragging_canvas = !1, this.node_over && this.node_over.onMouseUp && this.node_over.onMouseUp(r, [r.canvasX - this.node_over.pos[0], r.canvasY - this.node_over.pos[1]], this), this.node_capturing_input && this.node_capturing_input.onMouseUp && this.node_capturing_input.onMouseUp(r, [
          r.canvasX - this.node_capturing_input.pos[0],
          r.canvasY - this.node_capturing_input.pos[1]
        ]));
      } else r.which == 2 ? (this.dirty_canvas = !0, this.dragging_canvas = !1) : r.which == 3 && (this.dirty_canvas = !0, this.dragging_canvas = !1);
      return t && (this.pointer_is_down = !1, this.pointer_is_double = !1), this.graph.change(), r.stopPropagation(), r.preventDefault(), !1;
    }
  }
  /**
   * returns true if a position (in graph space) is on top of a node little corner box
   * @method isOverNodeBox
   **/
  isOverNodeBox(r, t, s) {
    var a = LiteGraph.NODE_TITLE_HEIGHT;
    return !!LiteGraph.isInsideRectangle(
      t,
      s,
      r.pos[0] + 2,
      r.pos[1] + 2 - a,
      a - 4,
      a - 4
    );
  }
  /**
   * returns the INDEX if a position (in graph space) is on top of a node input slot
   * @method isOverNodeInput
   **/
  isOverNodeInput(r, t, s, a) {
    if (r.inputs)
      for (let l = 0, h = r.inputs.length; l < h; ++l) {
        var n = r.getConnectionPos(!0, l), o = !1;
        if (r.horizontal ? o = LiteGraph.isInsideRectangle(
          t,
          s,
          n[0] - 5,
          n[1] - 10,
          10,
          20
        ) : o = LiteGraph.isInsideRectangle(
          t,
          s,
          n[0] - 10,
          n[1] - 5,
          40,
          10
        ), o)
          return a && (a[0] = n[0], a[1] = n[1]), l;
      }
    return -1;
  }
  /**
   * returns the INDEX if a position (in graph space) is on top of a node output slot
   * @method isOverNodeOuput
   **/
  isOverNodeOutput(r, t, s, a) {
    if (r.outputs)
      for (let l = 0, h = r.outputs.length; l < h; ++l) {
        var n = r.getConnectionPos(!1, l), o = !1;
        if (r.horizontal ? o = LiteGraph.isInsideRectangle(
          t,
          s,
          n[0] - 5,
          n[1] - 10,
          10,
          20
        ) : o = LiteGraph.isInsideRectangle(
          t,
          s,
          n[0] - 10,
          n[1] - 5,
          40,
          10
        ), o)
          return a && (a[0] = n[0], a[1] = n[1]), l;
      }
    return -1;
  }
  copyToClipboard() {
    var u;
    var r = {
      nodes: [],
      links: []
    }, t = 0, s = [];
    for (let p in this.selected_nodes) {
      let c = this.selected_nodes[p];
      c.clonable !== !1 && (c._relative_id = t, s.push(c), t += 1);
    }
    for (let p = 0; p < s.length; ++p) {
      let c = s[p];
      if (c.clonable !== !1) {
        var a = c.clone();
        if (!a) {
          (u = LiteGraph.warn) == null || u.call(LiteGraph, "node type not found: " + c.type);
          continue;
        }
        if (r.nodes.push(a.serialize()), c.inputs && c.inputs.length)
          for (var n = 0; n < c.inputs.length; ++n) {
            var o = c.inputs[n];
            if (!(!o || o.link == null)) {
              var l = this.graph.links[o.link];
              if (l) {
                var h = this.graph.getNodeById(l.origin_id);
                h && r.links.push([
                  h._relative_id,
                  l.origin_slot,
                  // j,
                  c._relative_id,
                  l.target_slot,
                  h.id
                ]);
              }
            }
          }
      }
    }
    localStorage.setItem(
      "litegrapheditor_clipboard",
      JSON.stringify(r)
    );
  }
  pasteFromClipboard(r = !1) {
    var _;
    if (!(!LiteGraph.ctrl_shift_v_paste_connect_unselected_outputs && r)) {
      var t = localStorage.getItem("litegrapheditor_clipboard");
      if (t) {
        this.graph.beforeChange();
        var s = JSON.parse(t), a = !1, n = !1;
        for (let g = 0; g < s.nodes.length; ++g)
          a ? (a[0] > s.nodes[g].pos[0] && (a[0] = s.nodes[g].pos[0], n[0] = g), a[1] > s.nodes[g].pos[1] && (a[1] = s.nodes[g].pos[1], n[1] = g)) : (a = [s.nodes[g].pos[0], s.nodes[g].pos[1]], n = [g, g]);
        var o = [];
        for (let g = 0; g < s.nodes.length; ++g) {
          var l = s.nodes[g], h = LiteGraph.createNode(l.type);
          h && (h.configure(l), h.pos[0] += this.graph_mouse[0] - a[0], h.pos[1] += this.graph_mouse[1] - a[1], this.graph.add(h, { doProcessChange: !1 }), o.push(h));
        }
        for (let g = 0; g < s.links.length; ++g) {
          var u = s.links[g], p = void 0, c = u[0];
          if (c != null)
            p = o[c];
          else if (LiteGraph.ctrl_shift_v_paste_connect_unselected_outputs && r) {
            var f = u[4];
            f && (p = this.graph.getNodeById(f));
          }
          var d = o[u[2]];
          p && d ? p.connect(u[1], d, u[3]) : (_ = LiteGraph.warn) == null || _.call(LiteGraph, "Warning, nodes missing on pasting");
        }
        this.selectNodes(o), this.graph.onGraphChanged({ action: "paste", doSave: !0 }), this.graph.afterChange();
      }
    }
  }
  // called if the graph doesn't have a default drop item behaviour
  checkDropItem(r) {
    var o;
    if (r.dataTransfer.files.length) {
      var t = r.dataTransfer.files[0], s = _LGraphCanvas.getFileExtension(t.name).toLowerCase(), a = LiteGraph.node_types_by_file_extension[s];
      if (a) {
        this.graph.beforeChange();
        var n = LiteGraph.createNode(a.type);
        n.pos = [r.canvasX, r.canvasY], this.graph.add(n, !1, { doProcessChange: !1 }), (o = n.onDropFile) == null || o.call(n, t), this.graph.onGraphChanged({ action: "fileDrop", doSave: !0 }), this.graph.afterChange();
      }
    }
  }
  processNodeDblClicked(r) {
    var t;
    this.onShowNodePanel ? this.onShowNodePanel(r) : this.showShowNodePanel(r), (t = this.onNodeDblClicked) == null || t.call(this, r), this.setDirty(!0);
  }
  processNodeSelected(r, t) {
    var s;
    this.selectNode(r, t && (t.shiftKey || t.ctrlKey || this.multi_select)), (s = this.onNodeSelected) == null || s.call(this, r);
  }
  /**
   * selects a given node (or adds it to the current selection)
   * @method selectNode
   **/
  selectNode(r, t) {
    r == null ? this.deselectAllNodes() : this.selectNodes([r], t);
  }
  /**
   * selects several nodes (or adds them to the current selection)
   * @method selectNodes
   **/
  selectNodes(r, t) {
    var s;
    t || this.deselectAllNodes(), r = r || this.graph._nodes, typeof r == "string" && (r = [r]), Object.values(r).forEach((a) => {
      var n, o, l;
      if (a.is_selected) {
        this.deselectNode(a);
        return;
      }
      a.is_selected = !0, this.selected_nodes[a.id] = a, (n = a.onSelected) == null || n.call(a), (o = a.inputs) == null || o.forEach((h) => {
        this.highlighted_links[h.link] = !0;
      }), (l = a.outputs) == null || l.forEach((h) => {
        var u;
        (u = h.links) == null || u.forEach((p) => {
          this.highlighted_links[p] = !0;
        });
      });
    }), (s = this.onSelectionChange) == null || s.call(this, this.selected_nodes), this.setDirty(!0);
  }
  /**
   * removes a node from the current selection
   * @method deselectNode
   **/
  deselectNode(r) {
    var t, s, a, n;
    r.is_selected && ((t = r.onDeselected) == null || t.call(r), r.is_selected = !1, (s = this.onNodeDeselected) == null || s.call(this, r), (a = r.inputs) == null || a.forEach((o) => {
      var l;
      (l = this.highlighted_links) == null || delete l[o.link];
    }), (n = r.outputs) == null || n.forEach((o) => {
      var l;
      (l = o.links) == null || l.forEach((h) => {
        var u;
        return (u = this.highlighted_links) == null ? !0 : delete u[h];
      });
    }));
  }
  /**
   * removes all nodes from the current selection
   * @method deselectAllNodes
   **/
  deselectAllNodes() {
    var r, t;
    this.graph && ((r = this.graph._nodes) == null || r.forEach((s) => {
      var a, n;
      s.is_selected && ((a = s.onDeselected) == null || a.call(s), s.is_selected = !1, (n = this.onNodeDeselected) == null || n.call(this, s));
    }), this.selected_nodes = {}, this.current_node = null, this.highlighted_links = {}, (t = this.onSelectionChange) == null || t.call(this, this.selected_nodes), this.setDirty(!0));
  }
  /**
   * deletes all nodes in the current selection from the graph
   * @method deleteSelectedNodes
   **/
  deleteSelectedNodes() {
    this.graph.beforeChange();
    for (let o in this.selected_nodes) {
      var r = this.selected_nodes[o];
      if (!r.block_delete) {
        if (r.inputs && r.inputs.length && r.outputs && r.outputs.length && LiteGraph.isValidConnection(r.inputs[0].type, r.outputs[0].type) && r.inputs[0].link && r.outputs[0].links && r.outputs[0].links.length) {
          var t = r.graph.links[r.inputs[0].link], s = r.graph.links[r.outputs[0].links[0]], a = r.getInputNode(0), n = r.getOutputNodes(0)[0];
          a && n && a.connect(t.origin_slot, n, s.target_slot);
        }
        this.graph.remove(r), this.onNodeDeselected && this.onNodeDeselected(r);
      }
    }
    this.selected_nodes = {}, this.current_node = null, this.highlighted_links = {}, this.setDirty(!0), this.graph.afterChange();
  }
  /**
   * centers the camera on a given node
   * @method centerOnNode
   **/
  centerOnNode(r) {
    this.ds.offset[0] = -r.pos[0] - r.size[0] * 0.5 + this.canvas.width * 0.5 / this.ds.scale, this.ds.offset[1] = -r.pos[1] - r.size[1] * 0.5 + this.canvas.height * 0.5 / this.ds.scale, this.setDirty(!0, !0);
  }
  /**
   * adds some useful properties to a mouse event, like the position in graph coordinates
   * @method adjustMouseEvent
   **/
  adjustMouseEvent(r) {
    var t = 0, s = 0;
    if (this.canvas) {
      var a = this.canvas.getBoundingClientRect();
      t = r.clientX - a.left, s = r.clientY - a.top;
    } else
      t = r.clientX, s = r.clientY;
    this.last_mouse_position[0] = t, this.last_mouse_position[1] = s, r.canvasX = t / this.ds.scale - this.ds.offset[0], r.canvasY = s / this.ds.scale - this.ds.offset[1];
  }
  /**
   * changes the zoom level of the graph (default is 1), you can pass also a place used to pivot the zoom
   * @method setZoom
   **/
  setZoom(r, t) {
    this.ds.changeScale(r, t), this.dirty_canvas = !0, this.dirty_bgcanvas = !0;
  }
  /**
   * converts a coordinate from graph coordinates to canvas2D coordinates
   * @method convertOffsetToCanvas
   **/
  convertOffsetToCanvas(r, t) {
    return this.ds.convertOffsetToCanvas(r, t);
  }
  /**
   * converts a coordinate from Canvas2D coordinates to graph space
   * @method convertCanvasToOffset
   **/
  convertCanvasToOffset(r, t) {
    return this.ds.convertCanvasToOffset(r, t);
  }
  // converts event coordinates from canvas2D to graph coordinates
  convertEventToCanvasOffset(r) {
    var t = this.canvas.getBoundingClientRect();
    return this.convertCanvasToOffset([
      r.clientX - t.left,
      r.clientY - t.top
    ]);
  }
  /**
   * brings a node to front (above all other nodes)
   * @method bringToFront
   **/
  bringToFront(r) {
    var t = this.graph._nodes.indexOf(r);
    t != -1 && (this.graph._nodes.splice(t, 1), this.graph._nodes.push(r));
  }
  /**
   * sends a node to the back (below all other nodes)
   * @method sendToBack
   **/
  sendToBack(r) {
    var t = this.graph._nodes.indexOf(r);
    t != -1 && (this.graph._nodes.splice(t, 1), this.graph._nodes.unshift(r));
  }
  /**
   * checks which nodes are visible (inside the camera area)
   * @method computeVisibleNodes
   **/
  computeVisibleNodes(r, t) {
    var s = t || [];
    s.length = 0, r = r || this.graph._nodes;
    for (var a = 0, n = r.length; a < n; ++a) {
      var o = r[a];
      this.live_mode && !o.onDrawBackground && !o.onDrawForeground || LiteGraph.overlapBounding(this.visible_area, o.getBounding(temp, !0)) && s.push(o);
    }
    return s;
  }
  /**
   * renders the whole canvas content, by rendering in two separated canvas, one containing the background grid and the connections, and one containing the nodes)
   * @method draw
   **/
  draw(r, t) {
    if (!(!this.canvas || this.canvas.width == 0 || this.canvas.height == 0)) {
      var s = LiteGraph.getTime();
      this.render_time = (s - this.last_draw_time) * 1e-3, this.last_draw_time = s, this.graph && this.ds.computeVisibleArea(this.viewport), (this.dirty_bgcanvas || t || this.always_render_background || this.graph && this.graph._last_trigger_time && s - this.graph._last_trigger_time < 1e3) && this.drawBackCanvas();
      var a = this.dirty_canvas || r;
      if (a && this.drawFrontCanvas(), this.fps = this.render_time ? 1 / this.render_time : 0, this.frame += 1, this.ds.scale < 0.7) {
        if (a) {
          var n = this.low_quality_rendering_threshold;
          const o = 45;
          this.fps < o ? (this.low_quality_rendering_counter += o / this.fps, this.low_quality_rendering_counter = Math.min(this.low_quality_rendering_counter, 2 * n)) : (this.low_quality_rendering_counter -= this.fps / o * 0.01, this.low_quality_rendering_counter = Math.max(this.low_quality_rendering_counter, 0));
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
    var c, f, d, _, g;
    this.dirty_canvas = !1, this.ctx || (this.ctx = this.bgcanvas.getContext("2d"));
    var r = this.ctx;
    if (r) {
      var t = this.canvas;
      r.start2D && !this.viewport && (r.start2D(), r.restore(), r.setTransform(1, 0, 0, 1, 0, 0));
      var s = this.viewport || this.dirty_area;
      if (s && (r.save(), r.beginPath(), r.rect(s[0], s[1], s[2], s[3]), r.clip()), this.clear_background && (s ? r.clearRect(s[0], s[1], s[2], s[3]) : r.clearRect(0, 0, t.width, t.height)), this.bgcanvas == this.canvas ? this.drawBackCanvas() : r.drawImage(this.bgcanvas, 0, 0), (c = this.onRender) == null || c.call(this, t, r), this.show_info && this.renderInfo(r, s ? s[0] : 0, s ? s[1] : 0), this.graph) {
        r.save(), this.ds.toCanvasContext(r);
        var a = this.computeVisibleNodes(
          null,
          this.visible_nodes
        );
        for (let m = 0; m < a.length; ++m) {
          let G = a[m];
          r.save(), r.translate(G.pos[0], G.pos[1]), this.drawNode(G, r), r.restore();
        }
        if (this.render_execution_order && this.drawExecutionOrder(r), this.graph.config.links_ontop && (this.live_mode || this.drawConnections(r)), this.connecting_pos != null) {
          r.lineWidth = this.connections_width;
          var n = null, o = this.connecting_output || this.connecting_input, l = o.type, h = o.dir;
          h == null && (this.connecting_output ? h = this.connecting_node.horizontal ? LiteGraph.DOWN : LiteGraph.RIGHT : h = this.connecting_node.horizontal ? LiteGraph.UP : LiteGraph.LEFT);
          var u = o.shape;
          switch (l) {
            case LiteGraph.EVENT:
            case LiteGraph.ACTION:
              n = LiteGraph.EVENT_LINK_COLOR;
              break;
            default:
              n = LiteGraph.CONNECTING_LINK_COLOR;
          }
          if (this.renderLink(
            r,
            this.connecting_pos,
            [this.graph_mouse[0], this.graph_mouse[1]],
            null,
            !1,
            null,
            n,
            h,
            LiteGraph.CENTER
          ), r.beginPath(), l === LiteGraph.EVENT || l === LiteGraph.ACTION || u === LiteGraph.BOX_SHAPE ? (r.rect(
            this.connecting_pos[0] - 6 + 0.5,
            this.connecting_pos[1] - 5 + 0.5,
            14,
            10
          ), r.fill(), r.beginPath(), r.rect(
            this.graph_mouse[0] - 6 + 0.5,
            this.graph_mouse[1] - 5 + 0.5,
            14,
            10
          )) : u === LiteGraph.ARROW_SHAPE ? (r.moveTo(this.connecting_pos[0] + 8, this.connecting_pos[1] + 0.5), r.lineTo(this.connecting_pos[0] - 4, this.connecting_pos[1] + 6 + 0.5), r.lineTo(this.connecting_pos[0] - 4, this.connecting_pos[1] - 6 + 0.5), r.closePath()) : (r.arc(
            this.connecting_pos[0],
            this.connecting_pos[1],
            4,
            0,
            Math.PI * 2
          ), r.fill(), r.beginPath(), r.arc(
            this.graph_mouse[0],
            this.graph_mouse[1],
            4,
            0,
            Math.PI * 2
          )), r.fill(), r.fillStyle = "#ffcc00", this._highlight_input) {
            r.beginPath();
            var p = this._highlight_input_slot.shape;
            p === LiteGraph.ARROW_SHAPE ? (r.moveTo(this._highlight_input[0] + 8, this._highlight_input[1] + 0.5), r.lineTo(this._highlight_input[0] - 4, this._highlight_input[1] + 6 + 0.5), r.lineTo(this._highlight_input[0] - 4, this._highlight_input[1] - 6 + 0.5), r.closePath()) : r.arc(
              this._highlight_input[0],
              this._highlight_input[1],
              6,
              0,
              Math.PI * 2
            ), r.fill();
          }
          this._highlight_output && (r.beginPath(), p === LiteGraph.ARROW_SHAPE ? (r.moveTo(this._highlight_output[0] + 8, this._highlight_output[1] + 0.5), r.lineTo(this._highlight_output[0] - 4, this._highlight_output[1] + 6 + 0.5), r.lineTo(this._highlight_output[0] - 4, this._highlight_output[1] - 6 + 0.5), r.closePath()) : r.arc(
            this._highlight_output[0],
            this._highlight_output[1],
            6,
            0,
            Math.PI * 2
          ), r.fill());
        }
        this.dragging_rectangle && (r.strokeStyle = "#FFF", r.strokeRect(
          this.dragging_rectangle[0],
          this.dragging_rectangle[1],
          this.dragging_rectangle[2],
          this.dragging_rectangle[3]
        )), this.over_link_center && this.render_link_tooltip ? this.drawLinkTooltip(r, this.over_link_center) : (f = this.onDrawLinkTooltip) == null || f.call(this, r, null), (d = this.onDrawForeground) == null || d.call(this, r, this.visible_rect), r.restore();
      }
      this._graph_stack && this._graph_stack.length && this.drawSubgraphPanel(r), (_ = this.onDrawOverlay) == null || _.call(this, r), s && r.restore(), (g = r.finish2D) == null || g.call(r);
    }
  }
  /**
   * draws the panel in the corner that shows subgraph properties
   * @method drawSubgraphPanel
   **/
  drawSubgraphPanel(r) {
    var a;
    var t = this.graph;
    if (t) {
      var s = t._subgraph_node;
      if (!s) {
        (a = LiteGraph.warn) == null || a.call(LiteGraph, "subgraph without subnode");
        return;
      }
      this.drawSubgraphPanelLeft(t, s, r), this.drawSubgraphPanelRight(t, s, r);
    }
  }
  drawSubgraphPanelLeft(r, t, s) {
    var f;
    var a = t.inputs ? t.inputs.length : 0, n = 200, o = Math.floor(LiteGraph.NODE_SLOT_HEIGHT * 1.6);
    if (s.fillStyle = "#111", s.globalAlpha = 0.8, s.beginPath(), s.roundRect(10, 10, n, (a + 1) * o + 50, [8]), s.fill(), s.globalAlpha = 1, s.fillStyle = "#888", s.font = "14px Arial", s.textAlign = "left", s.fillText("Graph Inputs", 20, 34), this.drawButton(n - 20, 20, 20, 20, "X", "#151515")) {
      this.closeSubgraph();
      return;
    }
    var l = 50;
    if (s.font = "14px Arial", t.inputs)
      for (var h = 0; h < t.inputs.length; ++h) {
        var u = t.inputs[h];
        if (!u.not_subgraph_input) {
          if (this.drawButton(20, l + 2, n - 20, o - 2)) {
            var p = t.constructor.input_node_type || "graph/input";
            this.graph.beforeChange();
            var c = LiteGraph.createNode(p);
            c ? (r.add(c, !1, { doProcessChange: !1 }), this.block_click = !1, this.last_click_position = null, this.selectNodes([c]), this.node_dragged = c, this.dragging_canvas = !1, c.setProperty("name", u.name), c.setProperty("type", u.type), this.node_dragged.pos[0] = this.graph_mouse[0] - 5, this.node_dragged.pos[1] = this.graph_mouse[1] - 5, this.graph.afterChange()) : (f = LiteGraph.error) == null || f.call(LiteGraph, "graph input node not found:", p);
          }
          s.fillStyle = "#9C9", s.beginPath(), s.arc(n - 16, l + o * 0.5, 5, 0, 2 * Math.PI), s.fill(), s.fillStyle = "#AAA", s.fillText(u.name, 30, l + o * 0.75), s.fillStyle = "#777", s.fillText(u.type, 130, l + o * 0.75), l += o;
        }
      }
    this.drawButton(20, l + 2, n - 20, o - 2, "+", "#151515", "#222") && this.showSubgraphPropertiesDialog(t);
  }
  drawSubgraphPanelRight(r, t, s) {
    var g;
    var a = t.outputs ? t.outputs.length : 0, n = this.bgcanvas.width, o = 200, l = Math.floor(LiteGraph.NODE_SLOT_HEIGHT * 1.6);
    s.fillStyle = "#111", s.globalAlpha = 0.8, s.beginPath(), s.roundRect(n - o - 10, 10, o, (a + 1) * l + 50, [8]), s.fill(), s.globalAlpha = 1, s.fillStyle = "#888", s.font = "14px Arial", s.textAlign = "left";
    const h = "Graph Outputs";
    var u = s.measureText(h).width;
    if (s.fillText(h, n - u - 20, 34), this.drawButton(n - o, 20, 20, 20, "X", "#151515")) {
      this.closeSubgraph();
      return;
    }
    var p = 50;
    if (s.font = "14px Arial", t.outputs)
      for (var c = 0; c < t.outputs.length; ++c) {
        var f = t.outputs[c];
        if (!f.not_subgraph_input) {
          if (this.drawButton(n - o, p + 2, o - 20, l - 2)) {
            var d = t.constructor.output_node_type || "graph/output";
            this.graph.beforeChange();
            var _ = LiteGraph.createNode(d);
            _ ? (r.add(_, !1, { doProcessChange: !1 }), this.block_click = !1, this.last_click_position = null, this.selectNodes([_]), this.node_dragged = _, this.dragging_canvas = !1, _.setProperty("name", f.name), _.setProperty("type", f.type), this.node_dragged.pos[0] = this.graph_mouse[0] - 5, this.node_dragged.pos[1] = this.graph_mouse[1] - 5, this.graph.afterChange()) : (g = LiteGraph.error) == null || g.call(LiteGraph, "graph input node not found:", d);
          }
          s.fillStyle = "#9C9", s.beginPath(), s.arc(n - o + 16, p + l * 0.5, 5, 0, 2 * Math.PI), s.fill(), s.fillStyle = "#AAA", s.fillText(f.name, n - o + 30, p + l * 0.75), s.fillStyle = "#777", s.fillText(f.type, n - o + 130, p + l * 0.75), p += l;
        }
      }
    this.drawButton(n - o, p + 2, o - 20, l - 2, "+", "#151515", "#222") && this.showSubgraphPropertiesDialogRight(t);
  }
  // Draws a button into the canvas overlay and computes if it was clicked using the immediate gui paradigm
  drawButton(r, t, s, a, n, o, l, h) {
    var u = this.ctx;
    o = o || LiteGraph.NODE_DEFAULT_COLOR, l = l || "#555", h = h || LiteGraph.NODE_TEXT_COLOR;
    var p = this.ds.convertOffsetToCanvas(this.graph_mouse), c = LiteGraph.isInsideRectangle(p[0], p[1], r, t, s, a);
    if (p = this.last_click_position ? [this.last_click_position[0], this.last_click_position[1]] : null, p) {
      var f = this.canvas.getBoundingClientRect();
      p[0] -= f.left, p[1] -= f.top;
    }
    var d = p && LiteGraph.isInsideRectangle(p[0], p[1], r, t, s, a);
    u.fillStyle = c ? l : o, d && (u.fillStyle = "#AAA"), u.beginPath(), u.roundRect(r, t, s, a, [4]), u.fill(), n != null && n.constructor == String && (u.fillStyle = h, u.textAlign = "center", u.font = (a * 0.65 | 0) + "px Arial", u.fillText(n, r + s * 0.5, t + a * 0.75), u.textAlign = "left");
    var _ = d && !this.block_click;
    return d && this.blockClick(), _;
  }
  isAreaClicked(r, t, s, a, n) {
    var o = this.last_click_position, l = o && LiteGraph.isInsideRectangle(o[0], o[1], r, t, s, a), h = l && !this.block_click;
    return l && n && this.blockClick(), h;
  }
  /**
   * draws some useful stats in the corner of the canvas
   * @method renderInfo
   **/
  renderInfo(r, t, s) {
    t = t || 10, s = s || this.canvas.height - 80, r.save(), r.translate(t, s), r.font = "10px Arial", r.fillStyle = "#888", r.textAlign = "left", this.graph ? (r.fillText("T: " + this.graph.globaltime.toFixed(2) + "s", 5, 13), r.fillText("I: " + this.graph.iteration, 5, 26), r.fillText("N: " + this.graph._nodes.length + " [" + this.visible_nodes.length + "]", 5, 39), r.fillText("V: " + this.graph._version, 5, 52), r.fillText("FPS:" + this.fps.toFixed(2), 5, 65)) : r.fillText("No graph selected", 5, 13), r.restore();
  }
  /**
   * draws the back canvas (the one containing the background and the connections)
   * @method drawBackCanvas
   **/
  drawBackCanvas() {
    var h, u, p;
    var r = this.bgcanvas;
    this.bgctx || (this.bgctx = this.bgcanvas.getContext("2d"));
    var t = this.bgctx;
    t.start && t.start();
    var s = this.viewport || [0, 0, t.canvas.width, t.canvas.height];
    if (this.clear_background && t.clearRect(s[0], s[1], s[2], s[3]), this._graph_stack && this._graph_stack.length) {
      t.save();
      var a = this.graph._subgraph_node;
      t.strokeStyle = a.bgcolor, t.lineWidth = 10, t.strokeRect(1, 1, r.width - 2, r.height - 2), t.lineWidth = 1, t.font = "40px Arial", t.textAlign = "center", t.fillStyle = a.bgcolor || "#AAA";
      let c = "";
      this._graph_stack.slice(1).forEach((f, d) => {
        c += `${f._subgraph_node.getTitle()} ${d < this._graph_stack.length - 2 ? ">> " : ""}`;
      }), t.fillText(
        c + a.getTitle(),
        r.width * 0.5,
        40
      ), t.restore();
    }
    var n = !1;
    if (this.onRenderBackground && (n = this.onRenderBackground(r, t)), this.viewport || (t.restore(), t.setTransform(1, 0, 0, 1, 0, 0)), this.visible_links.length = 0, this.graph) {
      if (t.save(), this.ds.toCanvasContext(t), this.ds.scale < 1.5 && !n && this.clear_background_color && (t.fillStyle = this.clear_background_color, t.fillRect(
        this.visible_area[0],
        this.visible_area[1],
        this.visible_area[2],
        this.visible_area[3]
      )), this.background_image && this.ds.scale > 0.5 && !n) {
        if (this.zoom_modify_alpha ? t.globalAlpha = (1 - 0.5 / this.ds.scale) * this.editor_alpha : t.globalAlpha = this.editor_alpha, t.imageSmoothingEnabled = t.imageSmoothingEnabled = !1, !this._bg_img || this._bg_img.name != this.background_image) {
          this._bg_img = new Image(), this._bg_img.name = this.background_image, this._bg_img.src = this.background_image;
          var o = this;
          this._bg_img.onload = function() {
            o.draw(!0, !0);
          };
        }
        var l = null;
        this._pattern == null && this._bg_img.width > 0 ? (l = t.createPattern(this._bg_img, "repeat"), this._pattern_img = this._bg_img, this._pattern = l) : l = this._pattern, l && (t.fillStyle = l, t.fillRect(
          this.visible_area[0],
          this.visible_area[1],
          this.visible_area[2],
          this.visible_area[3]
        ), t.fillStyle = "transparent"), t.globalAlpha = 1, t.imageSmoothingEnabled = t.imageSmoothingEnabled = !0;
      }
      this.graph._groups.length && !this.live_mode && this.drawGroups(r, t), (h = this.onDrawBackground) == null || h.call(this, t, this.visible_area), this.onBackgroundRender && ((u = LiteGraph.error) == null || u.call(LiteGraph, "WARNING! onBackgroundRender deprecated, now is named onDrawBackground "), this.onBackgroundRender = null), this.render_canvas_border && (t.strokeStyle = "#235", t.strokeRect(0, 0, r.width, r.height)), this.render_connections_shadows ? (t.shadowColor = "#000", t.shadowOffsetX = 0, t.shadowOffsetY = 0, t.shadowBlur = 6) : t.shadowColor = "rgba(0,0,0,0)", this.live_mode || this.drawConnections(t), t.shadowColor = "rgba(0,0,0,0)", t.restore();
    }
    (p = t.finish) == null || p.call(t), this.dirty_bgcanvas = !1, this.dirty_canvas = !0;
  }
  /**
   * draws the given node inside the canvas
   * @method drawNode
   **/
  drawNode(r, t) {
    var S, M, R;
    this.current_node = r;
    var s = r.color || r.constructor.color || LiteGraph.NODE_DEFAULT_COLOR, a = r.bgcolor || r.constructor.bgcolor || LiteGraph.NODE_DEFAULT_BGCOLOR, n = this.ds.scale < 0.6;
    if (this.live_mode) {
      r.flags.collapsed || (t.shadowColor = "transparent", (S = r.onDrawForeground) == null || S.call(r, t, this, this.canvas));
      return;
    }
    var o = this.editor_alpha;
    if (t.globalAlpha = o, this.render_shadows && !n ? (t.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR, t.shadowOffsetX = 2 * this.ds.scale, t.shadowOffsetY = 2 * this.ds.scale, t.shadowBlur = 3 * this.ds.scale) : t.shadowColor = "transparent", !(r.flags.collapsed && ((M = r.onDrawCollapsed) != null && M.call(r, t, this)))) {
      var l = r._shape || LiteGraph.BOX_SHAPE, h = temp_vec2;
      temp_vec2.set(r.size);
      var u = r.horizontal;
      if (r.flags.collapsed) {
        t.font = this.inner_text_font;
        var p = r.getTitle ? r.getTitle() : r.title;
        p != null && (r._collapsed_width = Math.min(
          r.size[0],
          t.measureText(p).width + LiteGraph.NODE_TITLE_HEIGHT * 2
        ), h[0] = r._collapsed_width, h[1] = 0);
      }
      (r.clip_area || this.clip_all_nodes) && (t.save(), t.beginPath(), l == LiteGraph.BOX_SHAPE ? t.rect(0, 0, h[0], h[1]) : l == LiteGraph.ROUND_SHAPE ? t.roundRect(0, 0, h[0], h[1], [10]) : l == LiteGraph.CIRCLE_SHAPE && t.arc(
        h[0] * 0.5,
        h[1] * 0.5,
        h[0] * 0.5,
        0,
        Math.PI * 2
      ), t.clip()), r.has_errors && (a = "red"), this.drawNodeShape(
        r,
        t,
        h,
        s,
        a,
        r.is_selected,
        r.mouseOver
      ), t.shadowColor = "transparent", (R = r.onDrawForeground) == null || R.call(r, t, this, this.canvas), LiteGraph.show_node_tooltip && r.mouseOver && r.is_selected && (!this.selected_nodes || Object.keys(this.selected_nodes).length <= 1) && this.drawNodeTooltip(t, r), t.textAlign = u ? "center" : "left", t.font = this.inner_text_font;
      var c = !this.lowQualityRenderingRequired(0.6), f = this.connecting_output, d = this.connecting_input;
      t.lineWidth = 1;
      var _ = 0, g = new Float32Array(2), m;
      if (r.flags.collapsed) {
        if (this.render_collapsed_slots) {
          var L = null, T = null;
          if (r.inputs)
            for (let D = 0; D < r.inputs.length; D++) {
              var E = r.inputs[D];
              if (E.link != null) {
                L = E;
                break;
              }
            }
          if (r.outputs)
            for (let D = 0; D < r.outputs.length; D++) {
              var E = r.outputs[D];
              !E.links || !E.links.length || (T = E);
            }
          if (L) {
            let D = 0, C = LiteGraph.NODE_TITLE_HEIGHT * -0.5;
            u && (D = r._collapsed_width * 0.5, C = -LiteGraph.NODE_TITLE_HEIGHT), t.fillStyle = "#686", t.beginPath(), E.type === LiteGraph.EVENT || E.type === LiteGraph.ACTION || E.shape === LiteGraph.BOX_SHAPE ? t.rect(D - 7 + 0.5, C - 4, 14, 8) : E.shape === LiteGraph.ARROW_SHAPE ? (t.moveTo(D + 8, C), t.lineTo(D + -4, C - 4), t.lineTo(D + -4, C + 4), t.closePath()) : t.arc(D, C, 4, 0, Math.PI * 2), t.fill();
          }
          if (T) {
            let D = r._collapsed_width, C = LiteGraph.NODE_TITLE_HEIGHT * -0.5;
            u && (D = r._collapsed_width * 0.5, C = 0), t.fillStyle = "#686", t.strokeStyle = "black", t.beginPath(), E.type === LiteGraph.EVENT || E.type === LiteGraph.ACTION || E.shape === LiteGraph.BOX_SHAPE ? t.rect(D - 7 + 0.5, C - 4, 14, 8) : E.shape === LiteGraph.ARROW_SHAPE ? (t.moveTo(D + 6, C), t.lineTo(D - 6, C - 4), t.lineTo(D - 6, C + 4), t.closePath()) : t.arc(D, C, 4, 0, Math.PI * 2), t.fill();
          }
        }
      } else {
        if (r.inputs)
          for (let D = 0; D < r.inputs.length; D++) {
            let C = r.inputs[D], N = C.type, A = C.shape;
            t.globalAlpha = o, this.connecting_output && !LiteGraph.isValidConnection(C.type, f.type) && (t.globalAlpha = 0.4 * o), t.fillStyle = C.link != null ? C.color_on || this.default_connection_color_byType[N] || this.default_connection_color.input_on : C.color_off || this.default_connection_color_byTypeOff[N] || this.default_connection_color_byType[N] || this.default_connection_color.input_off;
            let O = r.getConnectionPos(!0, D, g);
            if (O[0] -= r.pos[0], O[1] -= r.pos[1], _ < O[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5 && (_ = O[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5), t.beginPath(), N == "array" ? A = LiteGraph.GRID_SHAPE : C.name == "onTrigger" || C.name == "onExecuted" ? A = LiteGraph.ARROW_SHAPE : (N === LiteGraph.EVENT || N === LiteGraph.ACTION) && (A = LiteGraph.BOX_SHAPE), m = !0, A === LiteGraph.BOX_SHAPE ? u ? t.rect(
              O[0] - 5 + 0.5,
              O[1] - 8 + 0.5,
              10,
              14
            ) : t.rect(
              O[0] - 6 + 0.5,
              O[1] - 5 + 0.5,
              14,
              10
            ) : A === LiteGraph.ARROW_SHAPE ? (t.moveTo(O[0] + 8, O[1] + 0.5), t.lineTo(O[0] - 4, O[1] + 6 + 0.5), t.lineTo(O[0] - 4, O[1] - 6 + 0.5), t.closePath()) : A === LiteGraph.GRID_SHAPE ? (t.rect(O[0] - 4, O[1] - 4, 2, 2), t.rect(O[0] - 1, O[1] - 4, 2, 2), t.rect(O[0] + 2, O[1] - 4, 2, 2), t.rect(O[0] - 4, O[1] - 1, 2, 2), t.rect(O[0] - 1, O[1] - 1, 2, 2), t.rect(O[0] + 2, O[1] - 1, 2, 2), t.rect(O[0] - 4, O[1] + 2, 2, 2), t.rect(O[0] - 1, O[1] + 2, 2, 2), t.rect(O[0] + 2, O[1] + 2, 2, 2), m = !1) : n ? t.rect(O[0] - 4, O[1] - 4, 8, 8) : t.arc(O[0], O[1], 4, 0, Math.PI * 2), t.fill(), c && !(C.name == "onTrigger" || C.name == "onExecuted")) {
              let I = C.label != null ? C.label : C.name;
              I && (t.fillStyle = LiteGraph.NODE_TEXT_COLOR, u || C.dir == LiteGraph.UP ? t.fillText(I, O[0], O[1] - 10) : t.fillText(I, O[0] + 10, O[1] + 5));
            }
          }
        if (t.textAlign = u ? "center" : "right", t.strokeStyle = "black", r.outputs)
          for (let D = 0; D < r.outputs.length; D++) {
            let C = r.outputs[D], N = C.type, A = C.shape;
            this.connecting_input && !LiteGraph.isValidConnection(N, d.type) && (t.globalAlpha = 0.4 * o);
            let O = r.getConnectionPos(!1, D, g);
            if (O[0] -= r.pos[0], O[1] -= r.pos[1], _ < O[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5 && (_ = O[1] + LiteGraph.NODE_SLOT_HEIGHT * 0.5), t.fillStyle = C.links && C.links.length ? C.color_on || this.default_connection_color_byType[N] || this.default_connection_color.output_on : C.color_off || this.default_connection_color_byTypeOff[N] || this.default_connection_color_byType[N] || this.default_connection_color.output_off, t.beginPath(), N == "array" ? A = LiteGraph.GRID_SHAPE : C.name == "onTrigger" || C.name == "onExecuted" ? A = LiteGraph.ARROW_SHAPE : (N === LiteGraph.EVENT || N === LiteGraph.ACTION) && (A = LiteGraph.BOX_SHAPE), m = !0, A === LiteGraph.BOX_SHAPE ? u ? t.rect(
              O[0] - 5 + 0.5,
              O[1] - 8 + 0.5,
              10,
              14
            ) : t.rect(
              O[0] - 6 + 0.5,
              O[1] - 5 + 0.5,
              14,
              10
            ) : A === LiteGraph.ARROW_SHAPE ? (t.moveTo(O[0] + 8, O[1] + 0.5), t.lineTo(O[0] - 4, O[1] + 6 + 0.5), t.lineTo(O[0] - 4, O[1] - 6 + 0.5), t.closePath()) : A === LiteGraph.GRID_SHAPE ? (t.rect(O[0] - 4, O[1] - 4, 2, 2), t.rect(O[0] - 1, O[1] - 4, 2, 2), t.rect(O[0] + 2, O[1] - 4, 2, 2), t.rect(O[0] - 4, O[1] - 1, 2, 2), t.rect(O[0] - 1, O[1] - 1, 2, 2), t.rect(O[0] + 2, O[1] - 1, 2, 2), t.rect(O[0] - 4, O[1] + 2, 2, 2), t.rect(O[0] - 1, O[1] + 2, 2, 2), t.rect(O[0] + 2, O[1] + 2, 2, 2), m = !1) : n ? t.rect(O[0] - 4, O[1] - 4, 8, 8) : t.arc(O[0], O[1], 4, 0, Math.PI * 2), t.fill(), !n && m && t.stroke(), c && !(C.name == "onTrigger" || C.name == "onExecuted")) {
              let I = C.label != null ? C.label : C.name;
              I && (t.fillStyle = LiteGraph.NODE_TEXT_COLOR, u || C.dir == LiteGraph.DOWN ? t.fillText(I, O[0], O[1] - 8) : t.fillText(I, O[0] - 10, O[1] + 5));
            }
          }
        if (t.textAlign = "left", t.globalAlpha = 1, r.widgets) {
          var G = _;
          (u || r.widgets_up) && (G = 2), r.widgets_start_y != null && (G = r.widgets_start_y), this.drawNodeWidgets(
            r,
            G,
            t,
            this.node_widget && this.node_widget[0] == r ? this.node_widget[1] : null
          );
        }
      }
      (r.clip_area || this.clip_all_nodes) && t.restore(), t.globalAlpha = 1;
    }
  }
  drawNodeTooltip(r, t) {
    var u;
    if (!t || !r) {
      (u = LiteGraph.warn) == null || u.call(LiteGraph, "drawNodeTooltip: invalid node or ctx", t, r);
      return;
    }
    var s = t.properties.tooltip != null ? t.properties.tooltip : "";
    if ((!s || s == "") && LiteGraph.show_node_tooltip_use_descr_property && t.constructor.desc && (s = t.constructor.desc), s = (s + "").trim(), !(!s || s == "")) {
      var a = [0, -LiteGraph.NODE_TITLE_HEIGHT], n = t.flags.collapsed ? [LiteGraph.NODE_COLLAPSED_WIDTH, LiteGraph.NODE_TITLE_HEIGHT] : t.size;
      r.font = "14px Courier New", r.measureText(s);
      var o = Math.max(t.size[0], 160) + 20, l = t.ttip_oTMultiRet ? t.ttip_oTMultiRet.height + 15 : 21;
      r.globalAlpha = 0.7 * this.editor_alpha, r.shadowColor = t.ttip_oTMultiRet ? "black" : "transparent", r.shadowOffsetX = 2, r.shadowOffsetY = 2, r.shadowBlur = 3, r.fillStyle = t.ttip_oTMultiRet ? "#454" : "transparent", r.beginPath(), r.roundRect(a[0] - o * 0.5 + n[0] / 2, a[1] - 15 - l, o, l, [3]), r.moveTo(a[0] - 10 + n[0] / 2, a[1] - 15), r.lineTo(a[0] + 10 + n[0] / 2, a[1] - 15), r.lineTo(a[0] + n[0] / 2, a[1] - 5), r.fill(), r.shadowColor = "transparent", r.textAlign = "center", r.fillStyle = t.ttip_oTMultiRet ? "#CEC" : "transparent", r.globalAlpha = this.editor_alpha;
      var h = LiteGraph.canvasFillTextMultiline(r, s, a[0] + n[0] / 2, a[1] - l, o, 14);
      t.ttip_oTMultiRet = h, r.closePath();
    }
  }
  // used by this.over_link_center
  drawLinkTooltip(r, t) {
    var u;
    var s = t._pos;
    if (r.fillStyle = "black", r.beginPath(), r.arc(s[0], s[1], 3, 0, Math.PI * 2), r.fill(), t.data != null && !((u = this.onDrawLinkTooltip) != null && u.call(this, r, t, this))) {
      var a = t.data, n = null;
      if (a.constructor === Number ? n = a.toFixed(2) : a.constructor === String ? n = '"' + a + '"' : a.constructor === Boolean ? n = String(a) : a.toToolTip ? n = a.toToolTip() : n = "[" + a.constructor.name + "]", n != null) {
        n = n.substr(0, 30), r.font = "14px Courier New";
        var o = r.measureText(n), l = o.width + 20, h = 24;
        r.shadowColor = "black", r.shadowOffsetX = 2, r.shadowOffsetY = 2, r.shadowBlur = 3, r.fillStyle = "#454", r.beginPath(), r.roundRect(s[0] - l * 0.5, s[1] - 15 - h, l, h, [3]), r.moveTo(s[0] - 10, s[1] - 15), r.lineTo(s[0] + 10, s[1] - 15), r.lineTo(s[0], s[1] - 5), r.fill(), r.shadowColor = "transparent", r.textAlign = "center", r.fillStyle = "#CEC", r.fillText(n, s[0], s[1] - 15 - h * 0.3);
      }
    }
  }
  drawNodeShape(r, t, s, a, n, o, l) {
    var M;
    t.strokeStyle = a, t.fillStyle = n;
    var h = LiteGraph.NODE_TITLE_HEIGHT, u = this.lowQualityRenderingRequired(0.5), p = r._shape || r.constructor.shape || LiteGraph.ROUND_SHAPE, c = r.constructor.title_mode, f = !0;
    c == LiteGraph.TRANSPARENT_TITLE || c == LiteGraph.NO_TITLE ? f = !1 : c == LiteGraph.AUTOHIDE_TITLE && l && (f = !0);
    var d = tmp_area;
    d[0] = 0, d[1] = f ? -h : 0, d[2] = s[0] + 1, d[3] = f ? s[1] + h : s[1];
    var _ = t.globalAlpha;
    if (t.beginPath(), p == LiteGraph.BOX_SHAPE || u ? t.fillRect(d[0], d[1], d[2], d[3]) : p == LiteGraph.ROUND_SHAPE || p == LiteGraph.CARD_SHAPE ? t.roundRect(
      d[0],
      d[1],
      d[2],
      d[3],
      p == LiteGraph.CARD_SHAPE ? [this.round_radius, this.round_radius, 0, 0] : [this.round_radius]
    ) : p == LiteGraph.CIRCLE_SHAPE && t.arc(
      s[0] * 0.5,
      s[1] * 0.5,
      s[0] * 0.5,
      0,
      Math.PI * 2
    ), t.fill(), !r.flags.collapsed && f && (t.shadowColor = "transparent", t.fillStyle = "rgba(0,0,0,0.2)", t.fillRect(0, -1, d[2], 2)), t.shadowColor = "transparent", (M = r.onDrawBackground) == null || M.call(r, t, this, this.canvas, this.graph_mouse), f || c == LiteGraph.TRANSPARENT_TITLE) {
      if (r.onDrawTitleBar)
        r.onDrawTitleBar(t, h, s, this.ds.scale, a);
      else if (c != LiteGraph.TRANSPARENT_TITLE && (r.constructor.title_color || this.render_title_colored)) {
        var g = r.constructor.title_color || a;
        if (r.flags.collapsed && (t.shadowColor = LiteGraph.DEFAULT_SHADOW_COLOR), this.use_gradients) {
          var m = _LGraphCanvas.gradients[g];
          m || (m = _LGraphCanvas.gradients[g] = t.createLinearGradient(0, 0, 400, 0), m.addColorStop(0, g), m.addColorStop(1, "#000")), t.fillStyle = m;
        } else
          t.fillStyle = g;
        t.beginPath(), p == LiteGraph.BOX_SHAPE || u ? t.rect(0, -h, s[0] + 1, h) : (p == LiteGraph.ROUND_SHAPE || p == LiteGraph.CARD_SHAPE) && t.roundRect(
          0,
          -h,
          s[0] + 1,
          h,
          r.flags.collapsed ? [this.round_radius] : [this.round_radius, this.round_radius, 0, 0]
        ), t.fill(), t.shadowColor = "transparent";
      }
      let R = !1;
      LiteGraph.node_box_coloured_by_mode && LiteGraph.NODE_MODES_COLORS[r.mode] && (R = LiteGraph.NODE_MODES_COLORS[r.mode]), LiteGraph.node_box_coloured_when_on && (R = r.action_triggered ? "#FFF" : r.execute_triggered ? "#AAA" : R);
      var G = 10;
      if (r.onDrawTitleBox ? r.onDrawTitleBox(t, h, s, this.ds.scale) : p == LiteGraph.ROUND_SHAPE || p == LiteGraph.CIRCLE_SHAPE || p == LiteGraph.CARD_SHAPE ? (u && (t.fillStyle = "black", t.beginPath(), t.arc(
        h * 0.5,
        h * -0.5,
        G * 0.5 + 1,
        0,
        Math.PI * 2
      ), t.fill()), t.fillStyle = r.boxcolor || R || LiteGraph.NODE_DEFAULT_BOXCOLOR, u ? t.fillRect(h * 0.5 - G * 0.5, h * -0.5 - G * 0.5, G, G) : (t.beginPath(), t.arc(
        h * 0.5,
        h * -0.5,
        G * 0.5,
        0,
        Math.PI * 2
      ), t.fill())) : (u && (t.fillStyle = "black", t.fillRect(
        (h - G) * 0.5 - 1,
        (h + G) * -0.5 - 1,
        G + 2,
        G + 2
      )), t.fillStyle = r.boxcolor || R || LiteGraph.NODE_DEFAULT_BOXCOLOR, t.fillRect(
        (h - G) * 0.5,
        (h + G) * -0.5,
        G,
        G
      )), t.globalAlpha = _, r.onDrawTitleText && r.onDrawTitleText(
        t,
        h,
        s,
        this.ds.scale,
        this.title_text_font,
        o
      ), !u) {
        t.font = this.title_text_font;
        var L = String(r.getTitle());
        L && (o ? t.fillStyle = LiteGraph.NODE_SELECTED_TITLE_COLOR : t.fillStyle = r.constructor.title_text_color || this.node_title_color, r.flags.collapsed ? (t.textAlign = "left", t.fillText(
          L.substr(0, 20),
          // avoid urls too long //@TODO: Replace with substring
          h,
          // + measure.width * 0.5,
          LiteGraph.NODE_TITLE_TEXT_Y - h
        ), t.textAlign = "left") : (t.textAlign = "left", t.fillText(
          L,
          h,
          LiteGraph.NODE_TITLE_TEXT_Y - h
        )));
      }
      if (!r.flags.collapsed && r.subgraph && !r.skip_subgraph_button) {
        var T = LiteGraph.NODE_TITLE_HEIGHT, E = r.size[0] - T, S = LiteGraph.isInsideRectangle(this.graph_mouse[0] - r.pos[0], this.graph_mouse[1] - r.pos[1], E + 2, -T + 2, T - 4, T - 4);
        t.fillStyle = S ? "#888" : "#555", p == LiteGraph.BOX_SHAPE || u ? t.fillRect(E + 2, -T + 2, T - 4, T - 4) : (t.beginPath(), t.roundRect(E + 2, -T + 2, T - 4, T - 4, [4]), t.fill()), t.fillStyle = "#333", t.beginPath(), t.moveTo(E + T * 0.2, -T * 0.6), t.lineTo(E + T * 0.8, -T * 0.6), t.lineTo(E + T * 0.5, -T * 0.3), t.fill();
      }
      r.onDrawTitle && r.onDrawTitle(t);
    }
    o && (r.onBounding && r.onBounding(d), c == LiteGraph.TRANSPARENT_TITLE && (d[1] -= h, d[3] += h), t.lineWidth = 1, t.globalAlpha = 0.8, t.beginPath(), p == LiteGraph.BOX_SHAPE ? t.rect(
      -6 + d[0],
      -6 + d[1],
      12 + d[2],
      12 + d[3]
    ) : p == LiteGraph.ROUND_SHAPE || p == LiteGraph.CARD_SHAPE && r.flags.collapsed ? t.roundRect(
      -6 + d[0],
      -6 + d[1],
      12 + d[2],
      12 + d[3],
      [this.round_radius * 2]
    ) : p == LiteGraph.CARD_SHAPE ? t.roundRect(
      -6 + d[0],
      -6 + d[1],
      12 + d[2],
      12 + d[3],
      [this.round_radius * 2, 2, this.round_radius * 2, 2]
    ) : p == LiteGraph.CIRCLE_SHAPE && t.arc(
      s[0] * 0.5,
      s[1] * 0.5,
      s[0] * 0.5 + 6,
      0,
      Math.PI * 2
    ), t.strokeStyle = LiteGraph.NODE_BOX_OUTLINE_COLOR, t.stroke(), t.strokeStyle = a, t.globalAlpha = 1), r.execute_triggered > 0 && r.execute_triggered--, r.action_triggered > 0 && r.action_triggered--;
  }
  /**
   * draws every connection visible in the canvas
   * OPTIMIZE THIS: pre-catch connections position instead of recomputing them every time
   * @method drawConnections
   **/
  drawConnections(r) {
    var t = LiteGraph.getTime(), s = this.visible_area;
    margin_area[0] = s[0] - 20, margin_area[1] = s[1] - 20, margin_area[2] = s[2] + 40, margin_area[3] = s[3] + 40, r.lineWidth = this.connections_width, r.fillStyle = "#AAA", r.strokeStyle = "#AAA", r.globalAlpha = this.editor_alpha;
    for (var a = this.graph._nodes, n = 0, o = a.length; n < o; ++n) {
      var l = a[n];
      if (!(!l.inputs || !l.inputs.length))
        for (let S = 0; S < l.inputs.length; ++S) {
          var h = l.inputs[S];
          if (!(!h || h.link == null)) {
            var u = h.link, p = this.graph.links[u];
            if (p) {
              var c = this.graph.getNodeById(p.origin_id);
              if (c != null) {
                var f = p.origin_slot, d = null;
                f == -1 ? d = [
                  c.pos[0] + 10,
                  c.pos[1] + 10
                ] : d = c.getConnectionPos(
                  !1,
                  f,
                  tempA
                );
                var _ = l.getConnectionPos(!0, S, tempB);
                if (link_bounding[0] = d[0], link_bounding[1] = d[1], link_bounding[2] = _[0] - d[0], link_bounding[3] = _[1] - d[1], link_bounding[2] < 0 && (link_bounding[0] += link_bounding[2], link_bounding[2] = Math.abs(link_bounding[2])), link_bounding[3] < 0 && (link_bounding[1] += link_bounding[3], link_bounding[3] = Math.abs(link_bounding[3])), !!LiteGraph.overlapBounding(link_bounding, margin_area)) {
                  var g = c.outputs[f], m = l.inputs[S];
                  if (!(!g || !m)) {
                    var G = g.dir || (c.horizontal ? LiteGraph.DOWN : LiteGraph.RIGHT), L = m.dir || (l.horizontal ? LiteGraph.UP : LiteGraph.LEFT);
                    if (this.renderLink(
                      r,
                      d,
                      _,
                      p,
                      !1,
                      0,
                      null,
                      G,
                      L
                    ), p && p._last_time && t - p._last_time < 1e3) {
                      var T = 2 - (t - p._last_time) * 2e-3, E = r.globalAlpha;
                      r.globalAlpha = E * T, this.renderLink(
                        r,
                        d,
                        _,
                        p,
                        !0,
                        T,
                        "white",
                        G,
                        L
                      ), r.globalAlpha = E;
                    }
                  }
                }
              }
            }
          }
        }
    }
    r.globalAlpha = 1;
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
  renderLink(r, t, s, a, n, o, l, h, u, p) {
    a && this.visible_links.push(a), !l && a && (l = a.color || _LGraphCanvas.link_type_colors[a.type]), l || (l = this.default_link_color), a != null && this.highlighted_links[a.id] && (l = "#FFF"), h = h || LiteGraph.RIGHT, u = u || LiteGraph.LEFT;
    var c = LiteGraph.distance(t, s);
    this.render_connections_border && this.ds.scale > 0.6 && (r.lineWidth = this.connections_width + 4), r.lineJoin = "round", p = p || 1, p > 1 && (r.lineWidth = 0.5), r.beginPath();
    for (let N = 0; N < p; N += 1) {
      var f = (N - (p - 1) * 0.5) * 5;
      if (this.links_render_mode == LiteGraph.SPLINE_LINK) {
        r.moveTo(t[0], t[1] + f);
        let A = 0, O = 0, I = 0, q = 0;
        switch (h) {
          case LiteGraph.LEFT:
            A = c * -0.25;
            break;
          case LiteGraph.RIGHT:
            A = c * 0.25;
            break;
          case LiteGraph.UP:
            O = c * -0.25;
            break;
          case LiteGraph.DOWN:
            O = c * 0.25;
            break;
        }
        switch (u) {
          case LiteGraph.LEFT:
            I = c * -0.25;
            break;
          case LiteGraph.RIGHT:
            I = c * 0.25;
            break;
          case LiteGraph.UP:
            q = c * -0.25;
            break;
          case LiteGraph.DOWN:
            q = c * 0.25;
            break;
        }
        r.bezierCurveTo(
          t[0] + A,
          t[1] + O + f,
          s[0] + I,
          s[1] + q + f,
          s[0],
          s[1] + f
        );
      } else if (this.links_render_mode == LiteGraph.LINEAR_LINK) {
        r.moveTo(t[0], t[1] + f);
        let A = 0, O = 0, I = 0, q = 0;
        switch (h) {
          case LiteGraph.LEFT:
            A = -1;
            break;
          case LiteGraph.RIGHT:
            A = 1;
            break;
          case LiteGraph.UP:
            O = -1;
            break;
          case LiteGraph.DOWN:
            O = 1;
            break;
        }
        switch (u) {
          case LiteGraph.LEFT:
            I = -1;
            break;
          case LiteGraph.RIGHT:
            I = 1;
            break;
          case LiteGraph.UP:
            q = -1;
            break;
          case LiteGraph.DOWN:
            q = 1;
            break;
        }
        var d = 15;
        r.lineTo(
          t[0] + A * d,
          t[1] + O * d + f
        ), r.lineTo(
          s[0] + I * d,
          s[1] + q * d + f
        ), r.lineTo(s[0], s[1] + f);
      } else if (this.links_render_mode == LiteGraph.STRAIGHT_LINK) {
        r.moveTo(t[0], t[1]);
        var _ = t[0], g = t[1], m = s[0], G = s[1];
        h == LiteGraph.RIGHT ? _ += 10 : g += 10, u == LiteGraph.LEFT ? m -= 10 : G -= 10, r.lineTo(_, g), r.lineTo((_ + m) * 0.5, g), r.lineTo((_ + m) * 0.5, G), r.lineTo(m, G), r.lineTo(s[0], s[1]);
      } else
        return;
    }
    this.render_connections_border && this.ds.scale > 0.6 && !n && (r.strokeStyle = "rgba(0,0,0,0.5)", r.stroke()), r.lineWidth = this.connections_width, r.fillStyle = r.strokeStyle = l, r.stroke();
    var L = this.computeConnectionPoint(t, s, 0.5, h, u);
    if (a && a._pos && (a._pos[0] = L[0], a._pos[1] = L[1]), this.ds.scale >= 0.6 && this.highquality_render && u != LiteGraph.CENTER) {
      if (this.render_connection_arrows) {
        var T = this.computeConnectionPoint(
          t,
          s,
          0.25,
          h,
          u
        ), E = this.computeConnectionPoint(
          t,
          s,
          0.26,
          h,
          u
        ), S = this.computeConnectionPoint(
          t,
          s,
          0.75,
          h,
          u
        ), M = this.computeConnectionPoint(
          t,
          s,
          0.76,
          h,
          u
        ), R = 0, D = 0;
        this.render_curved_connections ? (R = -Math.atan2(E[0] - T[0], E[1] - T[1]), D = -Math.atan2(M[0] - S[0], M[1] - S[1])) : D = R = s[1] > t[1] ? 0 : Math.PI, r.save(), r.translate(T[0], T[1]), r.rotate(R), r.beginPath(), r.moveTo(-5, -3), r.lineTo(0, 7), r.lineTo(5, -3), r.fill(), r.restore(), r.save(), r.translate(S[0], S[1]), r.rotate(D), r.beginPath(), r.moveTo(-5, -3), r.lineTo(0, 7), r.lineTo(5, -3), r.fill(), r.restore();
      }
      r.beginPath(), r.arc(L[0], L[1], 5, 0, Math.PI * 2), r.fill();
    }
    if (o) {
      r.fillStyle = l;
      for (let N = 0; N < 5; ++N) {
        var C = (LiteGraph.getTime() * 1e-3 + N * 0.2) % 1;
        L = this.computeConnectionPoint(
          t,
          s,
          C,
          h,
          u
        ), r.beginPath(), r.arc(L[0], L[1], 5, 0, 2 * Math.PI), r.fill();
      }
    }
  }
  // returns the link center point based on curvature
  computeConnectionPoint(r, t, s, a, n) {
    a = a || LiteGraph.RIGHT, n = n || LiteGraph.LEFT;
    var o = LiteGraph.distance(r, t), l = r, h = [r[0], r[1]], u = [t[0], t[1]], p = t;
    switch (a) {
      case LiteGraph.LEFT:
        h[0] += o * -0.25;
        break;
      case LiteGraph.RIGHT:
        h[0] += o * 0.25;
        break;
      case LiteGraph.UP:
        h[1] += o * -0.25;
        break;
      case LiteGraph.DOWN:
        h[1] += o * 0.25;
        break;
    }
    switch (n) {
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
    var c = (1 - s) * (1 - s) * (1 - s), f = 3 * ((1 - s) * (1 - s)) * s, d = 3 * (1 - s) * (s * s), _ = s * s * s, g = c * l[0] + f * h[0] + d * u[0] + _ * p[0], m = c * l[1] + f * h[1] + d * u[1] + _ * p[1];
    return [g, m];
  }
  drawExecutionOrder(r) {
    r.shadowColor = "transparent", r.globalAlpha = 0.25, r.textAlign = "center", r.strokeStyle = "white", r.globalAlpha = 0.75;
    var t = this.visible_nodes;
    for (let a = 0; a < t.length; ++a) {
      var s = t[a];
      r.fillStyle = "black", r.fillRect(
        s.pos[0] - LiteGraph.NODE_TITLE_HEIGHT,
        s.pos[1] - LiteGraph.NODE_TITLE_HEIGHT,
        LiteGraph.NODE_TITLE_HEIGHT,
        LiteGraph.NODE_TITLE_HEIGHT
      ), s.order == 0 && r.strokeRect(
        s.pos[0] - LiteGraph.NODE_TITLE_HEIGHT + 0.5,
        s.pos[1] - LiteGraph.NODE_TITLE_HEIGHT + 0.5,
        LiteGraph.NODE_TITLE_HEIGHT,
        LiteGraph.NODE_TITLE_HEIGHT
      ), r.fillStyle = "#FFF", r.fillText(
        s.order,
        s.pos[0] + LiteGraph.NODE_TITLE_HEIGHT * -0.5,
        s.pos[1] - 6
      );
    }
    r.globalAlpha = 1;
  }
  /**
   * draws the widgets stored inside a node
   * @method drawNodeWidgets
   **/
  drawNodeWidgets(r, t, s, a) {
    if (!r.widgets || !r.widgets.length)
      return 0;
    var n = r.size[0], o = r.widgets;
    t += 2;
    var l = LiteGraph.NODE_WIDGET_HEIGHT, h = !this.lowQualityRenderingRequired(0.5);
    s.save(), s.globalAlpha = this.editor_alpha;
    var u = LiteGraph.WIDGET_OUTLINE_COLOR, p = LiteGraph.WIDGET_BGCOLOR, c = LiteGraph.WIDGET_TEXT_COLOR, f = LiteGraph.WIDGET_SECONDARY_TEXT_COLOR, d = 15;
    for (let M = 0; M < o.length; ++M) {
      var _ = o[M], g = t;
      _.y && (g = _.y), _.last_y = g, s.strokeStyle = u, s.fillStyle = "#222", s.textAlign = "left", _.disabled && (s.globalAlpha *= 0.5);
      var m = _.width || n;
      switch (_.type) {
        case "button":
          _.clicked && (s.fillStyle = "#AAA", _.clicked = !1, this.dirty_canvas = !0), s.fillRect(d, g, m - d * 2, l), h && !_.disabled && s.strokeRect(d, g, m - d * 2, l), h && (s.textAlign = "center", s.fillStyle = c, s.fillText(_.label || _.name, m * 0.5, g + l * 0.7));
          break;
        case "toggle":
          if (s.textAlign = "left", s.strokeStyle = u, s.fillStyle = p, s.beginPath(), h ? s.roundRect(d, g, m - d * 2, l, [l * 0.5]) : s.rect(d, g, m - d * 2, l), s.fill(), h && !_.disabled && s.stroke(), s.fillStyle = _.value ? "#89A" : "#333", s.beginPath(), s.arc(m - d * 2, g + l * 0.5, l * 0.36, 0, Math.PI * 2), s.fill(), h) {
            s.fillStyle = f;
            const R = _.label || _.name;
            R != null && s.fillText(R, d * 2, g + l * 0.7), s.fillStyle = _.value ? c : f, s.textAlign = "right", s.fillText(
              _.value ? _.options.on || "true" : _.options.off || "false",
              m - 40,
              g + l * 0.7
            );
          }
          break;
        case "slider":
          s.fillStyle = p, s.fillRect(d, g, m - d * 2, l);
          var G = _.options.max - _.options.min, L = (_.value - _.options.min) / G;
          if (L < 0 && (L = 0), L > 1 && (L = 1), s.fillStyle = _.options.hasOwnProperty("slider_color") ? _.options.slider_color : a == _ ? "#89A" : "#678", s.fillRect(d, g, L * (m - d * 2), l), h && !_.disabled && s.strokeRect(d, g, m - d * 2, l), _.marker) {
            var T = (_.marker - _.options.min) / G;
            T < 0 && (T = 0), T > 1 && (T = 1), s.fillStyle = _.options.hasOwnProperty("marker_color") ? _.options.marker_color : "#AA9", s.fillRect(d + T * (m - d * 2), g, 2, l);
          }
          h && (s.textAlign = "center", s.fillStyle = c, s.fillText(
            _.label || _.name + "  " + Number(_.value).toFixed(_.options.precision != null ? _.options.precision : 3),
            m * 0.5,
            g + l * 0.7
          ));
          break;
        case "number":
        case "combo":
          if (s.textAlign = "left", s.strokeStyle = u, s.fillStyle = p, s.beginPath(), h ? s.roundRect(d, g, m - d * 2, l, [l * 0.5]) : s.rect(d, g, m - d * 2, l), s.fill(), h)
            if (_.disabled || s.stroke(), s.fillStyle = c, _.disabled || (s.beginPath(), s.moveTo(d + 16, g + 5), s.lineTo(d + 6, g + l * 0.5), s.lineTo(d + 16, g + l - 5), s.fill(), s.beginPath(), s.moveTo(m - d - 16, g + 5), s.lineTo(m - d - 6, g + l * 0.5), s.lineTo(m - d - 16, g + l - 5), s.fill()), s.fillStyle = f, s.fillText(_.label || _.name, d * 2 + 5, g + l * 0.7), s.fillStyle = c, s.textAlign = "right", _.type == "number")
              s.fillText(
                Number(_.value).toFixed(_.options.precision !== void 0 ? _.options.precision : 3),
                m - d * 2 - 20,
                g + l * 0.7
              );
            else {
              var E = _.value;
              if (_.options.values) {
                var S = _.options.values;
                S.constructor === Function && (S = S()), S && S.constructor !== Array && (E = S[_.value]);
              }
              s.fillText(
                E,
                m - d * 2 - 20,
                g + l * 0.7
              );
            }
          break;
        case "string":
        case "text":
          if (s.textAlign = "left", s.strokeStyle = u, s.fillStyle = p, s.beginPath(), h ? s.roundRect(d, g, m - d * 2, l, [l * 0.5]) : s.rect(d, g, m - d * 2, l), s.fill(), h) {
            _.disabled || s.stroke(), s.save(), s.beginPath(), s.rect(d, g, m - d * 2, l), s.clip(), s.fillStyle = f;
            const R = _.label || _.name;
            R != null && s.fillText(R, d * 2, g + l * 0.7), s.fillStyle = c, s.textAlign = "right", s.fillText(String(_.value).substr(0, 30), m - d * 2, g + l * 0.7), s.restore();
          }
          break;
        default:
          _.draw && _.draw(s, r, m, g, l);
          break;
      }
      t += (_.computeSize ? _.computeSize(m)[1] : l) + 4, s.globalAlpha = this.editor_alpha;
    }
    s.restore(), s.textAlign = "left";
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
                let r = x < 40 ? -1 : x > widget_width - 40 ? 1 : 0;
                if (w.type == "number")
                  w.value += r * 0.1 * (w.options.step || 1), w.options.min != null && w.value < w.options.min && (w.value = w.options.min), w.options.max != null && w.value > w.options.max && (w.value = w.options.max);
                else if (r) {
                  var index = -1;
                  this.last_mouseclick = 0, values.constructor === Object ? index = values_list.indexOf(String(w.value)) + r : index = values_list.indexOf(w.value) + r, index >= values_list.length && (index = values_list.length - 1), index < 0 && (index = 0), values.constructor === Array ? w.value = values[index] : w.value = index;
                } else {
                  let t = function(s) {
                    return values != values_list && (s = text_values.indexOf(s)), this.value = s, inner_value_change(this, s, old_value), that.dirty_canvas = !0, !1;
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
                    var r;
                    if (/^[0-9+\-*/()\s]+|\d+\.\d+$/.test(v))
                      try {
                        v = eval(v);
                      } catch (t) {
                        (r = LiteGraph.warn) == null || r.call(LiteGraph, t);
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
                function(r) {
                  inner_value_change(this, r);
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
    function inner_value_change(r, t, s) {
      var a;
      (a = LiteGraph.debug) == null || a.call(LiteGraph, "inner_value_change for processNodeWidgets", r, t), s != w.value && (node.onWidgetChanged && node.onWidgetChanged(w.name, w.value, s, w), node.graph.onGraphChanged({ action: "widgetChanged", doSave: !0 })), r.type == "number" && (t = Number(t)), r.value = t, r.options && r.options.property && node.properties[r.options.property] !== void 0 && node.setProperty(r.options.property, t), r.callback && r.callback(r.value, that, node, pos, event);
    }
    return null;
  }
  /**
   * draws every group area in the background
   * @method drawGroups
   **/
  drawGroups(r, t) {
    if (this.graph) {
      var s = this.graph._groups;
      t.save(), t.globalAlpha = 0.5 * this.editor_alpha;
      for (let h = 0; h < s.length; ++h) {
        var a = s[h];
        if (LiteGraph.overlapBounding(this.visible_area, a._bounding)) {
          t.fillStyle = a.color || "#335", t.strokeStyle = a.color || "#335";
          var n = a._pos, o = a._size;
          t.globalAlpha = 0.25 * this.editor_alpha, t.beginPath(), t.rect(n[0] + 0.5, n[1] + 0.5, o[0], o[1]), t.fill(), t.globalAlpha = this.editor_alpha, t.stroke(), t.beginPath(), t.moveTo(n[0] + o[0], n[1] + o[1]), t.lineTo(n[0] + o[0] - 10, n[1] + o[1]), t.lineTo(n[0] + o[0], n[1] + o[1] - 10), t.fill();
          var l = a.font_size || LiteGraph.DEFAULT_GROUP_FONT_SIZE;
          t.font = l + "px Arial", t.textAlign = "left", t.fillText(a.title, n[0] + 4, n[1] + l);
        }
      }
      t.restore();
    }
  }
  adjustNodesSize() {
    var r = this.graph._nodes;
    for (let t = 0; t < r.length; ++t)
      r[t].size = r[t].computeSize();
    this.setDirty(!0, !0);
  }
  /**
   * resizes the canvas to a given size, if no size is passed, then it tries to fill the parentNode
   * @method resize
   **/
  resize(r, t) {
    if (!r && !t) {
      var s = this.canvas.parentNode;
      r = s.offsetWidth, t = s.offsetHeight;
    }
    this.canvas.width == r && this.canvas.height == t || (this.canvas.width = r, this.canvas.height = t, this.bgcanvas.width = this.canvas.width, this.bgcanvas.height = this.canvas.height, this.setDirty(!0, !0));
  }
  /**
   * switches to live mode (node shapes are not rendered, only the content)
   * this feature was designed when graphs where meant to create user interfaces
   * @method switchLiveMode
   **/
  switchLiveMode(r) {
    if (!r) {
      this.live_mode = !this.live_mode, this.dirty_canvas = !0, this.dirty_bgcanvas = !0;
      return;
    }
    var t = this, s = this.live_mode ? 1.1 : 0.9;
    this.live_mode && (this.live_mode = !1, this.editor_alpha = 0.1);
    var a = setInterval(function() {
      t.editor_alpha *= s, t.dirty_canvas = !0, t.dirty_bgcanvas = !0, s < 1 && t.editor_alpha < 0.01 && (clearInterval(a), s < 1 && (t.live_mode = !0)), s > 1 && t.editor_alpha > 0.99 && (clearInterval(a), t.editor_alpha = 1);
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
  static onGroupAdd(r, t, s) {
    var a = _LGraphCanvas.active_canvas, n = new LiteGraph.LGraphGroup();
    n.pos = a.convertEventToCanvasOffset(s), a.graph.add(n);
  }
  /**
   * Determines the furthest nodes in each direction
   * @param nodes {LGraphNode[]} the nodes to from which boundary nodes will be extracted
   * @return {{left: LGraphNode, top: LGraphNode, right: LGraphNode, bottom: LGraphNode}}
   */
  static getBoundaryNodes(r) {
    let t = null, s = null, a = null, n = null;
    for (const o in r) {
      const l = r[o], [h, u] = l.pos, [p, c] = l.size;
      (t === null || u < t.pos[1]) && (t = l), (s === null || h + p > s.pos[0] + s.size[0]) && (s = l), (a === null || u + c > a.pos[1] + a.size[1]) && (a = l), (n === null || h < n.pos[0]) && (n = l);
    }
    return {
      top: t,
      right: s,
      bottom: a,
      left: n
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
  static alignNodes(r, t, s) {
    if (!r)
      return;
    const a = _LGraphCanvas.active_canvas;
    let n = [];
    s === void 0 ? n = _LGraphCanvas.getBoundaryNodes(r) : n = {
      top: s,
      right: s,
      bottom: s,
      left: s
    };
    for (const [o, l] of Object.entries(a.selected_nodes))
      switch (t) {
        case "right":
          l.pos[0] = n.right.pos[0] + n.right.size[0] - l.size[0];
          break;
        case "left":
          l.pos[0] = n.left.pos[0];
          break;
        case "top":
          l.pos[1] = n.top.pos[1];
          break;
        case "bottom":
          l.pos[1] = n.bottom.pos[1] + n.bottom.size[1] - l.size[1];
          break;
      }
    a.dirty_canvas = !0, a.dirty_bgcanvas = !0;
  }
  static onNodeAlign(r, t, s, a, n) {
    new LiteGraph.ContextMenu(["Top", "Bottom", "Left", "Right"], {
      event: s,
      callback: o,
      parentMenu: a
    });
    function o(l) {
      _LGraphCanvas.alignNodes(_LGraphCanvas.active_canvas.selected_nodes, l.toLowerCase(), n);
    }
  }
  static onGroupAlign(r, t, s, a) {
    new LiteGraph.ContextMenu(["Top", "Bottom", "Left", "Right"], {
      event: s,
      callback: n,
      parentMenu: a
    });
    function n(o) {
      _LGraphCanvas.alignNodes(_LGraphCanvas.active_canvas.selected_nodes, o.toLowerCase());
    }
  }
  static onMenuAdd(r, t, s, a, n) {
    var o = _LGraphCanvas.active_canvas, l = o.getCanvasWindow(), h = o.graph;
    if (!h)
      return;
    function u(p, c) {
      var f = LiteGraph.getNodeTypesCategories(o.filter || h.filter).filter(function(g) {
        return g.startsWith(p);
      }), d = [];
      f.map(function(g) {
        if (g) {
          var m = new RegExp("^(" + p + ")"), G = g.replace(m, "").split("/")[0], L = p === "" ? G + "/" : p + G + "/", T = G;
          T.indexOf("::") != -1 && (T = T.split("::")[1]);
          var E = d.findIndex(function(S) {
            return S.value === L;
          });
          E === -1 && d.push({
            value: L,
            content: T,
            has_submenu: !0,
            callback: function(S, M, R, D) {
              u(S.value, D);
            }
          });
        }
      });
      var _ = LiteGraph.getNodeTypesInCategory(p.slice(0, -1), o.filter || h.filter);
      _.map(function(g) {
        if (!g.skip_list) {
          var m = {
            value: g.type,
            content: g.title,
            has_submenu: !1,
            callback: function(G, L, T, E) {
              var S = E.getFirstEvent();
              o.graph.beforeChange();
              var M = LiteGraph.createNode(G.value);
              M && (M.pos = o.convertEventToCanvasOffset(S), o.graph.add(M)), n && n(M), o.graph.afterChange();
            }
          };
          d.push(m);
        }
      }), new LiteGraph.ContextMenu(d, { event: s, parentMenu: c }, l);
    }
    return u("", a), !1;
  }
  static onMenuCollapseAll() {
  }
  static onMenuNodeEdit() {
  }
  static showMenuNodeOptionalInputs(r, t, s, a, n) {
    var g;
    if (!n)
      return;
    var o = this, l = _LGraphCanvas.active_canvas, h = l.getCanvasWindow();
    t = n.optional_inputs, n.onGetInputs && (t = n.onGetInputs());
    var u = [];
    if (t)
      for (let m = 0; m < t.length; m++) {
        var p = t[m];
        if (!p) {
          u.push(null);
          continue;
        }
        var c = p[0];
        p[2] || (p[2] = {}), p[2].label && (c = p[2].label), p[2].removable = !0;
        var f = { content: c, value: p };
        p[1] == LiteGraph.ACTION && (f.className = "event"), u.push(f);
      }
    if (n.onMenuNodeInputs) {
      var d = n.onMenuNodeInputs(u);
      d && (u = d);
    }
    if (LiteGraph.do_add_triggers_slots && n.findInputSlot("onTrigger") == -1 && u.push({ content: "On Trigger", value: ["onTrigger", LiteGraph.EVENT, { nameLocked: !0, removable: !0 }], className: "event" }), !u.length) {
      LiteGraph.debug && ((g = LiteGraph.log) == null || g.call(LiteGraph, "no input entries"));
      return;
    }
    new LiteGraph.ContextMenu(
      u,
      {
        event: s,
        callback: _,
        parentMenu: a,
        node: n
      },
      h
    );
    function _(m, G, L) {
      var E;
      if (n && (m.callback && m.callback.call(o, n, m, G, L), m.value)) {
        n.graph.beforeChange();
        var T = {};
        m.value[2] && (T = Object.assign(T, m.value[2])), n.addInput(m.value[0], m.value[1], T), (E = n.onNodeInputAdd) == null || E.call(n, m.value), n.setDirtyCanvas(!0, !0), n.graph.afterChange();
      }
    }
    return !1;
  }
  static showMenuNodeOptionalOutputs(r, t, s, a, n) {
    if (!n)
      return;
    var o = this, l = _LGraphCanvas.active_canvas, h = l.getCanvasWindow();
    t = n.optional_outputs, n.onGetOutputs && (t = n.onGetOutputs());
    var u = [];
    if (t)
      for (let g = 0; g < t.length; g++) {
        var p = t[g];
        if (!p) {
          u.push(null);
          continue;
        }
        if (!(n.flags && n.flags.skip_repeated_outputs && n.findOutputSlot(p[0]) != -1)) {
          var c = p[0];
          p[2] || (p[2] = {}), p[2].label && (c = p[2].label), p[2].removable = !0;
          var f = { content: c, value: p };
          p[1] == LiteGraph.EVENT && (f.className = "event"), u.push(f);
        }
      }
    if (this.onMenuNodeOutputs && (u = this.onMenuNodeOutputs(u)), LiteGraph.do_add_triggers_slots && n.findOutputSlot("onExecuted") == -1 && u.push({
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
    }), n.onMenuNodeOutputs) {
      var d = n.onMenuNodeOutputs(u);
      d && (u = d);
    }
    if (!u.length)
      return;
    new LiteGraph.ContextMenu(
      u,
      {
        event: s,
        callback: _,
        parentMenu: a,
        node: n
      },
      h
    );
    function _(g, m, G) {
      var S;
      if (n && (g.callback && g.callback.call(o, n, g, m, G), !!g.value)) {
        var L = g.value[1];
        if (L && (L.constructor === Object || L.constructor === Array)) {
          var T = [];
          for (let M in L)
            T.push({ content: M, value: L[M] });
          return new LiteGraph.ContextMenu(T, {
            event: m,
            callback: _,
            parentMenu: a,
            node: n
          }), !1;
        } else {
          n.graph.beforeChange();
          var E = {};
          g.value[2] && (E = Object.assign(E, g.value[2])), n.addOutput(g.value[0], g.value[1], E), (S = n.onNodeOutputAdd) == null || S.call(n, g.value), n.setDirtyCanvas(!0, !0), n.graph.afterChange();
        }
      }
    }
    return !1;
  }
  static onShowMenuNodeProperties(r, t, s, a, n) {
    if (!n || !n.properties)
      return;
    var o = _LGraphCanvas.active_canvas, l = o.getCanvasWindow(), h = [];
    for (let c in n.properties) {
      r = n.properties[c] !== void 0 ? n.properties[c] : " ", typeof r == "object" && (r = JSON.stringify(r));
      var u = n.getPropertyInfo(c);
      (u.type == "enum" || u.type == "combo") && (r = _LGraphCanvas.getPropertyPrintableValue(r, u.values)), r = _LGraphCanvas.decodeHTML(r), h.push({
        content: "<span class='property_name'>" + (u.label ? u.label : c) + "</span><span class='property_value'>" + r + "</span>",
        value: c
      });
    }
    if (!h.length)
      return;
    new LiteGraph.ContextMenu(
      h,
      {
        event: s,
        callback: p,
        parentMenu: a,
        allow_html: !0,
        node: n
      },
      l
    );
    function p(c) {
      if (n) {
        var f = this.getBoundingClientRect();
        o.showEditPropertyValue(n, c.value, { position: [f.left, f.top] });
      }
    }
    return !1;
  }
  static decodeHTML(r) {
    var t = document.createElement("div");
    return t.innerText = r, t.innerHTML;
  }
  static onMenuResizeNode(r, t, s, a, n) {
    if (!n)
      return;
    const o = (h) => {
      h.size = h.computeSize(), h.onResize && h.onResize(h.size);
    };
    var l = _LGraphCanvas.active_canvas;
    if (!l.selected_nodes || Object.keys(l.selected_nodes).length <= 1)
      o(n);
    else
      for (let h in l.selected_nodes)
        o(l.selected_nodes[h]);
    n.setDirtyCanvas(!0, !0);
  }
  showLinkMenu(r, t) {
    var s = this, a = s.graph.getNodeById(r.origin_id), n = s.graph.getNodeById(r.target_id), o = !1;
    a && a.outputs && a.outputs[r.origin_slot] && (o = a.outputs[r.origin_slot].type);
    var l = !1;
    n && n.outputs && n.outputs[r.target_slot] && (l = n.inputs[r.target_slot].type);
    var h = new LiteGraph.ContextMenu(options, {
      event: t,
      title: r.data != null ? r.data.constructor.name : null,
      callback: u
    });
    function u(p, c, f) {
      switch (p) {
        case "Add Node":
          _LGraphCanvas.onMenuAdd(null, null, f, h, function(d) {
            var _;
            (_ = LiteGraph.debug) == null || _.call(LiteGraph, "node autoconnect"), !(!d.inputs || !d.inputs.length || !d.outputs || !d.outputs.length) && a.connectByType(r.origin_slot, d, o) && (d.connectByType(r.target_slot, n, l), d.pos[0] -= d.size[0] * 0.5);
          });
          break;
        case "Delete":
          s.graph.removeLink(r.id);
          break;
      }
    }
    return !1;
  }
  createDefaultNodeForSlot(r = {}) {
    var g, m, G, L, T;
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
      r
    ), s = this, a = t.nodeFrom && t.slotFrom !== null, n = !a && t.nodeTo && t.slotTo !== null;
    if (!a && !n)
      return (g = LiteGraph.warn) == null || g.call(LiteGraph, "No data passed to createDefaultNodeForSlot " + t.nodeFrom + " " + t.slotFrom + " " + t.nodeTo + " " + t.slotTo), !1;
    if (!t.nodeType)
      return (m = LiteGraph.warn) == null || m.call(LiteGraph, "No type to createDefaultNodeForSlot"), !1;
    var o = a ? t.nodeFrom : t.nodeTo, l = a ? t.slotFrom : t.slotTo, h = !1;
    switch (typeof l) {
      case "string":
        h = a ? o.findOutputSlot(l, !1) : o.findInputSlot(l, !1), l = a ? o.outputs[l] : o.inputs[l];
        break;
      case "object":
        h = a ? o.findOutputSlot(l.name) : o.findInputSlot(l.name);
        break;
      case "number":
        h = l, l = a ? o.outputs[l] : o.inputs[l];
        break;
      default:
        return (G = LiteGraph.warn) == null || G.call(LiteGraph, "Cant get slot information " + l), !1;
    }
    (l === !1 || h === !1) && ((L = LiteGraph.warn) == null || L.call(LiteGraph, "createDefaultNodeForSlot bad slotX " + l + " " + h));
    var u = l.type == LiteGraph.EVENT ? "_event_" : l.type, p = a ? LiteGraph.slot_types_default_out : LiteGraph.slot_types_default_in;
    if (p && p[u]) {
      l.link;
      var c = !1;
      if (typeof p[u] == "object") {
        for (var f in p[u])
          if (t.nodeType == p[u][f] || t.nodeType == "AUTO") {
            c = p[u][f];
            break;
          }
      } else
        (t.nodeType == p[u] || t.nodeType == "AUTO") && (c = p[u]);
      if (c) {
        var d = !1;
        typeof c == "object" && c.node && (d = c, c = c.node);
        var _ = LiteGraph.createNode(c);
        if (_) {
          if (d) {
            if (d.properties)
              for (const [E, S] of Object.entries(d.properties))
                _.addProperty(E, S);
            d.inputs && (_.inputs = [], Object.values(d.inputs).forEach((E) => {
              _.addOutput(E[0], E[1]);
            })), d.outputs && (_.outputs = [], Object.values(d.outputs).forEach((E) => {
              _.addOutput(E[0], E[1]);
            })), d.title && (_.title = d.title), d.json && _.configure(d.json);
          }
          return s.graph.add(_), _.pos = [
            t.position[0] + t.posAdd[0] + (t.posSizeFix[0] ? t.posSizeFix[0] * _.size[0] : 0),
            t.position[1] + t.posAdd[1] + (t.posSizeFix[1] ? t.posSizeFix[1] * _.size[1] : 0)
          ], a ? t.nodeFrom.connectByType(h, _, u) : t.nodeTo.connectByTypeOutput(h, _, u), !0;
        } else
          (T = LiteGraph.warn) == null || T.call(LiteGraph, "failed creating " + c);
      }
    }
    return !1;
  }
  showConnectionMenu(r = {}) {
    var d, _;
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
    }, r), s = this, a = t.nodeFrom && t.slotFrom, n = !a && t.nodeTo && t.slotTo;
    if (!a && !n)
      return (d = LiteGraph.warn) == null || d.call(LiteGraph, "No data passed to showConnectionMenu"), !1;
    var o = a ? t.nodeFrom : t.nodeTo, l = a ? t.slotFrom : t.slotTo, h = !1;
    switch (typeof l) {
      case "string":
        h = a ? o.findOutputSlot(l, !1) : o.findInputSlot(l, !1), l = a ? o.outputs[l] : o.inputs[l];
        break;
      case "object":
        h = a ? o.findOutputSlot(l.name) : o.findInputSlot(l.name);
        break;
      case "number":
        h = l, l = a ? o.outputs[l] : o.inputs[l];
        break;
      default:
        return (_ = LiteGraph.warn) == null || _.call(LiteGraph, "Cant get slot information " + l), !1;
    }
    var u = ["Add Node", null];
    s.allow_searchbox && (u.push("Search"), u.push(null));
    const p = l.type === LiteGraph.EVENT ? "_event_" : l.type, c = a ? LiteGraph.slot_types_default_out : LiteGraph.slot_types_default_in;
    if (c && c[p]) {
      const g = c[p];
      Array.isArray(g) || typeof g == "object" ? Object.values(g).forEach((m) => {
        u.push(m);
      }) : u.push(g);
    }
    var f = new LiteGraph.ContextMenu(u, {
      event: t.e,
      title: (l && l.name != "" ? l.name + (p ? " | " : "") : "") + (l && p ? p : ""),
      callback: (g, m, G) => {
        const L = {
          "Add Node": () => {
            _LGraphCanvas.onMenuAdd(null, null, G, f, (T) => {
              a ? t.nodeFrom.connectByType(h, T, p) : t.nodeTo.connectByTypeOutput(h, T, p);
            });
          },
          Search: () => {
            a ? s.showSearchBox(G, { node_from: t.nodeFrom, slot_from: l, type_filter_in: p }) : s.showSearchBox(G, { node_to: t.nodeTo, slot_from: l, type_filter_out: p });
          },
          default: () => {
            s.createDefaultNodeForSlot(Object.assign(t, { position: [t.e.canvasX, t.e.canvasY], nodeType: g }));
          }
        };
        (L[g] || L.default)();
      }
    });
    return !1;
  }
  // TODO refactor :: this is used fot title but not for properties!
  static onShowPropertyEditor(r, t, s, a, n) {
    var o = r.property || "title", l = n[o], h = document.createElement("div");
    h.is_modified = !1, h.className = "graphdialog", h.innerHTML = "<span class='name'></span><input autofocus type='text' class='value'/><button>OK</button>", h.close = () => {
      var E;
      (E = h.parentNode) == null || E.removeChild(h);
    };
    var u = h.querySelector(".name");
    u.innerText = o;
    var p = h.querySelector(".value");
    const c = () => {
      p && T(p.value);
    };
    p && (p.value = l, p.addEventListener("blur", function(E) {
      this.focus();
    }), p.addEventListener("keydown", function(E) {
      if (h.is_modified = !0, E.keyCode == 27)
        h.close();
      else if (E.keyCode == 13)
        c();
      else if (E.keyCode != 13 && E.target.localName != "textarea")
        return;
      E.preventDefault(), E.stopPropagation();
    }));
    var f = _LGraphCanvas.active_canvas, d = f.canvas, _ = d.getBoundingClientRect(), g = -20, m = -20;
    _ && (g -= _.left, m -= _.top), event ? (h.style.left = event.clientX + g + "px", h.style.top = event.clientY + m + "px") : (h.style.left = d.width * 0.5 + g + "px", h.style.top = d.height * 0.5 + m + "px");
    var G = h.querySelector("button");
    G.addEventListener("click", c), d.parentNode.appendChild(h), p && p.focus();
    let L = null;
    h.addEventListener("pointerleave", (E) => {
      LiteGraph.dialog_close_on_mouse_leave && !h.is_modified && (L = setTimeout(h.close, LiteGraph.dialog_close_on_mouse_leave_delay));
    }), h.addEventListener("pointerenter", (E) => {
      LiteGraph.dialog_close_on_mouse_leave && L && clearTimeout(L);
    });
    const T = (E) => {
      var S;
      switch (r.type) {
        case "Number":
          E = Number(E);
          break;
        case "Boolean":
          E = !!E;
          break;
      }
      n[o] = E, (S = h.parentNode) == null || S.removeChild(h), n.setDirtyCanvas(!0, !0);
    };
  }
  // refactor: there are different dialogs, some uses createDialog some dont
  // prompt v2
  prompt(r = "", t, s, a, n) {
    var L;
    var o = document.createElement("div");
    o.is_modified = !1, o.className = "graphdialog rounded", n ? o.innerHTML = "<span class='name'></span> <textarea autofocus class='value'></textarea><button class='rounded'>OK</button>" : o.innerHTML = "<span class='name'></span> <input autofocus type='text' class='value'/><button class='rounded'>OK</button>", o.close = () => {
      var T;
      this.prompt_box = null, (T = o.parentNode) == null || T.removeChild(o);
    };
    var l = _LGraphCanvas.active_canvas, h = l.canvas;
    h.parentNode.appendChild(o), this.ds.scale > 1 && (o.style.transform = `scale(${this.ds.scale})`);
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
    }), (L = this.prompt_box) == null || L.close(), this.prompt_box = o;
    var c = o.querySelector(".name");
    c.innerText = r;
    var f = o.querySelector(".value");
    f.value = t;
    const d = f;
    d.addEventListener("keydown", (T) => {
      var E;
      switch (o.is_modified = !0, T.keyCode) {
        case 27:
          o.close();
          break;
        case 13:
          T.target.localName !== "textarea" && typeof s == "function" && (s(d.value), this.setDirty(!0)), (E = LiteGraph.debug) == null || E.call(LiteGraph, "prompt v2 ENTER", d.value, T.target.localName, s), o.close();
          break;
        default:
          return;
      }
      T.preventDefault(), T.stopPropagation();
    }), o.querySelector("button").addEventListener("click", (T) => {
      var E;
      typeof s == "function" && (s(d.value), this.setDirty(!0)), (E = LiteGraph.debug) == null || E.call(LiteGraph, "prompt v2 OK", d.value, s), o.close();
    });
    var g = h.getBoundingClientRect(), m = -20, G = -20;
    return g && (m -= g.left, G -= g.top), a ? (o.style.left = a.clientX + m + "px", o.style.top = a.clientY + G + "px") : (o.style.left = h.width * 0.5 + m + "px", o.style.top = h.height * 0.5 + G + "px"), setTimeout(function() {
      d.focus();
    }, 10), o;
  }
  showSearchBox(r, t) {
    var s = {
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
    t = Object.assign(s, t || {});
    var a = this, n = _LGraphCanvas.active_canvas, o = n.canvas, l = o.ownerDocument || document, h = document.createElement("div");
    if (h.className = "litegraph litesearchbox graphdialog rounded", h.innerHTML = "<span class='name'>Search</span> <input autofocus type='text' class='value rounded'/>", t.do_type_filter && (h.innerHTML += "<select class='slot_in_type_filter'><option value=''></option></select>", h.innerHTML += "<select class='slot_out_type_filter'><option value=''></option></select>"), t.show_close_button && (h.innerHTML += "<button class='close_searchbox close'>X</button>"), h.innerHTML += "<div class='helper'></div>", l.fullscreenElement ? l.fullscreenElement.appendChild(h) : (l.body.appendChild(h), l.body.style.overflow = "hidden"), t.do_type_filter)
      var u = h.querySelector(".slot_in_type_filter"), p = h.querySelector(".slot_out_type_filter");
    if (h.close = function() {
      a.search_box = null, this.blur(), o.focus(), l.body.style.overflow = "", setTimeout(function() {
        a.canvas.focus();
      }, 20), h.parentNode && h.parentNode.removeChild(h);
    }, this.ds.scale > 1 && (h.style.transform = `scale(${this.ds.scale})`), t.hide_on_mouse_leave) {
      var c = !1, f = null;
      h.addEventListener("pointerenter", function(C) {
        f && (clearTimeout(f), f = null);
      }), h.addEventListener("pointerleave", function(C) {
        c || (f = setTimeout(function() {
          h.close();
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
    a.search_box && a.search_box.close(), a.search_box = h;
    var d = h.querySelector(".helper"), _ = null, g = null, m = null, G = h.querySelector("input");
    if (G && (G.addEventListener("blur", function(C) {
      a.search_box && this.focus();
    }), G.addEventListener("keydown", function(C) {
      if (C.keyCode == 38)
        R(!1);
      else if (C.keyCode == 40)
        R(!0);
      else if (C.keyCode == 27)
        h.close();
      else if (C.keyCode == 13)
        D(), m ? M(m.innerHTML) : _ ? M(_) : h.close();
      else {
        g && clearInterval(g), g = setTimeout(D, 250);
        return;
      }
      return C.preventDefault(), C.stopPropagation(), C.stopImmediatePropagation(), !0;
    })), t.do_type_filter) {
      if (u) {
        let C = LiteGraph.slot_types_in, N = C.length;
        (t.type_filter_in == LiteGraph.EVENT || t.type_filter_in == LiteGraph.ACTION) && (t.type_filter_in = "_event_");
        for (let A = 0; A < N; A++) {
          let O = document.createElement("option");
          O.value = C[A], O.innerHTML = C[A], u.appendChild(O), t.type_filter_in !== !1 && (t.type_filter_in + "").toLowerCase() == (C[A] + "").toLowerCase() && (O.selected = !0);
        }
        u.addEventListener("change", function() {
          D();
        });
      }
      if (p) {
        let C = LiteGraph.slot_types_out, N = C.length;
        (t.type_filter_out == LiteGraph.EVENT || t.type_filter_out == LiteGraph.ACTION) && (t.type_filter_out = "_event_");
        for (let A = 0; A < N; A++) {
          let O = document.createElement("option");
          O.value = C[A], O.innerHTML = C[A], p.appendChild(O), t.type_filter_out !== !1 && (t.type_filter_out + "").toLowerCase() == (C[A] + "").toLowerCase() && (O.selected = !0);
        }
        p.addEventListener("change", function() {
          D();
        });
      }
    }
    if (t.show_close_button) {
      var L = h.querySelector(".close");
      L.addEventListener("click", h.close);
    }
    var T = o.getBoundingClientRect(), E = (r ? r.clientX : T.left + T.width * 0.5) - 80, S = (r ? r.clientY : T.top + T.height * 0.5) - 20;
    T.width - E < 470 && (E = T.width - 470), T.height - S < 220 && (S = T.height - 220), E < T.left + 20 && (E = T.left + 20), S < T.top + 20 && (S = T.top + 20), h.style.left = E + "px", h.style.top = S + "px", G.focus(), t.show_all_on_open && D();
    function M(C) {
      if (C)
        if (a.onSearchBoxSelection)
          a.onSearchBoxSelection(C, r, n);
        else {
          var N = LiteGraph.searchbox_extras[C.toLowerCase()];
          N && (C = N.type), n.graph.beforeChange();
          var A = LiteGraph.createNode(C);
          if (A && (A.pos = n.convertEventToCanvasOffset(r), n.graph.add(A, !1, { doProcessChange: !1 })), N && N.data) {
            if (N.data.properties)
              for (let I in N.data.properties)
                A.addProperty(I, N.data.properties[I]);
            if (N.data.inputs) {
              A.inputs = [];
              for (let I in N.data.inputs)
                A.addOutput(
                  N.data.inputs[I][0],
                  N.data.inputs[I][1]
                );
            }
            if (N.data.outputs) {
              A.outputs = [];
              for (let I in N.data.outputs)
                A.addOutput(
                  N.data.outputs[I][0],
                  N.data.outputs[I][1]
                );
            }
            N.data.title && (A.title = N.data.title), N.data.json && A.configure(N.data.json);
          }
          let O;
          if (t.node_from) {
            switch (O = !1, typeof t.slot_from) {
              case "string":
                O = t.node_from.findOutputSlot(t.slot_from);
                break;
              case "object":
                t.slot_from.name ? O = t.node_from.findOutputSlot(t.slot_from.name) : O = -1, O == -1 && typeof t.slot_from.slot_index != "undefined" && (O = t.slot_from.slot_index);
                break;
              case "number":
                O = t.slot_from;
                break;
              default:
                O = 0;
            }
            typeof t.node_from.outputs[O] != "undefined" && O !== !1 && O > -1 && t.node_from.connectByType(O, A, t.node_from.outputs[O].type);
          }
          if (t.node_to) {
            switch (O = !1, typeof t.slot_from) {
              case "string":
                O = t.node_to.findInputSlot(t.slot_from);
                break;
              case "object":
                t.slot_from.name ? O = t.node_to.findInputSlot(t.slot_from.name) : O = -1, O == -1 && typeof t.slot_from.slot_index != "undefined" && (O = t.slot_from.slot_index);
                break;
              case "number":
                O = t.slot_from;
                break;
              default:
                O = 0;
            }
            typeof t.node_to.inputs[O] != "undefined" && O !== !1 && O > -1 && t.node_to.connectByTypeOutput(O, A, t.node_to.inputs[O].type);
          }
          n.graph.afterChange();
        }
      h.close();
    }
    function R(C) {
      var N = m;
      m && m.classList.remove("selected"), m ? (m = C ? m.nextSibling : m.previousSibling, m || (m = N)) : m = C ? d.childNodes[0] : d.childNodes[d.childNodes.length], m && (m.classList.add("selected"), m.scrollIntoView({ block: "end", behavior: "smooth" }));
    }
    function D() {
      g = null;
      var C = G.value;
      if (_ = null, d.innerHTML = "", !C && !t.show_all_if_empty)
        return;
      if (a.onSearchBox) {
        var N = a.onSearchBox(d, C, n);
        if (N)
          for (let z = 0; z < N.length; ++z)
            it(N[z]);
      } else {
        let V = function(B, K = {}) {
          var lt = {
            skipFilter: !1,
            inTypeOverride: !1,
            outTypeOverride: !1
          }, P = Object.assign(lt, K), W = LiteGraph.registered_node_types[B];
          if (O && W.filter != O || (!t.show_all_if_empty || C) && B.toLowerCase().indexOf(C) === -1)
            return !1;
          if (t.do_type_filter && !P.skipFilter) {
            var $ = B;
            let ht;
            var F = z.value;
            if (P.inTypeOverride !== !1 && (F = P.inTypeOverride), z && F && LiteGraph.registered_slot_in_types[F] && LiteGraph.registered_slot_in_types[F].nodes && (ht = LiteGraph.registered_slot_in_types[F].nodes.includes($), ht === !1) || (F = U.value, P.outTypeOverride !== !1 && (F = P.outTypeOverride), U && F && LiteGraph.registered_slot_out_types[F] && LiteGraph.registered_slot_out_types[F].nodes && (ht = LiteGraph.registered_slot_out_types[F].nodes.includes($), ht === !1)))
              return !1;
          }
          return !0;
        };
        var A = 0;
        C = C.toLowerCase();
        var O = n.filter || n.graph.filter;
        let z, U;
        t.do_type_filter && a.search_box ? (z = a.search_box.querySelector(".slot_in_type_filter"), U = a.search_box.querySelector(".slot_out_type_filter")) : (z = !1, U = !1);
        for (let B in LiteGraph.searchbox_extras) {
          var I = LiteGraph.searchbox_extras[B];
          if (!((!t.show_all_if_empty || C) && I.desc.toLowerCase().indexOf(C) === -1)) {
            var q = LiteGraph.registered_node_types[I.type];
            if (!(q && q.filter != O) && V(I.type) && (it(I.desc, "searchbox_extra"), _LGraphCanvas.search_limit !== -1 && A++ > _LGraphCanvas.search_limit))
              break;
          }
        }
        var et = null;
        if (Array.prototype.filter)
          et = Object.keys(LiteGraph.registered_node_types).filter(V);
        else {
          et = [];
          for (let B in LiteGraph.registered_node_types)
            V(B) && et.push(B);
        }
        for (let B = 0; B < et.length && (it(et[B]), !(_LGraphCanvas.search_limit !== -1 && A++ > _LGraphCanvas.search_limit)); B++)
          ;
        if (t.show_general_after_typefiltered && (z.value || U.value)) {
          var Z = [];
          for (let B in LiteGraph.registered_node_types)
            V(B, { inTypeOverride: z && z.value ? "*" : !1, outTypeOverride: U && U.value ? "*" : !1 }) && Z.push(B);
          for (let B = 0; B < Z.length && (it(Z[B], "generic_type"), !(_LGraphCanvas.search_limit !== -1 && A++ > _LGraphCanvas.search_limit)); B++)
            ;
        }
        if ((z.value || U.value) && d.childNodes.length == 0 && t.show_general_if_none_on_typefilter) {
          var Z = [];
          for (let K in LiteGraph.registered_node_types)
            V(K, { skipFilter: !0 }) && Z.push(K);
          for (let K = 0; K < Z.length && (it(Z[K], "not_in_filter"), !(_LGraphCanvas.search_limit !== -1 && A++ > _LGraphCanvas.search_limit)); K++)
            ;
        }
      }
      function it(z, U) {
        var V = document.createElement("div");
        _ || (_ = z), V.innerText = z, V.dataset.type = escape(z), V.className = "litegraph lite-search-item", U && (V.className += " " + U), V.addEventListener("click", function(B) {
          M(unescape(this.dataset.type));
        }), d.appendChild(V);
      }
    }
    return h;
  }
  showEditPropertyValue(r, t, s) {
    var d, _, g, m, G;
    if (!r || r.properties[t] === void 0)
      return;
    s = s || {};
    var a = r.getPropertyInfo(t), n = a.type;
    let o;
    if (n == "string" || n == "number" || n == "array" || n == "object")
      o = "<input autofocus type='text' class='value'/>";
    else if ((n == "enum" || n == "combo") && a.values) {
      (d = LiteGraph.debug) == null || d.call(LiteGraph, "CREATING showEditPropertyValue ENUM COMBO", u, n, h), o = "<select autofocus type='text' class='value'>";
      for (let L in a.values) {
        var l = L;
        a.values.constructor === Array && (l = a.values[L]), o += "<option value='" + l + "' " + (l == r.properties[t] ? "selected" : "") + ">" + a.values[L] + "</option>";
      }
      o += "</select>";
    } else if (n == "boolean" || n == "toggle")
      o = "<input autofocus type='checkbox' class='value' " + (r.properties[t] ? "checked" : "") + "/>";
    else {
      (_ = LiteGraph.warn) == null || _.call(LiteGraph, "unknown type: " + n);
      return;
    }
    var h = this.createDialog(
      "<span class='name'>" + (a.label ? a.label : t) + "</span>" + o + "<button>OK</button>",
      s
    ), u = !1;
    (n == "enum" || n == "combo") && a.values ? ((g = LiteGraph.debug) == null || g.call(LiteGraph, "showEditPropertyValue ENUM COMBO", u, n, h), u = h.querySelector("select"), u.addEventListener("change", function(L) {
      var T;
      h.modified(), (T = LiteGraph.debug) == null || T.call(LiteGraph, "Enum change", u, a, L.target), f(L.target.value);
    })) : n == "boolean" || n == "toggle" ? ((m = LiteGraph.debug) == null || m.call(LiteGraph, "showEditPropertyValue TOGGLE", u, n, h), u = h.querySelector("input"), u && u.addEventListener("click", function(L) {
      h.modified(), f(!!u.checked);
    })) : (u = h.querySelector("input"), (G = LiteGraph.debug) == null || G.call(LiteGraph, "showEditPropertyValue", u, n, h), u && (u.addEventListener("blur", function(L) {
      this.focus();
    }), l = r.properties[t] !== void 0 ? r.properties[t] : "", n !== "string" && (l = JSON.stringify(l)), u.value = l, u.addEventListener("keydown", function(L) {
      if (L.keyCode == 27)
        h.close();
      else if (L.keyCode == 13)
        c();
      else if (L.keyCode != 13) {
        h.modified();
        return;
      }
      L.preventDefault(), L.stopPropagation();
    }))), u && u.focus();
    var p = h.querySelector("button");
    p.addEventListener("click", c);
    function c() {
      f(u.value);
    }
    function f(L) {
      var T;
      a && a.values && a.values.constructor === Object && a.values[L] != null && (L = a.values[L]), typeof r.properties[t] == "number" && (L = Number(L)), (n == "array" || n == "object") && (L = JSON.parse(L)), r.properties[t] = L, (T = r.graph) == null || T.onGraphChanged({ action: "propertyChanged", doSave: !0 }), r.onPropertyChanged && r.onPropertyChanged(t, L), s.onclose && s.onclose(), h.close(), r.setDirtyCanvas(!0, !0);
    }
    return h;
  }
  // TODO refactor, theer are different dialog, some uses createDialog, some dont
  createDialog(r, t) {
    var s = { checkForInput: !1, closeOnLeave: !0, closeOnLeave_checkModified: !0 };
    t = Object.assign(s, t || {});
    var a = document.createElement("div");
    a.className = "graphdialog", a.innerHTML = r, a.is_modified = !1;
    var n = this.canvas.getBoundingClientRect(), o = -20, l = -20;
    if (n && (o -= n.left, l -= n.top), t.position ? (o += t.position[0], l += t.position[1]) : t.event ? (o += t.event.clientX, l += t.event.clientY) : (o += this.canvas.width * 0.5, l += this.canvas.height * 0.5), a.style.left = o + "px", a.style.top = l + "px", this.canvas.parentNode.appendChild(a), t.checkForInput) {
      var h = [], u = !1;
      h = a.querySelectorAll("input"), h && h.forEach(function(d) {
        d.addEventListener("keydown", function(_) {
          if (a.modified(), _.keyCode == 27)
            a.close();
          else if (_.keyCode != 13)
            return;
          _.preventDefault(), _.stopPropagation();
        }), u || d.focus();
      });
    }
    a.modified = function() {
      a.is_modified = !0;
    }, a.close = function() {
      a.parentNode && a.parentNode.removeChild(a);
    };
    var p = null, c = !1;
    a.addEventListener("pointerleave", function(d) {
      c || (t.closeOnLeave || LiteGraph.dialog_close_on_mouse_leave) && !a.is_modified && LiteGraph.dialog_close_on_mouse_leave && (p = setTimeout(a.close, LiteGraph.dialog_close_on_mouse_leave_delay));
    }), a.addEventListener("pointerenter", function(d) {
      (t.closeOnLeave || LiteGraph.dialog_close_on_mouse_leave) && p && clearTimeout(p);
    });
    var f = a.querySelectorAll("select");
    return f && f.forEach(function(d) {
      d.addEventListener("click", function(_) {
        c++;
      }), d.addEventListener("blur", function(_) {
        c = 0;
      }), d.addEventListener("change", function(_) {
        c = -1;
      });
    }), a;
  }
  createPanel(r, t) {
    t = t || {};
    var s = t.window || window, a = document.createElement("div");
    if (a.className = "litegraph dialog", a.innerHTML = "<div class='dialog-header'><span class='dialog-title'></span></div><div class='dialog-content'></div><div style='display:none;' class='dialog-alt-content'></div><div class='dialog-footer'></div>", a.header = a.querySelector(".dialog-header"), t.width && (a.style.width = t.width + (t.width.constructor === Number ? "px" : "")), t.height && (a.style.height = t.height + (t.height.constructor === Number ? "px" : "")), t.closable) {
      var n = document.createElement("span");
      n.innerHTML = "&#10005;", n.classList.add("close"), n.addEventListener("click", function() {
        a.close();
      }), a.header.appendChild(n);
    }
    return a.title_element = a.querySelector(".dialog-title"), a.title_element.innerText = r, a.content = a.querySelector(".dialog-content"), a.alt_content = a.querySelector(".dialog-alt-content"), a.footer = a.querySelector(".dialog-footer"), a.close = function() {
      a.onClose && typeof a.onClose == "function" && a.onClose(), a.parentNode && a.parentNode.removeChild(a), this.parentNode && this.parentNode.removeChild(this);
    }, a.toggleAltContent = function(o) {
      let l, h;
      typeof o != "undefined" ? (l = o ? "block" : "none", h = o ? "none" : "block") : (l = a.alt_content.style.display != "block" ? "block" : "none", h = a.alt_content.style.display != "block" ? "none" : "block"), a.alt_content.style.display = l, a.content.style.display = h;
    }, a.toggleFooterVisibility = function(o) {
      let l;
      typeof o != "undefined" ? l = o ? "block" : "none" : l = a.footer.style.display != "block" ? "block" : "none", a.footer.style.display = l;
    }, a.clear = function() {
      this.content.innerHTML = "";
    }, a.addHTML = function(o, l, h) {
      var u = document.createElement("div");
      return l && (u.className = l), u.innerHTML = o, h ? a.footer.appendChild(u) : a.content.appendChild(u), u;
    }, a.addButton = function(o, l, h) {
      var u = document.createElement("button");
      return u.innerText = o, u.options = h, u.classList.add("btn"), u.addEventListener("click", l), a.footer.appendChild(u), u;
    }, a.addSeparator = function() {
      var o = document.createElement("div");
      o.className = "separator", a.content.appendChild(o);
    }, a.addWidget = function(o, l, h, u, p) {
      var g, m;
      u = u || {};
      var c = String(h);
      o = o.toLowerCase(), o == "number" && (c = h.toFixed(3));
      var f = document.createElement("div");
      f.className = "property", f.innerHTML = "<span class='property_name'></span><span class='property_value'></span>", f.querySelector(".property_name").innerText = u.label || l;
      var d = f.querySelector(".property_value");
      d.innerText = c, f.dataset.property = l, f.dataset.type = u.type || o, f.options = u, f.value = h, (g = LiteGraph.debug) == null || g.call(LiteGraph, "addWidget", o, h, d, u), o == "code" ? f.addEventListener("click", function(G) {
        a.inner_showCodePad(this.dataset.property);
      }) : o == "boolean" ? (f.classList.add("boolean"), h && f.classList.add("bool-on"), f.addEventListener("click", function() {
        var G = this.dataset.property;
        this.value = !this.value, this.classList.toggle("bool-on"), this.querySelector(".property_value").innerText = this.value ? "true" : "false", _(G, this.value);
      })) : o == "string" || o == "number" ? (d.setAttribute("contenteditable", !0), d.addEventListener("keydown", function(G) {
        G.code == "Enter" && (o != "string" || !G.shiftKey) && (G.preventDefault(), this.blur());
      }), d.addEventListener("blur", function() {
        var G = this.innerText, L = this.parentNode.dataset.property, T = this.parentNode.dataset.type;
        T == "number" && (G = Number(G)), _(L, G);
      })) : (o == "enum" || o == "combo") && (c = _LGraphCanvas.getPropertyPrintableValue(h, u.values), d.innerText = c, (m = LiteGraph.debug) == null || m.call(LiteGraph, "addWidget ENUM COMBO", o, c, d, u), d.addEventListener("click", function(G) {
        var L = u.values || [], T = this.parentNode.dataset.property, E = this;
        new LiteGraph.ContextMenu(
          L,
          {
            event: G,
            className: "dark",
            callback: S
          },
          s
        );
        function S(M) {
          return E.innerText = M, _(T, M), !1;
        }
      })), a.content.appendChild(f);
      function _(G, L) {
        var T;
        (T = LiteGraph.debug) == null || T.call(LiteGraph, "widgetInnerChange", G, L, u), u.callback && u.callback(G, L, u), p && p(G, L, u);
      }
      return f;
    }, a.onOpen && typeof a.onOpen == "function" && a.onOpen(), a;
  }
  static getPropertyPrintableValue(r, t) {
    if (!t || t.constructor === Array)
      return String(r);
    if (t.constructor === Object) {
      var s = "";
      for (var a in t)
        if (t[a] == r) {
          s = a;
          break;
        }
      return String(r) + " (" + s + ")";
    }
  }
  closePanels() {
    var r = document.querySelector("#node-panel");
    r && r.close(), r = document.querySelector("#option-panel"), r && r.close();
  }
  showShowGraphOptionsPanel(r, t) {
    var o, l, h, u;
    let s;
    if (this.constructor && this.constructor.name == "HTMLDivElement") {
      if (!((l = (o = t == null ? void 0 : t.event) == null ? void 0 : o.target) != null && l.lgraphcanvas)) {
        (h = LiteGraph.warn) == null || h.call(LiteGraph, "References not found to add optionPanel", r, t), LiteGraph.debug && ((u = LiteGraph.debug) == null || u.call(LiteGraph, "!obEv || !obEv.event || !obEv.event.target || !obEv.event.target.lgraphcanvas", t, t.event, t.event.target, t.event.target.lgraphcanvas));
        return;
      }
      s = t.event.target.lgraphcanvas;
    } else
      s = this;
    s.closePanels();
    var a = s.getCanvasWindow();
    panel = s.createPanel("Options", {
      closable: !0,
      window: a,
      onOpen: function() {
        s.OPTIONPANEL_IS_OPEN = !0;
      },
      onClose: function() {
        s.OPTIONPANEL_IS_OPEN = !1, s.options_panel = null;
      }
    }), s.options_panel = panel, panel.id = "option-panel", panel.classList.add("settings");
    function n() {
      panel.content.innerHTML = "";
      const p = (_, g, m) => {
        m && m.key && (_ = m.key), m.values && (g = Object.values(m.values).indexOf(g)), s[_] = g;
      };
      var c = LiteGraph.availableCanvasOptions;
      c.sort();
      for (var f in c) {
        var d = c[f];
        panel.addWidget("boolean", d, s[d], { key: d, on: "True", off: "False" }, p);
      }
      panel.addWidget("combo", "Render mode", LiteGraph.LINK_RENDER_MODES[s.links_render_mode], { key: "links_render_mode", values: LiteGraph.LINK_RENDER_MODES }, p), panel.addSeparator(), panel.footer.innerHTML = "";
    }
    n(), s.canvas.parentNode.appendChild(panel);
  }
  showShowNodePanel(r) {
    this.SELECTED_NODE = r, this.closePanels();
    var t = this.getCanvasWindow(), s = this, a = this.createPanel(r.title || "", {
      closable: !0,
      window: t,
      onOpen: function() {
        s.NODEPANEL_IS_OPEN = !0;
      },
      onClose: function() {
        s.NODEPANEL_IS_OPEN = !1, s.node_panel = null;
      }
    });
    s.node_panel = a, a.id = "node-panel", a.node = r, a.classList.add("settings");
    function n() {
      a.content.innerHTML = "", a.addHTML("<span class='node_type'>" + r.type + "</span><span class='node_desc'>" + (r.constructor.desc || "") + "</span><span class='separator'></span>"), a.addHTML("<h3>Properties</h3>");
      const o = (c, f) => {
        var _, g;
        switch (s.graph.beforeChange(r), c) {
          case "Title":
            r.title = f;
            break;
          case "Mode":
            var d = Object.values(LiteGraph.NODE_MODES).indexOf(f);
            d >= 0 && LiteGraph.NODE_MODES[d] ? r.changeMode(d) : (_ = LiteGraph.warn) == null || _.call(LiteGraph, "unexpected mode: " + f);
            break;
          case "Color":
            _LGraphCanvas.node_colors[f] ? (r.color = _LGraphCanvas.node_colors[f].color, r.bgcolor = _LGraphCanvas.node_colors[f].bgcolor) : (g = LiteGraph.warn) == null || g.call(LiteGraph, "unexpected color: " + f);
            break;
          default:
            r.setProperty(c, f);
            break;
        }
        s.graph.afterChange(), s.dirty_canvas = !0;
      };
      a.addWidget("string", "Title", r.title, {}, o), a.addWidget("combo", "Mode", LiteGraph.NODE_MODES[r.mode], { values: LiteGraph.NODE_MODES }, o);
      var l = "";
      r.color !== void 0 && (l = Object.keys(_LGraphCanvas.node_colors).filter(function(c) {
        return _LGraphCanvas.node_colors[c].color == r.color;
      })), a.addWidget("combo", "Color", l, { values: Object.keys(_LGraphCanvas.node_colors) }, o);
      for (var h in r.properties) {
        var u = r.properties[h], p = r.getPropertyInfo(h);
        r.onAddPropertyToPanel && r.onAddPropertyToPanel(h, a, u, p, o) || a.addWidget(p.widget || p.type, h, u, p, o);
      }
      a.addSeparator(), r.onShowCustomPanelInfo && r.onShowCustomPanelInfo(a), a.footer.innerHTML = "", a.addButton("Delete", function() {
        r.block_delete || (r.graph.remove(r), a.close());
      }).classList.add("delete");
    }
    a.inner_showCodePad = function(o) {
      a.classList.remove("settings"), a.classList.add("centered"), a.alt_content.innerHTML = "<textarea class='code'></textarea>";
      var l = a.alt_content.querySelector("textarea"), h = () => {
        a.toggleAltContent(!1), a.toggleFooterVisibility(!0), l.parentNode.removeChild(l), a.classList.add("settings"), a.classList.remove("centered"), n();
      };
      l.value = r.properties[o], l.addEventListener("keydown", function(c) {
        c.code == "Enter" && c.ctrlKey && (r.setProperty(o, l.value), h());
      }), a.toggleAltContent(!0), a.toggleFooterVisibility(!1), l.style.height = "calc(100% - 40px)";
      var u = a.addButton("Assign", function() {
        r.setProperty(o, l.value), h();
      });
      a.alt_content.appendChild(u);
      var p = a.addButton("Close", h);
      p.style.float = "right", a.alt_content.appendChild(p);
    }, n(), this.canvas.parentNode.appendChild(a);
  }
  showSubgraphPropertiesDialog(r) {
    var l;
    (l = LiteGraph.log) == null || l.call(LiteGraph, "showing subgraph properties dialog");
    var t = this.canvas.parentNode.querySelector(".subgraph_dialog");
    t && t.close();
    var s = this.createPanel("Subgraph Inputs", { closable: !0, width: 500 });
    s.node = r, s.classList.add("subgraph_dialog");
    function a() {
      if (s.clear(), r.inputs)
        for (let c = 0; c < r.inputs.length; ++c) {
          var h = r.inputs[c];
          if (!h.not_subgraph_input) {
            var u = "<button>&#10005;</button> <span class='bullet_icon'></span><span class='name'></span><span class='type'></span>", p = s.addHTML(u, "subgraph_property");
            p.dataset.name = h.name, p.dataset.slot = c, p.querySelector(".name").innerText = h.name, p.querySelector(".type").innerText = h.type, p.querySelector("button").addEventListener("click", function(f) {
              r.removeInput(Number(this.parentNode.dataset.slot)), a();
            });
          }
        }
    }
    var n = " + <span class='label'>Name</span><input class='name'/><span class='label'>Type</span><input class='type'></input><button>+</button>", o = s.addHTML(n, "subgraph_property extra", !0);
    return o.querySelector("button").addEventListener("click", function(h) {
      var u = this.parentNode, p = u.querySelector(".name").value, c = u.querySelector(".type").value;
      !p || r.findInputSlot(p) != -1 || (r.addInput(p, c), u.querySelector(".name").value = "", u.querySelector(".type").value = "", a());
    }), a(), this.canvas.parentNode.appendChild(s), s;
  }
  showSubgraphPropertiesDialogRight(r) {
    var t = this.canvas.parentNode.querySelector(".subgraph_dialog");
    t && t.close();
    var s = this.createPanel("Subgraph Outputs", { closable: !0, width: 500 });
    s.node = r, s.classList.add("subgraph_dialog");
    function a() {
      if (s.clear(), r.outputs)
        for (let c = 0; c < r.outputs.length; ++c) {
          var h = r.outputs[c];
          if (!h.not_subgraph_output) {
            var u = "<button>&#10005;</button> <span class='bullet_icon'></span><span class='name'></span><span class='type'></span>", p = s.addHTML(u, "subgraph_property");
            p.dataset.name = h.name, p.dataset.slot = c, p.querySelector(".name").innerText = h.name, p.querySelector(".type").innerText = h.type, p.querySelector("button").addEventListener("click", function(f) {
              r.removeOutput(Number(this.parentNode.dataset.slot)), a();
            });
          }
        }
    }
    var n = " + <span class='label'>Name</span><input class='name'/><span class='label'>Type</span><input class='type'></input><button>+</button>", o = s.addHTML(n, "subgraph_property extra", !0);
    o.querySelector(".name").addEventListener("keydown", function(h) {
      e.keyCode == 13 && l.apply(this);
    }), o.querySelector("button").addEventListener("click", function(h) {
      l.apply(this);
    });
    function l() {
      var h = this.parentNode, u = h.querySelector(".name").value, p = h.querySelector(".type").value;
      !u || r.findOutputSlot(u) != -1 || (r.addOutput(u, p), h.querySelector(".name").value = "", h.querySelector(".type").value = "", a());
    }
    return a(), this.canvas.parentNode.appendChild(s), s;
  }
  checkPanels() {
    if (this.canvas) {
      var r = this.canvas.parentNode.querySelectorAll(".litegraph.dialog");
      for (let s = 0; s < r.length; ++s) {
        var t = r[s];
        t.node && (!t.node.graph || t.graph != this.graph) && t.close();
      }
    }
  }
  static onMenuNodeCollapse(r, t, s, a, n) {
    n.graph.beforeChange(
      /* ?*/
    );
    var o = function(h) {
      h.collapse();
    }, l = _LGraphCanvas.active_canvas;
    if (!l.selected_nodes || Object.keys(l.selected_nodes).length <= 1)
      o(n);
    else
      for (let h in l.selected_nodes)
        o(l.selected_nodes[h]);
    n.graph.afterChange(
      /* ?*/
    );
  }
  static onMenuNodePin(r, t, s, a, n) {
    n.pin();
  }
  static onMenuNodeMode(r, t, s, a, n) {
    new LiteGraph.ContextMenu(
      LiteGraph.NODE_MODES,
      { event: s, callback: o, parentMenu: a, node: n }
    );
    function o(l) {
      if (!n)
        return;
      var h = Object.values(LiteGraph.NODE_MODES).indexOf(l);
      const u = (c) => {
        var f;
        h >= 0 && LiteGraph.NODE_MODES[h] ? c.changeMode(h) : ((f = LiteGraph.warn) == null || f.call(LiteGraph, "unexpected mode: " + l), c.changeMode(LiteGraph.ALWAYS));
      };
      var p = _LGraphCanvas.active_canvas;
      if (!p.selected_nodes || Object.keys(p.selected_nodes).length <= 1)
        u(n);
      else
        for (let c in p.selected_nodes)
          u(p.selected_nodes[c]);
    }
    return !1;
  }
  static onMenuNodeColors(r, t, s, a, n) {
    if (!n)
      throw new Error("no node for color");
    var o = [];
    o.push({
      value: null,
      content: "<span style='display: block; padding-left: 4px;'>No color</span>"
    });
    for (let h in _LGraphCanvas.node_colors) {
      let u = _LGraphCanvas.node_colors[h];
      r = {
        value: h,
        content: "<span style='display: block; color: #999; padding-left: 4px; border-left: 8px solid " + u.color + "; background-color:" + u.bgcolor + "'>" + h + "</span>"
      }, o.push(r);
    }
    new LiteGraph.ContextMenu(o, {
      event: s,
      callback: l,
      parentMenu: a,
      node: n
    });
    function l(h) {
      if (!n)
        return;
      let u = h.value ? _LGraphCanvas.node_colors[h.value] : null;
      const p = (f) => {
        u ? f.constructor === LiteGraph.LGraphGroup ? f.color = u.groupcolor : (f.color = u.color, f.bgcolor = u.bgcolor) : (delete f.color, delete f.bgcolor);
      };
      var c = _LGraphCanvas.active_canvas;
      if (!c.selected_nodes || Object.keys(c.selected_nodes).length <= 1)
        p(n);
      else
        for (let f in c.selected_nodes)
          p(c.selected_nodes[f]);
      n.setDirtyCanvas(!0, !0);
    }
    return !1;
  }
  static onMenuNodeShapes(r, t, s, a, n) {
    if (!n)
      throw new Error("no node passed");
    new LiteGraph.ContextMenu(LiteGraph.VALID_SHAPES, {
      event: s,
      callback: o,
      parentMenu: a,
      node: n
    });
    function o(l) {
      if (!n)
        return;
      n.graph.beforeChange(
        /* ?*/
      );
      const h = (p) => {
        p.shape = l;
      };
      var u = _LGraphCanvas.active_canvas;
      if (!u.selected_nodes || Object.keys(u.selected_nodes).length <= 1)
        h(n);
      else
        for (let p in u.selected_nodes)
          h(u.selected_nodes[p]);
      n.graph.afterChange(
        /* ?*/
      ), n.setDirtyCanvas(!0);
    }
    return !1;
  }
  static onMenuNodeRemove(r, t, s, a, n) {
    if (!n)
      throw new Error("no node passed");
    var o = n.graph;
    o.beforeChange();
    const l = (u) => {
      u.removable !== !1 && o.remove(u);
    };
    var h = _LGraphCanvas.active_canvas;
    if (!h.selected_nodes || Object.keys(h.selected_nodes).length <= 1)
      l(n);
    else
      for (let u in h.selected_nodes)
        l(h.selected_nodes[u]);
    o.afterChange(), n.setDirtyCanvas(!0, !0);
  }
  static onMenuNodeToSubgraph(r, t, s, a, n) {
    var o = n.graph, l = _LGraphCanvas.active_canvas;
    if (l) {
      var h = Object.values(l.selected_nodes || {});
      h.length || (h = [n]);
      var u = LiteGraph.createNode("graph/subgraph");
      u.pos = n.pos.concat(), o.add(u), u.buildFromNodes(h), l.deselectAllNodes(), n.setDirtyCanvas(!0, !0);
    }
  }
  static onMenuNodeClone(r, t, s, a, n) {
    n.graph.beforeChange();
    var o = {};
    const l = (u) => {
      if (u.clonable !== !1) {
        var p = u.clone();
        p && (p.pos = [u.pos[0] + 5, u.pos[1] + 5], u.graph.add(p), o[p.id] = p);
      }
    };
    var h = _LGraphCanvas.active_canvas;
    if (!h.selected_nodes || Object.keys(h.selected_nodes).length <= 1)
      l(n);
    else
      for (let u in h.selected_nodes)
        l(h.selected_nodes[u]);
    Object.keys(o).length && h.selectNodes(o), n.graph.afterChange(), n.setDirtyCanvas(!0, !0);
  }
  getCanvasMenuOptions() {
    var r = null;
    if (this.getMenuOptions ? r = this.getMenuOptions() : (r = [
      {
        content: "Add Node",
        has_submenu: !0,
        callback: _LGraphCanvas.onMenuAdd
      },
      { content: "Add Group", callback: _LGraphCanvas.onGroupAdd }
      // { content: "Arrange", callback: that.graph.arrange },
      // {content:"Collapse All", callback: LGraphCanvas.onMenuCollapseAll }
    ], LiteGraph.showCanvasOptions && r.push({ content: "Options", callback: this.showShowGraphOptionsPanel }), Object.keys(this.selected_nodes).length > 1 && r.push({
      content: "Align",
      has_submenu: !0,
      callback: _LGraphCanvas.onGroupAlign
    }), this._graph_stack && this._graph_stack.length > 0 && r.push(null, {
      content: "Close subgraph",
      callback: this.closeSubgraph.bind(this)
    })), this.getExtraMenuOptions) {
      var t = this.getExtraMenuOptions(this, r);
      t && (r = r.concat(t));
    }
    return r;
  }
  // called by processContextMenu to extract the menu list
  getNodeMenuOptions(r) {
    var t = null;
    if (r.getMenuOptions ? t = r.getMenuOptions(this) : (t = [
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
    ], r.resizable !== !1 && t.push({
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
    )), r.onGetInputs) {
      var s = r.onGetInputs();
      s && s.length && (t[0].disabled = !1);
    }
    if (r.onGetOutputs) {
      var a = r.onGetOutputs();
      a && a.length && (t[1].disabled = !1);
    }
    if (LiteGraph.do_add_triggers_slots && (t[1].disabled = !1), r.getExtraMenuOptions) {
      var n = r.getExtraMenuOptions(this, t);
      n && (n.push(null), t = n.concat(t));
    }
    return r.clonable !== !1 && t.push({
      content: "Clone",
      callback: _LGraphCanvas.onMenuNodeClone
    }), Object.keys(this.selected_nodes).length > 1 && t.push({
      content: "Align Selected To",
      has_submenu: !0,
      callback: _LGraphCanvas.onNodeAlign
    }), t.push(null, {
      content: "Remove",
      disabled: !(r.removable !== !1 && !r.block_delete),
      callback: _LGraphCanvas.onMenuNodeRemove
    }), r.graph && r.graph.onGetNodeMenuOptions && r.graph.onGetNodeMenuOptions(t, r), t;
  }
  getGroupMenuOptions() {
    var r = [
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
    return r;
  }
  processContextMenu(r, t) {
    var d, _, g;
    var s = this, a = _LGraphCanvas.active_canvas, n = a.getCanvasWindow(), o = null, l = {
      event: t,
      callback: f,
      extra: r
    };
    r && (l.title = r.type);
    var h = null;
    if (r && (h = r.getSlotInPosition(t.canvasX, t.canvasY), _LGraphCanvas.active_node = r), h) {
      if (o = [], r.getSlotMenuOptions)
        o = r.getSlotMenuOptions(h);
      else {
        ((_ = (d = h == null ? void 0 : h.output) == null ? void 0 : d.links) != null && _.length || (g = h.input) != null && g.link) && o.push({ content: "Disconnect Links", slot: h });
        var u = h.input || h.output;
        u.removable && LiteGraph.canRemoveSlots && o.push(u.locked ? "Cannot remove" : { content: "Remove Slot", slot: h }), !u.nameLocked && LiteGraph.canRenameSlots && o.push({ content: "Rename Slot", slot: h });
      }
      var p = h.input || h.output;
      l.title = p.type || "*", p.type == LiteGraph.ACTION ? l.title = "Action" : p.type == LiteGraph.EVENT && (l.title = "Event");
    } else if (r)
      o = this.getNodeMenuOptions(r);
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
    new LiteGraph.ContextMenu(o, l, n);
    function f(m, G) {
      if (!m)
        return;
      let L;
      if (m.content == "Remove Slot") {
        L = m.slot, r.graph.beforeChange(), L.input ? r.removeInput(L.slot) : L.output && r.removeOutput(L.slot), r.graph.afterChange();
        return;
      } else if (m.content == "Disconnect Links") {
        L = m.slot, r.graph.beforeChange(), L.output ? r.disconnectOutput(L.slot) : L.input && r.disconnectInput(L.slot), r.graph.afterChange();
        return;
      } else if (m.content == "Rename Slot") {
        L = m.slot;
        var T = L.input ? r.getInputInfo(L.slot) : r.getOutputInfo(L.slot), E = s.createDialog(
          "<span class='name'>Name</span><input autofocus type='text'/><button>OK</button>",
          G
        ), S = E.querySelector("input");
        S && T && (S.value = T.label || "");
        var M = function() {
          r.graph.beforeChange(), S.value && (T && (T.label = S.value), s.setDirty(!0)), E.close(), r.graph.afterChange();
        };
        E.querySelector("button").addEventListener("click", M), S.addEventListener("keydown", function(R) {
          if (E.is_modified = !0, R.keyCode == 27)
            E.close();
          else if (R.keyCode == 13)
            M();
          else if (R.keyCode != 13 && R.target.localName != "textarea")
            return;
          R.preventDefault(), R.stopPropagation();
        }), S.focus();
      }
    }
  }
  /**
   * returns ture if low qualty rendering requered at requested scale
   * */
  lowQualityRenderingRequired(r) {
    return this.ds.scale < r ? this.low_quality_rendering_counter > this.low_quality_rendering_threshold : !1;
  }
};
b(_LGraphCanvas, "DEFAULT_BACKGROUND_IMAGE", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAIAAAD/gAIDAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQBJREFUeNrs1rEKwjAUhlETUkj3vP9rdmr1Ysammk2w5wdxuLgcMHyptfawuZX4pJSWZTnfnu/lnIe/jNNxHHGNn//HNbbv+4dr6V+11uF527arU7+u63qfa/bnmh8sWLBgwYJlqRf8MEptXPBXJXa37BSl3ixYsGDBMliwFLyCV/DeLIMFCxYsWLBMwSt4Be/NggXLYMGCBUvBK3iNruC9WbBgwYJlsGApeAWv4L1ZBgsWLFiwYJmCV/AK3psFC5bBggULloJX8BpdwXuzYMGCBctgwVLwCl7Be7MMFixYsGDBsu8FH1FaSmExVfAxBa/gvVmwYMGCZbBg/W4vAQYA5tRF9QYlv/QAAAAASUVORK5CYII="), b(_LGraphCanvas, "link_type_colors", {
  "-1": "#A86",
  number: "#AAA",
  node: "#DCA",
  string: "#77F",
  boolean: "#F77"
}), b(_LGraphCanvas, "gradients", {}), // cache of gradients
b(_LGraphCanvas, "search_limit", -1), b(_LGraphCanvas, "node_colors", {
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
  constructor(t, s) {
    b(this, "onMouseDown", (t) => {
      if (!this.enabled)
        return;
      const a = this.element.getBoundingClientRect();
      var n = t.clientX - a.left, o = t.clientY - a.top;
      t.canvasx = n, t.canvasy = o, t.dragging = this.dragging;
      var l = !this.viewport || this.viewport && n >= this.viewport[0] && n < this.viewport[0] + this.viewport[2] && o >= this.viewport[1] && o < this.viewport[1] + this.viewport[3];
      l && (this.dragging = !0, this.abortController = new AbortController(), document.addEventListener("pointermove", this.onMouseMove, { signal: this.abortController.signal }), document.addEventListener("pointerup", this.onMouseUp, { signal: this.abortController.signal })), this.last_mouse[0] = n, this.last_mouse[1] = o;
    });
    b(this, "onMouseMove", (t) => {
      if (!this.enabled)
        return;
      const a = this.element.getBoundingClientRect();
      var n = t.clientX - a.left, o = t.clientY - a.top;
      t.canvasx = n, t.canvasy = o, t.dragging = this.dragging;
      var l = n - this.last_mouse[0], h = o - this.last_mouse[1];
      this.dragging && this.mouseDrag(l, h), this.last_mouse[0] = n, this.last_mouse[1] = o;
    });
    b(this, "onMouseUp", (t) => {
      var s;
      this.dragging = !1, (s = this.abortController) == null || s.abort();
    });
    b(this, "onWheel", (t) => {
      t.wheel = -t.deltaY, t.delta = t.wheelDelta ? t.wheelDelta / 40 : t.deltaY ? -t.deltaY / 3 : 0, this.changeDeltaScale(1 + t.delta * 0.05);
    });
    this.offset = new Float32Array([0, 0]), this.scale = 1, this.max_scale = 10, this.min_scale = 0.1, this.onredraw = null, this.enabled = !0, this.last_mouse = [0, 0], this.element = null, this.visible_area = new Float32Array(4), t && (this.element = t, s || this.bindEvents(t));
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
    let s = this.element.width, a = this.element.height, n = -this.offset[0], o = -this.offset[1];
    if (t) {
      n += t[0] / this.scale, o += t[1] / this.scale;
      const [u, p] = t.slice(2);
      s = u, a = p;
    }
    const l = n + s / this.scale, h = o + a / this.scale;
    this.visible_area.set([n, o, l - n, h - o]);
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
  convertCanvasToOffset(t, s = [0, 0]) {
    return s[0] = t[0] / this.scale - this.offset[0], s[1] = t[1] / this.scale - this.offset[1], s;
  }
  mouseDrag(t, s) {
    var a;
    this.offset[0] += t / this.scale, this.offset[1] += s / this.scale, (a = this.onredraw) == null || a.call(this, this);
  }
  /**
   * Changes the scale of the DragAndScale element to the specified value around the zooming center.
   *
   * @param {number} value - The new scale value to set, clamped between min_scale and max_scale.
   * @param {Array<number>} zooming_center - The center point for zooming, defaulting to the middle of the element.
   */
  changeScale(t, s) {
    var h;
    if (t = LiteGraph.clamp(t, this.min_scale, this.max_scale), t == this.scale || !this.element)
      return;
    const a = this.element.getBoundingClientRect();
    if (a) {
      s = s || [
        a.width * 0.5,
        a.height * 0.5
      ];
      var n = this.convertCanvasToOffset(s);
      this.scale = t, Math.abs(this.scale - 1) < 0.01 && (this.scale = 1);
      var o = this.convertCanvasToOffset(s), l = [
        o[0] - n[0],
        o[1] - n[1]
      ];
      this.offset[0] += l[0], this.offset[1] += l[1], (h = this.onredraw) == null || h.call(this, this);
    }
  }
  /**
   * Changes the scale of the DragAndScale element by a delta value relative to the current scale.
   *
   * @param {number} value - The delta value by which to scale the element.
   * @param {Array<number>} zooming_center - The center point for zooming the element.
   */
  changeDeltaScale(t, s) {
    this.changeScale(this.scale * t, s);
  }
  reset() {
    this.scale = 1, this.offset[0] = 0, this.offset[1] = 0;
  }
}
var j, dt, ft, gt, _t, vt, bt;
const ot = class ot {
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
  constructor(t, s = {}) {
    ct(this, j);
    var a;
    this.options = s, (a = s.scroll_speed) != null || (s.scroll_speed = 0.1), this.menu_elements = [], st(this, j, gt).call(this), st(this, j, _t).call(this), st(this, j, dt).call(this), st(this, j, ft).call(this), this.setTitle(this.options.title), this.addItems(t), st(this, j, vt).call(this), st(this, j, bt).call(this);
  }
  /**
   * Creates a title element if it doesn't have one.
   * Sets the title of the menu.
   * @param {string} title - The title to be set.
   */
  setTitle(t) {
    var a;
    if (!t)
      return;
    (a = this.titleElement) != null || (this.titleElement = document.createElement("div"));
    const s = this.titleElement;
    s.className = "litemenu-title", s.innerHTML = t, this.root.parentElement || this.root.appendChild(s);
  }
  /**
   * Adds a set of values to the menu.
   * @param {Array<string|object>} values - An array of values to be added.
   */
  addItems(t) {
    for (let s = 0; s < t.length; s++) {
      let a = t[s];
      typeof a != "string" && (a = a && a.content !== void 0 ? String(a.content) : String(a));
      let n = t[s];
      this.menu_elements.push(this.addItem(a, n, this.options));
    }
  }
  /**
   * Adds an item to the menu.
   * @param {string} name - The name of the item.
   * @param {object | null} value - The value associated with the item.
   * @param {object} [options={}] - Additional options for the item.
   * @returns {HTMLElement} - The created HTML element representing the added item.
   */
  addItem(t, s, a = {}) {
    var u;
    const n = document.createElement("div");
    n.className = "litemenu-entry submenu";
    let o = !1;
    s === null ? n.classList.add("separator") : (n.innerHTML = (u = s == null ? void 0 : s.title) != null ? u : t, n.value = s, s && (s.disabled && (o = !0, n.classList.add("disabled")), (s.submenu || s.has_submenu) && n.classList.add("has_submenu")), typeof s == "function" ? (n.dataset.value = t, n.onclick_callback = s) : n.dataset.value = s, s.className && (n.className += " " + s.className)), this.root.appendChild(n), o || n.addEventListener("click", h), !o && a.autoopen && n.addEventListener("pointerenter", (p) => {
      const c = this.value;
      !c || !c.has_submenu || h.call(this, p);
    });
    var l = this;
    function h(p) {
      var d, _, g, m, G;
      const c = this.value;
      let f = !0;
      if ((d = LiteGraph.debug) == null || d.call(LiteGraph, "ContextMenu handleMenuItemClick", c, a, f, this.current_submenu, this), (_ = l.current_submenu) == null || _.close(p), a.callback && ((g = LiteGraph.debug) == null || g.call(LiteGraph, "ContextMenu handleMenuItemClick callback", this, c, a, p, l, a.node), a.callback.call(this, c, a, p, l, a.node) === !0 && (f = !1)), c && (c.callback && !a.ignore_item_callbacks && c.disabled !== !0 && ((m = LiteGraph.debug) == null || m.call(LiteGraph, "ContextMenu using value callback and !ignore_item_callbacks", this, c, a, p, l, a.node), c.callback.call(this, c, a, p, l, a.extra) === !0 && (f = !1)), c.submenu)) {
        if ((G = LiteGraph.debug) == null || G.call(LiteGraph, "ContextMenu SUBMENU", this, c, c.submenu.options, e, l, a), !c.submenu.options)
          throw new Error("ContextMenu submenu needs options");
        new l.constructor(c.submenu.options, {
          callback: c.submenu.callback,
          event: p,
          parentMenu: l,
          ignore_item_callbacks: c.submenu.ignore_item_callbacks,
          title: c.submenu.title,
          extra: c.submenu.extra,
          autoopen: a.autoopen
        }), f = !1;
      }
      f && !l.lock && l.close();
    }
    return n;
  }
  /**
   * Closes this menu.
   * @param {Event} [e] - The event that triggered the close action.
   * @param {boolean} [ignore_parent_menu=false] - Whether to ignore the parent menu when closing.
   */
  close(t, s) {
    var a;
    if (this.root.f_textfilter) {
      let n = document;
      n.removeEventListener("keydown", this.root.f_textfilter, !0), n.removeEventListener("keydown", this.root.f_textfilter, !1), t && t.target && (n = t.target.ownerDocument), n || (n = document), n.removeEventListener("keydown", this.root.f_textfilter, !0), n.removeEventListener("keydown", this.root.f_textfilter, !1);
    }
    this.parentMenu && !s && (this.parentMenu.lock = !1, this.parentMenu.current_submenu = null, t === void 0 ? this.parentMenu.close() : t && !ot.isCursorOverElement(t, this.parentMenu.root) && ot.trigger(this.parentMenu.root, "pointerleave", t)), (a = this.current_submenu) == null || a.close(t, !0), this.root.closing_timer && clearTimeout(this.root.closing_timer), this.root.parentNode && this.root.parentNode.removeChild(this.root);
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
  static trigger(t, s, a, n) {
    const o = new CustomEvent(s, {
      bubbles: !0,
      cancelable: !0,
      detail: a
    });
    return Object.defineProperty(o, "target", { value: n }), t.dispatchEvent ? t.dispatchEvent(o) : t.__events && t.__events.dispatchEvent(o), o;
  }
  // returns the top most menu
  getTopMenu() {
    var t, s;
    return (s = (t = this.options.parentMenu) == null ? void 0 : t.getTopMenu()) != null ? s : this;
  }
  getFirstEvent() {
    var t, s;
    return (s = (t = this.options.parentMenu) == null ? void 0 : t.getFirstEvent()) != null ? s : this.options.event;
  }
  static isCursorOverElement(t, s) {
    return LiteGraph.isInsideRectangle(t.clientX, t.clientY, s.left, s.top, s.width, s.height);
  }
};
j = new WeakSet(), dt = function() {
  const t = this.root = document.createElement("div");
  return this.options.className && (t.className = this.options.className), t.classList.add("litegraph", "litecontextmenu", "litemenubar-panel"), t.style.minWidth = "80px", t.style.minHeight = "10px", t;
}, ft = function() {
  const t = this.root;
  t.style.pointerEvents = "none", setTimeout(() => {
    t.style.pointerEvents = "auto";
  }, 100), t.addEventListener("pointerup", (s) => (s.preventDefault(), !0)), t.addEventListener("contextmenu", (s) => (s.button != 2 || s.preventDefault(), !1)), t.addEventListener("pointerdown", (s) => {
    if (s.button == 2)
      return this.close(), s.preventDefault(), !0;
  }), t.addEventListener("wheel", (s) => {
    var a = parseInt(t.style.top);
    return t.style.top = (a + s.deltaY * this.options.scroll_speed).toFixed() + "px", s.preventDefault(), !0;
  }), t.addEventListener("pointerenter", (s) => {
    t.closing_timer && clearTimeout(t.closing_timer);
  });
}, gt = function() {
  var s;
  const t = this.options.parentMenu;
  if (t) {
    if (t.constructor !== this.constructor) {
      (s = LiteGraph.error) == null || s.call(LiteGraph, "parentMenu must be of class ContextMenu, ignoring it"), this.options.parentMenu = null;
      return;
    }
    this.parentMenu = t, this.parentMenu.lock = !0, this.parentMenu.current_submenu = this;
  }
}, _t = function() {
  var s;
  if (!this.options.event)
    return;
  const t = this.options.event.constructor.name;
  t !== "MouseEvent" && t !== "CustomEvent" && t !== "PointerEvent" && ((s = LiteGraph.error) == null || s.call(LiteGraph, `Event passed to ContextMenu is not of type MouseEvent or CustomEvent. Ignoring it. (${t})`), this.options.event = null);
}, vt = function() {
  var o, l, h, u;
  const t = (l = (o = this.options.event) == null ? void 0 : o.target.ownerDocument) != null ? l : document, s = (h = t.fullscreenElement) != null ? h : t.body, a = this.root, n = this;
  LiteGraph.context_menu_filter_enabled && (t ? (a.f_textfilter && (t.removeEventListener("keydown", a.f_textfilter, !1), t.removeEventListener("keydown", a.f_textfilter, !0), a.f_textfilter = !1), a.f_textfilter = function(p) {
    var M, R, D, C, N, A, O;
    if (n.current_submenu) {
      (M = LiteGraph.debug) == null || M.call(LiteGraph, "Prevent filtering on ParentMenu", n);
      return;
    }
    if (n.allOptions || (n.allOptions = n.menu_elements, n.selectedOption = !1), n.currentOptions || (n.currentOptions = n.allOptions), n.filteringText || (n.filteringText = ""), p.key) {
      var c = !1;
      switch (p.key) {
        case "Backspace":
          n.filteringText.length && (n.filteringText = n.filteringText.substring(0, n.filteringText.length - 1), c = !0);
          break;
        case "Escape":
          a.f_textfilter && (t.removeEventListener("keydown", a.f_textfilter, !1), t.removeEventListener("keydown", a.f_textfilter, !0), a.f_textfilter = !1), n.close();
          break;
        case "ArrowDown":
          do
            n.selectedOption = n.selectedOption !== !1 ? Math.min(Math.max(n.selectedOption + 1, 0), n.allOptions.length - 1) : 0;
          while (n.allOptions[n.selectedOption] && n.allOptions[n.selectedOption].hidden && n.selectedOption < n.allOptions.length - 1);
          n.allOptions[n.selectedOption] && n.allOptions[n.selectedOption].hidden && (n.selectedOption = n.currentOptions[n.currentOptions.length - 1].menu_index), c = !0;
          break;
        case "ArrowUp":
          do
            n.selectedOption = n.selectedOption !== !1 ? Math.min(Math.max(n.selectedOption - 1, 0), n.allOptions.length - 1) : 0;
          while (n.allOptions[n.selectedOption] && n.allOptions[n.selectedOption].hidden && n.selectedOption > 0);
          n.allOptions[n.selectedOption] && n.allOptions[n.selectedOption].hidden && (n.currentOptions && n.currentOptions.length ? n.selectedOption = n.currentOptions[0].menu_index : n.selectedOption = !1), c = !0;
          break;
        case "ArrowLeft":
          break;
        case "ArrowRight":
        // right do same as enter
        case "Enter":
          if (n.selectedOption !== !1)
            n.allOptions[n.selectedOption] ? ((R = LiteGraph.debug) == null || R.call(LiteGraph, "ContextElement simCLICK", n.allOptions[iO]), n.allOptions[n.selectedOption].do_click && n.allOptions[n.selectedOption].do_click(n.options.event, f)) : ((D = LiteGraph.debug) == null || D.call(LiteGraph, "ContextElement selection wrong", n.selectedOption), n.selectedOption = n.selectedOption !== !1 ? Math.min(Math.max(n.selectedOption, 0), n.allOptions.length - 1) : 0);
          else if (n.filteringText.length) {
            for (let I in n.allOptions)
              if (n.allOptions[I].style.display !== "none" && !(n.allOptions[I].classList + "").includes("separator") && n.allOptions[I].textContent !== "Search") {
                (C = LiteGraph.debug) == null || C.call(LiteGraph, "ContextElement simCLICK", n.allOptions[I]), a.f_textfilter && t && (t.removeEventListener("keydown", a.f_textfilter, !1), t.removeEventListener("keydown", a.f_textfilter, !0), (N = LiteGraph.debug) == null || N.call(LiteGraph, "Cleaned ParentContextMenu listener", t, n));
                var f = !1;
                n.allOptions[I].do_click(p, f);
                break;
              }
          }
          c = !0;
          break;
        default:
          (A = LiteGraph.debug) == null || A.call(LiteGraph, "ContextMenu filter: keyEvent", p.keyCode, p.key), String.fromCharCode(p.key).match(/(\w|\s)/g);
          break;
      }
      !c && p.key.length == 1 && (n.filteringText += p.key, n.parentMenu);
    }
    if (n.filteringText && n.filteringText !== "") {
      var d = [];
      n.currentOptions = [];
      for (let I in n.allOptions) {
        var _ = n.allOptions[I].textContent, g = _.toLocaleLowerCase().includes(n.filteringText.toLocaleLowerCase()), m = _.toLocaleLowerCase().startsWith(n.filteringText.toLocaleLowerCase()), G = _.split("/"), L = !1;
        L = G.length > 1 && G[G.length - 1].toLocaleLowerCase().startsWith(n.filteringText.toLocaleLowerCase()) || G.length == 1 && m;
        var T = (n.allOptions[I].classList + "").includes("separator") || _ === "Search";
        n.allOptions[I].menu_index = I, g && !T ? (d.push(n.allOptions[I]), n.allOptions[I].style.display = "block", n.allOptions[I].hidden = !1, n.currentOptions.push(n.allOptions[I]), n.allOptions[I].filtered_index = n.currentOptions.length - 1) : (n.allOptions[I].hidden = !0, n.allOptions[I].style.display = "none", n.allOptions[I].filtered_index = !1), L ? n.allOptions[I].style.fontWeight = "bold" : m && (n.allOptions[I].style.fontStyle = "italic");
      }
      n.selectedOption = n.selectedOption !== !1 ? Math.min(Math.max(n.selectedOption, 0), n.allOptions.length - 1) : 0, n.allOptions[n.selectedOption] && n.allOptions[n.selectedOption].hidden && n.currentOptions.length && (n.selectedOption = n.currentOptions[0].menu_index);
    } else {
      d = n.allOptions, n.currentOptions = n.allOptions;
      for (let I in n.allOptions)
        n.allOptions[I].style.display = "block", n.allOptions[I].style.fontStyle = "inherit", n.allOptions[I].style.fontWeight = "inherit", n.allOptions[I].hidden = !1, n.allOptions[I].filtered_index = !1, n.allOptions[I].menu_index = I;
    }
    var E = n.selectedOption !== !1;
    if (E) {
      (O = LiteGraph.debug) == null || O.call(LiteGraph, "ContextMenu selection: ", n.selectedOption);
      for (let I in n.allOptions) {
        var S = n.selectedOption + "" == I + "";
        S ? n.allOptions[I].classList.add("selected") : n.allOptions[I].classList.remove("selected");
      }
    }
    document.body.getBoundingClientRect(), a.getBoundingClientRect(), a.style.top = n.top_original + "px";
  }, t.addEventListener(
    "keydown",
    a.f_textfilter,
    !0
  )) : (u = LiteGraph.warn) == null || u.call(LiteGraph, "NO root document to add context menu and event", t, options)), s.appendChild(this.root);
}, bt = function() {
  var o;
  const t = this.options, s = this.root;
  let a = t.left || 0, n = t.top || 0;
  if (this.top_original = n, t.event) {
    if (a = t.event.clientX - 10, n = t.event.clientY - 10, t.title && (n -= 20), this.top_original = n, t.parentMenu) {
      const u = t.parentMenu.root.getBoundingClientRect();
      a = u.left + u.width;
    }
    const l = document.body.getBoundingClientRect(), h = s.getBoundingClientRect();
    l.height === 0 && ((o = LiteGraph.error) == null || o.call(LiteGraph, "document.body height is 0. That is dangerous, set html,body { height: 100%; }")), l.width && a > l.width - h.width - 10 && (a = l.width - h.width - 10), l.height && n > l.height - h.height - 10 && (n = l.height - h.height - 10);
  }
  s.style.left = `${a}px`, s.style.top = `${n}px`, t.scale && (s.style.transform = `scale(${t.scale})`);
}, /**
 * Closes all open ContextMenus in the specified window.
 * @param {Window} [ref_window=window] - The window object to search for open menus.
 */
b(ot, "closeAll", (t = window) => {
  const s = t.document.querySelectorAll(".litecontextmenu");
  s.length && s.forEach((a) => {
    var n;
    a.close ? a.close() : (n = a.parentNode) == null || n.removeChild(a);
  });
});
let ContextMenu = ot;
var LiteGraph = new class {
  constructor() {
    b(this, "extendClass", (r, t) => {
      for (let s in t)
        r.hasOwnProperty(s) || (r[s] = t[s]);
      if (t.prototype)
        for (let s in t.prototype)
          t.prototype.hasOwnProperty(s) && (r.prototype.hasOwnProperty(s) || (t.prototype.__lookupGetter__(s) ? r.prototype.__defineGetter__(
            s,
            t.prototype.__lookupGetter__(s)
          ) : r.prototype[s] = t.prototype[s], t.prototype.__lookupSetter__(s) && r.prototype.__defineSetter__(
            s,
            t.prototype.__lookupSetter__(s)
          )));
    });
    // used to create nodes from wrapping functions
    b(this, "getParameterNames", (r) => (r + "").replace(/[/][/].*$/gm, "").replace(/\s+/g, "").replace(/[/][*][^/*]*[*][/]/g, "").split("){", 1)[0].replace(/^[^(]*[(]/, "").replace(/=[^,]+/g, "").split(",").filter(Boolean));
    b(this, "clamp", (r, t, s) => t > r ? t : s < r ? s : r);
    // @BUG: Re-add these
    b(this, "pointerAddListener", () => {
      var r;
      (r = console.error) == null || r.call(console, "Removed and being re-integrated sorta");
    });
    b(this, "pointerRemoveListener", () => {
      var r;
      (r = console.error) == null || r.call(console, "Removed and being re-integrated sorta");
    });
    b(this, "closeAllContextMenus", () => {
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
  logging_set_level(r) {
    this.debug_level = Number(r);
  }
  // entrypoint to debug log
  logging(r) {
    if (r > this.debug_level)
      return;
    function t(a) {
      let n = [];
      for (let o = 1; o < a.length; o++)
        typeof a[o] != "undefined" && n.push(a[o]);
      return n;
    }
    let s = "debug";
    if (r >= 0 && r <= 4 && (s = ["error", "warn", "info", "log", "debug"][r]), typeof console[s] != "function")
      throw console.warn("[LG-log] invalid console method", s, t(arguments)), new RangeError();
    console[s]("[LG]", ...t(arguments));
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
  registerNodeType(r, t) {
    var u, p, c, f, d, _, g;
    if (!t.prototype)
      throw new Error("Cannot register a simple object, it must be a class with a prototype");
    t.type = r, (u = this.debug) == null || u.call(this, "registerNodeType", "start", r);
    const s = t.name, a = r.lastIndexOf("/");
    t.category = r.substring(0, a), t.title || (t.title = s);
    const n = Object.getOwnPropertyDescriptors(LGraphNode.prototype);
    Object.keys(n).forEach((m) => {
      t.prototype.hasOwnProperty(m) || Object.defineProperty(t.prototype, m, n[m]);
    });
    const o = this.registered_node_types[r];
    if (o && ((p = this.debug) == null || p.call(this, "registerNodeType", "replacing node type", r, o)), !Object.prototype.hasOwnProperty.call(t.prototype, "shape") && (Object.defineProperty(t.prototype, "shape", {
      set: function(m) {
        switch (m) {
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
            this._shape = m;
        }
      },
      get: function() {
        return this._shape;
      },
      enumerable: !0,
      configurable: !0
    }), t.supported_extensions))
      for (let m in t.supported_extensions) {
        const G = t.supported_extensions[m];
        G && G.constructor === String && (this.node_types_by_file_extension[G.toLowerCase()] = t);
      }
    if (this.registered_node_types[r] = t, t.constructor.name && (this.Nodes[s] = t), (c = LiteGraph.onNodeTypeRegistered) == null || c.call(LiteGraph, r, t), o && ((f = LiteGraph.onNodeTypeReplaced) == null || f.call(LiteGraph, r, t, o)), t.prototype.onPropertyChange && LiteGraph.warn("LiteGraph node class " + r + " has onPropertyChange method, it must be called onPropertyChanged with d at the end"), t.supported_extensions)
      for (var l = 0; l < t.supported_extensions.length; l++) {
        var h = t.supported_extensions[l];
        h && h.constructor === String && (this.node_types_by_file_extension[h.toLowerCase()] = t);
      }
    (d = this.debug) == null || d.call(this, "registerNodeType", "type registered", r), this.auto_load_slot_types && ((_ = this.debug) == null || _.call(this, "registerNodeType", "do auto_load_slot_types", r)), new t((g = t.title) != null ? g : "tmpnode");
  }
  /**
   * removes a node type from the system
   * @method unregisterNodeType
   * @param {String|Object} type name of the node or the node constructor itself
   */
  unregisterNodeType(r) {
    const t = r.constructor === String ? this.registered_node_types[r] : r;
    if (!t)
      throw new Error("node type not found: " + r);
    delete this.registered_node_types[t.type], t.constructor.name && delete this.Nodes[t.constructor.name];
  }
  /**
  * Save a slot type and his node
  * @method registerSlotType
  * @param {String|Object} type name of the node or the node constructor itself
  * @param {String} slot_type name of the slot type (variable type), eg. string, number, array, boolean, ..
  */
  registerNodeAndSlotType(r, t, s = !1) {
    const n = (r.constructor === String && this.registered_node_types[r] !== "anonymous" ? this.registered_node_types[r] : r).constructor.type;
    let o = [];
    typeof t == "string" ? o = t.split(",") : t == this.EVENT || t == this.ACTION ? o = ["_event_"] : o = ["*"];
    for (let l = 0; l < o.length; ++l) {
      let h = o[l];
      h === "" && (h = "*");
      const u = s ? "registered_slot_out_types" : "registered_slot_in_types";
      this[u][h] === void 0 && (this[u][h] = { nodes: [] }), this[u][h].nodes.includes(n) || this[u][h].nodes.push(n), s ? this.slot_types_out.includes(h.toLowerCase()) || (this.slot_types_out.push(h.toLowerCase()), this.slot_types_out.sort()) : this.slot_types_in.includes(h.toLowerCase()) || (this.slot_types_in.push(h.toLowerCase()), this.slot_types_in.sort());
    }
  }
  /**
   * Create a new nodetype by passing an object with some properties
   * like onCreate, inputs:Array, outputs:Array, properties, onExecute
   * @method buildNodeClassFromObject
   * @param {String} name node name with namespace (p.e.: 'math/sum')
   * @param {Object} object methods expected onCreate, inputs, outputs, properties, onExecute
   */
  buildNodeClassFromObject(r, t) {
    var s = "";
    if (t.inputs)
      for (let n = 0; n < t.inputs.length; ++n) {
        let o = t.inputs[n][0], l = t.inputs[n][1];
        l && l.constructor === String && (l = '"' + l + '"'), s += "this.addInput('" + o + "'," + l + `);
`;
      }
    if (t.outputs)
      for (let n = 0; n < t.outputs.length; ++n) {
        let o = t.outputs[n][0], l = t.outputs[n][1];
        l && l.constructor === String && (l = '"' + l + '"'), s += "this.addOutput('" + o + "'," + l + `);
`;
      }
    if (t.properties)
      for (let n in t.properties) {
        let o = t.properties[n];
        o && o.constructor === String && (o = '"' + o + '"'), s += "this.addProperty('" + n + "'," + o + `);
`;
      }
    s += "if(this.onCreate)this.onCreate()";
    var a = Function(s);
    for (let n in t)
      n != "inputs" && n != "outputs" && n != "properties" && (a.prototype[n] = t[n]);
    return a.title = t.title || r.split("/").pop(), a.desc = t.desc || "Generated from object", this.registerNodeType(r, a), a;
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
  wrapFunctionAsNode(r, t, s, a, n) {
    const o = LiteGraph.getParameterNames(t), l = o.map((c, f) => {
      const d = s != null && s[f] ? `'${s[f]}'` : "0";
      return `this.addInput('${c}', ${d});`;
    }).join(`
`), h = a ? `'${a}'` : 0, u = n ? `this.properties = ${JSON.stringify(n)};` : "", p = new Function(`
            ${l}
            this.addOutput('out', ${h});
            ${u}
        `);
    return p.title = r.split("/").pop(), p.desc = `Generated from ${t.name}`, p.prototype.onExecute = function() {
      const c = o.map((d, _) => this.getInputData(_)), f = t.apply(this, c);
      this.setOutputData(0, f);
    }, this.registerNodeType(r, p), p;
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
  addNodeMethod(r, t) {
    LGraphNode.prototype[r] = t;
    for (var s in this.registered_node_types) {
      var a = this.registered_node_types[s];
      a.prototype[r] && (a.prototype["_" + r] = a.prototype[r]), a.prototype[r] = t;
    }
  }
  /**
   * Create a node of a given type with a name. The node is not attached to any graph yet.
   * @method createNode
   * @param {String} type full name of the node class. p.e. "math/sin"
   * @param {String} name a name to distinguish from other nodes
   * @param {Object} options to set options
   */
  createNode(r, t, s = {}) {
    var o, l, h, u, p, c, f, d, _, g, m, G;
    const a = (o = this.registered_node_types[r]) != null ? o : null;
    if (!a)
      return (l = this.log) == null || l.call(this, `GraphNode type "${r}" not registered.`), null;
    t = (h = t != null ? t : a.title) != null ? h : r;
    let n = null;
    if (LiteGraph.catch_exceptions)
      try {
        n = new a(t);
      } catch (L) {
        return (u = this.error) == null || u.call(this, L), null;
      }
    else
      n = new a(t);
    return n.type = r, (p = n.title) != null || (n.title = t), (c = n.properties) != null || (n.properties = {}), (f = n.properties_info) != null || (n.properties_info = []), (d = n.flags) != null || (n.flags = {}), (_ = n.size) != null || (n.size = n.computeSize()), (g = n.pos) != null || (n.pos = LiteGraph.DEFAULT_POSITION.concat()), (m = n.mode) != null || (n.mode = LiteGraph.ALWAYS), Object.assign(n, s), (G = n.onNodeCreated) == null || G.call(n), n;
  }
  /**
   * Returns a registered node type with a given name
   * @method getNodeType
   * @param {String} type full name of the node class. p.e. "math/sin"
   * @return {Class} the node class
   */
  getNodeType(r) {
    return this.registered_node_types[r];
  }
  /**
   * Returns a list of node types matching one category
   * @method getNodeType
   * @param {String} category category name
   * @return {Array} array with all the node classes
   */
  getNodeTypesInCategory(r, t) {
    const s = Object.values(this.registered_node_types).filter((a) => a.filter !== t ? !1 : r === "" ? a.category === null : a.category === r);
    return this.auto_sort_node_types && s.sort((a, n) => a.title.localeCompare(n.title)), s;
  }
  /**
   * Returns a list with all the node type categories
   * @method getNodeTypesCategories
   * @param {String} filter only nodes with ctor.filter equal can be shown
   * @return {Array} array with all the names of the categories
   */
  getNodeTypesCategories(r) {
    const t = { "": 1 };
    Object.values(this.registered_node_types).forEach((a) => {
      a.category && !a.skip_list && a.filter === r && (t[a.category] = 1);
    });
    const s = Object.keys(t);
    return this.auto_sort_node_types ? s.sort() : s;
  }
  // debug purposes: reloads all the js scripts that matches a wildcard
  reloadNodes(r) {
    var l, h, u;
    var t = document.getElementsByTagName("script"), s = [];
    for (let p = 0; p < t.length; p++)
      s.push(t[p]);
    var a = document.getElementsByTagName("head")[0];
    r = document.location.href + r;
    for (let p = 0; p < s.length; p++) {
      var n = s[p].src;
      if (!(!n || n.substr(0, r.length) != r))
        try {
          (l = this.log) == null || l.call(this, "Reloading: " + n);
          var o = document.createElement("script");
          o.type = "text/javascript", o.src = n, a.appendChild(o), a.removeChild(s[p]);
        } catch (c) {
          if (LiteGraph.throw_errors)
            throw c;
          (h = this.log) == null || h.call(this, "Error while reloading " + n);
        }
    }
    (u = this.log) == null || u.call(this, "Nodes reloaded");
  }
  // separated just to improve if it doesn't work
  cloneObject(r, t) {
    if (r == null)
      return null;
    const s = JSON.parse(JSON.stringify(r));
    if (!t)
      return s;
    for (const a in s)
      Object.prototype.hasOwnProperty.call(s, a) && (t[a] = s[a]);
    return t;
  }
  /*
      * https://gist.github.com/jed/982883?permalink_comment_id=852670#gistcomment-852670
      */
  uuidv4() {
    return ("10000000-1000-4000-8000" + -1e11).replace(/[018]/g, (r) => (r ^ Math.random() * 16 >> r / 4).toString(16));
  }
  /**
   * Returns if the types of two slots are compatible (taking into account wildcards, etc)
   * @method isValidConnection
   * @param {String} type_a
   * @param {String} type_b
   * @return {Boolean} true if they can be connected
   */
  isValidConnection(r, t) {
    if ((r === "" || r === "*") && (r = 0), (t === "" || t === "*") && (t = 0), !r || !t || r === t || r === LiteGraph.EVENT && t === LiteGraph.ACTION)
      return !0;
    if (r = String(r).toLowerCase(), t = String(t).toLowerCase(), !r.includes(",") && !t.includes(","))
      return r === t;
    const s = r.split(","), a = t.split(",");
    for (const n of s)
      for (const o of a)
        if (this.isValidConnection(n, o))
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
  registerSearchboxExtra(r, t, s) {
    this.searchbox_extras[t.toLowerCase()] = {
      type: r,
      desc: t,
      data: s
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
  fetchFile(r, t, s, a) {
    if (!r)
      return null;
    if (t = t || "text", r.constructor === String)
      return r.substr(0, 4) == "http" && LiteGraph.proxy && (r = LiteGraph.proxy + r.substr(r.indexOf(":") + 3)), fetch(r).then((o) => {
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
        s && s(o);
      }).catch((o) => {
        var l;
        (l = this.error) == null || l.call(this, "error fetching file:", r), a && a(o);
      });
    if (r.constructor === File || r.constructor === Blob) {
      var n = new FileReader();
      if (n.onload = (o) => {
        var l = o.target.result;
        t == "json" && (l = JSON.parse(l)), s && s(l);
      }, t == "arraybuffer")
        return n.readAsArrayBuffer(r);
      if (t == "text" || t == "json")
        return n.readAsText(r);
      if (t == "blob")
        return n.readAsBinaryString(r);
    }
    return null;
  }
  // @TODO These weren't even directly bound, so could be used as free functions
  compareObjects(r, t) {
    const s = Object.keys(r);
    return s.length !== Object.keys(t).length ? !1 : s.every((a) => r[a] === t[a]);
  }
  distance(r, t) {
    const [s, a] = r, [n, o] = t;
    return Math.sqrt((n - s) ** 2 + (o - a) ** 2);
  }
  colorToString(r) {
    return "rgba(" + Math.round(r[0] * 255).toFixed() + "," + Math.round(r[1] * 255).toFixed() + "," + Math.round(r[2] * 255).toFixed() + "," + (r.length == 4 ? r[3].toFixed(2) : "1.0") + ")";
  }
  canvasFillTextMultiline(r, t, s, a, n, o) {
    var l = (t + "").trim().split(" "), h = "", u = { lines: [], maxW: 0, height: 0 };
    if (l.length > 1)
      for (var p = 0; p < l.length; p++) {
        var c = h + l[p] + " ", f = r.measureText(c), d = f.width;
        d > n && p > 0 ? (r.fillText(h, s, a + o * u.lines.length), h = l[p] + " ", u.max = d, u.lines.push(h)) : h = c;
      }
    else
      h = l[0];
    return r.fillText(h, s, a + o * u.lines.length), u.lines.push(h), u.height = o * u.lines.length || o, u;
  }
  isInsideRectangle(r, t, s, a, n, o) {
    return r > s && r < s + n && t > a && t < a + o;
  }
  // [minx,miny,maxx,maxy]
  growBounding(r, t, s) {
    t < r[0] ? r[0] = t : t > r[2] && (r[2] = t), s < r[1] ? r[1] = s : s > r[3] && (r[3] = s);
  }
  // point inside bounding box
  isInsideBounding(r, t) {
    return r[0] >= t[0][0] && r[1] >= t[0][1] && r[0] <= t[1][0] && r[1] <= t[1][1];
  }
  // bounding overlap, format: [ startx, starty, width, height ]
  overlapBounding(r, t) {
    const s = r[0] + r[2], a = r[1] + r[3], n = t[0] + t[2], o = t[1] + t[3];
    return !(r[0] > n || r[1] > o || s < t[0] || a < t[1]);
  }
  // Convert a hex value to its decimal value - the inputted hex must be in the
  //	format of a hex triplet - the kind we use for HTML colours. The function
  //	will return an array with three values.
  hex2num(r) {
    r.charAt(0) == "#" && (r = r.slice(1)), r = r.toUpperCase();
    for (var t = "0123456789ABCDEF", s = new Array(3), a = 0, n, o, l = 0; l < 6; l += 2)
      n = t.indexOf(r.charAt(l)), o = t.indexOf(r.charAt(l + 1)), s[a] = n * 16 + o, a++;
    return s;
  }
  // Give a array with three values as the argument and the function will return
  //	the corresponding hex triplet.
  num2hex(r) {
    for (var t = "0123456789ABCDEF", s = "#", a, n, o = 0; o < 3; o++)
      a = r[o] / 16, n = r[o] % 16, s += t.charAt(a) + t.charAt(n);
    return s;
  }
  set pointerevents_method(r) {
    var t;
    (t = console.error) == null || t.call(console, "Removed and being re-integrated sorta");
  }
  get pointerevents_method() {
    var r;
    (r = console.error) == null || r.call(console, "Removed and being re-integrated sorta");
  }
}();
typeof performance != "undefined" ? LiteGraph.getTime = performance.now.bind(performance) : typeof Date != "undefined" && Date.now ? LiteGraph.getTime = Date.now.bind(Date) : typeof process != "undefined" ? LiteGraph.getTime = () => {
  var r = process.hrtime();
  return r[0] * 1e-3 + r[1] * 1e-6;
} : LiteGraph.getTime = function() {
  return (/* @__PURE__ */ new Date()).getTime();
};
typeof window != "undefined" && !window.requestAnimationFrame && (window.requestAnimationFrame = window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || ((r) => {
  window.setTimeout(r, 1e3 / 60);
}));
class Time {
  constructor() {
    this.addOutput("in ms", "number"), this.addOutput("in sec", "number");
  }
  onExecute() {
    this.setOutputData(0, this.graph.globaltime * 1e3), this.setOutputData(1, this.graph.globaltime);
  }
}
b(Time, "title", "Time"), b(Time, "desc", "Time");
LiteGraph.registerNodeType("basic/time", Time);
class Subgraph {
  constructor() {
    this.size = [140, 80], this.properties = { enabled: !0 }, this.enabled = !0, this.subgraph = new LiteGraph.LGraph(), this.subgraph._subgraph_node = this, this.subgraph._is_subgraph = !0, this.subgraph.onTrigger = this.onSubgraphTrigger.bind(this), this.subgraph.onInputAdded = this.onSubgraphNewInput.bind(this), this.subgraph.onInputRenamed = this.onSubgraphRenamedInput.bind(this), this.subgraph.onInputTypeChanged = this.onSubgraphTypeChangeInput.bind(this), this.subgraph.onInputRemoved = this.onSubgraphRemovedInput.bind(this), this.subgraph.onOutputAdded = this.onSubgraphNewOutput.bind(this), this.subgraph.onOutputRenamed = this.onSubgraphRenamedOutput.bind(this), this.subgraph.onOutputTypeChanged = this.onSubgraphTypeChangeOutput.bind(this), this.subgraph.onOutputRemoved = this.onSubgraphRemovedOutput.bind(this);
  }
  onGetInputs() {
    return [["enabled", "boolean"]];
  }
  /*
      Subgraph.prototype.onDrawTitle = function(ctx) {
          if (this.flags.collapsed) {
              return;
          }
  
          ctx.fillStyle = "#555";
          var w = LiteGraph.NODE_TITLE_HEIGHT;
          var x = this.size[0] - w;
          ctx.fillRect(x, -w, w, w);
          ctx.fillStyle = "#333";
          ctx.beginPath();
          ctx.moveTo(x + w * 0.2, -w * 0.6);
          ctx.lineTo(x + w * 0.8, -w * 0.6);
          ctx.lineTo(x + w * 0.5, -w * 0.3);
          ctx.fill();
      };
      */
  onDblClick(t, s, a) {
    var n = this;
    setTimeout(function() {
      a.openSubgraph(n.subgraph);
    }, 10);
  }
  /*
  Subgraph.prototype.onMouseDown = function(e, pos, graphcanvas) {
      if (
          !this.flags.collapsed &&
          pos[0] > this.size[0] - LiteGraph.NODE_TITLE_HEIGHT &&
          pos[1] < 0
      ) {
          var that = this;
          setTimeout(function() {
              graphcanvas.openSubgraph(that.subgraph);
          }, 10);
      }
  };
  */
  onAction(t, s) {
    this.subgraph.onAction(t, s);
  }
  onExecute() {
    if (this.enabled = this.getInputOrProperty("enabled"), !!this.enabled) {
      if (this.inputs)
        for (let t = 0; t < this.inputs.length; t++) {
          let s = this.inputs[t], a = this.getInputData(t);
          this.subgraph.setInputData(s.name, a);
        }
      if (this.subgraph.runStep(), this.outputs)
        for (let t = 0; t < this.outputs.length; t++) {
          let s = this.outputs[t], a = this.subgraph.getOutputData(s.name);
          this.setOutputData(t, a);
        }
    }
  }
  sendEventToAllNodes(t, s, a) {
    this.enabled && this.subgraph.sendEventToAllNodes(t, s, a);
  }
  onDrawBackground(t, s, a, n) {
    if (this.flags.collapsed) return;
    var o = this.size[1] - LiteGraph.NODE_TITLE_HEIGHT + 0.5, l = LiteGraph.isInsideRectangle(
      n[0],
      n[1],
      this.pos[0],
      this.pos[1] + o,
      this.size[0],
      LiteGraph.NODE_TITLE_HEIGHT
    );
    let h = LiteGraph.isInsideRectangle(
      n[0],
      n[1],
      this.pos[0],
      this.pos[1] + o,
      this.size[0] / 2,
      LiteGraph.NODE_TITLE_HEIGHT
    );
    t.fillStyle = l ? "#555" : "#222", t.beginPath(), this._shape == LiteGraph.BOX_SHAPE ? h ? t.rect(0, o, this.size[0] / 2 + 1, LiteGraph.NODE_TITLE_HEIGHT) : t.rect(
      this.size[0] / 2,
      o,
      this.size[0] / 2 + 1,
      LiteGraph.NODE_TITLE_HEIGHT
    ) : h ? t.roundRect(
      0,
      o,
      this.size[0] / 2 + 1,
      LiteGraph.NODE_TITLE_HEIGHT,
      [0, 0, 8, 8]
    ) : t.roundRect(
      this.size[0] / 2,
      o,
      this.size[0] / 2 + 1,
      LiteGraph.NODE_TITLE_HEIGHT,
      [0, 0, 8, 8]
    ), l ? t.fill() : t.fillRect(0, o, this.size[0] + 1, LiteGraph.NODE_TITLE_HEIGHT), t.textAlign = "center", t.font = "24px Arial", t.fillStyle = l ? "#DDD" : "#999", t.fillText("+", this.size[0] * 0.25, o + 24), t.fillText("+", this.size[0] * 0.75, o + 24);
  }
  // Subgraph.prototype.onMouseDown = function(e, localpos, graphcanvas)
  // {
  // 	var y = this.size[1] - LiteGraph.NODE_TITLE_HEIGHT + 0.5;
  // 	if(localpos[1] > y)
  // 	{
  // 		graphcanvas.showSubgraphPropertiesDialog(this);
  // 	}
  // }
  onMouseDown(t, s, a) {
    var o, l, h;
    var n = this.size[1] - LiteGraph.NODE_TITLE_HEIGHT + 0.5;
    (o = console.log) == null || o.call(console, 0), s[1] > n && (s[0] < this.size[0] / 2 ? ((l = console.log) == null || l.call(console, 1), a.showSubgraphPropertiesDialog(this)) : ((h = console.log) == null || h.call(console, 2), a.showSubgraphPropertiesDialogRight(this)));
  }
  computeSize() {
    var t = this.inputs ? this.inputs.length : 0, s = this.outputs ? this.outputs.length : 0;
    return [
      200,
      Math.max(t, s) * LiteGraph.NODE_SLOT_HEIGHT + LiteGraph.NODE_TITLE_HEIGHT
    ];
  }
  //* *** INPUTS ***********************************
  onSubgraphTrigger(t) {
    var s = this.findOutputSlot(t);
    s != -1 && this.triggerSlot(s);
  }
  onSubgraphNewInput(t, s) {
    var a = this.findInputSlot(t);
    a == -1 && this.addInput(t, s);
  }
  onSubgraphRenamedInput(t, s) {
    var a = this.findInputSlot(t);
    if (a != -1) {
      var n = this.getInputInfo(a);
      n.name = s;
    }
  }
  onSubgraphTypeChangeInput(t, s) {
    var a = this.findInputSlot(t);
    if (a != -1) {
      var n = this.getInputInfo(a);
      n.type = s;
    }
  }
  onSubgraphRemovedInput(t) {
    var s = this.findInputSlot(t);
    s != -1 && this.removeInput(s);
  }
  //* *** OUTPUTS ***********************************
  onSubgraphNewOutput(t, s) {
    var a = this.findOutputSlot(t);
    a == -1 && this.addOutput(t, s);
  }
  onSubgraphRenamedOutput(t, s) {
    var a = this.findOutputSlot(t);
    if (a != -1) {
      var n = this.getOutputInfo(a);
      n.name = s;
    }
  }
  onSubgraphTypeChangeOutput(t, s) {
    var a = this.findOutputSlot(t);
    if (a != -1) {
      var n = this.getOutputInfo(a);
      n.type = s;
    }
  }
  onSubgraphRemovedOutput(t) {
    var s = this.findOutputSlot(t);
    s != -1 && this.removeOutput(s);
  }
  getExtraMenuOptions(t) {
    var s = this;
    return [
      {
        content: "Open",
        callback: function() {
          t.openSubgraph(s.subgraph);
        }
      }
    ];
  }
  onResize(t) {
    t[1] += 20;
  }
  serialize() {
    var t = LiteGraph.LGraphNode.prototype.serialize.call(this);
    return t.subgraph = this.subgraph.serialize(), t;
  }
  // no need to define node.configure, the default method detects node.subgraph and passes the object to node.subgraph.configure()
  reassignSubgraphUUIDs(t) {
    const s = { nodeIDs: {}, linkIDs: {} };
    for (const a of t.nodes) {
      const n = a.id, o = LiteGraph.uuidv4();
      if (a.id = o, s.nodeIDs[n] || s.nodeIDs[o])
        throw new Error(`New/old node UUID wasn't unique in changed map! ${n} ${o}`);
      s.nodeIDs[n] = o, s.nodeIDs[o] = n;
    }
    for (const a of t.links) {
      const n = a[0], o = LiteGraph.uuidv4();
      if (a[0] = o, s.linkIDs[n] || s.linkIDs[o])
        throw new Error(`New/old link UUID wasn't unique in changed map! ${n} ${o}`);
      s.linkIDs[n] = o, s.linkIDs[o] = n;
      const l = a[1], h = a[3];
      if (!s.nodeIDs[l])
        throw new Error(`Old node UUID not found in mapping! ${l}`);
      if (a[1] = s.nodeIDs[l], !s.nodeIDs[h])
        throw new Error(`Old node UUID not found in mapping! ${h}`);
      a[3] = s.nodeIDs[h];
    }
    for (const a of t.nodes) {
      if (a.inputs)
        for (const n of a.inputs)
          n.link && (n.link = s.linkIDs[n.link]);
      if (a.outputs)
        for (const n of a.outputs)
          n.links && (n.links = n.links.map((o) => s.linkIDs[o]));
    }
    for (const a of t.nodes)
      if (a.type === "graph/subgraph") {
        const n = reassignGraphUUIDs(a.subgraph);
        s.nodeIDs.assign(n.nodeIDs), s.linkIDs.assign(n.linkIDs);
      }
  }
  clone() {
    var t = LiteGraph.createNode(this.type), s = this.serialize();
    if (LiteGraph.use_uuids) {
      const a = LiteGraph.cloneObject(s.subgraph);
      this.reassignSubgraphUUIDs(a), s.subgraph = a;
    }
    return delete s.id, delete s.inputs, delete s.outputs, t.configure(s), t;
  }
  buildFromNodes(t) {
    var s = {};
    for (let a = 0; a < t.length; ++a)
      s[node.id] = t[a];
    for (let a = 0; a < t.length; ++a) {
      let n = t[a];
      if (n.inputs)
        for (let o = 0; o < n.inputs.length; ++o) {
          let l = n.inputs[o];
          if (!l || !l.link) continue;
          let h = n.graph.links[l.link];
          h && (s[h.origin_id] || this.subgraph.addInput(l.name, h.type));
        }
      if (n.outputs)
        for (let o = 0; o < n.outputs.length; ++o) {
          let l = n.outputs[o];
          if (!(!l || !l.links || !l.links.length))
            for (let h = 0; h < l.links.length; ++h) {
              let u = n.graph.links[l.links[h]];
              if (u && !s[u.target_id])
                break;
            }
        }
    }
  }
}
b(Subgraph, "title", "Subgraph"), b(Subgraph, "desc", "Graph inside a node"), b(Subgraph, "title_color", "#334");
LiteGraph.Subgraph = Subgraph;
LiteGraph.registerNodeType("graph/subgraph", Subgraph);
class GraphInput {
  constructor() {
    this.addOutput("", "number"), this.name_in_graph = "", this.properties = {
      name: "",
      type: "number",
      value: 0
    };
    var t = this;
    this.name_widget = this.addWidget(
      "text",
      "Name",
      this.properties.name,
      function(s) {
        s && t.setProperty("name", s);
      }
    ), this.type_widget = this.addWidget(
      "text",
      "Type",
      this.properties.type,
      function(s) {
        t.setProperty("type", s);
      }
    ), this.value_widget = this.addWidget(
      "number",
      "Value",
      this.properties.value,
      function(s) {
        t.setProperty("value", s);
      }
    ), this.widgets_up = !0, this.size = [180, 90];
  }
  onConfigure() {
    this.updateType();
  }
  // ensures the type in the node output and the type in the associated graph input are the same
  updateType() {
    var t = this.properties.type;
    this.type_widget.value = t, this.outputs[0].type != t && (LiteGraph.isValidConnection(this.outputs[0].type, t) || this.disconnectOutput(0), this.outputs[0].type = t), t == "number" ? (this.value_widget.type = "number", this.value_widget.value = 0) : t == "boolean" ? (this.value_widget.type = "toggle", this.value_widget.value = !0) : t == "string" ? (this.value_widget.type = "text", this.value_widget.value = "") : (this.value_widget.type = null, this.value_widget.value = null), this.properties.value = this.value_widget.value, this.graph && this.name_in_graph && this.graph.changeInputType(this.name_in_graph, t);
  }
  // this is executed AFTER the property has changed
  onPropertyChanged(t, s) {
    if (t == "name") {
      if (s == "" || s == this.name_in_graph || s == "enabled")
        return !1;
      this.graph && (this.name_in_graph ? this.graph.renameInput(this.name_in_graph, s) : this.graph.addInput(s, this.properties.type)), this.name_widget.value = s, this.name_in_graph = s;
    } else t == "type" && this.updateType();
  }
  getTitle() {
    return this.flags.collapsed ? this.properties.name : this.title;
  }
  onAction(t, s) {
    this.properties.type == LiteGraph.EVENT && this.triggerSlot(0, s);
  }
  onExecute() {
    var t = this.properties.name, s = this.graph.inputs[t];
    if (!s) {
      this.setOutputData(0, this.properties.value);
      return;
    }
    this.setOutputData(
      0,
      s.value !== void 0 ? s.value : this.properties.value
    );
  }
  onRemoved() {
    this.name_in_graph && this.graph.removeInput(this.name_in_graph);
  }
}
b(GraphInput, "title", "Input"), b(GraphInput, "desc", "Input of the graph");
LiteGraph.GraphInput = GraphInput;
LiteGraph.registerNodeType("graph/input", GraphInput);
class GraphOutput {
  constructor() {
    this.addInput("", ""), this.name_in_graph = "", this.properties = { name: "", type: "" }, this.name_widget = this.addWidget(
      "text",
      "Name",
      this.properties.name,
      "name"
    ), this.type_widget = this.addWidget(
      "text",
      "Type",
      this.properties.type,
      "type"
    ), this.widgets_up = !0, this.size = [180, 60];
  }
  onPropertyChanged(t, s) {
    if (t == "name") {
      if (s == "" || s == this.name_in_graph || s == "enabled")
        return !1;
      this.graph && (this.name_in_graph ? this.graph.renameOutput(this.name_in_graph, s) : this.graph.addOutput(s, this.properties.type)), this.name_widget.value = s, this.name_in_graph = s;
    } else t == "type" && this.updateType();
  }
  updateType() {
    var t = this.properties.type;
    this.type_widget && (this.type_widget.value = t), this.inputs[0].type != t && ((t == "action" || t == "event") && (t = LiteGraph.EVENT), LiteGraph.isValidConnection(this.inputs[0].type, t) || this.disconnectInput(0), this.inputs[0].type = t), this.graph && this.name_in_graph && this.graph.changeOutputType(this.name_in_graph, t);
  }
  onExecute() {
    this._value = this.getInputData(0), this.graph.setOutputData(this.properties.name, this._value);
  }
  onAction(t, s) {
    this.properties.type == LiteGraph.ACTION && this.graph.trigger(this.properties.name, s);
  }
  onRemoved() {
    this.name_in_graph && this.graph.removeOutput(this.name_in_graph);
  }
  getTitle() {
    return this.flags.collapsed ? this.properties.name : this.title;
  }
}
b(GraphOutput, "title", "Output"), b(GraphOutput, "desc", "Output of the graph");
LiteGraph.GraphOutput = GraphOutput;
LiteGraph.registerNodeType("graph/output", GraphOutput);
class ConstantNumber {
  constructor() {
    this.addOutput("value", "number"), this.addProperty("value", 1), this.widget = this.addWidget("number", "value", 1, "value"), this.widgets_up = !0, this.size = [180, 30];
  }
  onExecute() {
    this.setOutputData(0, parseFloat(this.properties.value));
  }
  getTitle() {
    return this.flags.collapsed ? this.properties.value : this.title;
  }
  setValue(t) {
    this.setProperty("value", t);
  }
  onDrawBackground() {
    this.outputs[0].label = this.properties.value.toFixed(3);
  }
}
b(ConstantNumber, "title", "Const Number"), b(ConstantNumber, "desc", "Constant number");
LiteGraph.registerNodeType("basic/const", ConstantNumber);
class ConstantBoolean {
  constructor() {
    this.addOutput("bool", "boolean"), this.addProperty("value", !0), this.widget = this.addWidget("toggle", "value", !0, "value"), this.serialize_widgets = !0, this.widgets_up = !0, this.size = [140, 30];
  }
  onExecute() {
    this.setOutputData(0, this.properties.value);
  }
  onGetInputs() {
    return [["toggle", LiteGraph.ACTION]];
  }
  onAction() {
    this.setValue(!this.properties.value);
  }
}
b(ConstantBoolean, "title", "Const Boolean"), b(ConstantBoolean, "desc", "Constant boolean");
ConstantBoolean.prototype.getTitle = ConstantNumber.prototype.getTitle;
ConstantBoolean.prototype.setValue = ConstantNumber.prototype.setValue;
LiteGraph.registerNodeType("basic/boolean", ConstantBoolean);
class ConstantString {
  constructor() {
    this.addOutput("string", "string"), this.addProperty("value", ""), this.widget = this.addWidget("text", "value", "", "value"), this.widgets_up = !0, this.size = [180, 30];
  }
  onExecute() {
    this.setOutputData(0, this.properties.value);
  }
  onDropFile(t) {
    var s = this, a = new FileReader();
    a.onload = function(n) {
      s.setProperty("value", n.target.result);
    }, a.readAsText(t);
  }
}
b(ConstantString, "title", "Const String"), b(ConstantString, "desc", "Constant string");
ConstantString.prototype.getTitle = ConstantNumber.prototype.getTitle;
ConstantString.prototype.setValue = ConstantNumber.prototype.setValue;
LiteGraph.registerNodeType("basic/string", ConstantString);
class ConstantObject {
  constructor() {
    this.addOutput("obj", "object"), this.size = [120, 30], this._object = {};
  }
  onExecute() {
    this.setOutputData(0, this._object);
  }
}
b(ConstantObject, "title", "Const Object"), b(ConstantObject, "desc", "Constant Object");
LiteGraph.registerNodeType("basic/object", ConstantObject);
class ConstantFile {
  constructor() {
    this.addInput("url", "string"), this.addOutput("file", "string"), this.addProperty("url", ""), this.addProperty("type", "text"), this.widget = this.addWidget("text", "url", "", "url"), this._data = null;
  }
  onPropertyChanged(t, s) {
    t == "url" && (s == null || s == "" ? this._data = null : this.fetchFile(s));
  }
  onExecute() {
    var t = this.getInputData(0) || this.properties.url;
    t && (t != this._url || this._type != this.properties.type) && this.fetchFile(t), this.setOutputData(0, this._data);
  }
  fetchFile(t) {
    var s = this;
    if (!t || t.constructor !== String) {
      s._data = null, s.boxcolor = null;
      return;
    }
    this._url = t, this._type = this.properties.type, t.substr(0, 4) == "http" && LiteGraph.proxy && (t = LiteGraph.proxy + t.substr(t.indexOf(":") + 3)), fetch(t).then(function(a) {
      if (!a.ok) throw new Error("File not found");
      if (s.properties.type == "arraybuffer")
        return a.arrayBuffer();
      if (s.properties.type == "text") return a.text();
      if (s.properties.type == "json") return a.json();
      if (s.properties.type == "blob") return a.blob();
    }).then(function(a) {
      s._data = a, s.boxcolor = "#AEA";
    }).catch((a) => {
      var n;
      s._data = null, s.boxcolor = "red", (n = console.error) == null || n.call(console, "error fetching file:", t);
    });
  }
  onDropFile(t) {
    var s = this;
    this._url = t.name, this._type = this.properties.type, this.properties.url = t.name;
    var a = new FileReader();
    if (a.onload = function(n) {
      s.boxcolor = "#AEA";
      var o = n.target.result;
      s.properties.type == "json" && (o = JSON.parse(o)), s._data = o;
    }, s.properties.type == "arraybuffer") a.readAsArrayBuffer(t);
    else if (s.properties.type == "text" || s.properties.type == "json")
      a.readAsText(t);
    else if (s.properties.type == "blob")
      return a.readAsBinaryString(t);
  }
}
b(ConstantFile, "title", "Const File"), b(ConstantFile, "desc", "Fetches a file from an url"), b(ConstantFile, "@type", {
  type: "enum",
  values: ["text", "arraybuffer", "blob", "json"]
});
ConstantFile.prototype.setValue = ConstantNumber.prototype.setValue;
LiteGraph.registerNodeType("basic/file", ConstantFile);
class JSONParse {
  constructor() {
    this.addInput("parse", LiteGraph.ACTION), this.addInput("json", "string"), this.addOutput("done", LiteGraph.EVENT), this.addOutput("object", "object"), this.widget = this.addWidget("button", "parse", "", this.parse.bind(this)), this._str = null, this._obj = null;
  }
  parse() {
    if (this._str)
      try {
        this._str = this.getInputData(1), this._obj = JSON.parse(this._str), this.boxcolor = "#AEA", this.triggerSlot(0);
      } catch {
        this.boxcolor = "red";
      }
  }
  onExecute() {
    this._str = this.getInputData(1), this.setOutputData(1, this._obj);
  }
  onAction(t) {
    t == "parse" && this.parse();
  }
}
b(JSONParse, "title", "JSON Parse"), b(JSONParse, "desc", "Parses JSON String into object");
LiteGraph.registerNodeType("basic/jsonparse", JSONParse);
class ConstantData {
  constructor() {
    this.addOutput("data", "object"), this.addProperty("value", ""), this.widget = this.addWidget("text", "json", "", "value"), this.widgets_up = !0, this.size = [140, 30], this._value = null;
  }
  onPropertyChanged(t, s) {
    if (this.widget.value = s, !(s == null || s == ""))
      try {
        this._value = JSON.parse(s), this.boxcolor = "#AEA";
      } catch {
        this.boxcolor = "red";
      }
  }
  onExecute() {
    this.setOutputData(0, this._value);
  }
}
b(ConstantData, "title", "Const Data"), b(ConstantData, "desc", "Constant Data");
ConstantData.prototype.setValue = ConstantNumber.prototype.setValue;
LiteGraph.registerNodeType("basic/data", ConstantData);
class ConstantArray {
  constructor() {
    this._value = [], this.addInput("json", ""), this.addOutput("arrayOut", "array"), this.addOutput("length", "number"), this.addProperty("value", "[]"), this.widget = this.addWidget(
      "text",
      "array",
      this.properties.value,
      "value"
    ), this.widgets_up = !0, this.size = [140, 50];
  }
  onPropertyChanged(t, s) {
    if (this.widget.value = s, !(s == null || s == ""))
      try {
        s[0] != "[" ? this._value = JSON.parse("[" + s + "]") : this._value = JSON.parse(s), this.boxcolor = "#AEA";
      } catch {
        this.boxcolor = "red";
      }
  }
  onExecute() {
    var t = this.getInputData(0);
    if (t && t.length) {
      this._value || (this._value = new Array()), this._value.length = t.length;
      for (var s = 0; s < t.length; ++s)
        this._value[s] = t[s];
      this.changeOutputType("arrayOut", "array");
    }
    this.setOutputData(0, this._value), this.setOutputData(1, this._value && this._value.length || 0);
  }
}
b(ConstantArray, "title", "Const Array"), b(ConstantArray, "desc", "Constant Array");
ConstantArray.prototype.setValue = ConstantNumber.prototype.setValue;
LiteGraph.registerNodeType("basic/array", ConstantArray);
class ArrayLength {
  constructor() {
    this.addInput("arr", "array"), this.addOutput("length", "number");
  }
  onExecute() {
    var s;
    var t = this.getInputData(0);
    t && (["array", "object"].includes(typeof t) && typeof t.length != "undefined" ? this.setOutputData(0, t.length) : ((s = console.debug) == null || s.call(console, "Not an array or object", typeof t, t), this.setOutputData(0, null)));
  }
}
b(ArrayLength, "title", "aLength"), b(ArrayLength, "desc", "Get the length of an array");
LiteGraph.registerNodeType("basic/array_length", ArrayLength);
class SetArray {
  constructor() {
    this.addInput("arr", "array"), this.addInput("value", ""), this.addOutput("arr", "array"), this.properties = { index: 0 }, this.widget = this.addWidget(
      "number",
      "i",
      this.properties.index,
      "index",
      { precision: 0, step: 10, min: 0 }
    );
  }
  onExecute() {
    var t = this.getInputData(0);
    if (t) {
      var s = this.getInputData(1);
      s !== void 0 && (this.properties.index && (t[Math.floor(this.properties.index)] = s), this.setOutputData(0, t));
    }
  }
}
b(SetArray, "title", "Set Array"), b(SetArray, "desc", "Sets index of array");
LiteGraph.registerNodeType("basic/set_array", SetArray);
class ArrayElement {
  constructor() {
    this.addInput("array", "array,table,string"), this.addInput("index", "number"), this.addOutput("value", ""), this.addProperty("index", 0);
  }
  onExecute() {
    var t = this.getInputData(0), s = this.getInputData(1);
    s == null && (s = this.properties.index), !(t == null || s == null) && this.setOutputData(0, t[Math.floor(Number(s))]);
  }
}
b(ArrayElement, "title", "Array[i]"), b(ArrayElement, "desc", "Returns an element from an array");
LiteGraph.registerNodeType("basic/array[]", ArrayElement);
class TableElement {
  constructor() {
    this.addInput("table", "table"), this.addInput("row", "number"), this.addInput("col", "number"), this.addOutput("value", ""), this.addProperty("row", 0), this.addProperty("column", 0);
  }
  onExecute() {
    var t = this.getInputData(0), s = this.getInputData(1), a = this.getInputData(2);
    s == null && (s = this.properties.row), a == null && (a = this.properties.column), !(t == null || s == null || a == null) && (s = t[Math.floor(Number(s))], s ? this.setOutputData(0, s[Math.floor(Number(a))]) : this.setOutputData(0, null));
  }
}
b(TableElement, "title", "Table[row][col]"), b(TableElement, "desc", "Returns an element from a table");
LiteGraph.registerNodeType("basic/table[][]", TableElement);
class ObjectProperty {
  constructor() {
    this.addInput("obj", "object"), this.addOutput("property", 0), this.addProperty("value", 0), this.widget = this.addWidget("text", "prop.", "", this.setValue.bind(this)), this.widgets_up = !0, this.size = [140, 30], this._value = null;
  }
  setValue(t) {
    this.properties.value = t, this.widget.value = t;
  }
  getTitle() {
    return this.flags.collapsed ? "in." + this.properties.value : this.title;
  }
  onPropertyChanged(t, s) {
    this.widget.value = s;
  }
  onExecute() {
    var t = this.getInputData(0);
    t != null && this.setOutputData(0, t[this.properties.value]);
  }
}
b(ObjectProperty, "title", "Object property"), b(ObjectProperty, "desc", "Outputs the property of an object");
LiteGraph.registerNodeType("basic/object_property", ObjectProperty);
class ObjectKeys {
  constructor() {
    this.addInput("obj", ""), this.addOutput("keys", "array"), this.size = [140, 30];
  }
  onExecute() {
    var t = this.getInputData(0);
    t != null && this.setOutputData(0, Object.keys(t));
  }
}
b(ObjectKeys, "title", "Object keys"), b(ObjectKeys, "desc", "Outputs an array with the keys of an object");
LiteGraph.registerNodeType("basic/object_keys", ObjectKeys);
class SetObject {
  constructor() {
    this.addInput("obj", ""), this.addInput("value", ""), this.addOutput("obj", ""), this.properties = { property: "" }, this.name_widget = this.addWidget(
      "text",
      "prop.",
      this.properties.property,
      "property"
    );
  }
  onExecute() {
    var t = this.getInputData(0);
    if (t) {
      var s = this.getInputData(1);
      s !== void 0 && (this.properties.property && (t[this.properties.property] = s), this.setOutputData(0, t));
    }
  }
}
b(SetObject, "title", "Set Object"), b(SetObject, "desc", "Adds propertiesrty to object");
LiteGraph.registerNodeType("basic/set_object", SetObject);
class MergeObjects {
  constructor() {
    this.addInput("A", "object"), this.addInput("B", "object"), this.addOutput("out", "object"), this._result = {};
    var t = this;
    this.addWidget("button", "clear", "", function() {
      t._result = {};
    }), this.size = this.computeSize();
  }
  onExecute() {
    var t = this.getInputData(0), s = this.getInputData(1), a = this._result;
    if (t)
      for (let n in t)
        a[n] = t[n];
    if (s)
      for (let n in s)
        a[n] = s[n];
    this.setOutputData(0, a);
  }
}
b(MergeObjects, "title", "Merge Objects"), b(MergeObjects, "desc", "Creates an object copying properties from others");
LiteGraph.registerNodeType("basic/merge_objects", MergeObjects);
const rt = class rt {
  constructor() {
    this.size = [60, 30], this.addInput("in"), this.addOutput("out"), this.properties = { varname: "myname", container: rt.LITEGRAPH }, this.value = null;
  }
  onExecute() {
    var t = this.getContainer();
    if (this.isInputConnected(0)) {
      this.value = this.getInputData(0), t[this.properties.varname] = this.value, this.setOutputData(0, this.value);
      return;
    }
    this.setOutputData(0, t[this.properties.varname]);
  }
  getContainer() {
    switch (this.properties.container) {
      case rt.GRAPH:
        return this.graph ? this.graph.vars : {};
      case rt.GLOBALSCOPE:
        return global;
      // @BUG: not sure what to do with this now
      default:
        return LiteGraph.Globals;
    }
  }
  getTitle() {
    return this.properties.varname;
  }
};
b(rt, "title", "Variable"), b(rt, "desc", "store/read variable value");
let Variable = rt;
Variable.LITEGRAPH = 0;
Variable.GRAPH = 1;
Variable.GLOBALSCOPE = 2;
Variable["@container"] = {
  type: "enum",
  values: {
    litegraph: Variable.LITEGRAPH,
    graph: Variable.GRAPH,
    global: Variable.GLOBALSCOPE
  }
};
LiteGraph.registerNodeType("basic/variable", Variable);
function length(r) {
  return r && r.length != null ? Number(r.length) : 0;
}
LiteGraph.wrapFunctionAsNode("basic/length", length, [""], "number");
LiteGraph.wrapFunctionAsNode(
  "basic/not",
  function(r) {
    return !r;
  },
  [""],
  "boolean"
);
class DownloadData {
  constructor() {
    this.size = [60, 30], this.addInput("data", 0), this.addInput("download", LiteGraph.ACTION), this.properties = { filename: "data.json" }, this.value = null;
    var t = this;
    this.addWidget("button", "Download", "", () => {
      t.value && t.downloadAsFile();
    });
  }
  downloadAsFile() {
    if (this.value != null) {
      var t = null;
      this.value.constructor === String ? t = this.value : t = JSON.stringify(this.value);
      var s = new Blob([t]), a = URL.createObjectURL(s), n = document.createElement("a");
      n.setAttribute("href", a), n.setAttribute("download", this.properties.filename), n.style.display = "none", document.body.appendChild(n), n.click(), document.body.removeChild(n), setTimeout(function() {
        URL.revokeObjectURL(a);
      }, 1e3 * 60);
    }
  }
  onAction() {
    var t = this;
    setTimeout(function() {
      t.downloadAsFile();
    }, 100);
  }
  onExecute() {
    this.inputs[0] && (this.value = this.getInputData(0));
  }
  getTitle() {
    return this.flags.collapsed ? this.properties.filename : this.title;
  }
}
b(DownloadData, "title", "Download"), b(DownloadData, "desc", "Download some data");
LiteGraph.registerNodeType("basic/download", DownloadData);
const at = class at {
  constructor() {
    this.size = [60, 30], this.addInput("value", 0, { label: "" }), this.value = 0;
  }
  onExecute() {
    this.inputs[0] && (this.value = this.getInputData(0));
  }
  getTitle() {
    return this.flags.collapsed ? this.inputs[0].label : this.title;
  }
  static toString(t) {
    if (t == null)
      return "null";
    if (t.constructor === Number)
      return t.toFixed(3);
    if (t.constructor === Array) {
      for (var s = "[", a = 0; a < t.length; ++a)
        s += at.toString(t[a]) + (a + 1 != t.length ? "," : "");
      return s += "]", s;
    } else
      return String(t);
  }
  onDrawBackground() {
    this.inputs[0].label = at.toString(this.value);
  }
};
b(at, "title", "Watch"), b(at, "desc", "Show value of input");
let Watch = at;
LiteGraph.registerNodeType("basic/watch", Watch);
class Cast {
  constructor() {
    this.addInput("in", 0), this.addOutput("out", 0), this.size = [40, 30];
  }
  onExecute() {
    this.setOutputData(0, this.getInputData(0));
  }
}
b(Cast, "title", "Cast"), b(Cast, "desc", "Allows to connect different types");
LiteGraph.registerNodeType("basic/cast", Cast);
class Console {
  // @BUG: Didn't output text to console, either in browser or cmd
  constructor() {
    this.mode = LiteGraph.ON_EVENT, this.size = [80, 30], this.addProperty("msg", ""), this.addInput("log", LiteGraph.EVENT), this.addInput("msg", 0);
  }
  onAction(t, s) {
    var n, o, l;
    var a = this.getInputData(1);
    a || (a = this.properties.msg), a || (a = "Event: " + s), t == "log" ? (n = console.log) == null || n.call(console, a) : t == "warn" ? (o = console.warn) == null || o.call(console, a) : t == "error" && ((l = console.error) == null || l.call(console, a));
  }
  onExecute() {
    var s;
    var t = this.getInputData(1);
    t || (t = this.properties.msg), t != null && typeof t != "undefined" && (this.properties.msg = t, (s = console.log) == null || s.call(console, t));
  }
  onGetInputs() {
    return [
      ["log", LiteGraph.ACTION],
      ["warn", LiteGraph.ACTION],
      ["error", LiteGraph.ACTION]
    ];
  }
}
b(Console, "title", "Console"), b(Console, "desc", "Show value inside the console");
LiteGraph.registerNodeType("basic/console", Console);
class Alert {
  constructor() {
    this.mode = LiteGraph.ON_EVENT, this.addProperty("msg", ""), this.addInput("", LiteGraph.EVENT), this.widget = this.addWidget("text", "Text", "", "msg"), this.widgets_up = !0, this.size = [200, 30];
  }
  onConfigure(t) {
    this.widget.value = t.properties.msg;
  }
  onAction() {
    var t = this.properties.msg;
    setTimeout(function() {
      alert(t);
    }, 10);
  }
}
b(Alert, "title", "Alert"), b(Alert, "desc", "Show an alert window"), b(Alert, "color", "#510");
LiteGraph.registerNodeType("basic/alert", Alert);
class NodeScript {
  constructor() {
    this.size = [60, 30], this.addProperty("onExecute", "return A;"), this.addInput("A", 0), this.addInput("B", 0), this.addOutput("out", 0), this._func = null, this.data = {};
  }
  onConfigure(t) {
    var s;
    t.properties.onExecute && LiteGraph.allow_scripts ? this.compileCode(t.properties.onExecute) : (s = console.warn) == null || s.call(console, "Script not compiled, LiteGraph.allow_scripts is false");
  }
  onPropertyChanged(t, s) {
    var a;
    t == "onExecute" && LiteGraph.allow_scripts ? this.compileCode(s) : (a = console.warn) == null || a.call(console, "Script not compiled, LiteGraph.allow_scripts is false");
  }
  compileCode(t) {
    var o, l, h, u;
    if (this._func = null, t.length > 256)
      (o = console.warn) == null || o.call(console, "Script too long, max 256 chars");
    else {
      for (var s = t.toLowerCase(), a = [
        "script",
        "body",
        "document",
        "eval",
        "nodescript",
        "function"
      ], n = 0; n < a.length; ++n)
        if (s.indexOf(a[n]) != -1) {
          (l = console.warn) == null || l.call(console, "invalid script");
          return;
        }
      try {
        this._func = new Function("A", "B", "C", "DATA", "node", t);
      } catch (p) {
        (h = console.error) == null || h.call(console, "Error parsing script"), (u = console.error) == null || u.call(console, p);
      }
    }
  }
  onExecute() {
    var n, o;
    if (this._func)
      try {
        var t = this.getInputData(0), s = this.getInputData(1), a = this.getInputData(2);
        this.setOutputData(0, this._func(t, s, a, this.data, this));
      } catch (l) {
        (n = console.error) == null || n.call(console, "Error in script"), (o = console.error) == null || o.call(console, l);
      }
  }
  onGetOutputs() {
    return [["C", ""]];
  }
}
b(NodeScript, "title", "Script"), b(NodeScript, "desc", "executes a code (max 256 characters)"), b(NodeScript, "widgets_info", { onExecute: { type: "code" } });
LiteGraph.registerNodeType("basic/script", NodeScript);
const Q = class Q {
  constructor() {
    this.addInput("A", 0), this.addInput("B", 0), this.addOutput("true", "boolean"), this.addOutput("false", "boolean"), this.addProperty("A", 1), this.addProperty("B", 1), this.addProperty("OP", "==", "enum", { values: Q.values }), this.addWidget("combo", "Op.", this.properties.OP, {
      property: "OP",
      values: Q.values
    }), this.size = [80, 60];
  }
  getTitle() {
    return "*A " + this.properties.OP + " *B";
  }
  onExecute() {
    var t = this.getInputData(0);
    t === void 0 ? t = this.properties.A : this.properties.A = t;
    var s = this.getInputData(1);
    s === void 0 ? s = this.properties.B : this.properties.B = s;
    var a = !1;
    if (typeof t == typeof s)
      switch (this.properties.OP) {
        case "==":
        case "!=":
          switch (a = !0, typeof t) {
            case "object":
              var n = Object.getOwnPropertyNames(t), o = Object.getOwnPropertyNames(s);
              if (n.length != o.length) {
                a = !1;
                break;
              }
              for (var l = 0; l < n.length; l++) {
                var h = n[l];
                if (t[h] !== s[h]) {
                  a = !1;
                  break;
                }
              }
              break;
            default:
              a = t == s;
          }
          this.properties.OP == "!=" && (a = !a);
          break;
      }
    this.setOutputData(0, a), this.setOutputData(1, !a);
  }
};
b(Q, "title", "Compare *"), b(Q, "desc", "evaluates condition between A and B"), b(Q, "values", ["==", "!="]), // [">", "<", "==", "!=", "<=", ">=", "||", "&&" ];
b(Q, "@OP", {
  type: "enum",
  title: "operation",
  values: Q.values
});
let GenericCompare = Q;
LiteGraph.registerNodeType("basic/CompareValues", GenericCompare);
class LogEvent {
  constructor() {
    this.size = [60, 30], this.addInput("event", LiteGraph.ACTION);
  }
  onAction(t, s) {
    var a;
    (a = console.log) == null || a.call(console, t, s);
  }
}
b(LogEvent, "title", "Log Event"), b(LogEvent, "desc", "Log event in console");
LiteGraph.registerNodeType("events/log", LogEvent);
class TriggerEvent {
  constructor() {
    this.size = [60, 30], this.addInput("if", ""), this.addOutput("true", LiteGraph.EVENT), this.addOutput("change", LiteGraph.EVENT), this.addOutput("false", LiteGraph.EVENT), this.properties = {
      only_on_change: !0,
      tooltip: "Triggers event if input evaluates to true"
    }, this.prev = 0;
  }
  onExecute(t, s) {
    var a = this.getInputData(0), n = a != this.prev;
    this.prev === 0 && (n = !1);
    var o = n && this.properties.only_on_change || !n && !this.properties.only_on_change;
    a && o && this.triggerSlot(0, t, null, s), !a && o && this.triggerSlot(2, t, null, s), n && this.triggerSlot(1, t, null, s), this.prev = a;
  }
}
b(TriggerEvent, "title", "TriggerEvent"), b(TriggerEvent, "desc", "Triggers event if input evaluates to true");
LiteGraph.registerNodeType("events/trigger", TriggerEvent);
var ut;
let Sequence$1 = (ut = class {
  // @ BUG: fails to construct Node
  constructor() {
    var t = this;
    this.addInput("", LiteGraph.ACTION), this.addInput("", LiteGraph.ACTION), this.addInput("", LiteGraph.ACTION), this.addOutput("", LiteGraph.EVENT), this.addOutput("", LiteGraph.EVENT), this.addOutput("", LiteGraph.EVENT), this.addWidget("button", "+", null, function() {
      t.addInput("", LiteGraph.ACTION), t.addOutput("", LiteGraph.EVENT);
    }), this.size = [90, 70], this.flags = { horizontal: !0, render_box: !1 };
  }
  getTitle() {
    return "";
  }
  onAction(t, s, a) {
    if (this.outputs) {
      a = a || {};
      for (var n = 0; n < this.outputs.length; ++n)
        a.action_call ? a.action_call = a.action_call + "_seq_" + n : a.action_call = this.id + "_" + (t || "action") + "_seq_" + n + "_" + Math.floor(Math.random() * 9999), this.triggerSlot(n, s, null, a);
    }
  }
}, b(ut, "title", "Sequence"), b(ut, "desc", "Triggers a sequence of events when an event arrives"), ut);
LiteGraph.registerNodeType("events/sequence", Sequence$1);
class WaitAll {
  constructor() {
    var t = this;
    this.addInput("", LiteGraph.ACTION), this.addInput("", LiteGraph.ACTION), this.addOutput("", LiteGraph.EVENT), this.addWidget("button", "+", null, function() {
      t.addInput("", LiteGraph.ACTION), t.size[0] = 90;
    }), this.size = [90, 70], this.ready = [];
  }
  getTitle() {
    return "";
  }
  onDrawBackground(t) {
    if (!this.flags.collapsed)
      for (var s = 0; s < this.inputs.length; ++s) {
        var a = s * LiteGraph.NODE_SLOT_HEIGHT + 10;
        t.fillStyle = this.ready[s] ? "#AFB" : "#000", t.fillRect(20, a, 10, 10);
      }
  }
  onAction(t, s, a, n) {
    if (n != null) {
      this.ready.length = this.outputs.length, this.ready[n] = !0;
      for (var o = 0; o < this.ready.length; ++o)
        if (!this.ready[o])
          return;
      this.reset(), this.triggerSlot(0);
    }
  }
  reset() {
    this.ready.length = 0;
  }
}
b(WaitAll, "title", "WaitAll"), b(WaitAll, "desc", "Wait until all input events arrive then triggers output");
LiteGraph.registerNodeType("events/waitAll", WaitAll);
class Stepper {
  constructor() {
    var t = this;
    this.properties = { index: 0 }, this.addInput("index", "number"), this.addInput("step", LiteGraph.ACTION), this.addInput("reset", LiteGraph.ACTION), this.addOutput("index", "number"), this.addOutput("", LiteGraph.EVENT), this.addOutput("", LiteGraph.EVENT), this.addOutput("", LiteGraph.EVENT, { removable: !0 }), this.addWidget("button", "+", null, function() {
      t.addOutput("", LiteGraph.EVENT, { removable: !0 });
    }), this.size = [120, 120], this.flags = { render_box: !1 };
  }
  onDrawBackground(t) {
    if (!this.flags.collapsed) {
      var s = this.properties.index || 0;
      t.fillStyle = "#AFB";
      var a = this.size[0], n = (s + 1) * LiteGraph.NODE_SLOT_HEIGHT + 4;
      t.beginPath(), t.moveTo(a - 30, n), t.lineTo(a - 30, n + LiteGraph.NODE_SLOT_HEIGHT), t.lineTo(a - 15, n + LiteGraph.NODE_SLOT_HEIGHT * 0.5), t.fill();
    }
  }
  onExecute() {
    var t = this.getInputData(0);
    t != null && (t = Math.floor(t), t = LiteGraph.clamp(
      t,
      0,
      this.outputs ? this.outputs.length - 2 : 0
    ), t != this.properties.index && (this.properties.index = t, this.triggerSlot(t + 1))), this.setOutputData(0, this.properties.index);
  }
  onAction(t, s) {
    if (t == "reset") this.properties.index = 0;
    else if (t == "step") {
      this.triggerSlot(this.properties.index + 1, s);
      var a = this.outputs ? this.outputs.length - 1 : 0;
      this.properties.index = (this.properties.index + 1) % a;
    }
  }
}
b(Stepper, "title", "Stepper"), b(Stepper, "desc", "Trigger events sequentially when an tick arrives");
LiteGraph.registerNodeType("events/stepper", Stepper);
class FilterEvent {
  constructor() {
    this.size = [60, 30], this.addInput("event", LiteGraph.ACTION), this.addOutput("event", LiteGraph.EVENT), this.properties = {
      equal_to: "",
      has_property: "",
      property_equal_to: ""
    };
  }
  onAction(t, s, a) {
    if (s != null && !(this.properties.equal_to && this.properties.equal_to != s)) {
      if (this.properties.has_property) {
        var n = s[this.properties.has_property];
        if (n == null || this.properties.property_equal_to && this.properties.property_equal_to != n)
          return;
      }
      this.triggerSlot(0, s, null, a);
    }
  }
}
b(FilterEvent, "title", "Filter Event"), b(FilterEvent, "desc", "Blocks events that do not match the filter");
LiteGraph.registerNodeType("events/filter", FilterEvent);
class EventBranch {
  constructor() {
    this.addInput("in", LiteGraph.ACTION), this.addInput("cond", "boolean"), this.addOutput("true", LiteGraph.EVENT), this.addOutput("false", LiteGraph.EVENT), this.size = [120, 60], this._value = !1;
  }
  onExecute() {
    this._value = this.getInputData(1);
  }
  onAction(t, s, a) {
    this._value = this.getInputData(1), this.triggerSlot(this._value ? 0 : 1, s, null, a);
  }
}
b(EventBranch, "title", "Branch"), b(EventBranch, "desc", "If condition is true, outputs triggers true, otherwise false");
LiteGraph.registerNodeType("events/branch", EventBranch);
class EventCounter {
  constructor() {
    this.addInput("inc", LiteGraph.ACTION), this.addInput("dec", LiteGraph.ACTION), this.addInput("reset", LiteGraph.ACTION), this.addOutput("change", LiteGraph.EVENT), this.addOutput("num", "number"), this.addProperty(
      "doCountExecution",
      !1,
      "boolean",
      { name: "Count Executions" }
    ), this.addWidget(
      "toggle",
      "Count Exec.",
      this.properties.doCountExecution,
      "doCountExecution"
    ), this.num = 0;
  }
  getTitle() {
    return this.flags.collapsed ? String(this.num) : this.title;
  }
  onAction(t) {
    var s = this.num;
    t == "inc" ? this.num += 1 : t == "dec" ? this.num -= 1 : t == "reset" && (this.num = 0), this.num != s && this.trigger("change", this.num);
  }
  onDrawBackground(t) {
    this.flags.collapsed || (t.fillStyle = "#AAA", t.font = "20px Arial", t.textAlign = "center", t.fillText(this.num, this.size[0] * 0.5, this.size[1] * 0.5));
  }
  onExecute() {
    this.properties.doCountExecution && (this.num += 1), this.setOutputData(1, this.num);
  }
}
b(EventCounter, "title", "Counter"), b(EventCounter, "desc", "Counts events");
LiteGraph.registerNodeType("events/counter", EventCounter);
class DelayEvent {
  constructor() {
    this.size = [60, 30], this.addProperty("time_in_ms", 1e3), this.addInput("event", LiteGraph.ACTION), this.addOutput("on_time", LiteGraph.EVENT), this._pending = [];
  }
  onAction(t, s, a) {
    var n = this.properties.time_in_ms;
    n <= 0 ? this.trigger(null, s, a) : this._pending.push([n, s]);
  }
  onExecute(t, s) {
    var a = this.graph.elapsed_time * 1e3;
    this.isInputConnected(1) && (this.properties.time_in_ms = this.getInputData(1));
    for (var n = 0; n < this._pending.length; ++n) {
      var o = this._pending[n];
      o[0] -= a, !(o[0] > 0) && (this._pending.splice(n, 1), --n, this.trigger(null, o[1], s));
    }
  }
  onGetInputs() {
    return [
      ["event", LiteGraph.ACTION],
      ["time_in_ms", "number"]
    ];
  }
}
b(DelayEvent, "title", "Delay"), b(DelayEvent, "desc", "Delays one event");
LiteGraph.registerNodeType("events/delay", DelayEvent);
const nt = class nt {
  constructor() {
    this.addProperty("interval", 1e3), this.addProperty("event", "tick"), this.addOutput("on_tick", LiteGraph.EVENT), this.time = 0, this.last_interval = 1e3, this.triggered = !1;
  }
  onStart() {
    this.time = 0;
  }
  getTitle() {
    return "Timer: " + this.last_interval.toString() + "ms";
  }
  onDrawBackground() {
    this.boxcolor = this.triggered ? nt.on_color : nt.off_color, this.triggered = !1;
  }
  onExecute() {
    var t = this.graph.elapsed_time * 1e3, s = this.time == 0;
    if (this.time += t, this.last_interval = Math.max(1, this.getInputOrProperty("interval") | 0), !s && (this.time < this.last_interval || isNaN(this.last_interval))) {
      this.inputs && this.inputs.length > 1 && this.inputs[1] && this.setOutputData(1, !1);
      return;
    }
    this.triggered = !0, this.time = this.time % this.last_interval, this.trigger("on_tick", this.properties.event), this.inputs && this.inputs.length > 1 && this.inputs[1] && this.setOutputData(1, !0);
  }
  onGetInputs() {
    return [["interval", "number"]];
  }
  onGetOutputs() {
    return [["tick", "boolean"]];
  }
};
b(nt, "title", "Timer"), b(nt, "desc", "Sends an event every N milliseconds");
let TimerEvent = nt;
TimerEvent.on_color = "#AAA";
TimerEvent.off_color = "#222";
LiteGraph.registerNodeType("events/timer", TimerEvent);
class SemaphoreEvent {
  constructor() {
    this.addInput("go", LiteGraph.ACTION), this.addInput("green", LiteGraph.ACTION), this.addInput("red", LiteGraph.ACTION), this.addOutput("continue", LiteGraph.EVENT), this.addOutput("blocked", LiteGraph.EVENT), this.addOutput("is_green", "boolean"), this._ready = !1, this.properties = {};
    var t = this;
    this.addWidget("button", "reset", "", function() {
      t._ready = !1;
    });
  }
  onExecute() {
    this.setOutputData(1, this._ready), this.boxcolor = this._ready ? "#9F9" : "#FA5";
  }
  onAction(t) {
    t == "go" ? this.triggerSlot(this._ready ? 0 : 1) : t == "green" ? this._ready = !0 : t == "red" && (this._ready = !1);
  }
}
b(SemaphoreEvent, "title", "Semaphore Event"), b(SemaphoreEvent, "desc", "Until both events are not triggered, it doesnt continue.");
LiteGraph.registerNodeType("events/semaphore", SemaphoreEvent);
class OnceEvent {
  constructor() {
    this.addInput("in", LiteGraph.ACTION), this.addInput("reset", LiteGraph.ACTION), this.addOutput("out", LiteGraph.EVENT), this._once = !1, this.properties = {};
    var t = this;
    this.addWidget("button", "reset", "", function() {
      t._once = !1;
    });
  }
  onAction(t, s) {
    t == "in" && !this._once ? (this._once = !0, this.triggerSlot(0, s)) : t == "reset" && (this._once = !1);
  }
}
b(OnceEvent, "title", "Once"), b(OnceEvent, "desc", "Only passes an event once, then gets locked");
LiteGraph.registerNodeType("events/once", OnceEvent);
class DataStore {
  constructor() {
    this.addInput("data", 0), this.addInput("assign", LiteGraph.ACTION), this.addOutput("data", 0), this._last_value = null, this.properties = { data: null, serialize: !0 };
    var t = this;
    this.addWidget("button", "store", "", function() {
      t.properties.data = t._last_value;
    });
  }
  onExecute() {
    this._last_value = this.getInputData(0), this.setOutputData(0, this.properties.data);
  }
  onAction() {
    this.properties.data = this._last_value;
  }
  onSerialize(t) {
    t.data != null && (!this.properties.serialize || t.data.constructor !== String && t.data.constructor !== Number && t.data.constructor !== Boolean && t.data.constructor !== Array && t.data.constructor !== Object) && (t.data = null);
  }
}
b(DataStore, "title", "Data Store"), b(DataStore, "desc", "Stores data and only changes when event is received");
LiteGraph.registerNodeType("basic/data_store", DataStore);
const H = class H {
  constructor() {
    this.addOutput("left_x_axis", "number"), this.addOutput("left_y_axis", "number"), this.addOutput("button_pressed", LiteGraph.EVENT), this.properties = { gamepad_index: 0, threshold: 0.1 }, this._left_axis = new Float32Array(2), this._right_axis = new Float32Array(2), this._triggers = new Float32Array(2), this._previous_buttons = new Uint8Array(17), this._current_buttons = new Uint8Array(17);
  }
  onExecute() {
    var t = this.getGamepad(), s = this.properties.threshold || 0;
    if (t && (this._left_axis[0] = Math.abs(t.xbox.axes.lx) > s ? t.xbox.axes.lx : 0, this._left_axis[1] = Math.abs(t.xbox.axes.ly) > s ? t.xbox.axes.ly : 0, this._right_axis[0] = Math.abs(t.xbox.axes.rx) > s ? t.xbox.axes.rx : 0, this._right_axis[1] = Math.abs(t.xbox.axes.ry) > s ? t.xbox.axes.ry : 0, this._triggers[0] = Math.abs(t.xbox.axes.ltrigger) > s ? t.xbox.axes.ltrigger : 0, this._triggers[1] = Math.abs(t.xbox.axes.rtrigger) > s ? t.xbox.axes.rtrigger : 0), this.outputs)
      for (var a = 0; a < this.outputs.length; a++) {
        var n = this.outputs[a];
        if (!(!n.links || !n.links.length)) {
          var o = null;
          if (t)
            switch (n.name) {
              case "left_axis":
                o = this._left_axis;
                break;
              case "right_axis":
                o = this._right_axis;
                break;
              case "left_x_axis":
                o = this._left_axis[0];
                break;
              case "left_y_axis":
                o = this._left_axis[1];
                break;
              case "right_x_axis":
                o = this._right_axis[0];
                break;
              case "right_y_axis":
                o = this._right_axis[1];
                break;
              case "trigger_left":
                o = this._triggers[0];
                break;
              case "trigger_right":
                o = this._triggers[1];
                break;
              case "a_button":
                o = t.xbox.buttons.a ? 1 : 0;
                break;
              case "b_button":
                o = t.xbox.buttons.b ? 1 : 0;
                break;
              case "x_button":
                o = t.xbox.buttons.x ? 1 : 0;
                break;
              case "y_button":
                o = t.xbox.buttons.y ? 1 : 0;
                break;
              case "lb_button":
                o = t.xbox.buttons.lb ? 1 : 0;
                break;
              case "rb_button":
                o = t.xbox.buttons.rb ? 1 : 0;
                break;
              case "ls_button":
                o = t.xbox.buttons.ls ? 1 : 0;
                break;
              case "rs_button":
                o = t.xbox.buttons.rs ? 1 : 0;
                break;
              case "hat_left":
                o = t.xbox.hatmap & H.LEFT;
                break;
              case "hat_right":
                o = t.xbox.hatmap & H.RIGHT;
                break;
              case "hat_up":
                o = t.xbox.hatmap & H.UP;
                break;
              case "hat_down":
                o = t.xbox.hatmap & H.DOWN;
                break;
              case "hat":
                o = t.xbox.hatmap;
                break;
              case "start_button":
                o = t.xbox.buttons.start ? 1 : 0;
                break;
              case "back_button":
                o = t.xbox.buttons.back ? 1 : 0;
                break;
              case "button_pressed":
                for (var l = 0; l < this._current_buttons.length; ++l)
                  this._current_buttons[l] && !this._previous_buttons[l] && this.triggerSlot(a, H.buttons[l]);
                break;
            }
          else
            switch (n.name) {
              case "button_pressed":
                break;
              case "left_axis":
              case "right_axis":
                o = H.zero;
                break;
              default:
                o = 0;
            }
          this.setOutputData(a, o);
        }
      }
  }
  getGamepad() {
    var t = navigator.getGamepads || navigator.webkitGetGamepads || navigator.mozGetGamepads;
    if (!t)
      return null;
    var s = t.call(navigator), a = null;
    this._previous_buttons.set(this._current_buttons);
    for (var n = this.properties.gamepad_index; n < 4; n++)
      if (s[n]) {
        a = s[n];
        var o = this.xbox_mapping;
        o || (o = this.xbox_mapping = {
          axes: [],
          buttons: {},
          hat: "",
          hatmap: H.CENTER
        }), o.axes.lx = a.axes[0], o.axes.ly = a.axes[1], o.axes.rx = a.axes[2], o.axes.ry = a.axes[3], o.axes.ltrigger = a.buttons[6].value, o.axes.rtrigger = a.buttons[7].value, o.hat = "", o.hatmap = H.CENTER;
        for (var l = 0; l < a.buttons.length; l++)
          if (this._current_buttons[l] = a.buttons[l].pressed, l < 12)
            o.buttons[H.mapping_array[l]] = a.buttons[l].pressed, a.buttons[l].was_pressed && this.trigger(H.mapping_array[l] + "_button_event");
          else
            switch (l) {
              case 12:
                a.buttons[l].pressed && (o.hat += "up", o.hatmap |= H.UP);
                break;
              case 13:
                a.buttons[l].pressed && (o.hat += "down", o.hatmap |= H.DOWN);
                break;
              case 14:
                a.buttons[l].pressed && (o.hat += "left", o.hatmap |= H.LEFT);
                break;
              case 15:
                a.buttons[l].pressed && (o.hat += "right", o.hatmap |= H.RIGHT);
                break;
              case 16:
                o.buttons.home = a.buttons[l].pressed;
                break;
            }
        return a.xbox = o, a;
      }
  }
  onDrawBackground(t) {
    if (!this.flags.collapsed) {
      var s = this._left_axis, a = this._right_axis;
      t.strokeStyle = "#88A", t.strokeRect(
        (s[0] + 1) * 0.5 * this.size[0] - 4,
        (s[1] + 1) * 0.5 * this.size[1] - 4,
        8,
        8
      ), t.strokeStyle = "#8A8", t.strokeRect(
        (a[0] + 1) * 0.5 * this.size[0] - 4,
        (a[1] + 1) * 0.5 * this.size[1] - 4,
        8,
        8
      );
      var n = this.size[1] / this._current_buttons.length;
      t.fillStyle = "#AEB";
      for (var o = 0; o < this._current_buttons.length; ++o)
        this._current_buttons[o] && t.fillRect(0, n * o, 6, n);
    }
  }
  onGetOutputs() {
    return [
      ["left_axis", "vec2"],
      ["right_axis", "vec2"],
      ["left_x_axis", "number"],
      ["left_y_axis", "number"],
      ["right_x_axis", "number"],
      ["right_y_axis", "number"],
      ["trigger_left", "number"],
      ["trigger_right", "number"],
      ["a_button", "number"],
      ["b_button", "number"],
      ["x_button", "number"],
      ["y_button", "number"],
      ["lb_button", "number"],
      ["rb_button", "number"],
      ["ls_button", "number"],
      ["rs_button", "number"],
      ["start_button", "number"],
      ["back_button", "number"],
      ["a_button_event", LiteGraph.EVENT],
      ["b_button_event", LiteGraph.EVENT],
      ["x_button_event", LiteGraph.EVENT],
      ["y_button_event", LiteGraph.EVENT],
      ["lb_button_event", LiteGraph.EVENT],
      ["rb_button_event", LiteGraph.EVENT],
      ["ls_button_event", LiteGraph.EVENT],
      ["rs_button_event", LiteGraph.EVENT],
      ["start_button_event", LiteGraph.EVENT],
      ["back_button_event", LiteGraph.EVENT],
      ["hat_left", "number"],
      ["hat_right", "number"],
      ["hat_up", "number"],
      ["hat_down", "number"],
      ["hat", "number"],
      ["button_pressed", LiteGraph.EVENT]
    ];
  }
};
b(H, "title", "Gamepad"), b(H, "desc", "gets the input of the gamepad"), b(H, "zero", new Float32Array(2)), b(H, "buttons", [
  "a",
  "b",
  "x",
  "y",
  "lb",
  "rb",
  "lt",
  "rt",
  "back",
  "start",
  "ls",
  "rs",
  "home"
]), b(H, "mapping", {
  a: 0,
  b: 1,
  x: 2,
  y: 3,
  lb: 4,
  rb: 5,
  lt: 6,
  rt: 7,
  back: 8,
  start: 9,
  ls: 10,
  rs: 11
}), b(H, "mapping_array", [
  "a",
  "b",
  "x",
  "y",
  "lb",
  "rb",
  "lt",
  "rt",
  "back",
  "start",
  "ls",
  "rs"
]);
let GamepadInput = H;
GamepadInput.CENTER = 0;
GamepadInput.LEFT = 1;
GamepadInput.RIGHT = 2;
GamepadInput.UP = 4;
GamepadInput.DOWN = 8;
LiteGraph.registerNodeType("input/gamepad", GamepadInput);
class Converter {
  constructor() {
    this.addInput("in", 0), this.addOutput("out", 0), this.size = [80, 30];
  }
  onExecute() {
    var t = this.getInputData(0);
    if (t != null && this.outputs)
      for (var s = 0; s < this.outputs.length; s++) {
        var a = this.outputs[s];
        if (!(!a.links || !a.links.length)) {
          var n = null;
          switch (a.name) {
            case "number":
              n = t.length ? t[0] : parseFloat(t);
              break;
            case "vec2":
            case "vec3":
            case "vec4":
              n = null;
              var o = 1;
              switch (a.name) {
                case "vec2":
                  o = 2;
                  break;
                case "vec3":
                  o = 3;
                  break;
                case "vec4":
                  o = 4;
                  break;
              }
              if (n = new Float32Array(o), t.length)
                for (var l = 0; l < t.length && l < n.length; l++)
                  n[l] = t[l];
              else
                n[0] = parseFloat(t);
              break;
          }
          this.setOutputData(s, n);
        }
      }
  }
  onGetOutputs() {
    return [
      ["number", "number"],
      ["vec2", "vec2"],
      ["vec3", "vec3"],
      ["vec4", "vec4"]
    ];
  }
}
b(Converter, "title", "Converter"), b(Converter, "desc", "type A to type B");
LiteGraph.registerNodeType("math/converter", Converter);
class Bypass {
  constructor() {
    this.addInput("in"), this.addOutput("out"), this.size = [80, 30];
  }
  onExecute() {
    var t = this.getInputData(0);
    this.setOutputData(0, t);
  }
}
b(Bypass, "title", "Bypass"), b(Bypass, "desc", "removes the type");
LiteGraph.registerNodeType("math/bypass", Bypass);
class ToNumber {
  constructor() {
    this.addInput("in"), this.addOutput("out");
  }
  onExecute() {
    var t = this.getInputData(0);
    this.setOutputData(0, Number(t));
  }
}
b(ToNumber, "title", "to Number"), b(ToNumber, "desc", "Cast to number");
LiteGraph.registerNodeType("math/to_number", ToNumber);
class MathRange {
  constructor() {
    this.addInput("in", "number", { locked: !0 }), this.addOutput("out", "number", { locked: !0 }), this.addOutput("clamped", "number", { locked: !0 }), this.addProperty("in", 0), this.addProperty("in_min", 0), this.addProperty("in_max", 1), this.addProperty("out_min", 0), this.addProperty("out_max", 1), this.size = [120, 50];
  }
  getTitle() {
    return this.flags.collapsed ? (this._last_v || 0).toFixed(2) : this.title;
  }
  onExecute() {
    let t;
    if (this.inputs)
      for (let l = 0; l < this.inputs.length; l++) {
        let h = this.inputs[l];
        t = this.getInputData(l), t !== void 0 && (this.properties[h.name] = t);
      }
    t = this.properties.in, (t == null || t.constructor !== Number) && (t = 0);
    var s = this.properties.in_min, a = this.properties.in_max, n = this.properties.out_min, o = this.properties.out_max;
    this._last_v = (t - s) / (a - s) * (o - n) + n, this.setOutputData(0, this._last_v), this.setOutputData(1, LiteGraph.clamp(this._last_v, n, o));
  }
  onDrawBackground(t) {
    this._last_v ? this.outputs[0].label = this._last_v.toFixed(3) : this.outputs[0].label = "?";
  }
  onGetInputs() {
    return [
      ["in_min", "number"],
      ["in_max", "number"],
      ["out_min", "number"],
      ["out_max", "number"]
    ];
  }
}
b(MathRange, "title", "Range"), b(MathRange, "desc", "Convert a number from one range to another");
LiteGraph.registerNodeType("math/range", MathRange);
class MathRand {
  constructor() {
    this.addOutput("value", "number"), this.addProperty("min", 0), this.addProperty("max", 1), this.size = [80, 30];
  }
  onExecute() {
    if (this.inputs)
      for (var t = 0; t < this.inputs.length; t++) {
        var s = this.inputs[t], a = this.getInputData(t);
        a !== void 0 && (this.properties[s.name] = a);
      }
    var n = this.properties.min, o = this.properties.max;
    this._last_v = Math.random() * (o - n) + n, this.setOutputData(0, this._last_v);
  }
  onDrawBackground(t) {
    this.outputs[0].label = (this._last_v || 0).toFixed(3);
  }
  onGetInputs() {
    return [
      ["min", "number"],
      ["max", "number"]
    ];
  }
}
b(MathRand, "title", "Rand"), b(MathRand, "desc", "Random number");
LiteGraph.registerNodeType("math/rand", MathRand);
const Y = class Y {
  constructor() {
    this.addInput("in", "number"), this.addOutput("out", "number"), this.addProperty("min", 0), this.addProperty("max", 1), this.addProperty("smooth", !0), this.addProperty("seed", 0), this.addProperty("octaves", 1), this.addProperty("persistence", 0.8), this.addProperty("speed", 1), this.size = [90, 30];
  }
  static getValue(t, s) {
    if (!Y.data) {
      Y.data = new Float32Array(1024);
      for (var a = 0; a < Y.data.length; ++a)
        Y.data[a] = Math.random();
    }
    t = t % 1024, t < 0 && (t += 1024);
    var n = Math.floor(t);
    t -= n;
    var o = Y.data[n], l = Y.data[n == 1023 ? 0 : n + 1];
    return s && (t = t * t * t * (t * (t * 6 - 15) + 10)), o * (1 - t) + l * t;
  }
  onExecute() {
    var t = this.getInputData(0) || 0, s = this.properties.octaves || 1, a = 0, n = 1, o = this.properties.seed || 0;
    t += o;
    for (var l = this.properties.speed || 1, h = 0, u = 0; u < s && (a += Y.getValue(t * (1 + u) * l, this.properties.smooth) * n, h += n, n *= this.properties.persistence, !(n < 1e-3)); ++u)
      ;
    a /= h;
    var p = this.properties.min, c = this.properties.max;
    this._last_v = a * (c - p) + p, this.setOutputData(0, this._last_v);
  }
  onDrawBackground(t) {
    this.outputs[0].label = (this._last_v || 0).toFixed(3);
  }
};
b(Y, "title", "Noise"), b(Y, "desc", "Random number with temporal continuity"), b(Y, "data", null);
let MathNoise = Y;
LiteGraph.registerNodeType("math/noise", MathNoise);
class MathSpikes {
  constructor() {
    this.addOutput("out", "number"), this.addProperty("min_time", 1), this.addProperty("max_time", 2), this.addProperty("duration", 0.2), this.size = [90, 30], this._remaining_time = 0, this._blink_time = 0;
  }
  onExecute() {
    var t = this.graph.elapsed_time;
    this._remaining_time -= t, this._blink_time -= t;
    var s = 0;
    if (this._blink_time > 0) {
      var a = this._blink_time / this.properties.duration;
      s = 1 / (Math.pow(a * 8 - 4, 4) + 1);
    }
    this._remaining_time < 0 ? (this._remaining_time = Math.random() * (this.properties.max_time - this.properties.min_time) + this.properties.min_time, this._blink_time = this.properties.duration, this.boxcolor = "#FFF") : this.boxcolor = "#000", this.setOutputData(0, s);
  }
}
LiteGraph.registerNodeType("math/spikes", MathSpikes);
class MathClamp {
  constructor() {
    this.addInput("in", "number"), this.addOutput("out", "number"), this.size = [80, 30], this.addProperty("min", 0), this.addProperty("max", 1);
  }
  // MathClamp.filter = "shader";
  onExecute() {
    var t = this.getInputData(0);
    t != null && (t = Math.max(this.properties.min, t), t = Math.min(this.properties.max, t), this.setOutputData(0, t));
  }
  getCode() {
    var t = "";
    return this.isInputConnected(0) && (t += "clamp({{0}}," + this.properties.min + "," + this.properties.max + ")"), t;
  }
}
b(MathClamp, "title", "Clamp"), b(MathClamp, "desc", "Clamp number between min and max");
LiteGraph.registerNodeType("math/clamp", MathClamp);
class MathLerp {
  constructor() {
    this.properties = { f: 0.5 }, this.addInput("A", "number"), this.addInput("B", "number"), this.addOutput("out", "number");
  }
  onExecute() {
    var t = this.getInputData(0);
    t == null && (t = 0);
    var s = this.getInputData(1);
    s == null && (s = 0);
    var a = this.properties.f, n = this.getInputData(2);
    n !== void 0 && (a = n), this.setOutputData(0, t * (1 - a) + s * a);
  }
  onGetInputs() {
    return [["f", "number"]];
  }
}
b(MathLerp, "title", "Lerp"), b(MathLerp, "desc", "Linear Interpolation");
LiteGraph.registerNodeType("math/lerp", MathLerp);
class MathAbs {
  constructor() {
    this.addInput("in", "number"), this.addOutput("out", "number"), this.size = [80, 30];
  }
  onExecute() {
    var t = this.getInputData(0);
    t != null && this.setOutputData(0, Math.abs(t));
  }
}
b(MathAbs, "title", "Abs"), b(MathAbs, "desc", "Absolute");
LiteGraph.registerNodeType("math/abs", MathAbs);
class MathFloor {
  constructor() {
    this.addInput("in", "number"), this.addOutput("out", "number"), this.size = [80, 30];
  }
  onExecute() {
    var t = this.getInputData(0);
    t != null && this.setOutputData(0, Math.floor(t));
  }
}
b(MathFloor, "title", "Floor"), b(MathFloor, "desc", "Floor number to remove fractional part");
LiteGraph.registerNodeType("math/floor", MathFloor);
class MathFrac {
  constructor() {
    this.addInput("in", "number"), this.addOutput("out", "number"), this.size = [80, 30];
  }
  onExecute() {
    var t = this.getInputData(0);
    t != null && this.setOutputData(0, t % 1);
  }
}
b(MathFrac, "title", "Frac"), b(MathFrac, "desc", "Returns fractional part");
LiteGraph.registerNodeType("math/frac", MathFrac);
class MathSmoothStep {
  constructor() {
    this.addInput("in", "number"), this.addOutput("out", "number"), this.size = [80, 30], this.properties = { A: 0, B: 1 };
  }
  onExecute() {
    var t = this.getInputData(0);
    if (t !== void 0) {
      var s = this.properties.A, a = this.properties.B;
      t = LiteGraph.clamp((t - s) / (a - s), 0, 1), t = t * t * (3 - 2 * t), this.setOutputData(0, t);
    }
  }
}
b(MathSmoothStep, "title", "Smoothstep"), b(MathSmoothStep, "desc", "Smoothstep");
LiteGraph.registerNodeType("math/smoothstep", MathSmoothStep);
class MathScale {
  constructor() {
    this.addInput("in", "number", { label: "" }), this.addOutput("out", "number", { label: "" }), this.size = [80, 30], this.addProperty("factor", 1);
  }
  onExecute() {
    var t = this.getInputData(0);
    t != null && this.setOutputData(0, t * this.properties.factor);
  }
}
b(MathScale, "title", "Scale"), b(MathScale, "desc", "v * factor");
LiteGraph.registerNodeType("math/scale", MathScale);
class Gate {
  constructor() {
    this.addInput("v", "boolean"), this.addInput("A"), this.addInput("B"), this.addOutput("out");
  }
  onExecute() {
    var t = this.getInputData(0);
    this.setOutputData(0, this.getInputData(t ? 1 : 2));
  }
}
b(Gate, "title", "Gate"), b(Gate, "desc", "if v is true, then outputs A, otherwise B");
LiteGraph.registerNodeType("math/gate", Gate);
class MathAverageFilter {
  constructor() {
    this.addInput("in", "number"), this.addOutput("out", "number"), this.size = [80, 30], this.addProperty("samples", 10), this._values = new Float32Array(10), this._current = 0;
  }
  onExecute() {
    var t = this.getInputData(0);
    t == null && (t = 0);
    var s = this._values.length;
    this._values[this._current % s] = t, this._current += 1, this._current > s && (this._current = 0);
    for (var a = 0, n = 0; n < s; ++n)
      a += this._values[n];
    this.setOutputData(0, a / s);
  }
  onPropertyChanged(t, s) {
    s < 1 && (s = 1), this.properties.samples = Math.round(s);
    var a = this._values;
    this._values = new Float32Array(this.properties.samples), a.length <= this._values.length ? this._values.set(a) : this._values.set(a.subarray(0, this._values.length));
  }
  onPropertyChanged(t, s) {
    t == "formula" && (this.code_widget.value = s);
  }
}
b(MathAverageFilter, "title", "Average"), b(MathAverageFilter, "desc", "Average Filter");
LiteGraph.registerNodeType("math/average", MathAverageFilter);
class MathTendTo {
  constructor() {
    this.addInput("in", "number"), this.addOutput("out", "number"), this.addProperty("factor", 0.1), this.size = [80, 30], this._value = null;
  }
  onExecute() {
    var t = this.getInputData(0);
    t == null && (t = 0);
    var s = this.properties.factor;
    this._value == null ? this._value = t : this._value = this._value * (1 - s) + t * s, this.setOutputData(0, this._value);
  }
}
b(MathTendTo, "title", "TendTo"), b(MathTendTo, "desc", "moves the output value always closer to the input");
LiteGraph.registerNodeType("math/tendTo", MathTendTo);
const X = class X {
  constructor() {
    this.addInput("A", "number,array,object"), this.addInput("B", "number"), this.addOutput("=", "number"), this.addProperty("A", 1), this.addProperty("B", 1), this.addProperty("OP", "+", "enum", { values: X.values }), this._func = X.funcs[this.properties.OP], this._result = [];
  }
  getTitle() {
    return this.properties.OP == "max" || this.properties.OP == "min" ? this.properties.OP + "(A,B)" : "A " + this.properties.OP + " B";
  }
  setValue(t) {
    typeof t == "string" && (t = parseFloat(t)), this.properties.value = t;
  }
  onPropertyChanged(t, s) {
    var a;
    t == "OP" && (this._func = X.funcs[this.properties.OP], this._func || ((a = console.warn) == null || a.call(console, "Unknown operation: " + this.properties.OP), this._func = function(n) {
      return n;
    }));
  }
  onExecute() {
    var t = this.getInputData(0), s = this.getInputData(1);
    t != null ? t.constructor === Number && (this.properties.A = t) : t = this.properties.A, s != null ? this.properties.B = s : s = this.properties.B;
    var a = X.funcs[this.properties.OP], n;
    if (t.constructor === Number)
      n = 0, n = a(t, s);
    else if (t.constructor === Array) {
      n = this._result, n.length = t.length;
      for (let o = 0; o < t.length; ++o)
        n[o] = a(t[o], s);
    } else {
      n = {};
      for (let o in t)
        n[o] = a(t[o], s);
    }
    this.setOutputData(0, n);
  }
  onDrawBackground(t) {
    this.flags.collapsed || (t.font = "40px Arial", t.fillStyle = "#666", t.textAlign = "center", t.fillText(
      this.properties.OP,
      this.size[0] * 0.5,
      (this.size[1] + LiteGraph.NODE_TITLE_HEIGHT) * 0.5
    ), t.textAlign = "left");
  }
};
b(X, "title", "Operation"), b(X, "desc", "Easy math operators"), b(X, "values", ["+", "-", "*", "/", "%", "^", "max", "min"]), b(X, "funcs", {
  "+": function(t, s) {
    return t + s;
  },
  "-": function(t, s) {
    return t - s;
  },
  x: function(t, s) {
    return t * s;
  },
  X: function(t, s) {
    return t * s;
  },
  "*": function(t, s) {
    return t * s;
  },
  "/": function(t, s) {
    return t / s;
  },
  "%": function(t, s) {
    return t % s;
  },
  "^": function(t, s) {
    return Math.pow(t, s);
  },
  max: function(t, s) {
    return Math.max(t, s);
  },
  min: function(t, s) {
    return Math.min(t, s);
  }
}), b(X, "@OP", {
  type: "enum",
  title: "operation",
  values: X.values
}), b(X, "size", [100, 60]);
let MathOperation = X;
LiteGraph.registerNodeType("math/operation", MathOperation);
LiteGraph.registerSearchboxExtra("math/operation", "MAX", {
  properties: { OP: "max" },
  title: "MAX()"
});
LiteGraph.registerSearchboxExtra("math/operation", "MIN", {
  properties: { OP: "min" },
  title: "MIN()"
});
class MathCompare {
  constructor() {
    this.addInput("A", "number"), this.addInput("B", "number"), this.addOutput("A==B", "boolean"), this.addOutput("A!=B", "boolean"), this.addProperty("A", 0), this.addProperty("B", 0);
  }
  onExecute() {
    var t = this.getInputData(0), s = this.getInputData(1);
    t !== void 0 ? this.properties.A = t : t = this.properties.A, s !== void 0 ? this.properties.B = s : s = this.properties.B;
    for (var a = 0, n = this.outputs.length; a < n; ++a) {
      var o = this.outputs[a];
      if (!(!o.links || !o.links.length)) {
        var l;
        switch (o.name) {
          case "A==B":
            l = t == s;
            break;
          case "A!=B":
            l = t != s;
            break;
          case "A>B":
            l = t > s;
            break;
          case "A<B":
            l = t < s;
            break;
          case "A<=B":
            l = t <= s;
            break;
          case "A>=B":
            l = t >= s;
            break;
        }
        this.setOutputData(a, l);
      }
    }
  }
  onGetOutputs() {
    return [
      ["A==B", "boolean"],
      ["A!=B", "boolean"],
      ["A>B", "boolean"],
      ["A<B", "boolean"],
      ["A>=B", "boolean"],
      ["A<=B", "boolean"]
    ];
  }
}
b(MathCompare, "title", "Compare"), b(MathCompare, "desc", "compares between two values");
LiteGraph.registerNodeType("math/compare", MathCompare);
LiteGraph.registerSearchboxExtra("math/compare", "==", {
  outputs: [["A==B", "boolean"]],
  title: "A==B"
});
LiteGraph.registerSearchboxExtra("math/compare", "!=", {
  outputs: [["A!=B", "boolean"]],
  title: "A!=B"
});
LiteGraph.registerSearchboxExtra("math/compare", ">", {
  outputs: [["A>B", "boolean"]],
  title: "A>B"
});
LiteGraph.registerSearchboxExtra("math/compare", "<", {
  outputs: [["A<B", "boolean"]],
  title: "A<B"
});
LiteGraph.registerSearchboxExtra("math/compare", ">=", {
  outputs: [["A>=B", "boolean"]],
  title: "A>=B"
});
LiteGraph.registerSearchboxExtra("math/compare", "<=", {
  outputs: [["A<=B", "boolean"]],
  title: "A<=B"
});
const tt = class tt {
  constructor() {
    this.addInput("A", "number"), this.addInput("B", "number"), this.addOutput("true", "boolean"), this.addOutput("false", "boolean"), this.addProperty("A", 1), this.addProperty("B", 1), this.addProperty("OP", ">", "enum", { values: tt.values }), this.addWidget("combo", "Cond.", this.properties.OP, {
      property: "OP",
      values: tt.values
    }), this.size = [80, 60];
  }
  getTitle() {
    return "A " + this.properties.OP + " B";
  }
  onExecute() {
    var t = this.getInputData(0);
    t === void 0 ? t = this.properties.A : this.properties.A = t;
    var s = this.getInputData(1);
    s === void 0 ? s = this.properties.B : this.properties.B = s;
    var a = !0;
    switch (this.properties.OP) {
      case ">":
        a = t > s;
        break;
      case "<":
        a = t < s;
        break;
      case "==":
        a = t == s;
        break;
      case "!=":
        a = t != s;
        break;
      case "<=":
        a = t <= s;
        break;
      case ">=":
        a = t >= s;
        break;
      case "||":
        a = t || s;
        break;
      case "&&":
        a = t && s;
        break;
    }
    this.setOutputData(0, a), this.setOutputData(1, !a);
  }
};
b(tt, "title", "Condition"), b(tt, "desc", "evaluates condition between A and B"), b(tt, "values", [">", "<", "==", "!=", "<=", ">=", "||", "&&"]), b(tt, "@OP", {
  type: "enum",
  title: "operation",
  values: tt.values
});
let MathCondition = tt;
LiteGraph.registerNodeType("math/condition", MathCondition);
class MathBranch {
  constructor() {
    this.addInput("in", 0), this.addInput("cond", "boolean"), this.addOutput("true", 0), this.addOutput("false", 0), this.size = [80, 60];
  }
  onExecute() {
    var t = this.getInputData(0), s = this.getInputData(1);
    s ? (this.setOutputData(0, t), this.setOutputData(1, null)) : (this.setOutputData(0, null), this.setOutputData(1, t));
  }
}
b(MathBranch, "title", "Branch"), b(MathBranch, "desc", "If condition is true, outputs IN in true, otherwise in false");
LiteGraph.registerNodeType("math/branch", MathBranch);
class MathAccumulate {
  constructor() {
    this.addInput("inc", "number"), this.addOutput("total", "number"), this.addProperty("increment", 1), this.addProperty("value", 0);
  }
  onExecute() {
    this.properties.value === null && (this.properties.value = 0);
    var t = this.getInputData(0);
    t !== null ? this.properties.value += t : this.properties.value += this.properties.increment, this.setOutputData(0, this.properties.value);
  }
}
b(MathAccumulate, "title", "Accumulate"), b(MathAccumulate, "desc", "Increments a value every time");
LiteGraph.registerNodeType("math/accumulate", MathAccumulate);
class MathTrigonometry {
  constructor() {
    this.addInput("v", "number"), this.addOutput("sin", "number"), this.addProperty("amplitude", 1), this.addProperty("offset", 0), this.bgImageUrl = "nodes/imgs/icon-sin.png";
  }
  // MathTrigonometry.filter = "shader";
  onExecute() {
    var t = this.getInputData(0);
    t == null && (t = 0);
    var s = this.properties.amplitude, a = this.findInputSlot("amplitude");
    a != -1 && (s = this.getInputData(a));
    var n = this.properties.offset;
    a = this.findInputSlot("offset"), a != -1 && (n = this.getInputData(a));
    for (var o = 0, l = this.outputs.length; o < l; ++o) {
      var h = this.outputs[o], u;
      switch (h.name) {
        case "sin":
          u = Math.sin(t);
          break;
        case "cos":
          u = Math.cos(t);
          break;
        case "tan":
          u = Math.tan(t);
          break;
        case "asin":
          u = Math.asin(t);
          break;
        case "acos":
          u = Math.acos(t);
          break;
        case "atan":
          u = Math.atan(t);
          break;
      }
      this.setOutputData(o, s * u + n);
    }
  }
  onGetInputs() {
    return [
      ["v", "number"],
      ["amplitude", "number"],
      ["offset", "number"]
    ];
  }
  onGetOutputs() {
    return [
      ["sin", "number"],
      ["cos", "number"],
      ["tan", "number"],
      ["asin", "number"],
      ["acos", "number"],
      ["atan", "number"]
    ];
  }
}
b(MathTrigonometry, "title", "Trigonometry"), b(MathTrigonometry, "desc", "Sin Cos Tan");
LiteGraph.registerNodeType("math/trigonometry", MathTrigonometry);
LiteGraph.registerSearchboxExtra("math/trigonometry", "SIN()", {
  outputs: [["sin", "number"]],
  title: "SIN()"
});
LiteGraph.registerSearchboxExtra("math/trigonometry", "COS()", {
  outputs: [["cos", "number"]],
  title: "COS()"
});
LiteGraph.registerSearchboxExtra("math/trigonometry", "TAN()", {
  outputs: [["tan", "number"]],
  title: "TAN()"
});
class MathFormula {
  constructor() {
    this.addInput("x", "number"), this.addInput("y", "number"), this.addOutput("", "number"), this.properties = { x: 1, y: 1, formula: "x+y" }, this.code_widget = this.addWidget(
      "text",
      "F(x,y)",
      this.properties.formula,
      function(t, s, a) {
        a.properties.formula = t;
      }
    ), this.addWidget("toggle", "allow", LiteGraph.allow_scripts, function(t) {
      LiteGraph.allow_scripts = t;
    }), this._func = null;
  }
  onExecute() {
    if (LiteGraph.allow_scripts) {
      var t = this.getInputData(0), s = this.getInputData(1);
      t != null ? this.properties.x = t : t = this.properties.x, s != null ? this.properties.y = s : s = this.properties.y;
      var a;
      try {
        (!this._func || this._func_code != this.properties.formula) && (this._func = new Function(
          "x",
          "y",
          "TIME",
          "return " + this.properties.formula
        ), this._func_code = this.properties.formula), a = this._func(t, s, this.graph.globaltime), this.boxcolor = null;
      } catch {
        this.boxcolor = "red";
      }
      this.setOutputData(0, a);
    }
  }
  getTitle() {
    return this._func_code || "Formula";
  }
  onDrawBackground() {
    var t = this.properties.formula;
    this.outputs && this.outputs.length && (this.outputs[0].label = t);
  }
}
b(MathFormula, "title", "Formula"), b(MathFormula, "desc", "Compute formula"), b(MathFormula, "size", [160, 100]);
LiteGraph.registerNodeType("math/formula", MathFormula);
class Math3DVec2ToXY {
  constructor() {
    this.addInput("vec2", "vec2"), this.addOutput("x", "number"), this.addOutput("y", "number");
  }
  onExecute() {
    var t = this.getInputData(0);
    t != null && (this.setOutputData(0, t[0]), this.setOutputData(1, t[1]));
  }
}
b(Math3DVec2ToXY, "title", "Vec2->XY"), b(Math3DVec2ToXY, "desc", "vector 2 to components");
LiteGraph.registerNodeType("math3d/vec2-to-xy", Math3DVec2ToXY);
class Math3DXYToVec2 {
  constructor() {
    this.addInputs([
      ["x", "number"],
      ["y", "number"]
    ]), this.addOutput("vec2", "vec2"), this.properties = { x: 0, y: 0 }, this._data = new Float32Array(2);
  }
  onExecute() {
    var t = this.getInputData(0);
    t == null && (t = this.properties.x);
    var s = this.getInputData(1);
    s == null && (s = this.properties.y);
    var a = this._data;
    a[0] = t, a[1] = s, this.setOutputData(0, a);
  }
}
b(Math3DXYToVec2, "title", "XY->Vec2"), b(Math3DXYToVec2, "desc", "components to vector2");
LiteGraph.registerNodeType("math3d/xy-to-vec2", Math3DXYToVec2);
class Math3DVec3ToXYZ {
  constructor() {
    this.addInput("vec3", "vec3"), this.addOutput("x", "number"), this.addOutput("y", "number"), this.addOutput("z", "number");
  }
  onExecute() {
    var t = this.getInputData(0);
    t != null && (this.setOutputData(0, t[0]), this.setOutputData(1, t[1]), this.setOutputData(2, t[2]));
  }
}
b(Math3DVec3ToXYZ, "title", "Vec3->XYZ"), b(Math3DVec3ToXYZ, "desc", "vector 3 to components");
LiteGraph.registerNodeType("math3d/vec3-to-xyz", Math3DVec3ToXYZ);
class Math3DXYZToVec3 {
  constructor() {
    this.addInputs([
      ["x", "number"],
      ["y", "number"],
      ["z", "number"]
    ]), this.addOutput("vec3", "vec3"), this.properties = { x: 0, y: 0, z: 0 }, this._data = new Float32Array(3);
  }
  onExecute() {
    var t = this.getInputData(0);
    t == null && (t = this.properties.x);
    var s = this.getInputData(1);
    s == null && (s = this.properties.y);
    var a = this.getInputData(2);
    a == null && (a = this.properties.z);
    var n = this._data;
    n[0] = t, n[1] = s, n[2] = a, this.setOutputData(0, n);
  }
}
b(Math3DXYZToVec3, "title", "XYZ->Vec3"), b(Math3DXYZToVec3, "desc", "components to vector3");
LiteGraph.registerNodeType("math3d/xyz-to-vec3", Math3DXYZToVec3);
class Math3DVec4ToXYZW {
  constructor() {
    this.addInput("vec4", "vec4"), this.addOutput("x", "number"), this.addOutput("y", "number"), this.addOutput("z", "number"), this.addOutput("w", "number");
  }
  onExecute() {
    var t = this.getInputData(0);
    t != null && (this.setOutputData(0, t[0]), this.setOutputData(1, t[1]), this.setOutputData(2, t[2]), this.setOutputData(3, t[3]));
  }
}
b(Math3DVec4ToXYZW, "title", "Vec4->XYZW"), b(Math3DVec4ToXYZW, "desc", "vector 4 to components");
LiteGraph.registerNodeType("math3d/vec4-to-xyzw", Math3DVec4ToXYZW);
class Math3DXYZWToVec4 {
  constructor() {
    this.addInputs([
      ["x", "number"],
      ["y", "number"],
      ["z", "number"],
      ["w", "number"]
    ]), this.addOutput("vec4", "vec4"), this.properties = { x: 0, y: 0, z: 0, w: 0 }, this._data = new Float32Array(4);
  }
  onExecute() {
    var t = this.getInputData(0);
    t == null && (t = this.properties.x);
    var s = this.getInputData(1);
    s == null && (s = this.properties.y);
    var a = this.getInputData(2);
    a == null && (a = this.properties.z);
    var n = this.getInputData(3);
    n == null && (n = this.properties.w);
    var o = this._data;
    o[0] = t, o[1] = s, o[2] = a, o[3] = n, this.setOutputData(0, o);
  }
}
b(Math3DXYZWToVec4, "title", "XYZW->Vec4"), b(Math3DXYZWToVec4, "desc", "components to vector4");
LiteGraph.registerNodeType("math3d/xyzw-to-vec4", Math3DXYZWToVec4);
function toString(r) {
  if (r && r.constructor === Object)
    try {
      return JSON.stringify(r);
    } catch {
      return String(r);
    }
  return String(r);
}
LiteGraph.wrapFunctionAsNode("string/toString", toString, [""], "string");
function compare(r, t) {
  return r == t;
}
LiteGraph.wrapFunctionAsNode(
  "string/compare",
  compare,
  ["string", "string"],
  "boolean"
);
function concatenate(r, t) {
  return r === void 0 ? t : t === void 0 ? r : r + "" + t;
}
LiteGraph.wrapFunctionAsNode(
  "string/concatenate",
  concatenate,
  ["string", "string"],
  "string"
);
function contains(r, t) {
  return r === void 0 || t === void 0 ? !1 : r.indexOf(t) != -1;
}
LiteGraph.wrapFunctionAsNode(
  "string/contains",
  contains,
  ["string", "string"],
  "boolean"
);
function toUpperCase(r) {
  return r != null && r.constructor === String ? r.toUpperCase() : r;
}
LiteGraph.wrapFunctionAsNode(
  "string/toUpperCase",
  toUpperCase,
  ["string"],
  "string"
);
function split(r, t) {
  if (t == null && (t = this.properties.separator), r == null) return [];
  if (r.constructor === String) return r.split(t || " ");
  if (r.constructor === Array) {
    for (var s = [], a = 0; a < r.length; ++a)
      typeof r[a] == "string" && (s[a] = r[a].split(t || " "));
    return s;
  }
  return null;
}
LiteGraph.wrapFunctionAsNode(
  "string/split",
  split,
  ["string,array", "string"],
  "array",
  { separator: "," }
);
function toFixed(r) {
  return r != null && r.constructor === Number ? r.toFixed(this.properties.precision) : r;
}
LiteGraph.wrapFunctionAsNode("string/toFixed", toFixed, ["number"], "string", { precision: 0 });
class StringToTable {
  constructor() {
    this.addInput("", "string"), this.addOutput("table", "table"), this.addOutput("rows", "number"), this.addProperty("value", ""), this.addProperty("separator", ","), this._table = null;
  }
  onExecute() {
    var t = this.getInputData(0);
    if (t) {
      var s = this.properties.separator || ",";
      (t != this._str || s != this._last_separator) && (this._last_separator = s, this._str = t, this._table = t.split(`
`).map(function(a) {
        return a.trim().split(s);
      })), this.setOutputData(0, this._table), this.setOutputData(1, this._table ? this._table.length : 0);
    }
  }
}
b(StringToTable, "title", "toTable"), b(StringToTable, "desc", "Splits a string to table");
LiteGraph.registerNodeType("string/toTable", StringToTable);
class Selector {
  constructor() {
    this.addInput("sel", "number"), this.addInput("A"), this.addInput("B"), this.addInput("C"), this.addInput("D"), this.addOutput("out"), this.selected = 0;
  }
  onDrawBackground(t) {
    if (!this.flags.collapsed) {
      t.fillStyle = "#AFB";
      var s = (this.selected + 1) * LiteGraph.NODE_SLOT_HEIGHT + 6;
      t.beginPath(), t.moveTo(50, s), t.lineTo(50, s + LiteGraph.NODE_SLOT_HEIGHT), t.lineTo(34, s + LiteGraph.NODE_SLOT_HEIGHT * 0.5), t.fill();
    }
  }
  onExecute() {
    var t = this.getInputData(0);
    (t == null || t.constructor !== Number) && (t = 0), this.selected = t = Math.round(t) % (this.inputs.length - 1);
    var s = this.getInputData(t + 1);
    s !== void 0 && this.setOutputData(0, s);
  }
  onGetInputs() {
    return [
      ["E", 0],
      ["F", 0],
      ["G", 0],
      ["H", 0]
    ];
  }
}
b(Selector, "title", "Selector"), b(Selector, "desc", "selects an output");
LiteGraph.registerNodeType("logic/selector", Selector);
class Sequence {
  constructor() {
    this.properties = { sequence: "A,B,C" }, this.addInput("index", "number"), this.addInput("seq"), this.addOutput("out"), this.index = 0, this.values = this.properties.sequence.split(",");
  }
  onPropertyChanged(t, s) {
    t == "sequence" && (this.values = s.split(","));
  }
  onExecute() {
    var t = this.getInputData(1);
    t && t != this.current_sequence && (this.values = t.split(","), this.current_sequence = t);
    var s = this.getInputData(0);
    s == null && (s = 0), this.index = s = Math.round(s) % this.values.length, this.setOutputData(0, this.values[s]);
  }
}
b(Sequence, "title", "Sequence"), b(Sequence, "desc", "select one element from a sequence from a string");
LiteGraph.registerNodeType("logic/sequence", Sequence);
class logicAnd {
  constructor() {
    this.properties = {}, this.addInput("a", "boolean"), this.addInput("b", "boolean"), this.addOutput("out", "boolean");
  }
  onExecute() {
    let t = !0;
    for (let s in this.inputs)
      if (!this.getInputData(s)) {
        t = !1;
        break;
      }
    this.setOutputData(0, t);
  }
  onGetInputs() {
    return [["and", "boolean"]];
  }
}
b(logicAnd, "title", "AND"), b(logicAnd, "desc", "Return true if all inputs are true");
LiteGraph.registerNodeType("logic/AND", logicAnd);
class logicOr {
  constructor() {
    this.properties = {}, this.addInput("a", "boolean"), this.addInput("b", "boolean"), this.addOutput("out", "boolean");
  }
  onExecute() {
    var t = !1;
    for (var s in this.inputs)
      if (this.getInputData(s)) {
        t = !0;
        break;
      }
    this.setOutputData(0, t);
  }
  onGetInputs() {
    return [["or", "boolean"]];
  }
}
b(logicOr, "title", "OR"), b(logicOr, "desc", "Return true if at least one input is true");
LiteGraph.registerNodeType("logic/OR", logicOr);
class logicNot {
  constructor() {
    this.properties = {}, this.addInput("in", "boolean"), this.addOutput("out", "boolean");
  }
  onExecute() {
    var t = !this.getInputData(0);
    this.setOutputData(0, t);
  }
}
b(logicNot, "title", "NOT"), b(logicNot, "desc", "Return the logical negation");
LiteGraph.registerNodeType("logic/NOT", logicNot);
class logicCompare {
  constructor() {
    this.properties = {}, this.addInput("a", "boolean"), this.addInput("b", "boolean"), this.addOutput("out", "boolean");
  }
  onExecute() {
    var t = null, s = !0;
    for (var a in this.inputs)
      if (t === null) t = this.getInputData(a);
      else if (t != this.getInputData(a)) {
        s = !1;
        break;
      }
    this.setOutputData(0, s);
  }
  onGetInputs() {
    return [["bool", "boolean"]];
  }
}
b(logicCompare, "title", "bool == bool"), b(logicCompare, "desc", "Compare for logical equality");
LiteGraph.registerNodeType("logic/CompareBool", logicCompare);
class logicBranch {
  // @BUG: Seems to always execute false branch
  constructor() {
    this.properties = {}, this.addInput("onTrigger", LiteGraph.ACTION), this.addInput("condition", "boolean"), this.addOutput("true", LiteGraph.EVENT), this.addOutput("false", LiteGraph.EVENT), this.mode = LiteGraph.ON_TRIGGER;
  }
  onExecute(t, s) {
    var a = this.getInputData(1);
    a ? this.triggerSlot(0) : this.triggerSlot(1);
  }
}
b(logicBranch, "title", "Branch"), b(logicBranch, "desc", "Branch execution on condition");
LiteGraph.registerNodeType("logic/IF", logicBranch);
class logicFor {
  constructor() {
    this.properties = {}, this.addInput("start", "number"), this.addInput("nElements", "number"), this.addInput("do", LiteGraph.ACTION), this.addInput("break", LiteGraph.ACTION), this.addOutput("do", LiteGraph.EVENT), this.addOutput("index", "number"), this.started = !1, this.stopped = !1;
  }
  onExecute(t) {
    var o, l;
    if (this.started) {
      for (var s = this.getInputData(0), a = this.getInputData(1), n = s; n < s + a; n++) {
        if ((o = console.debug) == null || o.call(console, "for cycle " + n), this.triggerSlot(0, t), this.stopped) {
          (l = console.debug) == null || l.call(console, "for cycle stopped on index " + n);
          break;
        }
        this.setOutputData(1, n);
      }
      this.started = !1, this.stopped = !0;
    }
  }
  onAction(t) {
    switch (t) {
      case "break":
        this.stopped = !0;
        break;
      /* case "reset":
          this.stopped = false;
      break;*/
      case "do":
        this.started = !0, this.stopped = !1, this.execute();
        break;
    }
  }
}
b(logicFor, "title", "FOR"), b(logicFor, "desc", "Cycle FOR");
LiteGraph.registerNodeType("logic/CycleFOR", logicFor);
class logicWhile {
  constructor() {
    this.properties = { cycleLimit: 999, checkOnStart: !0 }, this.addInput("do", LiteGraph.ACTION), this.addInput("condition", "boolean"), this.addInput("break", LiteGraph.ACTION), this.addOutput("do", LiteGraph.EVENT), this.addOutput("index", "number"), this.started = !1, this.stopped = !1, this.k = 0, this.cond = !1, this.addWidget("toggle", "checkOnStart", this.properties.checkOnStart, "checkOnStart");
  }
  onExecute() {
    this.setOutputData(1, this.k), this.cond = this.getInputData(1);
  }
  onAction(t, s) {
    var n, o;
    switch (t) {
      case "break":
        this.stopped = !0;
        break;
      case "do":
        this.started = !0, this.stopped = !1;
        var a = this.getInputOrProperty("checkOnStart");
        for (this.cond = !a || this.getInputData(1), this.k = 0, cycleLimit = this.properties.cycleLimit || 999; this.cond && this.k < cycleLimit; ) {
          if ((n = console.debug) == null || n.call(console, "while cycle " + this.k), this.setOutputData(1, this.k), this.triggerSlot(0, s), this.stopped) {
            (o = console.debug) == null || o.call(console, "while cycle stopped on index " + k);
            break;
          }
          this.k++, this.cond = this.getInputData(1, !0, !0);
        }
        this.k = 0, this.setOutputData(1, this.k), this.cond = this.getInputData(1), this.started = !1, this.stopped = !0;
        break;
    }
  }
}
b(logicWhile, "title", "WHILE"), b(logicWhile, "desc", "Cycle WHILE");
LiteGraph.registerNodeType("logic/CycleWHILE", logicWhile);
class LGWebSocket {
  constructor() {
    this.size = [60, 20], this.addInput("send", LiteGraph.ACTION), this.addOutput("received", LiteGraph.EVENT), this.addInput("in", 0), this.addOutput("out", 0), this.properties = {
      url: "",
      room: "lgraph",
      // allows to filter messages,
      only_send_changes: !0
    }, this._ws = null, this._last_sent_data = [], this._last_received_data = [];
  }
  onPropertyChanged(t, s) {
    t == "url" && this.connectSocket();
  }
  onExecute() {
    if (!this._ws && this.properties.url && this.connectSocket(), !(!this._ws || this._ws.readyState != WebSocket.OPEN)) {
      var t = this.properties.room, s = this.properties.only_send_changes;
      for (let o = 1; o < this.inputs.length; ++o) {
        var a = this.getInputData(o);
        if (a != null) {
          var n;
          try {
            n = JSON.stringify({
              type: 0,
              room: t,
              channel: o,
              data: a
            });
          } catch {
            continue;
          }
          s && this._last_sent_data[o] == n || (this._last_sent_data[o] = n, this._ws.send(n));
        }
      }
      for (let o = 1; o < this.outputs.length; ++o)
        this.setOutputData(o, this._last_received_data[o]);
      this.boxcolor == "#AFA" && (this.boxcolor = "#6C6");
    }
  }
  connectSocket() {
    var t = this, s = this.properties.url;
    s.substr(0, 2) != "ws" && (s = "ws://" + s), this._ws = new WebSocket(s), this._ws.onopen = function() {
      var a;
      (a = console.log) == null || a.call(console, "ready"), t.boxcolor = "#6C6";
    }, this._ws.onmessage = function(a) {
      t.boxcolor = "#AFA";
      var n = JSON.parse(a.data);
      if (!(n.room && n.room != t.properties.room))
        if (n.type == 1)
          if (n.data.object_class && LiteGraph[n.data.object_class]) {
            var o = null;
            try {
              o = new LiteGraph[n.data.object_class](n.data), t.triggerSlot(0, o);
            } catch {
              return;
            }
          } else
            t.triggerSlot(0, n.data);
        else
          t._last_received_data[n.channel || 0] = n.data;
    }, this._ws.onerror = function(a) {
      var n;
      (n = console.log) == null || n.call(console, "couldnt connect to websocket"), t.boxcolor = "#E88";
    }, this._ws.onclose = function(a) {
      var n;
      (n = console.log) == null || n.call(console, "connection closed"), t.boxcolor = "#000";
    };
  }
  send(t) {
    !this._ws || this._ws.readyState != WebSocket.OPEN || this._ws.send(JSON.stringify({ type: 1, msg: t }));
  }
  onAction(t, s) {
    !this._ws || this._ws.readyState != WebSocket.OPEN || this._ws.send({
      type: 1,
      room: this.properties.room,
      action: t,
      data: s
    });
  }
  onGetInputs() {
    return [["in", 0]];
  }
  onGetOutputs() {
    return [["out", 0]];
  }
}
b(LGWebSocket, "title", "WebSocket"), b(LGWebSocket, "desc", "Send data through a websocket");
LiteGraph.registerNodeType("network/websocket", LGWebSocket);
class HTTPRequestNode {
  constructor() {
    this.addInput("request", LiteGraph.ACTION), this.addInput("url", "string"), this.addProperty("url", ""), this.addOutput("ready", LiteGraph.EVENT), this.addOutput("data", "string"), this.addWidget("button", "Fetch", null, this.fetch.bind(this)), this._data = null, this._fetching = null;
  }
  fetch() {
    var t = this.getInputOrProperty("url");
    if (t) {
      this.boxcolor = "#FF0";
      var s = this;
      this._fetching = fetch(t).then((a) => {
        if (!a.ok)
          this.boxcolor = "#F00", s.trigger("error");
        else
          return this.boxcolor = "#0F0", a.text();
      }).then((a) => {
        s._data = a, s._fetching = null, s.trigger("ready");
      });
    }
  }
  onAction(t) {
    t == "request" && this.fetch();
  }
  onExecute() {
    this.setOutputData(1, this._data);
  }
  onGetOutputs() {
    return [["error", LiteGraph.EVENT]];
  }
}
b(HTTPRequestNode, "title", "HTTP Request"), b(HTTPRequestNode, "desc", "Fetch data through HTTP");
LiteGraph.registerNodeType("network/httprequest", HTTPRequestNode);
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
