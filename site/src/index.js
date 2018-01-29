const React = require('react');
const ReactDom = require('react-dom');
const App = require('./app');

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url);

client.debug = function(msg) {
    if (global.DEBUG) {
      console.info(msg)
    }
  }

client.connect({},
  () => {
    ReactDom.render(<App client={client} />, document.getElementById("root"));
  },
  (error) => {
    alert(error.headers.message);
  });