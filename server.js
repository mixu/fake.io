var MiniEventEmitter = require('miniee');

function FakeServer() {
  this.clients = [];
  this.clientsCount = 0;
}

MiniEventEmitter.mixin(FakeServer);

FakeServer.prototype.close = function() {

};

module.exports = FakeServer;
