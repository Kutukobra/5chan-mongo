const Post = require('../models/post.model');
const User = require('../models/user.model');
const Forum = require('../models/forum.model');
const baseResponse = require('../utils/baseResponse.util');

exports.createPost = async (req, res) => {
    try {
        const postData = {
            text: req.body.text || "",
            image_url: req.file ? req.file.path : null,
            owner: req.body.owner || null,
            parent_id: req.body.parent_id || null,
            forum: req.body.parent_id || null
        };

        console.log(postData);

        const post = new Post(postData);
        await post.save();

        if (post.parent_id) {
            await Post.findOneAndUpdate(
                { _id: post.parent_id },
                { $push: { replies: post._id } }
            );
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

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('owner');
        baseResponse(
            res,
            true,
            200,
            "Post found",
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

exports.getPostsForUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        const posts = await Post.find({
            $or: [{forum:  { $in: user.forums }}, {forum: null, parent_id: null}]
        }).populate({
            path: 'owner',
            select: 'username _id'
        }).sort({ createdAt: -1 });
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
            false,
            500,
            error.message || "Failed to get posts."
        );
    }
}

exports.getPublicPosts = async (req, res) => {
    try {
        const posts = await Post.find({ forum: null, parent_id: null })
            .populate({
                path: 'owner',
                select: 'username _id'
            })
            .populate({
                path: 'replies',
                populate: {
                    path: 'owner',
                    select: 'username _id'
                }
            }).sort({ createdAt: -1 });

        baseResponse(
            res,
            true,
            200,
            "Get all public posts.",
            posts
        );
    } catch (error) {
        baseResponse(
            res,
            false,
            500,
            error.message || "Failed to get public posts."
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
        const id = req.query.id; // Get id directly from query
        const userId = req.user.id;

        const post = await Post.findById(id);
        if (!post) {
            return baseResponse(res, false, 404, "Post not found.");
        }

        if (!post.forum) {
            if (post.owner.toString() !== userId) {
                return baseResponse(res, false, 403, "Invalid privilege (not owner)");
            }
        } else {
            const forum = await Forum.findById(post.forum);
            const isAdmin = forum?.admins.some(adminId => adminId.toString() === userId);
            const isOwner = post.owner.toString() === userId;

            console.log(post.owner.toString(), userId, isOwner);

            if (!isOwner && !isAdmin) {
                return baseResponse(res, false, 403, "Invalid privilege");
            }
        }

        await Post.findByIdAndDelete(id);

        baseResponse(res, true, 200, "Post deleted successfully", post);
    } catch (error) {
        baseResponse(res, false, 500, error.message || "Failed to delete post");
    }
};
