const express = require("express");
const router = express.Router();
const messagesServices = require("../services/MessagesServices");
const roleMiddleware = require("../middleware/roleAuth");

router.get("/", roleMiddleware(["usuario"]), async (req, res) => {
  await messagesServices.handleGetAllMessages(req, res);
});

router.post("/", roleMiddleware(["usuario"]), async (req, res) => {
  await messagesServices.handleCreateMessage(req, res);
});

module.exports = router;
