const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

async function sendEmail(email) {
  try {
    const timestamp = Date.now();
    const resetLink = `http://localhost:8080/resetLink/${encodeURIComponent(
      email
    )}/${encodeURIComponent(timestamp)}`;
    const message = `Click the following link to reset your password: ${resetLink}`;
    const subject = "Password Reset";
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    });
  } catch (error) {}
}

module.exports = { sendEmail };
