const Message = require("./schemas/messageSchema");
const { loggerMiddleware } = require("../middleware/logger");

class MessageManager {
  static async getAllMessages() {
    try {
      const messages = await Message.find().sort({ timestamp: "desc" }).lean();
      return messages;
    } catch (error) {
      loggerMiddleware.error("Error retrieving messages:" + error.message);
      return [];
    }
  }

  static async createMessage(sender, content) {
    try {
      const newMessage = new Message({
        sender,
        content,
      });
      await newMessage.save();
      return newMessage;
    } catch (error) {
      loggerMiddleware.error("Error creating message:" + error.message);
      return null;
    }
  }
}

module.exports = MessageManager;
