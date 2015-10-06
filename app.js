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

db.connect({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS
});

//ROOT

app.get("/", function(req,res) {
  res.render("users/index");
});

app.get("/posts", function(req,res) {
  db.Post.find({}).populate("author").exec(function(err, posts) {
    if (err) {
      console.log(err);
    } else {
      if (req.session.id === null) {
        res.render("posts/index", {posts: posts, currentuser: ""});
      } else {
        db.User.findById(req.session.id, function(err,user) {
          res.render("posts/index", {posts: posts, currentuser: user.username});
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
      //session id is set to user id
      req.login(user);
      //redirect to the home page
      res.redirect("/posts");
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
    if (user) {
      req.login(user);
      res.redirect("/posts");
    } else {
      res.render("errors/404");
    }
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

//Post ROUTES
app.get("/posts/new", routeMiddleware.ensureLoggedIn, function(req,res) {
  console.log(req.session.id);
  res.render("posts/new", {author_id:req.session.id});
});

app.post("/posts", function(req,res) {
  db.Post.create(req.body.post, function(err, post) {
    if (!post.media) {
      post.media = "http://farm6.staticflickr.com/5241/5294677555_7efa8154db.jpg";
      post.save();
    }
    if (err) {
      console.log(err);
      res.render("/posts/new");
    } else {
      res.redirect("/posts");
    }
  });
});

app.get("/posts/:id", function(req,res) {
  db.Post.findById(req.params.id).populate("comments").exec(
    function(err,post) {
      res.render("posts/show", {post: post});
    });
});

//edit Post
app.get("/posts/:id/edit", routeMiddleware.ensureCorrectUserForPost, function(req,res) {
  db.Post.findById(req.params.id, function(err,post) {
    if (err) {
      console.log(err);
    } else {
      res.render("posts/edit", {post: post});
    }
  });
});

//update Post
app.put("/posts/:id", routeMiddleware.ensureCorrectUserForPost, function(req,res) {
  var show_page = "/posts/" + req.params.id;
  db.Post.findByIdandUpdate(req.params.id, req.body.post, function(err,post) {
    if (err) {
      console.log(err);
      res.render("posts/edit");
    } else {
      res.redirect(show_page);
    }
  });
});

//destroy Post
app.delete("/posts/:id", routeMiddleware.ensureCorrectUserForPost, function(req,res) {
  db.Post.findById(req.params.id, function(err,post) {
    if (err) {
      console.log(err);
      res.render("posts/show");
    } else {
      Post.remove();
      res.redirect("/posts");
    }
  });
});



//Comment ROUTES
//index
app.get("/posts/:post_id/comments", function(req,res) {
  db.Comment.find({post:req.params.post_id}).populate("author").exec(function(err,comments){
    res.format({
          'text/html': function(){
            res.render("comments/index", {comments:comments});
          },

          'application/json': function(){
            res.send({ comments: comments });
          },
          'default': function() {
            // log the request and respond with 406
            res.status(406).send('Not Acceptable');
          }
    });
  });
});
//new comment
app.get("/posts/:post_id/comments/new", function(req,res) {
  db.Post.findById(req.params.post_id, function (err, post) {
      res.render("comments/new", {post:post, author_id: req.session.id});
    });
});
//create comment
app.post("/posts/:post_id/comments", function(req,res) {
    db.Comment.create(req.body.comment, function(err, comments) {
    if(err) {
      console.log(err);
      res.render('comments/new');
    } else {
      db.Post.findById(req.params.post_id, function(err, post) {
        post.comments.push(comments);
        console.log(comments);
        comments.post = post._id;
        comments.save();
        post.save();
        res.redirect("/posts/" + req.params.post_id + "/comments");
      });
    }
  });
});

//edit comment
app.get("/comments/:id/edit", routeMiddleware.ensureCorrectUserForComment, function(req,res) {
  db.Comment.findById(req.params.id, function(err,comment) {
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
      res.redirect("/posts/" + comment.post + "/comments");
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
      res.redirect('/posts/' + comment.post + "/comments");
    }
  });
});



//Team ROUTES


//index for showing all teams of a user, have to be logged in
app.get("/users/:user_id/teams", function(req,res) {
  db.Team.find({user: req.params.user_id}).exec(function(err,teams) {
    if (err) {
      console.log(err);
    } else {
      if (req.session.id === null) {
        //if the person is not logged on, render this
        //can see teams but cannot edit or add teams
        //need login button
        res.render("teams/index", {teams: teams, currentuser: ""});
      } else {
        db.User.findById(req.session.id, function(err,user) {
          //if th
          res.render("teams/index", {teams: teams, currentuser: user.username});
        });
      }
    }
  });
});

//show all of the players of a particular team
app.get("/teams/:id", function(req,res) {
  db.Team.findById(req.params.id).populate("players").exec(
    function(err,team) {
      res.render("teams/show", {team: team});
  });
});
//make new team
app.get("users/:id/teams/new", routeMiddleware.ensureLoggedIn, function(req,res) {
  db.User.findById(req.params.id, function(err,team) {
    res.render("teams/new", {user:user, author_id: req.session.id});
  });
});
//edit team
app.get("/teams/:id/edit", routeMiddleware.ensureCorrectUserForTeam, function(req,res) {
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

//update a team name
app.put("/teams/:id", routeMiddleware.ensureCorrectUserForTeam, function(req,res) {
  //puts another team into the teams
  db.Team.findByIdandUpdate(req.params.id, req.body.team, function(err,team) {
    if (err) {
      res.render("teams/edit");
    } else {
      console.log(team);
      res.redirect("/users/" + team.user + "/teams");
    }
  });
});

//delete a whole team
app.delete("/teams/:id", routeMiddleware.ensureCorrectUserForTeam, function(req,res) {
  db.Team.findByIdAndRemove(req.params.id, function(err,team) {
    if (err) {
      console.log(err);
      res.render("teams/index");
    } else {
      res.redirect("/users" + team.user + "/teams");
    }
  });
});


//Player ROUTES
//team and player are both needed to give an accurate Post assessment
//

app.get("/teams/:team_id/players", function(req,res) {
  //shows all of the players of a certain team, render the players index page
  db.Player.find({team:req.params.team_id}).populate("author").exec(function(err,players) {
    res.format({
          'text/html': function(){
            res.render("players/index", {players:players});
          },
          'application/json': function(){
            res.send({ players: players });
          },
          'default': function() {
            // log the request and respond with 406
            res.status(406).send('Not Acceptable');
          }
    });
  });
});

//new player
app.get("/teams/:team_id/players/new", routeMiddleware.ensureLoggedIn, function(req,res) {
  db.Player.findById(req.params.team_id, function(err,player) {
    res.render("players/new", {player: player, author_id: req.session.id});
  });
});

//create player
app.post("/teams/:team_id/players", function(req,res) {
  db.Player.create(req.body.player, function(err,players) {
    if (err) {
      console.log(err);
      res.render("players/new");
    } else {
      db.Team.findById(req.params.team_id, function(err, team) {
        team.players.push(players);
        console.log(players);
        players.team = team._id;
        players.save();
        team.save();
        res.redirect("/teams/" + req.params.team_id + "/players");
      });
    }
  });
});

app.get("/players/:id/edit", routeMiddleware.ensureCorrectUserForTeam, function(req,res) {
  db.Player.findById(req.params.id, function(err,player) {
    if (err) {
      console.log(err);
    } else {
      res.render("players/edit", {player: player});
    }
  });
});

//update player
app.put("/players/:id", routeMiddleware.ensureCorrectUserForTeam, function(req,res) {
 db.Player.findByIdAndUpdate(req.params.id, req.body.player, function(err,player) {
  if (err) {
    res.render("players/edit");
  } else {
    console.log(player);
    res.redirect("/teams/" + player.team + "/players");
  }
 });
});

app.delete("/players/:id", routeMiddleware.ensureCorrectUserForTeam, function(req,res) {
  db.Player.findByIdAndRemove(req.params.id, function(err,player) {
    if (err) {
      console.log(err);
      res.render("/teams/" + player.team + "/players");
    }
  });
});



app.get("*", function(req,res) {
  res.render("errors/404");
});

app.listen(process.env.PORT || 3000);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
