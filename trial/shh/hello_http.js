var http = require('http');  // Require 'http' module; We will study it in detail in the next section.
var server = http.createServer((req, res) => {  // HTTP server object to deal with HTTP requests from clients
    res.writeHead(200);  // Sends the head to the client with the reponse number 200
    res.end('Hello World!');  // Sends the message back to the client
});
server.listen(8013);