const express = require("express");
const cartApp = express();
const db = require("../db/database");

const createCart = db.prepare("INSERT INTO cart (shipping, confirmation) VALUES (?, ?)")
const getCart = db.prepare('SELECT * FROM cart WHERE id = ?')
const getCartItems = db.prepare(`SELECT * from cart_item where cart_id = ?`);
const deleteCart = db.prepare("DELETE from cart where id = ?");
const deleteCartItems = db.prepare("DELETE from cart_item where cart_id = ?")

cartApp.get("/:id", (req, res)=> {
    console.log("CART GET: ", req.url, req.params, req.body);
    const cartId = req.params.id;

    try {
        const row = getCart.get(cartId)
    
        if(!row) {
            return res.status(404).json({error: `Item not found`})
        }

        const cartItems = getCartItems.all(cartId);

        if(!cartItems) {
            return res.status(500).json({error: `Item not found`})
        }

        const data = {
            id:row.id,
            shipping:row.shipping,
            confirmation:row.confirmation,
            items:cartItems
        };

        return res.status(200).json(data);
    } catch(err) {
        console.error('Error retrieving item:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

cartApp.post("/", (req, res) => {
    console.log("CART POST: ", req.url, req.params, req.body);
    const shipping = req.body.shipping ? req.body.shipping : "";
    const confirmation = req.body.confirmation ? req.body.confirmation : "";
    
    try {
        const cartInfo = createCart.run(shipping, confirmation)
    
        console.log(`Created CART: ${cartInfo.lastInsertRowid}`);
        const cart = getCart.get(cartInfo.lastInsertRowid);

        res.status(201).json(cart);
    } catch(err) {
        console.error("Error retrieving item:", err.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


cartApp.delete('/:cartId/checkout', (req, res)=> {
    console.log("CART DELETE: ", req.url, req.params, req.body);
    const cartId = req.params.cartId;
    try {
        deleteCartItems.run(cartId)
        deleteCart.run(cartId)
    
        res.status(204).send();
    } catch(err) {
        console.error(`Error deleting cart with id: ${cartId} : `, err.message);
        res.status(500).json({error: "Internal Server Error"});
    }
})

module.exports = cartApp;