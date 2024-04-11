
let MongoClient;
let conn;  // connection stub
let db;  // db stub
let collection;  // collection stub
let connected = false;  // flag to see if a connection is made
let timerid;

// Prepares conn, db, collecton, connected
// Passes true|false back through a callback function
const ready = async function(callback)
{
    if (connected) callback(true);
        
    else {
        try {
            // connection
            MongoClient = require("mongodb").MongoClient;
            conn = await MongoClient.connect('mongodb://w4ifuentes:w4ifuentes136@127.0.0.1:27017/COMP4620_w4ifuentes');

             timerid = setTimeout(() => {
                 close();
           }, 1000 * 60);

            // db stub
            db = conn.db();
            // If the "Users" collection does not exist, let's create it.
            let list = await db.listCollections().toArray();
            let exist = false;
            for (let i = 0; i < list.length; i++) {
                if (list[i].name == "Users") {
                    exist = true;
                    break;
                }
            }
            if (!exist)
                await db.createCollection("Users");
            // collection stub
            collection = db.collection("Users");
            // return ... through the callback function
            //return(callback(connected));
            connected = true;
            callback(connected);
        }
        catch(err) {
            connected = false;
            callback(false);
        }
    }
}

const close = function() {
    if (conn != null) {
        conn.close();
        connected = false;
        clearTimeout(timerid);
    }
}

const usernameExists = async function(u, callback)
{
    try {
        let list = await collection.findOne({username:u});
        if (list != null)
            callback(true);
        else
            callback(false);
    }
    catch(err) {
        callback(true);
    }
}

const registerUser = async function(u, p, e, callback)
{
    try {
        await collection.insertOne({username:u,password:p,email:e});
            callback(true);
    }
    catch(err) {
        callback(false);
    }
}

const validateUsernamePassword = async function(u, p, callback)
{
    try {
        let list = await collection.findOne({username:u,password:p});
        if (list != null)
            callback(true);
        else
            callback(false);
    }
    catch(err) {
        callback(false);
    }
}

const deleteUser = async function(u,p, callback)
{
    try {
        await collection.deleteOne({username:u, password:p});
        callback(true);
    }
    catch(err) {
        callback(false);
    }
}


exports.ready = ready;
exports.close = close;
exports.usernameExists = usernameExists;
exports.registerUser = registerUser;
exports.deleteUser = deleteUser;
exports.validateUsernamePassword = validateUsernamePassword;

