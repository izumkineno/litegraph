# 文件文档：`src/llink.js`

## 所属模块介绍

- 模块：`src`
- 介绍来源：模块顶部注释
- 注释来源文件：`src/llink.js`
- 介绍：
> Class representing a link object that stores link information between two nodes.

- 导出项数量：1
- AUTO 说明数量：0

## 1. `LLink`

- 类型：`class`
- 位置：`src/llink.js:5-64` (`#L5`)
- 说明来源：源码注释
- 说明：
> Class representing a link object that stores link information between two nodes.

- 代码片段（L5-L24）：
```js
export class LLink {

    /**
     * Create a link object.
     * @param {string} id - The unique identifier of the link.
     * @param {string} type - The type of the link.
     * @param {string} origin_id - The identifier of the origin node.
     * @param {string} origin_slot - The slot of the origin node the link is connected to.
     * @param {string} target_id - The identifier of the target node.
     * @param {string} target_slot - The slot of the target node the link is connected to.
     */
    constructor(id, type, origin_id, origin_slot, target_id, target_slot) {
        this.id = id;
        this.type = type;
        this.origin_id = origin_id;
        this.origin_slot = origin_slot;
        this.target_id = target_id;
        this.target_slot = target_slot;

        this._data = null;
```

> 片段已按最大行数裁剪。
