const sqlite3 = require("sqlite3").verbose();
const products = require("./products_list.json");

const db = new sqlite3.Database("ecommerce.db");

db.serialize(() => {
  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        description TEXT,
        image TEXT,
        price REAL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        confirmation TEXT,
        shipping TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS cart_item (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product INTEGER,
        quantity INTEGER,
        price REAL,
        cart_id INTEGER,
        FOREIGN KEY (cart_id) REFERENCES cart(id)
    )
  `);

  for (product of products) {
    db.run(
      `insert into products (name, description, image, price) values (?, ?, ?, ?)`,
      [product.name, product.description, product.image, product.price]
    );
  }

  db.close((err) => {
    if (err) {
      console.error("Error closing database:", err.message);
    } else {
      console.log("Database initialization complete.");
    }
  });
});
