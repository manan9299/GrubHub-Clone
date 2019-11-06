const express = require('express')
var pool = require('../database');
const ownerAuth = require('../auth');

const router = express.Router();

var constants = require('../lib/constants');

const OWNER = constants.OWNER;

var mongoDatabase = require('../mongoDatabase');
var mongodb;
mongoDatabase.getMongoConnection().then((connection) => {
    mongodb = connection;
});

router.get('/getRestaurantInfo', ownerAuth, (req,res) => {

    if (req.userType == OWNER){

        const restaurants = mongodb.collection('restaurants');
        console.log("user is => " + JSON.stringify(req.user));

        restaurants.findOne({ownerEmail : req.user.email}).then((restaurant) => {
            console.log("Restaurant found ===> " + JSON.stringify(restaurant));
            let payload = "";
            if(restaurant){
                payload = restaurant;
            }
            res.json({
                "status" : 200,
                "payload" : payload
            });

        }).catch((err) => {
            res.json({
                "status" : 404,
                "payload" : ""
            });
        });
    } else {
        res.json({
            "status" : 403,
            "payload" : ""
        });
    }
});

router.get('/getsections', (req,res) => {

    if (req.session.userType == OWNER){
        let ownerId = req.session.userId;
        let query = "SELECT restaurant_id FROM grubhub.Restaurants where restaurant_owner_id='" + ownerId + "'";
        console.log("Query : " + query);
        pool.query(query, (err, results) => {

            console.log("Error : " + JSON.stringify(err));
            console.log("Result : " + JSON.stringify(results));

            if (err){
                console.error("Error : " + JSON.stringify(err));
                res.json({
                    "status" : 500,
                    "payload" : "",
                    "restaurant_id" : ""
                });
            } else {
                
                let restaurant_id = results[0]["restaurant_id"];
                query = "SELECT section_name FROM grubhub.Menu_Sections where parent_restaurant_id='" + restaurant_id + "' ORDER BY section_name ASC";

                console.log("Query : " + query);

                pool.query(query, (err, results) => {
                    console.log("Error : " + JSON.stringify(err));
                    console.log("Result : " + JSON.stringify(results));
                    
                    if (err){
                        console.error("Error : " + JSON.stringify(err));
                        res.json({
                            "status" : 500,
                            "payload" : "",
                            "restaurant_id" : ""
                        });
                    } else {
                        res.json({
                            "status" : 200,
                            "payload" : results,
                            "restaurant_id" : restaurant_id
                        });
                    }
                });
            }
        });
    } else {
        res.json({
            "status" : 403,
            "payload" : "",
            "restaurant_id" : ""
        });
    }
});

router.post('/updateRestaurant', ownerAuth, (req,res) => {
    let {name, address, city, zip, contact} = req.body;
    
    let restaurants = mongodb.collection('restaurants');

    if (req.userType == OWNER){
        let ownerEmail = req.user.email;
        let restaurantPayload = {
            name : name,
            address : address,
            city : city,
            zip : zip,
            contact : contact,
            ownerEmail : ownerEmail
        };

        restaurants.updateOne({ownerEmail:ownerEmail}, { $set : restaurantPayload }, {upsert : true}).then((result) => {
            res.json({
                "status" : 200
            });
        }).catch((err) => {
            console.log(err.toString());
            res.json({
                "status" : 500
            });
        });
    } else {
        res.json({
            "status" : 403
        });
    }
});

router.post('/addsection', ownerAuth, (req,res) => {

    if (req.userType == OWNER){
        let {sectionName} = req.body;
        let ownerEmail = req.user.email;

        let restaurants = mongodb.collection('restaurants');
        
        restaurants.findOne({ownerEmail : ownerEmail}).then((restaurant) => {
            let sections = restaurant.sections || [] ;
            sections.push(sectionName);

            restaurants.updateOne({ownerEmail : ownerEmail}, { $set : {sections : sections} }, {upsert : true}).then((result) => {
                res.json({
                    "status" : 200
                });
            }).catch((err) => {
                console.log(err.toString());
                res.json({
                    "status" : 500
                });
            });

        }).catch((err) => {
            console.log(err.toString());
            res.json({
                "status" : 500
            });
        });
    } else {
        res.json({
            "status" : 403
        });
    }
});

router.post('/addItem', (req,res) => {

    console.log("REQUEST====" + JSON.stringify(req.body));
    console.log("REQUEST====" + req.session.userType);
    
    if (req.session.userType == OWNER){
        let ownerId = req.session.userId;
        let {name, description, price, section, restaurantId} = req.body;
        // INSERT INTO `grubhub`.`Menu_Items` (`item_name`, `description`, `section_name`, `price`, `parent_restaurant_id`) VALUES ('Tomato', 'CreamTomato', 'Soups', '2.99', '3');

        let query = "INSERT INTO `grubhub`.`Menu_Items` (`item_name`, `description`, `section_name`, `price`, `parent_restaurant_id`) VALUES ('" + name + "', '" + description + "', '" + section + "', '" + price + "', '" + restaurantId + "')"
        
        console.log("Query : " + query);

        pool.query(query, (err, results) => {
            if (err){
                console.error("Error : " + JSON.stringify(err));
                res.json({
                    "status" : 500
                });
            }

            if (results){
                res.json({
                    "status" : 200
                });
            }
        });
    } else {
        res.json({
            "status" : 403
        });
    }
});

module.exports = router;