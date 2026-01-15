import Contact from "../models/Contact.model.js";

export const submitContactForm = async (req, res) => {
  try {
    // Ensure all required fields from your model are present
    const { firstName, lastName, email, subject, message } = req.body;
    
    if (!firstName || !lastName || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newMessage = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send message",
      error: error.message,
    });
  }
};