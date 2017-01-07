'use strict';

// Module imports
var express = require('express')
  , restify = require('restify')
  , http = require('http')
  , bodyParser = require('body-parser')
  , log = require('npmlog-ts')
  , util = require('util')
//  , async = require('async')
;

// Instantiate classes & servers
const wsURI = '/ws';
var app    = express()
  , router = express.Router()
  , server = http.createServer(app)
  , io = require('socket.io')(server, { path: wsURI });
;

// ************************************************************************
// Main code STARTS HERE !!
// ************************************************************************

// Main handlers registration - BEGIN
// Main error handler
process.on('uncaughtException', function (err) {
  console.log("Uncaught Exception: " + err);
  console.log("Uncaught Exception: " + err.stack);
});
// Detect CTRL-C
process.on('SIGINT', function() {
  console.log("Caught interrupt signal");
  console.log("Exiting gracefully");
  process.exit(2);
});
// Main handlers registration - END

const PORT = process.env.DASHBOARDPORT || 9009;

// REST engine initial setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// WEBSOCKET stuff - BEGIN

/**
var pingpong = setInterval(function() {
  io.sockets.emit('ping', { beat : 1 });
}, 1000);
**/

io.on('connection', function (socket) {
  console.log("Connected!!");
  socket.conn.on('heartbeat', function() {
    console.log('heartbeat');
  });

  socket.on('msg', function (data, callback) {
    console.log("Messgae received: " + data);
    callback('ack');
  });
  socket.on('disconnect', function () {
    console.log("Socket disconnected");
  });
  socket.on('error', function (err) {
    console.log("Error: " + err);
  });
  socket.on('pong', function (beat) {
    console.log("Pong: " + beat);
  });
});

// WEBSOCKET stuff - END

server.listen(PORT, function() {
  console.log("WS server running on http://localhost:" + PORT + wsURI);
});
