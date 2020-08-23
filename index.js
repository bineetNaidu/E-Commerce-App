const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
    cookieSession({
        keys: ["fhghgfy5d5dx6d64d6d44ddfcggg5edf3ufcas"],
    })
);

// mounting routers
app.use(require("./routes/products"));
app.use(require("./routes/admin/auth"));
app.use(require("./routes/admin/products"));

app.listen(process.env.PORT || 3000, () => console.log("Server started"));
