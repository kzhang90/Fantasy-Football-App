var mongoose = require('mongoose');
    mongoose.connect( process.env.MONGOLAB_URI || "mongodb://localhost/fantasyfb");
    mongoose.set("debug", true);

module.exports.User = require('./user');
module.exports.Team = require('./team');
module.exports.Post = require("./post");
module.exports.Comment = require('./comment');
module.exports.Index = require('./index');


