const MongoClient = require('mongodb').MongoClient;

(async function(username, password) 
{
    try {
        const conn = await MongoClient.connect('mongodb://w4ifuentes:w4ifuentes136@127.0.0.1:27017/COMP4620_w4ifuentes');
        const db = conn.db();
        let collection = db.collection("Users");  // You need to make sure this collection exists. 
                                                  // See Trial 7.5 how to create a collection if necessary.
        await collection.insertOne({username:username, password:password}); 
        let lists = await collection.find({username: {$exists:true}}).toArray();  // for testing
        console.log(lists);  // for testing
        conn.close();
    }
    catch(err) {
        console.log(err);
    }
})("John", "secretpassword");  // self invocation of an anonymous function