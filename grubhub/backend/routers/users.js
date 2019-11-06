const express = require('express');
var pool = require('../database');
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
        console.log(passwordMatches);
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
    let {buyerName, email, password, contact} = req.body;

    password = bcrypt.hashSync(password, 8);
    console.log("Hashed Password");
    console.log(password);
    const collection = mongodb.collection('buyers');

    // collection.drop();
    
    let buyer = {
        buyerName : buyerName,
        email : email,
        password : password,
        contact : contact
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
    console.log("Hashed Password");
    console.log(password);
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

    // console.log("Req Body : " + JSON.stringify(req.body))

    // let query = "INSERT INTO `grubhub`.`Owners` (`owner_name`, `email`, `password`, `phone_number`) VALUES ('" + ownerName + "', '" + email + "', '" + password + "', '" + contact + "')"
    // console.log(query);
    // pool.query(query, function(err, results){
        
    //     console.log("Error : " + JSON.stringify(err));
    //     console.log("Result : " + JSON.stringify(results));

    //     if (err){
    //         console.error("Error : " + JSON.stringify(err));
    //         res.json({
    //             "status" : 500
    //         });
    //     } else if (results){
    //         res.json({
    //             "status" : 200
    //         });
    //     } else {
    //         res.json({
    //             "status" : 403
    //         });
    //     }
    // });      
});

router.post('/ownerlogin', function(req, res) {
    let {email, password} = req.body;

    const owners = mongodb.collection('owners');

    owners.findOne({email : email}).then(async function(owner) {
        
        const passwordMatches = await bcrypt.compare(password, owner.password);
        console.log(passwordMatches);
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


    // let query = "SELECT * FROM grubhub.Owners where email='" + email + "' AND password='"+ password +"'";
    // console.log(query);
    // pool.query(query, function(err, results){
        
    //     console.log("Error : " + JSON.stringify(err));
    //     console.log("Result : " + JSON.stringify(results));

    //     if (err){
    //         console.error("Error : " + JSON.stringify(err));
    //         res.json({
    //             "status" : 500
    //         });
    //     }
    //     if (results){
    //         res.cookie("grubhubcookie", "user", {
    //             maxAge : 900000,
    //             httpOnly : false
    //         });
    //         req.session.userId = results[0]["owner_id"];
    //         req.session.userType = OWNER;
    //         res.json({
    //             "status" : 200
    //         });
    //     } else {
    //         res.json({
    //             "status" : 403
    //         });
    //     }
    // });      
});

module.exports = router;