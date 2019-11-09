const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const router = express.Router();

var constants = require('../lib/constants');
var mongoDatabase = require('../mongoDatabase');
var mongodb;
mongoDatabase.getMongoConnection().then((connection) => {
    mongodb = connection;
});

const BUYER = constants.BUYER;
const OWNER = constants.OWNER;
const JWT_KEY = constants.JWT_KEY;

router.post('/login', function(req, res) {
    let {email, password} = req.body;

    const buyers = mongodb.collection('buyers');

    buyers.findOne({email : email}).then(async function(buyer) {
        
        const passwordMatches = await bcrypt.compare(password, buyer.password);
        
        if(!passwordMatches){
            res.json({
                "status" : 401,
                "message" : "Invalid Username/Password"
            });
        } else {
            let token = jwt.sign({email : email}, JWT_KEY);
            console.log(token);
            res.json({
                "status" : 200,
                "token" : token
            });
        }
    }).catch((err) => {
        console.log("Error while logging in : " + err.toString());
        res.json({
            "status" : 404,
            "message" : "User does not exist"
        });
    }); 
});

router.post('/signup', async function(req, res) {
    let {buyerName, email, password, contact, address} = req.body;

    password = bcrypt.hashSync(password, 8);
    const collection = mongodb.collection('buyers');
    
    let buyer = {
        buyerName : buyerName,
        email : email,
        password : password,
        contact : contact,
        address : address
    }
    
    collection.insertOne(buyer).then((results) => {
        console.log("Id of new user");
        console.log(results.ops[0]._id);
        res.json({
            "status" : 200
        });
    }).catch((err) => {
        console.error("Error : " + JSON.stringify(err));
        res.json({
            "status" : 500
        });
    });
});

router.post('/ownersignup', function(req, res) {
    let {ownerName, email, password, contact} = req.body;

    password = bcrypt.hashSync(password, 8);
    
    const collection = mongodb.collection('owners');
    
    let owner = {
        ownerName : ownerName,
        email : email,
        password : password,
        contact : contact
    }
    
    collection.insertOne(owner).then((results) => {
        console.log("Id of new user");
        console.log(results.ops[0]._id);
        res.json({
            "status" : 200
        });
    }).catch((err) => {
        console.error("Error : " + JSON.stringify(err));
        res.json({
            "status" : 500
        });
    });
});

router.post('/ownerlogin', function(req, res) {
    let {email, password} = req.body;

    const owners = mongodb.collection('owners');

    owners.findOne({email : email}).then(async function(owner) {
        
        const passwordMatches = await bcrypt.compare(password, owner.password);
        
        if(!passwordMatches){
            res.json({
                "status" : 401,
                "message" : "Invalid Username/Password"
            });
        } else {
            let token = jwt.sign({email : email}, JWT_KEY);
            console.log(token);
            res.json({
                "status" : 200,
                "token" : token
            });
        }
    }).catch((err) => {
        console.log("Error while logging in : " + err.toString());
        res.json({
            "status" : 403,
            "message" : "User does not exist"
        });
    });
});

module.exports = router;