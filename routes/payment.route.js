var express = require('express');
var router = express.Router();
const checkAccessToken = require('../middleware/accessToken.mdw');
const checkRefreshToken = require('../middleware/refreshToken.mdw');
const paymentController = require('../controller/Payment.ctl');

// 1. Method : POST /payment/
//    Desc   : Create a new bill payment payment
//    Protect: Login, User
router.post('/paypal', paymentController.pay);

// 2. Method : GET /payment/
//    Desc   : Payment error
//    Protect: Login, User
router.get('/paypal/cancel', paymentController.cancel);

// 2. Method : GET /payment/
//    Desc   : Payment success
//    Protect: Login, User
router.get('/paypal/success', paymentController.success);

module.exports = router;
