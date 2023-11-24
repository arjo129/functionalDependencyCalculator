importScripts("https://cdn.jsdelivr.net/npm/katex@0.10.0/dist/katex.min.js")
importScripts("js/calculate-lib.js")

onmessage = function (event) {
    try {
        let text = event.data
        let fds = parseAttributes(text)
        let relationalSchema = new RelationalSchema(fds);
        let attributeClosures = relationalSchema.allAttributeClosures();
        let attributeClosureItems = renderAttributeClosures(attributeClosures, relationalSchema.extractAttributes().size, relationalSchema);
        let functionalClosureItems = renderFunctionalClosure(relationalSchema.closure(), relationalSchema);
        let secondNF = relationalSchema.isSecondNF();
        let thirdNF = relationalSchema.isThirdNF();
        let bcNF = relationalSchema.isBCNF();
        let minimalCover = relationalSchema.minimalCover().toLatex();
        postMessage({
            successful: true,
            data: {
                attributeClosureItems: attributeClosureItems,
                functionalClosureItems: functionalClosureItems,
                secondNF: secondNF,
                thirdNF: thirdNF,
                bcNF: bcNF,
                minimalCover: minimalCover
            }
        })
    } catch (e) {
        console.error("Failed to parse input" + e);
        postMessage({
            successful: false,
            message: e.toString()
        })
    }
}
