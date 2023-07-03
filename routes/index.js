const router = require("express").Router();

router.get("/", (req, res) => {
    res.render("login", {
        failMessage: false
    });
})

router.use("/api", require("./api"));

module.exports = router;