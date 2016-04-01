var mongoose = require('mongoose');
    mongoose.set('debug', true);

var playerSchema = new mongoose.Schema ({
                        name: {type: String, required: true},
                        image: String,
                      });

var Player = mongoose.model('Player', playerSchema);

module.exports = Player;