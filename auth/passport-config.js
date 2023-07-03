const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("../models");

module.exports = passport => {
    passport.use(new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
        try {
            const record = await db.User.findAll({ where: { email }});
            if (record.length) {
                bcrypt.compare(password, record[0].password, (error, match) => {
                    if (match) {
                        console.log("passwords matched");
                        return done(null, record[0]);
                    } else {
                        console.log("passwords didn't match");
                        return done(null, false);
                    }
                });
            } else return done(null, false);
        } catch (error) {
            console.log(error);
            return done(error);
        }
    }))
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser(async (id, done) => {
        const foundUserFromSessionData = await db.User.findByPk(id);
        if (foundUserFromSessionData) done(null, foundUserFromSessionData);
        else done(null, false);
    })
}