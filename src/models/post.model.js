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
        replies: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post"
        }]
    }, { timestamps: true }
)

const autoPopulateReplies = (next) => {
    this.populate('replies');
    next();
}

postSchema
    .pre('findOne', autoPopulateReplies)
    .pre('find', autoPopulateReplies);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;