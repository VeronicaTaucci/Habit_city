const express = require("express");
const app = express();
const helmet = require("helmet");
const cookieSession = require("cookie-session");
const passport = require("passport");
const db = require("./models");
require("./auth/passport-config")(passport);
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(helmet());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieSession({
    name: "session",
    keys: ["aaabbbcccddd"],
    maxAge: 14 * 24 * 60 * 60 * 1000
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(require("./routes/index"));
app.use(require("./routes/register"));
app.use(require("./routes/login"));
// app.use(require("./routes/logout"));
app.use(require("./routes/loginFailed"));
app.use(require("./routes/habitBoard"));
app.use(require('./routes/manageHabits'));
app.use(require('./routes/comments'));

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
})

db.sequelize.sync({ force: false })
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    })
})

