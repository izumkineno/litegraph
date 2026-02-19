# TODO 清单（中文主版）

- 更新时间：2026-02-19
- 范围：`src/`、`editor/`、`server/`、`test/`（已排除 `docs/`、`build/`、`editor/js/libs/`、`server/rust/target/` 等生成物与第三方目录）
- 统计：共 70 条，其中 TODO 47 条，BUG/FIXME 21 条，XXX/HACK 2 条
- 说明：本文档以中文说明为主，保留英文原注释仅用于代码定位与追溯。

## 高优先级（建议先修）
- [ ] `src/nodes/geometry.js:3`：注释明确提示可能导致崩溃，优先排查。
- [ ] `src/nodes/logic.js:206`：分支逻辑疑似异常（可能总走 false）。
- [ ] `src/lgraphcanvas.js:6040`：`prevent_timeout` 未生效，存在抖动风险。
- [ ] `src/contextmenu.js:160`：上下文菜单事件移除逻辑疑似重复绑定。
- [ ] `src/lgraphnode.js:907`：`doExecute` 调用语义待确认。
- [ ] `src/lgraphnode.js:1896`：目标插槽不存在时缺少健壮处理。
- [ ] `src/nodes/events.js:62`：节点构造失败（注释明确）。
- [ ] `src/nodes/gltextures.js:1954`：纹理执行行为疑似异常。
- [ ] `src/nodes/gltextures.js:5021`：执行期未使用 `exp/exp_input`。
- [ ] `src/nodes/interface.js:634`：文本渲染无换行，显示会溢出节点。

## 全量条目（带位置）

