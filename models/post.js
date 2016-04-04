var mongoose = require('mongoose');
var postDate = new Date();

mongoose.set('debug', true);

var postSchema = new mongoose.Schema ({
                        created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
                        title: { type: String, required: true },
                        body: { type: String, required: true },
                        date: { type: Date, default: postDate},
                        media: String,
                        comments: [{
                          type: mongoose.Schema.Types.ObjectId,
                          ref: 'Comment'
                        }]
                      });

postSchema.pre('remove', function(next) {
  Comment.remove({post: this._id}).exec();
  next();
});

var Post = mongoose.model('Post', postSchema);
module.exports = Post;