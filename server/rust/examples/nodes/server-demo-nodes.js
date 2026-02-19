import { LiteGraph } from "/src/litegraph.js";

class RustServerDemoCounter {

    static title = "Counter (Rs)";
    static desc = "Increments every execution";

    constructor() {
        this.addOutput("value", "number");
        this.properties = {
            start: 0,
            step: 1,
        };
        this._value = Number(this.properties.start) || 0;
        this.size = [180, 80];
    }

    onExecute() {
        const step = Number(this.properties.step) || 1;
        this._value += step;
        this.setOutputData(0, this._value);
    }

    onPropertyChanged(name, value) {
        if (name === "start") {
            this._value = Number(value) || 0;
        }
    }
}
LiteGraph.registerNodeType("server_demo_rs/counter", RustServerDemoCounter);

class RustServerDemoScale {

    static title = "Scale (Rs)";
    static desc = "Scale number input by factor";

    constructor() {
        this.addInput("in", "number");
        this.addOutput("out", "number");
        this.properties = {
            factor: 10,
        };
        this.size = [180, 80];
    }

    onExecute() {
        const input = this.getInputData(0);
        if (input == null) {
            return;
        }
        const factor = Number(this.properties.factor) || 1;
        this.setOutputData(0, Number(input) * factor);
    }
}
LiteGraph.registerNodeType("server_demo_rs/scale", RustServerDemoScale);
