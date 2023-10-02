const Database = require("better-sqlite3");

// Promisify database operations
const db = new Database("./ecommerce.db", {
  verbose: console.log,
  fileMustExist: true
});

// Close the database when done
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database closed.");
    }
    process.exit(0);
  });
});

module.exports = db;