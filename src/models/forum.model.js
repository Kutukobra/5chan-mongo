const mongoose = require('mongoose');

const forumSchema = new mongoose.Schema (
    {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: false,
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

forumSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Only hash the password if it was modified

    try {
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
        this.password = await bcrypt.hash(this.password, salt); // Hash the password with the salt
        next();
    } catch (error) {
        next(error); // Pass the error to the next middleware if any
    }
})

const Forum = mongoose.model("Forum", forumSchema);
module.exports = Forum;