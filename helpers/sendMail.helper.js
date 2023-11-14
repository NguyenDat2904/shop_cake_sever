require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        // type: 'OAuth2',
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    },
});

module.exports = { transporter };
