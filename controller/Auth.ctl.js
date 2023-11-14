require('dotenv').config();
const bcrypt = require('bcryptjs');
const { checkUserExists, checkEmailExists } = require('../helpers/checkAccountSingle');
const randomCode = require('../helpers/randomCode.helper');
const UserModel = require('../model/Users.model');
const { transporter } = require('../helpers/sendMail.helper');
const { generateToken } = require('../helpers/generateToken.helper');

const verificationCodes = {};
class AuthController {
    async verify(req, res) {
        try {
            const { username, email, name } = req.body;
            const verificationCode = randomCode(6);
            const checkUser = await checkUserExists(username);

            if (!!checkUser) {
                return res.status(400).json({ msg: 'User exists' });
            }

            // Form sending email
            const mailOptions = {
                from: `BUCKER SHOP <${process.env.USER_EMAIL}>`,
                to: `${email}`,
                subject: 'BUCKER SHOP',
                html: `
                <div  style = "font-family: 'Helvetica Neue', Helvetica, 'Lucida Grande', tahoma, verdana, arial, sans-serif, serif, EmojiFont;  font-size: 16px;line-height: 21px; color: rgb(20, 24, 35) ">
                    <div style = " border-bottom: solid 1px #e5e5e5; "></div>
                    <h1 style="font-size: 18px; line-height: 21px; font-weight: bold; color: rgb(20, 24, 35)">Your BUCKER SHOP authentication code</h1>
                    <p>Hello ${name}</p>
                    <p>Your authentication code is:</p>
                    <div style="display:inline-block; background-color: #f2f2f2; padding: 10px"><span style="font-size: 22px; line-height: 36px;letter-spacing: 5px; font-weight: bold; margin: 0 20px">${verificationCode}</span></div>
                    <p>To confirm your identity on <b>BUCKER SHOP</b>, We need to verify your email address. Paste this code into your browser. This is a one-time use code.</p>
                    <div>
                    <p>If you don't ask for any code, maybe someone is trying to create an account from your Email. <a href="#">You can visit here for support.</a> </p>
                    </div>
                    <p style="margin : 0;">Thank,</p>
                    <p style="margin-top : 0;">The Bucker Shop Security Team</p>
                    <div style = " border-bottom: solid 1px #e5e5e5; "></div>
                </div>
                `,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    // Error sending
                    return res.status(400).json({ error: 'Error sending authentication email' });
                } else {
                    // Success sending
                    verificationCodes[email] = verificationCode;
                    res.status(200).json({ message: 'Verification email has been sent', info: info.response });
                }
            });
        } catch (error) {
            return res.status(400).json({ message: 'Error sending email', error: error });
        }
    }

    async register(req, res) {
        try {
            const { name, username, phone, email, password, address, code } = req.body;
            const storedCode = verificationCodes[email];
            if (storedCode && storedCode !== code) {
                // Invalid auth code
                return res.status(400).json({ error: 'Invalid auth code' });
            }

            // Check User
            const checkUser = await checkUserExists(username);
            if (!!checkUser) {
                return res.status(400).json({ msg: 'User exists' });
            }
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            const newUser = new UserModel({
                username,
                name,
                email,
                phone,
                address,
                password: hashPassword,
                role: 'regular',
                refreshToken: '',
            });
            await newUser.save();
            res.status(200).json({ msg: 'Success Register' });
        } catch (error) {
            return res.status(400).json({ msg: 'Error Register new User', error: error });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            // Check username
            const checkUser = await checkUserExists(username);
            if (!checkUser) {
                return res.status(400).json({ msg: 'Username not found' });
            }
            // Check password
            const isPasswordValid = await bcrypt.compare(password, checkUser.password);
            if (!isPasswordValid) {
                return res.status(400).json({ msg: 'Password is not true' });
            }
            // Create a message JWT refreshToken
            const refreshToken = generateToken(checkUser, '720h');
            // Save the refreshToken to database
            checkUser.refreshToken = refreshToken;
            await checkUser.save();

            // Create a message JWT accessToken
            const accessToken = generateToken(checkUser, '24h');
            return res.json({
                _id: checkUser._id,
                role: checkUser.role,
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } catch (error) {
            return res.status(400).json({ msg: 'Login failed', error: error });
        }
    }

    async security(req, res) {
        try {
            const { email } = req.body;
            // Check User
            const checkUser = await checkEmailExists(email);
            if (!checkUser) {
                return res.status(400).json({ msg: 'Email not found' });
            }
            // Random Code
            const securityCode = randomCode(6);

            // Create a Form send to Email
            const mailOptions = {
                from: process.env.USER_EMAIL,
                to: `${email}`,
                subject: 'BUCKER SHOP',
                html: `
                <div  style = "font-family: 'Helvetica Neue', Helvetica, 'Lucida Grande', tahoma, verdana, arial, sans-serif, serif, EmojiFont;  font-size: 16px;line-height: 21px; color: rgb(20, 24, 35) ">
                    <div style = " border-bottom: solid 1px #e5e5e5; "></div>
                    <h1 style="font-size: 18px; line-height: 21px; font-weight: bold; color: rgb(20, 24, 35)">Your BUCKER SHOP security code</h1>
                    <p>Hello ${checkUser.name}</p>
                    <p>Your authentication code is:</p>
                    <div style="display:inline-block; background-color: #f2f2f2; padding: 10px"><span style="font-size: 22px; line-height: 36px;letter-spacing: 5px; font-weight: bold; margin: 0 20px">${securityCode}</span></div>
                    <p>To confirm your identity on <b>BUCKER SHOP</b>, We need to verify your email address. Paste this code into your browser. This is a one-time use code.</p>
                    <div>
                    <p>If you don't ask for any code, someone may be trying to access your account.<a href="#">You can change your password to protect your account.</a></p>
                    </div>
                    <p style="margin : 0;">Thank,</p>
                    <p style="margin-top : 0;">The BUCKER SHOP Security Team</p>
                    <div style = " border-bottom: solid 1px #e5e5e5; "></div>
                </div>
                `,
            };
            transporter.sendMail(mailOptions, async (error, info) => {
                if (error) {
                    // Error sending
                    return res.status(400).json({ error: 'Error sending authentication email' });
                } else {
                    // Success sending
                    checkUser.code_security = securityCode;
                    await checkUser.save();
                    res.status(200).json({ message: 'Verification email has been sent', info: info.response });
                }
            });
        } catch (error) {
            return res.status(400).json({ message: 'Error sending email', error: error });
        }
    }

    async forgot(req, res) {
        try {
            const { email, code, password } = req.body;
            // Check USER
            const checkUser = await checkEmailExists(email);
            // Check code
            if (checkUser.code_security !== code) {
                return res.status(400).json({ msg: 'Code not found' });
            }
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            checkUser.password = hashPassword;
            await checkUser.save();
            return res.status(200).json({ msg: 'Change Password successfully' });
        } catch (error) {
            return res.status(400).json({ msg: 'Change Password failed', error: error });
        }
    }
    async changePassword(req, res) {
        try {
            const { password, newPassword } = req.body;
            const id = req.params._id;

            // checkUser
            const user = await UserModel.findById({ _id: id });
            if (!user) {
                return res.status(400).json({ msg: 'User not found' });
            }
            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ msg: 'Password is not true' });
            }

            // Encode Password
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(newPassword, salt);

            // Change Password
            user.password = hashPassword;
            user.save();
            return res.status(200).json({ msg: 'Password changed' });
        } catch (error) {
            return res.status(400).json({ msg: 'Change Password Failed', error: error });
        }
    }

    async logout(req, res) {
        try {
            const id = req.params._id;
            // Check User
            const user = await UserModel.findById({ _id: id });
            if (!user) return res.status(400).json({ msg: 'User not found' });

            // Delete RefreshToken
            user.refreshToken = '';
            user.save();
            return res.status(200).json({ msg: 'Logout successfully' });
        } catch (error) {
            return res.status(400).json({ msg: 'Logout failed', error: error });
        }
    }
}
module.exports = new AuthController();
