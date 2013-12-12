var mysql = require('mysql');

/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
var dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});

dbConnection.connect();
/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/

/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */



//************************************************************************
// Chatterbox server code from Sara/Sam
//************************************************************************

/* Import node's http module: */
var http = require("http");
var handleRequest = require('./request-handler').handleRequest;
var servIndex = require('./file-handler').servIndex;
var filesys = require('./file-handler').filesys;

var port = 8080;
var ip = "127.0.0.1";

var headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Accept, X-Parse-Application-Id, X-Parse-REST-API-Key",
  "Access-Control-Max-Age": 10,
  'Content-Type': "text/plain"
};

var router = {
  "/": servIndex,
  "/classes/messages": handleRequest,
  "/bower_components/jquery/jquery.min.js": filesys,
  "/bower_components/underscore/underscore-min.js": filesys,
  "/bower_components/backbone/backbone-min.js": filesys,
  "/bower_components/jquery/jquery.min.map": filesys,
  "/bower_components/underscore/underscore-min.map": filesys,
  "/bower_components/backbone/backbone-min.map": filesys,
  "/scripts/config.js": filesys,
  "/scripts/app.js": filesys
};

var server = http.createServer(function(request, response){
  if (router[request.url] === undefined){
    handleRequest(request, response);
  } else {
    router[request.url](request, response, headers);
  }
});

console.log("Listening on http://" + ip + ":" + port);

server.listen(port, ip);