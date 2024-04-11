const MongoClient = require('mongodb').MongoClient;

const proceed = async function(_GET, _POST, callback)  {  // This function should pass a string message back through callback.
    try {
        // mongodb://username:password@127.0.0.1[:port]/databasename
        const conn = await MongoClient.connect('mongodb://w4ifuentes:w4ifuentes136@127.0.0.1:27017/COMP4620_w4ifuentes');
        callback("MongoDB connected using async/await");
        conn.close();  // It is a must. Otherwise, the max number of connections will be fed up.
    } 
    catch(err) {
        callback('Connection error');
    }
}

exports.proceed = proceed;
