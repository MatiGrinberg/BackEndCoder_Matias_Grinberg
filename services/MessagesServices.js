const Messages = require("../dao/Messages");

class MessagesServices {
  async handleGetAllMessages(req, res) {
    try {
      const messages = await Messages.getAllMessages();
      res.render("../views/chat.handlebars", { messages });
    } catch (error) {
      res.status(500).json({ error: "Error retrieving messages" });
    }
  }

  async handleCreateMessage(req, res) {
    const { sender, content } = req.body;
    if (!sender || !content) {
      return res.status(400).json({ error: "Sender and content are required" });
    }
    try {
      const newMessage = await Messages.createMessage(sender, content);
      res.status(201).json(newMessage);
    } catch (error) {
      res.status(500).json({ error: "Error creating message" });
    }
  }
}

module.exports = new MessagesServices();
