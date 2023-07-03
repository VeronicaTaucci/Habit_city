const router = require("express").Router();
const db = require("../../models");

router.get("/email/:email", async (req, res) => {
    const records = await db.User.findAll({
        where: { email: req.params.email }
    })
    res.json(records);
});

module.exports = router;