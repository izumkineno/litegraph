let LiteGraph = null;

export function setRuntimeLoopMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const runtimeLoopMethods = {
start(interval = 0) {
        if (this.status === this.constructor.STATUS_RUNNING) {
            return;
        }

        this.status = this.constructor.STATUS_RUNNING;
        this.onPlayEvent?.();
        this.sendEventToAllNodes("onStart");

        this.starttime = LiteGraph.getTime();
        this.last_update_time = this.starttime;

        const onAnimationFrame = () => {
            if (this.execution_timer_id !== -1) {
                return;
            }
            window.requestAnimationFrame(onAnimationFrame);
            this.onBeforeStep?.();
            this.runStep(1, !this.catch_errors);
            this.onAfterStep?.();
        };

        if (interval === 0 && typeof window === "object" && window.requestAnimationFrame) {
            this.execution_timer_id = -1;
            onAnimationFrame();
        } else {
            this.execution_timer_id = setInterval(() => {
                this.onBeforeStep?.();
                this.runStep(1, !this.catch_errors);
                this.onAfterStep?.();
            }, interval);
        }
    },

stop() {
        if (this.status == this.constructor.STATUS_STOPPED) {
            return;
        }
        this.status = this.constructor.STATUS_STOPPED;
        this.onStopEvent?.();
        if (this.execution_timer_id != null) {
            if (this.execution_timer_id != -1) {
                clearInterval(this.execution_timer_id);
            }
            this.execution_timer_id = null;
        }
        this.sendEventToAllNodes("onStop");
    },

runStep(num = 1, do_not_catch_errors, limit) {
        var start = LiteGraph.getTime();
        this.globaltime = 0.001 * (start - this.starttime);

        var nodes = this._nodes_executable ?? this._nodes;
        if (!nodes) {
            return;
        }

        limit ||= nodes.length;

        if (do_not_catch_errors) {
            for (let i = 0; i < num; i++) {
                nodes.forEach((node) => {
                    if (LiteGraph.use_deferred_actions && node._waiting_actions?.length) {
                        node.executePendingActions();
                    }

                    if (node.mode === LiteGraph.ALWAYS) {
                        node.doExecute?.();
                    }
                });

                this.fixedtime += this.fixedtime_lapse;
                this.onExecuteStep?.();
            }
            this.onAfterExecute?.();
        } else { // catch errors
            try {
                for (let i = 0; i < num; i++) {
                    nodes.forEach((node) => {
                        if (LiteGraph.use_deferred_actions && node._waiting_actions?.length) {
                            node.executePendingActions();
                        }

                        if (node.mode === LiteGraph.ALWAYS) {
                            node.doExecute?.();
                        }
                    });

                    this.fixedtime += this.fixedtime_lapse;
                    this.onExecuteStep?.();
                }

                this.onAfterExecute?.();
                this.errors_in_execution = false;
            } catch (err) {

                this.errors_in_execution = true;
                if (LiteGraph.throw_errors) {
                    throw err;
                }
                LiteGraph.log?.(`Error during execution: ${err}`);
                this.stop();
            }
        }

        var now = LiteGraph.getTime();
        var elapsed = now - start;
        if (elapsed == 0) {
            elapsed = 1;
        }
        this.execution_time = 0.001 * elapsed;
        this.globaltime += 0.001 * elapsed;
        this.iteration += 1;
        this.elapsed_time = (now - this.last_update_time) * 0.001;
        this.last_update_time = now;
        this.nodes_executing = [];
        this.nodes_actioning = [];
        this.node_ancestorsCalculated = [];
        this.nodes_executedAction = [];
    },

getTime() {
        return this.globaltime;
    },

getFixedTime() {
        return this.fixedtime;
    },

getElapsedTime() {
        return this.elapsed_time;
    },

clearTriggeredSlots() {
        for (var i in this.links) {
            var link_info = this.links[i];
            if (!link_info) {
                continue;
            }
            link_info._last_time &&= 0;
        }
    },
};
