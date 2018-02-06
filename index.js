global.DEBUG = false;
require('./site/style.css')

var tableConfig = {
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
        name: function(content){
            return document.createTextNode(content.name);
        },
        bestBid: function(content){
            return document.createTextNode(content.bestBid);
        },
        bestAsk: function(content){
            return document.createTextNode(content.bestAsk);
        },
        lastChangeAsk: function(content){
            return document.createTextNode(content.lastChangeAsk);
        },
        lastChangeBid: function(content){
            return document.createTextNode(content.lastChangeBid);
        },
        midPrices: function(content){
            var span = document.createElement('SPAN');
            span.setAttribute('id', content.name);
            return span;
        },
        openBid: function(content){
            return document.createTextNode(content.openBid);
        },
        openAsk: function(content){
            return document.createTextNode(content.openAsk);
        }
    }
};

var Table = require('./es6/table');
var table = new Table(tableConfig);
document.getElementById('root').appendChild(table.node);

var url = "ws://localhost:8011/stomp"
var client = Stomp.client(url);

client.debug = function(msg) {
    if (global.DEBUG) {
      console.info(msg)
    }
  }

client.connect({},
    function() {
        client.subscribe('/fx/prices', function(payload) {
            var parsedData = JSON.parse(payload.body);
            if(table.data.length > 0) {
                var row = table.data.find(function(row){ return row.name == parsedData.name });
                var midPrices = row ? row.midPrices : [];
                parsedData.midPrices = midPrices.concat([(parsedData.bestAsk + parsedData.bestBid) / 2]);
            }
            else {
                parsedData.midPrices = [(parsedData.bestAsk + parsedData.bestBid) / 2];
            }
            table.addOrUpdateRow(parsedData);

            setTimeout(function(){
                var row = table.data.find(function(row){ return row.name == parsedData.name });
                parsedData.midPrices = row.midPrices.slice(1);
                table.addOrUpdateRow(parsedData);
            }, 30000)
        });
    },
    function(error) {
        alert(error.headers.message);
    });