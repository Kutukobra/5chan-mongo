const Post = require('../models/post.model');
const baseResponse = require('../utils/baseResponse.util');

exports.createPost = async (req, res) => {
    try {
        const postData = {
            text: req.body.text || "",
            image_url: req.file ? req.file.path : null,
            owner: req.body.owner || null,
            topic: req.body.topic || null
        };

        const post = new Post(postData);
        await post.save();

        // If this is a reply, update the parent post's replies array
        if (req.body.parent_id) {
            const parentPost = await Post.findById(req.body.parent_id);
            if (parentPost) {
                parentPost.replies.push(post._id);
                await parentPost.save();
            }
        }

        baseResponse(
            res,
            true,
            200,
            "Post created successfully",
            post
        );
    } catch (error) {
        baseResponse(
            res,
            false,
            500,
            error.message || "Failed to create post"
        );
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find();
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