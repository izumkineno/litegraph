import { CLASSIC_TOKENS } from "./tokens-classic.js";
import { PRAGMATIC_SLATE_TOKENS } from "./tokens-pragmatic-slate.js";
import { renderNodeShell } from "./node-shell.js";
import { renderNodeTitle } from "./node-title.js";
import { renderNodeSlots } from "./node-slots.js";
import { renderNodeTooltip } from "./node-tooltip.js";
import { renderWidgetButton } from "./widget-button.js";
import { renderWidgetToggle } from "./widget-toggle.js";
import { renderWidgetSlider } from "./widget-slider.js";
import { renderWidgetNumber } from "./widget-number.js";
import { renderWidgetCombo } from "./widget-combo.js";
import { renderWidgetText } from "./widget-text.js";
import { renderWidgetCustom } from "./widget-custom.js";

export const REQUIRED_NODE_COMPONENT_KEYS = Object.freeze([
    "node-shell",
    "node-title",
    "node-slots",
    "node-tooltip",
]);

const NODE_COMPONENTS = Object.freeze({
    "node-shell": renderNodeShell,
    "node-title": renderNodeTitle,
    "node-slots": renderNodeSlots,
    "node-tooltip": renderNodeTooltip,
});

const WIDGET_COMPONENTS = Object.freeze({
    button: renderWidgetButton,
    toggle: renderWidgetToggle,
    slider: renderWidgetSlider,
    number: renderWidgetNumber,
    combo: renderWidgetCombo,
    text: renderWidgetText,
    string: renderWidgetText,
    custom: renderWidgetCustom,
});

export function getNodeComponent(key) {
    return NODE_COMPONENTS[key] || null;
}

export function hasRequiredNodeComponents() {
    return REQUIRED_NODE_COMPONENT_KEYS.every((key) => typeof NODE_COMPONENTS[key] === "function");
}

export function getWidgetComponent(widget) {
    if (!widget) {
        return null;
    }
    if (typeof widget.draw === "function") {
        return WIDGET_COMPONENTS.custom || null;
    }
    const type = String(widget.type || "").toLowerCase();
    return WIDGET_COMPONENTS[type] || null;
}

export function getRenderStyleTokens(profile) {
    if (profile === "leafer-classic-v1" || profile === "legacy") {
        return CLASSIC_TOKENS;
    }
    return PRAGMATIC_SLATE_TOKENS;
}
