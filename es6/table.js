const RowFactory = (data, mapper) => {
    const tr = document.createElement('TR');
    const keys = Object.keys(data);

    keys.forEach((key) => {
        const td = document.createElement('TD');
        const content = mapper[key](data);
        td.appendChild(content);
        tr.appendChild(td);
    });

    return tr;
} 

module.exports = class Table {
    constructor(config){
        this.node = document.createElement('TABLE');
        this.node.appendChild(RowFactory(config.header, config.rowMapper));
        this.rowMapper = config.rowMapper;
        this.data = config.data;
        this.sortKey = config.sortKey;
    }

    addOrUpdateRow(payload) {
        //here we are not sorting data, intead we are inserting it in a sorted order
        const currentIndex = this.data.findIndex(record => record.name == payload.name);
        if(currentIndex > -1) {
            this.data.splice(currentIndex, 1);
            this.node.removeChild(this.node.children[currentIndex + 1]);
        }
        let insertionIndex = this.data.findIndex(record => record[this.sortKey] < payload[this.sortKey]);
        insertionIndex = insertionIndex > -1 ? insertionIndex : this.data.length;
        this.data.splice(insertionIndex, 0, payload);
        this.node.insertBefore(RowFactory(payload, this.rowMapper), this.node.children[insertionIndex + 1]);
        Sparkline.draw(document.getElementById(payload.name), payload.midPrices);
    }

}