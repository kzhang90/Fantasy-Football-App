var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    session = require("cookie-session"),
    db = require('./models');
    loginMiddleware = require("./middleware/loginHelper");
    routeMiddleware = require("./middleware/routeHelper");

app.set('view engine', 'ejs');
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  maxAge: 3600000,
  secret: 'supersecretro',
  name: "double chocochip"
}));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          

app.use(loginMiddleware);

//ROOT

app.get("/", function(req,res) {
  //render all the trades
});

app.get("/trades", function(req,res) {
  redirect("/");
});

app.get("/users/index", routeMiddleware.preventLoginSignup, function(req,res) {
  //render the login page
});

app.get("/login", routeMiddleware.preventLoginSignup, function(req,res) {
  //render the login page
});

app.post("/login", function(req,res) {
  db.User.authenticate(req.body.user, function(err,user) {
    if (!err && user !== null) {
      req.login(user);
      //redirect to the home page
      res.redirect("");
    } else {
      console.log(err);
      //render the login page with err passed as err
    }
  });
});

app.get("/signup", routeMiddleware.preventLoginSignup, function(req,res) {
  res.render("users/signup");
});

app.post("/signup", function(req,res) {
  db.User.create(req.body.user, function(err,user) {

  });
});

app.get("/logout", function(req,res) {
  req.logout();
  res.redirect("/");
});

//Show user page
app.get("/users/:id", function(req,res) {
 //show a page with my profile and information
 //with buttons to navigate to the places on ejs
});

//GROUP ROUTES
//ensure logged in?
// app.get("/groups", function(req,res) {
//   //populate all users and posts
// });

// app.get("/groups/:id", function(req,res) {

// });

//COMMENT ROUTES
app.get("/trades/new", routeMiddleware.ensureLoggedIn, function(req,res) {
  console.log(req.session.id);
  res.render("trades/new", {user_id:req.session.id});
});

app.post("/trades", function(req,res) {
  db.Trade.create(req.body);
});

app.get("/trades/:id", function(req,res) {
  db.Trade.findById(req.params.id).populate();
});

//edit trade
app.get("/trades/:id/edit", routeMiddleware.ensureCorrectUserForTrade, function(req,res) {
  db.Trade.populate.

});



//Comment ROUTES


//Team ROUTES

app.listen(process.env.PORT || 3000);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
