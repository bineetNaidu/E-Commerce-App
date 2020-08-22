const router = require("express").Router();
const usersRepo = require("../../repository/users");
const signupTMP = require("../../views/admin/auth/signup");
const {
    requireEmail,
    requirePassword,
    checkPassword,
} = require("./validators");
const signinTMP = require("../../views/admin/auth/signin");
const { check, validationResult } = require("express-validator");

router.get("/signup", (req, res) => {
    res.send(signupTMP({ req }));
});

router.post(
    "/signup",
    [requireEmail, requirePassword, checkPassword],
    async (req, res) => {
        const errors = validationResult(req);
        console.log(errors);
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
    res.send(signinTMP());
});

router.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    //check in DB
    const user = await usersRepo.getOneBy({ email });
    if (!user) res.send("Email Not Found");
    const validPasword = await usersRepo.comparePassword(
        user.password,
        password
    );
    if (!validPasword) res.send("Invalid Password");
    req.session.userId = user.id;
    res.send("You are sign IN!");
});

module.exports = router;
