var express = require('express');
const multer = require('multer');
var router = express.Router();
const UserController = require('../controller/Users.ctl');
const checkRole = require('../middleware/author.mdw');
const checkAccessToken = require('../middleware/accessToken.mdw');
const checkRefreshToken = require('../middleware/refreshToken.mdw');

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '.' + Math.round(Math.random() * 1e9) + '.user';
        const originalName = file.originalname;
        const extension = originalName.split('.').pop();
        const filename = `${uniqueSuffix}.${extension}`;
        cb(null, filename);
    },
});

const upload = multer({
    storage: storage,
});

// 1. Method :  GET /user
//    Desc   : Get all data from the database
//    Protect: Login, Admin
router.get('/', checkRefreshToken, checkAccessToken, checkRole, UserController.showAll);

// 2. Method : PUT /user/put/:id
//    Desc   : Change one or more User info
//    Protect: Login, User
router.put('/put/:_id', checkRefreshToken, checkAccessToken, upload.single('img'), UserController.changeUser);

// 3. Method : DELETE /user/delete/:_id
//    Desc   : Delete a user
//    Protect: Login, Admin
router.delete('/delete/:_id', checkRefreshToken, checkAccessToken, checkRole, UserController.deleteUser);

// 4. Method : GET /user/:_id
//    Desc   : Get one user from the database
//    Protect: Login
router.get('/:_id', checkRefreshToken, checkAccessToken, UserController.detail);

module.exports = router;
