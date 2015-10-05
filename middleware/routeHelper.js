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

  ensureCorrectUserForTrade: function(req, res, next) {
    db.Trade.findById(req.params.id).populate('author').exec(function(err,trade){
      console.log(trade);
      if (trade.author.id != req.session.id) {
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
        //check this, 
        res.redirect('/posts/'+ comment.trade +'/comments');
      }
      else {
       return next();
      }
    });
  },

//check below
  ensureCorrectUserForTeam: function(req, res, next) {
    db.Team.findById(req.params.id).populate("author").exec(function(err,team) {
      if (team.author !== undefined && team.author.id !== req.session.id) {
        //still get to see this team
        //redirect to the trade id
        res.redirect("/users/" + team.author + "/team/");
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