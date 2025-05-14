const Post = require('../models/post.model');
const baseResponse = require('../utils/baseResponse.util');

exports.canDeletePost = async (req, res, next) => {
    if (!req.query.id) {
        return baseResponse(
            res,
            false,
            400,
            "Missing post id."
        );
    }

    try {
        const post = await Post.findById(req.query.id);
        if (!post) {
            return baseResponse(
                res,
                false,
                404,
                "Post not found"
            );
        }

        // If post has no owner, only admin can delete it
        if (!post.owner && req.user.role !== 'admin') {
            return baseResponse(
                res,
                false,
                403,
                "Only admins can delete anonymous posts"
            );
        }

        // If post has an owner, check if current user is owner or admin
        if (post.owner && post.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return baseResponse(
                res,
                false,
                403,
                "Not authorized to delete this post"
            );
        }

        req.post = post; // Pass the post to the next middleware
        next();
    } catch (error) {
        return baseResponse(
            res,
            false,
            500,
            error.message || "Error validating post ownership"
        );
    }
};

exports.canEditPost = async (req, res, next) => {
    if (!req.query.id) {
        return baseResponse(
            res,
            false,
            400,
            "Missing post id."
        );
    }

    try {
        const post = await Post.findById(req.query.id);
        if (!post) {
            return baseResponse(
                res,
                false,
                404,
                "Post not found"
            );
        }

        // Anonymous posts cannot be edited
        if (!post.owner) {
            return baseResponse(
                res,
                false,
                403,
                "Anonymous posts cannot be edited"
            );
        }

        // Only post owner can edit
        if (post.owner.toString() !== req.user.id) {
            return baseResponse(
                res,
                false,
                403,
                "Not authorized to edit this post"
            );
        }

        req.post = post;
        next();
    } catch (error) {
        return baseResponse(
            res,
            false,
            500,
            error.message || "Error validating post ownership"
        );
    }
};
