const Post = require('../models/forum.model');
const baseResponse = require('../utils/baseResponse.util');

exports.createForum = async (req, res) => {
    try {
        const forumData = {
            title: req.body.title || "",
            description: req.body.description,
            password: req.body.password,
            owner: req.body.owner,
            admins: [],
            posts: [],
        };

        const forum = new Forum(forumData);
        await forum.save();

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
        const forums = await Forum.find( {password: { $ne: null }} );
        baseResponse(
            res,
            true,
            200,
            "Get all posts and replies.",
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

exports.getForumsByUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
                                .populate("forums");
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
            400,
            "Login failed: " + err.message
        );
        console.log(`Error Message: ${err.message}`);
    }
}
