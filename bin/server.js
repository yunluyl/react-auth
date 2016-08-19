#!/usr/bin/env node
require('babel-register');
var sticky = require('socketio-sticky-session');
var port = normalizePort(process.env.PORT || '3000');
var stickyOptions;

if (process.env.DEV)
{
  stickyOptions =
  {
    num : 1,
    proxy : false,
  }
}
else
{

  stickyOptions =
  {
    num : 1,//process.env.WEB_CONCURRENCY,
    proxy : true,
  }
}

sticky(stickyOptions, function()
{
    var app = require('../app');
    app.set('port', port);
    var debug = require('debug')('tavelPlan:server');
    if (process.env.DEV)
    {
      var fs = require('fs');
      var options =
      {
        key : fs.readFileSync('./certs/server.key'),
        cert : fs.readFileSync('./certs/server.cert')
      };
      var https = require('https');
      var server = https.createServer(options, app);
    }
    else
    {
      var http = require('http');
      var server = http.createServer(app);
    }
    app.io.listen(server);
    server.on('error', onError);
    return server;    
}).listen(port, function()
{
    console.log('server started on ' + port + ' port');
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}
