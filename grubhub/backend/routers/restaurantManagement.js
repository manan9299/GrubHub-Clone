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

router.get('/getsections', ownerAuth, (req,res) => {

    if (req.userType == OWNER){
        
        const restaurants = mongodb.collection('restaurants');

        restaurants.findOne({ownerEmail : req.user.email}).then((restaurant) => {
            
            if(restaurant){
                res.json({
                    "status" : 200,
                    "payload" : restaurant.sections,
                    "restaurant_id" : restaurant.name
                });
            } else {
                res.json({
                    "status" : 200,
                    "payload" : [],
                    "restaurant_id" : ""
                });
            }

        }).catch((err) => {
            res.json({
                "status" : 404,
                "payload" : [],
                "restaurant_id" : ""
            });
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
            let owners = mongodb.collection('owners');

            owners.updateOne({email:ownerEmail}, { $set : {restaurantOwned : name} }, {upsert : true}).then((results) => {
                res.json({
                    "status" : 200
                });
            }).catch((err) => {
                res.json({
                    "status" : 404
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

router.post('/addItem', ownerAuth, (req,res) => {

    if (req.userType == OWNER){
        let {description, price, section} = req.body;
        let ownerEmail = req.user.email;

        let restaurants = mongodb.collection('restaurants');
        
        restaurants.findOne({ownerEmail : ownerEmail}).then((restaurant) => {
            let {name, address, city, zip, contact} = restaurant;
            let restaurantDetails = {
                name : name,
                address : address,
                city : city,
                zip, zip,
                contact : contact
            }
            let item = {
                name : req.body.name,
                description : description,
                price : price,
                section : section,
                restaurant : restaurantDetails
            }

            let items = mongodb.collection('items');
            items.insertOne(item).then((results) => {
                res.json({
                    "status" : 200
                });
            }).catch((err) => {
                console.log("Failed to insert item. Error => " + err.toString());
                res.json({
                    "status" : 200
                });
            })

        }).catch((err) => {
            res.json({
                "status" : 500
            });
        });
    } else {
        res.json({
            "status" : 500
        });
    }
});

module.exports = router;