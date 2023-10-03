const express = require("express");
const productApp = express();
const db = require("../db/database");

const getProducts = db.prepare("SELECT * FROM products");

productApp.get("/", (req, res) => {
    console.log("PRODUCT GET: ", req.url, req.params, req.body);
    try {
        const products = getProducts.all();
        res.status(200).json(products);
    } catch(err) {
        console.error("Error querying products:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = productApp;