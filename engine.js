var FakeServer = require('./server.js'),
    FakeEngineClient = require('./client.js');

var instance = new FakeServer();

exports.attach = function(server) {
  return instance;
};

exports.Socket = function() {
  return new FakeEngineClient(instance);
}
