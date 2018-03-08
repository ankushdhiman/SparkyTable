const createRow = (data, mapper) => {
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
    constructor(config) {
        this.node = document.createElement('TABLE');
        this.node.appendChild(createRow(config.header, config.rowMapper));
        this.rowMapper = config.rowMapper;
        this.data = config.data;
        this.sortKey = config.sortKey;
    }

    removeRow(name) {
        const currentIndex = this.data.findIndex(record => record.name == name);
        if (currentIndex > -1) {
            this.data.splice(currentIndex, 1);
            this.node.removeChild(this.node.children[currentIndex + 1]);
        }
    }

    insertRow(rowData) {
        let insertionIndex = this.data.findIndex(record => record[this.sortKey] < rowData[this.sortKey]);
        insertionIndex = insertionIndex > -1 ? insertionIndex : this.data.length;
        this.data.splice(insertionIndex, 0, rowData);
        this.node.insertBefore(createRow(rowData, this.rowMapper), this.node.children[insertionIndex + 1]);
    }

    mainCallback(parsedData) {
        const currentMidPrice = (parsedData.bestAsk + parsedData.bestBid) / 2;
        const row = this.data.find(row => row.name == parsedData.name);
        const existingMidPrices = row ? row.midPrices : [];
        const rowData = Object.assign({}, parsedData, { midPrices: existingMidPrices.concat([currentMidPrice]) });
        this.removeRow(parsedData.name);
        this.insertRow(rowData);
    }

    delayedCallback(parsedData) {
        const rowData = this.data.find(row => row.name == parsedData.name);
        rowData.midPrices.shift();
        this.removeRow(rowData.name);
        this.insertRow(rowData);
    }
}