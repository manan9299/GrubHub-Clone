const express = require('express')
var pool = require('../database');

const router = express.Router();

var constants = require('../lib/constants');
const BUYER = constants.BUYER;

router.post('/setUserPref', (req,res) => {

    if (req.session.userType == BUYER){
        req.session.userDish = req.body.dishName;
        
        res.json({
            "status" : 200
        });
        
    } else {
        res.json({
            "status" : 403
        });
    }
});

router.post('/setSelectedRestaurant', (req,res) => {

    if (req.session.userType == BUYER){
        req.session.selectedRestaurantId = req.body.selectedRestaurantId;
        
        res.json({
            "status" : 200
        });
        
    } else {
        res.json({
            "status" : 403
        });
    }
});

router.post('/addToCart', (req,res) => {

    if (req.session.userType == BUYER){
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


router.get('/getRestaurantItems', (req,res) => {

    if (req.session.userType == BUYER){

        let selectedRestaurantId = req.session.selectedRestaurantId;

        let query = "SELECT item_name, description, section_name , price FROM grubhub.Menu_Items where parent_restaurant_id='" + selectedRestaurantId + "' order by section_name";

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

router.get('/getFilteredRestaurants', (req,res) => {

    if (req.session.userType == BUYER){
        let itemName = req.session.userDish;

        let query = "SELECT restaurant_id, restaurant_name, address, city, phone_number FROM grubhub.Restaurants where restaurant_id in (select parent_restaurant_id from grubhub.Menu_Items where upper(item_name)=upper('" + itemName + "'))";

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
            "status" : 403,
            "payload" : ""
        });
    }
});

module.exports = router;