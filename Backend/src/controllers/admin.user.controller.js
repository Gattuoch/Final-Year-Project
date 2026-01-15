import User from "../models/User.model.js";
import bcrypt from "bcryptjs";

/* RESET PASSWORD */
export const resetPassword = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const tempPassword = Math.random().toString(36).slice(-8);
  user.passwordHash = await bcrypt.hash(tempPassword, 10);
  await user.save();

  console.log("TEMP PASSWORD:", tempPassword); // send via email
  res.json({ message: "Password reset successful" });
};

/* TOGGLE PREMIUM */
export const togglePremium = async (req, res) => {
  const user = await User.findById(req.params.id);
  user.isPremium = !user.isPremium;
  await user.save();
  res.json({ isPremium: user.isPremium });
};

/* BAN / UNBAN */
export const toggleBan = async (req, res) => {
  const user = await User.findById(req.params.id);
  // If user has legacy role values, normalize them before any save
  if (user.role === "user") user.role = "camper";
  if (user.role === "admin") user.role = "system_admin";

  if (user.role === "super_admin") {
    return res.status(400).json({ message: "Cannot ban Super Admin" });
  }
  user.isBanned = !user.isBanned;
  await user.save();
  res.json({ isBanned: user.isBanned });
};

/* UPDATE USER */
export const updateUser = async (req, res) => {
  let { fullName, role } = req.body;

  // Map legacy/frontend role values to internal enum values
  if (role === "user") role = "camper";
  if (role === "admin") role = "system_admin";

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { fullName, role },
    { new: true, runValidators: true }
  );
  res.json(user);
};

/* DELETE USER */
export const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user.role === "super_admin") {
    return res.status(400).json({ message: "Cannot delete Super Admin" });
  }
  await user.deleteOne();
  res.json({ message: "User deleted" });
};

/* INVALIDATE TEMPORARY PASSWORD */
export const invalidateTempPassword = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  // Generate a random password that will replace the temporary password.
  // This effectively invalidates the previously generated temporary password.
  const random = Math.random().toString(36).slice(-12);
  user.passwordHash = await bcrypt.hash(random, 10);
  await user.save();

  // NOTE: For security, we don't return the generated password in the response.
  // An admin may choose to notify the user via email or have the user request a reset.
  res.json({ message: "Temporary password invalidated" });
};
