const express = require("express");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);

//Initiate our app
const app = express();

//Configure our app
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret:'secret',
    cookie: { maxAge: 60000 },
    resave:false,
    saveUninitialized: true,
    store: new knexSessionStore({
        knex: require('./helper/knex'),
        tablename: 'sessions',
        sidfieldname: 'sid',
        createtable: true,
        clearInterval: 1000 * 60 * 60
      })
}))
app.use(passport.initialize())
app.use(passport.session())
require('./helper/local')

// app.use('/auth',require("./routes/auth"))

app.use("/", require("./routes/user"));
// app.use("/", require("./routes/post"));
const port = 3000;
app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});
