const express = require('express');
const router = express.Router();
const userController = require('./../controllers/user.controller');
const attach = require('./../utils/upload/upload');

router.route('/print')
    .get(userController.printCard);


router.route('/upload-card-image')
    .post(attach.uploadCardImage.single('File'), userController.cardImageUploaded)

// router.route('/').post()


module.exports = router;
