const baseResponse = require('../utils/baseResponse.util');
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt.util');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = new User({ username: username, password: password });
        await user.save();

        const token = generateToken({
            id: user._id,
            username: user.username,
            role: user.roles
        });

        baseResponse(
            res,
            true,
            200,
            "Register success.",
            { user, token }
        )            
    } catch (err) {
        baseResponse(
            res,
            false,
            400, 
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

        const token = generateToken({
            id: user._id,
            username: user.username,
            role: user.roles
        });

        baseResponse(
            res,
            true,
            200,
            "Login success.",
            { user, token }
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

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ username: req.params.username });
        if (!user) throw new Error("User not found");

        baseResponse(
            res,
            true,
            200,
            "User deleted successfully.",
            user
        );
    } catch (err) {
        baseResponse(
            res,
            false,
            400,
            "Delete failed: " + err.message
        );
        console.log(`Error Message: ${err.message}`);
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const { username } = req.body;

        const user = await User.findOne({ username: username });
        if (!user) throw new Error("User not found");

        await User.findByIdAndDelete(user._id);

        baseResponse(
            res,
            true,
            200,
            "User deleted.",
            user
        );
    } catch (err) {
    baseResponse(
        res,
        false,
        400,
        "Delete user failed: " + err.message
    );
    console.log(`Error Message: ${err.message}`);
    }
}