const express = require("express");
const itemApp = express();
const db = require("../db/database");

itemApp.use(express.urlencoded());

const insertItem = db.prepare('insert into cart_item (product, quantity, price, cart_id) values (?, ?, ?, ?)');
const getItem = db.prepare("SELECT * FROM cart_item where id = ?")
const updatedItem = db.prepare("UPDATE cart_item set quantity = ? WHERE id = ?")
const deleteItem = db.prepare("DELETE from cart_item where id = ?")

itemApp.post('/', (req, res)=> {
    console.log("ITEM POST: ", req.url, req.params, req.body)
    const product = parseInt(req.body.product)
    const quantity = parseInt(req.body.quantity)
    const price = parseFloat(req.body.price)
    const cart = parseInt(req.body.cart)

    try {
        const info = insertItem.run(product, quantity, price, cart)

        const item = getItem.get(info.lastInsertRowid)
        console.log(5, item);
        res.status(201).json(item); 
    } catch(err) {
        console.error("Error retrieving item:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

itemApp.patch('/:cartItemId', (req, res)=> {
    console.log("ITEM PATCH: ", req.url, req.params, req.body);
    try {
        updatedItem.run(req.body.quantity, req.params.cartItemId);
        res.status(200).json({message:"Quantity updated successfully!"});
    } catch(err) {
        console.error(`Error updating cart item with id: ${req.params.cartItemId} : `, err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

itemApp.delete('/:cartItemId', (req, res)=> {
    console.log("ITEM DELETE: ", req.url, req.params, req.body);
    try {
        deleteItem.run(req.params.cartItemId)
        res.status(204).send();
    } catch(err) {
        console.error(`Error deleting cart item with id: ${req.params.cartItemId} : `, err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
})

module.exports = itemApp;