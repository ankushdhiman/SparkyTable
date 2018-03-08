global.DEBUG = false;
require('./site/style.css')

var config = require('./es6/config');
var Table = require('./es6/table');
var table = new Table(config);

document.getElementById('root').appendChild(table.node);
var url = "ws://localhost:8011/stomp"
var client = Stomp.client(url);

client.debug = function (msg) {
    if (global.DEBUG) {
        console.info(msg)
    }
}
var PubSub = require('./es6/pub-sub');
var subject = new PubSub.Subject();
var observer1 = new PubSub.Observer(table.mainCallback.bind(table));
var observer2 = new PubSub.Observer(table.delayedCallback.bind(table));
subject.addObserver(observer1);
subject.addObserver(observer2);

client.connect({},
    function () {
        client.subscribe('/fx/prices', function (payload) {
            subject.notify(observer1.id, JSON.parse(payload.body));
            setTimeout(function(){
                console.log('delayed running');
                subject.notify(observer2.id, JSON.parse(payload.body));
            }, 3000);
        });
    },
    function (error) {
        alert(error.headers.message);
    }
);