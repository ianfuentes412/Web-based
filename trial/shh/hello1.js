// hello1.js
exports.hello = function() {
    console.log('Hello World!');
}
// main1.js
var helloooo = require('./hello1');  // Not hello1.js? 
                                     // When there is no file extension, .js is assumed. 
                                     // Obviously you can also use a full filename, even with a different file extension.
                                     // require() returns an object having the property in 'exports' object from './hello1.js'.
helloooo.hello();
//-- at server ----------------------------------------
