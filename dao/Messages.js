const { Message } = require('./schemas/messageSchema');

class MessageManager {
  static async getAllMessages() {
    try {
      const messages = await Message.find().sort({ timestamp: 'desc' }).lean();
      return messages;
    } catch (error) {
      console.error('Error retrieving messages:', error);
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
      console.error('Error creating message:', error);
      return null;
    }
  }
}

module.exports = MessageManager;
