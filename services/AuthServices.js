const passport = require("../middleware/passportConfig");
const flash = require("express-flash");
const UserManager = require("../dao/UserManager.js");
const userManager = new UserManager();
const UserProfileDTO = require("../dto/UserProfileDTO");
const { CustomError, handleError } = require("../middleware/errorHandler");

class AuthServices {
  async resetPass(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect("/products");
    }
    res.render("../views/resetPass.handlebars");
  }

  async sendEmailResetPass(req, res) {
    const { email } = req.body;
    try {
      await userManager.resetPass(email);
      res.redirect("/");
    } catch (error) {
      handleError(error, res);
    }
  }

  async resetLink(req, res) {
    try {
      const { email, timestamp } = req.params;
      const now = Date.now();
      const expirationTime = parseInt(timestamp) + 60 * 60 * 1000;
      if (now > expirationTime) {
        res.redirect("/resetPass");
      } else {
        res.render("../views/resetLink.handlebars", { email, timestamp });
      }
    } catch (error) {
      handleError(error, res);
    }
  }

  async updatePass(req, res) {
    try {
      const { email } = req.params;
      const newPass = req.body.password;
      userManager.updatePass(email, newPass);
      res.redirect("/");
    } catch (error) {
      handleError(error, res);
    }
  }

  async localSignup(req, res) {
    try {
      await userManager.registerUser(req.body);
      res.redirect("/");
    } catch (error) {
      handleError(error, res);
    }
  }

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

  async getProfile(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect("/");
    }
    const userDTO = new UserProfileDTO(req.user);
    res.render("../views/profile.handlebars", {
      user_d: userDTO,
    });
  }

  async changeRole(req, res) {
    const userId = req.params.uid;
    const loggedInUserId = req.user._id.toString();
    try {
      if (userId !== loggedInUserId) {
        return res
          .status(403)
          .json({ error: "Unauthorized: You can only change your own role" });
      }
      const newRole = await userManager.changeUserRole(userId);
      res.json({ message: "User role updated successfully" });
    } catch (error) {
      handleError(error, res);
    }
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
