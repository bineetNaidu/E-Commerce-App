const app = require("express")();
const bodyParser = require("body-parser");
const usersRepo = require("./repository/users");

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
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

app.post("/", async (req, res) => {
    const { email, password, passwordConfirmation } = req.body;
    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send("Email in use");
    }
    // password check
    if (password !== passwordConfirmation) {
        return res.send("Password must match!");
    }
    res.send("Account Created!");
});

app.listen(process.env.PORT || 3000, () => console.log("Server started"));
