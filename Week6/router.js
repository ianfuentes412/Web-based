
var url = require('url');


function route(request, response)
{
    var pathname = decodeURI(url.parse(request.url).pathname);
    var tilde = require('tilde-expansion');
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
    console.log('proceed pathname: ' + pathname);
    console.log('proceed req: ' + req);
let content_type = " ";
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
            console.log('readFile Pathname: '+ pathname);
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


}
exports.route = route;

/*

*/