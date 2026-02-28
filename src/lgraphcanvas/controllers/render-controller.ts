// @ts-nocheck
import * as render_frame from "../modules/render-frame.ts";
import * as render_nodes from "../modules/render-nodes.ts";
import * as render_links from "../modules/render-links.js";
import * as render_background_groups from "../modules/render-background-groups.js";

/** 中文说明：RenderController 为迁移后的 TS 导出类，封装 Leafer 渲染相关能力。 */
export class RenderController {
    constructor(host) {
        this.host = host;
    }

    draw(...args) {
        return render_frame.draw.apply(this.host, args);
    }

    drawFrontCanvas(...args) {
        return render_frame.drawFrontCanvas.apply(this.host, args);
    }

    lowQualityRenderingRequired(...args) {
        return render_frame.lowQualityRenderingRequired.apply(this.host, args);
    }

    beginNodeFrameLeafer(...args) {
        return render_nodes.beginNodeFrameLeafer.apply(this.host, args);
    }

    endNodeFrameLeafer(...args) {
        return render_nodes.endNodeFrameLeafer.apply(this.host, args);
    }

    drawNode(...args) {
        return render_nodes.drawNode.apply(this.host, args);
    }

    drawNodeTooltip(...args) {
        return render_nodes.drawNodeTooltip.apply(this.host, args);
    }

    drawNodeShape(...args) {
        return render_nodes.drawNodeShape.apply(this.host, args);
    }

    drawExecutionOrder(...args) {
        return render_nodes.drawExecutionOrder.apply(this.host, args);
    }

    drawNodeWidgets(...args) {
        return render_nodes.drawNodeWidgets.apply(this.host, args);
    }

    processNodeWidgets(...args) {
        return render_nodes.processNodeWidgets.apply(this.host, args);
    }

    adjustNodesSize(...args) {
        return render_nodes.adjustNodesSize.apply(this.host, args);
    }

    drawConnections(...args) {
        return render_links.drawConnections.apply(this.host, args);
    }

    renderLink(...args) {
        return render_links.renderLink.apply(this.host, args);
    }

    computeConnectionPoint(...args) {
        return render_links.computeConnectionPoint.apply(this.host, args);
    }

    drawLinkTooltip(...args) {
        return render_links.drawLinkTooltip.apply(this.host, args);
    }

    drawBackCanvas(...args) {
        return render_background_groups.drawBackCanvas.apply(this.host, args);
    }

    drawSubgraphPanel(...args) {
        return render_background_groups.drawSubgraphPanel.apply(this.host, args);
    }

    drawSubgraphPanelLeft(...args) {
        return render_background_groups.drawSubgraphPanelLeft.apply(this.host, args);
    }

    drawSubgraphPanelRight(...args) {
        return render_background_groups.drawSubgraphPanelRight.apply(this.host, args);
    }

    drawButton(...args) {
        return render_background_groups.drawButton.apply(this.host, args);
    }

    isAreaClicked(...args) {
        return render_background_groups.isAreaClicked.apply(this.host, args);
    }

    renderInfo(...args) {
        return render_background_groups.renderInfo.apply(this.host, args);
    }

    drawGroups(...args) {
        return render_background_groups.drawGroups.apply(this.host, args);
    }

}




