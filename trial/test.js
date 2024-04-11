//Exercise 6.1 + 6.2
/*
let pathname0 = '/csclub';  // => "/var/www/html/csclub"
let words = pathname0.split('/');
console.log(words);

let pathname1 = '/~comp3540test/';  // => "/home2/students/comp3540/public_html"
if(pathname1.includes('~')){
    console.log('Pathname contains ~');
}
else{
    console.log('Pathname contains ~');
}
*/

//6.3
/*
let tilde = require('tilde-expansion');

let pathname1 = '/~comp3540test/';  // => "/home2/students/comp3540/public_html"
let new_pathname;

console.log(pathname1);
let words = pathname1.split('/');
console.log(words);
if ((words[1] != undefined && words[1][0] == '~')) {  // you will need to check words[???]
    tilde(words[1], expanded => {
        new_pathname = expanded + "/public_html";  // by default, all resources are under public_html
        for (let i = 2; i < words.length; i++)  // why?
            new_pathname += "/" + words[i];
    });
}
else 
    ;
console.log(new_pathname);
*/
 /*
6.4

let pathname0 = '/var/www/html/csclub';  // => "/var/www/html/csclub"
let pathname1 = '/home2/students/comp3540/public_html/';  // => "/home2/students/comp3540/public_html/index.html"

// test with pathname0 and pathname1
let pathname = pathname1;
console.log(pathname);
if (pathname.endsWith('/')){
    pathname += 'index.html';
}

console.log(pathname);
*/
/*
const path = require("path");  // reference: Node.js Path Module

let pathname0 = '/var/www/html/csclub';  // => "/var/www/html/csclub/index.html"
let pathname1 = '/home2/students/comp3540/public_html/test.html';  // => "/home2/students/comp3540/public_html/test.html"

// test with pathname0 and pathname1
let pathname = pathname1;
console.log(pathname);

let fileordirname = path.basename(pathname);
console.log(fileordirname);
let words = fileordirname.split('.');  // to see if '.' is in the basename
let extension;
if (words.length == 1) {  // if no '.',
    pathname += '/index.html';
    extension = 'html';
} else

    extension = words[-1];  // the last one
console.log(pathname);
console.log(extension);
*/

/*
let extension = 'html';  // test with others as well, such as js, css and bmp.
let content_type = decideContentType(extension);
console.log(extension + ": " + content_type);

function decideContentType(extension) 
{
    if(extension = 'js')
    {
        return "Extension is: application/javascript";
    }
    else if (extension = 'json')
    {
        return 'Extension is: application/json';
    }
    else if (extension = 'xml')
    {
        return "Extension is: application/xml";
    }
    else if (extension = 'pdf')
    {
        return "application/pdf";
    }
    else if (extension = 'zip')
    {
        return "application/zip";
    }
    else if (extension = 'css')
    {
        return "text/css";
    }
    else if (extension = 'html')
    {
        return "text/html";
    }
    else if (extension = 'bmp')
    {
        return "Extension is: image/bmp";
    }
    else if (extension = 'jpeg')
    {
        return "Extension is: image/jpeg";
    }
    else
    {
        return "Extension is: text/plain";
    }

}
*/


/*
let fs = require('fs');
let pathname = 'test.js';  // for testing

fs.readFile(pathname, 'utf8', function(error, content) {
    if (error)
        console.log(error);
    else
        console.log(content);
});
*/


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

???

function proceed_with_resolved_pathname(req, res, pathname) {
    if (pathname.endsWith("/"))
        pathname = pathname + "/index.html";
    ????  // Case 4
    res.writeHead(200, {"Content-Type": "text/html"});  // text/html, not text/plain, in this example
    res.write("<h1>Hello  World!</h1><br>");
    res.write(??? + "<br>");
    res.write("Extension: " + ??? + "<br>");
    res.end();
}
         
                            
