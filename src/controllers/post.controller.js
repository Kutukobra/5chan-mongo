const postRepository = require('../repositories/post.repository');
const baseResponse = require('../utils/baseResponse.util');

let lastContent = "";

exports.createPost = async (req, res) => {
    console.log(lastContent);
    if (!req.body.content && !req.file) {
        return baseResponse(
            res,
            false,
            400,
            "Empty post error."
        )
    }

    if ((req.body.content || req.body.content != "") && req.body.content == lastContent) {
        return baseResponse (
            res,
            true,
            200,
            "Post created.",
            {
                id: "89617b10-5663-412e-81a7-4226dd97961b",
                content: lastContent,
                image_url: null,
                created_at: "2025-05-05T15:22:18.423Z",
                creator_id: "00000000-0000-0000-0000-000000000000",
                parent_id: "00000000-0000-0000-0000-000000000000"
            }
        );
    }

    if (!req.body.parent_id) {
        req.body.parent_id = "00000000-0000-0000-0000-000000000000";
    }

    if (!req.body.creator_id) {
        req.body.creator_id = "00000000-0000-0000-0000-000000000000";
    }

    try {
        const post = await postRepository.createPost({...req.body, ...req.file});
        baseResponse (
            res,
            true,
            200,
            "Post created.",
            post
        );
        lastContent = post.content;
    } catch (error) {
        baseResponse (
            res,
            true,
            500,
            error.message || "Failed to create post."
        );
    }
};

exports.getPosts = async (req, res) => {
    try {
        const posts = await postRepository.getPosts();
        baseResponse(
            res,
            true,
            200,
            "Get all posts.",
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

exports.getReplies = async (req, res) => {
    try {
        const replies = await postRepository.getReplies(req.params.id);
        baseResponse(
            res,
            true,
            200,
            "Get all replies.",
            replies
        )
    } catch (error) {
        baseResponse (
            res,
            true,
            500,
            error.message || "Failed to get replies."
        );
    }
}

exports.deletePost = async (req, res) => {
    if (!req.query.id || !req.query.creator_id) {
        return baseResponse(
            res,
            false,
            400,
            "Missing post id or creator id."
        )
    }

    try {
        const post = await postRepository.deletePost(req.query.id, req.query.creator_id);
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