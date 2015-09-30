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
      console.log(post)
      if (post.author.id != req.session.id) {
        res.redirect('/posts');
      }
      else {
       return next();
      }
    });
  },

  ensureCorrectUserForComment: function(req, res, next) {
    db.Comment.findById(req.params.id).populate('author').exec(function(err,comment){
      console.log(comment)
      if (comment.author != undefined && comment.author.id != req.session.id) {
        res.redirect('/posts/'+ comment.post +'/comments');
      }
      else {
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