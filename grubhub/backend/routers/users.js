const express = require('express')
var pool = require('../database');

const router = express.Router();

var constants = require('../lib/constants');
const BUYER = constants.BUYER;
const OWNER = constants.OWNER;

// router.post('/users', async (req, res) => {
//     // Create a new user
//     try {
//         const user = new User(req.body)
//         await user.save()
//         const token = await user.generateAuthToken()
//         res.status(201).send({ user, token })
//     } catch (error) {
//         res.status(400).send(error)
//     }
// })

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
    

    let query = "INSERT INTO `grubhub`.`Buyers` (`buyer_name`, `email`, `password`, `phone_number`) VALUES ('" + buyerName + "', '" + email + "', '" + password + "', '" + contact + "')"
    console.log(query);
    pool.query(query, function(err, results){
        
        console.log("Error : " + JSON.stringify(err));
        console.log("Result : " + JSON.stringify(results));

        if (err){
            console.error("Error : " + JSON.stringify(err));
            res.json({
                "status" : 500
            });
        } else if (results && results.length != 0){
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