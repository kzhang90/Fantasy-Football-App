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

// //Team ROUTES


// //index for showing all teams
// app.get("/users/:user_id/teams", function(req,res) {
//   db.
// });

// //edit team
// app.get("/team/:id/edit", routeMiddleware.ensureCorrectUserForTeam, function(req,res) {
//   //render a page with the whole team, with option
//   db.Team.findById(req.params.id, function(err,team) {
//     if (err) {
//       console.log(err);
//       res.render("errors/404");
//     } else {
//       res.render("teams/edit", {team: team});
//     }
//   });
// });


// //Player ROUTES
// //team and player are both needed to give an accurate Post assessment
// //
// app.get("/users/:user_id/teams/:id", function(req,res) {

// });

app.get("*", function(req,res) {
  res.render("errors/404");
});

app.listen(process.env.PORT || 3000);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
