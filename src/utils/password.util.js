require('dotenv').config();
const bcrypt = require('bcrypt');

const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS);

exports.hashPassword = async (password) => {
    return bcrypt.hash(password, saltRounds);
}

exports.comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

