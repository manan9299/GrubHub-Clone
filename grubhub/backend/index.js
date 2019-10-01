var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

var cors = require('cors');
var pool = require('./database')
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

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
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


app.listen(3001);
console.log('Server Listening on port 3001');