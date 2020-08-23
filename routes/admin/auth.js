const router = require("express").Router();
const usersRepo = require("../../repository/users");
const signupTMP = require("../../views/admin/auth/signup");
const {
    requireEmail,
    requirePassword,
    checkPassword,
    signinEmail,
    signinPassword,
} = require("./validators");
const signinTMP = require("../../views/admin/auth/signin");
const { handleErrors } = require("./middlewares");

router.get("/signup", (req, res) => {
    res.send(signupTMP({ req }));
});

router.post(
    "/signup",
    [requireEmail, requirePassword, checkPassword],
    handleErrors(signupTMP),
    async (req, res) => {
        const { email, password } = req.body;

        // create a user in our repo
        const user = await usersRepo.create({ email, password });
        // store the id of that user inside the users cookie
        req.session.userId = user.id;
        res.send("Account Created!");
    }
);

router.get("/signout", (req, res) => {
    req.session = null;
    res.send("You are logged out!");
});

router.get("/signin", (req, res) => {
    res.send(signinTMP({}));
});

router.post(
    "/signin",
    [signinEmail, signinPassword],
    handleErrors(signinTMP),
    async (req, res) => {
        const { email } = req.body;
        //check in DB
        const user = await usersRepo.getOneBy({ email });
        req.session.userId = user.id;
        res.redirect("/admin/products");
    }
);

module.exports = router;
