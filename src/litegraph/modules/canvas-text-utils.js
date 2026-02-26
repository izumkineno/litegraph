let LiteGraph = null;

export function setCanvasTextUtilsMethodsLiteGraph(liteGraph) {
    LiteGraph = liteGraph;
}

export const canvasTextUtilsMethods = {
canvasFillTextMultiline(context, text, x, y, maxWidth, lineHeight) {
        var words = (text+"").trim().split(' ');
        var line = '';
        var ret = {lines: [], maxW: 0, height: 0};
        if (words.length>1) {
            for(var n = 0; n < words.length; n++) {
                var testLine = line + words[n] + ' ';
                var metrics = context.measureText(testLine);
                var testWidth = metrics.width;
                if (testWidth > maxWidth && n > 0) {
                    context.fillText(line, x, y+(lineHeight*ret.lines.length));
                    line = words[n] + ' ';
                    // y += lineHeight;
                    ret.max = testWidth;
                    ret.lines.push(line);
                }else{
                    line = testLine;
                }
            }
        } else {
            line = words[0];
        }
        context.fillText(line, x, y+(lineHeight*ret.lines.length));
        ret.lines.push(line);
        ret.height = lineHeight*ret.lines.length || lineHeight;
        return ret;
    },
};
