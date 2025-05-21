const Post = require('../models/forum.model');
const baseResponse = require('../utils/baseResponse.util');

exports.createForum = async (req, res) => {
    try {
        const forumData = {
            title: req.body.title || "",
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
            post
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
            "Get all posts and replies.",
            posts
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

exports.getPostByTopic = async (req, res) => {
    try {
        const posts = await Post.find({ topic: req.params.topic });
        baseResponse(
            res,
            true,
            200,
            "Get all posts and replies.",
            posts
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

exports.editPost = async (req, res) => {
    try {
        const post = req.post; // Get post from middleware
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        
        if (post.createdAt < twoHoursAgo) {
            return baseResponse(
                res, 
                false, 
                403, 
                "You can only edit posts within 2 hours of creation"
            );
        }

        post.text = req.body.text || post.text;
        await post.save();

        baseResponse(
            res, 
            true, 
            200, 
            "Post updated successfully",
            post
        );
    } catch (error) {
        baseResponse(
            res, 
            false, 
            500, 
            error.message || "Failed to update post"
        );
    }
};

exports.deletePost = async (req, res) => {
    try {
        await Post.findByIdAndDelete(req.query.id);
        
        baseResponse(
            res,
            true,
            200,
            "Post deleted successfully",
            req.post
        );
    } catch (error) {
        baseResponse(
            res,
            false,
            500,
            error.message || "Failed to delete post"
        );
    }
}