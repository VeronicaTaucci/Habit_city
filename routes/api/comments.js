const router = require("express").Router();
const db = require("../../models");

router.get("/:habitId", async (req, res) => {
    const records = await db.Comments.findAll({
        where: { habitId: req.params.habitId },
        order: [ ["createdAt", "DESC"] ]
    })
    res.json(records);
});

router.delete("/:habitId", async (req, res) => {
    await db.Comments.destroy({
        where: { habitId: req.params.habitId }
    })
    res.end();
});

router.post("/add", async (req, res) => {
    await db.Comments.create({
        text: req.body.text,
        habitId: req.body.habitId 
    })
    res.end();
})

module.exports = router;