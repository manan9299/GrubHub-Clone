var MongoClient = require('mongodb').MongoClient;

var constants = require('./lib/constants');
const MONGO_URL = constants.MONGO_URL;

var mongodb;

module.exports.getMongoConnection = async () => {
    var conn = await getMongoConnection();
    return conn.db();
}

var getMongoConnection = () => {

    if (mongodb === undefined){
        return MongoClient.connect(MONGO_URL, {
            poolSize : 500,
            useNewUrlParser : true,
            useUnifiedTopology : true
        });
    } else {
        return new Promise.resolve(mongodb);
    }
}