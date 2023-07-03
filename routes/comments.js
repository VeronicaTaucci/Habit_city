const express = require('express');
//const bcrypt = require('bcryptjs'); //hash and salt our password
const router = express.Router();
const db = require('../models');
const auth = require('../auth/index');


const findAll = async () => {
    try {
        let records = await db.Comments.findAll();
        return records
    }
    catch (error) {
        return []
    }
}

router.get('/comments', auth, async (req, res) => {
    try {
        let records = await findAll(); //[{}, {}, {}]
        console.log(records)
        res.render('comments', {
            text: records
        })
    }
    catch (error) {
        console.log(error)
        //res.render('/manageHabits')
    }
})




module.exports = router;