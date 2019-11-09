var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');

var cors = require('cors');

var userRouter = require('./routers/users');
var restaurantManagementRouter = require('./routers/restaurantManagement');
var buyerRouter = require('./routers/buyer');
var orderRouter  = require('./routers/orders');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://3.88.210.120.82:3000', credentials: true }));

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
    res.setHeader('Access-Control-Allow-Origin', 'http://3.88.210.120.82:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.use(userRouter);
app.use(restaurantManagementRouter);
app.use(buyerRouter);
app.use(orderRouter);

app.listen(3001);
console.log('Server Listening on port 3001');