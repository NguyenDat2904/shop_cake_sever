var express = require('express');
var router = express.Router();
const CartController = require('../controller/Carts.ctl');
const checkAccessToken = require('../middleware/accessToken.mdw');
const checkRefreshToken = require('../middleware/refreshToken.mdw');

// 1. Method : GET /cart/
//    Desc   : Get all data from the database
//    Protect: Login
router.get('/user/:_id', checkRefreshToken, checkAccessToken, CartController.showAll);

// 2. Method : POST /cart/
//    Desc   : Create a new cart
//    Protect: Login, User
router.post('/post/:_id', checkRefreshToken, checkAccessToken, CartController.createCart);

// 3. Method : PUT /cart/
//    Desc   : Change one or more cart
//    Protect: Login,  USER
router.put('/put/:_id', checkRefreshToken, checkAccessToken, CartController.changeCart);

// 4. Method : DELETE /cart/delete/:_id
//    Desc   : Delete a cart
//    Protect: Login, Admin
router.delete('/delete/:_id',  CartController.deleteCart);

// 5. Method : GET /cart/:_id
//    Desc   : Get one cart from the database
//    Protect: Login
router.get('/:_id', checkRefreshToken, checkAccessToken, CartController.detail);

module.exports = router;
