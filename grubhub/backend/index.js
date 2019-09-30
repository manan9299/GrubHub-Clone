
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret              : 'cmpe273_kafka_passport_mongo',
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

  var Users = [{
      username : "admin",
      password : "admin"
  }]

  var books = [
    {"BookID" : "1", "Title" : "Book 1", "Author" : "Author 1"},
    {"BookID" : "2", "Title" : "Book 2", "Author" : "Author 2"},
    {"BookID" : "3", "Title" : "Book 3", "Author" : "Author 3"}
]

var findBookObject = (bookId) => {
    for (let i = 0; i < books.length; i++){
        let book = books[i];
        let id = book["BookID"];
        if (bookId == id){
            return i;
        }
    }
    return -1;
}

//Route to handle Post Request Call
app.post('/login',function(req,res){
    
    // Object.keys(req.body).forEach(function(key){
    //     req.body = JSON.parse(key);
    // });
    // var username = req.body.username;
    // var password = req.body.password;
    console.log("Inside Login Post Request");
    //console.log("Req Body : ", username + "password : ",password);
    console.log("Req Body : ",req.body);
    Users.filter(function(user){
        if(user.username === req.body.username && user.password === req.body.password){
            res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = user;
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            let responseJson = {
                "status" : 200,
                "error" : ""
            }
            res.end(JSON.stringify(responseJson));
        } else {
            let responseJson = {
                "status" : 403,
                "error" : "Invalid Credentials"
            }
            res.end(JSON.stringify(responseJson));
        }
    })

    
});

app.post('/create',function(req,res){
    console.log("Inside Create Post Request");

    console.log("Req Body : ",req.body);
    let reqBody = req.body;
    let bookId = reqBody.bookId;
    let newBook = {
        "BookID" : bookId,
        "Title" : reqBody.bookName,
        "Author" : reqBody.bookAuthor
    };
    let existingBookId = findBookObject(reqBody.bookId);
    if (existingBookId == -1){
        books.push(newBook);
        res.writeHead(200,{
            'Content-Type' : 'application/json'
        });
        console.log("Books : ",JSON.stringify(books));
        res.end(JSON.stringify({
            "status" : 200,
            "error" : ""
        }));
        
    } else {
        res.writeHead(200,{
            'Content-Type' : 'application/json'
        });
        res.end(JSON.stringify({
            "status" : 444,
            "error" : "Book already exists"
        }));
    }
});

app.post('/delete',function(req,res){
    console.log("Inside Delete Request");

    console.log("Req Body : ",req.body);
    let bookId = req.body.bookId;
    console.log("BookID to be deleted : " + bookId);

    let idxToDelete = findBookObject(bookId);
    if (idxToDelete > -1){
        books.splice(idxToDelete, 1);
        
    }

    
    res.writeHead(200,{
        'Content-Type' : 'application/json'
    });
    console.log("Books : ",JSON.stringify(books));
    res.end(JSON.stringify(books));
    
});




//Route to get All Books when user visits the Home Page
app.get('/home', function(req,res){
    console.log("Inside Home Login");    
    res.writeHead(200,{
        'Content-Type' : 'application/json'
    });
    console.log("Books : ",JSON.stringify(books));
    res.end(JSON.stringify(books));
    
})
//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");