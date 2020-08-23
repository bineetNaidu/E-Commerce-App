const { validationResult } = require("express-validator");

module.exports = {
    handleErrors(template, cb) {
        return async (req, res, next) => {
            const errors = validationResult(req);
            let data = {};
            if (cb) {
                data = await cb(req);
            }
            if (!errors.isEmpty()) {
                return res.send(template({ errors, ...data }));
            }
            next();
        };
    },

    adminAuth(req, res, next) {
        if (!req.session.userId) {
            return res.redirect("/signin");
        }
        next();
    },
};
