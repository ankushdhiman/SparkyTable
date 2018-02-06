module.exports = {
    data: [],
    header: {
        name: "NAME",
        bestBid: "BEST BID",
        bestAsk: "BEST ASK",
        openBid: "OPEN BID",
        openAsk: "OPEN ASK",
        lastChangeAsk: "CHANGE IN ASK",
        lastChangeBid: "CHANGE IN BID",
        midPrices: ""        
    },    
    sortKey: 'lastChangeBid',
    rowMapper: {
        name: content => document.createTextNode(content.name),
        bestBid: content => document.createTextNode(content.bestBid),
        bestAsk: content => document.createTextNode(content.bestAsk),
        lastChangeAsk: content => document.createTextNode(content.lastChangeAsk),
        lastChangeBid: content => document.createTextNode(content.lastChangeBid),
        midPrices: content => {
            var span = document.createElement('SPAN');
            span.setAttribute('id', content.name);
            Sparkline.draw(span, content.midPrices);
            return span;
        },
        openBid: content => document.createTextNode(content.openBid),
        openAsk: content => document.createTextNode(content.openAsk)
    }
};
