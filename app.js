var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    session = require("cookie-session"),
    db = require('./models'),
    loginMiddleware = require("./middleware/loginHelper"),
    routeMiddleware = require("./middleware/routeHelper"),
    dotenv = require("dotenv").load();

app.set('view engine', 'ejs');
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
  maxAge: 3600000,
  secret: 'appsecret',
  name: "app name"
}));                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          

app.use(loginMiddleware);

// db.connect({
//   host: process.env.DB_HOST,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASS
// });

//ROOT

app.get("/", function(req,res) {
  res.render("users/index");
});

app.get("/trades", function(req,res) {
  db.Trade.find({}).populate("author","username").populate("myplayers").populate("theirplayers").exec(function(err, trades) {
    if (err) {
      console.log(err);
    } else {
      if (req.session.id === null) {
        res.render("posts/index", {trades: trades, currentuser: ""});
      } else {
        db.User.findById(req.session.id, function(err,user) {
          res.render("posts/index", {trades: trades, currentuser: user.username});
        });
      }
    }
  });
});

app.get("/users/index", routeMiddleware.preventLoginSignup, function(req,res) {
  res.render("users/index");
});

app.get("/login", routeMiddleware.preventLoginSignup, function(req,res) {
  res.render("users/login");
});

app.post("/login", function(req,res) {
  db.User.authenticate(req.body.user, function(err,user) {
    if (!err && user !== null) {
      req.login(user);
      //redirect to the home page
      res.redirect("/trades");
    } else {
      console.log(err);
      //render the login page with err passed as err
      res.render("users/login", {err: err});
    }
  });
});

app.get("/signup", routeMiddleware.preventLoginSignup, function(req,res) {
  res.render("users/signup");
});

app.post("/signup", function(req,res) {
  db.User.create(req.body.user, function(err,user) {
    res.redirect("users/login");
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

//TRADE ROUTES
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
  // db.Trade.populate("");
  db.Post.findById(req.params.id, function(err,trade) {
    if (err) {
      console.log(err);
    } else {
      res.render("trades/edit", {trade: trade});
    }
  });
});

//update trade
app.put("/trades/:id", routeMiddleware.ensureCorrectUserForTrade, function(req,res) {
  var show_page = "/trades/" + req.params.id;
  db.Trade.findByIdandUpdate(req.params.id, req.body.post, function(err,post) {
    if (err) {
      console.log(err);
      res.render("posts/edit");
    } else {
      res.redirect(show_page);
    }
  });
});

//destroy trade
app.delete("/trades/:id", routeMiddleware.ensureCorrectUserForTrade, function(req,res) {
  db.Trade.findById(req.params.id, function(err,trade) {
    if (err) {
      console.log(err);
      res.render("trades/show");
    } else {
      trade.remove();
      res.redirect("/trades");
    }
  });
});



//Comment ROUTES
//index
app.get("/trades/:trade_id/comments", function(req,res) {

});
//new comment
app.get("/trades/:trade_id/comments/new", function(req,res) {

});
//create comment
app.post("/trades/:trade_id/comments", function(req,res) {

});

//show
app.get("/trades/:trade_id/comments/:id", function(req,res) {

});

//edit comment
app.get("/comments/:id/edit", routeMiddleware.ensureCorrectUserForComment, function(req,res) {
  db.Comment.findByIdAndUpdate(req.params.id, req.body.comment, function(err,comment) {
    if (err) {
      res.render("comments/edit");
    } else {
      console.log(comment);
      res.redirect("comments/edit", {comment: comment});
    }
  });
});

//update comment
app.put("/comments/:id", routeMiddleware.ensureCorrectUserForComment, function(req,res) {
  db.Comment.findByIdAndUpdate(req.params.id, req.body.comment, function(err, comment) {
    if (err) {
      res.render("comments/edit");
    } else {
      console.log(comment);
      res.redirect("/trades/" + comment.post + "/comments");
    }
  });
});

//DESTROY      
app.delete('/comments/:id', routeMiddleware.ensureCorrectUserForComment, function(req,res) {
  db.Comment.findByIdAndRemove(req.params.id, function(err, comment) {
    if(err) {
      console.log(err);
      res.render('comments/index');
    }
    else {
      res.redirect('/trades/' + comment.post + "/comments");
    }
  });
});

//Team ROUTES
app.get("/users/:id/team", function(req,res) {

});

//edit team
app.get("/team/:id/edit", routeMiddleware.ensureCorrectUserForTeam, function(req,res) {
  //render a page with the whole team, with option
  db.Team.findById(req.params.id, function(err,team) {
    if (err) {
      console.log(err);
      res.render("errors/404");
    } else {
      res.render("teams/edit", {team: team});
    }
  });
});

app.get("*", function(req,res) {
  res.render("errors/404");
});
//Player ROUTES
//team and player are both needed to give an accurate trade assessment
//
app.get("")

app.listen(process.env.PORT || 3000);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
