var mongoose = require('mongoose');
var date = new Date();
var dateComment = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear().toString().substr(2,2);

mongoose.set('debug', true);

var postSchema = new mongoose.Schema ({
                        title: {type: String, required: true},
                        body: {type: String, required: true},
                        image: String,
                        comments: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "Comment"
                        },
                        team: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "Team"
                        },
                        author: {
                          type: mongoose.Schema.Types.ObjectId,
                          ref: "User"
                        }
                      });

postSchema.pre("remove", function(next) {
  Comment.remove({post: this._id}).exec();
  next();
});

var Post = mongoose.model("Post", postSchema);
module.exports = Post;