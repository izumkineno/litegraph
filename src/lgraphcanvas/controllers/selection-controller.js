import * as selection_clipboard from "../modules/selection-clipboard.js";

export class SelectionController {
    constructor(host) {
        this.host = host;
    }

    copyToClipboard(...args) {
        return selection_clipboard.copyToClipboard.apply(this.host, args);
    }

    pasteFromClipboard(...args) {
        return selection_clipboard.pasteFromClipboard.apply(this.host, args);
    }

    processNodeDblClicked(...args) {
        return selection_clipboard.processNodeDblClicked.apply(this.host, args);
    }

    processNodeSelected(...args) {
        return selection_clipboard.processNodeSelected.apply(this.host, args);
    }

    selectNode(...args) {
        return selection_clipboard.selectNode.apply(this.host, args);
    }

    selectNodes(...args) {
        return selection_clipboard.selectNodes.apply(this.host, args);
    }

    deselectNode(...args) {
        return selection_clipboard.deselectNode.apply(this.host, args);
    }

    deselectAllNodes(...args) {
        return selection_clipboard.deselectAllNodes.apply(this.host, args);
    }

    deleteSelectedNodes(...args) {
        return selection_clipboard.deleteSelectedNodes.apply(this.host, args);
    }

    onNodeSelectionChange(...args) {
        return selection_clipboard.onNodeSelectionChange.apply(this.host, args);
    }

    boundaryNodesForSelection(...args) {
        return selection_clipboard.boundaryNodesForSelection.apply(this.host, args);
    }

}
