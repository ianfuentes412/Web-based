var PORT_NO = 8013;  // Use your port number, not 8080
var http = require('http');
function start(router) {  // Do we have to require 'router'?
    var server = http.createServer(
        (request, response) => {  // request: from the client; response: to the client
            router.route(request, response);
        }
    );
    server.listen(PORT_NO);
}
// Something more
exports.start = start;