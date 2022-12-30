const router = require("express").Router();
const connectEnsureLogin = require("connect-ensure-login");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const { Voters } = require("../models");

router.use(passport.initialize());
router.use(passport.session());
router.use(function (req, res, next) {
  res.locals.messages = req.flash();
  next();
});

passport.use(
  "voterAuth",
  new LocalStrategy(
    {
      usernameField: "voterID",
      passwordField: "password",
    },
    async (voterID, password, done) => {
      console.log("Authenticating User", voterID, password);
      Voters.findOne({ where: { voterid: voterID } })
        .then(async (voter) => {
          const result = password === voter.password;
          if (result) {
            return done(null, voter);
          } else {
            return done(null, false, { message: "Invalid password 🤯" });
          }
        })
        .catch((err) => {
          console.log(err);
          return done(null, false, {
            message: "Invalid VoterID or You are not Registered with Us.",
          });
        });
    }
  )
);

passport.serializeUser((voter, done) => {
  console.log("Serializing voter in session", voter.id);
  done(null, voter.id);
});

passport.deserializeUser((id, done) => {
  console.log("Deserializing User from session", id);
  Voters.findByPk(id)
    .then((voter) => {
      done(null, voter);
    })
    .catch((error) => {
      done(error, null);
    });
});

router.get(
  "/",
  connectEnsureLogin.ensureLoggedIn({ redirectTo: "/voter/login" }),
  (req, res) => {
    return res.status(200).json({
      name: "WD 201 Capstone Project",
      success: true,
    });
  }
);

router.get(
  "/login",
  connectEnsureLogin.ensureLoggedOut({ redirectTo: "/voter" }),
  (req, res) => {
    res.render("voter/login", {
      title: "Voter Login",
      csrfToken: req.csrfToken(),
    });
  }
);

router.post(
  "/login",
  connectEnsureLogin.ensureLoggedOut({ redirectTo: "/voter" }),
  passport.authenticate("voterAuth", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (req, res) => {
    console.log("Login Successful");
    res.redirect("/voter");
  }
);

module.exports = router;
