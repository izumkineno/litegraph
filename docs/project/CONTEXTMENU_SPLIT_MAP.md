# ContextMenu Split Map

## Summary
- Target file split: `src/contextmenu.js`
- Split mode: facade class + private orchestration in main file + module extraction
- Compatibility target: strict API/behavior compatibility

## Module Layout
- `src/contextmenu.js`: class facade and private flow orchestration
- `src/contextmenu/modules/options.js`: options normalization
- `src/contextmenu/modules/parenting-validation.js`: parent menu linking and event-class checks
- `src/contextmenu/modules/root-dom.js`: root DOM creation/title/items/host resolve
- `src/contextmenu/modules/root-events.js`: root pointer/wheel/contextmenu bindings
- `src/contextmenu/modules/filtering.js`: keyboard filtering lifecycle and selection updates
- `src/contextmenu/modules/positioning.js`: menu positioning and viewport clamping
- `src/contextmenu/modules/item-actions.js`: item click callback order and submenu opening
- `src/contextmenu/modules/close-flow.js`: close flow and parent/submenu cleanup
- `src/contextmenu/modules/statics.js`: static helpers (`closeAll/trigger/isCursorOverElement`)

## Method Migration
- Kept in `src/contextmenu.js`:
  - `constructor`
  - `#createRoot`
  - `#bindEvents`
  - `#linkToParent`
  - `#validateEventClass`
  - `#insertMenu`
  - `#calculateBestPosition`
  - `setTitle/addItems/addItem/close/getTopMenu/getFirstEvent`
  - `static closeAll/trigger/isCursorOverElement`
- Delegated implementation:
  - private/public/static methods call functions from `modules/*`

## Event Sequence (unchanged)
1. Constructor normalizes options, links parent, validates event, creates root
2. Root events bound (`pointerup/contextmenu/pointerdown/wheel/pointerenter`)
3. Title and items inserted
4. Keyboard filter listener attached for top-level menu when enabled
5. Menu appended to host and positioned
6. Item click executes callback chain and optional submenu open
7. Close flow releases filter listener, submenu, parent lock, and DOM node

## Source Regression Path Change
- Moved `litegraphTarget` trigger implementation from:
  - `src/contextmenu.js`
- To:
  - `src/contextmenu/modules/statics.js`
- Regression test updated to read new path while preserving same assertion semantics.

## Regression Checklist
- `test/ui/contextmenu.lifecycle.test.js`
- `test/ui/contextmenu.keyboard.test.js`
- `test/source.regressions.test.js`
