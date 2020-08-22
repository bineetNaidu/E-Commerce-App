const express = require("express");
const router = express.Router();
const ProductRepo = require("../../repository/products");
const productsNewTMP = require("../../views/admin/products/new");
const { validationResult } = require("express-validator");
const { requireTitle, requirePrice } = require("./validators");

router.get("/admin/products", (req, res) => {});
router.get("/admin/products/new", (req, res) => {
    res.send(productsNewTMP({}));
});
router.post("/admin/products/new", [requireTitle, requirePrice], (req, res) => {
    const errors = validationResult(req);
    console.log(errors);
    res.send("Submits");
});

module.exports = router;
