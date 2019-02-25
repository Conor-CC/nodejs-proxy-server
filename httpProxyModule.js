var net = require("net");
var url = require('url');
var fs = require('fs');
var hostCheck = require('./hostChecker.js')
var cache = require('./cache.js');
const remotePort = 80;


const httpProxyServer = net.createServer(function (socket) {
  var buffer = new Buffer([]);

  const socketErrorHandler = (err) => {
    console.error(err.message);
    if (typeof serviceSocket !== "undefined" && serviceSocket) {
      serviceSocket.end();
    } else if (typeof socket !== "undefined" && socket) {
      socket.end();
    }
  }
  const socketCloseHandler = () => {
    console.log("HEEYY");
    if (typeof serviceSocket !== "undefined" && serviceSocket) {
      console.log("IGJHOAIFJ");
      cache.pushPage(host, buffer, msg);
      serviceSocket.end();
    } else if (typeof socket !== "undefined" && socket) {
      socket.end();
    }
  }

  const clientSocketDataHandler = (msg) => {

    const addressString = msg.toString().split(" ");
    const address = url.parse(addressString[1], true);
    const host = address.host;
    console.log("REQ HOST: " + host);

    if (hostCheck.checkHostAllowed(host, socket)) {
      console.log("Allowed!");
      var check = cache.search(host);
      if (check !== -1) {
        console.log("Writing from cache...");
        console.log(check);
        socket.write(check);
      } else {
        const serviceSocket = net.connect(remotePort, address.host);
        serviceSocket.on("connect", () => {
          serviceSocket.write(msg);
        });
        serviceSocket.on("error", socketErrorHandler);
        serviceSocket.on("end", socketCloseHandler);
        /*
        The pipe() function reads data from a readable stream as it becomes
        available and writes it to a destination writable stream."
        https://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
        */
        serviceSocket.on("data", function (data) {
          buffer = Buffer.concat([buffer, new Buffer(data,'binary')]);
        });

        serviceSocket.pipe(socket, {end: false}).on("finish", function () {
          cache.pushPage(host, buffer, msg)
        });
        socket.pipe(serviceSocket, {end: false});
      }
    } else {
      console.log("nah fam");
      socket.write("403! No permission to access resource")
      socket.end();
    }
  }
  socket.on('data', clientSocketDataHandler);
  socket.on('close', socketCloseHandler);
  socket.on('error', socketErrorHandler);
});

function startHttpProxyServer(http_port) {
  const httpListener = httpProxyServer.listen(http_port, (err) => {
    if (err) {
      return console.error(err.stack);
    }
    console.log("HTTP Proxy open on localhost:" + http_port);
  });
}

module.exports.startHttpProxyServer = startHttpProxyServer;
