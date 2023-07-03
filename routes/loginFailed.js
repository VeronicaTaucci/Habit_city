const router = require("express").Router();
const passport = require("passport");

router.get("/loginFailed", (req, res) => {
    res.render("login", {
        failMessage: true
    })
})

module.exports = router;