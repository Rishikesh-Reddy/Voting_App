const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { ElectionAdmin } = require("./models");
const bcrypt = require("bcrypt");
const session = require("express-session");
const flash = require("connect-flash");
const csrf = require("tiny-csrf");
const cookieParser = require("cookie-parser");

const app = express();
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use(cookieParser("Some secret info"));
app.use(flash());
app.use(
  session({
    secret: "SuperSecrectInformation",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
    resave: false,
    saveUninitialized: true,
  })
);
app.use(csrf("UicgFjabMtvsSJEHUSfK3Dz0NR6K0pIm", ["DELETE", "PUT", "POST"]));

app.use(passport.initialize());
app.use(passport.session());
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      console.log("Authenticating User", email, password);
      ElectionAdmin.findOne({ where: { email: email } })
        .then(async (user) => {
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Invalid password 🤯" });
          }
        })
        .catch(() => {
          return done(null, false, {
            message: "Invalid email or You are not Registerd with Us.",
          });
        });
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("Serializing User in session", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log("Deserializing User from session", id);
  ElectionAdmin.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((error) => {
      done(error, null);
    });
});

app.get("/", (req, res) => {
  return res.status(200).json({
    name: "WD 201 Capstone Project",
    success: true,
  });
});

app.use("/admin", require("./routes/electionAdmin"));

module.exports = app;
