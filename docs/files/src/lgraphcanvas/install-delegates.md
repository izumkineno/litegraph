# 文件文档：`src/lgraphcanvas/install-delegates.js`

## 所属模块介绍

- 模块：`src/lgraphcanvas`
- 介绍来源：[AUTO-MODULE] 自动生成
- 介绍：
> [AUTO-MODULE] 模块 `src/lgraphcanvas` 的职责为：模块化源码目录，承载同一子域下的实现。
> 规模：包含 1 个文件，导出 1 项（AUTO 1 项），耦合强度 9。
> 关键耦合：出边 `src/lgraphcanvas/controllers`(8)；入边 `src`(1)。
> 主要导出：`installLGraphCanvasDelegates`。
> 代表文件：`install-delegates.js`。

- 导出项数量：1
- AUTO 说明数量：1

## 1. `installLGraphCanvasDelegates`

- 类型：`function`
- 位置：`src/lgraphcanvas/install-delegates.js:105-116` (`#L105`)
- 说明来源：[AUTO] 自动回退
- 说明：
> [AUTO] 导出函数 `installLGraphCanvasDelegates`，定义于 `src/lgraphcanvas/install-delegates.js`。

- 代码片段（L105-L116）：
```js
export function installLGraphCanvasDelegates(LGraphCanvasClass) {
    for (const [methodName, controllerName] of Object.entries(delegateMap)) {
        Object.defineProperty(LGraphCanvasClass.prototype, methodName, {
            value: function (...args) {
                const controllers = ensureControllers(this);
                return controllers[controllerName][methodName](...args);
            },
            writable: true,
            configurable: true,
        });
    }
}
```
