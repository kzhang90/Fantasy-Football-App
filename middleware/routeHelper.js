var db = require("../models");

var routeHelpers = {
  ensureLoggedIn: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      return next();
    }
    else {
     res.redirect('/login');
    }
  },

  ensureCorrectUserForPost: function(req, res, next) {
    db.Post.findById(req.params.id).populate('author').exec(function(err,post){
      console.log(post);
      if (post.author.id !== req.session.id) {
        res.redirect('/posts');
      }
      else {
       return next();
      }
    });
  },

  ensureCorrectUserForComment: function(req, res, next) {
    db.Comment.findById(req.params.id).populate('author').exec(function(err,comment){

      if (comment.author !== undefined && comment.author.id !== req.session.id) {
        res.redirect('/posts/'+ comment.post +'/comments');
      }
      else {
       return next();
      }
    });
  },

  ensureCorrectUserForTeam: function(req, res, next) {
    db.Team.findById(req.params.id).populate("author").exec(function(err,team) {
      if (team.author !== undefined && team.author.id !== req.session.id) {
        //still get to see this team
        //if the user is not the owner of the team, they cannot edit 
        res.redirect("/users/" + team.user + "/teams");
      } else {
        return next();
      }
    });
  },


  preventLoginSignup: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/posts');
    }
    else {
     return next();
    }
  }
};

module.exports = routeHelpers;