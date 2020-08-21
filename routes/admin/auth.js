const router = require("express").Router();
const usersRepo = require("../../repository/users");
const signupTMP = require("../../views/admin/auth/signup");
const signinTMP = require("../../views/admin/auth/signin");

router.get("/signup", (req, res) => {
    res.send(signupTMP({ req }));
});

router.post("/signup", async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send("Email in use");
    }
    // password check
    if (password !== passwordConfirmation) {
        return res.send("Password must match!");
    }

    // create a user in our repo
    const user = await usersRepo.create({ email, password });
    // store the id of that user inside the users cookie
    req.session.userId = user.id;
    res.send("Account Created!");
});

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
