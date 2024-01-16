const express = require('express');
const passport = require('./passportConfig');
const flash = require('express-flash');
const router = express.Router();
const { User } = require("../dao/models/schemas");
const bcrypt = require('bcrypt');


// Github
router.get("/auth/github", passport.authenticate("github"));

router.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    successRedirect: "/products",
    failureRedirect: "/",
  })
);

// Local
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/products");
  }
  res.render("../views/login.handlebars");
});
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/products",
    failureRedirect: "/",
    failureFlash: true,
  }),
  (req, res) => {
    res.render("../views/login.handlebars", { messages: req.flash("error") });
  }
);

router
.route("/signup")
.get(async (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/products");
  }
  res.render("../views/signup.handlebars");
})
.post(async (req, res) => {
  try {
    const { first_name, last_name, age, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      first_name,
      last_name,
      age,
      email,
      password: hashedPassword,
    });
    await newUser.save();
    res.redirect("/");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Error registering user" });
  }
});



router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/");
  }
  const userData = req.user.toObject();
  res.render("../views/profile.handlebars", {
    user_d: userData,
  });
});

router.get("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Could not log out" });
      }
      res.redirect("/");
    });
  });
});


module.exports = {
  router,
  initialize: () => {
    return [
      flash(),
      passport.initialize(),
      passport.session()
    ];
  }
};