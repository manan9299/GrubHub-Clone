const express = require('express')
var pool = require('../database');

const router = express.Router();

var constants = require('../lib/constants');

const OWNER = constants.OWNER;

router.get('/getRestaurantInfo', (req,res) => {

    if (req.session.userType == OWNER){
        let ownerId = req.session.userId;
        let query = "SELECT restaurant_id, restaurant_name, address, city, zip_code, phone_number FROM grubhub.Restaurants where restaurant_owner_id='" + ownerId + "'";
        console.log("Query : " + query);
        pool.query(query, (err, results) => {

            console.log("Error : " + JSON.stringify(err));
            console.log("Result : " + JSON.stringify(results));

            if (err){
                console.error("Error : " + JSON.stringify(err));
                res.json({
                    "status" : 500,
                    "payload" : ""
                });
            }

            if (results){
                let payload = {
                    restaurantId : "",
                    name : "",
                    address : "",
                    city : "",
                    zip : "",
                    contact : ""
                };

                if (results.length != 0){
                    let {restaurant_id, restaurant_name, address, city, zip_code, phone_number} = results[0];
                    payload = {
                        restaurantId : restaurant_id,
                        name : restaurant_name,
                        address : address,
                        city : city,
                        zip : zip_code,
                        contact : phone_number
                    };
                    res.json({
                        "status" : 200,
                        "payload" : payload
                    });
                } else {
                    res.json({
                        "status" : 404,
                        "payload" : ""
                    });
                }
            }
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

router.post('/updateRestaurant', (req,res) => {
    let {restaurantId, name, address, city, zip, contact, infoNotFound} = req.body;
    
    // UPDATE `grubhub`.`Restaurants` SET `restaurant_name` = 'Rest111', `address` = '1332, Address1', `city` = 'San Jose11' WHERE (`restaurant_id` = '1');
    
    if (req.session.userType == OWNER){
        let ownerId = req.session.userId;
        let query = "";
        console.log("INFO NOT FOUND : " + infoNotFound);
        if (infoNotFound){
            query = "INSERT INTO `grubhub`.`Restaurants` (`restaurant_owner_id`, `restaurant_name`, `address`, `city`, `zip_code`, `phone_number`) VALUES ('"+ ownerId + "', '"+ name + "', '"+ address + "', '"+ city + "', '"+ zip + "', '"+ contact + "')";
        } else {
            query = "UPDATE `grubhub`.`Restaurants` SET `restaurant_name` = '"+ name + "', `address` = '"+ address + "', `city` = '"+ city + "', `zip_code` = '"+ zip + "', `phone_number` = '"+ contact + "' WHERE (`restaurant_id` = '"+ restaurantId + "')";
        }
        

        console.log("Query : " + query);
        pool.query(query, (err, results) => {

            console.log("Error : " + JSON.stringify(err));
            console.log("Result : " + JSON.stringify(results));

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

router.post('/addsection', (req,res) => {

    console.log("REQUEST====" + JSON.stringify(req.body));
    console.log("REQUEST====" + req.session.userType);
    
    if (req.session.userType == OWNER){
        let ownerId = req.session.userId;
        let sectionName = req.body.sectionName;

        let query = "SELECT restaurant_id FROM grubhub.Restaurants where restaurant_owner_id='"+ ownerId + "'";
        let restaurant_id = "";

        console.log("Query 1 : " + query);

        pool.query(query, (err, results) => {
            console.log("Error : " + JSON.stringify(err));
            console.log("Result : " + JSON.stringify(results));
            
            if (results){
                if (results.length != 0){
                    restaurant_id = results[0]["restaurant_id"];
                    console.log("restaurant_id : " + restaurant_id);
                }
            }

            query = "INSERT INTO `grubhub`.`Menu_Sections` (`parent_restaurant_id`, `section_name`) VALUES ('" + restaurant_id + "', '" + sectionName + "')"

            console.log("Query : " + query);
            pool.query(query, (err, results) => {

                console.log("Error : " + JSON.stringify(err));
                console.log("Result : " + JSON.stringify(results));

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