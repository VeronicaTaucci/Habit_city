const router = require("express").Router();
const passport = require("passport");

router.get("/login", (req, res) => {
    res.render("login", {
        failMessage: false
    })
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/habitBoard",
    failureRedirect: "/loginFailed"
}))

module.exports = router;