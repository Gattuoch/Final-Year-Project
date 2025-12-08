import Contact from "../models/Contact.js";

export const submitContactForm = async (req, res) => {
  try {
    const newMessage = await Contact.create(req.body);

    res.status(201).json({
      success: true,
      message: "Message sent successfully!",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
