/*var url = require("url");  // reference: Node.js URL Module
var adr = 'http://cs.tru.ca:8013/~w4ifuentes/index3.js'
var q = url.parse(adr, true);



function route(request, response) {
    var pathname = decodeURI(q.pathname);  // decodeURI(): a JS built-in function
                                                                // reference: JavaScript decodeURI()
    response.writeHead(200, {"Content-Type": "text/html"});  // text/html, not text/plain, in this example
    response.write("This is a new Server!<br>");
    console.log(pathname);
    response.write(pathname + "<br>");
    response.end();
}

exports.route = route; */

var url = require('url');
var tilde = require('tilde-expansion');
const path = require("path"); 
exports.route = route;

function route(request, response)
{
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
    if (pathname.endsWith("/"))
        pathname = pathname + "/index.html";
    
        // Case 4
    let fileordirname = path.basename(pathname);
    console.log(fileordirname);
    let words = fileordirname.split('.');  // to see if '.' is in the basename
        let extension;
        if (words.length == 1) {  // if no '.',
            pathname += 'index.html';
            extension = 'html';
        } else

    extension = words[-1];  // the last one
    console.log(pathname);
    console.log(extension);

    res.writeHead(200, {"Content-Type": "text/html"});  // text/html, not text/plain, in this example
    res.write("<h1>Hello  World!</h1><br>");
    res.write(pathname + "<br>");
    res.write("Extension: " + extension + "<br>");
    res.end();
}