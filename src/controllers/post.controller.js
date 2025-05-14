const Post = require('../models/post.model');
const baseResponse = require('../utils/baseResponse.util');

exports.createPost = async (req, res) => {
    try {
        const postData = {
            text: req.body.text || "",
            image_url: req.file ? req.file.path : null,
            owner: req.body.owner || null
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

exports.deletePost = async (req, res) => {
    if (!req.query.id) {
        return baseResponse(
            res,
            false,
            400,
            "Missing post id."
        )
    }

    try {
        const post = await Post.findByIdAndDelete(req.query.id);
        baseResponse(
            res,
            true,
            200,
            "Post deleted.",
            post
        )
    } catch (error) {
        baseResponse (
            res,
            true,
            500,
            error.message || "Failed to delete post.",
            post
        );
    }
}