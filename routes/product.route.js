var express = require('express');
const multer = require('multer');
var router = express.Router();
const checkRole = require('../middleware/author.mdw');
const checkAccessToken = require('../middleware/accessToken.mdw');
const checkRefreshToken = require('../middleware/refreshToken.mdw');
const ProductController = require('../controller/Products.ctl');

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '.' + Math.round(Math.random() * 1e9) + '.product';
        const originalName = file.originalname;
        const extension = originalName.split('.').pop();
        const filename = `${uniqueSuffix}.${extension}`;
        cb(null, filename);
    },
});

const upload = multer({
    storage: storage,
});

// 1. Method :  GET /product
//    Desc   : Get all data from the database
//    Protect: None
router.get('/', ProductController.showAll);

// 2. Method :  POST /product/post
//    Desc   : Post one data form  to the database
//    Protect: Login, Admin
router.post(
    '/post',
    checkRefreshToken,
    checkAccessToken,
    checkRole,
    upload.single('product'),
    ProductController.postProduct,
);

/* 3. Method : PUT /product/put/:_id */
//    Desc   : Change info about the product
//    Protect: Login, Admin
router.put(
    '/put/:_id',
    upload.single('product'),
    checkRefreshToken,
    checkAccessToken,
    checkRole,
    ProductController.changeProduct,
);

/* 4. Method : DELETE /product/delete/:_id */
//    Desc   : Delete a product
//    Protect: Login, Admin
router.delete('/delete/:_id', checkRefreshToken, checkAccessToken, checkRole, ProductController.deleteProduct);

/* 5. Method : GET /product/:_id */
//    Desc   : GET a product
//    Protect: none
router.get('/:_id', ProductController.detail);

module.exports = router;
