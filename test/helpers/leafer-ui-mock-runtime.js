import { createMockCanvasContext, createMockCanvasElement } from "./canvas-mock.js";

class BaseUi {
    constructor(data = {}) {
        this.children = [];
        Object.assign(this, data);
    }

    add(...children) {
        this.children.push(...children.filter(Boolean));
    }

    clear() {
        this.children.length = 0;
    }

    remove(child) {
        const index = this.children.indexOf(child);
        if (index >= 0) {
            this.children.splice(index, 1);
        }
    }

    set(data) {
        Object.assign(this, data);
    }
}

class MockGroup extends BaseUi {}
class MockRect extends BaseUi {}
class MockText extends BaseUi {}
class MockEllipse extends BaseUi {}
class MockPolygon extends BaseUi {}
class MockLine extends BaseUi {}
class MockPath extends BaseUi {}

class MockCanvas extends BaseUi {
    constructor(data = {}) {
        super(data);
        this.context = createMockCanvasContext();
        this.context.canvas = {
            width: this.width ?? 1,
            height: this.height ?? 1,
        };
    }

    set(data) {
        super.set(data);
        if (data.width != null) {
            this.context.canvas.width = data.width;
        }
        if (data.height != null) {
            this.context.canvas.height = data.height;
        }
    }

    paint() {
    }
}

class MockLeafer extends BaseUi {
    constructor(config = {}) {
        super(config);
        this.view = config.view || createMockCanvasElement(createMockCanvasContext());
        this.forceRenderCalls = 0;
        this.resizeCalls = 0;
        this.destroyed = false;
    }

    resize(size) {
        this.resizeCalls += 1;
        if (size?.width != null) {
            this.view.width = size.width;
        }
        if (size?.height != null) {
            this.view.height = size.height;
        }
    }

    forceRender() {
        this.forceRenderCalls += 1;
    }

    destroy() {
        this.destroyed = true;
    }
}

export function createMockLeaferUiRuntime() {
    return {
        Leafer: MockLeafer,
        Group: MockGroup,
        Rect: MockRect,
        Text: MockText,
        Ellipse: MockEllipse,
        Polygon: MockPolygon,
        Line: MockLine,
        Path: MockPath,
        Canvas: MockCanvas,
    };
}
