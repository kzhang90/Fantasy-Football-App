var mongoose = require('mongoose');
var date = new Date();
var dateComment = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substr(2,2);

mongoose.set('debug', true);

var playerSchema = new mongoose.Schema ({
                        name: {type: String, required: true},
                        image: String,
                        author: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "User"
                        },
                        teams: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "Team"
                        },
                      });

playerSchema.pre("remove", function(next) {
  User.remove({player: this._id}).exec();
  Team.remove({player: this._id}).exec();
  next();
});

var Player = mongoose.model("Player", playerSchema);
module.exports = Player;