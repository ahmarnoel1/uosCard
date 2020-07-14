

const path = 'private/attachments/';
const date = require('moment-timezone')();
const dir = date.year() + "/" + date.format('MM');

module.exports = {
    SERVER_PORT: process.env.APPLICATION_PORT || 9001,
    API_NAME: 'SU CARD API',
    PROJECT_NAME: process.env.PROJECT_NAME || 'SU CARD',
    APP_URL: process.env.APP_URL || 'http://localhost:4200/#',
    BASE_URL: process.env.BASE_URL || 'http://localhost:4200',
    ATTACHMENT: {
        PATH_UPLOADED_IMAGES: `${path}card-images/${dir}/`
    },
    MAX_UPLOAD_FILE_SIZE: 25 * 1024 * 1024
    
}
