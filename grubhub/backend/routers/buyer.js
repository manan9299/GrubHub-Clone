const express = require('express')
var pool = require('../database');
const buyerAuth = require('../buyerauth');
const router = express.Router();

var constants = require('../lib/constants');
var mongoDatabase = require('../mongoDatabase');
var mongodb;
mongoDatabase.getMongoConnection().then((connection) => {
    mongodb = connection;
});

const BUYER = constants.BUYER;

router.post('/setUserPref', buyerAuth, (req,res) => {

    if (req.userType == BUYER){
        let dishName = req.body.dishName;
        
        const buyers = mongodb.collection('buyers');
    
        buyers.updateOne({email : req.user.email}, { $set : {dishPref : dishName} }, {upsert : true}).then(async(buyer) => {
            res.json({
                "status" : 200
            });
        }).catch((err) => {
            console.log(err.toString());
            res.json({
                "status" : 404,
                "message" : "User not found"
            });
        });
    } else {
        res.json({
            "status" : 403
        });
    }
});

router.post('/setSelectedRestaurant', buyerAuth, (req,res) => {

    if (req.userType == BUYER){

        let restaurantPref = req.body.selectedRestaurantId;
        
        const buyers = mongodb.collection('buyers');
    
        buyers.updateOne({email : req.user.email}, { $set : {restaurantPref : restaurantPref} }, {upsert : true}).then(async(buyer) => {
            res.json({
                "status" : 200
            });
        }).catch((err) => {
            console.log(err.toString());
            res.json({
                "status" : 404,
                "message" : "User not found"
            });
        });
    } else {
        res.json({
            "status" : 403
        });
    }
});

router.post('/addToCart', buyerAuth, (req,res) => {

    if (req.userType == BUYER){


        let buyerId = req.session.userId;
        let restaurantId = req.session.selectedRestaurantId;

        let items = req.body.itemsForCart;
        let itemPrices = req.body.itemPrices;
        let itemQueryStringList = [];

        for(let item in items){
            let itemName = item;
            let itemQty = items[item];
            let itemPrice = itemPrices[item];

            let itemString = "('" + buyerId + "', '" + itemName + "', '" + itemQty + "', '" + restaurantId + "', '" + itemPrice + "')";
            itemQueryStringList.push(itemString);
        }

        let itemQueryString = itemQueryStringList.join(",");
        console.log("itemQueryString : " + itemQueryString);

        let query = "INSERT INTO `grubhub`.`Cart` (`buyer_id`, `item_name`, `quantity`, `restaurant_id`, `price`) VALUES " + itemQueryString ;
        console.log("Insert Query : " + query);
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
        
    } else {
        res.json({
            "status" : 403
        });
    }
});

router.post('/placeOrder', (req,res) => {

    if (req.session.userType == BUYER){
        let buyerId = req.session.userId;
        
        let query = "INSERT INTO `grubhub`.`Orders` (`item_name`, `ordered_restaurant_id`, `quantity`, `price`, `buyer_id`) SELECT item_name, restaurant_id, quantity, price, buyer_id FROM grubhub.Cart where grubhub.Cart.buyer_id = " + buyerId;
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
        
    } else {
        res.json({
            "status" : 403
        });
    }
});

router.get('/getCartItems', (req,res) => {

    if (req.session.userType == BUYER){

        let buyerId = req.session.userId;

        let query = "SELECT item_name, quantity, price, restaurant_name FROM  grubhub.Cart inner join grubhub.Restaurants on grubhub.Cart.restaurant_id = grubhub.Restaurants.restaurant_id where grubhub.Cart.buyer_id = " + buyerId;

        pool.query(query, function(err, results){
            if (err){
                console.error("Error : " + JSON.stringify(err));
                res.json({
                    "status" : 500,
                    "payload" : ""
                });
            } else {
                console.log("Results : " + JSON.stringify(results));
                res.json({
                    "status" : 200,
                    "payload" : results
                });
            }
        });
    } else {
        res.json({
            "status" : 403
        });
    }
});


router.get('/getRestaurantItems', buyerAuth, (req,res) => {

    if (req.userType == BUYER){

        let selectedRestaurantId = req.user.restaurantPref;

        const items = mongodb.collection('items');

        items.find({'restaurant.name' : selectedRestaurantId}, {projection : {name : 1, description : 1, price : 1, section : 1}}).toArray().then((itemList) => {

            console.log("Items ==> " + JSON.stringify(itemList));
            
            if(itemList){
                res.json({
                    "status" : 200,
                    "payload" : itemList
                });
            } else {
                res.json({
                    "status" : 404,
                    "payload" : []
                });
            }

        }).catch((err) => {
            res.json({
                "status" : 404,
                "payload" : []
            });
        });
    } else {
        res.json({
            "status" : 403
        });
    }
});

router.get('/getFilteredRestaurants', buyerAuth, (req,res) => {

    if (req.userType == BUYER){
        let dishPref = req.user.dishPref;

        const items = mongodb.collection('items');

        items.find({name : dishPref}, {projection : {restaurant : 1}}).toArray().then((itemList) => {
            
            if(itemList){
                res.json({
                    "status" : 200,
                    "payload" : itemList
                });
            } else {
                res.json({
                    "status" : 404,
                    "payload" : []
                });
            }

        }).catch((err) => {
            res.json({
                "status" : 404,
                "payload" : []
            });
        });
    } else {
        res.json({
            "status" : 403,
            "payload" : ""
        });
    }
});

module.exports = router;