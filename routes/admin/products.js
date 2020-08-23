const express = require("express");
const router = express.Router();
const ProductRepo = require("../../repository/products");
const productsNewTMP = require("../../views/admin/products/new");
const { validationResult } = require("express-validator");
const { requireTitle, requirePrice } = require("./validators");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const { handleErrors, adminAuth } = require("./middlewares");
const productIndexTMP = require("../../views/admin/products/index");
const producEditTMP = require("../../views/admin/products/edit");
const { Router } = require("express");

router.get("/admin/products", adminAuth, async (req, res) => {
    const products = await ProductRepo.getAll();
    res.send(productIndexTMP({ products }));
});
router.get("/admin/products/new", adminAuth, (req, res) => {
    res.send(productsNewTMP({}));
});
router.post(
    "/admin/products/new",
    adminAuth,
    upload.single("image"),
    [requireTitle, requirePrice],
    handleErrors(productsNewTMP),
    async (req, res) => {
        try {
            const image = req.file.buffer.toString("base64");
            const { title, price } = req.body;
            await ProductRepo.create({ title, price, image });

            res.redirect("/admin/products");
        } catch (error) {
            console.log(error.message);
        }
    }
);

router.get("/admin/products/:id/edit", adminAuth, async (req, res) => {
    let product = await ProductRepo.getOneBy({ id: req.params.id });
    if (!product) return res.send("Product not found");
    res.send(producEditTMP({ product }));
});

router.post(
    "/admin/products/:id/edit",
    adminAuth,
    upload.single("image"),
    [requireTitle, requirePrice],
    handleErrors(producEditTMP),
    async (req, res) => {
        const changes = req.body;

        if (req.file) {
            changes.image = req.file.buffer.toString("base64");
        }
        try {
            await ProductRepo.update(req.params.id, changes);
        } catch (err) {
            return res.send("Could not find item");
        }

        res.redirect("/admin/products");
    }
);

module.exports = router;
