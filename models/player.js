var mongoose = require('mongoose');
    mongoose.set('debug', true);

var playerSchema = new mongoose.Schema ({
                        created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
                        name: {type: String, required: true},
                        image: String,
                      });

var Player = mongoose.model('Player', playerSchema);

module.exports = Player;