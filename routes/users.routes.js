const express = require('express');
const router = express.Router();
const userController = require('./../controllers/user.controller');


router.route('/print')
    .get(userController.printCard);



module.exports = router;
