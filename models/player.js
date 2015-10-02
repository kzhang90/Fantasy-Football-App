var mongoose = require('mongoose');
var date = new Date();
var dateComment = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substr(2,2);

mongoose.set('debug', true);

var playerSchema = new mongoose.Schema ({
                        first: {type: String, required: true},
                        last: {type: String, required: true},
                        trades: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "Trade"
                        },
                        owners: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "User"
                        },
                        teams: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "Team"
                        }
                      });

var Player = mongoose.model("Player", playerSchema);
module.exports = Player;