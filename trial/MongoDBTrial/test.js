const MongoClient = require('mongodb').MongoClient;

(async function() 
{
    try {
        // connection stub
        const conn = await MongoClient.connect('mongodb://w4ifuentes:w4ifuentes136@127.0.0.1:27017/COMP4620_w4ifuentes');
        console.log("MongoDB connected");
        
        // db stub
        let db = conn.db();
        
        // If the "Users" collection does not exist, let's create it.
        let list = await db.listCollections().toArray();  // https://mongodb.github.io/node-mongodb-native/2.2/api/Db.html#listCollections
        let exist = false;
        for (let i = 0; i < list.length; i++) {
            if (list[i].name == "Users") {
                exist = true;
                break;
            }
        }
        if (!exist)
            await db.createCollection("Users");
            
        // collectin stub
        let collection = db.collection("Users");
        
        // find all documents in the collection
        let lists = await collection.find({}).toArray();  // or just find()
        console.log(lists);
        
        // close the connection to MongoDB
        conn.close();
    }
    catch(err) {
        console.log(err);
    }
})();  // self invocation of an anonymous function