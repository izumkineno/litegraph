# LiteGraph Split Map

## Summary
- Scope: split `src/litegraph.js` into singleton facade + delegates + modular implementations.
- Compatibility priority: keep `export var LiteGraph = new class {}` and all public fields/method names unchanged.
- Install timing: delegates are installed during singleton construction.

## Structure
- `src/litegraph/install-delegates.js`
- `src/litegraph/modules/logging.js`
- `src/litegraph/modules/node-registry.js`
- `src/litegraph/modules/node-factory.js`
- `src/litegraph/modules/slot-types.js`
- `src/litegraph/modules/type-compat.js`
- `src/litegraph/modules/file-utils.js`
- `src/litegraph/modules/pointer-events.js`
- `src/litegraph/modules/object-utils.js`
- `src/litegraph/modules/math-color-utils.js`
- `src/litegraph/modules/canvas-text-utils.js`
- `src/litegraph/modules/class-utils.js`
- `src/litegraph/modules/legacy-compat.js`
- `src/litegraph/shared/defaults-core.js`
- `src/litegraph/shared/defaults-ui.js`
- `src/litegraph/shared/defaults-behavior.js`
- `src/litegraph/shared/defaults-slots.js`

## Method Migration
- `logging.js`: `logging_set_level`, `logging`, `error`, `warn`, `info`, `log`, `debug`
- `node-registry.js`: `registerNodeType`, `unregisterNodeType`, `clearRegisteredTypes`, `addNodeMethod`, `reloadNodes`
- `node-factory.js`: `buildNodeClassFromObject`, `wrapFunctionAsNode`, `createNode`, `getNodeType`, `getNodeTypesInCategory`, `getNodeTypesCategories`
- `slot-types.js`: `registerNodeAndSlotType`, `registerSearchboxExtra`
- `type-compat.js`: `isValidConnection`
- `file-utils.js`: `fetchFile`
- `pointer-events.js`: `applyPointerDefaults`, `resolvePointerEventName`, `pointerAddListener`, `pointerRemoveListener`, `pointerevents_method`
- `object-utils.js`: `cloneObject`, `uuidv4`, `compareObjects`
- `math-color-utils.js`: `distance`, `colorToString`, `isInsideRectangle`, `growBounding`, `isInsideBounding`, `overlapBounding`, `hex2num`, `num2hex`, `clamp`
- `canvas-text-utils.js`: `canvasFillTextMultiline`
- `class-utils.js`: `extendClass`, `getParameterNames`
- `legacy-compat.js`: `closeAllContextMenus`

## Initialization Order
1. Attach class references (`LGraph`, `LGraphNode`, etc.) on singleton.
2. Install `LGraph` / `LGraphNode` delegates.
3. Install LiteGraph delegates on singleton prototype.
4. Apply defaults: core -> ui -> behavior -> slots.
5. Set logging level.

## Regression Checklist
- `test/litegraph.test.js`
- `test/graph.core.test.js`
- `test/core/lgraph.lifecycle.test.js`
- `test/core/lgraph.execution-order.test.js`
- `test/core/lgraph.serialize.test.js`
- `test/core/lgraphnode.connect.test.js`
- `test/core/lgraphnode.slots.test.js`
- `test/core/lgraph.delegation.test.js`
- `test/core/litegraph.delegation.test.js`
- `test/ui/contextmenu.lifecycle.test.js`
- `test/ui/contextmenu.keyboard.test.js`
- `test/ui/dragandscale.panzoom.test.js`
- `test/ui/lgraphcanvas.core.test.js`
- `test/ui/lgraphcanvas.interactions.test.js`
- `test/ui/lgraphcanvas.selection.test.js`

## Future Replacement Boundaries
- Node type registry/factory
- Pointer and event compatibility layer
- Utility/math/text helpers
- Legacy bridge APIs
