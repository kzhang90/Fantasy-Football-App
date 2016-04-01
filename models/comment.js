var mongoose = require('mongoose');
var commentDate = new Date();

    mongoose.set('debug', true);

var commentSchema = new mongoose.Schema ({
                        body: { type: String, required: true },
                        date: { type: Date, default: commentDate }
                      });

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;