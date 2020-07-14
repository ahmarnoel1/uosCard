var multer = require('multer');
var path = require('path');
var config = require('../../config/appConfig');
var chance = require('chance')();

module.exports = {
    uploadCardImage: multer({
        storage: multer.diskStorage({
            destination: config.ATTACHMENT.PATH_UPLOADED_IMAGES,
            filename: function (req, file, cb) {
                cb(null, chance.guid() + '-' + Date.now() + path.extname(file.originalname));
            }
        }),
        limits: {
            fileSize: config.MAX_UPLOAD_FILE_SIZE
        }
    })
};
