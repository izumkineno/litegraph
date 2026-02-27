# 文件文档：`src/curveeditor.js`

## 所属模块介绍

- 模块：`src`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/llink.js`
- 介绍：
> Class representing a link object that stores link information between two nodes.

- 导出项数量：1
- AUTO 说明数量：0

## 1. `CurveEditor`

- 类型：`class`
- 位置：`src/curveeditor.js:4-163` (`#L4`)
- 说明来源：源码注释
- 说明：
> used by some widgets to render a curve editor

- 代码片段（L4-L23）：
```js
export class CurveEditor {
    constructor(points) {
        this.points = points;
        this.selected = -1;
        this.nearest = -1;
        this.size = null; // stores last size used
        this.must_update = true;
        this.margin = 5;
    }

    static sampleCurve(f, points) {
        if(!points)
            return;
        for(var i = 0; i < points.length - 1; ++i) {
            var p = points[i];
            var pn = points[i+1];
            if(pn[0] < f)
                continue;
            var r = (pn[0] - p[0]);
            if( Math.abs(r) < 0.00001 )
```

> 片段已按最大行数裁剪。
