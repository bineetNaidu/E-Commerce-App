const express = require("express");
const productsRepo = require("../repository/products");
const router = express.Router();
const productsIndexTMP = require("../views/products/");

router.get("/", async (req, res) => {
    const products = await productsRepo.getAll();
    res.send(productsIndexTMP({ products }));
});

module.exports = router;
