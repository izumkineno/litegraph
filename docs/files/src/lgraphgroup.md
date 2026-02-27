# 文件文档：`src/lgraphgroup.js`

## 所属模块介绍

- 模块：`src`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/llink.js`
- 介绍：
> Class representing a link object that stores link information between two nodes.

- 导出项数量：1
- AUTO 说明数量：1

## 1. `LGraphGroup`

- 类型：`class`
- 位置：`src/lgraphgroup.js:3-118` (`#L3`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出类 `LGraphGroup`，定义于 `src/lgraphgroup.js`。

- 代码片段（L3-L22）：
```js
export class LGraphGroup {

    /**
     * Constructor for the LGraphGroup class.
     * @param {string} [title="Group"] - The title of the group.
     */
    constructor(title = "Group") {

        this.title = title;
        this.font_size = 24;
        this.color = LiteGraph.LGraphCanvas.node_colors.pale_blue?.groupcolor ?? "#AAA";
        this._bounding = new Float32Array([10, 10, 140, 80]);
        this._pos = this._bounding.subarray(0, 2);
        this._size = this._bounding.subarray(2, 4);
        this._nodes = [];
        this.graph = null;
    }

    set pos(v) {
        if (!v || v.length < 2) {
```

> 片段已按最大行数裁剪。
