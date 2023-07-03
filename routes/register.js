const router = require("express").Router();
const bcrypt = require("bcrypt");
const db = require("../models");

router.get("/register", (req, res) => {
    res.render("register", {
        failMessage: false 
    })
})

router.post("/register", async (req, res) => {
    const password = bcrypt.hashSync(req.body.password, 8);
    try {
        await db.User.create({
            name: req.body.name,
            email: req.body.email,
            password: password
        })
        res.end();
    } catch (error) {
        console.log(error.message);
        res.render("register", {
            failMessage: true
        })
    }
})

module.exports = router;