const Messages = require("../dao/Messages");
const { CustomError, handleError } = require("../middleware/errorHandler");

class MessagesServices {
  async handleGetAllMessages(req, res) {
    try {
      const messages = await Messages.getAllMessages();
      res.render("../views/chat.handlebars", { messages });
    } catch (error) {
      handleError(error, res);
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
      handleError(error, res);
    }
  }
}

module.exports = new MessagesServices();
