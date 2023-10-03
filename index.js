const express = require("express");
const bodyParser = require("body-parser")
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

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
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

process.on('SIGINT', ()=> {
  server.close(()=>{
    db.close(()=> {
      process.exit(0);
    });
  });
})