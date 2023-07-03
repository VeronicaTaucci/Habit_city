const router = require("express").Router();
const db = require("../models");
const auth = require("../auth");

router.get("/habitBoard", auth, async (req, res) => {
    const records = await db.Habits.findAll({
        where: { userId: req.session.passport.user },
        order: [ ["type", "DESC"] ]
    })
    res.render("habitBoard", { 
        habits: records,
        noHabits: records.length ? false : true 
    });
})

module.exports = router;