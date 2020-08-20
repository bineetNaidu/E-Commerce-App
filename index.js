const app = require("express")();

app.get("/", (req, res) => {
    res.send(`
  <div>
    <form method="POST">
      <input name="email" placeholder="email" />
      <input name"password" placeholder="password" />
      <input name="passwordConfirmation" placeholder="Confirm password" />
      <button>Summit</button>
    </form>
  </div>
`);
});

app.post("/", (req, res) => console.log("Account Created!"));

app.listen(process.env.PORT || 3000, () => console.log("Server started"));
