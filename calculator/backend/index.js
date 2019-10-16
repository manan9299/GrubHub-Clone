var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var cors = require('cors');
// app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
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

app.post('/calculate', function(req, res) {
    try {
        let expression = req.body.expression;

        let result = "";

        result = eval(expression);
        
        result = result.toString();

        console.log("RESULT : " + result);

        res.json({
            "result" : result
        });
        
    } catch (error) {
        res.json({
            "result" : error.toString()
        });
    }
    
});

app.listen(3001);
console.log('Server Listening on port 3001');