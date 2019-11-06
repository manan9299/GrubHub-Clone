const jwt = require('jsonwebtoken');
const constants = require('./lib/constants');
var mongoDatabase = require('./mongoDatabase');
var mongodb;
mongoDatabase.getMongoConnection().then((connection) => {
    mongodb = connection;
});

const ownerAuth = async(req, res, next) => {
    
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, constants.JWT_KEY)

    const owners = mongodb.collection('owners');
    
    owners.findOne({email : data.email}).then(async(owner) => {
        req.userType = constants.OWNER;
        req.user = owner;
        next();
    }).catch((err) => {
        res.json({
            "status" : 401,
            "message" : "Not authorized to access this resource"
        });
    });
}

module.exports = ownerAuth;