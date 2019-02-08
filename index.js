var express = require("express");
var request = require("request");
var fs = require("fs");
var tls = require("tls");
var net = require("net");

var app = express();

var options = {
  key: fs.readFileSync('private-key.pem'),
  cert: fs.readFileSync('public-cert.pem')
};

const LOCAL_PORT  = 6512;
const REMOTE_PORT = 80;
const REMOTE_ADDR = "www.lolcats.com";


var httpServer = net.createServer(function (socket) {
    socket.on('data', function (msg) {
        //parseClientRequest Currently does nothing but is necessary for mapping host name to remote socket
        //also necessary for maintaining forbidden host list
        clientRequest = parseClientRequest(msg);


        var isHttps = clientRequest.primary_request.split(" ")
        var address = isHttps[0];
        console.log(address);
        if(address.includes(":443") !== undefined) {
          console.log("Oh shit its https!!");
        }

        //Here, after parsing, decide the request type and
        //console.log('  ** START ** ');
        console.log('<< From client to proxy ', msg.toString());
        //refresh this socket every connection close to clear cookie data
        var serviceSocket = new net.Socket();


        serviceSocket.connect(parseInt(80), address, function () {
            console.log('>> From proxy to remote', msg.toString());
            serviceSocket.write(msg);
        });
        serviceSocket.on("data", function (data) {
            console.log('<< From remote to proxy', data.toString());
            socket.write(data);
            console.log('>> From proxy to client', data.toString());
        });
        serviceSocket.on("error", function (data) {
            //console.log('<< From remote to proxy', data.toString());
            //console.log(data);
            //console.log('>> From proxy to client', data.toString());
        });

    });

    socket.on('error', function (msg) {
      console.log(msg);
    });

});
httpServer.listen(6512);

function parseClientRequest(msg) {
  //Json object to be returned with all header data encapsulated
  var clientRequest = {};
  //Split header content
  toParse = msg.toString();
  array = toParse.split('\r\n')
  //Remove primary request url
  clientRequest.primary_request = array[0]
  //Build JSON object
  var i;
  var item = "";
  var attribute = "";
  var value = "";
  for (i = 1; i < array.length - 1; i++) {
    item = array[i];
    item = item.split(": ");
    attribute = item[0];
    value = item[1];
    clientRequest[attribute] = value;
  }
  //console.log(clientRequest);
  return clientRequest;
}
