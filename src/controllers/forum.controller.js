const Forum = require('../models/forum.model');
const User = require('../models/user.model')
const baseResponse = require('../utils/baseResponse.util');

exports.createForum = async (req, res) => {
    try {
        const forumData = {
            title: req.body.title || "",
            description: req.body.description || null,
            password: req.body.password || null,
            owner: req.body.owner,
            admins: req.body.owner,
            users: req.body.owner
        };

        const forum = new Forum(forumData);
        await forum.save();

        const user = await User.findByIdAndUpdate(req.body.owner, { $push: { forums: forum._id } })
        console.log(user);

        baseResponse(
            res,
            true,
            200,
            "Forum created successfully",
            forum
        );
    } catch (error) {
        baseResponse(
            res,
            false,
            500,
            error.message || "Failed to create forum"
        );
    }
};

exports.getForums = async (req, res) => {
    try {
        const forums = await Forum.find();
        baseResponse(
            res,
            true,
            200,
            "Get all forums.",
            forums
        )
    } catch (error) {
        baseResponse (
            res,
            true,
            500,
            error.message || "Failed to get posts."
        );
    }
}

exports.getForumsForUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
                                .populate("forums");
        console.log(user);
        if (!user) {
            return baseResponse(
                res,
                false,
                400,
                "Invalid user ID."
            )
        }
            
        baseResponse(
            res,
            true,
            200,
            "Get user forums success.",
            user.forums
        )
    } catch (error) {
        baseResponse(
            res,
            false,
            500,
            "Get forums failed: " + error.message
        );
        console.log(`Error Message: ${error.message}`);
    }
}
