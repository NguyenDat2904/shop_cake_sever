var express = require('express');
var router = express.Router();

const AuthController = require('../controller/Auth.ctl');

// 1. Method :  POST /auth/verify
//    Desc   : Verify Owner Email when Register
router.post('/verify', AuthController.verify);

// 2. Method :  POST /auth/register
//    Desc : Register a new account
router.post('/register', AuthController.register);

// 3. Method : POST /auth/login
//    Desc : Login to an existing account
router.post('/login', AuthController.login);

// 4. Method : POST /auth/security
//    Desc : Verify Owner Email when Forgot Password
router.post('/security', AuthController.security);

// 5. Method : PATCH /auth/forgot
//    Desc : Change Password when Forgot Password
router.patch('/forgot', AuthController.forgot);

// 6. Method : PATCH /auth/:_id/change-password
//    Desc : Change Password
router.patch('/:_id/change-password', AuthController.changePassword);

// 7. Method : PATCH /auth/logout/:_id
//    Desc : LOGOUT
router.patch('/logout/:_id', AuthController.logout);

module.exports = router;
