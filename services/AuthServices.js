const passport = require("../middleware/passportConfig");
const flash = require("express-flash");
const UserManager = require("../dao/UserManager.js");
const userManager = new UserManager();
const UserProfileDTO = require("../dto/UserProfileDTO");
const { CustomError, handleError } = require("../middleware/errorHandler");
const fs = require("fs");
const path = require("path");
const { loggerMiddleware } = require("../middleware/logger");

class AuthServices {
  async deleteOldUsers(req, res) {
    try {
      if (!req.isAuthenticated()) {
        return res.redirect("/");
      }
      const delCount = await userManager.deleteInactiveUsers();
      loggerMiddleware.info(`${delCount} user(s) deleted successfully.`);
    } catch (error) {
      const customError = new CustomError(
        "Error DELETING USERS: " + error.message,
        500
      );
      handleError(customError, res);
    }
  }

  async getUsers(req, res) {
    try {
      if (!req.isAuthenticated()) {
        return res.redirect("/");
      }
      const users = await userManager.getUsers();
      res.render("../views/users.handlebars", {
        user_list: users,
      });
    } catch (error) {
      const customError = new CustomError(
        "Error fetching USERS: " + error.message,
        500
      );
      handleError(customError, res);
    }
  }

  async changeRole(req, res) {
    const userId = req.params.uid;
    const loggedInUserId = req.user._id.toString();
    console.log(userId, loggedInUserId);
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

  async getProfile(req, res) {
    if (!req.isAuthenticated()) {
      return res.redirect("/");
    }
    const userDTO = new UserProfileDTO(req.user);
    const userId = req.user.id;
    const uploadsDir = path.join(__dirname, `../uploads`);
    const idUploaded = fs.existsSync(
      path.join(uploadsDir, "id", userId.toString())
    );
    const domicileUploaded = fs.existsSync(
      path.join(uploadsDir, "domicile", userId.toString())
    );
    const statusUploaded = fs.existsSync(
      path.join(uploadsDir, "status", userId.toString())
    );
    res.render("../views/profile.handlebars", {
      user_d: userDTO,
      idUploaded: idUploaded,
      domicileUploaded: domicileUploaded,
      statusUploaded: statusUploaded,
    });
  }

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
    })(req, res, async () => {
      await userManager.lastConnection(req.user._id);
    });
  }

  async logout(req, res) {
    await userManager.lastConnection(req.user._id);
    req.logout(() => {
      req.session.destroy(async (err) => {
        if (err) {
          console.error("Error destroying session:", err);
          return res.status(500).json({ error: "Could not log out" });
        }
        res.redirect("/");
      });
    });
  }

  async renderSignup(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect("/products");
    }
    res.render("../views/signup.handlebars");
  }

  renderLoginOrRedirect(req, res) {
    if (req.isAuthenticated()) {
      return res.redirect("/products");
    }
    res.render("../views/login.handlebars");
  }

  initializePassport() {
    return [flash(), passport.initialize(), passport.session()];
  }
}

module.exports = new AuthServices();
