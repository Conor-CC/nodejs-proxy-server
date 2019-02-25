'use strict';
const http = require("http");
const https_port = process.env.HTTPS_PORT || 6513;
const http_port = process.env.HTTP_PORT || 6512;
const net = require("net");
const url = require('url');
var hostCheck = require('./hostChecker.js')
var fs = require('fs');

/*
  Nodejs dev pattern:
    1. write the handler code
    2. carry out the actions
    3. define the reactions
*/

const proxyServerHttps = http.createServer();

//on client connection
proxyServerHttps.on("connect", (req, client) => {
  const {port, hostname} = url.parse(`//${req.url}`, false, true);
  const remotePort = port;
  const remoteHost = hostname;


  if (hostCheck.checkHostAllowed(remoteHost)) {
      console.log("Host allowed");
      console.log(remoteHost + ":" + remotePort);
      if (remotePort !== undefined && remoteHost !== undefined) {
        //If host and port have been parsed successfully,
        //set up connection to remote

        //on socket error...
        const socketErrorHandler = (err) => {
          console.error(err.message);
          if (client !== undefined) {
            client.end();
          }
        }
        //on socket close...
        const socketCloseHandler = () => {
          if (client !== undefined) {
            client.end()
          }
        }
        //create remote socket and connect to remote address
        const remoteSocket = net.connect(remotePort, remoteHost);
        //Assuming connection of remote went fine, tell client they can transmit
        remoteSocket.on("connect", () => {
          client.write("HTTP/1.1 200 Connection Established\r\nProxy-agent: Node-Proxy\r\n\r\n");
          /*
          https://nodejs.org/api/stream.html#stream_readable_pipe_destination_options
          */
          remoteSocket.pipe(client, {end: false});
          client.pipe(remoteSocket, {end: false});
        });
        //point socket to error and exit events
        remoteSocket.on('error', socketErrorHandler);
        remoteSocket.on('end', socketCloseHandler);

        //point client to error and exit events
        client.on('error', socketErrorHandler)
        client.on('end', socketCloseHandler)
      } else {
        client.destroy();
      }
  } else {
        client.end()
  }
});

function startHttpsProxyServer() {
  const listener = proxyServerHttps.listen(https_port, (err) => {
    if (err) {
      return console.error(err.stack);
    }
    console.log("HTTPS Proxy open on localhost:" + https_port);
  });
}

module.exports.startHttpsProxyServer = startHttpsProxyServer;
