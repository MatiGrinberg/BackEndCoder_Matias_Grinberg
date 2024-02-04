const passport = require("../middleware/passportConfig");
const flash = require("express-flash");
const bcrypt = require("bcrypt");
const User = require("../dao/schemas/userSchema");
const UserProfileDTO = require("../dto/UserProfileDTO");

class AuthServices {
  async githubAuthRedirect(req, res) {
    return passport.authenticate("github", {
      successRedirect: "/products",
      failureRedirect: "/",
    })(req, res);
  }

  async localLogin(req, res) {
    return passport.authenticate("local", {
      successRedirect: "/carts",
      failureRedirect: "/",
      failureFlash: true,
    })(req, res);
  }

  async renderSignup(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect("/products");
    }
    res.render("../views/signup.handlebars");
  }

  async localSignup(req, res) {
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
  }

  async getProfile(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect("/");
    }
    const userDTO = new UserProfileDTO(req.user);
    res.render("../views/profile.handlebars", {
      user_d: userDTO,
    });
  }

  renderLoginOrRedirect(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect("/products");
    }
    res.render("../views/login.handlebars");
  }

  async logout(req, res) {
    req.logout(() => {
      req.session.destroy((err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ error: "Could not log out" });
        }
        res.redirect("/");
      });
    });
  }

  initializePassport() {
    return [flash(), passport.initialize(), passport.session()];
  }
}

module.exports = new AuthServices();
