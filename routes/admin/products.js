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
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.send(productsNewTMP({ errors }));
            }

            const image = req.file.buffer.toString("base64");
            const { title, price } = req.body;
            await ProductRepo.create({ title, price, image });

            res.redirect("/admin/products");
        } catch (error) {
            console.log(error.message);
        }
    }
);

module.exports = router;
