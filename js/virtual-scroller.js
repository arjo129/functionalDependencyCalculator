class VirtualScroller {
    constructor(itemHeight, buffer) {
        this.itemHeight = itemHeight;
        this.buffer = buffer;
        this.items = [];
        this.views = [];
    }

    onScroll(){
        this.update()
    }

    update() {
        const start = Math.max(Math.floor(this.viewpoint.scrollTop / this.itemHeight) - this.buffer, 0);
        const end = Math.min(Math.min(start + Math.ceil(this.viewpoint.clientHeight / this.itemHeight) + 1, this.items.length) + this.buffer, this.items.length);

        this.renderList(start, end);

        if (end * this.itemHeight < this.viewpoint.clientHeight) {
            this.update();
        }
    }

    renderList(start, end) {
        for (let key in this.views) {
            if (parseInt(key) < start || parseInt(key) >= end) {
                this.views[key].remove();
                delete this.views[key];
            }
        }
        for (let i = start; i < end; i++) {
            if (this.views[i.toString()]){
                continue;
            }
            let node = document.createElement("div");
            node.style.position = "absolute";
            node.style.height = `${this.itemHeight}px`;
            node.style.transform = `translate(0,${i * this.itemHeight}px)`;
            node.innerHTML = this.items[i];
            this.views[i.toString()] = node;
            this.content.appendChild(node);
        }
    }

    setItems(items) {
        this.items = items;
        this.content.style.height = `${this.items.length * this.itemHeight}px`;
        this.views = [];
        this.content.innerHTML = "";
        this.update();
    }

    mount(element) {
        this.viewpoint = element;
        this.content = document.createElement("div");
        this.content.style.position = "relative";
        this.viewpoint.appendChild(this.content);
        this.viewpoint.addEventListener("scroll", this.onScroll.bind(this));
        return this;
    }


}
