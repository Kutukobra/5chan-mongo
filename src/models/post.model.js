const mongoose = require('mongoose');

const postSchema = new mongoose.Schema (
    {
        text: {
            type: String,
            required: false,
        },
        image_url: {
            type: String,
            required: false,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        parent_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: false,
        },
        replies: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }],
        forum: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Forum",
            required: false
        }
    }, { timestamps: true }
)

function autoPopulateReplies(next) {
    this.populate({
        path: 'replies',
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