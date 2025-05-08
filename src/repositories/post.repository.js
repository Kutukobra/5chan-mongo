const db = require('../database/pg.database');
const baseResponse = require('../utils/baseResponse.util');

exports.createPost = async (post) => {
    const text = "INSERT INTO posts (content, image_url, creator_id, parent_id)\
                    VALUES ($1, $2, $3, $4)\
                    RETURNING *"
    const data = await db.query(
        text,
        [post.content, post.path, post.creator_id, post.parent_id]
    );
    return data.rows[0];
};

exports.getPosts = async () => {
    const data = await db.query(
        "SELECT * FROM posts WHERE parent_id = '00000000-0000-0000-0000-000000000000' ORDER BY created_at DESC",
    );
    return data.rows;
};

exports.getReplies = async (id) => {
    const data = await db.query(
        "SELECT * FROM posts WHERE parent_id = $1 ORDER BY created_at ASC",
        [id]
    );
    return data.rows;
};

exports.deletePost = async (id, creator_id) => {
    const data = await db.query(
        "DELETE FROM posts WHERE id = $1 AND creator_id = $2",
        [id, creator_id] 
    );
    return data.rows[0];
}