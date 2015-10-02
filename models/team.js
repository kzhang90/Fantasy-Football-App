var mongoose = require('mongoose');
var date = new Date();
var dateComment = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substr(2,2);

mongoose.set('debug', true);

var teamSchema = new mongoose.Schema ({
                        author: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "User"
                        },
                        players: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "Player"
                        }
                      });

teamSchema.pre("remove", function(next) {
  Player.remove({player: this._id}).exec();
  next();
});

var Team = mongoose.model("Team", teamSchema);
module.exports = Team;