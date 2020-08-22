const express = require("express");
const router = express.Router();
const ProductRepo = require("../../repository/products");
const productsNewTMP = require("../../views/admin/products/new");
const { validationResult } = require("express-validator");
const { requireTitle, requirePrice } = require("./validators");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

router.get("/admin/products", (req, res) => {});
router.get("/admin/products/new", (req, res) => {
    res.send(productsNewTMP({}));
});
router.post(
    "/admin/products/new",
    upload.single("image"),
    [requireTitle, requirePrice],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.send(productsNewTMP({ errors }));
        }

        const image = req.file.buffer.toString("base64");
        const { title, price } = req.body;
        await ProductRepo.create({ title, price, image });

        res.send("Submits");
    }
);

module.exports = router;
