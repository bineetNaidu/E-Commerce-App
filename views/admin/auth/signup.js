const layout = require("../layout");

const { getError } = require("../../helpers");

module.exports = ({ req, errors }) => {
    return layout({
        body: `<div>
    <form method="POST">
        <input name="email" placeholder="email" />
        ${getError(errors, "email")}
        <input name="password" placeholder="password" />
        ${getError(errors, "password")}
        <input name="passwordConfirmation" placeholder="Confirm password" />
        ${getError(errors, "passwordConfirmation")}

        <button>Summit</button>
    </form>
    <h1>ID - ${req.session.userId}</h1>
  </div>`,
    });
};
