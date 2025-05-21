const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema (
    {
        title: {
            type: String,
            required: false,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        admins: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        posts: [{
            type: mongoose.Schema.Types.ObjectId,
        }]
    }, { timestamps: true }
)

function autoPopulatePosts(next) {
    this.populate({
        path: 'posts',
        populate: {
            path: 'replies'
        }
    });
    next();
}

postSchema
    .pre('findOne', autoPopulateReplies)
    .pre('find', autoPopulateReplies);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;