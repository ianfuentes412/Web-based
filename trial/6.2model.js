/*
Model for TRUWebService

ready(callback)
    true or false
close()

usernameExists(username, callback)
    true or false
validateUsernamePassword(username, password, callback)
    true or false
registerUser(username, password, callback)
    true or false
deleteUser(username, password)

//signin(username)
//signout(username)
getNewToken(username, callback)  // Create/Open a connection
    (true, token_id), or
    (false, -1)  // error case
deleteToken(id, callback)  // Delete/Close a connection
    true or false

collection(token_id, collection_name, callback)  // use collection_name for token_id
    (true, 1), or 
    (false, -1) or (false, -2)
insertOne(token_id, doc, callback) 
    true or false
find(token_id, query, callback) 
    (true, result) or  // result: array of documents
    false
updateMany(token_id, query, newdoc, callback) 
    true or false
deleteMany(token_id, query, callback) 
    true or false
*/

/* Collections:
Users - quadruple of unique username, password , signed in or not, and collection name
    {username:..., password:..., signedin:..., collectionname:...}, ...
Tokens - count for token id, and pairs of username and token id
    {token:...},
    {username:..., tokenid:...}, ...
*/

var URL = "mongodb://test:test136@127.0.0.1:27017/COMP4620_test";  // MongoDB

let MongoClient;
let conn;
let db;
let connected = false;
let timerid;

const checkCreateCollection = async function(name, callback)
{
            
    if (callback != undefined)
        callback(true);
    
    /*
    let list = await db.listCollections().toArray();
    let exist = false;
    for (let i = 0; i < list.length; i++) {
        if (list[i].name == name) {
            exist = true;
            break;
        }
    }
    */
    
    //if (!exist)
    //    await db.createCollection(name);
}

const ready = async function(callback)
{
    if (connected)
        callback(true);
        
    else {
        try {
            MongoClient = require("mongodb").MongoClient;
            conn = await MongoClient.connect(URL);
            db = conn.db();
            
            timerid = setTimeout(close, 2000);
            
            let list = await db.listCollections().toArray();
            
            let exist = false;
            for (let i = 0; i < list.length; i++) {
                if (list[i].name == "Tokens") {
                    exist = true;
                    break;
                }
            }
            if (!exist)
                await db.createCollection("Tokens");
            
            exist = false;
            for (let i = 0; i < list.length; i++) {
                if (list[i].name == "Users") {
                    exist = true;
                    break;
                }
            }
            if (!exist)
                await db.createCollection("Users");

            connected = true;
            callback(true);
        }
        catch(e) {
            connected = false;
            callback(false);
        }
    }
}

const close = function() {
    if (connected) {
        if (conn != undefined)
            conn.close();
        clearTimeout(timerid);
        connected = false;
    }
}

const usernameExists = async function(u, callback)
{
    try {
        let userdoc = await db.collection("Users").findOne({username:u});
        if (userdoc != null)
            callback(true);
        else
            callback(false);
    }
    catch(e) {
        callback(false);
    }
}

const validateUsernamePassword = async function (u, p, callback)
{
    try {
        let userdoc = await db.collection("Users").findOne({username:u, password:p});
        if (userdoc != null)
            callback(true);
        else
            callback(false);
    }
    catch(e) {
        callback(false);
    }
}

const registerUser = async function (u, p, callback)
{
    usernameExists(u, async function(result) {
        if (!result) 
            try {
                await db.collection("Users").insertOne({username:u, password:p});
                let userdoc = await db.collection("Users").findOne({username:u, password:p});  // for testing
                if (userdoc != null)
                    callback(true);
                else
                    callback(false);
            }
            catch(e) {
                callback(false);
            }
        else
            callback(false);
    });
}

const deleteUser = async function (u, p)
{
    try {
        await db.collection("Users").deleteMany({username:u, password:p});
    }
    catch(e) {
        ;
    }
}

/*
*
*/

/*
async function signin(u)
{
    await db.collection("Users").updateOne({username:u}, {$set: {signedin: true}});
}

async function signout(u)
{
    await db.collection("Users").updateOne({username:u}, {$set: {signedin: false}});
}
*/

//-----

