const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema (
    {
        title: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: false,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        admins: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }],
        users: [{
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

forumSchema
    .pre('findOne', autoPopulatePosts);

const Forum = mongoose.model("Forum", forumSchema);
module.exports = Forum;