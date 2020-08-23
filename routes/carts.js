const express = require("express");
const cartsRepo = require("../repository/carts");
const productsRepo = require("../repository/products");
const router = express.Router();
const cartShowTMP = require("../views/carts/show");

router.post("/cart/products", async (req, res) => {
    try {
        let cart;
        // Figure out the cart!
        if (!req.session.cartId) {
            // We Dont have the cart, create one and store it on req.session.cardId
            cart = await cartsRepo.create({ items: [] });
            req.session.cartId = cart.id;
        } else {
            cart = await cartsRepo.getOne(req.session.cartId);
        }
        const existingItem = cart.items.find(
            (item) => item.id === req.body.productId
        );

        if (existingItem) {
            // increment the quantity and cart
            existingItem.quantity++;
        } else {
            // add new product id to items arr
            cart.items.push({ id: req.body.productId, quantity: 1 });
        }
        await cartsRepo.update(cart.id, {
            items: cart.items,
        });

        res.send("Product added to cart!");
    } catch (error) {
        console.log(error);
    }
});

router.get("/cart", async (req, res) => {
    if (!req.session.cartId) {
        return res.redirect("/");
    }

    const cart = await cartsRepo.getOne(req.session.cartId);

    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id);

        item.product = product;
    }
    res.send(cartShowTMP({ items: cart.items }));
});

module.exports = router;
