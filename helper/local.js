const passport = require("passport");
const LocalStrategy = require("passport-local");
const knex = require("./knex");

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser(async (user, done) => {
    try {
        const result = await knex("user_details")
            .select("*")
            .where("phone_number", user.phone_number);
        if (result[0]) {
            done(null, user);
        }
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new LocalStrategy(
        { usernameField: "phone_number" },
        async (phone_number, password, done) => {
            try {
                const result = await knex("user_details")
                    .select("*")
                    .where("phone_number", phone_number);
                if (result.length === 0) {
                    done(null, false);
                } else {
                    if (result[0].password === password) {
                        done(null, {
                            phone_number: result[0].phone_number,
                            id: result[0].id,
                        });
                    } else {
                        done(null, false);
                    }
                }
            } catch (err) {
                done(err, false);
            }
        }
    )
);
