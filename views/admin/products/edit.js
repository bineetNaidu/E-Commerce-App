const layout = require("../layout");
const { getError } = require("../../helpers");
module.exports = ({ product, errors }) => {
    return layout({
        content: `
      <form method="POST" enctype="multipart/form-data">
        <input name="title" value="${product.title}" />
        ${getError(errors, "title")}
        <input name="price" value="${product.price}" />
        ${getError(errors, "price")}
        <input name="image" type="file" />
        <button>Sumbit</button>
      </form>
    `,
    });
};
