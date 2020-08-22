const { check, validationResult } = require("express-validator");
const usersRepo = require("../../repository/users");

module.exports = {
    requireEmail: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .custom(async (email) => {
            const existingUser = await usersRepo.getOneBy({ email });
            if (existingUser) {
                throw new Error("Email in use");
            }
        }),

    requirePassword: check("password").trim().isLength({ min: 4, max: 20 }),

    checkPassword: check("passwordConfirmation")
        .trim()
        .isLength({ min: 4, max: 20 })
        .custom((passwordConfirmation, { req }) => {
            if (passwordConfirmation !== req.body.password) {
                throw new Error("Password must match");
            }
        }),

    signinEmail: check("email")
        .trim()
        .normalizeEmail()
        .isEmail()
        .withMessage("Must provide a valid email")
        .custom(async (email) => {
            const user = await usersRepo.getOneBy({ email });
            if (!user) throw new Error("Email Not Found");
        }),
    signinPassword: check("password")
        .trim()
        .custom(async (password, { req }) => {
            const user = await usersRepo.getOneBy({ email: req.body.email });
            if (!user) throw new Error("Invalid Password");
            const validPasword = await usersRepo.comparePassword(
                user.password,
                password
            );
            if (!validPasword) throw new Error("Invalid Password");
        }),
    requireTitle: check("title")
        .trim()
        .isLength({ min: 5, max: 40 })
        .withMessage("Must be 5 to 40 character long"),
    requirePrice: check("price")
        .trim()
        .toFloat()
        .isFloat({ min: 1 })
        .withMessage("Price must be greater than 1"),
};
