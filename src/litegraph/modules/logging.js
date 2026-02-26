let LiteGraph = null;

export function setLoggingMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const loggingMethods = {
logging_set_level(v) {
        this.debug_level = Number(v);
    },

logging(lvl/**/) { // arguments

        if(lvl > this.debug_level)
            return; // -- break, debug only below or equal current --

        function clean_args(args) {
            let aRet = [];
            for(let iA=1; iA<args.length; iA++) {
                if(typeof(args[iA])!=="undefined") aRet.push(args[iA]);
            }
            return aRet;
        }

        let lvl_txt = "debug";
        if(lvl>=0&&lvl<=4) lvl_txt = ['error', 'warn', 'info', 'log', 'debug'][lvl];

        if(typeof(console[lvl_txt])!=="function") {
            console.warn("[LG-log] invalid console method",lvl_txt,clean_args(arguments));
            throw new RangeError;
        }

        console[lvl_txt]("[LG]",...clean_args(arguments));
    },

error() {
        this.logging(0,...arguments);
    },

warn() {
        this.logging(1,...arguments);
    },

info() {
        this.logging(2,...arguments);
    },

log() {
        this.logging(3,...arguments);
    },

debug() {
        this.logging(4,...arguments);
    },
};
