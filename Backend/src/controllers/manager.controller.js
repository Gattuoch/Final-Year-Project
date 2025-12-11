import Manager from "../models/Manager.js";
import bcrypt from "bcryptjs";

export const managerSignup = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    // Check exists
    const exists = await Manager.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Manager already exists" });

    const hashedPass = await bcrypt.hash(password, 10);

    const manager = await Manager.create({
      fullName,
      email,
      phone,
      password: hashedPass,
      govId: req.files?.govId?.[0]?.filename || null,
      businessLicense: req.files?.businessLicense?.[0]?.filename || null,
    });

    res.status(201).json({
      message: "Signup successful. OTP sent.",
      managerId: manager._id,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
