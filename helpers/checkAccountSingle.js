require('dotenv').config();
const userModel = require('../model/Users.model');

const checkEmailExists = async (email) => {
    const user = await userModel.findOne({ email });
    if (user) {
        return user;
    } else {
        return null;
    }
};

const checkUserExists = async (username) => {
    const user = await userModel.findOne({ username: username });
    if (user) {
        return user;
    } else {
        return null;
    }
};

module.exports = { checkUserExists, checkEmailExists };
