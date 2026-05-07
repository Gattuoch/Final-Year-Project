import SupportMessage from "../models/SupportMessage.js";
<<<<<<< HEAD
// import * as emailService from "../services/email.service.js";
=======
import * as emailService from "../services/email.service.js";
>>>>>>> 3977542d1f9d7d51358c5b10c489cc675e88f1d8

/**
 * POST /api/support
 * Send a support request email and save to database
 */
export const sendSupportMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    // Save to database
    const supportMessage = new SupportMessage({ name, email, subject, message });
    await supportMessage.save();

    // 1. Notify support team
    await emailService.sendMail({
      to: process.env.SUPPORT_EMAIL || "support@ethiocampground.com",
      subject: `Support Request: ${subject}`,
      html: `
        <h2>New Support Request</h2>
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
      subject: "Your support request has been received",
      html: `
        <p>Dear ${name},</p>
        <p>Thank you for contacting EthioCampGround support. We have received your message and will get back to you as soon as possible.</p>
        <p><strong>Your message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
        <p>Best regards,<br/>EthioCampGround Team</p>
      `,
    });

    return res.status(200).json({ 
      success: true, 
      message: "Support request sent successfully." 
    });
  } catch (err) {
    console.error("Support email error:", err);
    return res.status(500).json({ 
      success: false, 
      error: "Failed to send support request." 
    });
  }
};