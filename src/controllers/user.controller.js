const baseResponse = require('../utils/baseResponse.util');
const User = require('../models/user.model');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = new User({ username: username, password: password });
        await user.save();

        baseResponse(
            res,
            true,
            200,
            "Register success.",
            user
        )            
    } catch (err) {
        baseResponse(
            res,
            false,
            "Register failed: " + err.message
        );
        console.log(`Error Message: ${err.message}`);
    }
}

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
            200,
            "Login success.",
            user
        );
    } catch (err) {
        baseResponse(
            res,
            false,
            400,
            "Login failed: " + err.message
        );
        console.log(`Error Message: ${err.message}`);
    }
}