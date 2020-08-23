const layout = require("../layout");

module.exports = ({ product }) => {
    return layout({
        content: `
      <form method="POST" enctype="multipart/form-data">
        <input name="title" value="${product.title}" />
        <input name="price" value="${product.price}" />
        <input name="image" type="file" />
        <button>Sumbit</button>
      </form>
    `,
    });
};
