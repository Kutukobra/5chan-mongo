const db = require('../database/pg.database');
const baseResponse = require('../utils/baseResponse.util');

exports.registerCreator = async (creator) => {
    const data = await db.query(
        "INSERT INTO creators (name, password) VALUES ($1, $2) RETURNING *",
        [creator.name, creator.password]
    )
    return data.rows[0];
};