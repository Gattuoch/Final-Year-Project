import express from "express";
import SupportMessage from "../models/SupportMessage.js";
import nodemailer from "nodemailer";

const router = express.Router();

// POST /api/support
router.post("/", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Save message to MongoDB
    const supportMessage = new SupportMessage({ name, email, subject, message });
    await supportMessage.save();

    // Send email notification
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `New Support Request: ${subject}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) console.log("Email failed:", error);
      else console.log("Email sent:", info.response);
    });

    res.status(200).json({ message: "Support request submitted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
