const express = require('express')
var pool = require('../database');

var MongoClient = require('mongodb').MongoClient;

const router = express.Router();

var constants = require('../lib/constants');
var mongoDatabase = require('../mongoDatabase');
var mongodb;
mongoDatabase.getMongoConnection().then((connection) => {
    mongodb = connection;
});

const BUYER = constants.BUYER;
const OWNER = constants.OWNER;

router.post('/login', function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    

    let query = "SELECT * FROM grubhub.Buyers where email='" + email + "' AND password='"+ password +"'";
    console.log(query);
    
    pool.query(query, function(err, results){
        
        console.log("Error : " + JSON.stringify(err));
        console.log("Result : " + JSON.stringify(results));

        if (err){
            console.error("Error : " + JSON.stringify(err));
            res.json({
                "status" : 500
            });
        }
        if (results && results.length != 0){
            res.cookie("grubhubusercookie", "user", {
                maxAge : 900000,
                httpOnly : false
            });
            req.session.userId = results[0]["buyer_id"];
            req.session.userType = BUYER;
            res.json({
                "status" : 200
            });
        } else {
            res.json({
                "status" : 403
            });
        }
    });      
});

router.post('/signup', function(req, res) {
    let {buyerName, email, password, contact} = req.body;

    const collection = mongodb.collection('buyers');

    collection.insertOne({
        email : email,
        password : password
    }).then((results) => {
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

    // let query = "INSERT INTO `grubhub`.`Buyers` (`buyer_name`, `email`, `password`, `phone_number`) VALUES ('" + buyerName + "', '" + email + "', '" + password + "', '" + contact + "')"
    // console.log(query);
    // pool.query(query, function(err, results){
        
    //     console.log("Error : " + JSON.stringify(err));
    //     console.log("Result : " + JSON.stringify(results));

    //     if (err){
    //         console.error("Error : " + JSON.stringify(err));
    //         res.json({
    //             "status" : 500
    //         });
    //     } else if (results && results.length != 0){
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

router.post('/ownersignup', function(req, res) {
    let {ownerName, email, password, contact} = req.body;
    console.log("Req Body : " + JSON.stringify(req.body))

    let query = "INSERT INTO `grubhub`.`Owners` (`owner_name`, `email`, `password`, `phone_number`) VALUES ('" + ownerName + "', '" + email + "', '" + password + "', '" + contact + "')"
    console.log(query);
    pool.query(query, function(err, results){
        
        console.log("Error : " + JSON.stringify(err));
        console.log("Result : " + JSON.stringify(results));

        if (err){
            console.error("Error : " + JSON.stringify(err));
            res.json({
                "status" : 500
            });
        } else if (results){
            res.json({
                "status" : 200
            });
        } else {
            res.json({
                "status" : 403
            });
        }
    });      
});

router.post('/ownerlogin', function(req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let query = "SELECT * FROM grubhub.Owners where email='" + email + "' AND password='"+ password +"'";
    console.log(query);
    pool.query(query, function(err, results){
        
        console.log("Error : " + JSON.stringify(err));
        console.log("Result : " + JSON.stringify(results));

        if (err){
            console.error("Error : " + JSON.stringify(err));
            res.json({
                "status" : 500
            });
        }
        if (results){
            res.cookie("grubhubcookie", "user", {
                maxAge : 900000,
                httpOnly : false
            });
            req.session.userId = results[0]["owner_id"];
            req.session.userType = OWNER;
            res.json({
                "status" : 200
            });
        } else {
            res.json({
                "status" : 403
            });
        }
    });      
});

module.exports = router;