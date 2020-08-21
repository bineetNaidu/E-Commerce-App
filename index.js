const app = require("express")();
const bodyParser = require("body-parser");
const usersRepo = require("./repository/users");
const cookieSession = require("cookie-session");

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cookieSession({
        keys: ["fhghgfy5d5dx6d64d6d44ddfcggg5edf3ufcas"],
    })
);

app.get("/signup", (req, res) => {
    res.send(`
  <div>
    <form method="POST">
      <input name="email" placeholder="email" />
      <input name="password" placeholder="password" />
      <input name="passwordConfirmation" placeholder="Confirm password" />
      <button>Summit</button>
    </form>
  </div>
`);
});

app.post("/signup", async (req, res) => {
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

app.get("/signout", (req, res) => {
    req.session = null;
    res.send("You are logged out!");
});

app.get("/signin", (req, res) => {
    res.send(`
      <div>
        <form method="POST">
          <input name="email" placeholder="email" />
          <input name="password" placeholder="password" />
          <button>Sign In</button>
        </form>
      </div>
    `);
});

app.post("/signin", async (req, res) => {
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

app.listen(process.env.PORT || 3000, () => console.log("Server started"));
