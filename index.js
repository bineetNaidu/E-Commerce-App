const app = require("express")();
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");

// middlewares
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
    cookieSession({
        keys: ["fhghgfy5d5dx6d64d6d44ddfcggg5edf3ufcas"],
    })
);

// mounting routers
app.use(require("./routes/admin/auth"));

app.listen(process.env.PORT || 3000, () => console.log("Server started"));
