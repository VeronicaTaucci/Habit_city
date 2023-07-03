const router = require("express").Router();
const db = require("../../models");

router.put("/streak/:id/:number", async (req, res) => {
    const records = await db.Habits.update({
        streakNumber: req.params.number
    }, {
        where: { id: req.params.id }
    })
    res.end();
});

module.exports = router;