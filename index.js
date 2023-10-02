const express = require("express");
const app = express();

app.use(express.urlencoded());

// Import the database module
const db = require("./db/database");

// Import the routes
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const cartItemRoutes = require("./routes/cartItemRoutes");

// Use the routes
app.use("/btriangle/api/product", productRoutes);
app.use("/btriangle/api/cart", cartRoutes);
app.use("/btriangle/api/item", cartItemRoutes);

// Close the database when you're done (important)
const port = 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});