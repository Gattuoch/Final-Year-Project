import User from "../models/User.model.js"; // Use the unified User model
import OTP from "../models/OTP.js";        // Import OTP to send verification code
import bcrypt from "bcryptjs";

export const managerSignup = async (req, res) => {
  try {
    const { fullName, email, phone, password, businessName, description, location, contactEmail } = req.body;

    // 1. Normalize identifiers (matches authController logic)
    const normalizedEmail = email?.toLowerCase().trim();
    const normalizedPhone = phone?.toString().trim().replace(/\s+/g, "").replace(/^\+251/, "0");

    // 2. Check if user already exists in the unified User table
    const exists = await User.findOne({ 
      $or: [{ email: normalizedEmail }, { phone: normalizedPhone }] 
    });

    if (exists) {
      return res.status(400).json({ success: false, message: "Manager already exists with this email or phone." });
    }

    // 3. Hash password (using 12 rounds to match authController)
    const hashedPass = await bcrypt.hash(password, 12);

    // 4. Create Manager within the User model
    const manager = await User.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash: hashedPass, // Matches the UserSchema field name
      role: "camp_manager",     // Hardcoded role for this controller
      isVerified: false,
      isActive: true,
      businessInfo: {
        businessName,
        description,
        location,
        contactEmail,
        status: "pending",
        // Handling file uploads from multer
        govId: req.files?.govId?.[0]?.filename || null,
        businessLicense: req.files?.businessLicense?.[0]?.filename || null,
      },
    });

    // 5. Generate and store OTP (so the user can actually verify)
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.create({
      target: normalizedPhone || normalizedEmail,
      code,
      type: "verification",
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins expiry
    });

    // Note: You can trigger your SMS/Email utility here as you did in authController

    res.status(201).json({
      success: true,
      message: "Signup successful. OTP sent.",
      userId: manager._id, // Changed from managerId for consistency
    });

  } catch (err) {
    console.error("Manager Signup Error:", err);
    res.status(500).json({ success: false, message: "Server error during registration" });
  }
};