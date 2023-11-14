require('dotenv').config();
const jwt = require('jsonwebtoken');
const { generateToken } = require('../helpers/generateToken.helper');

const usersModel = require('../model/Users.model');

const accessToken = (req, res, next) => {
    const token = req.headers['authorization'];
    const refreshToken = req.headers['refresh_token'];

    if (!token) {
        res.status(400);
        res.status(400).json({ error: 'Invalid token' });
        return;
    }

    jwt.verify(token, process.env.SECRET_KEY, async (err, user) => {
        if (err) {
            // Invalid token
            if (err.name === 'TokenExpiredError') {
                try {
                    // Check if RefreshToken exists
                    const user = await usersModel.find({ refreshToken: refreshToken });
                    // RefreshToken exists
                    if (user) {
                        // Create a new accessToken and return it to the user
                        const accessToken = generateToken(user, '24h');
                        res.status(200).json({ accessToken });
                        return;
                    } else {
                        // RefreshToken not exists
                        res.status(400).json({ error: 'Invalid refresh token' });
                        return;
                    }
                } catch (error) {
                    res.status(400).json({ error: 'Invalid refresh token' });
                    return;
                }
            } else {
                // Token does not exist
                res.status(400).json({ error: 'Invalid token' });
                return;
            }
        } else {
            // Valid tokens
            req.user = user;
            next();
        }
    });
};
module.exports = accessToken;
