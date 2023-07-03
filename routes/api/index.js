const router = require("express").Router();

router.use("/user", require("./user"));
router.use("/habits", require("./habits"));
router.use("/comments", require("./comments"));

module.exports = router;