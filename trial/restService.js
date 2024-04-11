const express = require('express');
const bodyParser = require('body-parser');
const model = require('./6.2model.js');

const app = express();

const server = app.listen(8014, function () {  // User your port number
    let host = server.address().address;
    let port = server.address().port;
    console.log("Listening at http://%s:%s", host, port)
})

// for POST, PUT, and DELETE query
app.use(bodyParser.urlencoded({ extended: true }));

// To support CORS
app.all('/*', function(req, res, next) {  // /*: any routes
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");  // Default: only GET and POST
    next();  // Express middleware function; To continue to next operations
});

// Route operations

app.get('/', function (req, res) {  // HTTP GET method
    res.send("Welcome to TRU MongoDB Web Service!");
})

// SignUp (Create/Register a user)
//   Request - POST /users?username=...&password=...
//   Response - '{"result":"true"|"false", "explanation":"..."}'
app.post('/users', function (req, res) {  // HTTP POST method
    var username = req.body.username;
    var password = req.body.password;
    console.log("POST /users: username = %s, password = %s", username, password);

    model.ready(function(result) {
        if (result) {
            model.registerUser(username, password, function(result) {
                if (result)
                    res.send(JSON.stringify({result:true, explanation:""}));
                else
                    res.send(JSON.stringify({result:false, explanation:"Username exists"}));
            });
        }
        else
            res.send(JSON.stringify({result:false, explanation:"Connection error"}));
    });
});

app.delete('/users', function (req, res) {  // HTTP POST method
    var username = req.body.username;
    var password = req.body.password;
    console.log("POST /users: username = %s, password = %s", username, password);

    model.ready(function(result) {
        if (result) {
            model.deleteUser(username, password);
            res.send(JSON.stringify({result:true, explanation:"Username Deleted"}));

        }
        else
            res.send(JSON.stringify({result:false, explanation:"Connection error"}));
    });
});

app.post('/tokens', function (req, res) {  // HTTP POST method
    var username = req.body.username;
    var password = req.body.password;
    console.log("POST /users: username = %s, password = %s", username, password);

    model.ready(function(result) {
        if (result) {
            model.validateUsernamePassword(username, password, function(result){
                if (result)
                {
                    model.getNewToken(username, function(result, token_id){
                        if(result)
                            res.send(JSON.stringify({result:true, tokenid:token_id}));
                        else
                            res.send(JSON.stringify({result:false, tokenid: -1, explanation:"Token Error"}));
                        });
                }
                else
                {
                    res.send(JSON.stringify({result:false, explanation:"Username or Password not Valid"}));
                }
            });
        }
        else
            res.send(JSON.stringify({result:false, explanation:"Connection error"}));
    });
});

app.delete('/tokens/:id', function (req, res) {  


    model.ready(function(result) {
        var token_id = req.params.id;
        if (result) {
            model.deleteToken(token_id, function(result){
                if(result){
                    res.send(JSON.stringify({result:true}));
                }
                else{
                    res.send(JSON.stringify({result:false}));
                }
            });

        }
        else
            res.send(JSON.stringify({result:false, explanation:"Connection error"}));
    });
});

app.post('/collections', function (req, res) {  // HTTP POST method
    var collection_name = req.body.name;
    var token_id = req.body.tokenid;
    console.log("POST /collections:tokenid=%s, name = %s", token_id, collection_name);

    model.ready(function(result) {
        if (result) {
            model.collection(token_id, collection_name, function(result){
                if(result){
                    res.send(JSON.stringify({result:true, explanation: 1}));
                }
                else{
                    res.send(JSON.stringify({result:false, explanation: -1}));
                }
            })
        }
        else
            res.send(JSON.stringify({result:false, explanation:"Connection error"}));
    });
});