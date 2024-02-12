const express = require("express");
const router = express.Router();
const { loggerMiddleware } = require("../middleware/logger");

router.get("/", async (req, res) => {
  loggerMiddleware.info("Testing info log");
  loggerMiddleware.debug("Testing debug log");
  loggerMiddleware.error("Testing error log");
});

module.exports = router;
