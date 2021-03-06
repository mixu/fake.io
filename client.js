var MiniEventEmitter = require('miniee');

var counter = 1;

function FakeServerClient(parent) {
  this.parent = parent;
  this.id = counter++;
};

MiniEventEmitter.mixin(FakeServerClient);

FakeServerClient.prototype.send = function(message) {
  var self = this;
//  console.log('receivePacket', message);
  process.nextTick(function() {
    self.parent.emit('message', message);
  });
};



function FakeEngineClient(server) {
  var self = this;
  this.server = server;
  this.serverSocket = new FakeServerClient(this);

  process.nextTick(function() {

    server.clients[self.serverSocket.id] = self.serverSocket;
    server.clientCount++;

    server.emit('connection', self.serverSocket);

    process.nextTick(function() {
      self.emit('open');
    })
  });
}

MiniEventEmitter.mixin(FakeEngineClient);

FakeEngineClient.prototype.send = function(message) {
  var self = this;
//  console.log('send', arguments);
  process.nextTick(function() {
    self.serverSocket.emit('message', message);
  });
};

FakeEngineClient.prototype.sendPacket = function(type, message) {
  var self = this;
//  console.log('sendPacket', message);
  process.nextTick(function() {
    self.serverSocket.emit('message', message);
  });
};

FakeEngineClient.prototype.close = function() {
  this.emit('close');
};

FakeEngineClient.prototype.setOffline = function() {
  var self = this;
//  this.emit('close');
  process.nextTick(function() {
    delete self.server.clients[self.serverSocket.id];
    self.server.clientCount--;
    self.serverSocket.emit('close');
  });
};

FakeEngineClient.prototype.setOnline = function() {
  var self = this;
//  this.emit('open');
  process.nextTick(function() {
    self.server.clients[self.serverSocket.id] = self.serverSocket;
    self.server.clientCount++;

    self.server.emit('connection', self.serverSocket);
  });
};

module.exports = FakeEngineClient;