| 状态 | 类型 | 位置 | 中文说明 | 原注释（英文） |
|---|---|---|---|---|
| 待处理 | BUG/FIXME（缺陷） | `src/contextmenu.js:156` | 疑似缺陷，建议先复现再修复。 | // Atlasan's code: @BUG: Variable names will mismatch |
| 待处理 | TODO（待实现） | `src/contextmenu.js:160` | 这段逻辑待评估是否应移除。 | // TODO FIX THIS :: need to remove correctly events !! getting multiple |
| 待处理 | BUG/FIXME（缺陷） | `src/contextmenu.js:640` | 疑似缺陷，建议先复现再修复。 | * @BUG: Probable bug related to params, origin not being configured/populated correctly |
| 待处理 | TODO（待实现） | `src/lgraph.js:331` | 待实现或待确认事项。 | * @TODO:This whole concept is a mistake.  Should call graph back from output nodes |
| 待处理 | BUG/FIXME（缺陷） | `src/lgraph.js:1401` | 疑似缺陷，建议先复现再修复。 | if(!link_data) { // @BUG: "weird bug" originally |
| 待处理 | TODO（待实现） | `src/lgraph.js:1463` | 图配置加载流程需要优化，避免重复触发变更。 | // TODO implement: when loading (configuring) a whole graph, skip calling graphChanged on every single configure |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:58` | 待实现或待确认事项。 | //  this.render_only_selected = true; // @TODO Atlasan figures this isn't used |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:66` | 待实现或待确认事项。 | //  this.allow_reconnect_links = true; // @TODO: replaced by Atlasan.  Clean up.  allows to change a connection with having to redo it again |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:92` | 该处结构复杂，建议重构以降低维护成本。 | // TODO refactor: options object do need refactoring .. all the options are actually outside of it |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:702` | 待实现或待确认事项。 | // DBG LiteGraph.debug?.("skip moving events :: TODO put a sequencer in the middle or implement multi input",input); |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:1080` | 待实现或待确认事项。 | // TODO |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:1240` | 该处需要人工复核行为是否正确。 | this._highlight_input_slot = node.inputs[slot]; // @TODO CHECK THIS |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:1244` | 该处需要人工复核行为是否正确。 | this._highlight_input_slot = null; // @TODO CHECK THIS |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:1500` | 这段逻辑待评估是否应移除。 | /* @TODO: Excise? |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:1867` | 待实现或待确认事项。 | // TODO |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:3766` | 该处结构复杂，建议重构以降低维护成本。 | grad.addColorStop(0, title_color); // TODO refactor: validate color !! prevent DOMException |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:3880` | 待实现或待确认事项。 | title.substr(0,20), // avoid urls too long //@TODO: Replace with substring |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:4810` | 这段逻辑待评估是否应移除。 | // @TODO: Excise this, bound to w above |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:4864` | 待实现或待确认事项。 | // @TODO: this.value = v; // CHECK |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:5022` | 待实现或待确认事项。 | /* @TODO: Validate this is never called |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:5371` | 这段逻辑待评估是否应移除。 | var slotOpts = {}; // TODO CHECK THIS :: can be removed: removabled:true? .. optional: true? |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:5503` | 这段逻辑待评估是否应移除。 | var slotOpts = {}; // TODO CHECK THIS :: can be removed: removabled:true? .. optional: true? |
| 待处理 | BUG/FIXME（缺陷） | `src/lgraphcanvas.js:5613` | 疑似缺陷，建议先复现再修复。 | // @TODO: See if deleting this is a bug: |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:5792` | 待实现或待确认事项。 | //@TODO |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:5899` | 该处结构复杂，建议重构以降低维护成本。 | // TODO refactor :: this is used fot title but not for properties! |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:5904` | 该处结构复杂，建议重构以降低维护成本。 | // TODO refactor :: use createDialog ? |
| 待处理 | BUG/FIXME（缺陷） | `src/lgraphcanvas.js:6040` | 超时保护变量未生效，可能导致频繁抖动与性能损耗。 | // @BUG: prevent_timeout is never used.  This is literally thrashing just to keep some timeout from happening! |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:6126` | 待实现或待确认事项。 | do_type_filter: LiteGraph.search_filter_enabled, // TODO check for registered_slot_[in/out]_types not empty // this will be checked for functionality enabled : filter on slot type, in and out |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:6246` | 使用了已废弃写法，建议替换为当前推荐 API。 | if (e.keyCode == 38) { // @TODO: deprecated |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:6685` | 使用了已废弃写法，建议替换为当前推荐 API。 | help.dataset["type"] = escape(type); // @TODO: deprecated |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:6835` | 该处结构复杂，建议重构以降低维护成本。 | // TODO refactor, theer are different dialog, some uses createDialog, some dont |
| 待处理 | XXX/HACK（待确认） | `src/lgraphcanvas.js:6967` | 该处需要人工复核行为是否正确。 | /* XXX CHECK THIS */ |
| 待处理 | XXX/HACK（待确认） | `src/lgraphcanvas.js:6971` | 该处需要人工复核行为是否正确。 | /* XXX this was not working, was fixed with an IF, check this */ |
| 待处理 | BUG/FIXME（缺陷） | `src/lgraphcanvas.js:7322` | 疑似缺陷，建议先复现再修复。 | // @TODO: Figure out if deleting this is a bug: |
| 待处理 | TODO（待实现） | `src/lgraphcanvas.js:7914` | 待实现或待确认事项。 | if(0) // @TODO: Figure out what this was for |
| 待处理 | TODO（待实现） | `src/lgraphnode.js:106` | 待实现或待确认事项。 | /* @TODO: Atlasan has this commented, not sure if it stays that way |
| 待处理 | BUG/FIXME（缺陷） | `src/lgraphnode.js:907` | 执行入口命名或调用语义可能不一致，需要统一。 | node.doExecute(param, options); // @BUG: Possible misname here |
| 待处理 | TODO（待实现） | `src/lgraphnode.js:1512` | 该处结构复杂，建议重构以降低维护成本。 | // TODO refactor: USE SINGLE findInput/findOutput functions! :: merge options |
| 待处理 | TODO（待实现） | `src/lgraphnode.js:1687` | 待实现或待确认事项。 | // TODO filter |
| 待处理 | TODO（待实现） | `src/lgraphnode.js:1741` | 待实现或待确认事项。 | // TODO filter |
| 待处理 | BUG/FIXME（缺陷） | `src/lgraphnode.js:1896` | 目标插槽不存在时缺少健壮处理，需要补充防御逻辑。 | LiteGraph.warn?.("FIXME error, target_slot does not exists on target_node",target_node,target_slot); |
| 待处理 | TODO（待实现） | `src/litegraph.js:123` | 待实现或待确认事项。 | this.dialog_close_on_mouse_leave = true; // [false on mobile] better true if not touch device, TODO add an helper/listener to close if false |
| 待处理 | TODO（待实现） | `src/litegraph.js:126` | 待实现或待确认事项。 | this.shift_click_do_break_link_from = false; // [false!] prefer false if results too easy to break links - implement with ALT or TODO custom keys |
| 待处理 | TODO（待实现） | `src/litegraph.js:129` | 待实现或待确认事项。 | this.search_hide_on_mouse_leave = true; // [false on mobile] better true if not touch device, TODO add an helper/listener to close if false |
| 待处理 | TODO（待实现） | `src/litegraph.js:869` | 待实现或待确认事项。 | // @TODO These weren't even directly bound, so could be used as free functions |
| 待处理 | TODO（待实现） | `src/litegraph-editor.js:156` | 待实现或待确认事项。 | // @TODO |
| 待处理 | TODO（待实现） | `src/nodes/base.js:427` | 待实现或待确认事项。 | // TODO |
| 待处理 | BUG/FIXME（缺陷） | `src/nodes/base.js:433` | 这段逻辑待评估是否应移除。 | // @BUG: these aren't currently used.  Examine and decide whether to excise. |
| 待处理 | TODO（待实现） | `src/nodes/base.js:498` | 这段逻辑待评估是否应移除。 | // @TODO: Excise this |
| 待处理 | TODO（待实现） | `src/nodes/base.js:646` | 这段逻辑待评估是否应移除。 | // @TODO: Excise this |
| 待处理 | BUG/FIXME（缺陷） | `src/nodes/base.js:1393` | 疑似缺陷，建议先复现再修复。 | return global; // @BUG: not sure what to do with this now |
| 待处理 | TODO（待实现） | `src/nodes/base.js:1404` | 枚举相关能力待补全。 | // @TODO:Enum |
| 待处理 | BUG/FIXME（缺陷） | `src/nodes/base.js:1573` | 疑似缺陷，建议先复现再修复。 | // @BUG: Didn't output text to console, either in browser or cmd |
| 待处理 | BUG/FIXME（缺陷） | `src/nodes/geometry.js:3` | 疑似缺陷，建议先复现再修复。 | // @BUG: Gotta finish cleaning the file up so this doesn't cause the whole thing to crash |
| 待处理 | TODO（待实现） | `src/nodes/glshaders.js:760` | 这段逻辑待评估是否应移除。 | * @TODO: Either make it or excise it |
| 待处理 | TODO（待实现） | `src/nodes/glshaders.js:781` | 这段逻辑待评估是否应移除。 | * @TODO: Either write it or excise it. |
| 待处理 | BUG/FIXME（缺陷） | `src/nodes/gltextures.js:368` | 疑似缺陷，建议先复现再修复。 | v = v.replace(/[\{\}]/g, ""); // @BUG: These escapes are being flagged as useless |
| 待处理 | BUG/FIXME（缺陷） | `src/nodes/gltextures.js:1954` | 疑似缺陷，建议先复现再修复。 | // @BUG: the behavior of tex here is probably a bug. |
| 待处理 | BUG/FIXME（缺陷） | `src/nodes/gltextures.js:5021` | 疑似缺陷，建议先复现再修复。 | // @BUG: It isn't actually *using* exp or exp_input in execution. |
| 待处理 | BUG/FIXME（缺陷） | `src/nodes/graphics.js:345` | 这段逻辑待评估是否应移除。 | // this.canvas.width = this.canvas.width; //@BUG: Test with this excised, I couldn't find a setter |
| 待处理 | BUG/FIXME（缺陷） | `src/nodes/graphics.js:734` | 疑似缺陷，建议先复现再修复。 | onWidget(_e, _widget) { // @BUG: Consider excising this, it's dead code |
| 待处理 | TODO（待实现） | `src/nodes/input.js:369` | 枚举相关能力待补全。 | // @TODO: Enums |
| 待处理 | BUG/FIXME（缺陷） | `src/nodes/interface.js:349` | 疑似未使用代码，需确认后清理。 | // var w = Math.floor(radius * 0.05); //@BUG: unused variable, test without |
| 待处理 | BUG/FIXME（缺陷） | `src/nodes/interface.js:634` | 疑似缺陷，建议先复现再修复。 | // @BUG: Will draw text straight off the node with no wrapping |
| 待处理 | BUG/FIXME（缺陷） | `src/nodes/logic.js:206` | 分支逻辑疑似异常，可能始终走 false 分支。 | // @BUG: Seems to always execute false branch |
| 待处理 | BUG/FIXME（缺陷） | `src/nodes/math3d.js:445` | 疑似未使用代码，需确认后清理。 | // @BUG: R is unused, but I don't know where it *should* be used because I don't know this math off the top |
| 待处理 | TODO（待实现） | `src/nodes/midi.js:299` | 枚举相关能力待补全。 | // @TODO: Enum |
| 待处理 | TODO（待实现） | `src/nodes/objects.js:164` | 待实现或待确认事项。 | // TODO should detect change or rebuild use a widget/action to refresh properties list |
| 待处理 | TODO（待实现） | `src/nodes/objects.js:266` | 待实现或待确认事项。 | // TODO should detect change or rebuild use a widget/action to refresh properties list |
| 待处理 | TODO（待实现） | `src/nodes/objects.js:300` | 待实现或待确认事项。 | // TODO fixthis :: property is not yet updated? |
