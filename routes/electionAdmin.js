const passport = require("passport");
const bcrypt = require("bcrypt");
const { ElectionAdmin } = require("../models");
const { Elections } = require("../models");
const router = require("express").Router();
const connectEnsureLogin = require("connect-ensure-login");
const { Voters } = require("../models");

const saltRounds = 10;

// Login, Signup, Logout Routes
router.get(
  "/login",
  connectEnsureLogin.ensureLoggedOut({ redirectTo: "/admin/" }),
  (req, res) => {
    res.render("admin/login", {
      title: "Admin Login",
      csrfToken: req.csrfToken(),
    });
  }
);

router.get("/signup", (req, res) => {
  res.render("admin/signup", {
    title: "Admin Signup",
    csrfToken: req.csrfToken(),
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/admin/",
    failureRedirect: "/admin/login",
    failureFlash: true,
  }),
  (req, res) => {
    res.redirect("/admin/");
  }
);

router.post("/signup", async (req, res) => {
  console.log("Signing up a new admin");
  const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
  const newAdmin = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hashedPassword,
    username: req.body.username,
  };
  try {
    const admin = await ElectionAdmin.create(newAdmin);
    req.login(admin, (error) => {
      if (error) {
        // console.log(error);
        res.status(422).json(error);
      }
      res.redirect("/admin/");
    });
  } catch (error) {
    req.flash(
      "error",
      error.errors.map((error) => error.message)
    );
    console.log(error.errors.map((error) => error.message));
    res.redirect("/admin/signup");
  }
});

router.get("/signout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    res.redirect("/");
  });
});

// Dashboard and election routes
router.get(
  "/",
  connectEnsureLogin.ensureLoggedIn({ redirectTo: "/admin/login" }),
  async (req, res) => {
    // console.log(req.user)
    const liveElections = await Elections.getLiveElectionsofUser({
      UId: req.user.id,
    });
    const elections = await Elections.getElectionsofUser({ UId: req.user.id });
    // console.log(liveElections, elections)
    if (req.accepts("html")) {
      res.render("admin/index", {
        title: "Admin Dashboard",
        liveElections,
        elections,
        csrfToken: req.csrfToken(),
      });
    } else {
      // console.log(liveElections, elections);
      res.json({
        liveElections,
        elections,
      });
    }
  }
);

router.post(
  "/elections",
  connectEnsureLogin.ensureLoggedIn({ redirectTo: "/admin/login" }),
  async (req, res) => {
    const election = {
      electionName: req.body.name,
      customString: req.body.customString,
      UId: req.user.id,
    };
    try {
      await Elections.createElection(election);
      res.redirect("/admin/");
    } catch (error) {
      req.flash(
        "error",
        error.errors.map((error) => error.message)
      );
      console.log(error.errors.map((error) => error.message));
      res.redirect("/admin/");
    }
  }
);

router.get(
  "/election/voters/:id",
  connectEnsureLogin.ensureLoggedIn({ redirectTo: "/admin/login" }),
  async (req, res) => {
    const EId = req.params.id;
    const UId = req.user.id;
    try {
      const isUserElection = await Elections.isElectionbelongstoUser({
        EId,
        UId,
      });
      if (isUserElection) {
        const voters = await Voters.getAllVotersofElection({
          EId,
          UId,
        });
        res.render("admin/voters", {
          title: "Voters",
          voters,
          csrfToken: req.csrfToken(),
          EID: EId,
        });
      } else {
        req.flash("error", "Unauthorized Access");
        res.redirect("/admin/");
      }
    } catch {
      (error) => {
        req.flash(
          "error",
          `Something went wrong, Pls try again later ${error}`
        );
        res.redirect("/admin/");
      };
    }
  }
);

router.post(
  "/election/voters",
  connectEnsureLogin.ensureLoggedIn({ redirectTo: "/admin/login" }),
  async (req, res) => {
    const EId = req.body.EId;
    const UId = req.user.id;
    const voter = {
      voterid: req.body.voterID,
      password: req.body.password,
      votername: req.body.votername,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      EId: req.body.EId,
    };
    try {
      const isUserElection = await Elections.isElectionbelongstoUser({
        EId,
        UId,
      });
      if (isUserElection) {
        try {
          await Voters.createVoter(voter);
          res.redirect("/admin/election/voters/" + EId);
        } catch (error) {
          req.flash(
            "error",
            error.errors.map((error) => error.message)
          );
          res.redirect("/admin/election/voters/" + EId);
        }
      } else {
        req.flash("error", "Unauthorized Access");
        res.redirect("/admin/");
      }
    } catch (error) {
      console.log(error);
      req.flash(
        "error",
        error.errors.map((error) => error.message)
      );
      res.redirect("/admin/voters/" + EId);
    }
  }
);

router.get("/rough", async (req, res) => {
  res.render("admin/voters", {
    title: "Voters",
    csrfToken: req.csrfToken(),
    EID: 1,
  });
});

module.exports = router;
