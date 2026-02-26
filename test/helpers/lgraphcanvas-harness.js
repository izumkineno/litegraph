import { LiteGraph } from "../../src/litegraph.js";

export function createCanvas({ width = 400, height = 300, left = 0, top = 0 } = {}) {
    const canvas = document.createElement("canvas");
    canvas.localName = "canvas";
    canvas.width = width;
    canvas.height = height;
    canvas.style = canvas.style ?? {};
    canvas.focus = () => {
        canvas._focused = true;
    };
    canvas.getBoundingClientRect = () => ({
        left,
        top,
        width,
        height,
        right: left + width,
        bottom: top + height,
    });
    canvas.getContext = () => ({});
    return canvas;
}

export function createGraphStub(overrides = {}) {
    const graph = {
        _nodes: [],
        _groups: [],
        links: {},
        config: { align_to_grid: false, links_ontop: false },
        beforeChangeCalls: 0,
        afterChangeCalls: 0,
        changeCalls: 0,
        changedPayloads: [],
        beforeChange() {
            graph.beforeChangeCalls += 1;
        },
        afterChange() {
            graph.afterChangeCalls += 1;
        },
        onGraphChanged(payload) {
            graph.changedPayloads.push(payload);
        },
        change() {
            graph.changeCalls += 1;
        },
        add(node) {
            graph._nodes.push(node);
            node.graph = graph;
        },
        remove(node) {
            graph._nodes = graph._nodes.filter((n) => n !== node);
        },
        getNodeOnPos(_x, _y, _nodes) {
            return null;
        },
        getGroupOnPos() {
            return null;
        },
        attachCanvas(canvas) {
            graph.canvas = canvas;
            canvas.graph = graph;
        },
        detachCanvas(canvas) {
            if (canvas && canvas.graph === graph) {
                canvas.graph = null;
            }
        },
    };

    return Object.assign(graph, overrides);
}

export function createNodeStub(opts = {}) {
    const node = {
        id: opts.id ?? 1,
        pos: opts.pos ? [...opts.pos] : [0, 0],
        size: opts.size ? [...opts.size] : [140, 60],
        flags: opts.flags ?? {},
        inputs: opts.inputs ?? [],
        outputs: opts.outputs ?? [],
        clonable: opts.clonable ?? true,
        connectCalls: [],
        connectByTypeCalls: [],
        connectByTypeOutputCalls: [],
        disconnectInputCalls: [],
        disconnectOutputCalls: [],
        getConnectionPos(isInput, slot) {
            if (opts.getConnectionPos) {
                return opts.getConnectionPos(isInput, slot);
            }
            return [
                this.pos[0] + (isInput ? 0 : this.size[0]),
                this.pos[1] + 20 + slot * 20,
            ];
        },
        getBounding(out = new Float32Array(4)) {
            out.set([this.pos[0], this.pos[1], this.size[0], this.size[1]]);
            return out;
        },
        connect(...args) {
            this.connectCalls.push(args);
        },
        connectByType(...args) {
            this.connectByTypeCalls.push(args);
        },
        connectByTypeOutput(...args) {
            this.connectByTypeOutputCalls.push(args);
        },
        disconnectInput(...args) {
            this.disconnectInputCalls.push(args);
        },
        disconnectOutput(...args) {
            this.disconnectOutputCalls.push(args);
        },
        clone() {
            if (opts.clone) {
                return opts.clone();
            }
            return createNodeStub({
                ...opts,
                id: (opts.id ?? 1) + 100,
                pos: opts.pos ? [...opts.pos] : [0, 0],
                size: opts.size ? [...opts.size] : [140, 60],
            });
        },
        alignToGrid() {
            this.pos[0] = Math.round(this.pos[0] / LiteGraph.CANVAS_GRID_SIZE) * LiteGraph.CANVAS_GRID_SIZE;
            this.pos[1] = Math.round(this.pos[1] / LiteGraph.CANVAS_GRID_SIZE) * LiteGraph.CANVAS_GRID_SIZE;
        },
    };

    return node;
}
