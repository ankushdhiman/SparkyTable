global.DEBUG = false;
require('./site/style.css')

var config = require('./es6/config');
var Table = require('./es6/table');
var table = new Table(config);

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
            // updates table
            var parsedData = JSON.parse(payload.body);
            var currentMidPrice = (parsedData.bestAsk + parsedData.bestBid) / 2;
            var row = table.data.find(function(row){ return row.name == parsedData.name });
            var existingMidPrices = row ? row.midPrices : [];
            parsedData.midPrices = existingMidPrices.concat([currentMidPrice]);
            table.addOrUpdateRow(parsedData);

            // delayed call for deletion of midPrices
            setTimeout(function(){
                var row = table.data.find(function(row){ return row.name == parsedData.name });
                row.midPrices.shift();
                table.addOrUpdateRow(row);
            }, 30000);
        });
    },
    function(error) {
        alert(error.headers.message);
    });