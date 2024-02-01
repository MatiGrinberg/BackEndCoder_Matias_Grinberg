const express = require("express");
const router = express.Router();
const messagesServices = require("../services/MessagesServices");

router.get("/", async (req, res) => {
  await messagesServices.handleGetAllMessages(req, res);
});

router.post("/", async (req, res) => {
  await messagesServices.handleCreateMessage(req, res);
});

module.exports = router;

