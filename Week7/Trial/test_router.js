//E1 GET Data Function
var url = require('url');
var querystring = require('querystring');

var uri = 'http://test.com/start.html?command=Login&username=foo&password=topsecret';
var pathname = decodeURI(url.parse(uri).pathname);
console.log("pathname: " + pathname);
var query = decodeURI(url.parse(uri).query);
console.log("query: " + query);
var _GET = querystring.parse(decodeURI(url.parse(uri).query));
console.log("_GET: ", _GET);
// End GET Data Function


//E2 POST Data Function

// For testing
var events = require('events');
var req = new events.EventEmitter();

// Node WebServer
//var querystring = require('querystring');

var query = "";
var _POST = {};
req.on('data', function(chunk) {
    query += chunk;  // add chunk to query
});
req.on('end', function() {
    _POST = querystring.parse(decodeURI(query));
});
console.log("_POST: ", _POST);

// For testing
var queryinURL = "operation=add&op1=30&op2=40";
req.emit('data', queryinURL);
req.emit('end');


// For testing
var pathname = './test_addition.sjs';  // ./ should be included to say the file exists under the current working directory.
// _GET and _POST are defined in Trials E1 and E2.5
// Copy the code in Trial E2 or E2.5 here
proceed_sjs(_GET, _POST, pathname);  // It needs to be placed in the 'end' event listener.

// This function is invoked after _GET or _POST is obtained.
function proceed_sjs(_GET, _POST, pathname) {
    var ended = false;
    try{
    var sjs = require(pathname);
    sjs.proceed(_GET, _POST, function(message) {
        if(!ended){
            console.log(message);
            delete require.cache[require.resolve(pathname)];
            ended = true;
        }
    });
    }
    catch(err){
        console.log("Internal error");
    }
}
