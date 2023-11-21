var express = require('express');
var router = express.Router();
const OrderController = require('../controller/Orders.ctl');
const checkRole = require('../middleware/author.mdw');
const checkAccessToken = require('../middleware/accessToken.mdw');
const checkRefreshToken = require('../middleware/refreshToken.mdw');

// 1. Method : GET /order/
//    Desc   : Get all data from the database
//    Protect: Login, Admin
router.get('/', checkRefreshToken, checkAccessToken, checkRole, OrderController.showAll);

// 2. Method : POST /order/
//    Desc   : Create a new order
//    Protect: Login, User
router.post('/post', checkRefreshToken, checkAccessToken, OrderController.createOder);

// 3. Method : PUT /order/
//    Desc   : Change one or more order order
//    Protect: Login, Admin, USER
router.put('/put/:_id', checkRefreshToken, checkAccessToken, OrderController.changeOder);

// 4. Method : DELETE /order/delete/:_id
//    Desc   : Delete a order
//    Protect: Login, Admin
router.delete('/delete/:_id', checkRefreshToken, checkAccessToken, OrderController.deleteOrder);

// 5. Method : GET /order/:_id
//    Desc   : Get one order from the database
//    Protect: Login
router.get('/:_id', checkRefreshToken, checkAccessToken, OrderController.detail);

// 5. Method : GET /order/user/:_id
//    Desc   : Get one order from the database
//    Protect: Login
router.get('/user/:_id', checkRefreshToken, checkAccessToken, OrderController.detailUser);

module.exports = router;
