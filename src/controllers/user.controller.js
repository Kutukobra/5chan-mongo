const baseResponse = require('../utils/baseResponse.util');
const User = require('../models/user.model');
const Forum = require('../models/forum.model');
const passwordUtil = require('../utils/password.util');
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

        const isMatch = await passwordUtil.comparePassword(password, user.password);
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

exports.joinForum = async (req, res) => {
    try {
        const { userId, forumId, password } = req.body;
        const user = await User.findById(userId);
        if  (!user) {
            return baseResponse(
                req,
                false,
                400,
                "User not found."
            )
        }

        const forum = await Forum.findById(forumId);
        if (!forum) {
            return baseResponse(
                req,
                false,
                400,
                "Forum not found."
            )
        }

        
        const isMatch = await passwordUtil.comparePassword(password, forum.password);
        if (!isMatch) 
            return baseResponse(
                req,
                false,
                400,
                "Wrong forum password."
            )

        user.forums.push(forumId);
        user.save();

        forum.users.push(userId);
        forum.save();

        baseResponse(
            req,
            true,
            200,
            "Forum joined.",
            forum
        )
    } catch (error) {
        baseResponse(
            res,
            false,
            400,
            "Forum join failed: " + err.message
        );
        console.log(`Error Message: ${err.message}`);
    }
}