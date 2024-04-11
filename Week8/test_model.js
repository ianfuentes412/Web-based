const MongoClient = require('mongodb').MongoClient;

const connect = async function (db_name,username,password, callback) {
    try {
        const conn = await MongoClient.connect(`mongodb://${username}:${password}@127.0.0.1:27017/${db_name}` ); // connection stub
        callback(conn);  // return conn through callback 
    }
    catch(err) {
        callback(null);  // return null through callback
    }
}

const close = async function(conn){
    if (conn != null)
        conn.close();
}

const db = async function (conn, callback){
    try {
        let db = conn.db(); // db stub
        callback(db);  
    }
    catch(err) {
        callback(null);  
    }
}

const collection = async function (db, collectionname, callback){
    try {
        let list = await db.listCollections().toArray();
        let exist = false;
        for (let i = 0; i < list.length; i++) {
            if (list[i].name == collectionname) {
                exist = true;
                break;
            }
        }
        if (!exist){
            await db.createCollection(collectionname);
        }
        let collection = db.collection(collectionname);
        callback(collection);  // return conn through callback 
    }
    catch(err) {
        callback(null);  // return null through callback
    }
}

const insert = async function (collection, doc, callback){
    try {
        await collection.insertOne(doc);
        callback();
    }
    catch(err) {
        callback(null);  // return null through callback
    }
}

const find = async function (collection, filter, callback){
    try {
        let lists = await collection.find(filter).toArray(); 
        callback(lists);
    }
    catch(err) {
        callback(null);  
    }
}

// exports connect
exports.connect = connect;
exports.close = close;
exports.db = db;
exports.collection = collection;
exports.insert = insert;
exports.find = find;