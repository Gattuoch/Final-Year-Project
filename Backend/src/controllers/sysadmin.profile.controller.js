import User from "../models/User.model.js";
import AuditLog from "../models/AuditLog.model.js";
import bcrypt from "bcryptjs";
import { validatePasswordAgainstPolicy } from "../utils/passwordValidator.js";

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, position, department, location, bio, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (avatar) user.avatar = avatar;
    
    user.fullName = `${user.firstName} ${user.lastName}`.trim();

    // Store admin-specific fields in metadata
    user.metadata = {
      ...user.metadata,
      position: position || user.metadata?.position,
      department: department || user.metadata?.department,
      location: location || user.metadata?.location,
      bio: bio || user.metadata?.bio
    };

    await user.save();

    // Log the action
    await AuditLog.create({
      actor: user._id,
      action: "Profile Updated",
      details: "Updated personal information",
      status: "success"
    });

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Security
export const updateSecurity = async (req, res) => {
  try {
    const { currentPassword, newPassword, twoFactorAuth } = req.body;
    const user = await User.findById(req.user._id).select("+passwordHash");

    if (!user) return res.status(404).json({ message: "User not found" });

    // Handle Password Change
    if (currentPassword && newPassword) {
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
      }

      // Dynamic Password Policy Validation
      const { isValid, message: policyMessage } = await validatePasswordAgainstPolicy(newPassword);
      if (!isValid) {
        return res.status(400).json({ message: policyMessage });
      }

      user.passwordHash = newPassword;
      await user.save();
      
      await AuditLog.create({
        actor: user._id,
        action: "Password Changed",
        details: "User changed their password",
        status: "success"
      });
    }

    // Handle MFA Toggle
    if (typeof twoFactorAuth !== 'undefined') {
      user.metadata = { ...user.metadata, twoFactorAuth };
      await user.save();
      
      await AuditLog.create({
        actor: user._id,
        action: "MFA Toggled",
        details: `Two-factor authentication ${twoFactorAuth ? 'enabled' : 'disabled'}`,
        status: "success"
      });
    }

    res.json({ message: "Security settings updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update Preferences
export const updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.metadata = {
      ...user.metadata,
      preferences: {
        ...user.metadata?.preferences,
        ...preferences
      }
    };

    await user.save();

    await AuditLog.create({
      actor: user._id,
      action: "Preferences Updated",
      details: "Updated notification and session preferences",
      status: "success"
    });

    res.json({ message: "Preferences updated successfully", preferences: user.metadata.preferences });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get Activity Log
export const getActivityLog = async (req, res) => {
  try {
    const logs = await AuditLog.find({ actor: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    
    // Map to match frontend expectations if necessary
    const formattedLogs = logs.map(log => ({
      id: log._id,
      action: log.action,
      details: log.details || log.metadata?.details || "No details provided",
      timestamp: log.createdAt,
      status: log.status || "success"
    }));

    res.json(formattedLogs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
