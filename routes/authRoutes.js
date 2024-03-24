const express = require("express");
const router = express.Router();
const AuthServices = require("../services/AuthServices");
const uploadFiles = require("../middleware/multer");

router.post(
  "/upload",
  uploadFiles.fields([
    { name: "id" },
    { name: "domicile" },
    { name: "status" },
  ]),
  async (req, res) => {
    await AuthServices.getProfile(req, res);
  }
);

router.post("/changerole/:uid", async (req, res) => {
  await AuthServices.changeRole(req, res);
});

router
  .route("/resetPass")
  .get(async (req, res) => {
    await AuthServices.resetPass(req, res);
  })
  .post(async (req, res) => {
    await AuthServices.sendEmailResetPass(req, res);
  });

router
  .route("/resetLink/:email/:timestamp")
  .get(async (req, res) => {
    await AuthServices.resetLink(req, res);
  })
  .post(async (req, res) => {
    await AuthServices.updatePass(req, res);
  });

router.get("/auth/github", async (req, res) => {
  await AuthServices.githubAuthRedirect(req, res);
});

router.get("/", async (req, res) => {
  await AuthServices.renderLoginOrRedirect(req, res);
});

router.post("/login", async (req, res) => {
  await AuthServices.localLogin(req, res);
});
router.get("/logout", async (req, res) => {
  await AuthServices.logout(req, res);
});

router
  .route("/signup")
  .get(async (req, res) => {
    await AuthServices.renderSignup(req, res);
  })
  .post(async (req, res) => {
    await AuthServices.localSignup(req, res);
  });

router.get("/profile", async (req, res) => {
  await AuthServices.getProfile(req, res);
});

module.exports = {
  router,
  initialize: AuthServices.initializePassport,
};
