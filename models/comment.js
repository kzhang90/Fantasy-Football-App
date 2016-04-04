var mongoose = require('mongoose');
var commentDate = new Date();

    mongoose.set('debug', true);

var commentSchema = new mongoose.Schema ({
                        created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
                        body: { type: String, required: true },
                        date: { type: Date, default: commentDate }
                      });

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;