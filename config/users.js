const Datastore = require("gray-nedb"); 
const db = new Datastore({ filename: "users.db", autoload: true });

module.exports = db;

