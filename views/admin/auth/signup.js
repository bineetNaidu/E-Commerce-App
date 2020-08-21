const layout = require("../layout");
module.exports = ({ req }) => {
    return layout({
        body: `<div>
    <form method="POST">
      <input name="email" placeholder="email" />
      <input name="password" placeholder="password" />
      <input name="passwordConfirmation" placeholder="Confirm password" />
      <button>Summit</button>
    </form>
    <h1>ID - ${req.session.userId}</h1>
  </div>`,
    });
};
