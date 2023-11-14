var express = require('express');
var router = express.Router();
const ContactController = require('../controller/Contacts.ctl');

// 1. Method : GET /contact/
//    Desc   : Get all data from the database
//    Protect: None
router.get('/', ContactController.showAll);

// 2. Method : POST /contact/
//    Desc   : Create a new contact
//    Protect: Login, User
router.post('/post', ContactController.createContact);

// 3. Method : DELETE /contact/delete/:_id
//    Desc   : Delete a contact
//    Protect: None
router.delete('/delete/:_id', ContactController.deleteContact);

// 4. Method : GET /contact/:_id
//    Desc   : Get one contact from the database
//    Protect: None
router.get('/:_id', ContactController.detail);

module.exports = router;
