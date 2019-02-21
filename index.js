'use strict';
const https_proxy_port = process.env.HTTPS_PORT || 6513;
const http_proxy_port = process.env.HTTP_PORT || 6512;
const httpProxyModule = require('./httpProxyModule.js');
const httpsProxyModule = require('./httpsProxyModule.js');
const inputEngine = require('./input.js');


//Returns a http proxy server listener for the given port
const httpProxyServer = httpProxyModule.startHttpProxyServer(http_proxy_port);

//Returns a https proxy server listener for the given port
const httpsProxyServer = httpsProxyModule.startHttpsProxyServer(https_proxy_port);
