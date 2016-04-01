var mongoose = require('mongoose');

mongoose.set('debug', true);

var teamSchema = new mongoose.Schema ({
                        players: [{
                          type: mongoose.Schema.Types.ObjectId,
                          ref: 'Player'
                        }],
                        posts: [{
                          type: mongoose.Schema.Types.ObjectId,
                          ref: 'Post'
                        }]
                      });

teamSchema.pre('remove', function(next) {
  Player.remove({team: this._id}).exec();
  Post.remove({team: this._id}).exec();
  next();
});

var Team = mongoose.model('Team', teamSchema);
module.exports = Team;