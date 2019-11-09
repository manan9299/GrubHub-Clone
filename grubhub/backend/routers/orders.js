const express = require('express')
const ownerAuth = require('../auth');
const buyerAuth = require('../buyerauth');

const router = express.Router();
var constants = require('../lib/constants');

const OWNER = constants.OWNER;
const BUYER = constants.BUYER;

var mongoDatabase = require('../mongoDatabase');

var mongodb;
mongoDatabase.getMongoConnection().then((connection) => {
    mongodb = connection;
});

router.get('/getRestaurantOrders', ownerAuth, (req,res) => {

    if (req.userType == OWNER){

        const orders = mongodb.collection('orders');
        
        orders.find({$and : [{restaurant : req.user.restaurantOwned},{ $or : [{status : "New"}, {status : "Ready"}, {status : "Preparing"}]}]}).toArray().then((ordersList) => {
            console.log("Restaurant Orders == > " + JSON.stringify(ordersList))
            res.json({
                "status" : 200,
                "payload" : ordersList
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

router.get('/getBuyerOrders', buyerAuth, (req,res) => {

    if (req.userType == BUYER){

        const orders = mongodb.collection('orders');
        
        orders.find({$and : [{buyerEmail : req.user.email},{ $or : [{status : "New"}, {status : "Ready"}, {status : "Preparing"}]}]}).toArray().then((ordersList) => {
            console.log("Buyer Orders == > " + JSON.stringify(ordersList))
            res.json({
                "status" : 200,
                "payload" : ordersList
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

router.post('/changeOrderStatus', ownerAuth, (req,res) => {

    if (req.userType == OWNER){

        const orders = mongodb.collection('orders');
        
        orders.updateOne({ buyerEmail : req.body.buyerEmail, restaurant : req.user.restaurantOwned }, {$set : {status : req.body.status}}).then((results) => {
            
            res.json({
                "status" : 200
            });

        }).catch((err) => {
            console.log(err)
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

router.post('/cancelOrder', buyerAuth, (req,res) => {

    if (req.userType == BUYER){

        const orders = mongodb.collection('orders');
        
        orders.updateOne({ buyerEmail : req.body.buyerEmail, restaurant : req.user.restaurantPref }, {$set : {status : req.body.status}}).then((results) => {
            
            res.json({
                "status" : 200
            });

        }).catch((err) => {
            console.log(err)
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

router.get('/getPastOrders', buyerAuth, (req,res) => {

    if (req.userType == BUYER){

        const orders = mongodb.collection('orders');
        
        orders.find({$and : [{buyerEmail : req.user.email},{ $or : [{status : "Delivered"}, {status : "Cancelled"}]}]}).toArray().then((ordersList) => {
            console.log("Buyer Past Orders == > " + JSON.stringify(ordersList))
            res.json({
                "status" : 200,
                "payload" : ordersList
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

router.get('/getRestaurantPastOrders', ownerAuth, (req,res) => {

    if (req.userType == OWNER){

        const orders = mongodb.collection('orders');
        
        orders.find({$and : [{restaurant : req.user.restaurantOwned},{ $or : [{status : "Delivered"}, {status : "Cancelled"}]}]}).toArray().then((ordersList) => {
            console.log("Buyer Past Orders == > " + JSON.stringify(ordersList))
            res.json({
                "status" : 200,
                "payload" : ordersList
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

module.exports = router;