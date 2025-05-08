const baseResponse = require('../utils/baseResponse.util');
const User = require('../models/user.model');

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const user = await User.findOne({ username: username });
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid Password");

        baseResponse(
            res,
            true,
            200
        )
        res.status(200).json({ success: true, message: "Found user", data: user });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
        console.log(`Error Message: ${err.message}`);
    }
}

exports.registerCreator = async (req, res) => {
    if (!req.query.name || !req.query.password) {
        return baseResponse(
            res,
            false,
            400,
            "No username of password given."
        )
    }

    try {
        req.query.password = await password.hashPassword(req.query.password);

        const creator = await creatorRepository.registerCreator(req.query);
        
        baseResponse(
            res,
            true,
            200,
            "Creator created.",
            creator
        );
    } catch (error) {
        if (error.constraint === 'creators_name_key') {
            return baseResponse(
                res,
                false,
                400,
                "Username taken"
            );
        }
        
        baseResponse(
            res,
            false,
            500,
            error.message || "Failed to create creator"
        )
    }
};