async function getNewToken(u, callback) 
{
    try {
        let id;
        let collection = db.collection("Tokens");
        
        let tokendoc = await collection.findOne({count: {$exists: true}});
        if (tokendoc == null) {  // Not existing
            await collection.insertOne({count: 1});
            id = 1;
        }
        id = tokendoc.count + 1;
        await collection.updateOne({count: {$exists: true}}, {$set: {count: Number(id)}});

        userdoc = await collection.findOne({username: u});
        if (userdoc == null)  // Not existing
            await collection.insertOne({username: u, tokenid: Number(id)});
        else
            await collection.updateOne({username: u}, {$set: {tokenid: Number(id)}});
        
        callback(true, id);
    }
    catch(e) {
        callback(false, -1);
    }
}

async function deleteToken(id, callback) 
{
    try {
        await db.collection("Tokens").deleteMany({tokenid: {$eq: Number(id)}});
        callback(true);
    }
    catch(e) {
        callback(false);
    }
}

//-----

async function collection(token_id, collection_name, callback) 
{
    if (collection_name == "Users" || collection_name == "Tokens")
        callback(false, -2);
    
    else {
        try {
            let collection = db.collection("Tokens");
            let tokendoc = await collection.findOne({tokenid: Number(token_id)});
            if (tokendoc == null)  // No such connection
                callback(false, -1);
            else {
                collection = db.collection("Users");
                await collection.updateOne({username: tokendoc.username}, {$set: {collectionname: collection_name}});
                callback(true, 1);  // 1: collection id
            }
        }
        catch(e) {
            callback(false, -3);
        }
    }
}

async function insertOne(token_id, doc, callback) 
{
    try {
        let collection = db.collection("Tokens");
        let tokendoc = await collection.findOne({tokenid: Number(token_id)});
        if (tokendoc == null)  // No such connection
            callback(false);
        else {
            collection = db.collection("Users");
            let userdoc = await collection.findOne({username: tokendoc.username});
            if (userdoc == null)
                callback(false);
            else {
                collection = db.collection(userdoc.collectionname);
                await collection.insertOne(doc);
                callback(true);
            }
        }
    }
    catch(e) {
        callback(false);
    }
}

async function find(token_id, query, callback) 
{
    try {
        let collection = db.collection("Tokens");
        let tokendoc = await collection.findOne({tokenid: Number(token_id)});
        if (tokendoc == null)  // No such connection
            callback(false);
        else {
            collection = db.collection("Users");
            let userdoc = await collection.findOne({username: tokendoc.username});
            if (userdoc == null)
                callback(false);
            else {
                collection = db.collection(userdoc.collectionname);
                let docs = await collection.find(query).toArray();
                callback(true, docs);
            }
        }
    }
    catch(e) {
        callback(false);
    }
}

async function updateMany(token_id, query, newdoc, callback) 
{
    try {
        let collection = db.collection("Tokens");
        let tokendoc = await collection.findOne({tokenid: Number(token_id)});
        if (tokendoc == null)  // No such connection
            callback(false);
        else {
            collection = db.collection("Users");
            let userdoc = await collection.findOne({username: tokendoc.username});
            if (userdoc == null)
                callback(false);
            else {
                collection = db.collection(userdoc.collectionname);
                await collection.updateMany(query, newdoc);
                callback(true);
            }
        }
    }
    catch(e) {
        callback(false);  // Unknow error
    }
}

async function deleteMany(token_id, query, callback) 
{
    try {
        let collection = db.collection("Tokens");
        let tokendoc = await collection.findOne({tokenid: Number(token_id)});
        if (tokendoc == null)  // No such connection
            callback(false);
        else {
            collection = db.collection("Users");
            let userdoc = await collection.findOne({username: tokendoc.username});
            if (userdoc == null)
                callback(false);
            else {
                collection = db.collection(userdoc.collectionname);
                await collection.deleteMany(query);
                callback(true);
            }
        }
    }
    catch(e) {
        callback(false);  // Unknow error
    }
}


exports.ready = ready;
exports.close = close;

exports.usernameExists = usernameExists;
exports.validateUsernamePassword = validateUsernamePassword;
exports.registerUser = registerUser;
exports.deleteUser = deleteUser;

//exports.signin = signin;
//exports.signout = signout;
exports.getNewToken = getNewToken;
exports.deleteToken = deleteToken;
exports.collection = collection;
exports.insertOne = insertOne;
exports.find = find;
exports.updateMany = updateMany;
exports.deleteMany = deleteMany;
