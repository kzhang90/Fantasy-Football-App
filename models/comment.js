var mongoose = require('mongoose');
var date = new Date();
var dateComment = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substr(2,2);

mongoose.set('debug', true);

var commentSchema = new mongoose.Schema ({
                        body: {type: String, required: true},
                        date: {type: String, default: dateComment},
                        post: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "Post"
                        },
                        author: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "User"
                        }
                      });

var Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;