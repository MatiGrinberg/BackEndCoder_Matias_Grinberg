const express = require("express");
const router = express.Router();
const MessageManager = require("../dao/mongoMessages");

router.get("/", async (req, res) => {
  try {
    const messages = await MessageManager.getAllMessages();
    res.render("../views/chat.handlebars", { messages });
  } catch (error) {
    res.status(500).json({ error: "Error retrieving messages" });
  }
});

router.post("/", async (req, res) => {
  const { sender, content } = req.body;
  if (!sender || !content) {
    return res.status(400).json({ error: "Sender and content are required" });
  }
  try {
    const newMessage = await MessageManager.createMessage(sender, content);
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Error creating message" });
  }
});


module.exports = router;
