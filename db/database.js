const Database = require("better-sqlite3");

// Promisify database operations
const db = new Database("./db/ecommerce.db", {
  verbose: console.log,
  fileMustExist: true
});

module.exports = db;