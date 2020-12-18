const { Router } = require("express");
const router = Router();
const passport = require("passport");
const auth = require('../helper/auth');
const knex = require("../helper/knex");

// function loggedIn(req, res, next) {
//     if (req.user) {
//         next();
//     } else {
//         return res.status(403).send("Forbidden");
//     }
// }

router.get("/users", async (req, res) => {
    const users = await knex("user_details").select("*");
    res.status(200).send(users);
});

router.post("/users", async (req, res) => {
    try {
        //get data from dody
        let receiveData = {
            phone_number: Number(req.body.phone_number),
            password: String(req.body.password),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            address: req.body.address,
            role: req.body.role,
        };

        //check is user phone number in used
        const isUserExist = await knex("public.user_details")
            .select("*")
            .where("phone_number", receiveData.phone_number);

        //if not in use then
        if (isUserExist.length == 0) {
            receiveData.id = uuidv4();
            await knex("user_details").insert(receiveData);
            await knex("payment_details").insert({
                phone_number: receiveData.phone_number,
                total: 0,
            });
            return res.status(201).json({
                success: true,
            });
        }
        //if in use
        else {
            return res.status(400).json({ error: "User already exists" });
        }
    } catch (err) {
        return res.status(401).json({
            error: {
                status: "0",
                message: `${err}`,
            },
        });
    }
});

router.get("/users/profile",auth.ensureAuthenticated, async (req, res) => {
    const { phone_number } = req.params;
    const users = await knex("user_details")
        .select("*")
        .where("phone_number", req.user.phone_number);
    if (users) return res.status(200).json(users);
    else return res.status(404).send("Not found");
});

router.post("/signin", passport.authenticate("local"), (req, res) => {
    res.status(200).json({ msg: "logged in" });
});

router.get("/logout", (req, res) => {
    req.logout();
    res.status(200).json({ msg: "logout" });
});

module.exports = router;
