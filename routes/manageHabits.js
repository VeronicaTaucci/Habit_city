
const express = require('express');
//const bcrypt = require('bcryptjs'); //hash and salt our password
const router = express.Router();
const db = require('../models');
const auth = require('../auth/index');

const findAll = async req => {
    return await db.Habits.findAll({
        where: { userId: req.session.passport.user }
    });
}

router.get("/manageHabits", auth, async (req, res) => {
    try {
        const records = await findAll(req);
        res.render("manageHabits", { habits: records });
    } catch (err) {
        console.log(err)
    }

})
//delete record
router.delete("/manageHabits/:id", async (req, res) => {
    try {
        let id = req.params.id
        await db.Habits.destroy({ where: { id: id} })
        let records = await findAll(req);
        res.json(records);
        // res.render("manageHabits", { habits: records });
    } catch (err) {
        console.log(err);
        res.json([])
    }
})

router.post('/manageHabits', async (req, res) => {
    try{
        let title = req.body.title;
        let id = req.session.passport.user;
        let type = req.body.type;
        let insert = await db.Habits.create({title: title, userId: id, type: type})

        let records = await findAll(req);
        console.log(records);
        res.json(records)
    }
    catch(error){
        console.log(error);
        res.json([])
      }
})

//update record
router.put('/manageHabits/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const title = req.body.title;
        console.log(req.body);
        const result = await db.Habits.update({
            title: title,
        }, {
            where: {
                id: id
            }
        });
        let records = await findAll(req);
        res.json(records);
    } catch (err) {
        console.log(err);
        res.json(["this is an err"])
    }
})
module.exports = router;