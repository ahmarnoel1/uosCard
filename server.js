const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const appConfig = require('./config/appConfig');
// Configuring the database
const dbConfig = require('./config/config_database.config');
const mongoose = require('mongoose');
// create express app
const app = express();
/* -------------------------- setting the time zone ------------------------- */
const moment = require('moment-timezone');
moment.tz.setDefault(process.env.TZ || "Asia/Karachi");
// Now it is recommended that we should init dates using moment
/* ----------------------------------- -- ----------------------------------- */
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.header("origin"));
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma, apikey");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

/* -------------------------------------------------------------------------- */
/*                                Rate limiting                               */
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
    skip: req => req.method === 'OPTIONS',
    windowMs: 1 * 60 * 1000, // 1 minute
    max: process.env.REQUESTS_PER_MINUTE || 350, // limit each IP to specified requests per windowMs,
    message: { message: `Your IP has been temporarily blocked due to too many requests`, message2: `Please try again later` },
    statusCode: 429
});
app.use(limiter);

/* -------------------------------------------------------------------------- */

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

routing();


// all api routes
function routing() {
    app.use('/api/v1/users', require('./routes/users.routes'));

}

// listen for requests
app.listen(process.env.PORT || appConfig.SERVER_PORT, () => {
    console.log(`> Hi! ${appConfig.API_NAME} Server is listening on port ${appConfig.SERVER_PORT}`);
});

/* ----- Apply Cool Compression Package For Static JS Bundles (angular) ----- */
app.use(require('compression')())
/* ------------------------------------ - ----------------------------------- */


app.use(require('express').static(path.join(__dirname, 'public/dist/su-admissions')));
app.use('/private/avatars', require('express').static(path.join(__dirname, 'private/avatars/')));

function connectDb() {

    console.log("> connection string: " + dbConfig.url);
    // Connecting to the database
    mongoose.connect(dbConfig.url, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }).then(async () => {
        console.log("> Successfully connected to the database: ", dbConfig.url);
        sharedController.seed();
        socketManager.connect(app, appConfig.SERVER_PORT);

        await require('./utils/backup/db-backup').registerDatabaseBackupScheduler();

    }).catch(err => {
        console.log('> Could not connect to the database', err);
        console.log(`> Retrying in 5 seconds`);
        setTimeout(() => {
            connectDb();
        }, 5000);
    });
}



errorHandler();

function errorHandler() {
    process.on('uncaughtException', function (err) {
        console.log('uncaughtException', err);
    });
    // global error handler
    app.use((error, req, res, next) => {
        console.log("> Gobal error handler says: ", error);
        res.status(406).send(error);
    });
    console.log(`> ${appConfig.API_NAME} Service: Global error handler registered`);
}
