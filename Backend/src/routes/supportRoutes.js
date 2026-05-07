import express from "express";
import SupportMessage from "../models/SupportMessage.js";
import * as emailService from "../services/email.service.js"; // reuse your existing email service
import { verifyToken } from "../middlewares/auth.middleware.js"; // optional: protect route

const router = express.Router();

/**
 * POST /api/support
 * Submit a support request
 */
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Save to database
    const supportMessage = new SupportMessage({ name, email, subject, message });
    await supportMessage.save();

    // 1. Notify support team
    await emailService.sendMail({
      to: process.env.SUPPORT_EMAIL || "support@ethiocampground.com",
      subject: `New Support Request: ${subject}`,
      html: `
        <h2>Support Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
      `,
      replyTo: email,
    });

    // 2. Send auto-reply to the user
    await emailService.sendMail({
      to: email,
      subject: "We received your support request",
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for contacting EthioCampGround support. We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
        <p>Best regards,<br/>EthioCampGround Team</p>
      `,
    });

    res.status(200).json({ 
      success: true, 
      message: "Support request submitted successfully!" 
    });
  } catch (err) {
    console.error("Support route error:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

export default router;