const DB_NAME = "cardapp";
module.exports = {
    "url": process.env.DATABASE_URL || `mongodb://127.0.0.1:27017/${DB_NAME}`,
    DB_NAME
};