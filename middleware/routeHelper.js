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
        res.redirect('/trades');
      }
      else {
       return next();
      }
    });
  },

  ensureCorrectUserForComment: function(req, res, next) {
    db.Comment.findById(req.params.id).populate('author').exec(function(err,comment){

      if (comment.author !== undefined && comment.author.id !== req.session.id) {
        res.redirect('/trades/'+ comment.trade.id +'/comments');
      }
      else {
       return next();
      }
    });
  },

  preventLoginSignup: function(req, res, next) {
    if (req.session.id !== null && req.session.id !== undefined) {
      res.redirect('/trades');
    }
    else {
     return next();
    }
  }
};

module.exports = routeHelpers;