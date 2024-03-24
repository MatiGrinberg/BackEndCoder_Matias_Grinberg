const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASSWORD,
  },
});

async function sendDeletedAccountEmail(email) {
  try {
    const message = "Your account has been deleted.";
    const subject = "Account Deletion Notification";
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    });
  } catch (error) {}
}

async function sendDelProd(email) {
  try {
    const message = "Your product has been deleted.";
    const subject = "Product Deletion Notification";
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: subject,
      text: message,
    });
  } catch (error) {}
}

module.exports = { sendDeletedAccountEmail, sendDelProd };
