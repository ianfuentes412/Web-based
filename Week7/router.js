
var url = require('url');



function route(request, response)
{
    var pathname = decodeURI(url.parse(request.url).pathname);
    var tilde = require('tilde-expansion');
    var words = pathname.split('/'); // words[0] is '' and words[1] is '~...' because pathname starts with '/'.
    //Case 1
    if (words[1] != undefined && words[1][0] == '~') {  // e.g., /~tom/...
        tilde(words[1], function(expanded) {  // Note that a callback function is used.
            var new_pathname = expanded + '/public_html';  // 'public_html' should be included.
            for (var i = 2; i < words.length; i++)
                new_pathname += '/' + words[i];
            proceed_with_resolved_pathname(request, response, new_pathname);
        });
    }
    //Case 2
    else {
        var new_pathname = "/var/www/html" + pathname;
        proceed_with_resolved_pathname(request, response, new_pathname);
    }
}


function proceed_with_resolved_pathname(req, res, pathname) {
    //req: url of content REQuested from the html
    //res: url of where the RESponse will go
    //pathname: url of the sjs

    //Case 3: ends with /
let content_type = " ";
    if (pathname.endsWith("/"))
        pathname = pathname + "index.html";

    // Case 4,5
    const path = require("path");
    let fileordirname = path.basename(pathname);
    let words = fileordirname.split(".");
    let extension;

    // extension case
    
    if (words.length > 1) {
        extension = words[words.length - 1];
    } else {
        pathname += '/index.html';
        extension = 'html';
    }
    console.log('proceed Pathname: ' + pathname);

    // non sjs file case
    // Task 3.2

    if (extension != 'sjs' && extension != 'php') {

        var fs = require('fs');  // reference: Node.js File System Module

        switch (extension) {
            case "js":
                content_type = "application/js";
               break;
            case "json":
                content_type = "application/json";
                break;
            case "xml":
                content_type = "application/xml";
                break;
            case "pdf":
                content_type = "application/pdf";
                break;
            case "zip":
                content_type = "application/zip";
                break;
            case "css":
                content_type = "text/css";
                break;
            case "html":
                content_type = "text/html";
                break;
            case "bmp":
                content_type = "image/bmp";
                break;
            case "jpeg":
                // In many cases, "jpg" is more commonly used instead of "jpeg"
                content_type = "image/jpeg";
                break;
            // If the extension is not recognized, default to plain text
            default:
                content_type = "text/plain";
                break;
        }


        fs.readFile(pathname, 'utf8', function(err, content) {
            if (!err) {
    
                res.writeHead(200, {'Content-type': content_type});  // 200: OK; important
                res.write(content);
                res.end();
            }
            else {
                res.writeHead(404, {'Content-type': content_type});  // 4xx: client error
                res.write("<html><body><h1>Not Found</h1><p>The requested URL was not found on this server.</p><hr></body></html>");
                res.end();
            }
        });
        
                         

    }

    else if (extension = 'sjs'){
        if (req.method.toLowerCase() == "get"){
            var querystring = require('querystring');
            var getPathname = decodeURI(url.parse(req.url).pathname);
            console.log("GET pathname: " + getPathname);

            var getQuery = decodeURI(url.parse(req.url).query);
            console.log("query: " + getQuery);

            var _GET = querystring.parse(getQuery);
            console.log("_GET: ", _GET);
            proceed_sjs(_GET, _POST, pathname);
        }

        else if (req.method.toLowerCase() == "post"){
            // For testing
            //var events = require('events');
            //var postReq = new events.EventEmitter();

            // Node WebServer
            var querystring = require('querystring');

            var query = "";
            var _POST = {};


            req.on('data', function(chunk) {
                query += chunk;  // add chunk to query
                console.log('req query: ' + query);
                });
    
            req.on('end', function() {
                if (query != ''){
                    _POST = querystring.parse(decodeURI(query));
                    console.log("_POST: ", _POST);
                    proceed_sjs(_GET, _POST, pathname);
                }
                else{
                    console.log('Query is Empty');
                }
                });

            // For testing
            //var postQuery = "operation=add&op1=30&op2=40";
            //console.log('postQuery: '+ postQuery);
            //postReq.emit('data', postQuery);
            //postReq.emit('end');

        }
        
        
        
    }


    function proceed_sjs(_GET, _POST, pathname) {
        var ended = false;
        try{
        var sjs = require(pathname);
    
        sjs.proceed(_GET, _POST, function(message) {
            if(!ended){
                delete require.cache[require.resolve(pathname)];
                ended = true;
    
                console.log(message);
                res.writeHead(200, {'Content-type': "text/plain"});
                res.write(JSON.stringify(message));
                res.end();
    
            }
        });
        }
        catch(err){
            console.log(err);
        }
    }
}
exports.route = route;



/*

*/