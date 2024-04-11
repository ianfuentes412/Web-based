
var url = require('url');
var tilde = require('tilde-expansion');
const path = require("path"); 
exports.route = route;

function route(request, response)
{
    var pathname = decodeURI(url.parse(request.url).pathname);
    var tilde = require('tilde-expansion');
    var pathname = decodeURI(url.parse(request.url).pathname);
    var words = pathname.split('/'); // words[0] is '' and words[1] is '~...' because pathname starts with '/'.
    if (words[1] != undefined && words[1][0] == '~') {  // e.g., /~tom/...
        tilde(words[1], function(expanded) {  // Note that a callback function is used.
            var new_pathname = expanded + '/public_html';  // 'public_html' should be included.
            for (var i = 2; i < words.length; i++)
                new_pathname += '/' + words[i];
            proceed_with_resolved_pathname(request, response, new_pathname);
        });
    }
    else {
        var new_pathname = "/var/www/html" + pathname;
        proceed_with_resolved_pathname(request, response, new_pathname);
    }
}


function proceed_with_resolved_pathname(req, res, pathname) {

    // end with / case

    if (pathname.endsWith("/"))
        pathname = pathname + "index.html";

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

    // non sjs file case
    if (extension != 'sjs' && extension != 'php') {
        var fs = require('fs');  // reference: Node.js File System Module
        switch (extension) {
            case "js":
                content_type = "application/js";
            case "json":
                content_type = "application/json";
            case "xml":
                content_type = "application/xml";
            case "pdf":
                content_type = "application/pdf";
            case "zip":
                content_type = "application/zip";
            case "css":
                content_type = "text/css";
            case "html", "htm":
                content_type = "text/html";
            case "bmp":
                content_type = "image/bmp";
            case "jpeg":
                // In many cases, "jpg" is more commonly used instead of "jpeg"
                content_type = "image/jpeg";
            // If the extension is not recognized, default to plain text
            default:
                content_type = "text/plain";
        }
    }

    else if (extention == 'sjs'){
        if (request.method.toLowerCase() == "get"){
            var _GET = querystring.parse(decodeURI(url.parse(request.url).query));
            window.alert(JSON.stringify(_GET));
        }
        else if (request.method.toLowerCase() == 'post'){
            
        }
    }
        
                         
        fs.readFile(pathname, 'utf8', function(err, content) {
            if (!err) {
                res.writeHead(200, {'Content-type': content_type});  // 200: OK; important
                res.write(content);
                res.end();
            }
            else {
                res.writeHead(404, {'Content-type': content_type});  // 4xx: client error
                res.end("<html><body><h1>Not Found</h1><p>The requested URL was not found on this server.</p><hr></body></html>");
            }
        });
    }

    res.writeHead(200, {"Content-Type": "text/html"});  // text/html, not text/plain, in this example
    res.write("<h1>Echo with Node.js Web Server</h1><br> <hr>");
    res.write("<form> Message: <input type='text'></input> <br>");
    res.write("<input type='submit' value='Submit'></form>");
    //res.write("Pathname: "+ pathname + "<br>");
    //res.write("Extension: " + extension + "<br>");
    res.end();
}