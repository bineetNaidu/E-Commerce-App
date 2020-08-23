const { validationResult } = require("express-validator");

module.exports = {
    handleErrors(template) {
        return (req, res, next) => {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.send(template({ errors }));
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
