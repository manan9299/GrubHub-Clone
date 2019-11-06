const jwt = require('jsonwebtoken');
const constants = require('./lib/constants');
var mongoDatabase = require('./mongoDatabase');
var mongodb;
mongoDatabase.getMongoConnection().then((connection) => {
    mongodb = connection;
});

const buyerAuth = async(req, res, next) => {
    
    const token = req.header('Authorization').replace('Bearer ', '')
    const data = jwt.verify(token, constants.JWT_KEY)

    const buyers = mongodb.collection('buyers');
    
    buyers.findOne({email : data.email}).then(async(buyer) => {
        req.userType = constants.BUYER;
        req.user = buyer;
        next();
    }).catch((err) => {
        res.json({
            "status" : 401,
            "message" : "Not authorized to access this resource"
        });
    });
}

module.exports = buyerAuth;