function noop() {}

export function createMockCanvasContext() {
    const calls = [];

    const track = (name) => (...args) => {
        calls.push({ name, args });
    };

    return {
        calls,
        canvas: { width: 512, height: 512 },
        beginPath: track("beginPath"),
        closePath: track("closePath"),
        moveTo: track("moveTo"),
        lineTo: track("lineTo"),
        bezierCurveTo: track("bezierCurveTo"),
        arc: track("arc"),
        stroke: track("stroke"),
        fill: track("fill"),
        clearRect: track("clearRect"),
        fillRect: track("fillRect"),
        strokeRect: track("strokeRect"),
        save: track("save"),
        restore: track("restore"),
        translate: track("translate"),
        rotate: track("rotate"),
        scale: track("scale"),
        setTransform: track("setTransform"),
        transform: track("transform"),
        drawImage: track("drawImage"),
        fillText: track("fillText"),
        strokeText: track("strokeText"),
        measureText(text = "") {
            return { width: String(text).length * 8 };
        },
        createLinearGradient() {
            return { addColorStop: noop };
        },
        createRadialGradient() {
            return { addColorStop: noop };
        },
    };
}

export function createMockCanvasElement(context = createMockCanvasContext()) {
    return {
        width: context.canvas.width,
        height: context.canvas.height,
        style: {},
        getContext(type) {
            if (type === "2d") {
                return context;
            }
            return null;
        },
        addEventListener() {},
        removeEventListener() {},
        getBoundingClientRect() {
            return { left: 0, top: 0, width: this.width, height: this.height };
        },
    };
}
