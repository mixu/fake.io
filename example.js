var MiniEventEmitter = require('miniee'),
    engine = require('./engine.js');


function Server() {
  this.server = null;
  this.channels = {};
}

MiniEventEmitter.mixin(Server);

// Attach to a http server
Server.prototype.attach = function(server) {
  var self = this;
  var server = this.server = engine.attach(server);

  server.on('connection', function(client) {

    console.log('[S] Connection', client);

    client.on('message', function(data) {

      var message = JSON.parse(data);
      if(!message || !message.op || !message.to) {
        console.log('[S] Rejecting message', data);
        return;
      }
      console.log('[S] Message', client, message);

    });
    client.on('close', function() {
      console.log('[S] Disconnect', client.id);
    });
  });

};


var s = new Server();

s.attach({});


var c = new engine.Socket();

c.send(JSON.stringify({ message: 'Hello world' }));
