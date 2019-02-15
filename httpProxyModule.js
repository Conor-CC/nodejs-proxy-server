var net = require("net");
var url = require('url');
const remotePort = 80;


const httpProxyServer = net.createServer(function (socket) {

  const socketErrorHandler = (err) => {
    console.error(err.message);
    if (serviceSocket) {
      serviceSocket.end();
    } else if (socket) {
      socket.end();
    }
  }
  const socketCloseHandler = () => {
    if (serviceSocket) {
      socket.end();
    } else if (socket) {
      serverSocket.end();
    }
  }

  const clientSocketDataHandler = (msg) => {
    const addressString = msg.toString().split(" ");
    const address = url.parse(addressString[1], true);
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
    serviceSocket.pipe(socket, {end: false});
    socket.pipe(serviceSocket, {end: false});
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
