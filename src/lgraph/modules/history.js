let LiteGraph = null;

export function setHistoryMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const historyMethods = {
onGraphSaved(optsIn = {}) {
        var optsDef = {};
        var opts = Object.assign(optsDef,optsIn);

        this.savedVersion = this._version;
    },

onGraphLoaded(optsIn = {}) {
        var optsDef = {};
        var opts = Object.assign(optsDef,optsIn);
        this.savedVersion = this._version;
    },

onGraphChanged(optsIn = {}) {
        var optsDef = {
            action: "",
            doSave: true, // log action in graph.history
            doSaveGraph: true, // save
        };
        var opts = Object.assign(optsDef,optsIn);

        if (this._configuring && opts.action !== "graphConfigure") {
            return;
        }

        this._version++;

        if(opts.action) {
            LiteGraph.debug?.("Graph change",opts.action);
        } else {
            LiteGraph.debug?.("Graph change, no action",opts);
        }

        if(opts.doSave && LiteGraph.actionHistory_enabled) {

            LiteGraph.debug?.("onGraphChanged SAVE :: "+opts.action); // debug history

            var oHistory = { actionName: opts.action };
            if(opts.doSaveGraph) {
                oHistory = Object.assign(oHistory, { graphSave: this.serialize() }, // this is a heavy method, but the alternative is way more complex: every action has to have its contrary
                );
            }

            var obH = this.history;

            // check if pointer has gone back: remove newest
            while(obH.actionHistoryPtr < obH.actionHistoryVersions.length-1) {
                LiteGraph.debug?.("popping: gone back? "+(obH.actionHistoryPtr+" < "+(obH.actionHistoryVersions.length-1))); // debug history
                obH.actionHistoryVersions.pop();
            }
            // check if maximum saves
            if(obH.actionHistoryVersions.length>=LiteGraph.actionHistoryMaxSave) {
                var olderSave = obH.actionHistoryVersions.shift();
                LiteGraph.debug?.("maximum saves reached: "+obH.actionHistoryVersions.length+", remove older: "+olderSave); // debug history
                obH.actionHistory[olderSave] = false; // unset
            }

            // update pointer
            obH.actionHistoryPtr = obH.actionHistoryVersions.length;
            obH.actionHistoryVersions.push(obH.actionHistoryPtr);

            // save to pointer
            obH.actionHistory[obH.actionHistoryPtr] = oHistory;

            LiteGraph.debug?.("history saved: "+obH.actionHistoryPtr,oHistory.actionName); // debug history
        }
    },

actionHistoryBack(optsIn = {}) {
        var optsDef = {};
        var opts = Object.assign(optsDef,optsIn);

        var obH = this.history;

        if (obH.actionHistoryPtr != undefined && obH.actionHistoryPtr >= 0) {
            obH.actionHistoryPtr--;
            LiteGraph.debug?.("history step back: "+obH.actionHistoryPtr); // debug history
            if (!this.actionHistoryLoad({iVersion: obH.actionHistoryPtr})) {
                LiteGraph.warn?.("historyLoad failed, restore pointer? "+obH.actionHistoryPtr); // debug history
                // history not found?
                obH.actionHistoryPtr++;
                return false;
            }else{
                LiteGraph.debug?.("history loaded back: "+obH.actionHistoryPtr); // debug history
                LiteGraph.debug?.(this.history);
                return true;
            }
        }else{
            LiteGraph.debug?.("history is already at older state");
            return false;
        }
    },

actionHistoryForward(optsIn = {}) {
        var optsDef = {};
        var opts = Object.assign(optsDef,optsIn);

        var obH = this.history;

        if (obH.actionHistoryPtr<obH.actionHistoryVersions.length) {
            obH.actionHistoryPtr++;
            LiteGraph.debug?.("history step forward: "+obH.actionHistoryPtr); // debug history
            if (!this.actionHistoryLoad({iVersion: obH.actionHistoryPtr})) {
                LiteGraph.warn?.("historyLoad failed, restore pointer? "+obH.actionHistoryPtr); // debug history
                // history not found?
                obH.actionHistoryPtr--;
                return false;
            }else{
                LiteGraph.debug?.("history loaded forward: "+obH.actionHistoryPtr); // debug history
                return true;
            }
        }else{
            LiteGraph.debug?.("history is already at newer state");
            return false;
        }
    },

actionHistoryLoad(optsIn = {}) {
        var optsDef = {
            iVersion: false,
            backStep: false,
        };
        var opts = Object.assign(optsDef,optsIn);

        var obH = this.history;

        if(obH.actionHistory[opts.iVersion] && obH.actionHistory[opts.iVersion].graphSave) {
            var tmpHistory = JSON.stringify(this.history);
            this.configure( obH.actionHistory[opts.iVersion].graphSave );
            this.history = JSON.parse(tmpHistory);
            LiteGraph.debug?.("history loaded: "+opts.iVersion,obH.actionHistory[opts.iVersion].actionName); // debug history
            // no: this.onGraphLoaded();
            return true;
        }else{
            return false;
        }
    },
};
