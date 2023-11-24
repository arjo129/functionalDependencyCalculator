function renderNF(warning, id) {
    if (warning) {
        try {
            document.getElementById(id).classList.add("list-group-item-success");
            document.getElementById(id).classList.remove("list-group-item-danger");
        } catch (e) {
        }

    } else {
        try {
            document.getElementById(id).classList.add("list-group-item-danger");
            document.getElementById(id).classList.remove("list-group-item-success");
        } catch (e) {
        }
    }
}

window.onload = function (ev) {
    let attributeClosuresVirtualScroller = new VirtualScroller(28, 16).mount(document.getElementById("attribute_closures_content"));
    let functionalClosureVirtualScroller = new VirtualScroller(28, 16).mount(document.getElementById("fd_closure_content"));

    var input = document.getElementById("functional_deps");
    input.addEventListener("change", function (evt) {
        document.getElementById("badge-calculating").style.visibility = "visible";
        let worker = new Worker("js/calculate-worker.js");
        worker.onmessage = function (event) {
            document.getElementById("badge-calculating").style.visibility = "hidden";
            if (event.data.successful) {
                let data = event.data.data;
                attributeClosuresVirtualScroller.setItems(data.attributeClosureItems);
                functionalClosureVirtualScroller.setItems(data.functionalClosureItems);
                renderNF(data.secondNF, "2NF");
                renderNF(data.thirdNF, "3NF");
                renderNF(data.bcNF, "BCNF");
                document.getElementById("errorbox").innerHTML = "";
                document.getElementById("min_cover").innerHTML = katex.renderToString(data.minimalCover, {
                    throwOnError: false
                });
            } else {
                document.getElementById("errorbox").innerHTML = event.data.message;
            }
        }
        worker.postMessage(input.value);
    });
};
