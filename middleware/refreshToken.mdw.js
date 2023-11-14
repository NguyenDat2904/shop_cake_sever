require('dotenv').config();
const jwt = require('jsonwebtoken');
const usersModel = require('../model/Users.model');

async function refreshToken(req, res, next) {
    try {
        const refreshToken = req.headers['refresh_token'];
        // Refresh token does not exist
        if (!refreshToken) {
            res.status(400).json({ error: 'Refresh token does not exist' });
            return;
        }
        jwt.verify(refreshToken, process.env.SECRET_KEY, async (err, user) => {
            if (err) {
                // Refresh token is not valid
                if (err.name === 'TokenExpiredError') {
                    const userToken = await usersModel.findById(user._id);
                    if (userToken) {
                        // Delete token => User must login again
                        userToken.refreshToken = undefined;
                        await userToken.save();
                    }
                }
                res.status(400).json({ error: 'Refresh token is not valid' });
                return;
            } else {
                // Refresh token is valid
                next();
            }
        });
    } catch (error) {
        res.status(400).json({ error: 'Refresh token is not valid' });
    }
}
module.exports = refreshToken;
