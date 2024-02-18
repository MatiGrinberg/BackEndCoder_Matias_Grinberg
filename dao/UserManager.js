const User = require("./schemas/userSchema");
const { loggerMiddleware } = require("../middleware/logger");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../middleware/emailSender");

class UserManager {
  async registerUser(userData) {
    const { first_name, last_name, age, email, password } = userData;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      loggerMiddleware.error("Email already exists");
      return false;
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      first_name,
      last_name,
      age,
      email,
      password: hashedPassword,
    });
    await newUser.save();
  }

  async resetPass(email) {
    try {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        loggerMiddleware.error("User Not Found");
      }
      await sendEmail(email);
      loggerMiddleware.info("Password reset email sent successfully");
    } catch (error) {
      loggerMiddleware.error(
        "Error sending password reset email:" + error.message
      );
    }
  }

  async updatePass(email, newPassword) {
    try {
      const user = await User.findOne({ email });
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        loggerMiddleware.error(
          "New password must be different from the current one"
        );
        return;
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedNewPassword;
      await user.save();
    } catch (error) {
      loggerMiddleware.error("Error Updating Password:" + error.message);
    }
  }
}

module.exports = UserManager;
