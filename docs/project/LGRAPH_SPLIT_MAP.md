# LGraph Split Map

## Summary
- Scope: split `src/lgraph.js` into facade + delegates + modular implementations.
- Compatibility: public API and method signatures remain unchanged.
- Install timing: delegates are installed during `LiteGraph` construction via `setupLGraphDelegates(this)`.

## Module Structure
- `src/lgraph/install-delegates.js`
- `src/lgraph/modules/lifecycle.js`
- `src/lgraph/modules/canvas-binding.js`
- `src/lgraph/modules/runtime-loop.js`
- `src/lgraph/modules/execution-order.js`
- `src/lgraph/modules/node-mutation.js`
- `src/lgraph/modules/node-query.js`
- `src/lgraph/modules/graph-ports.js`
- `src/lgraph/modules/graph-events.js`
- `src/lgraph/modules/serialization-load.js`
- `src/lgraph/modules/history.js`
- `src/lgraph/shared/options.js`
- `src/lgraph/shared/initializers.js`

## Method Migration Map
- `lifecycle.js`: `getSupportedTypes`, `clear`, `configApply`, `configApplyDefaults`
- `canvas-binding.js`: `attachCanvas`, `detachCanvas`, `sendActionToCanvas`, `change`, `setDirtyCanvas`, `isLive`
- `runtime-loop.js`: `start`, `stop`, `runStep`, `getTime`, `getFixedTime`, `getElapsedTime`, `clearTriggeredSlots`
- `execution-order.js`: `updateExecutionOrder`, `computeExecutionOrder`, `getAncestors`, `arrange`
- `node-mutation.js`: `add`, `remove`, `removeLink`, `checkNodeTypes`
- `node-query.js`: `getNodeById`, `findNodesByClass`, `findNodesByType`, `findNodeByTitle`, `findNodesByTitle`, `getNodeOnPos`, `getGroupOnPos`
- `graph-ports.js`: `addInput`, `setInputData`, `getInputData`, `renameInput`, `changeInputType`, `removeInput`, `addOutput`, `setOutputData`, `getOutputData`, `renameOutput`, `changeOutputType`, `removeOutput`, `triggerInput`, `setCallback`
- `graph-events.js`: `sendEventToAllNodes`, `onAction`, `trigger`, `beforeChange`, `afterChange`, `connectionChange`
- `serialization-load.js`: `serialize`, `configure`, `load`
- `history.js`: `onGraphSaved`, `onGraphLoaded`, `onGraphChanged`, `actionHistoryBack`, `actionHistoryForward`, `actionHistoryLoad`

## Delegate Installation Sequence
1. `src/litegraph.js` constructs singleton `LiteGraph`.
2. Constructor assigns `this.LGraph = LGraph`.
3. Constructor calls `setupLGraphDelegates(this)`.
4. `installLGraphDelegates` injects `LiteGraph` into each module and installs all method groups on `LGraph.prototype`.

## Regression Checklist
- `test/graph.core.test.js`
- `test/core/lgraph.lifecycle.test.js`
- `test/core/lgraph.execution-order.test.js`
- `test/core/lgraph.serialize.test.js`
- `test/core/lgraphnode.connect.test.js`
- `test/core/lgraphnode.slots.test.js`
- `test/core/lgraph.delegation.test.js`

## Future Replacement Boundaries
- Execution scheduler: `runtime-loop.js`, `execution-order.js`
- Mutation orchestration: `node-mutation.js`
- Persistence: `serialization-load.js`, `history.js`
- UI signaling: `canvas-binding.js`, `graph-events.js`
