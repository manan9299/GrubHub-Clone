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
        let buyerEmail = req.user.email;

        const cart = mongodb.collection('cart');

        let items = req.body.itemsForCart;
        let itemPrices = req.body.itemPrices;
        let restaurant = req.user.restaurantPref;
        let itemList = [];

        for(let item in items){
            let itemName = item;
            let itemQty = items[item];
            let itemPrice = itemPrices[item];

            let newItem = {
                itemName : itemName,
                itemQty : itemQty,
                itemPrice : itemPrice
            }
            itemList.push(newItem);
        }

        let cartItem = {
            buyerEmail : buyerEmail,
            restaurant : restaurant,
            items : itemList
        }
        console.log(JSON.stringify(cartItem));
        cart.insertOne(cartItem).then((results) => {
            res.json({
                "status" : 200
            });
        }).catch((err) => {
            console.error("Error : " + JSON.stringify(err));
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

router.post('/placeOrder', buyerAuth, (req,res) => {

    if (req.userType == BUYER){
        let buyerEmail = req.user.email;

        const cart = mongodb.collection('cart');

        cart.findOne({buyerEmail : buyerEmail}).then((results) => {
            let order = {
                status : "New",
                buyerEmail : buyerEmail,
                restaurant : results.restaurant,
                items : results.items,
                deliveryAddress : req.user.address
            }

            const orders = mongodb.collection('orders');

            orders.insertOne(order).then((result) => {
                cart.deleteMany({buyerEmail : buyerEmail}).then((result) => {
                    res.json({
                        "status" : 200
                    });
                }).catch((err) => {
                    res.json({
                        "status" : 404
                    });
                });
                
            }).catch((err) => {
                res.json({
                    "status" : 404
                });
            });
        }).catch((err) => {
            res.json({
                "status" : 404
            });
        });
    } else {
        res.json({
            "status" : 403
        });
    }
});

router.get('/getCartItems', buyerAuth, (req,res) => {

    if (req.userType == BUYER){
        let buyerEmail = req.user.email;

        const cart = mongodb.collection('cart');

        cart.findOne({buyerEmail : buyerEmail}, {projection : {restaurant : 1, items : 1}}).then((itemList) => {
            console.log("Found Item");
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