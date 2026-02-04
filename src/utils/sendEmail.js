const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = async ({ to, subject, html }) => {
  // Fail fast if credentials missing
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    throw new Error("Email credentials not configured");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"DevConnect" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  // Let errors propagate — caller decides how to handle
  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Email sent to:", to, "| MessageId:", info.messageId);
  return info;
};

module.exports = sendEmail;
