var mongoose = require("mongoose");
var Comment = require("./comment");
var date = new Date();
var datePost = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substr(2,2);

mongoose.set("debug", true);

var tradeSchema = new mongoose.Schema ({
                      title: {type: String, required: true},
                      comments: [{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Comment"
                      }],
                      author: [{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "User"
                      }],
                      userTeam: [{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "Team"
                      }],
                      date: {type: String, default: datePost}

});

tradeSchema.pre("remove", function(next) {
  Comment.remove({comment: this._id}).exec();
  next();
});

var Trade = mongoose.model("Trade", tradeSchema);
module.exports = Trade;