require('dotenv').config();
const jwt = require('jsonwebtoken');

const generateToken = (user, time) => {
    const payload = { userId: user._id, role: user.role };
    const options = {
        expiresIn: time,
    };
    return jwt.sign(payload, process.env.SECRET_KEY, options);
};
module.exports = { generateToken };
