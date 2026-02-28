# 文件文档：`src/lgraphcanvas/modules/events-pointer.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas/modules`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas/modules` 的职责为：功能实现层，按职责拆分核心能力并通过委托装配。
> 规模：包含 16 个文件，导出 120 项（AUTO 84 项），耦合强度 47。
> 关键耦合：出边 `src`(21)、`src/lgraphcanvas/shared`(3)、`src/lgraphcanvas/renderer`(2)；入边 `src/lgraphcanvas/controllers`(20)、`src`(1)。
> 主要导出：`_doNothing`、`_doReturnTrue`、`adjustMouseEvent`、`adjustNodesSize`、`alignNodes`、`applyLGraphCanvasStatics`。
> 代表文件：`events-keyboard-drop.js`、`events-pointer.js`、`hittest-order.js`。

- 导出项数量：5
- AUTO 说明数量：5

## 1. `processUserInputDown`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/events-pointer.js:3-53` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `processUserInputDown`，定义于 `src/lgraphcanvas/modules/events-pointer.js`。

- 代码片段（L3-L22）：
```js
export function processUserInputDown(e) {

    if(this.pointer_is_down && e.isPrimary !== undefined && !e.isPrimary) {
        this.userInput_isNotPrimary = true;
        // DBG("pointerevents: userInput_isNotPrimary start");
    } else {
        this.userInput_isNotPrimary = false;
    }

    this.userInput_type = e.pointerType?e.pointerType:false;
    this.userInput_id = e.pointerId?e.pointerId:false;

    if (e.pointerType) {
        switch (e.pointerType) {
            case "mouse":
                break;
            case "pen":
                break;
            case "touch":
                break;
```

> 片段已按最大行数裁剪。

## 2. `processMouseDown`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/events-pointer.js:55-556` (`#L55`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `processMouseDown`，定义于 `src/lgraphcanvas/modules/events-pointer.js`。

- 代码片段（L55-L74）：
```js
export function processMouseDown(e) {

    if( this.set_canvas_dirty_on_mouse_event )
        this.dirty_canvas = true;

    if (!this.graph) {
        return;
    }

    this.adjustMouseEvent(e);

    var ref_window = this.getCanvasWindow();
    LGraphCanvas.active_canvas = this;

    var x = e.clientX;
    var y = e.clientY;
    // LiteGraph.log?.(y,this.viewport);
    LiteGraph.log?.("pointerevents: processMouseDown pointerId:"+e.pointerId+" which:"+e.which+" isPrimary:"+e.isPrimary+" :: x y "+x+" "+y,"previousClick",this.last_mouseclick,"diffTimeClick",(this.last_mouseclick?LiteGraph.getTime()-this.last_mouseclick:"notlast"));

    this.ds.viewport = this.viewport;
```

> 片段已按最大行数裁剪。

## 3. `processMouseMove`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/events-pointer.js:558-795` (`#L558`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `processMouseMove`，定义于 `src/lgraphcanvas/modules/events-pointer.js`。

- 代码片段（L558-L577）：
```js
export function processMouseMove(e) {
    if (this.autoresize) {
        this.resize();
    }

    if( this.set_canvas_dirty_on_mouse_event )
        this.dirty_canvas = true;

    if (!this.graph) {
        return;
    }

    LGraphCanvas.active_canvas = this;
    this.adjustMouseEvent(e);
    var mouse = [e.clientX, e.clientY];
    this.mouse[0] = mouse[0];
    this.mouse[1] = mouse[1];
    var delta = [
        mouse[0] - this.last_mouse[0],
        mouse[1] - this.last_mouse[1],
```

> 片段已按最大行数裁剪。

## 4. `processMouseUp`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/events-pointer.js:797-1081` (`#L797`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `processMouseUp`，定义于 `src/lgraphcanvas/modules/events-pointer.js`。

- 代码片段（L797-L816）：
```js
export function processMouseUp(e) {

    var is_primary = ( e.isPrimary === undefined || e.isPrimary );

    // early exit for extra pointer
    if(!is_primary) {
        /* e.stopPropagation();
        e.preventDefault();*/
        // LiteGraph.log?.("pointerevents: processMouseUp pointerN_stop "+e.pointerId+" "+e.isPrimary);
        return false;
    }

    // LiteGraph.log?.("pointerevents: processMouseUp "+e.pointerId+" "+e.isPrimary+" :: "+e.clientX+" "+e.clientY);

    if( this.set_canvas_dirty_on_mouse_event )
        this.dirty_canvas = true;

    if (!this.graph)
        return;

```

> 片段已按最大行数裁剪。

## 5. `processMouseWheel`

- 类型：`function`
- 位置：`src/lgraphcanvas/modules/events-pointer.js:1083-1109` (`#L1083`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `processMouseWheel`，定义于 `src/lgraphcanvas/modules/events-pointer.js`。

- 代码片段（L1083-L1102）：
```js
export function processMouseWheel(e) {
    if (!this.graph || !this.allow_dragcanvas) {
        return;
    }

    var delta = e.wheelDeltaY != null ? e.wheelDeltaY : e.detail * -60;

    this.adjustMouseEvent(e);

    var x = e.clientX;
    var y = e.clientY;
    var is_inside = !this.viewport || ( this.viewport && x >= this.viewport[0] && x < (this.viewport[0] + this.viewport[2]) && y >= this.viewport[1] && y < (this.viewport[1] + this.viewport[3]) );
    if(!is_inside)
        return;

    var scale = this.ds.scale;

    scale *= Math.pow(1.1, delta * 0.01);

    // this.setZoom( scale, [ e.clientX, e.clientY ] );
```

> 片段已按最大行数裁剪。
