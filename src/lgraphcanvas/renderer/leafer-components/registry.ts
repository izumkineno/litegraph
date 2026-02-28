import { CLASSIC_TOKENS } from "./tokens-classic.ts";
import { PRAGMATIC_SLATE_TOKENS } from "./tokens-pragmatic-slate.ts";
import { renderNodeShell } from "./node-shell.ts";
import { renderNodeTitle } from "./node-title.ts";
import { renderNodeSlots } from "./node-slots.ts";
import { renderNodeTooltip } from "./node-tooltip.ts";
import { renderWidgetButton } from "./widget-button.ts";
import { renderWidgetToggle } from "./widget-toggle.ts";
import { renderWidgetSlider } from "./widget-slider.ts";
import { renderWidgetNumber } from "./widget-number.ts";
import { renderWidgetCombo } from "./widget-combo.ts";
import { renderWidgetText } from "./widget-text.ts";
import { renderWidgetCustom } from "./widget-custom.ts";
import type {
    LeaferNodeComponent,
    LeaferWidgetComponent,
    LeaferWidgetLike,
    RenderStyleProfileLike,
    RenderStyleTokensLike,
} from "../leafer-types.ts";

export const REQUIRED_NODE_COMPONENT_KEYS = Object.freeze([
    "node-shell",
    "node-title",
    "node-slots",
    "node-tooltip",
]);

const NODE_COMPONENTS: Record<string, LeaferNodeComponent> = Object.freeze({
    "node-shell": renderNodeShell,
    "node-title": renderNodeTitle,
    "node-slots": renderNodeSlots,
    "node-tooltip": renderNodeTooltip,
});

const WIDGET_COMPONENTS: Record<string, LeaferWidgetComponent> = Object.freeze({
    button: renderWidgetButton,
    toggle: renderWidgetToggle,
    slider: renderWidgetSlider,
    number: renderWidgetNumber,
    combo: renderWidgetCombo,
    text: renderWidgetText,
    string: renderWidgetText,
    custom: renderWidgetCustom,
});

/** 中文说明：getNodeComponent 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function getNodeComponent(key: string): LeaferNodeComponent | null {
    return NODE_COMPONENTS[key] || null;
}

/** 中文说明：hasRequiredNodeComponents 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function hasRequiredNodeComponents(): boolean {
    return REQUIRED_NODE_COMPONENT_KEYS.every((key) => typeof NODE_COMPONENTS[key] === "function");
}

/** 中文说明：getWidgetComponent 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function getWidgetComponent(widget: LeaferWidgetLike | null | undefined): LeaferWidgetComponent | null {
    if (!widget) {
        return null;
    }
    if (typeof widget.draw === "function") {
        return WIDGET_COMPONENTS.custom || null;
    }
    const type = String(widget.type || "").toLowerCase();
    return WIDGET_COMPONENTS[type] || null;
}

/** 中文说明：getRenderStyleTokens 为迁移后的 TS 导出函数，负责 Leafer 渲染流程中的对应步骤。 */
export function getRenderStyleTokens(profile: RenderStyleProfileLike): RenderStyleTokensLike {
    if (profile === "leafer-classic-v1" || profile === "legacy") {
        return CLASSIC_TOKENS;
    }
    return PRAGMATIC_SLATE_TOKENS;
}





