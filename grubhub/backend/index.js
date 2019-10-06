var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

var cors = require('cors');
var pool = require('./database')

const BUYER = "buyer";
const OWNER = "owner";
// app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret              : 'wzex78675jnkm321pkjohi564',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.post('/login', function(req, res) {
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

app.post('/signup', function(req, res) {
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

app.post('/ownersignup', function(req, res) {
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
        }
        if (results && results.length != 0){
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

app.post('/ownerlogin', function(req, res) {
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
        if (results && results.length != 0){
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

app.get('/getRestaurantInfo', (req,res) => {

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

app.get('/getsections', (req,res) => {

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

app.post('/updateRestaurant', (req,res) => {
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

app.post('/addsection', (req,res) => {

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

app.post('/addItem', (req,res) => {

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

app.post('/setUserPref', (req,res) => {

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

app.get('/getFilteredRestaurants', (req,res) => {

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




app.listen(3001);
console.log('Server Listening on port 3001');